// js/models/kip-hero.js — latar hero: siluet Kapal Isap Produksi di cakrawala
// senja, laut gelap dengan riak berbasis shader, dan kabut tipis.
// Geometri dibuat dari primitif sederhana bergaya siluet — bukan model detail,
// dan bukan port dari bAssembly (itu jatah S5/S6).

import * as THREE from 'three';

// Token warna §3.1
const ABISAL = 0x071016;
const LAMBUNG = 0x0f1d26;
const GARIS = 0x1e3340;
const BAJA = 0xc9d6dd;
const MONASIT = 0x8c4a2f;

const LANGIT_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Gradien vertikal: gelap di atas, semburat senja tipis tepat di atas cakrawala.
const LANGIT_FRAG = /* glsl */ `
  uniform vec3 uAtas;
  uniform vec3 uTengah;
  uniform vec3 uSenja;
  varying vec2 vUv;
  void main() {
    float y = vUv.y;
    // Garis cakrawala jatuh di sekitar uv.y = 0.42 pada bidang ini; pita senja
    // harus duduk tepat di atasnya, kalau tidak ia tertutup bidang laut.
    vec3 c = mix(uTengah, uAtas, smoothstep(0.44, 1.0, y));
    float pita = exp(-pow((y - 0.47) / 0.115, 2.0));
    c = mix(c, uSenja, pita * 0.72);
    gl_FragColor = vec4(c, 1.0);
  }
`;

const LAUT_VERT = /* glsl */ `
  uniform float uWaktu;
  varying float vPuncak;
  varying float vJarak;
  void main() {
    vec3 p = position;
    float h = sin(p.x * 0.055 + uWaktu * 0.45) * 1.05
            + sin(p.y * 0.098 - uWaktu * 0.33) * 0.62
            + sin((p.x + p.y) * 0.037 + uWaktu * 0.21) * 1.25;
    p.z += h;
    vPuncak = smoothstep(1.35, 2.55, h);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vJarak = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

// Kilau garis hanya pada puncak gelombang; kejauhan dilebur ke warna kabut.
const LAUT_FRAG = /* glsl */ `
  uniform vec3 uDalam;
  uniform vec3 uKilau;
  uniform vec3 uKabut;
  varying float vPuncak;
  varying float vJarak;
  void main() {
    vec3 c = mix(uDalam, uKilau, vPuncak * 0.5);
    float jauh = smoothstep(60.0, 260.0, vJarak);
    c = mix(c, uKabut, jauh);
    gl_FragColor = vec4(c, 1.0);
  }
`;

const KABUT_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Memudar ke nol di keempat tepi — tanpa ini pita kabut terbaca sebagai kotak.
const KABUT_FRAG = /* glsl */ `
  uniform vec3 uWarna;
  uniform float uPekat;
  varying vec2 vUv;
  void main() {
    float x = smoothstep(0.0, 0.34, vUv.x) * smoothstep(1.0, 0.66, vUv.x);
    float y = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    gl_FragColor = vec4(uWarna, uPekat * x * y);
  }
