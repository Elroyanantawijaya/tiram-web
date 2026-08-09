// js/main.js — orkestrasi: preloader, smooth scroll, ScrollTrigger, rel pipa,
// kursor retikel, tooltip sitasi. Tidak memuat teks isi; semuanya dari content.js.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { CONTENT } from '../data/content.js';
import { el, kosongkan, kurangiGerak, formatAngka, daftarkanLenis, gulirKe } from './dom.js';
import { rakitS1 } from './sections/s1-hero.js';
import { rakitS2 } from './sections/s2-pendahuluan.js';
import { rakitS3 } from './sections/s3-argumen.js';
import { rakitS4 } from './sections/s4-solusi.js';
import { rakitS5 } from './sections/s5-komponen.js';
import { rakitS6 } from './sections/s6-integrasi.js';
import { rakitS7 } from './sections/s7-sinema.js';
import { rakitS8 } from './sections/s8-kelayakan.js';
import { rakitS9 } from './sections/s9-peta-jalan.js';
import { rakitS10 } from './sections/s10-referensi.js';

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------- smooth scroll */

function siapkanScroll() {
  if (kurangiGerak()) return null;
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  daftarkanLenis(lenis);
  return lenis;
}

/* ------------------------------------------------------------------- preloader */

function jalankanPreloader(saatSelesai) {
  const pre = document.getElementById('preloader');
  if (!pre) { saatSelesai(); return; }

  const cacah = pre.querySelector('.preloader__cacah');
  const bar = pre.querySelector('.preloader__progres-bar');
  const label = pre.querySelector('.preloader__label');
  const wordmark = pre.querySelector('.preloader__wordmark');
  const wadahSpektrum = pre.querySelector('.preloader__spektrum');

  label.textContent = CONTENT.s0.label;
  wordmark.textContent = CONTENT.s0.wordmark;

  // Spektrum kecil yang terbentuk dari kiri ke kanan.
  const kanvas = el('canvas', { class: 'preloader__kanvas', 'aria-hidden': 'true' });
  wadahSpektrum.append(kanvas);
  const dpr = Math.min(window.devicePixelRatio, 2);
  const lebar = wadahSpektrum.clientWidth || 320;
  const tinggi = wadahSpektrum.clientHeight || 64;
  kanvas.width = lebar * dpr;
  kanvas.height = tinggi * dpr;
  const ctx = kanvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // §S0: maksimum 2,2 detik — dan kalau aset sudah siap lebih cepat, percepat.
  // Anggaran di bawah ini mencakup animasi keluar, sehingga total selalu < 2200 ms.
  const MS_MIN = 600;                              // agar tidak sekadar berkedip
  const MS_MAKS = 2200;                            // batas keras, termasuk keluar
  const MS_KELUAR = 420;                           // --durasi-transisi
  // Saat paling lambat mulai keluar. Margin 60 ms menjaga kasus terburuk
  // (aset tak kunjung siap) tetap di bawah MS_MAKS, bukan pas di angkanya.
  const MS_KELUAR_TERAKHIR = MS_MAKS - MS_KELUAR - 60;

  const mulai = performance.now();
  performance.mark('preloader-mulai');
  const diam = kurangiGerak();

  // "Aset siap" = font terpasang dan seluruh sumber daya halaman selesai dimuat.
  let asetSiap = false;
  Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((r) => window.addEventListener('load', r, { once: true })),
  ]).then(() => { asetSiap = true; });

  const gambarSpektrum = (kemajuan) => {
    ctx.clearRect(0, 0, lebar, tinggi);
    ctx.strokeStyle = '#E9B93A';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const sampai = Math.floor(lebar * kemajuan);
    for (let x = 0; x <= sampai; x++) {
      const t = x / lebar;
      // Dua puncak — sekadar bentuk spektrum, bukan data terukur.
      const puncak = Math.exp(-Math.pow((t - 0.22) / 0.05, 2)) * 0.85
                   + Math.exp(-Math.pow((t - 0.68) / 0.035, 2)) * 0.5;
      const latar = 0.16 * Math.exp(-t * 1.7);
      const derau = diam ? 0 : (Math.random() - 0.5) * 0.07;
      const y = tinggi - (puncak + latar + derau) * tinggi * 0.9;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const tutup = () => {
    pre.remove();
    performance.mark('preloader-selesai');
    performance.measure('preloader', 'preloader-mulai', 'preloader-selesai');
    saatSelesai();
  };

  const selesai = () => {
    if (diam) { tutup(); return; }
    // Keluar: layar terangkat seperti permukaan air yang tersibak.
    gsap.to(pre, {
      yPercent: -100,
      duration: MS_KELUAR / 1000,
      ease: 'power4.inOut',
      onComplete: tutup,
    });
  };

  let kemajuan = 0;
  let sebelumnya = mulai;

  const langkah = (kini) => {
    const dt = Math.min(64, kini - sebelumnya);
    sebelumnya = kini;
    const t = kini - mulai;

    // Sebelum aset siap kemajuan hanya merayap dan tidak pernah menyentuh penuh;
    // begitu siap ia diselesaikan cepat, lalu preloader keluar.
    const atap = asetSiap ? 1 : 0.82;
    const laju = asetSiap ? 0.0055 : 0.00045; // bagian per milidetik
    kemajuan = Math.min(atap, kemajuan + laju * dt);

    bar.style.width = `${(kemajuan * 100).toFixed(1)}%`;

    // Cacah berdetak dengan derau Poisson yang terlihat.
    const dasar = kemajuan * 8400;
    const nilai = diam ? dasar : dasar + (Math.random() - 0.5) * Math.sqrt(Math.max(dasar, 1)) * 2.4;
    cacah.textContent = formatAngka(Math.max(0, Math.round(nilai)), 0);
    gambarSpektrum(kemajuan);

    const rampung = asetSiap && kemajuan >= 1 && t >= MS_MIN;
    if (rampung || t >= MS_KELUAR_TERAKHIR) selesai();
    else requestAnimationFrame(langkah);
  };
  requestAnimationFrame(langkah);
}

/* --------------------------------------------------------------- kursor retikel */

function siapkanKursor() {
  if (!window.matchMedia('(pointer: fine)').matches || kurangiGerak()) return;

  const retikel = el('div', { class: 'retikel', 'aria-hidden': 'true' }, [
    el('span', { class: 'retikel__cincin' }),
    el('span', { class: 'retikel__label mono' }),
  ]);
  document.body.append(retikel);
  const labelNode = retikel.querySelector('.retikel__label');

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    const atas = e.target.closest('[data-kursor]');
    retikel.classList.toggle('retikel--aktif', !!atas);
    labelNode.textContent = atas ? (CONTENT.ui.kursor[atas.dataset.kursor] ?? '') : '';
  }, { passive: true });

  const gerak = () => {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    retikel.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(gerak);
  };
  requestAnimationFrame(gerak);
}

