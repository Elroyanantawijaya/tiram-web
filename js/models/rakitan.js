// js/models/rakitan.js — rakitan TIRAM di atas dek KIP (S6).
//
// Modul (skid, lima komponen, pipa) disalin persis dari bAssembly di
// spec/TIRAM_3D.html, lalu diskalakan seragam agar skid menjadi 16 m. Skala
// seragam tidak mengubah bentuk maupun susunan alat.
//
// Dek, lambung, dan bidang laut TIDAK diport. Di berkas sumber ketiganya hanya
// "konteks skala" dan proporsinya keliru — modul di sana menempati 34% panjang
// kapal, padahal sebenarnya 18,7%. Ketiganya dibangun ulang pada ukuran meter.
//
// Ukuran kapal dan modul di bawah adalah perkiraan rekayasa, bukan angka dari
// esai. Ia hanya dipakai sebagai proporsi geometri dan tidak pernah ditampilkan
// sebagai fakta di teks situs.

import * as THREE from 'three';
import { M, box, cyl, torus, sphere, pipeBetween, route, routeArrow, trefoilTexture } from './bahan.js';

// Setelah penskalaan, 1 satuan dunia = 1 meter.
export const SKALA = 1.569;          // 10,2 satuan sumber → 16 m panjang skid
export const KAPAL = { panjang: 85.5, lebar: 22, tinggi: 9.5 };
export const TINGGI_ORANG = 1.7;

/** Material khusus rakitan. Sengaja disalin, bukan dipakai bersama dengan model
 *  komponen S5 — S6 mengubah-ubah opasitas dan wireframe-nya untuk X-ray dan
 *  sorot jalur, dan itu tidak boleh merembet ke section lain. */
function bahanRakitan() {
  return {
    steel: M(0x9aa3ab, 0.8, 0.35),
    dark: M(0x55606a, 0.7, 0.5),
    copper: M(0xb87333, 0.75, 0.4),
    yellow: M(0xf1c40f, 0.3, 0.5),
    lead: M(0x6b7078, 0.5, 0.6),
    pipe: M(0x8a9096, 0.7, 0.4),
    rubber: M(0x2b2f36, 0.1, 0.9),
    innerM: M(0x3a4048, 0.3, 0.9),
    lambung: M(0x2c3540, 0.5, 0.7),
    dek: M(0x3a4653, 0.5, 0.75),
  };
}

/**
 * Modul saja, dalam satuan sumber (belum diskalakan).
 * Disalin baris demi baris dari bAssembly, tanpa dek/lambung/laut dan tanpa label().
 */
