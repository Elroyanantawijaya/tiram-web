// js/widgets/empat-sifat.js — simulator "Empat Sifat" (S3, signature).
//
// Argumen inti esai dibuat bisa dimainkan: densitas gagal memisahkan monasit
// dari sesama mineral berat, kerentanan magnetik hanya menuntaskan separuh
// jalan (ilmenit ikut tertahan), konduktivitas butuh syarat yang tidak masuk
// akal di atas kapal (umpan kering), dan hanya radioaktivitas yang benar-benar
// selektif. Posisi tiap partikel dihitung dari field data mineral di
// content.js (densitasNilai/tertahanMagnet/konduktor/radioaktif) — bukan
// di-hardcode per-partikel — supaya perilakunya benar-benar mengikuti data.

import { el, kosongkan, kurangiGerak } from '../dom.js';
import { easeInOutCubic } from '../cinema.js';

const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();

const MODE_URUT = ['densitas', 'magnetik', 'konduktivitas', 'radioaktivitas'];

// Token warna per mineral. --gamma sengaja tidak dipakai di sini — disimpan
// khusus pendar mode Radioaktivitas (disiplin §3.1: kuning bukan warna umum).
const WARNA_MINERAL = {
  monasit: 'monasit',
  zirkon: 'baja',
  ilmenit: 'magnet',
  kasiterit: 'kabut',
  kuarsa: 'sedimen',
};

const WARNA_VERDICT = { merah: 'verdict-merah', kuning: 'gamma', hijau: 'verdict-hijau' };

const lerp = (a, b, t) => a + (b - a) * t;
const mutuRendah = () => window.matchMedia('(max-width: 767px)').matches;

/** Kotak "tidak diketahui" untuk kasiterit di mode Densitas — pojok kanan atas. */
function kotakTidakDiketahui(lebar, tinggi) {
  return { x: lebar * 0.76, y: tinggi * 0.08, w: lebar * 0.18, h: tinggi * 0.26 };
}

function buatPartikel(mineral, n) {
  const arr = [];
  const perJenis = Math.max(1, Math.floor(n / mineral.length));
  for (const m of mineral) {
    for (let i = 0; i < perJenis; i++) {
      arr.push({
        mineral: m,
        x: 0, y: 0, opacity: 1,
        home: { x: 0.5, y: 0.5 },       // posisi netral (mode radioaktivitas), diisi saat ukurUlang
        jitterX: Math.random(),
        jitterY: Math.random(),
        jitterBox: Math.random(),
        r: 2.1 + Math.random() * 1.3,
        faseIdle: Math.random() * Math.PI * 2,
      });
    }
  }
  return arr;
}

function hitungTarget(modeKey, p, lebar, tinggi) {
  const m = p.mineral;
  const pad = lebar * 0.06;
  const tinggiUsable = tinggi - pad * 2;

  if (modeKey === 'densitas') {
    // Kuarsa JUGA punya densitasNilai null (tidak bersumber angka), tapi beda
    // dari kasiterit ia punya dasar kualitatif ("kuarsa ringan", Justifikasi
    // Bagian A) — jadi id kuarsa harus dicek LEBIH DULU, sebelum null generik
    // menjatuhkannya ke kotak "tidak diketahui" bersama kasiterit.
    if (m.id === 'kuarsa') {
      return { x: pad + p.jitterX * (lebar - pad * 2), y: tinggi * 0.14 + p.jitterY * tinggi * 0.09, opacity: 1 };
    }
    if (m.densitasNilai === null) {
      const kb = kotakTidakDiketahui(lebar, tinggi);
      return { x: kb.x + p.jitterBox * kb.w, y: kb.y + p.jitterX * kb.h, opacity: 1 };
    }
    // monasit, ilmenit, zirkon → satu pita sempit, tumpang tindih penuh —
    // ini yang menunjukkan "terlalu mirip untuk dipisah", bukan tiga pita
    // berdekatan yang justru menyiratkan bisa dibedakan.
    return { x: pad + p.jitterX * (lebar - pad * 2), y: tinggi * 0.6 + p.jitterY * tinggi * 0.16, opacity: 1 };
  }

  if (modeKey === 'magnetik') {
    if (m.tertahanMagnet) {
      return { x: pad + p.jitterX * lebar * 0.16, y: pad + p.jitterY * tinggiUsable, opacity: 1 };
    }
    return { x: lebar * 0.6 + p.jitterX * (lebar * 0.94 - lebar * 0.6), y: pad + p.jitterY * tinggiUsable, opacity: 1 };
  }

  if (modeKey === 'konduktivitas') {
    if (m.konduktor === null) {
      return { x: lebar / 2 + (p.jitterX - 0.5) * lebar * 0.1, y: pad + p.jitterY * tinggiUsable, opacity: 1 };
    }
    if (m.konduktor) {
      return { x: lebar * 0.6 + p.jitterX * (lebar * 0.94 - lebar * 0.6), y: pad + p.jitterY * tinggiUsable, opacity: 1 };
    }
    return { x: pad + p.jitterX * lebar * 0.28, y: pad + p.jitterY * tinggiUsable, opacity: 1 };
  }

  // radioaktivitas: posisi netral (home) — mode ini soal pendar, bukan sortir.
  return { x: p.home.x * lebar, y: p.home.y * tinggi, opacity: m.radioaktif ? 1 : 0.14 };
}

