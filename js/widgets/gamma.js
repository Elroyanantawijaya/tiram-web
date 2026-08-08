// js/widgets/gamma.js — widget simulasi komponen 3 (Sensor gamma + PLC).
//
// Yang harus terlihat, sesuai §S5: spektrum terbentuk dari cacah yang
// terkumpul, dan ketelitiannya mengikuti statistik Poisson — ketidakpastian
// relatif ≈ 1/√N. Konsekuensinya nyata dan itulah pointnya: cacah rendah
// memaksa waktu ukur lebih lama, dan itu membatasi laju alir.
//
// Spektrum di sini dibangkitkan cacah-per-cacah (sampling Poisson pada tiap
// salur), bukan digambar sebagai kurva mulus lalu ditambahi derau. Dengan
// begitu bentuk deraunya memang derau cacah, dan 1/√N yang ditampilkan panel
// benar-benar menggambarkan apa yang terlihat di layar.

import { el, kurangiGerak } from '../dom.js';

const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();

const N_SALUR = 128;
const E_MAKS = 3000;                       // keV — sumbu energi
const E_PB212 = 239;                       // §A.2
const E_TL208 = 2610;                      // §A.2
const LAJU_DASAR = 42;                     // cacah/detik pada seluruh spektrum

/** Bentuk spektrum harapan (belum berderau): dua puncak Gauss + latar luruh. */
function harapanSalur(i) {
  const e = (i + 0.5) * (E_MAKS / N_SALUR);
  const gauss = (pusat, lebar, tinggi) => tinggi * Math.exp(-Math.pow((e - pusat) / lebar, 2));
  const latar = 0.55 * Math.exp(-e / 900);
  return gauss(E_PB212, 70, 1.0) + gauss(E_TL208, 150, 0.42) + latar;
}

const HARAPAN = Array.from({ length: N_SALUR }, (_, i) => harapanSalur(i));
const HARAPAN_TOTAL = HARAPAN.reduce((a, b) => a + b, 0);