`;

/** Siluet KIP: lambung memanjang, menara, dan rangkaian tangga ladder. */
function bangunSiluet(bahan) {
  const g = new THREE.Group();
  const kotak = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bahan);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };

  // Lambung memanjang + bangunan geladak
  kotak(78, 7.5, 16, 0, 3.6, 0);
  kotak(30, 5.2, 13, -12, 9.4, 0);

  // Menara utama dan cerobong
  kotak(9, 20, 8, -6, 21, 0);
  kotak(5.5, 9, 5.5, -6, 34.5, 0);
  kotak(3.4, 12, 3.4, 8, 17.5, 0);

  // Tiang-tiang tipis
  for (const x of [-24, 16, 26]) kotak(1.1, 14, 1.1, x, 14, 0);

  // Rangkaian tangga ladder — turun miring dari haluan ke air
  const ladder = new THREE.Mesh(new THREE.BoxGeometry(46, 3.2, 4.2), bahan);
  ladder.position.set(45, -2.5, 0);
  ladder.rotation.z = -0.42;
  g.add(ladder);
  kotak(6, 9, 6, 26, 9, 0);

  // Gantry penyangga ladder
  const kabel = new THREE.Mesh(new THREE.BoxGeometry(30, 0.5, 0.5), bahan);
  kabel.position.set(20, 20, 0);
  kabel.rotation.z = -0.45;
  g.add(kabel);

  return g;
}

export function bangunHeroKip({ mutuRendah = false } = {}) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 16 / 9, 1, 1200);
  // Kamera sengaja sedikit menunduk supaya garis cakrawala jatuh di sekitar 36%
  // dari tepi atas bingkai. Hero bisa lebih tinggi dari satu layar di ponsel;
  // dengan begini cakrawala dan siluet KIP tetap terlihat tanpa perlu menggulir.
  const SASARAN = new THREE.Vector3(0, 2, -170);
  camera.position.set(0, 26, 66);
  camera.lookAt(SASARAN);

  const warnaKabut = new THREE.Color(LAMBUNG).lerp(new THREE.Color(MONASIT), 0.22);

  // --- Langit ---
  const langit = new THREE.Mesh(
    new THREE.PlaneGeometry(1400, 460),
    new THREE.ShaderMaterial({
      vertexShader: LANGIT_VERT,
      fragmentShader: LANGIT_FRAG,
      depthWrite: false,
      uniforms: {
        uAtas: { value: new THREE.Color(ABISAL) },
        uTengah: { value: new THREE.Color(LAMBUNG) },
        uSenja: { value: new THREE.Color(MONASIT) },
      },
    })
  );
  langit.position.set(0, 78, -360);
  scene.add(langit);

  // --- Laut ---
  const seg = mutuRendah ? 48 : 140;
  const bahanLaut = new THREE.ShaderMaterial({
    vertexShader: LAUT_VERT,
    fragmentShader: LAUT_FRAG,
    uniforms: {
      uWaktu: { value: 0 },
      uDalam: { value: new THREE.Color(ABISAL) },
      uKilau: { value: new THREE.Color(BAJA).multiplyScalar(0.42) },
      uKabut: { value: warnaKabut },
    },
  });
  const laut = new THREE.Mesh(new THREE.PlaneGeometry(760, 460, seg, seg), bahanLaut);
  laut.rotation.x = -Math.PI / 2;
  laut.position.set(0, 0, -120);
  scene.add(laut);

  // --- Siluet KIP ---
  const bahanSiluet = new THREE.MeshBasicMaterial({ color: new THREE.Color(GARIS).multiplyScalar(0.5) });
  const kip = bangunSiluet(bahanSiluet);
  kip.position.set(0, 1, -178);
  scene.add(kip);

  // Lebar bingkai berubah drastis antara ponsel potret dan desktop lebar.
  // Skala dan posisi siluet disesuaikan agar kapal selalu utuh di dalam bingkai
  // dan selalu di paruh kanan — blok teks hero rata kiri.
  const JARAK_KIP = 244;      // jarak kamera ke bidang kapal
  const LEBAR_LOKAL = 106;    // rentang x geometri kapal, termasuk ladder yang menjulur
  const PUSAT_LOKAL = 14;     // titik tengah geometri itu
  function tataKip(aspek) {
    const separuhLebar = Math.tan(THREE.MathUtils.degToRad(21)) * JARAK_KIP * aspek;
    const skala = Math.min(1.35, Math.max(0.55, (1.15 * separuhLebar) / LEBAR_LOKAL));
    kip.scale.setScalar(skala);
    kip.position.x = separuhLebar * 0.33 - PUSAT_LOKAL * skala;
  }
  tataKip(camera.aspect);

  // --- Kabut volumetrik tipis: pita mendatar yang memudar di semua tepinya,
  //     supaya terbaca sebagai kabut dan bukan sebagai persegi panjang. ---
  const kabut = new THREE.Group();
  const pita = mutuRendah ? 2 : 4;
  for (let i = 0; i < pita; i++) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 26 + i * 14),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uWarna: { value: warnaKabut },
          uPekat: { value: 0.15 - i * 0.025 },
        },
        vertexShader: KABUT_VERT,
        fragmentShader: KABUT_FRAG,
      })
    );
    m.position.set(0, 4 + i * 7, -200 - i * 34);
    kabut.add(m);
  }
  scene.add(kabut);

  // --- Parallax kursor beramplitudo kecil ---
  const penunjuk = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const asalKamera = camera.position.clone();

  const gerakPenunjuk = (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener('pointermove', gerakPenunjuk, { passive: true });

  return {
    scene,
    camera,
    ukurUlang(w, h) {
      if (h > 0) tataKip(w / h);
    },
    perbarui(dt) {
      bahanLaut.uniforms.uWaktu.value += dt;
      // dt = 0 saat prefers-reduced-motion, sehingga parallax ikut diam.
      const k = dt > 0 ? Math.min(1, dt * 2.2) : 0;
      penunjuk.x += (target.x - penunjuk.x) * k;
      penunjuk.y += (target.y - penunjuk.y) * k;
      camera.position.x = asalKamera.x + penunjuk.x * 3.4;
      camera.position.y = asalKamera.y - penunjuk.y * 1.6;
      camera.lookAt(SASARAN);
    },
    bersihkan() {
      window.removeEventListener('pointermove', gerakPenunjuk);
    },
  };
}

/** Padanan diam bila WebGL gagal — siluet SVG sederhana, bukan layar kosong. */
export function fallbackHeroSvg() {
  return `
    <svg viewBox="0 0 800 340" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="langit-fallback" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#071016"/>
          <stop offset="62%" stop-color="#0F1D26"/>
          <stop offset="78%" stop-color="#3B2A25"/>
          <stop offset="100%" stop-color="#071016"/>
        </linearGradient>
      </defs>
      <rect width="800" height="340" fill="url(#langit-fallback)"/>
      <g fill="#16242E">
        <rect x="150" y="228" width="300" height="26"/>
        <rect x="180" y="208" width="120" height="22"/>
        <rect x="212" y="160" width="34" height="50"/>
        <rect x="222" y="140" width="18" height="24"/>
        <rect x="330" y="176" width="13" height="34"/>
        <rect x="120" y="186" width="5" height="44"/>
        <rect x="392" y="186" width="5" height="44"/>
        <path d="M440 232 L556 286 L546 300 L430 246 Z"/>
      </g>
      <g stroke="#1E3340" stroke-width="1.5" opacity="0.7">
        <path d="M0 268 Q 200 262 400 268 T 800 268" fill="none"/>
        <path d="M0 288 Q 220 282 440 288 T 800 288" fill="none"/>
        <path d="M0 310 Q 180 304 380 310 T 800 310" fill="none"/>
      </g>
    </svg>`;
}