export function buatSimulatorEmpatSifat(CONTENT) {
  const s3 = CONTENT.s3;
  const sim = s3.simulator;
  const ui = sim.ui;

  const akar = el('div', { class: 'widget widget--simulator' });

  const kanvas = el('canvas', { class: 'widget__kanvas', role: 'img' });
  const legenda = el('ul', { class: 's3-sim__legenda' }, sim.mineral.map((m) =>
    el('li', {}, [
      el('span', { class: 's3-sim__swatch', style: `background:var(--${WARNA_MINERAL[m.id]})` }),
      el('span', { text: m.nama }),
    ])
  ));

  const tombolMode = MODE_URUT.map((kunci) => el('button', {
    class: 'kendali__tombol', type: 'button', 'data-kursor': 'mainkan',
    'aria-pressed': 'false', text: sim.mode[kunci].label,
    onclick: () => pilihMode(kunci),
  }));

  const verdictBadge = el('span', { class: 's3-sim__verdict-badge' });
  const verdictWadah = el('p', { class: 's3-sim__verdict' }, [
    el('span', { class: 's3-sim__verdict-label mono', text: ui.putusan + ':' }),
    verdictBadge,
  ]);
  const statusPerilaku = el('p', { class: 'widget__status', 'aria-live': 'polite' });

  const petunjuk = el('p', { class: 's3-sim__petunjuk', text: ui.petunjukSebelumSelesai });
  const kesimpulanWadah = el('div', { class: 's3-sim__kesimpulan', hidden: 'hidden' }, [
    el('p', { class: 's3-sim__kesimpulan-teks', text: sim.kesimpulan }),
  ]);

  const badanTabel = el('tbody');
  const tabel = el('table', { class: 's3-sim__tabel' }, [
    el('caption', { text: ui.tabelJudul }),
    el('thead', {}, el('tr', {}, [
      el('th', { text: ui.tabelKolom.sifat }), el('th', { text: ui.tabelKolom.monasit }), el('th', { text: ui.tabelKolom.mineralLain }), el('th', { text: ui.putusan }),
    ])),
    badanTabel,
  ]);
  const barisTabel = s3.tabelSifat.map((row) => {
    const tr = el('tr', {}, [
      el('th', { scope: 'row', text: row.sifat }),
      el('td', { text: row.monasit }),
      el('td', { text: row.mineralLain }),
      el('td', { class: 's3-sim__tabel-verdict', style: `color:var(--${WARNA_VERDICT[row.warnaVerdict]})`, text: row.verdict }),
    ]);
    badanTabel.append(tr);
    return tr;
  });

  akar.append(
    el('p', { class: 'widget__label', text: ui.instruksi }),
    el('div', { class: 's3-sim__tata' }, [
      el('div', { class: 's3-sim__panggung' }, [
        kanvas,
        legenda,
      ]),
      el('div', { class: 's3-sim__samping' }, [
        el('div', { class: 'kendali__gugus', role: 'group', 'aria-label': ui.instruksi }, tombolMode),
        verdictWadah,
        statusPerilaku,
        tabel,
      ]),
    ]),
    petunjuk,
    kesimpulanWadah
  );

  /* ------------------------------------------------------------- keadaan */

  const ctx = kanvas.getContext('2d');
  let lebar = 1, tinggi = 1;
  let partikel = [];
  let modeAktif = null;
  let transisi = null;
  const dicoba = new Set();

  // Radioaktivitas: pulsa gamma dari monasit menuju detektor.
  let cacah = 0;
  let pulsa = [];
  let jamPulsaBerikut = 0;

  let overlayKeringOpacity = 0;
  let overlayKeringTarget = 0;
  let overlayKeringTimer = null;

  function ukurUlang() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    lebar = kanvas.clientWidth || 1;
    tinggi = Math.max(220, Math.round(lebar * (lebar < 560 ? 0.85 : 0.5)));
    kanvas.style.height = `${tinggi}px`;
    kanvas.width = lebar * dpr;
    kanvas.height = tinggi * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad = lebar * 0.06;
    for (const p of partikel) {
      p.home.x = (pad + p.jitterX * (lebar - pad * 2)) / lebar;
      p.home.y = (pad + p.jitterY * (tinggi - pad * 2)) / tinggi;
    }
    if (modeAktif) {
      // Ukuran berubah: tempatkan langsung ke target baru tanpa animasi.
      for (const p of partikel) {
        const t = hitungTarget(modeAktif, p, lebar, tinggi);
        p.x = t.x; p.y = t.y; p.opacity = t.opacity;
      }
      transisi = null;
    }
  }

  function bangunPartikel() {
    const n = mutuRendah() ? 120 : 400;   // §2: dikurangi 70% di bawah 768px
    partikel = buatPartikel(sim.mineral, n);
  }

  /* -------------------------------------------------------------- mode */

  function pilihMode(kunci) {
    if (kunci === modeAktif) return;
    modeAktif = kunci;
    dicoba.add(kunci);

    tombolMode.forEach((t, i) => {
      const aktif = MODE_URUT[i] === kunci;
      t.classList.toggle('kendali__tombol--aktif', aktif);
      t.setAttribute('aria-pressed', String(aktif));
    });
    barisTabel.forEach((tr, i) => tr.classList.toggle('s3-sim__tabel-baris--aktif', i === MODE_URUT.indexOf(kunci)));

    const m = sim.mode[kunci];
    verdictBadge.textContent = m.verdict;
    verdictBadge.style.color = `var(--${WARNA_VERDICT[m.warnaVerdict]})`;
    verdictBadge.style.borderColor = `var(--${WARNA_VERDICT[m.warnaVerdict]})`;
    statusPerilaku.textContent = m.perilaku;
    kanvas.setAttribute('aria-label', `${ui.padananTeks} Mode aktif: ${m.label}. ${m.perilaku} ${ui.putusan}: ${m.verdict}.`);

    if (overlayKeringTimer) clearTimeout(overlayKeringTimer);
    overlayKeringTarget = 0;
    if (kunci === 'konduktivitas') {
      overlayKeringTimer = setTimeout(() => { overlayKeringTarget = 1; }, kurangiGerak() ? 0 : 1000);
    }

    if (dicoba.size >= MODE_URUT.length) {
      petunjuk.hidden = true;
      if (kesimpulanWadah.hidden) {
        kesimpulanWadah.hidden = false;
        if (!kurangiGerak()) {
          kesimpulanWadah.style.opacity = '0';
          requestAnimationFrame(() => { kesimpulanWadah.style.transition = 'opacity 600ms var(--easing)'; kesimpulanWadah.style.opacity = '1'; });
        }
      }
    }

    // Mulai transisi posisi.
    const dari = partikel.map((p) => ({ x: p.x, y: p.y, opacity: p.opacity }));
    const ke = partikel.map((p) => hitungTarget(kunci, p, lebar, tinggi));
    if (kurangiGerak()) {
      partikel.forEach((p, i) => { p.x = ke[i].x; p.y = ke[i].y; p.opacity = ke[i].opacity; });
      transisi = null;
      gambar(0);
    } else {
      transisi = { mulai: performance.now(), durasi: 900, dari, ke };
    }
  }

  /* ------------------------------------------------------------- gambar */

  function gambarKotakTidakDiketahui() {
    if (modeAktif !== 'densitas') return;
    const kb = kotakTidakDiketahui(lebar, tinggi);
    ctx.save();
    ctx.strokeStyle = warna('kabut');
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeRect(kb.x, kb.y, kb.w, kb.h);
    ctx.setLineDash([]);
    ctx.fillStyle = warna('kabut');
    ctx.font = '600 13px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('?', kb.x + kb.w / 2, kb.y - 6);
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillText(ui.tidakDiketahui, kb.x + kb.w / 2, kb.y + kb.h + 14);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  function gambarMedanMagnet(t) {
    if (modeAktif !== 'magnetik') return;
    ctx.save();
    ctx.strokeStyle = warna('kabut');
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.4;
    const n = 5;
    for (let i = 0; i < n; i++) {
      const y = (tinggi / (n + 1)) * (i + 1);
      const geser = kurangiGerak() ? 0 : (Math.sin(t * 0.0016 + i) * 6);
      ctx.beginPath();
      ctx.moveTo(4, y);
      ctx.lineTo(lebar * 0.22 + geser, y);
      ctx.stroke();
      // kepala panah kecil
      ctx.beginPath();
      ctx.moveTo(lebar * 0.22 + geser, y);
      ctx.lineTo(lebar * 0.22 + geser - 6, y - 4);
      ctx.moveTo(lebar * 0.22 + geser, y);
      ctx.lineTo(lebar * 0.22 + geser - 6, y + 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  function gambarOverlayKering() {
    overlayKeringOpacity += (overlayKeringTarget - overlayKeringOpacity) * 0.12;
    if (overlayKeringOpacity < 0.01) return;
    ctx.save();
    ctx.globalAlpha = overlayKeringOpacity;
    const w = Math.min(lebar * 0.62, 260), h = 34;
    const x = (lebar - w) / 2, y = tinggi - h - 10;
    ctx.fillStyle = warna('lambung');
    ctx.strokeStyle = warna('gamma');
    ctx.lineWidth = 1;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = warna('gamma');
    ctx.font = '600 12px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ui.overlayUmpanKering, x + w / 2, y + h / 2 + 4);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  function posisiDetektor() { return { x: lebar - 22, y: tinggi - 22 }; }

  function gambarDetektor() {
    if (modeAktif !== 'radioaktivitas') return;
    const d = posisiDetektor();
    ctx.save();
    ctx.fillStyle = warna('lambung');
    ctx.strokeStyle = warna('gamma');
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = warna('gamma');
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(String(cacah), d.x, d.y + tinggi * 0 + 4);
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillText(ui.cacah, d.x, d.y + 24);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  function perbaruiPulsaRadioaktif(kini, dt) {
    if (modeAktif !== 'radioaktivitas' || kurangiGerak()) return;
    if (kini >= jamPulsaBerikut) {
      const sumberMonasit = partikel.filter((p) => p.mineral.radioaktif);
      if (sumberMonasit.length) {
        const src = sumberMonasit[Math.floor(Math.random() * sumberMonasit.length)];
        const d = posisiDetektor();
        pulsa.push({ x0: src.x, y0: src.y, x1: d.x, y1: d.y, t: 0 });
      }
      jamPulsaBerikut = kini + 250 + Math.random() * 350;
    }
    for (let i = pulsa.length - 1; i >= 0; i--) {
      const p = pulsa[i];
      p.t += dt / 550;
      if (p.t >= 1) { pulsa.splice(i, 1); cacah++; continue; }
      ctx.save();
      ctx.fillStyle = warna('gamma');
      ctx.globalAlpha = 0.9;
      const x = lerp(p.x0, p.x1, p.t), y = lerp(p.y0, p.y1, p.t);
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function gambar(dt) {
    ctx.clearRect(0, 0, lebar, tinggi);

    gambarKotakTidakDiketahui();
    gambarMedanMagnet(performance.now());

    for (const p of partikel) {
      const radioaktifMode = modeAktif === 'radioaktivitas';
      const glow = radioaktifMode && p.mineral.radioaktif;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      if (glow) {
        ctx.shadowColor = warna('gamma');
        ctx.shadowBlur = 9;
        ctx.fillStyle = warna('gamma');
      } else {
        ctx.fillStyle = warna(WARNA_MINERAL[p.mineral.id]);
      }
      const bob = kurangiGerak() ? 0 : Math.sin(performance.now() * 0.0012 + p.faseIdle) * 1.1;
      ctx.beginPath();
      ctx.arc(p.x, p.y + bob, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    gambarOverlayKering();
    gambarDetektor();
    if (dt !== undefined) perbaruiPulsaRadioaktif(performance.now(), dt);
  }

  /* --------------------------------------------------------------- gelung */

  let jalan = false, terlihat = false, sebelumnya = 0;

  function gelung(kini) {
    if (!jalan) return;
    const dt = Math.min(50, kini - sebelumnya) || 16;
    sebelumnya = kini;

    if (transisi) {
      const t = Math.min(1, (kini - transisi.mulai) / transisi.durasi);
      const e = easeInOutCubic(t);
      partikel.forEach((p, i) => {
        p.x = lerp(transisi.dari[i].x, transisi.ke[i].x, e);
        p.y = lerp(transisi.dari[i].y, transisi.ke[i].y, e);
        p.opacity = lerp(transisi.dari[i].opacity, transisi.ke[i].opacity, e);
      });
      if (t >= 1) transisi = null;
    }

    gambar(dt);
    requestAnimationFrame(gelung);
  }

  function mulai() {
    if (jalan || !terlihat || kurangiGerak()) return;
    jalan = true;
    sebelumnya = performance.now();
    requestAnimationFrame(gelung);
  }
  function henti() { jalan = false; }

  const pengamat = new IntersectionObserver(([e]) => {
    terlihat = e.isIntersecting;
    if (terlihat) mulai(); else henti();
  }, { rootMargin: '10% 0px' });
  pengamat.observe(akar);
  document.addEventListener('visibilitychange', () => { if (document.hidden) henti(); else mulai(); });
  new ResizeObserver(() => { ukurUlang(); if (!jalan) gambar(0); }).observe(akar);

  // Inisialisasi.
  bangunPartikel();
  queueMicrotask(() => {
    ukurUlang();
    pilihMode('densitas');
    if (kurangiGerak()) gambar(0);
  });

  return { el: akar };
}
