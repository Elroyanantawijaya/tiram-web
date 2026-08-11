// js/models/dalaman.js — geometri bagian dalam kelima komponen TIRAM.
//
// spec/TIRAM_3D.html hanya memodelkan kulit luar alat. Selama itu satu-satunya
// yang ada, tombol "potongan melintang" tidak punya apa pun untuk diperlihatkan:
// mengiris cangkang kosong hanya memperlihatkan rongga. Berkas ini mengisi
// rongga itu dengan bagian dalam yang benar-benar menjelaskan cara kerjanya.
//
// Bentuk tiap bagian mengikuti susunan lazim alat sejenis di industri pasir
// mineral, dan setiap bagian yang diberi label sudah disebut namanya di
// Justifikasi_Prinsip_TIRAM.docx (pengaduk, gelembung dan vent, matriks baja
// berupa wol baja atau pelat beralur, kristal NaI(Tl), tabung pengganda foto,
// penganalisis salur ganda, selongsong karet, aktuator pneumatik, dinding
// berperisai timbal). Tidak ada nama bagian baru yang dikarang di sini.
//
// Ukuran seluruhnya dipilih agar muat persis di dalam cangkang yang sudah ada di
// komponen.js. Titik acuan tiap komponen disalin dari sana, bukan ditebak.

import * as THREE from 'three';
import { bahan, bahanDalam, M, box, cyl, torus, sphere, pipeBetween, busur, tandai } from './bahan.js';

const { steel, dark, copper, yellow, lead, pipe, rubber } = bahan;
const { besi, pelat, papan, konsentrat, bubur, kristal, kaca } = bahanDalam;

/** Kelompok bagian dalam: satu anak = satu bagian logis saat model diurai. */
function bagian(...anak) {
  const g = new THREE.Group();
  for (const a of anak) if (a) g.add(a);
  return g;
}

/* ================================================================ 1 · Pengkondisi
   Cangkang: silinder r=1 setinggi 2,2 berpusat di y=1,3 (y 0,2..2,4), dengan
   kubah atas di y=2,4 dan kubah bawah di y=0,2. Poros pengaduk turun dari motor
   di y=3,0.

   Isi: muka bubur, poros penuh dengan dua tingkat baling pengaduk, empat sekat
   dinding penahan pusaran, pipa celup masuk yang mengarahkan umpan ke bawah,
   corong keluar, dan leher vent tempat gelembung dibuang. */
export function dalamPengkondisi({ ringkas = false } = {}) {
  const g = new THREE.Group();

  // Muka bubur: tidak penuh sampai kubah — ada ruang gelembung di atasnya, dan
  // ruang itulah yang membuat de-aerasi masuk akal.
  const isi = cyl(0.94, 0.94, 1.5, bubur);
  isi.position.y = 1.05;
  g.add(isi);
  // Permukaan bubur, sedikit lebih terang supaya batas mukanya terbaca.
  const muka = cyl(0.94, 0.94, 0.02, M(0x9a8f7e, 0.1, 0.7));
  muka.position.y = 1.8;
  g.add(muka);

  // Poros pengaduk sepanjang tangki. Cangkang hanya memodelkan potongan atasnya.
  const poros = cyl(0.05, 0.05, 2.6, steel);
  poros.position.y = 1.5;
  g.add(poros);

  // Dua tingkat baling. Tingkat bawah menjaga padatan tetap melayang, tingkat
  // atas mencampur ulang lapisan yang mulai memisah.
  const balingSusun = (y, r) => {
    const b = new THREE.Group();
    const nabir = ringkas ? 3 : 4;
    for (let i = 0; i < nabir; i++) {
      const a = (i / nabir) * Math.PI * 2;
      const bilah = box(r, 0.07, 0.16, steel);
      bilah.position.set(Math.cos(a) * r * 0.5, y, Math.sin(a) * r * 0.5);
      bilah.rotation.y = -a;
      bilah.rotation.x = 0.5;                 // sudut pitch, supaya mendorong ke bawah
      b.add(bilah);
    }
    const naf = cyl(0.11, 0.11, 0.14, dark);
    naf.position.y = y;
    b.add(naf);
    return b;
  };
  g.add(balingSusun(0.72, 0.62), balingSusun(1.48, 0.62));

  // Empat sekat dinding: tanpa ini isi tangki hanya ikut berputar sebagai satu
  // pusaran dan pencampurannya justru buruk.
  const sekat = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const s = box(0.16, 1.6, 0.05, steel);
    s.position.set(Math.cos(a) * 0.86, 1.1, Math.sin(a) * 0.86);
    s.rotation.y = -a;
    sekat.add(s);
  }
  g.add(sekat);

  // Pipa celup masuk: umpan dari jig diarahkan turun ke bawah muka bubur supaya
  // tidak mengaduk permukaan dan menyeret udara baru masuk.
  g.add(bagian(
    pipeBetween([-0.9, 0.6, 0], [-0.6, 0.6, 0], 0.13, pipe),
    pipeBetween([-0.6, 0.68, 0], [-0.6, 0.1, 0], 0.13, pipe),
    (() => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.18, 14), pipe); m.position.set(-0.6, 0.02, 0); return m; })()
  ));

  // Corong keluar: isapan diambil dari dasar, bukan dari samping, supaya padatan
  // yang mulai mengendap ikut terbawa.
  const corong = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.5, ringkas ? 12 : 22, 1, true), steel);
  corong.material = M(0x8a9096, 0.7, 0.45);
  corong.material.side = THREE.DoubleSide;
  corong.position.y = 0.38;
  corong.rotation.x = Math.PI;
  g.add(bagian(
    corong,
    pipeBetween([0.6, 0.14, 0], [0.6, 0.6, 0], 0.13, pipe),
    pipeBetween([0.6, 0.6, 0], [0.9, 0.6, 0], 0.13, pipe)
  ));

  // Leher vent: jalan keluar gelembung dari ruang di atas muka bubur.
  g.add(pipeBetween([0.42, 2.32, 0], [0.55, 2.85, 0], 0.08, pipe));

  return tandai(g, 'dalam');
}