function bangunModul(b) {
  const g = new THREE.Group();
  const yB = 0.17, HP = 0.95, RR = 0.11, Xc = -3.7, Xw = -1.6, Xs = 0.2, Xv = 1.9, Xb = 3.7;

  // ---- skid + rel ----
  const skid = box(10.2, 0.25, 3.4, M(0x4a5666, 0.5, 0.6)); skid.position.set(0, 0.05, 0); g.add(skid);
  [[-5, -1.6], [-2.5, -1.6], [0, -1.6], [2.5, -1.6], [5, -1.6], [-5, 1.6], [5, 1.6]].forEach((p) => {
    const c = cyl(0.045, 0.045, 0.95, b.yellow); c.position.set(p[0], 0.5, p[1]); g.add(c);
  });
  g.add(route([[-5, 0.97, -1.6], [5, 0.97, -1.6]], 0.045, b.yellow));
  g.add(route([[-5, 0.97, -1.6], [-5, 0.97, 1.6]], 0.045, b.yellow));
  g.add(route([[5, 0.97, -1.6], [5, 0.97, 1.6]], 0.045, b.yellow));

  // ---- 1 pengkondisi ----
  const k1 = new THREE.Group();
  (function () {
    const t = cyl(0.55, 0.55, 1.5, b.steel); t.position.set(Xc, 0.92, 0); k1.add(t);
    const dt = sphere(0.55, b.steel); dt.scale.y = 0.5; dt.position.set(Xc, 1.67, 0); k1.add(dt);
    const db = sphere(0.55, b.steel); db.scale.y = 0.5; db.position.set(Xc, 0.25, 0); k1.add(db);
    const mo = cyl(0.16, 0.16, 0.3, b.dark); mo.position.set(Xc, 1.9, 0); k1.add(mo);
    const mb = box(0.3, 0.2, 0.3, b.dark); mb.position.set(Xc, 2.1, 0); k1.add(mb);
  })();
  g.add(k1);

  // ---- 2 WHIMS ----
  const k2 = new THREE.Group();
  (function () {
    // bx ditandai "selubung" untuk mode X-ray (S6). b.dark juga dipakai motor
    // pengkondisi (k1) dan aktuator katup (k4) — kalau bx memakainya langsung,
    // meredupkan bx lewat X-ray diam-diam ikut meredupkan keduanya juga, sebab
    // mereka menunjuk objek Material yang sama. Klon supaya bx berdiri sendiri.
    const bx = box(1.3, 1.25, 1.1, b.dark.clone()); bx.position.set(Xw, 0.795, 0); bx.userData.selubung = true; k2.add(bx);
    // Kumparan ditandai untuk kilau medan magnet di sekuens sinema (S7).
    // b.copper eksklusif milik kumparan ini, aman dipakai langsung tanpa klon.
    const cl = cyl(0.28, 0.28, 0.4, b.copper); cl.rotation.z = Math.PI / 2; cl.position.set(Xw - 0.72, 0.795, 0); cl.userData.kumparan = true; k2.add(cl);
    const cr = cl.clone(); cr.position.x = Xw + 0.72; k2.add(cr);
    const rg = torus(0.42, 0.1, b.steel); rg.position.set(Xw, 0.795, 0.56); k2.add(rg);
  })();
  g.add(k2);

  // ---- 3 sensor ----
  const k3 = new THREE.Group();
  (function () {
    const p = cyl(0.16, 0.16, 1.25, b.pipe); p.position.set(Xs, 0.925, 0); k3.add(p);
    const co = cyl(0.32, 0.32, 0.42, b.yellow); co.position.set(Xs, 0.98, 0); k3.add(co);
    const cab = box(0.5, 0.8, 0.4, b.steel); cab.position.set(Xs + 0.7, 0.57, 0.1); k3.add(cab);
    k3.add(pipeBetween([Xs + 0.16, 0.98, 0], [Xs + 0.5, 0.7, 0.1], 0.035, b.rubber));
  })();
  g.add(k3);

  // ---- 4 katup ----
  const k4 = new THREE.Group();
  (function () {
    k4.add(pipeBetween([Xv - 0.55, 0.62, 0], [Xv + 0.15, 0.62, 0], 0.16, b.pipe));
    // Selongsong ditandai untuk animasi terjepit di S7. b.rubber juga dipakai
    // pipa kecil sensor (k3) — klon dulu, seperti alasan bx di atas.
    const bd = cyl(0.22, 0.22, 0.5, b.rubber.clone()); bd.rotation.z = Math.PI / 2; bd.position.set(Xv - 0.15, 0.62, 0); bd.userData.selongsong = true; k4.add(bd);
    k4.add(pipeBetween([Xv, 0.62, 0], [Xv + 0.4, 1.05, 0], 0.15, b.pipe));
    k4.add(pipeBetween([Xv, 0.62, 0], [Xv, 0.62, 0.5], 0.15, b.pipe));
    const ac = cyl(0.18, 0.18, 0.4, b.dark); ac.position.set(Xv - 0.15, 0.95, 0); k4.add(ac);
    const kn = cyl(0.1, 0.1, 0.14, b.yellow); kn.position.set(Xv - 0.15, 1.2, 0); k4.add(kn);
  })();
  g.add(k4);

  // ---- 5 bunker ----
  const k5 = new THREE.Group();
  (function () {
    const w = 1.5, h = 1.4, d = 1.4, t = 0.14;
    const wl = (ww, hh, dd, x, y, z) => { const m = box(ww, hh, dd, b.lead); m.position.set(x, y, z); m.userData.selubung = true; k5.add(m); };
    wl(w, t, d, Xb, yB, 0);
    wl(w, h, t, Xb, yB + h / 2, d / 2 - t / 2);
    wl(w, h, t, Xb, yB + h / 2, -d / 2 + t / 2);
    wl(t, h, d, Xb - w / 2 + t / 2, yB + h / 2, 0);
    wl(t, h, d, Xb + w / 2 - t / 2, yB + h / 2, 0);
    // b.innerM eksklusif milik isi bunker — aman ditandai tanpa klon.
    const inr = box(w - 2 * t, h - t, d - 2 * t, b.innerM); inr.position.set(Xb, yB + h / 2 + 0.05, 0); inr.userData.konsentratDalam = true; k5.add(inr);
    const tre = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.55), new THREE.MeshBasicMaterial({ map: trefoilTexture() }));
    tre.position.set(Xb + w / 2 - t / 2 + 0.01, yB + h * 0.55, 0); tre.rotation.y = Math.PI / 2; k5.add(tre);
  })();
  g.add(k5);

  // ---- pipa, dikelompokkan per jalur aliran ----
  // Pengelompokan hanya menandai, tidak menyentuh posisi atau ukuran.
  const jalur = {
    umpan: new THREE.Group(),
    konsentrat: new THREE.Group(),
    buangan: new THREE.Group(),
  };

  // Tiap jalur memakai salinan materialnya sendiri. Kalau ketiganya berbagi satu
  // instance, meredupkan satu jalur ikut meredupkan dua lainnya — sorot jalur
  // jadi tidak berfungsi sama sekali.
  const bahanJalur = {
    umpan: b.pipe.clone(),
    konsentrat: b.pipe.clone(),
    buangan: b.pipe.clone(),
  };

  // Polyline tiap ruas ikut disimpan supaya partikel aliran bisa menyusurinya.
  const lintasan = { umpan: [], konsentrat: [], buangan: [] };
  const pasang = (nama, titik, arah) => {
    jalur[nama].add((arah ? routeArrow : route)(titik, RR, bahanJalur[nama]));
    lintasan[nama].push(titik.map((t) => new THREE.Vector3(t[0], t[1], t[2])));
  };

  pasang('umpan', [[-5.8, HP, 0], [Xc - 0.55, HP, 0]]);
  pasang('umpan', [[Xc + 0.55, HP, 0], [Xw - 0.65, HP, 0]]);

  pasang('konsentrat', [[Xw, 1.42, 0], [Xw, 1.75, 0], [Xs, 1.75, 0], [Xs, 1.55, 0]]);
  pasang('konsentrat', [[Xs, 0.30, 0], [Xs, 0.62, 0], [Xv - 0.55, 0.62, 0]]);
  pasang('konsentrat', [[Xv + 0.4, 1.05, 0], [Xv + 0.4, 1.75, 0], [Xb, 1.75, 0], [Xb, 1.57, 0]]);

  pasang('buangan', [[Xw, 0.795, 0.56], [Xw, 0.62, 1.3], [0, 0.62, 1.3]]);
  pasang('buangan', [[Xv, 0.62, 0.5], [Xv, 0.62, 1.3], [0, 0.62, 1.3]]);
  const jn = sphere(0.13, bahanJalur.buangan); jn.position.set(0, 0.62, 1.3); jalur.buangan.add(jn);
  pasang('buangan', [[0, 0.62, 1.3], [0, 0.62, 5.2], [0, 0.2, 5.9], [0, -2.0, 6.6]], true);

  for (const gr of Object.values(jalur)) g.add(gr);

  // Titik jangkar penanda bernomor, dalam satuan sumber — diambil dari
  // pemanggilan label() bernomor di bAssembly.
  const penanda = [
    { id: 'c1', nomor: 1, pos: new THREE.Vector3(Xc, 2.45, 0) },
    { id: 'c2', nomor: 2, pos: new THREE.Vector3(Xw, 1.95, 0) },
    { id: 'c3', nomor: 3, pos: new THREE.Vector3(Xs, 1.95, 0) },
    { id: 'c4', nomor: 4, pos: new THREE.Vector3(Xv, 1.55, 0) },
    { id: 'c5', nomor: 5, pos: new THREE.Vector3(Xb, 1.95, 0) },
  ];

  return { grup: g, jalur, lintasan, penanda, komponen: { c1: k1, c2: k2, c3: k3, c4: k4, c5: k5 } };
}

