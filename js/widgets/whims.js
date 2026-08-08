// js/widgets/whims.js — widget simulasi komponen 2 (Pemisah magnetik WHIMS).
//
// Inti yang harus terlihat, sesuai §S5: efisiensi tangkap jatuh pada butir
// sangat halus. Itu bukan angka yang dikarang, melainkan akibat langsung dari
// perbandingan dua gaya yang disebut blok "ilmu" komponen ini:
//
//   gaya magnet ~ V · χ · B · ∇B   →  sebanding d³
//   gaya seret  ~ 6πηrv (Stokes)   →  sebanding d
//
// sehingga rasio tangkap ~ d². Turunkan d sepuluh kali, rasio itu jatuh seratus
// kali. Widget ini memakai rasio tersebut apa adanya sebagai penentu apakah
// sebuah butir tertangkap, bukan kurva efisiensi yang dipasang manual.

import { el, kurangiGerak } from '../dom.js';

const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();

const D_MIN = 5;      // µm — batas slider bawah, sesuai spesifikasi widget
const D_MAKS = 500;   // µm — batas slider atas
const B_MAKS = 2;     // Tesla — §A.2 menyebut kebutuhan 1–2 T

// Titik acuan kalibrasi: pada butir 150 µm dan medan 1,5 T (angka yang disebut
// esai) tangkapan sudah mantap. Konstanta dipilih supaya di titik itu rasio
// gaya bernilai jauh di atas 1, dan melemah dengan d² seperti seharusnya.
const D_ACUAN = 150;
const B_ACUAN = 1.5;
const RASIO_ACUAN = 12;

/** Rasio gaya magnet terhadap gaya seret. Sebanding d² dan B². */
function rasioGaya(dMikron, bTesla) {
  const d = dMikron / D_ACUAN;
  const b = bTesla / B_ACUAN;
  return RASIO_ACUAN * d * d * b * b;
}

/** Peluang sebuah butir tertangkap. Transisi mulus di sekitar rasio = 1. */
function peluangTangkap(rasio) {
  return 1 / (1 + Math.pow(rasio, -1.35));
}