/* ==================================================================== 2 · WHIMS
   Cangkang: rumah balok 2,2 × 1,8 × 1,6 berpusat di y=1,4, cincin dan matriks di
   muka depan (z≈0,7..0,82), dua kumparan di x=±1,2.

   Isi: yoke besi yang mengembalikan fluks dari satu kumparan ke kumparan lain,
   sepasang sepatu kutub yang memampatkan fluks itu ke celah kerja, kanister berisi
   pelat beralur (matriks yang menciptakan gradien medan tajam), kotak umpan di
   atas, header air bilas, dan talang di bawah. */
export function dalamWhims({ ringkas = false } = {}) {
  const g = new THREE.Group();

  // Yoke: dua kaki tegak di sisi dalam rumah, disambung palang atas dan bawah.
  // Inilah jalan balik fluks; tanpanya medan di celah kerja jauh lebih lemah.
  const yoke = new THREE.Group();
  for (const x of [-0.98, 0.98]) {
    const kaki = box(0.22, 1.5, 0.6, besi);
    kaki.position.set(x, 1.4, -0.1);
    yoke.add(kaki);
  }
  for (const y of [2.05, 0.75]) {
    const palang = box(2.18, 0.22, 0.6, besi);
    palang.position.set(0, y, -0.1);
    yoke.add(palang);
  }
  g.add(yoke);

  // Sepatu kutub: penampangnya menyempit ke arah celah, dan penyempitan itulah
  // yang menaikkan kerapatan fluks di tempat matriks berada.
  const sepatu = new THREE.Group();
  for (const x of [-1, 1]) {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.2, 0.5, ringkas ? 10 : 18), besi);
    s.rotation.z = Math.PI / 2;
    s.position.set(x * 0.72, 1.4, 0.3);
    sepatu.add(s);
  }
  g.add(sepatu);

  // Kanister matriks: tumpukan pelat beralur di celah antara kedua sepatu kutub.
  // Tepi tajam tiap alur itulah yang membuat gradien medan lokal melonjak.
  const kanister = new THREE.Group();
  const rangka = box(0.98, 0.98, 0.56, M(0x767f88, 0.75, 0.4));
  rangka.material.transparent = true;
  rangka.material.opacity = 0.28;
  rangka.position.set(0, 1.4, 0.3);
  kanister.add(rangka);

  const nPelat = ringkas ? 3 : 6;
  for (let i = 0; i < nPelat; i++) {
    const z = 0.3 + (i / (nPelat - 1) - 0.5) * 0.44;
    const p = box(0.9, 0.9, 0.022, pelat);
    p.position.set(0, 1.4, z);
    kanister.add(p);
    if (ringkas) continue;
    // Alur melintang pada tiap pelat.
    for (let k = 0; k < 5; k++) {
      const r = box(0.9, 0.035, 0.05, pelat);
      r.position.set(0, 1.4 + (k / 4 - 0.5) * 0.72, z);
      kanister.add(r);
    }
  }
  g.add(kanister);

  // Kotak umpan: bubur masuk dari atas dan disebar merata ke seluruh muka
  // matriks, bukan dijatuhkan pada satu titik.
  g.add(bagian(
    (() => { const k = box(0.62, 0.34, 0.42, M(0x767f88, 0.7, 0.45)); k.position.set(0, 2.16, 0.5); return k; })(),
    (() => { const c = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.34, 12, 1, true), M(0x767f88, 0.7, 0.45)); c.material.side = THREE.DoubleSide; c.position.set(0, 1.86, 0.5); c.rotation.x = Math.PI; return c; })()
  ));

  // Header air bilas dengan empat nosel: dipakai pada tahap pembilasan, saat
  // medan sudah dimatikan dan fraksi magnetik dilepas dari matriks.
  const header = new THREE.Group();
  header.add(pipeBetween([-0.55, 1.98, 0.56], [0.55, 1.98, 0.56], 0.055, copper));
  for (let i = 0; i < 4; i++) {
    const x = -0.4 + i * 0.267;
    header.add(pipeBetween([x, 1.96, 0.56], [x, 1.82, 0.5], 0.028, copper));
  }
  g.add(header);

  // Talang bawah: menampung apa pun yang turun dari matriks menuju kedua keluaran.
  const talang = box(1.7, 0.06, 0.66, M(0x767f88, 0.7, 0.5));
  talang.position.set(0, 0.62, 0.28);
  g.add(talang);

  return tandai(g, 'dalam');
}