/* ------------------------------------------------------------------- rel pipa */

function siapkanRelPipa() {
  const rel = document.getElementById('rel-pipa');
  if (!rel) return;
  kosongkan(rel);
  rel.setAttribute('aria-label', CONTENT.ui.navLabel);

  const pipa = el('div', { class: 'rel__pipa', 'aria-hidden': 'true' }, [
    el('div', { class: 'rel__bubur' }),
  ]);
  const bubur = pipa.querySelector('.rel__bubur');

  const daftar = el('ul', { class: 'rel__daftar' });
  const titik = [];
  for (const n of CONTENT.ui.nav) {
    const tombol = el('button', {
      class: 'rel__titik',
      type: 'button',
      'aria-label': n.label,
      title: n.label,
      'data-kursor': 'buka',
      onclick: () => gulirKe(document.getElementById(n.id), 0),
    });
    daftar.append(el('li', {}, tombol));
    titik.push({ tombol, id: n.id });
  }

  rel.append(pipa, daftar);

  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { bubur.style.transform = `scaleY(${self.progress})`; },
  });

  for (const t of titik) {
    const section = document.getElementById(t.id);
    if (!section) continue;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => t.tombol.classList.toggle('rel__titik--aktif', self.isActive),
    });
  }

  /* --- sambungan bernomor 1–5 (§3.4b) ---
     Elemen terpisah dari sepuluh titik navigasi di atas: ini menandai kelima
     komponen, bukan section. Letaknya di sepanjang pipa mengikuti posisi
     komponen itu di dalam dokumen, jadi sambungan yang berdenyut selalu
     sejajar dengan ketinggian bubur yang sedang naik. */
  const rs = CONTENT.ui.relSambungan;
  const wadahSambungan = el('div', { class: 'rel__sambungan-lapis', 'aria-label': rs.label, role: 'group' });
  const sambungan = [];

  for (const k of CONTENT.s5.komponen) {
    const sasaran = document.querySelector(`[data-component-id="${k.id}"]`);
    if (!sasaran) continue;
    const tombol = el('button', {
      class: 'rel__sambungan',
      type: 'button',
      'aria-label': `${rs.lompatKe} ${k.nomor}: ${k.nama}`,
      title: `${k.nomor}. ${k.nama}`,
      'data-kursor': 'buka',
      text: String(k.nomor),
      onclick: () => gulirKe(sasaran, -80),
    });
    wadahSambungan.append(tombol);
    sambungan.push({ tombol, sasaran });
  }
  rel.append(wadahSambungan);

  // Posisi tiap sambungan = posisi komponen sebagai pecahan tinggi dokumen,
  // dihitung ulang tiap ScrollTrigger.refresh() supaya tetap benar setelah
  // pin S2e disisipkan atau lebar jendela berubah.
  const tempatkan = () => {
    const tinggiDok = document.documentElement.scrollHeight - window.innerHeight;
    if (tinggiDok <= 0) return;
    for (const s of sambungan) {
      const atas = s.sasaran.getBoundingClientRect().top + window.scrollY;
      const pecahan = Math.min(1, Math.max(0, atas / tinggiDok));
      s.tombol.style.top = `calc(12vh + ${(pecahan * 76).toFixed(2)}vh)`;
    }
  };
  tempatkan();
  ScrollTrigger.addEventListener('refresh', tempatkan);

  for (const s of sambungan) {
    ScrollTrigger.create({
      trigger: s.sasaran,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => s.tombol.classList.toggle('rel__sambungan--aktif', self.isActive),
    });
  }
}

