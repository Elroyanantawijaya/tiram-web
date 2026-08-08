// js/models/panggung-rakitan.js — panggung 3D S6: rakitan di atas dek KIP.
//
// Mengurus kamera, kontrol orbit, sorot jalur aliran, mode X-ray, dan dua
// keadaan bidikan. Geometrinya sendiri ada di rakitan.js.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { bangunRakitan, KAPAL } from './rakitan.js';
import { aturDetail } from './bahan.js';
import { kurangiGerak } from '../dom.js';

const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();

const JALUR = ['umpan', 'konsentrat', 'buangan'];
const TOKEN = { umpan: 'magnet', konsentrat: 'monasit', buangan: 'sedimen' };

export function bangunPanggungRakitan({ mutuRendah = false, renderer } = {}) {
  aturDetail(mutuRendah ? 0.45 : 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 3000);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = env.texture;
  scene.fog = new THREE.Fog(0x071016, 260, 900);

  const kunci = new THREE.DirectionalLight(0xffffff, 1.6);
  kunci.position.set(60, 90, 50);
  scene.add(kunci);
  const isi = new THREE.DirectionalLight(0x88aaff, 0.4);
  isi.position.set(-70, 40, -50);
  scene.add(isi);
  scene.add(new THREE.HemisphereLight(0xcfe4ff, 0x0a141c, 0.5));

  const rakitan = bangunRakitan();
  scene.add(rakitan.akar);
  rakitan.akar.updateMatrixWorld(true);

  /* -------------------------------------------------- partikel aliran */

  // Partikel menyusuri polyline pipa. Titik lintasan disimpan dalam satuan
  // modul, jadi diubah ke koordinat dunia lebih dulu.
  const aliran = {};
  for (const nama of JALUR) {
    const ruas = rakitan.lintasan[nama].map((titik) =>
      titik.map((t) => rakitan.modul.localToWorld(t.clone()))
    );
    const kurva = ruas.map((titik) => new THREE.CatmullRomCurve3(titik, false, 'catmullrom', 0.1));
    const jumlah = mutuRendah ? 16 : 46;
    const posisi = new Float32Array(jumlah * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posisi, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(warna(TOKEN[nama])),
      size: 0.85, transparent: true, opacity: 0.95, depthWrite: false,
    });
    const titikMesh = new THREE.Points(geo, mat);
    titikMesh.frustumCulled = false;
    scene.add(titikMesh);
    aliran[nama] = {
      mesh: titikMesh, kurva, posisi, jumlah,
      maju: Array.from({ length: jumlah }, () => Math.random()),
    };
  }

  /* ------------------------------------------------------- sorot jalur */

  const asli = new Map();   // material → {opacity, transparent, color}
  const simpan = (m) => {
    if (!asli.has(m)) asli.set(m, { opacity: m.opacity, transparent: m.transparent, warna: m.color.clone() });
  };

  function aturSorot(mode) {
    // mode: null (seluruh aliran) atau nama jalur
    for (const nama of JALUR) {
      const aktif = mode === null || mode === nama;
      rakitan.jalur[nama].traverse((o) => {
        if (!o.isMesh) return;
        simpan(o.material);
        o.material.transparent = true;
        o.material.opacity = aktif ? 1 : 0.12;
        o.material.color.copy(aktif ? asli.get(o.material).warna : new THREE.Color(0x6a7580));
      });
      aliran[nama].mesh.visible = aktif;
    }
  }

  /* ------------------------------------------------------------ X-ray */

  let xray = false;
  function aturXray(nyala) {
    xray = nyala;
    rakitan.modul.traverse((o) => {
      if (!o.isMesh || !o.userData.selubung) return;
      simpan(o.material);
      o.material.transparent = true;
      o.material.opacity = nyala ? 0.18 : asli.get(o.material).opacity;
      o.material.wireframe = nyala;
      o.material.depthWrite = !nyala;
    });
  }

  /* ------------------------------------------------------------ kamera */

  const kontrol = new OrbitControls(camera, renderer.domElement);
  kontrol.enableDamping = true;
  kontrol.dampingFactor = 0.06;
  kontrol.enablePan = false;
  kontrol.maxPolarAngle = Math.PI * 0.49;
  kontrol.minDistance = 12;
  kontrol.maxDistance = 420;
  kontrol.touches = { ONE: null, TWO: THREE.TOUCH.DOLLY_ROTATE };
  renderer.domElement.style.touchAction = 'pan-y';

  const pusatModul = new THREE.Vector3();
  new THREE.Box3().setFromObject(rakitan.modul).getCenter(pusatModul);

  const BIDIKAN = {
    dekat: { target: pusatModul.clone(), jarak: 34, azimut: 0.75, elevasi: 0.95 },
    lebar: { target: new THREE.Vector3(0, 0, 0), jarak: 190, azimut: 0.9, elevasi: 1.02 },
  };

  let peralihan = null;

  function posisiDari(b) {
    const s = Math.sin(b.elevasi), c = Math.cos(b.elevasi);
    return new THREE.Vector3(
      b.target.x + b.jarak * s * Math.cos(b.azimut),
      b.target.y + b.jarak * c,
      b.target.z + b.jarak * s * Math.sin(b.azimut)
    );
  }

  function terbangKe(target, jarak, langsung = false) {
    const arah = camera.position.clone().sub(kontrol.target).normalize();
    const ke = target.clone().addScaledVector(arah, jarak);
    if (langsung || kurangiGerak()) {
      camera.position.copy(ke);
      kontrol.target.copy(target);
      kontrol.update();
      return;
    }
    peralihan = { dari: camera.position.clone(), ke, dariT: kontrol.target.clone(), keT: target.clone(), t: 0 };
  }

  function bidikan(nama, langsung = false) {
    const b = BIDIKAN[nama];
    if (!b) return;
    const ke = posisiDari(b);
    if (langsung || kurangiGerak()) {
      camera.position.copy(ke);
      kontrol.target.copy(b.target);
      kontrol.update();
      return;
    }
    peralihan = { dari: camera.position.clone(), ke, dariT: kontrol.target.clone(), keT: b.target.clone(), t: 0 };
  }

  bidikan('dekat', true);
  aturSorot(null);

  /* ------------------------------------------------------------ publik */

  return {
    scene,
    camera,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.05,
    rakitan,

    /** Titik jangkar penanda bernomor dalam koordinat dunia. */
    penanda() {
      rakitan.akar.updateMatrixWorld(true);
      return rakitan.penanda.map((p) => ({
        id: p.id, nomor: p.nomor, dunia: rakitan.modul.localToWorld(p.pos.clone()),
      }));
    },

    /** Terbang ke satu komponen dan bingkai dari dekat. */
    keKomponen(id) {
      const grup = rakitan.komponen[id];
      if (!grup) return;
      const kotak = new THREE.Box3().setFromObject(grup);
      const pusat = kotak.getCenter(new THREE.Vector3());
      const ukuran = kotak.getSize(new THREE.Vector3()).length();
      terbangKe(pusat, Math.max(9, ukuran * 2.4));
    },

    bidikan,
    aturSorot,
    aturXray,
    get xrayNyala() { return xray; },

    aktifkan() { kontrol.enabled = true; },
    nonaktifkan() { kontrol.enabled = false; },

    perbarui(dt) {
      if (peralihan) {
        peralihan.t = Math.min(1, peralihan.t + dt * 1.1);
        const e = 1 - Math.pow(1 - peralihan.t, 3);
        camera.position.lerpVectors(peralihan.dari, peralihan.ke, e);
        kontrol.target.lerpVectors(peralihan.dariT, peralihan.keT, e);
        if (peralihan.t >= 1) peralihan = null;
      }

      // Partikel menyusuri lintasan pipa.
      for (const nama of JALUR) {
        const a = aliran[nama];
        if (!a.mesh.visible) continue;
        const perRuas = Math.max(1, Math.floor(a.jumlah / a.kurva.length));
        for (let i = 0; i < a.jumlah; i++) {
          a.maju[i] = (a.maju[i] + dt * 0.22) % 1;
          const ruas = a.kurva[Math.min(a.kurva.length - 1, Math.floor(i / perRuas))];
          const p = ruas.getPoint(a.maju[i]);
          a.posisi[i * 3] = p.x; a.posisi[i * 3 + 1] = p.y; a.posisi[i * 3 + 2] = p.z;
        }
        a.mesh.geometry.attributes.position.needsUpdate = true;
      }

      kontrol.update();
    },

    bersihkan() {
      kontrol.dispose();
      pmrem.dispose();
      env.texture.dispose();
    },
  };
}

export { KAPAL };