/** Sampel Poisson sederhana (Knuth). Cukup untuk λ kecil seperti di sini. */
function poisson(lambda) {
  if (lambda > 30) {
    // Untuk λ besar, hampiran normal sudah sangat baik dan jauh lebih murah.
    const u1 = Math.random() || 1e-9;
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return Math.max(0, Math.round(lambda + z * Math.sqrt(lambda)));
  }
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

export function buatWidgetGamma(k) {
  const w = k.widget;
  const u = w.ui;

  const akar = el('div', { class: 'widget widget--gamma' });
  const kanvas = el('canvas', { class: 'widget__kanvas', role: 'img', 'aria-label': u.padananTeks });

  const nilaiWaktu = el('output', { class: 'widget__nilai mono', for: 'cacah-c3' });
  const slider = el('input', {
    class: 'widget__slider', type: 'range', id: 'cacah-c3',
    min: '1', max: '600', value: '60', step: '1', 'data-kursor': 'mainkan',
  });

  const bacaanCacah = el('span', { class: 'widget__angka mono' });
  const bacaanKetidakpastian = el('span', { class: 'widget__angka mono' });
  const status = el('p', { class: 'widget__status mono', 'aria-live': 'polite' });
  const catatan = el('p', { class: 'widget__pengingat', text: u.catatanKetelitian });

  const rantai = el('ul', { class: 'widget__ilmu' },
    w.rantaiFisika.map((t) => el('li', { class: 'mono', text: t })));

  akar.append(
    el('div', { class: 'widget__kendali' }, [
      el('label', { class: 'widget__label', for: 'cacah-c3', text: u.slider }),
      el('div', { class: 'widget__baris' }, [slider, nilaiWaktu]),
    ]),
    kanvas,
    el('div', { class: 'widget__bacaan' }, [
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanCacah }), bacaanCacah]),
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanKetidakpastian }), bacaanKetidakpastian]),
    ]),
    status,
    catatan,
    rantai
  );

  /* ------------------------------------------------------------- keadaan */

  const ctx = kanvas.getContext('2d');
  let lebar = 1, tinggi = 1;
  let spektrum = new Array(N_SALUR).fill(0);
  let totalCacah = 0;
  let terkumpul = 0;   // detik yang sudah dicacah dalam animasi

  const waktuTarget = () => slider.valueAsNumber / 10;  // detik

  /** Tambahkan cacah senilai `detik` ke spektrum. */
  function cacah(detik) {
    if (detik <= 0) return;
    for (let i = 0; i < N_SALUR; i++) {
      const lambda = (HARAPAN[i] / HARAPAN_TOTAL) * LAJU_DASAR * detik;
      const n = poisson(lambda);
      spektrum[i] += n;
      totalCacah += n;
    }
  }

  function reset() {
    spektrum = new Array(N_SALUR).fill(0);
    totalCacah = 0;
    terkumpul = 0;
  }

  /* ------------------------------------------------------------- gambar */

  function ukurUlang() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    lebar = akar.clientWidth || 1;
    tinggi = Math.max(170, Math.round(lebar * (lebar < 560 ? 0.66 : 0.38)));
    kanvas.style.height = `${tinggi}px`;
    kanvas.width = lebar * dpr;
    kanvas.height = tinggi * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function gambar() {
    ctx.clearRect(0, 0, lebar, tinggi);
    const padKiri = 8, padKanan = 8, padAtas = 10, padBawah = 22;
    const w = lebar - padKiri - padKanan;
    const h = tinggi - padAtas - padBawah;

    ctx.strokeStyle = warna('garis');
    ctx.lineWidth = 1;
    ctx.strokeRect(padKiri + 0.5, padAtas + 0.5, w - 1, h - 1);

    const maks = Math.max(4, ...spektrum);
    const X = (i) => padKiri + (i / (N_SALUR - 1)) * w;
    const Y = (v) => padAtas + h - (v / maks) * (h - 4);

    // Latar yang dikurangi — digambar sebagai daerah redup di bawah kurva
    // supaya "latar dikurangi" pada spesifikasi punya wujud visual.
    ctx.fillStyle = warna('garis');
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(X(0), padAtas + h);
    for (let i = 0; i < N_SALUR; i++) {
      const e = (i + 0.5) * (E_MAKS / N_SALUR);
      const latar = 0.55 * Math.exp(-e / 900);
      const skala = totalCacah > 0 ? (latar / HARAPAN_TOTAL) * totalCacah : 0;
      ctx.lineTo(X(i), Y(skala));
    }
    ctx.lineTo(X(N_SALUR - 1), padAtas + h);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Spektrum tercacah
    ctx.strokeStyle = warna('gamma');
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i < N_SALUR; i++) {
      const px = X(i), py = Y(spektrum[i]);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Penanda kedua puncak
    ctx.font = '9px "IBM Plex Mono", monospace';
    const tandaiPuncak = (energi, label) => {
      const i = (energi / E_MAKS) * (N_SALUR - 1);
      ctx.strokeStyle = warna('kabut');
      ctx.setLineDash([2, 3]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(X(i), padAtas + 2);
      ctx.lineTo(X(i), padAtas + h - 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = warna('kabut');
      const lebarLabel = ctx.measureText(label).width;
      const x = Math.min(X(i) + 4, padKiri + w - lebarLabel - 2);
      ctx.fillText(label, x, padAtas + 11);
    };
    tandaiPuncak(E_PB212, u.labelPuncakTh);
    tandaiPuncak(E_TL208, u.labelPuncakTl);

    // Sumbu energi
    ctx.fillStyle = warna('kabut');
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillText(u.sumbuEnergi, padKiri, tinggi - 6);
    ctx.fillText(`${E_MAKS} keV`, padKiri + w - 58, tinggi - 6);
    ctx.fillText(u.labelLatar, padKiri + w * 0.42, tinggi - 6);
  }

  /* ------------------------------------------------------- pembaruan teks */

  function perbaruiBacaan() {
    // Ketidakpastian relatif Poisson pada puncak yang menjadi dasar keputusan.
    const ketidakpastian = totalCacah > 0 ? (1 / Math.sqrt(totalCacah)) * 100 : 100;
    const cukup = ketidakpastian <= 5;

    nilaiWaktu.textContent = `${waktuTarget().toFixed(1)} s`;
    bacaanCacah.textContent = totalCacah.toLocaleString('id-ID');
    bacaanKetidakpastian.textContent = `±${ketidakpastian.toFixed(1)}%`;
    status.textContent = cukup ? u.status.cukup : u.status.kurang;
    status.classList.toggle('widget__status--awas', !cukup);
    kanvas.setAttribute('aria-label',
      `${u.padananTeks} ${u.slider}: ${waktuTarget().toFixed(1)} detik. ` +
      `${u.bacaanCacah}: ${totalCacah}. ${u.bacaanKetidakpastian}: ±${ketidakpastian.toFixed(1)}%. ` +
      (cukup ? u.status.cukup : u.status.kurang) + '.');
  }

  /* --------------------------------------------------------------- gelung */

  let jalan = false, terlihat = false, sebelumnya = 0;

  const gelung = (kini) => {
    if (!jalan) return;
    const dt = Math.min(0.05, (kini - sebelumnya) / 1000) || 0;
    sebelumnya = kini;

    // Cacah terkumpul maju sampai menyentuh waktu yang disetel, lalu berhenti —
    // spektrum "matang" dan tinggal dibaca, tidak terus bertambah tanpa batas.
    const target = waktuTarget();
    if (terkumpul < target) {
      // Dipercepat 4× terhadap waktu nyata supaya menunggu 60 detik tidak
      // berarti menonton 60 detik; hubungan N ↔ 1/√N tetap utuh.
      const maju = Math.min(dt * 4, target - terkumpul);
      cacah(maju);
      terkumpul += maju;
      gambar();
      perbaruiBacaan();
    }
    requestAnimationFrame(gelung);
  };

  const mulai = () => {
    if (jalan || !terlihat || kurangiGerak()) return;
    jalan = true;
    sebelumnya = performance.now();
    requestAnimationFrame(gelung);
  };
  const henti = () => { jalan = false; };

  /** Mode gerak-dikurangi: seluruh cacah dikumpulkan sekaligus, tanpa animasi. */
  const gambarSekali = () => {
    reset();
    cacah(waktuTarget());
    terkumpul = waktuTarget();
    gambar();
    perbaruiBacaan();
  };

  slider.addEventListener('input', () => {
    if (kurangiGerak()) { gambarSekali(); return; }
    // Waktu diturunkan berarti spektrum lama tidak lagi sah — dicacah ulang.
    if (waktuTarget() < terkumpul) { reset(); gambar(); perbaruiBacaan(); }
    else perbaruiBacaan();
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
    cacah(1.5);      // sedikit cacah awal supaya kanvas tidak kosong melompong
    terkumpul = 1.5;
    gambar();
    perbaruiBacaan();
  });

  return { el: akar, gambarSekali };
}
