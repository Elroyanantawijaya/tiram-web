// js/models/panggung-sinema.js — panggung 3D S7: sekuens sinema 8 bab.
//
// Kamera dan seluruh efek visual adalah fungsi murni dari waktu global t —
// tidak ada keadaan yang diakumulasi antar-frame — supaya menggeser garis
// waktu ke titik mana pun selalu menghasilkan gambar yang persis sama dengan
// memutar maju sampai ke sana. Ini beda dari S6, yang kameranya bebas
// dikendalikan pengguna: di sini kamera sepenuhnya dituntun cerita, tidak ada
// OrbitControls sama sekali.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { bangunRakitan } from './rakitan.js';
import { aturDetail } from './bahan.js';
import { babPadaWaktu } from '../cinema.js';

const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();

/** Sampler titik sepanjang polyline dunia, diparametrikan 0..1 berdasar jarak tempuh. */
function buatSampler(titikDunia) {
  const jarak = [0];
  for (let i = 1; i < titikDunia.length; i++) {
    jarak.push(jarak[i - 1] + titikDunia[i].distanceTo(titikDunia[i - 1]));
  }
  const total = jarak[jarak.length - 1] || 1;
  return (t) => {
    const sasaran = Math.min(1, Math.max(0, t)) * total;
    let i = 1;
    while (i < jarak.length - 1 && jarak[i] < sasaran) i++;
    const a = jarak[i - 1], b = jarak[i];
    const lokal = b > a ? (sasaran - a) / (b - a) : 0;
    return new THREE.Vector3().lerpVectors(titikDunia[i - 1], titikDunia[i], lokal);
  };
}

function orbitDariJarak(target, jarak, azimut, elevasi) {
  const s = Math.sin(elevasi), c = Math.cos(elevasi);
  const pos = new THREE.Vector3(
    target.x + jarak * s * Math.cos(azimut),
    target.y + jarak * c,
    target.z + jarak * s * Math.sin(azimut)
  );
  return { pos, target };
}

/** Menempatkan n titik mengalir sepanjang sampler, murni fungsi dari t (aman di-scrub). */
function tempatkanMengalir(sampler, posArray, n, t, kecepatan) {
  for (let i = 0; i < n; i++) {
    const fase = ((t * kecepatan) + i / n) % 1;
    const p = sampler(fase < 0 ? fase + 1 : fase);
    posArray[i * 3] = p.x; posArray[i * 3 + 1] = p.y; posArray[i * 3 + 2] = p.z;
  }
}

