// js/widgets/katup.js — widget simulasi komponen 4 (Katup pengarah / pinch valve).
//
// Yang harus terlihat, sesuai §S5: konsekuensi tunda PLC yang salah. Sensor
// membaca sebuah segmen di satu titik pipa, tetapi katup berada beberapa meter
// di hilirnya. Perintah harus ditunda persis selama waktu tempuh segmen itu,
// kalau tidak yang dibelokkan adalah bongkahan aliran yang lain.
//
// Catatan yang wajib tampil (dan memang ditampilkan di bawah kanvas): katup
// tidak memisahkan apa pun. Ia hanya membelokkan seluruh segmen.

import { el, kurangiGerak } from '../dom.js';

const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();

// Geometri pipa dalam koordinat 0..1 sepanjang lintasan.
const X_SENSOR = 0.26;
const X_KATUP = 0.72;
const KECEPATAN = 0.16;                       // bagian lintasan per detik
const TEMPUH = (X_KATUP - X_SENSOR) / KECEPATAN; // detik — tunda yang benar
const TOLERANSI = 0.35;                       // detik; di dalam ini dianggap tepat

export function buatWidgetKatup(k) {
  const w = k.widget;
  const u = w.ui;

  const akar = el('div', { class: 'widget widget--katup' });
  const kanvas = el('canvas', { class: 'widget__kanvas', role: 'img', 'aria-label': u.padananTeks });

  const nilaiTunda = el('output', { class: 'widget__nilai mono', for: 'tunda-c4' });
  const slider = el('input', {
    class: 'widget__slider', type: 'range', id: 'tunda-c4',
    min: '0', max: '600', value: '110', step: '5', 'data-kursor': 'mainkan',
  });

  const bacaanTunda = el('span', { class: 'widget__angka mono' });
  const bacaanSelisih = el('span', { class: 'widget__angka mono' });
  const bacaanTepat = el('span', { class: 'widget__angka mono' });
  const status = el('p', { class: 'widget__status mono', 'aria-live': 'polite' });
  const catatan = el('p', { class: 'widget__pengingat', text: w.catatanWajib });

  akar.append(
    el('div', { class: 'widget__kendali' }, [
      el('label', { class: 'widget__label', for: 'tunda-c4', text: u.slider }),
      el('div', { class: 'widget__baris' }, [slider, nilaiTunda]),
    ]),
    kanvas,
    el('div', { class: 'widget__bacaan' }, [
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanTunda }), bacaanTunda]),
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanSelisih }), bacaanSelisih]),
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanTepat }), bacaanTepat]),
    ]),
    status,
    catatan
  );

  /* ------------------------------------------------------------- keadaan */

  const ctx = kanvas.getContext('2d');
  let lebar = 1, tinggi = 1;
  let jam = 0;
  let segmen = [];          // {x, kaya, id, hasil: null|'bunker'|'laut'}
  let perintah = [];        // {waktuEksekusi, idSumber}
  let katupKeBunker = false;
  let idBerikut = 1;
  let jumlahKaya = 0, jumlahKayaTertangkap = 0;
  let sejakSegmen = 0;

  const tunda = () => slider.valueAsNumber / 100;   // detik

  function buatSegmen() {
    // Kira-kira sepertiga segmen kaya monasit; sisanya biasa.
    const kaya = Math.random() < 0.34;
    segmen.push({ x: 0, kaya, id: idBerikut++, hasil: null, diukur: false });
  }

  function langkah(dt) {
    jam += dt;
    sejakSegmen += dt;
    // Jarak antar segmen dijaga cukup renggang supaya kesalahan tunda terlihat
    // sebagai "segmen yang salah", bukan sekadar kabur.
    if (sejakSegmen > 1.15) { sejakSegmen = 0; buatSegmen(); }

    // Posisi katup dihitung LEBIH DULU, sebelum nasib segmen diputuskan di
    // bawah. Kalau dibalik, perintah yang jatuh tempo persis saat segmennya
    // tiba selalu terlambat satu frame — dan justru tunda yang benar yang
    // paling dirugikan, sebab di situlah keduanya berimpit tepat.
    // Jendela dibuka sedikit lebih awal (0,15 s) supaya kebetulan pembulatan
    // langkah waktu tidak menentukan hasil.
    katupKeBunker = false;
    for (const p of perintah) {
      if (jam >= p.waktuEksekusi - 0.15 && jam < p.waktuEksekusi + 0.55) katupKeBunker = true;
    }

    for (const s of segmen) {
      const xLama = s.x;
      s.x += KECEPATAN * dt;

      // Sensor membaca segmen saat melewatinya, lalu menjadwalkan perintah.
      if (!s.diukur && xLama < X_SENSOR && s.x >= X_SENSOR) {
        s.diukur = true;
        if (s.kaya) perintah.push({ waktuEksekusi: jam + tunda(), idSumber: s.id });
      }

      // Saat segmen melewati katup, nasibnya ditentukan oleh posisi katup
      // SAAT ITU — bukan oleh apakah ia sendiri kaya monasit. Inilah inti
      // widget ini: katup membelokkan apa pun yang kebetulan lewat.
      // Statistik dicatat di sini, bukan di sensor: hanya segmen yang nasibnya
      // sudah diputuskan yang boleh masuk hitungan. Kalau penyebutnya dicatat
      // di sensor, segmen yang masih dalam perjalanan ikut terhitung sebagai
      // "tidak tertangkap" padahal belum sampai — dan persentasenya tak pernah
      // bisa mendekati 100% meski tundanya benar.
      if (s.hasil === null && xLama < X_KATUP && s.x >= X_KATUP) {
        s.hasil = katupKeBunker ? 'bunker' : 'laut';
        if (s.kaya) {
          jumlahKaya++;
          if (s.hasil === 'bunker') jumlahKayaTertangkap++;
        }
      }
    }

    perintah = perintah.filter((p) => jam < p.waktuEksekusi + 0.55);
    segmen = segmen.filter((s) => s.x < 1.1);
  }

  /* ------------------------------------------------------------- gambar */

  function ukurUlang() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    lebar = akar.clientWidth || 1;
    tinggi = Math.max(160, Math.round(lebar * (lebar < 560 ? 0.58 : 0.34)));
    kanvas.style.height = `${tinggi}px`;
    kanvas.width = lebar * dpr;
    kanvas.height = tinggi * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function gambar() {
    ctx.clearRect(0, 0, lebar, tinggi);
    const pad = 10;
    const w = lebar - pad * 2;
    const X = (t) => pad + t * w;
    const yUtama = tinggi * 0.46;
    const yBunker = tinggi * 0.2;
    const yLaut = tinggi * 0.76;

    // Pipa utama sampai katup
    ctx.strokeStyle = warna('garis');
    ctx.lineWidth = 10;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(X(0), yUtama);
    ctx.lineTo(X(X_KATUP), yUtama);
    ctx.stroke();

    // Dua cabang keluar. Yang aktif digambar terang, yang terjepit redup —
    // itulah selongsong karet yang dijepit aktuator.
    const gambarCabang = (yAkhir, aktif, label) => {
      ctx.strokeStyle = aktif ? warna('magnet') : warna('garis');
      ctx.globalAlpha = aktif ? 0.9 : 0.45;
      ctx.lineWidth = aktif ? 10 : 6;
      ctx.beginPath();
      ctx.moveTo(X(X_KATUP), yUtama);
      ctx.lineTo(X(X_KATUP + 0.08), yAkhir);
      ctx.lineTo(X(1), yAkhir);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = warna('kabut');
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.fillText(label, X(0.8), yAkhir - 9);
    };
    gambarCabang(yBunker, katupKeBunker, u.labelBunker);
    gambarCabang(yLaut, !katupKeBunker, u.labelLaut);

    // Penanda sensor & katup
    ctx.strokeStyle = warna('gamma');
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(X(X_SENSOR), yUtama - 22);
    ctx.lineTo(X(X_SENSOR), yUtama - 7);
    ctx.stroke();
    ctx.fillStyle = warna('gamma');
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillText(u.labelSensor, X(X_SENSOR) - 12, yUtama - 26);

    ctx.strokeStyle = warna('baja');
    ctx.beginPath();
    ctx.moveTo(X(X_KATUP), yUtama - 22);
    ctx.lineTo(X(X_KATUP), yUtama - 7);
    ctx.stroke();
    ctx.fillStyle = warna('baja');
    ctx.fillText(u.labelKatup, X(X_KATUP) - 10, yUtama - 26);

    // Segmen bubur
    for (const s of segmen) {
      let y = yUtama;
      let x = s.x;
      if (s.hasil === 'bunker') {
        const t = Math.min(1, (s.x - X_KATUP) / 0.08);
        y = yUtama + (yBunker - yUtama) * t;
      } else if (s.hasil === 'laut') {
        const t = Math.min(1, (s.x - X_KATUP) / 0.08);
        y = yUtama + (yLaut - yUtama) * t;
      }
      if (x > 1.02) continue;
      ctx.fillStyle = s.kaya ? warna('monasit') : warna('sedimen');
      ctx.globalAlpha = s.kaya ? 1 : 0.7;
      ctx.beginPath();
      ctx.roundRect(X(x) - 9, y - 5, 18, 10, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  /* ------------------------------------------------------- pembaruan teks */

  function ketepatan() {
    const d = Math.abs(tunda() - TEMPUH);
    if (d <= TOLERANSI) return 'tepat';
    return tunda() < TEMPUH ? 'terlaluCepat' : 'terlaluLambat';
  }

  function perbaruiBacaan() {
    const t = tunda();
    const selisih = t - TEMPUH;
    const kunci = ketepatan();
    const persen = jumlahKaya > 0 ? (jumlahKayaTertangkap / jumlahKaya) * 100 : 0;

    nilaiTunda.textContent = `${t.toFixed(2)} s`;
    bacaanTunda.textContent = `${t.toFixed(2)} s`;
    bacaanSelisih.textContent = `${selisih >= 0 ? '+' : ''}${selisih.toFixed(2)} s`;
    // Penanda "belum ada bacaan" diambil dari content.js, bukan ditulis di sini.
    bacaanTepat.textContent = jumlahKaya > 0 ? `${persen.toFixed(0)}%` : u.nilaiKosong;
    status.textContent = u.status[kunci];
    status.classList.toggle('widget__status--awas', kunci !== 'tepat');
    kanvas.setAttribute('aria-label',
      `${u.padananTeks} ${u.bacaanTunda}: ${t.toFixed(2)} detik, ${u.tundaBenar} ${TEMPUH.toFixed(2)} detik. ${u.status[kunci]}.`);
  }

  /* --------------------------------------------------------------- gelung */

  let jalan = false, terlihat = false, sebelumnya = 0, sejakBacaan = 0;

  const gelung = (kini) => {
    if (!jalan) return;
    const dt = Math.min(0.05, (kini - sebelumnya) / 1000) || 0;
    sebelumnya = kini;
    langkah(dt);
    gambar();
    // Bacaan persen diperbarui beberapa kali per detik saja supaya angkanya
    // terbaca, bukan berkedip tiap frame.
    sejakBacaan += dt;
    if (sejakBacaan > 0.25) { sejakBacaan = 0; perbaruiBacaan(); }
    requestAnimationFrame(gelung);
  };

  const mulai = () => {
    if (jalan || !terlihat || kurangiGerak()) return;
    jalan = true;
    sebelumnya = performance.now();
    requestAnimationFrame(gelung);
  };
  const henti = () => { jalan = false; };

  /** Mode gerak-dikurangi: satu keadaan diam yang tetap menjelaskan idenya —
   *  beberapa segmen tersebar di pipa dengan nasib yang sudah ditentukan. */
  const gambarSekali = () => {
    segmen = [];
    perintah = [];
    jam = 0;
    jumlahKaya = 0;
    jumlahKayaTertangkap = 0;
    // 24 detik: cukup banyak segmen melewati katup agar persentasenya stabil,
    // bukan bergantung pada dua-tiga segmen pertama.
    const dt = 1 / 60;
    for (let i = 0; i < 24 / dt; i++) langkah(dt);
    gambar();
    perbaruiBacaan();
  };

  slider.addEventListener('input', () => {
    // Statistik direset supaya persen mencerminkan setelan yang sedang dipakai,
    // bukan campuran dengan setelan sebelumnya.
    jumlahKaya = 0;
    jumlahKayaTertangkap = 0;
    if (kurangiGerak()) gambarSekali(); else perbaruiBacaan();
  });

  const pengamat = new IntersectionObserver(([e]) => {
    terlihat = e.isIntersecting;
    if (terlihat) mulai(); else henti();
  }, { rootMargin: '10% 0px' });
  pengamat.observe(akar);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) henti(); else mulai();
  });

  new ResizeObserver(() => { ukurUlang(); gambar(); }).observe(akar);

  queueMicrotask(() => {
    ukurUlang();
    const dt = 1 / 60;
    for (let i = 0; i < 5 / dt; i++) langkah(dt);
    gambar();
    perbaruiBacaan();
  });

  return { el: akar, gambarSekali };
}
