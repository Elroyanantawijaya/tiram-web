// js/models/panggung-komponen.js — panggung 3D untuk S5: satu scene berisi
// kelima model komponen, hanya satu yang tampak pada satu waktu.
//
// Geometrinya sendiri ada di komponen.js dan tidak disentuh di sini. Berkas ini
// hanya mengurus lapisan yang §5 minta ditingkatkan: lingkungan PBR, tone
// mapping, bayangan kontak, dan kontrol orbit.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PEMBANGUN } from './komponen.js';
import { aturDetail } from './bahan.js';
import { kurangiGerak } from '../dom.js';

/** Bayangan kontak: gradien radial, jauh lebih murah daripada peta bayangan. */
function teksturBayangan() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const x = cv.getContext('2d');
  const g = x.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.18)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}

export function bangunPanggungKomponen({ mutuRendah = false, renderer } = {}) {
  // §2: segmen silinder disederhanakan di layar kecil.
  aturDetail(mutuRendah ? 0.45 : 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);

  // --- lingkungan PBR (§5) ---
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = env.texture;

  const kunci = new THREE.DirectionalLight(0xffffff, 1.5);
  kunci.position.set(6, 11, 8);
  scene.add(kunci);
  const isi = new THREE.DirectionalLight(0x88aaff, 0.35);
  isi.position.set(-8, 5, -6);
  scene.add(isi);
  scene.add(new THREE.HemisphereLight(0xcfe4ff, 0x141c24, 0.35));

  // --- model, satu grup per komponen ---
  const bayangTex = teksturBayangan();
  const model = {};
  // Posisi asli tiap mesh, dipakai tampilan urai. Disimpan sekali di sini
  // supaya urai selalu berangkat dari keadaan terpasang, bukan menumpuk.
  const asal = new Map();
  for (const [id, bangun] of Object.entries(PEMBANGUN)) {
    const grup = new THREE.Group();
    const mesh = bangun();
    grup.add(mesh);

    // Arah urai: dari pusat kotak batas model ke pusat tiap bagian. Bagian yang
    // persis di sumbu (mis. poros pengaduk) diberi arah ke atas supaya ia tetap
    // ikut terurai alih-alih diam di tempat.
    const kotakModel = new THREE.Box3().setFromObject(mesh);
    const pusat = kotakModel.getCenter(new THREE.Vector3());
    for (const anak of mesh.children) {
      const kotakAnak = new THREE.Box3().setFromObject(anak);
      const pusatAnak = kotakAnak.getCenter(new THREE.Vector3());
      const arahUrai = pusatAnak.clone().sub(pusat);
      if (arahUrai.lengthSq() < 1e-6) arahUrai.set(0, 1, 0);
      else arahUrai.normalize();
      asal.set(anak, { posisi: anak.position.clone(), arah: arahUrai });
    }

    // Bayangan kontak diletakkan di dasar kotak batas model itu sendiri.
    const kotak = new THREE.Box3().setFromObject(mesh);
    const lebar = Math.max(kotak.max.x - kotak.min.x, kotak.max.z - kotak.min.z) * 1.9;
    const bayang = new THREE.Mesh(
      new THREE.PlaneGeometry(lebar, lebar),
      new THREE.MeshBasicMaterial({ map: bayangTex, transparent: true, depthWrite: false })
    );
    bayang.rotation.x = -Math.PI / 2;
    bayang.position.set((kotak.min.x + kotak.max.x) / 2, kotak.min.y + 0.01, (kotak.min.z + kotak.max.z) / 2);
    grup.add(bayang);

    grup.visible = false;
    grup.userData = mesh.userData;
    scene.add(grup);
    model[id] = grup;
  }

  // --- kontrol orbit ---
  const kontrol = new OrbitControls(camera, renderer.domElement);
  kontrol.enableDamping = true;
  kontrol.dampingFactor = 0.06;
  kontrol.enablePan = false;
  kontrol.maxPolarAngle = Math.PI * 0.52;   // jangan menembus lantai
  kontrol.autoRotateSpeed = 0.7;
  // Satu jari tetap untuk menggulir halaman; putar pakai dua jari. Tanpa ini
  // OrbitControls memasang touch-action:none dan merebut gestur scroll di panel
  // sticky, yang melanggar §6.
  kontrol.touches = { ONE: null, TWO: THREE.TOUCH.DOLLY_ROTATE };
  renderer.domElement.style.touchAction = 'pan-y';

  let disentuh = false;
  kontrol.addEventListener('start', () => { disentuh = true; kontrol.autoRotate = false; });

  let aktifId = null;

  /* --- tampilan urai --- */
  // Nilai 0 = terpasang, 1 = terurai penuh. Dianimasikan lembut di perbarui().
  let uraiTarget = 0;
  let uraiKini = 0;
  const JARAK_URAI = 1.5;

  function terapkanUrai() {
    if (!aktifId) return;
    for (const anak of model[aktifId].children[0].children) {
      const a = asal.get(anak);
      if (!a) continue;
      anak.position.copy(a.posisi).addScaledVector(a.arah, uraiKini * JARAK_URAI);
    }
  }

  /* --- potongan melintang --- */
  // Bidang potong dipasang di renderer (global), bukan di material, sebab
  // material di bahan.js dipakai bersama oleh S6 dan S7 — memasangnya di
  // material akan ikut memotong rakitan dan sinema. Dibersihkan lagi di
  // nonaktifkan() supaya tidak bocor ke section lain.
  const bidangPotong = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
  let memotong = false;

  function terapkanPotong() {
    renderer.localClippingEnabled = false;
    renderer.clippingPlanes = memotong ? [bidangPotong] : [];
  }

  function bidik(id, langsung) {
    const u = model[id].userData;
    const jarak = u.dist;
    kontrol.minDistance = jarak * 0.45;
    kontrol.maxDistance = jarak * 2.2;

    const arah = new THREE.Vector3(Math.sin(0.9), 0.62, Math.cos(0.9)).normalize();
    const posBaru = u.focus.clone().addScaledVector(arah, jarak);

    if (langsung || kurangiGerak()) {
      camera.position.copy(posBaru);
      kontrol.target.copy(u.focus);
      kontrol.update();
      return;
    }
    // gsap tidak dipakai di sini supaya modul model tidak bergantung padanya;
    // interpolasi sederhana sudah cukup untuk perpindahan antar komponen.
    peralihan = { dari: camera.position.clone(), ke: posBaru, dariT: kontrol.target.clone(), keT: u.focus.clone(), t: 0 };
  }

  let peralihan = null;

  return {
    scene,
    camera,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.05,

    tampilkan(id) {
      if (!model[id] || aktifId === id) return;
      const pertama = aktifId === null;
      // Komponen yang ditinggalkan dikembalikan ke keadaan terpasang, kalau
      // tidak ia tetap terurai saat pembaca kembali ke sana nanti.
      if (aktifId) {
        uraiKini = 0;
        terapkanUrai();
        model[aktifId].visible = false;
      }
      aktifId = id;
      uraiTarget = 0;
      uraiKini = 0;
      model[id].visible = true;
      terapkanUrai();
      if (!disentuh) kontrol.autoRotate = !kurangiGerak();
      bidik(id, pertama);
    },

    /** @param {boolean} nyala */
    setUrai(nyala) {
      uraiTarget = nyala ? 1 : 0;
      if (kurangiGerak()) { uraiKini = uraiTarget; terapkanUrai(); }
    },
    get urai() { return uraiTarget > 0.5; },

    setPotong(nyala) { memotong = nyala; terapkanPotong(); },
    get potong() { return memotong; },

    /** Titik jangkar anotasi komponen aktif, dalam koordinat dunia. */
    get idAktif() { return aktifId; },

    aktifkan() { kontrol.enabled = true; terapkanPotong(); },
    nonaktifkan() {
      kontrol.enabled = false;
      // Bidang potong dilepas begitu S5 tidak aktif — renderer-nya dipakai
      // bersama seluruh halaman.
      renderer.clippingPlanes = [];
    },

    perbarui(dt) {
      if (peralihan) {
        peralihan.t = Math.min(1, peralihan.t + dt * 1.8);
        const e = 1 - Math.pow(1 - peralihan.t, 3);
        camera.position.lerpVectors(peralihan.dari, peralihan.ke, e);
        kontrol.target.lerpVectors(peralihan.dariT, peralihan.keT, e);
        if (peralihan.t >= 1) peralihan = null;
      }
      if (Math.abs(uraiKini - uraiTarget) > 0.001) {
        uraiKini += (uraiTarget - uraiKini) * Math.min(1, dt * 4.5);
        terapkanUrai();
      }
      kontrol.autoRotate = !disentuh && !kurangiGerak();
      kontrol.update();
    },

    bersihkan() {
      kontrol.dispose();
      pmrem.dispose();
      env.texture.dispose();
    },
  };
}