/** Siluet manusia 1,7 m sebagai acuan skala. */
function bangunOrang(mat) {
  const g = new THREE.Group();
  const badan = cyl(0.19, 0.15, 1.06, mat); badan.position.y = 0.53; g.add(badan);
  const kepala = sphere(0.15, mat); kepala.position.y = 1.24; g.add(kepala);
  const bahu = cyl(0.2, 0.2, 0.12, mat); bahu.rotation.z = Math.PI / 2; bahu.position.y = 1.02; g.add(bahu);
  g.scale.setScalar(TINGGI_ORANG / 1.39);   // tinggi geometri mentah ≈ 1,39
  return g;
}

/** Konteks kapal: lambung, dek, bangunan atas, laut. Dibangun dalam meter. */
function bangunKapal(b) {
  const g = new THREE.Group();
  const { panjang: P, lebar: L, tinggi: T } = KAPAL;

  const lambung = box(P, T, L, b.lambung); lambung.position.set(0, -T / 2, 0); g.add(lambung);
  const dek = box(P, 0.4, L, b.dek); dek.position.set(0, -0.2, 0); g.add(dek);

  // Bangunan atas dan menara di haluan — konteks, bukan alat.
  const rumah = box(16, 6, 14, b.dek); rumah.position.set(-P / 2 + 13, 3, 0); g.add(rumah);
  const anjungan = box(9, 3.4, 10, b.lambung); anjungan.position.set(-P / 2 + 12, 7.7, 0); g.add(anjungan);
  const menara = box(3.2, 14, 3.2, b.lambung); menara.position.set(-P / 2 + 22, 7, 0); g.add(menara);

  // Ladder: rangkaian tangga isap yang menjulur ke air di haluan.
  const ladder = box(34, 2.4, 3, b.lambung);
  ladder.position.set(-P / 2 - 9, -5, 0);
  ladder.rotation.z = 0.34;
  g.add(ladder);

  const laut = new THREE.Mesh(
    new THREE.PlaneGeometry(900, 900),
    new THREE.MeshStandardMaterial({ color: 0x0d2b3a, metalness: 0.15, roughness: 0.7 })
  );
  laut.rotation.x = -Math.PI / 2;
  laut.position.y = -6.6;
  g.add(laut);

  return g;
}