export function bangunPanggungSinema({ mutuRendah = false, renderer, waktu, durasi } = {}) {
  aturDetail(mutuRendah ? 0.45 : 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.4, 3000);
  scene.fog = new THREE.Fog(0x071016, 200, 800);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = env.texture;

  const kunci = new THREE.DirectionalLight(0xffffff, 1.6);
  kunci.position.set(50, 80, 40);
  scene.add(kunci);
  const isi = new THREE.DirectionalLight(0x88aaff, 0.4);
  isi.position.set(-60, 40, -40);
  scene.add(isi);
  scene.add(new THREE.HemisphereLight(0xcfe4ff, 0x0a141c, 0.5));

  const rakitan = bangunRakitan();
  scene.add(rakitan.akar);
  rakitan.akar.updateMatrixWorld(true);

  const dunia = (v) => rakitan.modul.localToWorld(v.clone());
  const pusat = (id) => new THREE.Box3().setFromObject(rakitan.komponen[id]).getCenter(new THREE.Vector3());
  const C = { c1: pusat('c1'), c2: pusat('c2'), c3: pusat('c3'), c4: pusat('c4'), c5: pusat('c5') };
  const pusatModul = new THREE.Box3().setFromObject(rakitan.modul).getCenter(new THREE.Vector3());

  const flatten = (nama) => rakitan.lintasan[nama].flatMap((ruas) => ruas.map(dunia));
  const jalurUmpan = flatten('umpan');
  const jalurBuangan = flatten('buangan');
  const samplerUmpan = buatSampler(jalurUmpan);
  const samplerBuangan = buatSampler(jalurBuangan);
  const samplerKonsentrat = buatSampler(flatten('konsentrat'));

  /* -------------------------------------------------------------- partikel */

  function buatAliran(warnaToken, n) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(warna(warnaToken)), size: 0.55,
      transparent: true, opacity: 0, depthWrite: false,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    return { pts, pos, n, mat };
  }

  const N = mutuRendah ? 26 : 70;
  const alUmpan = buatAliran('magnet', N);
  const alKonsentrat = buatAliran('monasit', Math.round(N * 0.6));
  const alBuangan = buatAliran('sedimen', N);

  // Gelembung dalam pengkondisi (ch2): naik lalu lenyap, diulang.
  const NG = mutuRendah ? 8 : 18;
  const geoG = new THREE.BufferGeometry();
  const posG = new Float32Array(NG * 3);
  geoG.setAttribute('position', new THREE.BufferAttribute(posG, 3));
  const matG = new THREE.PointsMaterial({ color: new THREE.Color(warna('baja')), size: 0.28, transparent: true, opacity: 0, depthWrite: false });
  const gelembung = new THREE.Points(geoG, matG);
  gelembung.frustumCulled = false;
  scene.add(gelembung);

  /* ------------------------------------------- kulit yang dibuka tiap bab ---
     Tiap bab menyorot satu komponen dan membuka kulitnya selama beberapa detik,
     supaya yang terlihat bukan hanya kotak dari luar melainkan tailing yang
     benar-benar sedang diolah di dalamnya.

     Material di rakitan.js dipakai bersama lintas komponen — `steel` yang sama
     menyusun dinding tangki pengkondisi dan tabung pengganda foto di sensor.
     Tanpa salinan per mesh, membuka satu komponen ikut membuka empat lainnya. */

  const kulitKomponen = { c1: [], c2: [], c3: [], c4: [], c5: [] };
  for (const [id, grup] of Object.entries(rakitan.komponen)) {
    grup.traverse((o) => {
      if (!o.isMesh || !o.userData.selubung) return;
      o.material = o.material.clone();
      kulitKomponen[id].push({ mesh: o, opacityAsli: o.material.opacity });
    });
  }

  const OPASITAS_XRAY = 0.13;
  function terapkanXray(nilai) {
    for (const id of Object.keys(kulitKomponen)) {
      const v = nilai[id] ?? 0;
      const tembus = v > 0.002;
      for (const s of kulitKomponen[id]) {
        s.mesh.material.opacity = THREE.MathUtils.lerp(s.opacityAsli, OPASITAS_XRAY, v);
        s.mesh.material.transparent = tembus;
        s.mesh.material.depthWrite = !tembus;
        s.mesh.material.side = tembus ? THREE.DoubleSide : THREE.FrontSide;
      }
    }
  }

  /** Naik cepat di awal bab, bertahan, lalu turun lagi menjelang akhir. */
  const naikTurun = (p, masuk = 0.16, keluar = 0.86) =>
    Math.min(1, Math.max(0, p / masuk)) * (1 - Math.min(1, Math.max(0, (p - keluar) / (1 - keluar))));

  function xrayBab(indeks, progres) {
    const v = { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 };
    if (indeks === 1) v.c1 = naikTurun(progres);
    // Bab 2 dan 3 keduanya berlangsung di dalam WHIMS, jadi kulitnya dibuka di
    // bab 2 dan baru ditutup lagi di ujung bab 3, bukan berkedip di antaranya.
    else if (indeks === 2) v.c2 = Math.min(1, progres / 0.16);
    else if (indeks === 3) v.c2 = 1 - Math.min(1, Math.max(0, (progres - 0.86) / 0.14));
    else if (indeks === 4) v.c3 = naikTurun(progres);
    else if (indeks === 5) {
      v.c4 = naikTurun(progres, 0.16, 0.78);
      v.c5 = Math.max(0, (progres - 0.72) / 0.28);
    } else if (indeks === 6) v.c5 = Math.max(0, 1 - progres * 2.5);
    return v;
  }

  /* --------------------------------------------------------- objek bertanda */

  let kumparanKiri = null, kumparanKanan = null, selongsong = null, bunkerDalam = null;
  rakitan.modul.traverse((o) => {
    if (!o.isMesh) return;
    if (o.userData.kumparan && !kumparanKiri) kumparanKiri = o;
    else if (o.userData.kumparan) kumparanKanan = o;
    if (o.userData.selongsong) selongsong = o;
    if (o.userData.konsentratDalam) bunkerDalam = o;
  });
  for (const k of [kumparanKiri, kumparanKanan]) {
    k.material.emissive = new THREE.Color(warna('magnet'));
    k.material.emissiveIntensity = 0;
  }
  bunkerDalam.material.emissive = new THREE.Color(warna('gamma'));
  bunkerDalam.material.emissiveIntensity = 0;
  const skalaSelongsongAsli = selongsong.scale.clone();

  const gerbang = rakitan.jalur.buangan;   // grup pipa buangan, material sendiri (lihat rakitan.js)
  let matGerbang = null;
  gerbang.traverse((o) => { if (o.isMesh && !matGerbang) matGerbang = o.material; });
  const warnaGerbangAsli = matGerbang.color.clone();
  const warnaGerbangCek = new THREE.Color(warna('gamma'));

  /* ------------------------------------------- pengolahan di dalam alat ---
     Semua posisi di bawah tetap fungsi murni dari waktu t: tidak ada keadaan
     yang diakumulasi antar-frame, sehingga menggeser garis waktu ke titik mana
     pun tetap menghasilkan gambar yang sama persis. */

  const D = rakitan.dalam;
  const kotak = (o) => new THREE.Box3().setFromObject(o);

  // --- 1 · pengkondisi: ruang bubur dan baling yang berputar ---
  const ruangC1 = kotak(D.c1.isi);
  const balingTingkat = D.c1.baling.children;

  // --- 2 · WHIMS: butiran turun melewati matriks ---
  const kotakMatriks = kotak(D.c2.kanister);
  const pusatMatriks = kotakMatriks.getCenter(new THREE.Vector3());
  const setengahMatriks = kotakMatriks.getSize(new THREE.Vector3()).multiplyScalar(0.5);
  const ATAS_C2 = pusatMatriks.y + 0.95;
  const BAWAH_C2 = pusatMatriks.y - 0.95;

  // --- 3 · sensor: kolom bubur dan kristal yang dituju pulsa gamma ---
  const kotakKolom = kotak(D.c3.kolom);
  const pusatKristal = kotak(D.c3.kristal).getCenter(new THREE.Vector3());
  D.c3.kristal.material.emissive = new THREE.Color(warna('gamma'));
  D.c3.kristal.material.emissiveIntensity = 0;

  // --- 4 · katup: batang penjepit dan piston yang benar-benar bergerak ---
  const jepitAsal = D.c4.jepit.children.map((b) => b.position.y);
  const pistonAsal = D.c4.piston.position.y;
  const batangAsal = D.c4.batang.position.y;

  /** Awan titik sederhana dengan warna dari token CSS. */
  function buatTitik(warnaToken, n, ukuran) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(warna(warnaToken)), size: ukuran,
      transparent: true, opacity: 0, depthWrite: false, depthTest: false,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    return { pts, pos, n, mat };
  }

  const NM = mutuRendah ? 14 : 36;    // butir magnetik di dalam WHIMS
  const NN = mutuRendah ? 14 : 36;    // butir non-magnetik
  const NG3 = mutuRendah ? 6 : 14;    // pulsa gamma menuju kristal
  const dlmMag = buatTitik('monasit', NM, 0.3);
  const dlmNon = buatTitik('sedimen', NN, 0.26);
  const dlmGamma = buatTitik('gamma', NG3, 0.34);

  /**
   * Butiran di dalam WHIMS. `medan` 0..1 menentukan apakah butir magnetik
   * tertahan di matriks atau dilepas dan terbilas ke bawah.
   */
  function tempatkanDalamWhims(t, medan) {
    const acak = (i, k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
    for (let i = 0; i < NM; i++) {
      const fase = ((t * 0.34) + i / NM) % 1;
      const x = pusatMatriks.x + (acak(i, 1) - 0.5) * setengahMatriks.x * 1.6;
      const z = pusatMatriks.z + (acak(i, 2) - 0.5) * setengahMatriks.z * 1.4;
      let y = ATAS_C2 - fase * (ATAS_C2 - BAWAH_C2);
      // Selama medan menyala butir magnetik berhenti begitu menyentuh matriks;
      // begitu medan padam mereka meluncur turun lagi sebagai aliran tersendiri.
      const tertahan = Math.max(pusatMatriks.y, y);
      y = THREE.MathUtils.lerp(y, tertahan, medan);
      dlmMag.pos[i * 3] = x - (1 - medan) * 0.22;
      dlmMag.pos[i * 3 + 1] = y;
      dlmMag.pos[i * 3 + 2] = z;
    }
    dlmMag.pts.geometry.attributes.position.needsUpdate = true;

    for (let i = 0; i < NN; i++) {
      const fase = ((t * 0.42) + i / NN) % 1;
      dlmNon.pos[i * 3] = pusatMatriks.x + (acak(i, 3) - 0.5) * setengahMatriks.x * 1.6 + 0.22;
      dlmNon.pos[i * 3 + 1] = ATAS_C2 - fase * (ATAS_C2 - BAWAH_C2);
      dlmNon.pos[i * 3 + 2] = pusatMatriks.z + (acak(i, 4) - 0.5) * setengahMatriks.z * 1.4;
    }
    dlmNon.pts.geometry.attributes.position.needsUpdate = true;
  }

  /** Pulsa gamma dari kolom bubur menuju kristal NaI(Tl). */
  function tempatkanPulsaGamma(t) {
    for (let i = 0; i < NG3; i++) {
      const fase = ((t * 1.15) + i / NG3) % 1;
      const bagian = ((i * 0.618) % 1);
      const asal = new THREE.Vector3(
        (kotakKolom.min.x + kotakKolom.max.x) / 2,
        THREE.MathUtils.lerp(kotakKolom.min.y, kotakKolom.max.y, bagian),
        (kotakKolom.min.z + kotakKolom.max.z) / 2
      );
      const p = asal.lerp(pusatKristal, fase);
      dlmGamma.pos[i * 3] = p.x; dlmGamma.pos[i * 3 + 1] = p.y; dlmGamma.pos[i * 3 + 2] = p.z;
    }
    dlmGamma.pts.geometry.attributes.position.needsUpdate = true;
  }

  /* ----------------------------------------------------------------- babak */

  function kameraBab(indeks, halus) {
    switch (indeks) {
      case 0: {
        const target = samplerUmpan(halus * 0.94);
        return orbitDariJarak(target, 6.5, 0.35, 1.05);
      }
      // Jarak pada bab 1–5 dirapatkan dibanding versi sebelumnya: begitu kulit
      // dibuka, yang perlu terbaca adalah bagian dalam alat, dan dari jarak
      // lama isinya hanya tampak sebagai gumpalan kecil.
      case 1:
        return orbitDariJarak(C.c1, 5.4, 0.55 + halus * 0.12, 1.02);
      case 2:
        return orbitDariJarak(C.c2, 4.8, 0.85 + halus * 0.1, 0.98);
      case 3:
        return orbitDariJarak(C.c2, 5.2, 1.05 - halus * 0.15, 1.0);
      case 4:
        return orbitDariJarak(C.c3, 3.6, 1.15 + halus * 0.2, 0.92);
      case 5:
        // Azimut digeser ke sisi +z. Pada azimut lama kamera berdiri di sisi
        // yang sama dengan bunker, dan dari jarak sedekat ini dinding bunker
        // memenuhi separuh bingkai alih-alih katupnya yang terlihat.
        return orbitDariJarak(C.c4, 4.6, 1.75 + halus * 0.18, 1.02);
      case 6: {
        const target = samplerBuangan(0.55 + halus * 0.43);
        return orbitDariJarak(target, 8, 0.6, 1.02);
      }
      case 7: {
        const target = new THREE.Vector3().lerpVectors(pusatModul, new THREE.Vector3(0, 0, 0), halus);
        const jarak = THREE.MathUtils.lerp(28, 190, halus);
        return orbitDariJarak(target, jarak, 0.82, 1.0);
      }
      default:
        return orbitDariJarak(pusatModul, 34, 0.75, 0.95);
    }
  }

  /** Kurva lonceng 0..1..0 dipusatkan pada `pusat` (0..1), lebar `lebar`. */
  const lonceng = (x, pusatX, lebar) => Math.max(0, 1 - Math.pow((x - pusatX) / lebar, 2));

  // Kuat medan bab berjalan, dibaca lagi oleh penempatan butir di dalam WHIMS.
  let medanKini = 0;

  function efekBab(indeks, progres, halus) {
    /* --- kulit dibuka pada komponen yang sedang disorot --- */
    const xr = xrayBab(indeks, progres);
    terapkanXray(xr);

    // Butir di dalam WHIMS hanya tampak selama kulitnya terbuka; di luar itu ia
    // hanya akan mengambang menembus kotak yang pejal.
    dlmMag.mat.opacity = xr.c2 * 0.95;
    dlmNon.mat.opacity = xr.c2 * 0.8;
    dlmGamma.mat.opacity = xr.c3 * 0.95;
    D.c3.kristal.material.emissiveIntensity = xr.c3 * (0.4 + 0.6 * Math.sin(progres * Math.PI * 6) ** 2);

    // --- aliran umpan: penuh di bab 0, meredup selama bab 1 (penstabilan) ---
    const opUmpan = indeks === 0 ? 1 : indeks === 1 ? 1 - halus : indeks === 2 ? Math.max(0, 1 - progres * 2) : 0;
    alUmpan.mat.opacity = opUmpan * 0.9;

    // --- gelembung: muncul di bab 1 ---
    matG.opacity = (indeks === 1 ? Math.sin(progres * Math.PI) : 0) * 0.85;

    // --- medan WHIMS: menyala di bab 2, padam di bab 3 ---
    const medan = indeks === 2 ? halus : indeks === 3 ? 1 - halus : 0;
    kumparanKiri.material.emissiveIntensity = medan * 1.4;
    kumparanKanan.material.emissiveIntensity = medan * 1.4;
    medanKini = medan;

    // --- aliran konsentrat (magnetik → sensor → katup → bunker): bab 2–5 ---
    const opKonsentrat = indeks === 2 ? halus : (indeks >= 3 && indeks <= 5) ? 1 : indeks === 6 ? Math.max(0, 1 - progres * 3) : 0;
    alKonsentrat.mat.opacity = opKonsentrat * 0.95;

    // --- aliran buangan (non-magnetik + terverifikasi → laut): bab 2–4, lalu 6–7 ---
    const opBuangan = indeks === 2 ? halus : indeks <= 4 ? 1 : indeks === 5 ? 0.35 : indeks === 6 ? 1 : indeks === 7 ? Math.max(0, 1 - halus) : 0;
    alBuangan.mat.opacity = opBuangan * 0.9;

    // --- selongsong katup terjepit: bab 5 ---
    const jepit = indeks === 5 ? lonceng(progres, 0.45, 0.35) : 0;
    selongsong.scale.set(
      skalaSelongsongAsli.x * (1 - jepit * 0.55),
      skalaSelongsongAsli.y,
      skalaSelongsongAsli.z * (1 - jepit * 0.55)
    );
    // Yang menjepit selongsong itu batang penjepit, dan batangnya digerakkan
    // piston di dalam aktuator. Ketiganya bergerak bersama, bukan hanya
    // selongsongnya yang mengempis sendiri.
    D.c4.jepit.children.forEach((b, i) => {
      // Kedua batang bergerak saling mendekat ke sumbu selongsong di y = 0,62.
      b.position.y = jepitAsal[i] - Math.sign(jepitAsal[i] - 0.62) * jepit * 0.09;
    });
    D.c4.piston.position.y = pistonAsal - jepit * 0.08;
    D.c4.batang.position.y = batangAsal - jepit * 0.04;

    // --- konsentrat tersimpan di bunker: menyala mulai akhir bab 5 ---
    const isiBunker = indeks === 5 ? Math.max(0, (progres - 0.7) / 0.3) : indeks >= 6 ? 1 : 0;
    bunkerDalam.material.emissiveIntensity = isiBunker * 0.9;

    // --- gerbang gamma: berkedip saat verifikasi (bab 6) ---
    const cek = indeks === 6 ? Math.sin(progres * Math.PI * 3) ** 2 * (1 - progres) : 0;
    matGerbang.color.copy(warnaGerbangAsli).lerp(warnaGerbangCek, cek);
  }

  /* ------------------------------------------------------------------ publik */

  camera.position.copy(orbitDariJarak(C.c1, 8, 0.3, 1.05).pos);
  camera.lookAt(C.c1);

  return {
    scene,
    camera,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.05,
    rakitan,

    /** Mengevaluasi seluruh keadaan panggung pada waktu absolut t (detik). Murni fungsi dari t. */
    evaluasi(t) {
      const { indeks, progres, progresHalus } = babPadaWaktu(t, waktu, durasi);
      const { pos, target } = kameraBab(indeks, progresHalus);
      camera.position.copy(pos);
      camera.lookAt(target);
      efekBab(indeks, progres, progresHalus);

      tempatkanMengalir(samplerUmpan, alUmpan.pos, alUmpan.n, t, 0.11);
      alUmpan.pts.geometry.attributes.position.needsUpdate = true;
      tempatkanMengalir(samplerKonsentrat, alKonsentrat.pos, alKonsentrat.n, t, 0.09);
      alKonsentrat.pts.geometry.attributes.position.needsUpdate = true;
      tempatkanMengalir(samplerBuangan, alBuangan.pos, alBuangan.n, t, 0.1);
      alBuangan.pts.geometry.attributes.position.needsUpdate = true;

      // Gelembung naik di dalam ruang bubur pengkondisi, bukan sekadar di
      // sekitar kotak batas komponennya.
      for (let i = 0; i < NG; i++) {
        const fase = ((t * 0.5) + i / NG) % 1;
        posG[i * 3] = (ruangC1.min.x + ruangC1.max.x) / 2 + Math.sin(i * 12.9) * 0.3;
        posG[i * 3 + 1] = THREE.MathUtils.lerp(ruangC1.min.y, ruangC1.max.y + 0.35, fase);
        posG[i * 3 + 2] = (ruangC1.min.z + ruangC1.max.z) / 2 + Math.cos(i * 7.3) * 0.3;
      }
      geoG.attributes.position.needsUpdate = true;

      // Baling pengaduk berputar. Sudutnya dihitung langsung dari t, jadi
      // menggeser garis waktu tetap menghasilkan sudut yang sama.
      for (let i = 0; i < balingTingkat.length; i++) {
        balingTingkat[i].rotation.y = t * 2.4 * (i === 0 ? 1 : -1);
      }

      tempatkanDalamWhims(t, medanKini);
      tempatkanPulsaGamma(t);

      return { indeks, progres, progresHalus };
    },

    // panggung ini tidak dikendalikan pointer sama sekali — tidak perlu
    // aktifkan()/nonaktifkan(); disediakan sebagai no-op agar kontrak dengan
    // scene.js tetap seragam.
    aktifkan() {},
    nonaktifkan() {},
    perbarui() {},   // evaluasi(t) dipanggil eksplisit oleh section, bukan lewat loop dt

    bersihkan() {
      pmrem.dispose();
      env.texture.dispose();
    },
  };
}