/* ================================================================= 3 · Sensor gamma
   Cangkang: pipa r=0,28 setinggi 3,2 (y 0..3,2), kerah kuning r=0,55 setinggi
   0,7 di y=1,7, kabinet 0,9 × 1,3 × 0,6 di x=1,6.

   Isi: kolom bubur di dalam pipa, kolimator timbal yang menutup seluruh arah
   kecuali jendela pandang ke pipa, kristal NaI(Tl) di jendela itu, tabung
   pengganda foto tepat di atasnya beserta rangkaian dinode, papan pembagi
   tegangan, dan isi kabinet berupa rel DIN dengan modul MCA/PLC. */
export function dalamSensor({ ringkas = false } = {}) {
  const g = new THREE.Group();

  // Kolom bubur yang sedang lewat. Justru inilah yang dibaca detektor: gamma
  // menembus dinding pipa, sehingga bacaannya mewakili seluruh isi, bukan
  // permukaannya saja.
  // Panjangnya mengikuti pipa termasuk kedua mulut sambungannya, supaya kolom
  // buburnya tidak terputus di tempat pipa masuk dan keluar bersambung.
  const kolom = cyl(0.235, 0.235, 4.5, bubur);
  kolom.position.y = 1.66;
  g.add(kolom);

  // Kolimator timbal: menutup 290° dan menyisakan jendela ke arah +x. Tanpa
  // pembatas arah ini detektor ikut mencacah latar dari segala penjuru.
  const kolimator = busur(0.3, 0.13, 0.6, lead, THREE.MathUtils.degToRad(35), THREE.MathUtils.degToRad(290), ringkas ? 10 : 20);
  kolimator.position.y = 1.7;
  g.add(kolimator);

  // Kristal NaI(Tl): foton gamma menumbuknya dan memicu kilau cahaya yang
  // sebanding dengan energi foton itu.
  const kris = box(0.13, 0.24, 0.3, kristal);
  kris.position.set(0.37, 1.6, 0);
  g.add(bagian(
    kris,
    (() => { const r = box(0.16, 0.28, 0.34, M(0xc9d6dd, 0.6, 0.3)); r.material.transparent = true; r.material.opacity = 0.35; r.position.set(0.37, 1.6, 0); return r; })()
  ));

  // Tabung pengganda foto tepat di atas kristal, digandeng optik. Dinding
  // kacanya transparan supaya rangkaian dinode di dalamnya terlihat.
  const pmt = new THREE.Group();
  const tabung = cyl(0.095, 0.095, 0.36, kaca);
  tabung.position.set(0.37, 1.93, 0);
  pmt.add(tabung);
  const nDinode = ringkas ? 3 : 6;
  for (let i = 0; i < nDinode; i++) {
    const d = cyl(0.062, 0.062, 0.012, copper, 10);
    d.position.set(0.37, 1.79 + (i / (nDinode - 1)) * 0.26, 0);
    d.rotation.z = 0.35;
    pmt.add(d);
  }
  const foto = cyl(0.088, 0.088, 0.014, M(0x2b2f36, 0.4, 0.5), 12);
  foto.position.set(0.37, 1.755, 0);
  pmt.add(foto);
  g.add(pmt);

  // Papan pembagi tegangan dan penguat awal, di bawah kristal.
  g.add(bagian(
    (() => { const p = box(0.16, 0.1, 0.26, papan); p.position.set(0.37, 1.4, 0); return p; })(),
    (() => { const p = box(0.05, 0.05, 0.05, copper); p.position.set(0.37, 1.46, 0.06); return p; })()
  ));

  /* --- isi kabinet: rel DIN, modul, blok terminal, catu daya --- */
  const kab = new THREE.Group();
  for (const y of [1.06, 0.62]) {
    const rel = box(0.66, 0.035, 0.06, M(0xb4bcc3, 0.85, 0.3));
    rel.position.set(1.6, y, -0.08);
    kab.add(rel);
  }
  // Modul pada rel atas: satu catu daya lalu beberapa modul tipis.
  const catu = box(0.14, 0.26, 0.3, papan);
  catu.position.set(1.34, 1.21, -0.02);
  kab.add(catu);
  const nModul = ringkas ? 2 : 4;
  for (let i = 0; i < nModul; i++) {
    const m = box(0.1, 0.24, 0.28, M(0x3d4b56, 0.25, 0.75));
    m.position.set(1.48 + i * 0.115, 1.2, -0.02);
    kab.add(m);
    const led = box(0.012, 0.03, 0.03, i === 0 ? yellow : M(0x3fb8c4, 0.2, 0.5));
    led.position.set(1.48 + i * 0.115 - 0.056, 1.28, 0.1);
    kab.add(led);
  }
  // Blok terminal berderet pada rel bawah.
  const nTerm = ringkas ? 5 : 10;
  for (let i = 0; i < nTerm; i++) {
    const t = box(0.05, 0.14, 0.2, M(0x8a9096, 0.2, 0.8));
    t.position.set(1.33 + i * 0.058, 0.71, -0.02);
    kab.add(t);
  }
  g.add(kab);

  return tandai(g, 'dalam');
}

