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
  for (const [id, bangun] of Object.entries(PEMBANGUN)) {
    const grup = new THREE.Group();
    const mesh = bangun();
    grup.add(mesh);

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
      if (aktifId) model[aktifId].visible = false;
      aktifId = id;
      model[id].visible = true;
      if (!disentuh) kontrol.autoRotate = !kurangiGerak();
      bidik(id, pertama);
    },

    aktifkan() { kontrol.enabled = true; },
    nonaktifkan() { kontrol.enabled = false; },

    perbarui(dt) {
      if (peralihan) {
        peralihan.t = Math.min(1, peralihan.t + dt * 1.8);
        const e = 1 - Math.pow(1 - peralihan.t, 3);
        camera.position.lerpVectors(peralihan.dari, peralihan.ke, e);
        kontrol.target.lerpVectors(peralihan.dariT, peralihan.keT, e);
        if (peralihan.t >= 1) peralihan = null;
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
