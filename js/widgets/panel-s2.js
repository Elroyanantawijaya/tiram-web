// js/widgets/panel-s2.js — empat visual panel sticky S2 (a–d).
// Tidak memuat teks isi; seluruh label datang dari data/content.js lewat pemanggil.

import { el, kosongkan, kurangiGerak } from '../dom.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Baca token warna dari CSS agar palet tetap tinggal di satu tempat. */
const warna = (nama) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${nama}`).trim();

function svgEl(tag, attr = {}) {
  const n = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attr)) n.setAttribute(k, v);
  return n;
}

const acak = (a, b) => a + Math.random() * (b - a);

/* ================================================================ panel a
   Potongan melintang KIP, digambar mengikuti scroll. */

function panelA(s2a) {
  const akar = el('div', { class: 'panel panel--a' });

  const svg = svgEl('svg', { viewBox: '0 0 400 260', class: 'panel-a__svg', 'aria-hidden': 'true' });

  // Laut & dasar laut
  svg.append(svgEl('rect', { x: 0, y: 78, width: 400, height: 182, fill: 'var(--lambung)', opacity: '0.5' }));
  svg.append(svgEl('path', {
    d: 'M0 214 Q 60 206 110 214 T 220 214 T 330 216 T 400 212 L400 260 L0 260 Z',
    fill: 'var(--sedimen)', opacity: '0.22',
  }));
  svg.append(svgEl('line', { x1: 0, y1: 78, x2: 400, y2: 78, stroke: 'var(--garis)', 'stroke-width': '1' }));

  // Lambung + geladak KIP
  svg.append(svgEl('rect', { x: 96, y: 58, width: 208, height: 22, fill: 'var(--garis)' }));
  svg.append(svgEl('rect', { x: 150, y: 34, width: 96, height: 24, fill: 'var(--garis)', opacity: '0.75' }));

  // Lima jalur proses, digambar berurutan
  const jalur = [
    'M118 206 L118 150 L128 84',                      // 1 disedot naik
    'M136 70 L176 70 L176 46 L214 46',                // 2 ke jig
    'M246 46 L272 46 L272 62',                        // 3 kasiterit ke penampungan
    'M246 52 L292 52 L292 70 L324 70',                // 4 keluar sebagai tailing
    'M324 70 L344 70 L344 104 L338 128',              // 5 dibuang ke laut
  ].map((d) => {
    const p = svgEl('path', {
      d, fill: 'none', stroke: 'var(--magnet)', 'stroke-width': '2.4',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'data-jalur': '',
    });
    svg.append(p);
    return p;
  });

  // Kotak jig & penampungan
  svg.append(svgEl('rect', { x: 214, y: 36, width: 32, height: 20, fill: 'none', stroke: 'var(--baja)', 'stroke-width': '1.4' }));
  svg.append(svgEl('rect', { x: 262, y: 62, width: 20, height: 16, fill: 'var(--baja)', opacity: '0.5' }));

  // Titik keluar tailing — berkedip pelan
  const titik = svgEl('circle', { cx: 338, cy: 128, r: 5, fill: 'var(--gamma)', class: 'panel-a__titik' });
  svg.append(titik);

  const daftar = el('ol', { class: 'panel-a__langkah' },
    s2a.alur.map((t) => el('li', { text: t }))
  );
  const langkah = [...daftar.children];

  const labelKeluar = el('p', { class: 'panel-a__keluar mono', text: s2a.labelTitikKeluar });

  akar.append(svg, labelKeluar, daftar);

  let panjang = null;
  const siapkan = () => {
    panjang = jalur.map((p) => {
      const L = p.getTotalLength();
      p.style.strokeDasharray = String(L);
      p.style.strokeDashoffset = String(L);
      return L;
    });
  };

  return {
    el: akar,
    siapkan,
    aturProgres(p) {
      if (!panjang) siapkan();
      let kini = 0;
      jalur.forEach((path, i) => {
        const a = i / jalur.length;
        const t = Math.max(0, Math.min(1, (p - a) * jalur.length));
        path.style.strokeDashoffset = String(panjang[i] * (1 - t));
        const aktif = t > 0.2;
        langkah[i].classList.toggle('panel-a__langkah--aktif', aktif);
        if (aktif) kini = i;
      });
      // Di panel pendek hanya langkah ini yang ditampilkan (lihat CSS), supaya
      // daftar tidak menghabiskan seluruh tinggi dan diagramnya masih kebagian.
      langkah.forEach((li, i) => li.classList.toggle('panel-a__langkah--kini', i === kini));
      const tampil = p > 0.75;
      titik.classList.toggle('panel-a__titik--nyala', tampil);
      labelKeluar.classList.toggle('panel-a__keluar--tampil', tampil);
    },
  };
}

/* ================================================================ panel b
   Ladang partikel; menyorot satu jenis mineral saat kartunya di-hover/fokus. */

function panelB(s2b, mutuRendah) {
  const akar = el('div', { class: 'panel panel--b' });
  const kanvas = el('canvas', { class: 'panel__kanvas', 'aria-hidden': 'true' });
  akar.append(kanvas);
  const ctx = kanvas.getContext('2d');

  // Pemetaan id mineral ke token warna — ini keputusan desain, bukan isi.
  const TOKEN = { monasit: 'monasit', ilmenit: 'garis', zirkon: 'baja', xenotim: 'kabut' };

  const jenis = [
    { id: s2b.mineralDominan, warna: 'sedimen', bagian: 0.62 },
    ...s2b.kartu.map((k) => ({ id: k.id, warna: TOKEN[k.id] ?? 'kabut', bagian: 0.095 })),
  ];

  const N = mutuRendah ? 90 : 260;
  const butir = [];
  let sorotan = null;
  let w = 1, h = 1;

  const isiButir = () => {
    butir.length = 0;
    for (let i = 0; i < N; i++) {
      let r = Math.random(), pilih = jenis[0];
      for (const j of jenis) { if (r < j.bagian) { pilih = j; break; } r -= j.bagian; }
      butir.push({
        id: pilih.id, warna: pilih.warna,
        x: Math.random(), y: Math.random(),
        r: acak(1.6, 3.4), fase: acak(0, Math.PI * 2), laju: acak(0.12, 0.4),
      });
    }
  };
  isiButir();

  const ukurUlang = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    w = akar.clientWidth || 1; h = akar.clientHeight || 1;
    kanvas.width = w * dpr; kanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  return {
    el: akar,
    ukurUlang,
    sorot(id) { sorotan = id; },
    gambar(t) {
      if (!w || !h) ukurUlang();
      ctx.clearRect(0, 0, w, h);
      for (const b of butir) {
        const redup = sorotan && b.id !== sorotan;
        const nyala = sorotan && b.id === sorotan;
        const y = (b.y + Math.sin(t * b.laju + b.fase) * 0.006 + 1) % 1;
        ctx.globalAlpha = redup ? 0.12 : nyala ? 1 : 0.72;
        ctx.fillStyle = warna(b.warna);
        ctx.beginPath();
        ctx.arc(b.x * w, y * h, nyala ? b.r * 1.5 : b.r, 0, Math.PI * 2);
        ctx.fill();
        if (nyala) {
          ctx.globalAlpha = 0.28;
          ctx.beginPath();
          ctx.arc(b.x * w, y * h, b.r * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    },
  };
}

/* ================================================================ panel c
   Layar terbelah: plume kekeruhan (fisik) vs deret luruh (radiologis). */

function panelC(s2c, mutuRendah) {
  const akar = el('div', { class: 'panel panel--c' });

  const kiri = el('div', { class: 'panel-c__sisi' });
  const kanvas = el('canvas', { class: 'panel__kanvas', 'aria-hidden': 'true' });
  kiri.append(kanvas, el('p', { class: 'panel-c__label mono', text: s2c.fisik.label }));

  const kanan = el('div', { class: 'panel-c__sisi panel-c__sisi--kanan' });
  const deret = ['Th-232', 'U-238', 'Ra-226', 'K-40'];
  kanan.append(
    el('ul', { class: 'panel-c__deret' }, deret.map((d, i) =>
      el('li', { class: 'mono', style: `--tunda:${i * 220}ms`, text: d })
    )),
    el('p', { class: 'panel-c__label mono', text: s2c.radiologis.label })
  );

  akar.append(kiri, kanan);

  const ctx = kanvas.getContext('2d');
  const N = mutuRendah ? 60 : 170;
  const kabut = [];
  let w = 1, h = 1;

  for (let i = 0; i < N; i++) {
    kabut.push({ x: acak(0.35, 0.6), y: acak(0.1, 0.3), vx: acak(-0.02, 0.02), vy: acak(0.01, 0.05), r: acak(3, 11), a: acak(0.05, 0.2) });
  }

  const ukurUlang = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    w = kiri.clientWidth || 1; h = kiri.clientHeight || 1;
    kanvas.width = w * dpr; kanvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  return {
    el: akar,
    ukurUlang,
    gambar(t, dt) {
      if (!w || !h) ukurUlang();
      ctx.clearRect(0, 0, w, h);

      // Endapan yang menebal di dasar
      ctx.fillStyle = warna('sedimen');
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, h - 16, w, 16);

      for (const p of kabut) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.y > 0.94) { p.y = acak(0.1, 0.25); p.x = acak(0.4, 0.6); }
        if (p.x < 0.02 || p.x > 0.98) p.vx *= -1;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = warna('sedimen');
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  };
}

/* ================================================================ panel d
   Satu butir monasit membesar; label kontaminan / bahan baku berputar. */

function panelD(s2d) {
  const akar = el('div', { class: 'panel panel--d' });

  const bulat = el('div', { class: 'panel-d__butir' }, [
    el('span', { class: 'panel-d__kilau', 'aria-hidden': 'true' }),
  ]);

  const putar = el('div', { class: 'panel-d__putar' },
    s2d.labelBerputar.map((t, i) =>
      el('span', { class: `panel-d__label panel-d__label--${i}`, text: t })
    )
  );

  const rantai = el('ol', { class: 'panel-d__rantai' },
    s2d.alurNilai.map((t) => el('li', { class: 'mono', text: t }))
  );

  akar.append(el('div', { class: 'panel-d__panggung' }, [bulat, putar]), rantai);
  return { el: akar };
}

/* ================================================================ pengelola */

export function buatPanelS2(wadah, CONTENT, { mutuRendah = false } = {}) {
  kosongkan(wadah);
  const s2 = CONTENT.s2;

  const panel = {
    a: panelA(s2.a),
    b: panelB(s2.b, mutuRendah),
    c: panelC(s2.c, mutuRendah),
    d: panelD(s2.d),
  };
  for (const p of Object.values(panel)) wadah.append(p.el);

  let aktif = null;
  let jalan = false;
  let terlihat = false;
  let jam = 0;
  let sebelumnya = 0;

  const gelung = (kini) => {
    if (!jalan) return;
    const dt = Math.min(0.05, (kini - sebelumnya) / 1000) || 0;
    sebelumnya = kini;
    jam += dt;
    panel[aktif]?.gambar?.(jam, dt);
    requestAnimationFrame(gelung);
  };

  const mulai = () => {
    // Panel c dan d tetap tampil saat gerak dikurangi, hanya tidak beranimasi.
    if (jalan || !terlihat || kurangiGerak()) return;
    if (!panel[aktif]?.gambar) return;
    jalan = true;
    sebelumnya = performance.now();
    requestAnimationFrame(gelung);
  };
  const henti = () => { jalan = false; };

  const pengamat = new IntersectionObserver(([e]) => {
    terlihat = e.isIntersecting;
    if (terlihat) mulai(); else henti();
  }, { rootMargin: '10% 0px' });
  pengamat.observe(wadah);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) henti(); else mulai();
  });

  const ukurSemua = () => { for (const p of Object.values(panel)) p.ukurUlang?.(); };
  new ResizeObserver(ukurSemua).observe(wadah);

  return {
    panel,
    tampilkan(id) {
      if (aktif === id) return;
      aktif = id;
      for (const [k, p] of Object.entries(panel)) {
        p.el.classList.toggle('panel--aktif', k === id);
      }
      panel[id]?.ukurUlang?.();
      panel[id]?.siapkan?.();
      // Sekali gambar agar panel diam pun tetap terisi (mis. reduced motion).
      panel[id]?.gambar?.(jam, 0);
      henti();
      mulai();
    },
    sorotMineral(id) { panel.b.sorot(id); if (!jalan) panel.b.gambar(jam, 0); },
  };
}