/* ================================================================= 4 · Katup jepit
   Cangkang: badan silinder r=0,34 panjang 0,7 sepanjang sumbu x di titik asal,
   pipa masuk dari x=-1,5, dua cabang keluar menuju (1,3, ±0,85), aktuator di
   y=0,75.

   Isi: selongsong karet berlubang penuh, bubur yang mengalir di dalamnya,
   sepasang batang penjepit, serta piston dan pegas balik di dalam aktuator. */
export function dalamKatup({ ringkas = false } = {}) {
  const g = new THREE.Group();

  // Selongsong karet: satu-satunya bagian yang bersentuhan dengan bubur, dan
  // satu-satunya yang perlu diganti saat aus. Materialnya disalin dan dibuat
  // separuh tembus supaya aliran di dalamnya tetap tersambung secara visual dari
  // pipa masuk sampai kedua cabang keluar.
  const matSelongsong = rubber.clone();
  matSelongsong.transparent = true;
  matSelongsong.opacity = 0.55;
  const selongsong = cyl(0.24, 0.24, 0.74, matSelongsong);
  selongsong.rotation.z = Math.PI / 2;
  selongsong.userData.selongsongDalam = true;
  g.add(selongsong);

  // Bubur di dalam selongsong dan di kedua cabang keluar.
  const aliran = new THREE.Group();
  const dalamSelongsong = cyl(0.17, 0.17, 0.76, bubur);
  dalamSelongsong.rotation.z = Math.PI / 2;
  aliran.add(dalamSelongsong);
  aliran.add(pipeBetween([-1.46, 0, 0], [-0.34, 0, 0], 0.17, bubur));
  aliran.add(pipeBetween([0.3, 0.2, 0], [1.55, 1.02, 0], 0.15, bubur));
  aliran.add(pipeBetween([0.3, -0.2, 0], [1.55, -1.02, 0], 0.15, bubur));
  g.add(aliran);

  // Sepasang batang penjepit. Menjepit satu cabang memaksa seluruh aliran ke
  // cabang lain; katupnya sendiri tidak memisahkan apa pun.
  const jepit = new THREE.Group();
  for (const y of [0.3, -0.3]) {
    const b = cyl(0.045, 0.045, 0.52, steel);
    b.rotation.x = Math.PI / 2;
    b.position.set(0, y, 0);
    jepit.add(b);
    const dudukan = box(0.1, 0.08, 0.12, dark);
    dudukan.position.set(0, y, 0.28);
    jepit.add(dudukan);
  }
  g.add(jepit);

  // Isi aktuator pneumatik: piston, batangnya, dan pegas balik.
  const pneu = new THREE.Group();
  const piston = cyl(0.24, 0.24, 0.1, steel);
  piston.position.y = 0.86;
  pneu.add(piston);
  const batang = cyl(0.055, 0.055, 0.5, steel);
  batang.position.y = 0.58;
  pneu.add(batang);
  const nLilit = ringkas ? 3 : 6;
  for (let i = 0; i < nLilit; i++) {
    const l = torus(0.16, 0.022, M(0xb4bcc3, 0.8, 0.35), 14);
    l.rotation.x = Math.PI / 2;
    l.position.y = 0.62 + (i / (nLilit - 1)) * 0.2;
    pneu.add(l);
  }
  // Saluran udara masuk ke ruang di atas piston.
  pneu.add(pipeBetween([0, 1.02, 0], [0.24, 1.16, 0], 0.035, copper));
  g.add(pneu);

  return tandai(g, 'dalam');
}