/* ------------------------------------------------------------------ watermark */

// Penanda pembuat di sudut kiri atas. Dipasang position:fixed supaya ia tetap di
// sana sepanjang halaman digulir. Diberi latar sendiri, bukan sekadar warna teks,
// sebab ia juga melintas di atas S8 yang latarnya terang — tanpa latar itu
// kontrasnya jatuh persis di section tersebut.
function pasangWatermark() {
  const teks = CONTENT.ui.watermark;
  if (!teks) return;
  document.body.append(el('p', { class: 'watermark mono', text: teks }));
}

/* --------------------------------------------------------------- tooltip sitasi */

function siapkanTooltipSitasi() {
  const tip = el('div', { class: 'tooltip-sitasi', role: 'tooltip', hidden: 'hidden' });
  document.body.append(tip);

  const tampil = (t) => {
    const teks = t.getAttribute('title') || t.dataset.entri;
    if (!teks) return;
    if (t.hasAttribute('title')) { t.dataset.entri = teks; t.removeAttribute('title'); }
    tip.textContent = teks;
    tip.hidden = false;
    const r = t.getBoundingClientRect();
    tip.style.left = `${Math.min(Math.max(12, r.left), window.innerWidth - tip.offsetWidth - 12)}px`;
    tip.style.top = `${r.bottom + 10}px`;
  };
  const sembunyi = () => { tip.hidden = true; };

  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('.sitasi');
    if (t) tampil(t); else if (!e.target.closest('.tooltip-sitasi')) sembunyi();
  });
  document.addEventListener('focusin', (e) => {
    const t = e.target.closest('.sitasi');
    if (t) tampil(t); else sembunyi();
  });
  window.addEventListener('scroll', sembunyi, { passive: true });
}

/* ------------------------------------------------------------------ bootstrap */

function mulai() {
  document.documentElement.classList.add('js-siap');
  const lenis = siapkanScroll();
  siapkanKursor();
  pasangWatermark();
  siapkanTooltipSitasi();

  const s1 = rakitS1(CONTENT);
  rakitS2(CONTENT);
  rakitS3(CONTENT);
  rakitS4(CONTENT);
  rakitS5(CONTENT);
  rakitS6(CONTENT);
  rakitS7(CONTENT);
  rakitS8(CONTENT);
  rakitS9(CONTENT);
  rakitS10(CONTENT);

  siapkanRelPipa();
  ScrollTrigger.refresh();
  // siapkanScroll() membuat Lenis sebelum section-section di atas mengisi
  // kontennya, jadi dimensi tinggi yang di-cache-nya jauh lebih pendek
  // daripada dokumen sesungguhnya — resize() eksplisit di sini menyamakannya,
  // bukan mengandalkan timing ResizeObserver bawaan Lenis yang baru sempat
  // jalan belakangan. Tanpa ini, gulirKe()/lenis.scrollTo() ke section jauh
  // (S4 ke bawah) diam-diam macet di scrollY 0 — terukur langsung, bukan dugaan.
  lenis?.resize();

  jalankanPreloader(() => {
    s1?.animasikan();
    ScrollTrigger.refresh();
    lenis?.resize();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulai);
else mulai();
