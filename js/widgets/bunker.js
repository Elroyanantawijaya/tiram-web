// js/widgets/bunker.js — widget simulasi komponen 5 (Bunker berperisai).
//
// Yang harus terlihat, sesuai §S5: peredaman gamma mengikuti serapan
// eksponensial I = I₀·e^(−µx). Sengaja ditampilkan sebagai perbandingan
// terhadap I₀ (nisbah tanpa satuan), bukan sebagai laju dosis dalam µSv/jam:
// angka dosis mutlak menuntut aktivitas sumber yang nyata, dan itu justru
// yang dokumen sumber tolak untuk dipaku — lihat `catatanWajib`.

import { el, kurangiGerak } from '../dom.js';

const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();

// Koefisien atenuasi linear timbal untuk gamma berenergi menengah, orde
// besaran yang lazim dipakai dalam perhitungan perisai (cm⁻¹). Dipakai hanya
// untuk memberi bentuk kurva yang benar; angka mutlaknya tidak diklaim sebagai
// hasil kajian keselamatan mana pun.
const MU = 1.2;
const X_MAKS = 6;   // cm

const tembus = (x) => Math.exp(-MU * x);
const LAPIS_NILAI_PARUH = Math.LN2 / MU;   // cm untuk menurunkan intensitas separuh