/* ================================================================== 5 · Bunker
   Cangkang: kotak berperisai timbal, lebar 2, tinggi 1,6, dalam 1,6, tebal
   dinding 0,16, dengan corong isi di y≈1,85.

   Isi: pelapis baja di sisi dalam perisai, timbunan konsentrat kaya monasit yang
   sudah ditiriskan, penyebar di bawah corong isi, dan sensor tinggi isian. */
export function dalamBunker({ ringkas = false } = {}) {
  const g = new THREE.Group();
  const w = 2, h = 1.6, d = 1.6, t = 0.16;
  const dalamW = w - 2 * t, dalamD = d - 2 * t;

  // Pelapis baja di sisi dalam perisai timbal. Timbal terlalu lunak untuk
  // menahan gesekan konsentrat kering secara langsung.
  //
  // Empat dinding pelapis ikut ditandai kulit: mereka mengelilingi timbunan dari
  // segala sisi, jadi kalau dibiarkan pejal, membuka perisai luar tetap tidak
  // memperlihatkan apa pun selain kotak baja tertutup.
  const pelapis = new THREE.Group();
  const lapisTebal = 0.03;
  const matLapis = () => M(0x9aa3ab, 0.85, 0.35);
  const bawah = box(dalamW, lapisTebal, dalamD, matLapis());
  bawah.position.set(0, t / 2 + lapisTebal / 2, 0);
  pelapis.add(bawah);
  for (const [sx, sz] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const l = box(sx ? lapisTebal : dalamW, h - t, sz ? lapisTebal : dalamD, matLapis());
    l.position.set(sx * (dalamW / 2 - lapisTebal / 2), h / 2 + 0.06, sz * (dalamD / 2 - lapisTebal / 2));
    l.userData.selubung = true;
    pelapis.add(l);
  }
  g.add(pelapis);

  // Timbunan konsentrat: kerucut di bawah corong isi, di atas lapisan rata.
  const timbunan = new THREE.Group();
  const alas = box(dalamW - 0.06, 0.34, dalamD - 0.06, konsentrat);
  alas.position.y = 0.35;
  timbunan.add(alas);
  const kerucut = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.62, ringkas ? 12 : 24), konsentrat);
  kerucut.position.y = 0.83;
  timbunan.add(kerucut);
  timbunan.userData.timbunanDalam = true;
  for (const anak of timbunan.children) anak.userData.timbunanDalam = true;
  g.add(timbunan);

  // Penyebar di bawah mulut corong, supaya isian tidak menumpuk di satu titik
  // sampai menyentuh langit-langit.
  const penyebar = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.24, ringkas ? 10 : 18), steel);
  penyebar.position.y = 1.3;
  g.add(penyebar);

  // Sensor tinggi isian di langit-langit, mengarah ke timbunan.
  g.add(bagian(
    (() => { const s = box(0.14, 0.12, 0.14, dark); s.position.set(0.56, 1.42, 0); return s; })(),
    (() => { const k = cyl(0.02, 0.02, 0.24, copper, 8); k.position.set(0.56, 1.56, 0); return k; })()
  ));

  return tandai(g, 'dalam');
}

/** Dipetakan dengan id komponen di data/content.js (s5.komponen[].id). */
export const PEMBANGUN_DALAM = {
  c1: dalamPengkondisi,
  c2: dalamWhims,
  c3: dalamSensor,
  c4: dalamKatup,
  c5: dalamBunker,
};
