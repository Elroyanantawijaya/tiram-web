// js/widgets/pengkondisi.js — widget simulasi komponen 1 (Pengkondisi umpan).
//
// Modelnya kapasitor hidraulik, sesuai penjelasan "bagaimana" komponen ini:
// tangki penyangga dengan keluaran terkontrol. Masukan berdenyut dari jig
// diintegrasikan oleh volume tangki, sehingga keluarannya jauh lebih rata —
// tetapi hanya selama ayunan muka bubur masih muat di dalam tangki. Begitu
// ayunan itu melewati dasar atau bibir tangki, penyangga kehabisan ruang dan
// denyutnya tembus ke keluaran. Itulah "kapasitas penyangga terlampaui".

import { el, kosongkan, kurangiGerak } from '../dom.js';

const warna = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--${n}`).trim();

// Parameter model.
//
// Kunci perilakunya: tangki penyangga sangat baik meredam denyut cepat, tetapi
// hampir tak berdaya terhadap lonjakan lambat — sebab yang dihabiskan lonjakan
// lambat adalah ruang tangki itu sendiri, bukan sekadar amplitudonya. Karena itu
// masukan punya dua komponen. Denyut cepat naik sejak slider digeser sedikit dan
// hampir seluruhnya tersaring; lonjakan lambat baru muncul di paruh atas slider,
// menggerus ruang sisa, lalu membuat muka bubur menyentuh dasar atau bibir
// tangki. Di situlah keluarannya jebol.
const KAPASITANSI = 4.5;    // volume penyangga (kapasitor hidraulik)
const KONDUKTANSI = 2.0;    // keluaran sebanding tinggi muka: q_keluar = KONDUKTANSI * L
const FREKUENSI = 1.15;     // denyut cepat jig, per detik
const AMP_MAKS = 3.0;       // amplitudo denyut cepat pada slider penuh
// Lonjakan lambat: 0,22 Hz, masih lima kali lebih lambat daripada denyut jig
// sehingga tangki tetap tak sanggup menyaringnya, tetapi periodenya ~4,5 detik
// supaya pengguna melihat akibatnya dalam hitungan detik, bukan belasan.
const FREK_LONJAK = 0.22;
const AMBANG_LONJAK = 0.6;  // slider di atas ini mulai memunculkan lonjakan lambat
const AMP_LONJAK = 15.5;    // penguat amplitudo lonjakan lambat
const L_AWAL = 0.5;         // muka bubur mantap: q_masuk 1,0 → L = 1/KONDUKTANSI

export function buatWidgetPengkondisi(k) {
  const w = k.widget;
  const u = w.ui;

  const akar = el('div', { class: 'widget widget--pengkondisi' });

  const kanvas = el('canvas', {
    class: 'widget__kanvas',
    role: 'img',
    'aria-label': u.padananTeks,
  });

  const nilaiSlider = el('output', { class: 'widget__nilai mono', for: 'denyut-c1' });
  const slider = el('input', {
    class: 'widget__slider',
    type: 'range',
    id: 'denyut-c1',
    min: '0', max: '100', value: '25', step: '1',
    'data-kursor': 'mainkan',
  });

  const bacaanRiak = el('span', { class: 'widget__angka mono' });
  const bacaanTinggi = el('span', { class: 'widget__angka mono' });
  const status = el('p', { class: 'widget__status mono', 'aria-live': 'polite' });

  akar.append(
    el('div', { class: 'widget__kendali' }, [
      el('label', { class: 'widget__label', for: 'denyut-c1', text: u.slider }),
      el('div', { class: 'widget__baris' }, [slider, nilaiSlider]),
    ]),
    kanvas,
    el('div', { class: 'widget__bacaan' }, [
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanRiak }), bacaanRiak]),
      el('div', {}, [el('span', { class: 'widget__kunci', text: u.bacaanTinggi }), bacaanTinggi]),
    ]),
    status,
    el('ul', { class: 'widget__ilmu' }, w.labelIlmu.map((t) => el('li', { class: 'mono', text: t })))
  );

  /* ------------------------------------------------------------- keadaan */

  const ctx = kanvas.getContext('2d');
  const N = 190;                       // panjang jejak grafik
  const jejakMasuk = new Array(N).fill(1);
  const jejakKeluar = new Array(N).fill(1);
  const gelembung = [];
  let L = L_AWAL;
  let jam = 0;
  let terlampaui = false;
  let riakPuncak = 0;
  let lebar = 1, tinggi = 1;

  const amplitudo = () => (slider.valueAsNumber / 100) * AMP_MAKS;

  /** Satu langkah simulasi. Mengembalikan {qMasuk, qKeluar}. */
  function langkah(dt) {
    jam += dt;
    const amp = amplitudo();
    // Denyut jig: sinus dengan harmonik kedua supaya berbentuk denyut, bukan
    // gelombang halus. Rata-ratanya tetap 1,0 agar neraca massa tidak bergeser.
    const fase = 2 * Math.PI * FREKUENSI * jam;
    const bentuk = Math.sin(fase) + 0.35 * Math.sin(2 * fase);

    // Lonjakan lambat, baru hadir di paruh atas slider.
    const p = slider.valueAsNumber / 100;
    const ampLonjak = Math.max(0, p - AMBANG_LONJAK) * AMP_LONJAK;
    const lonjak = ampLonjak * Math.sin(2 * Math.PI * FREK_LONJAK * jam);

    const qMasuk = Math.max(0, 1 + amp * bentuk * 0.5 + lonjak);

    let qKeluar = KONDUKTANSI * L;
    L += ((qMasuk - qKeluar) / KAPASITANSI) * dt;

    // Batas fisik tangki. Di kedua batas penyangga kehilangan kemampuannya:
    // penuh berarti kelebihan langsung tumpah ke keluaran, kosong berarti tidak
    // ada lagi yang bisa dialirkan.
    let lewat = false;
    if (L > 1) { qKeluar += (L - 1) * KAPASITANSI / dt; L = 1; lewat = true; }
    if (L < 0) { qKeluar = Math.max(0, qKeluar + (L * KAPASITANSI) / dt); L = 0; lewat = true; }

    return { qMasuk, qKeluar, lewat };
  }

  function dorong(arr, v) { arr.push(v); if (arr.length > N) arr.shift(); }

  function perbaruiGelembung(dt) {
    const amp = amplitudo();
    // Makin berdenyut, makin banyak udara terperangkap yang harus dibuang.
    if (Math.random() < (0.25 + amp * 0.11) * dt * 60 * 0.06) {
      gelembung.push({ x: 0.25 + Math.random() * 0.5, y: 0, r: 1.2 + Math.random() * 2.4, v: 0.35 + Math.random() * 0.5 });
    }
    for (let i = gelembung.length - 1; i >= 0; i--) {
      const g = gelembung[i];
      g.y += g.v * dt;
      if (g.y > 1) gelembung.splice(i, 1);
    }
  }

  /* ------------------------------------------------------------- gambar */

  function ukurUlang() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    lebar = akar.clientWidth || 1;
    tinggi = Math.max(190, Math.round(lebar * (lebar < 560 ? 0.95 : 0.42)));
    kanvas.style.height = `${tinggi}px`;
    kanvas.width = lebar * dpr;
    kanvas.height = tinggi * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function gambarJejak(x, y, w, h, jejak, judul, warnaGaris) {
    ctx.strokeStyle = warna('garis');
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    ctx.fillStyle = warna('kabut');
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.fillText(judul, x + 6, y + 14);

    // Skala tetap agar kedua grafik bisa dibandingkan langsung.
    const maks = 4.2;
    const ke = (v) => y + h - 6 - (Math.min(v, maks) / maks) * (h - 26);

    ctx.strokeStyle = warna('garis');
    ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(x + 4, ke(1)); ctx.lineTo(x + w - 4, ke(1)); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = warnaGaris;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i < jejak.length; i++) {
      const px = x + 4 + (i / (N - 1)) * (w - 8);
      const py = ke(jejak[i]);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  function gambarTangki(x, y, w, h) {
    const pad = 10;
    const tx = x + w * 0.24, tw = w * 0.52;
    const ty = y + 26, th = h - 26 - pad;

    // Dinding tangki
    ctx.strokeStyle = warna('garis');
    ctx.lineWidth = 1.4;
    ctx.strokeRect(tx + 0.5, ty + 0.5, tw - 1, th - 1);

    // Bubur
    const hIsi = th * L;
    ctx.fillStyle = warna('sedimen');
    ctx.globalAlpha = 0.42;
    ctx.fillRect(tx + 1, ty + th - hIsi, tw - 2, hIsi);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = terlampaui ? warna('gamma') : warna('magnet');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx + 1, ty + th - hIsi);
    ctx.lineTo(tx + tw - 1, ty + th - hIsi);
    ctx.stroke();

    // Gelembung, naik di dalam bubur lalu keluar lewat vent
    ctx.fillStyle = warna('baja');
    for (const g of gelembung) {
      const gy = ty + th - g.y * th;
      if (gy < ty + th - hIsi - 6) continue;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(tx + g.x * tw, gy, g.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Vent di puncak
    ctx.strokeStyle = warna('kabut');
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tx + tw * 0.5, ty);
    ctx.lineTo(tx + tw * 0.5, ty - 12);
    ctx.stroke();
    ctx.fillStyle = warna('kabut');
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillText(u.labelVent, tx + tw * 0.5 + 5, ty - 6);
  }

  function gambar() {
    ctx.clearRect(0, 0, lebar, tinggi);
    const sempit = lebar < 560;
    if (sempit) {
      const h = (tinggi - 16) / 3;
      gambarJejak(0, 0, lebar, h, jejakMasuk, u.grafikMasuk, warna('kabut'));
      gambarTangki(0, h + 8, lebar, h);
      gambarJejak(0, 2 * h + 16, lebar, h, jejakKeluar, u.grafikKeluar, warna('magnet'));
    } else {
      const wg = lebar * 0.34, wt = lebar - wg * 2 - 16;
      gambarJejak(0, 0, wg, tinggi, jejakMasuk, u.grafikMasuk, warna('kabut'));
      gambarTangki(wg + 8, 0, wt, tinggi);
      gambarJejak(wg + wt + 16, 0, wg, tinggi, jejakKeluar, u.grafikKeluar, warna('magnet'));
    }
  }

  /* ------------------------------------------------------- pembaruan teks */

  function perbaruiBacaan() {
    const rerata = jejakKeluar.reduce((a, b) => a + b, 0) / jejakKeluar.length;
    const maks = Math.max(...jejakKeluar);
    const min = Math.min(...jejakKeluar);
    riakPuncak = rerata > 0 ? ((maks - min) / rerata) * 100 : 0;

    nilaiSlider.textContent = `${slider.value}%`;
    bacaanRiak.textContent = `${riakPuncak.toFixed(0)}%`;
    bacaanTinggi.textContent = `${(L * 100).toFixed(0)}%`;
    status.textContent = terlampaui ? u.status.terlampaui : u.status.tenang;
    status.classList.toggle('widget__status--awas', terlampaui);
    kanvas.setAttribute('aria-label',
      `${u.padananTeks} ${u.slider}: ${slider.value}%. ${u.bacaanRiak}: ${riakPuncak.toFixed(0)}%. ` +
      (terlampaui ? u.status.terlampaui : u.status.tenang) + '.');
  }

  /** Jalankan simulasi maju sekian detik tanpa menggambar — untuk keadaan awal
   *  dan untuk mode gerak-dikurangi, supaya jejaknya sudah terisi penuh. */
  function isiJejak(detik) {
    const dt = 1 / 60;
    let lewatBaru = false;
    for (let i = 0; i < detik / dt; i++) {
      const r = langkah(dt);
      dorong(jejakMasuk, r.qMasuk);
      dorong(jejakKeluar, r.qKeluar);
      if (r.lewat) lewatBaru = true;
    }
    terlampaui = lewatBaru;
  }

  /* --------------------------------------------------------------- gelung */

  let jalan = false, terlihat = false, sebelumnya = 0, sejakLewat = 0;

  const gelung = (kini) => {
    if (!jalan) return;
    const dt = Math.min(0.05, (kini - sebelumnya) / 1000) || 0;
    sebelumnya = kini;

    const r = langkah(dt);
    dorong(jejakMasuk, r.qMasuk);
    dorong(jejakKeluar, r.qKeluar);
    perbaruiGelembung(dt);

    // Status ditahan sebentar supaya tidak berkedip tiap denyut.
    if (r.lewat) sejakLewat = 1.2; else sejakLewat = Math.max(0, sejakLewat - dt);
    terlampaui = sejakLewat > 0;

    gambar();
    perbaruiBacaan();
    requestAnimationFrame(gelung);
  };

  const mulai = () => {
    if (jalan || !terlihat || kurangiGerak()) return;
    jalan = true;
    sebelumnya = performance.now();
    requestAnimationFrame(gelung);
  };
  const henti = () => { jalan = false; };

  /** Mode gerak-dikurangi: gambar sekali, tidak beranimasi. */
  const gambarSekali = () => { isiJejak(6); gambar(); perbaruiBacaan(); };

  slider.addEventListener('input', () => {
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

  // Keadaan awal: jejak sudah terisi supaya widget tidak tampil kosong.
  queueMicrotask(() => {
    ukurUlang();
    isiJejak(4);
    gambar();
    perbaruiBacaan();
  });

  return { el: akar, gambarSekali };
}