export function buatWidgetWhims(k) {
  const w = k.widget;
  const u = w.ui;

  const akar = el('div', { class: 'widget widget--whims' });

  const kanvas = el('canvas', { class: 'widget__kanvas', role: 'img', 'aria-label': u.padananTeks });

  const nilaiMedan = el('output', { class: 'widget__nilai mono', for: 'medan-c2' });
  const sliderMedan = el('input', {
    class: 'widget__slider', type: 'range', id: 'medan-c2',
    min: '0', max: '200', value: '150', step: '1', 'data-kursor': 'mainkan',
  });

  const nilaiButir = el('output', { class: 'widget__nilai mono', for: 'butir-c2' });
  // Skala slider logaritmik: rentang 5–500 µm mencakup dua orde besaran, dan
  // yang menarik justru ujung halusnya. Slider linear akan menyempitkan
  // seluruh wilayah "efisiensi jatuh" ke beberapa piksel pertama.
  const sliderButir = el('input', {
    class: 'widget__slider', type: 'range', id: 'butir-c2',
    min: '0', max: '1000', value: '760', step: '1', 'data-kursor': 'mainkan',
  });

  const bacaanEfisiensi = el('span', { class: 'widget__angka mono' });
  const bacaanRasio = el('span', { class: 'widget__angka mono' });
  const status = el('p', { class: 'widget__status mono', 'aria-live': 'polite' });
  const pengingat = el('p', { class: 'widget__pengingat', text: u.pengingatPangkatTiga });

  akar.append(
    el('div', { class: 'widget__kendali' }, [
      el('label', { class: 'widget__label', for: 'medan-c2', text: u.sliderMedan }),
      el('div', { class: 'widget__baris' }, [sliderMedan, nilaiMedan]),
    ]),
    el('div', { class: 'widget__kendali' }, [
      el('label', { class: 'widget__label', for: 'butir-c2', text: u.sliderButir }),
      el('div', { class: 'widget__baris' }, [sliderButir, nilaiButir]),
    ]),
    kanvas,
    el('div', { class: 'widget__bacaan' }, [
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanEfisiensi }), bacaanEfisiensi]),
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanRasio }), bacaanRasio]),
    ]),
    status,
    pengingat
  );

  /* ------------------------------------------------------------- keadaan */

  const ctx = kanvas.getContext('2d');
  const butir = [];
  const N_BUTIR = 150;
  let lebar = 1, tinggi = 1;

  const medan = () => (sliderMedan.valueAsNumber / 200) * B_MAKS;
  const diameter = () => D_MIN * Math.pow(D_MAKS / D_MIN, sliderButir.valueAsNumber / 1000);

  /** Sebagian butir memang non-magnetik (kuarsa/zirkon/kasiterit) dan tidak
   *  pernah tertangkap berapa pun medannya — itu bagian dari pemisahannya. */
  const buatButir = () => ({
    x: -Math.random() * 0.4,
    y: 0.12 + Math.random() * 0.76,
    magnetik: Math.random() < 0.42,
    v: 0.24 + Math.random() * 0.14,
    r: 1.3 + Math.random() * 1.5,
    nempel: false,
    xNempel: 0,
    yNempel: 0,
  });

  for (let i = 0; i < N_BUTIR; i++) {
    const b = buatButir();
    b.x = Math.random();
    butir.push(b);
  }

  // Posisi matriks baja dalam koordinat 0..1.
  const MATRIKS_X = [0.42, 0.5, 0.58];

  function langkah(dt) {
    const p = peluangTangkap(rasioGaya(diameter(), medan()));
    for (const b of butir) {
      if (b.nempel) continue;
      const xLama = b.x;
      b.x += b.v * dt;

      // Uji tangkap tepat saat butir melewati sebuah batang matriks.
      if (b.magnetik) {
        for (const mx of MATRIKS_X) {
          if (xLama < mx && b.x >= mx && Math.random() < p) {
            b.nempel = true;
            b.xNempel = mx;
            b.yNempel = b.y;
            break;
          }
        }
      }
      if (b.x > 1.05) Object.assign(b, buatButir());
    }
  }

  /** Efisiensi yang dibaca panel: bagian butir magnetik yang tertangkap.
   *  Diambil dari peluang model, bukan dari cacah partikel sesaat, supaya
   *  angkanya stabil dan bisa dibaca — cacah sesaat berderau besar. */
  function efisiensi() {
    return peluangTangkap(rasioGaya(diameter(), medan()));
  }

  /* ------------------------------------------------------------- gambar */

  function ukurUlang() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    lebar = akar.clientWidth || 1;
    tinggi = Math.max(170, Math.round(lebar * (lebar < 560 ? 0.62 : 0.36)));
    kanvas.style.height = `${tinggi}px`;
    kanvas.width = lebar * dpr;
    kanvas.height = tinggi * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function gambar() {
    ctx.clearRect(0, 0, lebar, tinggi);
    const pad = 8;
    const w = lebar - pad * 2;
    const h = tinggi - pad * 2;
    const X = (t) => pad + t * w;
    const Y = (t) => pad + t * h;

    // Dinding pipa
    ctx.strokeStyle = warna('garis');
    ctx.lineWidth = 1.2;
    ctx.strokeRect(pad + 0.5, pad + 0.5, w - 1, h - 1);

    // Medan magnet: makin kuat, makin terang latar daerah matriks.
    const bNorm = medan() / B_MAKS;
    ctx.fillStyle = warna('magnet');
    ctx.globalAlpha = 0.05 + bNorm * 0.16;
    ctx.fillRect(X(0.36), pad + 1, w * 0.28, h - 2);
    ctx.globalAlpha = 1;

    // Matriks baja
    ctx.strokeStyle = warna('baja');
    ctx.lineWidth = 2.2;
    ctx.globalAlpha = 0.75;
    for (const mx of MATRIKS_X) {
      ctx.beginPath();
      ctx.moveTo(X(mx), Y(0.06));
      ctx.lineTo(X(mx), Y(0.94));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Butir
    for (const b of butir) {
      const x = b.nempel ? X(b.xNempel) : X(b.x);
      const y = b.nempel ? Y(b.yNempel) : Y(b.y);
      if (x < pad || x > pad + w) continue;
      ctx.fillStyle = b.magnetik ? warna('monasit') : warna('sedimen');
      ctx.globalAlpha = b.nempel ? 1 : 0.85;
      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Label
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillStyle = warna('kabut');
    ctx.fillText(u.labelMatriks, X(0.37), Y(0.045) + 4);
    ctx.fillText(u.labelLolos, X(0.7), Y(0.99) - 1);
    ctx.fillStyle = warna('monasit');
    ctx.fillText(u.labelTertangkap, X(0.06), Y(0.045) + 4);
  }

  /* ------------------------------------------------------- pembaruan teks */

  function perbaruiBacaan() {
    const d = diameter();
    const b = medan();
    const r = rasioGaya(d, b);
    const eff = efisiensi();
    const jatuh = eff < 0.5;

    nilaiMedan.textContent = `${b.toFixed(2)} T`;
    nilaiButir.textContent = `${d < 10 ? d.toFixed(1) : d.toFixed(0)} µm`;
    bacaanEfisiensi.textContent = `${(eff * 100).toFixed(0)}%`;
    bacaanRasio.textContent = r >= 10 ? `${r.toFixed(0)}×` : `${r.toFixed(2)}×`;
    status.textContent = jatuh ? u.status.jatuh : u.status.baik;
    status.classList.toggle('widget__status--awas', jatuh);
    kanvas.setAttribute('aria-label',
      `${u.padananTeks} ${u.sliderMedan}: ${b.toFixed(2)} T. ${u.sliderButir}: ${d.toFixed(0)} µm. ` +
      `${u.bacaanEfisiensi}: ${(eff * 100).toFixed(0)}%. ` + (jatuh ? u.status.jatuh : u.status.baik) + '.');
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

  /** Mode gerak-dikurangi: satu keadaan mantap, tanpa animasi. Butir magnetik
   *  ditempatkan langsung sesuai peluang tangkap saat ini. */
  const gambarSekali = () => {
    const p = peluangTangkap(rasioGaya(diameter(), medan()));
    for (const b of butir) {
      if (b.magnetik && Math.random() < p) {
        b.nempel = true;
        b.xNempel = MATRIKS_X[Math.floor(Math.random() * MATRIKS_X.length)];
        b.yNempel = b.y;
      } else {
        b.nempel = false;
        b.x = Math.random();
      }
    }
    gambar();
    perbaruiBacaan();
  };

  for (const s of [sliderMedan, sliderButir]) {
    s.addEventListener('input', () => {
      // Butir yang sudah menempel dilepas supaya tampilan mengikuti setelan baru
      // alih-alih mempertahankan hasil setelan lama.
      for (const b of butir) if (b.nempel) { b.nempel = false; b.x = Math.random() * 0.3; }
      if (kurangiGerak()) gambarSekali(); else perbaruiBacaan();
    });
  }

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