export function bangunRakitan() {
  const b = bahanRakitan();
  const akar = new THREE.Group();

  const kapal = bangunKapal(b);
  akar.add(kapal);

  const { grup: modul, jalur, lintasan, penanda, komponen } = bangunModul(b);
  const bungkus = new THREE.Group();
  bungkus.add(modul);
  bungkus.scale.setScalar(SKALA);
  // Modul duduk agak ke buritan dan ke satu sisi dek: ia dipasang pada satu
  // aliran cabang, bukan di tengah kapal.
  bungkus.position.set(14, 0, 3.5);
  akar.add(bungkus);

  const orang = bangunOrang(b.steel);
  orang.position.set(14 - 9.5, 0, 3.5 + 3.2);
  akar.add(orang);

  // Garis rentang lambung — isyarat skala tanpa label angka apa pun.
  const garis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-KAPAL.panjang / 2, 0.05, KAPAL.lebar / 2 + 1.5),
      new THREE.Vector3(KAPAL.panjang / 2, 0.05, KAPAL.lebar / 2 + 1.5),
    ]),
    new THREE.LineBasicMaterial({ color: 0x7c93a1, transparent: true, opacity: 0.55 })
  );
  akar.add(garis);

  return {
    akar, kapal, modul: bungkus, jalur, lintasan, penanda, komponen, orang, bahan: b,
    /** Titik jangkar penanda dalam koordinat dunia. */
    penandaDunia: () => penanda.map((p) => ({
      ...p, dunia: bungkus.localToWorld(p.pos.clone().multiplyScalar(1)),
    })),
  };
}