export function buatWidgetBunker(k) {
  const w = k.widget;
  const u = w.ui;

  const akar = el('div', { class: 'widget widget--bunker' });
  const kanvas = el('canvas', { class: 'widget__kanvas', role: 'img', 'aria-label': u.padananTeks });

  const nilaiTebal = el('output', { class: 'widget__nilai mono', for: 'perisai-c5' });
  const slider = el('input', {
    class: 'widget__slider', type: 'range', id: 'perisai-c5',
    min: '0', max: '600', value: '180', step: '5', 'data-kursor': 'mainkan',
  });

  const bacaanTembus = el('span', { class: 'widget__angka mono' });
  const bacaanLapis = el('span', { class: 'widget__angka mono' });
  const status = el('p', { class: 'widget__status mono', 'aria-live': 'polite' });
  const catatan = el('p', { class: 'widget__pengingat', text: w.catatanWajib });

  const asas = el('div', { class: 'widget__asas' }, [
    el('p', { class: 'eyebrow', text: u.asasJudul }),
    el('ul', { class: 'widget__ilmu' }, u.asasProteksi.map((t) => el('li', { class: 'mono', text: t }))),
  ]);

  akar.append(
    el('div', { class: 'widget__kendali' }, [
      el('label', { class: 'widget__label', for: 'perisai-c5', text: u.slider }),
      el('div', { class: 'widget__baris' }, [slider, nilaiTebal]),
    ]),
    kanvas,
    el('div', { class: 'widget__bacaan' }, [
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanTembus }), bacaanTembus]),
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanLapisNilai }), bacaanLapis]),
    ]),
    status,
    catatan,
    asas
  );

  /* ------------------------------------------------------------- keadaan */

  const ctx = kanvas.getContext('2d');
  let lebar = 1, tinggi = 1;
  const foton = [];
  const N_FOTON = 90;

  const tebal = () => slider.valueAsNumber / 100;   // cm

  const buatFoton = () => ({
    x: 0,
    y: 0.18 + Math.random() * 0.64,
    v: 0.32 + Math.random() * 0.26,
    diserap: false,
    xSerap: 0,
  });

  for (let i = 0; i < N_FOTON; i++) {
    const f = buatFoton();
    f.x = Math.random();
    foton.push(f);
  }

  // Dinding menempati pita ini dalam koordinat 0..1.
  const X_DINDING_0 = 0.4;
  const X_DINDING_1 = 0.62;

  function langkah(dt) {
    const t = tembus(tebal());
    for (const f of foton) {
      if (f.diserap) {
        // Foton yang terserap memudar lalu diganti yang baru.
        f.pudar = (f.pudar ?? 1) - dt * 2.2;
        if (f.pudar <= 0) Object.assign(f, buatFoton(), { pudar: undefined });
        continue;
      }
      const xLama = f.x;
      f.x += f.v * dt;
      // Nasib foton diputuskan sekali, saat memasuki dinding: lolos dengan
      // peluang e^(−µx) — persis definisi peredamannya.
      if (xLama < X_DINDING_0 && f.x >= X_DINDING_0 && Math.random() > t) {
        f.diserap = true;
        // Titik serap tersebar di dalam tebal dinding, bukan semua di tepi.
        f.xSerap = X_DINDING_0 + Math.random() * (X_DINDING_1 - X_DINDING_0);
        f.pudar = 1;
      }
      if (f.x > 1.05) Object.assign(f, buatFoton());
    }
  }

  /* ------------------------------------------------------------- gambar */

  function ukurUlang() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    lebar = akar.clientWidth || 1;
    tinggi = Math.max(165, Math.round(lebar * (lebar < 560 ? 0.6 : 0.34)));
    kanvas.style.height = `${tinggi}px`;
    kanvas.width = lebar * dpr;
    kanvas.height = tinggi * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function gambar() {
    ctx.clearRect(0, 0, lebar, tinggi);
    const pad = 8;
    const w = lebar - pad * 2;
    const h = tinggi - pad * 2 - 14;
    const X = (t) => pad + t * w;
    const Y = (t) => pad + t * h;

    // Ruang bunker (sumber)
    ctx.fillStyle = warna('monasit');
    ctx.globalAlpha = 0.16;
    ctx.fillRect(X(0), Y(0), w * X_DINDING_0, h);
    ctx.globalAlpha = 1;

    // Dinding berperisai — tebalnya digambar sebanding setelan slider, jadi
    // pengguna melihat dindingnya benar-benar menebal, bukan cuma angka berubah.
    const fr = tebal() / X_MAKS;
    const x0 = X(X_DINDING_0);
    const wDinding = (X(X_DINDING_1) - x0) * (0.12 + fr * 0.88);
    ctx.fillStyle = warna('baja');
    ctx.globalAlpha = 0.42;
    ctx.fillRect(x0, Y(0), wDinding, h);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = warna('baja');
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x0 + 0.5, Y(0) + 0.5, wDinding - 1, h - 1);

    // Foton
    for (const f of foton) {
      const x = f.diserap ? X(f.xSerap) : X(f.x);
      const y = Y(f.y);
      ctx.globalAlpha = f.diserap ? Math.max(0, f.pudar ?? 0) * 0.9 : 0.9;
      ctx.strokeStyle = warna('gamma');
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x - 5, y);
      ctx.lineTo(x + 5, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Label
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillStyle = warna('kabut');
    ctx.fillText(u.labelSumber, X(0.01), tinggi - 4);
    ctx.fillText(u.labelLuar, X(0.72), tinggi - 4);
    ctx.fillStyle = warna('baja');
    ctx.fillText(u.rumus, X(0.01), Y(0) + 12);
  }

  /* ------------------------------------------------------- pembaruan teks */

  function perbaruiBacaan() {
    const x = tebal();
    const t = tembus(x);
    const lapis = x / LAPIS_NILAI_PARUH;
    const cukupTebal = t < 0.1;

    nilaiTebal.textContent = `${x.toFixed(2)} cm`;
    // Di bawah 0,1% angka desimal biasa jadi tidak informatif — pakai notasi
    // ilmiah supaya peluruhan eksponensialnya tetap terbaca.
    bacaanTembus.textContent = t < 0.001 ? t.toExponential(1) : `${(t * 100).toFixed(2)}%`;
    bacaanLapis.textContent = `${lapis.toFixed(1)}×`;
    status.textContent = cukupTebal ? u.status.tebal : u.status.tipis;
    status.classList.toggle('widget__status--awas', !cukupTebal);
    kanvas.setAttribute('aria-label',
      `${u.padananTeks} ${u.slider}: ${x.toFixed(2)} cm. ${u.bacaanTembus}: ` +
      `${t < 0.001 ? t.toExponential(1) : (t * 100).toFixed(2) + '%'}. ` +
      (cukupTebal ? u.status.tebal : u.status.tipis) + '.');
  }

  /* --------------------------------------------------------------- gelung */

  let jalan = false, terlihat = false, sebelumnya = 0;

  const gelung = (kini) => {
    if (!jalan) return;
    const dt = Math.min(0.05, (kini - sebelumnya) / 1000) || 0;
    sebelumnya = kini;
    langkah(dt);
    gambar();
    requestAnimationFrame(gelung);
  };

  const mulai = () => {
    if (jalan || !terlihat || kurangiGerak()) return;
    jalan = true;
    sebelumnya = performance.now();
    requestAnimationFrame(gelung);
  };
  const henti = () => { jalan = false; };

  /** Mode gerak-dikurangi: sebaran foton mantap, tanpa animasi. */
  const gambarSekali = () => {
    const t = tembus(tebal());
    for (const f of foton) {
      f.pudar = undefined;
      if (Math.random() > t) {
        f.diserap = true;
        f.xSerap = X_DINDING_0 + Math.random() * (X_DINDING_1 - X_DINDING_0);
        f.pudar = 0.85;
      } else {
        f.diserap = false;
        f.x = Math.random();
      }
    }
    gambar();
    perbaruiBacaan();
  };

  slider.addEventListener('input', () => {
    for (const f of foton) if (f.diserap) { f.diserap = false; f.x = Math.random() * 0.35; f.pudar = undefined; }
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

  queueMicrotask(() => { ukurUlang(); gambar(); perbaruiBacaan(); });

  return { el: akar, gambarSekali };
}
