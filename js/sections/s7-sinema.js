// js/sections/s7-sinema.js — S7 Sinema: sekuens 8 bab dengan pemutar.
// Seluruh teks dari CONTENT.s7. Bukan berkas video — lihat s7.catatanTeknis.

import { el, kosongkan, paragraf, kurangiGerak, hitungNaik, buatSitasi, cariPustakaId } from '../dom.js';
import { pengelolaScene } from '../scene.js';
import { bangunPanggungSinema } from '../models/panggung-sinema.js';
import { fallbackSinemaSvg } from '../models/fallback-svg.js';
import { buatGarisWaktu } from '../cinema.js';

const KECEPATAN = [0.5, 1, 1.5, 2];

function formatWaktu(d) {
  const m = Math.floor(d / 60), s = Math.floor(d % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function rakitS7(CONTENT) {
  const section = document.getElementById('s7-sinema');
  if (!section) return null;

  const s7 = CONTENT.s7;
  const par = (t, kelas) => paragraf(t, CONTENT.s10.pustaka, CONTENT.ui.sitasi.petunjuk, kelas);

  const kepala = section.querySelector('.s7__kepala');
  kosongkan(kepala);
  kepala.append(
    el('p', { class: 'eyebrow', text: s7.eyebrow }),
    el('h2', { class: 'section__judul', text: s7.judul }),
    par(s7.catatanTeknis, 's7__catatan-teknis')
  );

  const { waktu, durasi } = buatGarisWaktu(s7.bab);

  // §3.3: section sinema berubah jadi kartu-kartu langkah statis saat gerak
  // dikurangi. Diputuskan sekali di sini, bukan ditoggle hidup — konsisten
  // dengan pola S2/S5/S6.
  if (kurangiGerak()) return rakitStatis(section, s7, par);
  return rakitPemutar(section, CONTENT, s7, par, waktu, durasi);
}

/* ------------------------------------------------------------- statis */

function rakitStatis(section, s7, par) {
  section.querySelector('[data-s7-pemutar]')?.remove();
  kosongkan(section.querySelector('[data-s7-transkrip]'));

  const statis = section.querySelector('[data-s7-statis]');
  statis.hidden = false;
  kosongkan(statis);
  statis.append(
    el('ol', { class: 's7-statis__daftar' }, s7.bab.map((b) =>
      el('li', { class: 's7-statis__kartu' }, [
        el('p', { class: 's7-statis__waktu mono', text: b.waktu }),
        el('h3', { class: 's7-statis__judul', text: b.judul }),
        par(b.deskripsi),
      ])
    ))
  );
  return null;
}

/* ------------------------------------------------------------- pemutar */

function rakitPemutar(section, CONTENT, s7, par, waktu, durasi) {
  const ui = s7.ui;
  section.querySelector('[data-s7-statis]')?.remove();

  const wadahScene = section.querySelector('[data-component="canvas-sinema"]');
  const wadahTakarir = section.querySelector('[data-s7-takarir]');
  const wadahKendali = section.querySelector('[data-s7-kendali]');
  const wadahTranskrip = section.querySelector('[data-s7-transkrip]');
  const wadahRingkasan = section.querySelector('[data-s7-ringkasan]');

  /* --- transkrip: teks biasa, otomatis bisa dipilih & disalin --- */
  kosongkan(wadahTranskrip);
  wadahTranskrip.append(
    el('details', { class: 's7-transkrip' }, [
      el('summary', { class: 's7-transkrip__judul', text: ui.transkripJudul }),
      el('ol', { class: 's7-transkrip__daftar' }, s7.bab.map((b) =>
        el('li', {}, [
          el('p', { class: 's7-transkrip__label' }, [
            el('span', { class: 'mono', text: b.waktu }),
            document.createTextNode(` · ${b.judul}`),
          ]),
          par(b.deskripsi),
        ])
      )),
    ])
  );

  /* --- keadaan pemutaran --- */
  let panggung = null;
  let renderer = null;
  let tSaatIni = 0;
  let berjalan = false;
  let kecepatan = 1;
  let babAktif = -1;
  let terlihat = false;
  let sedangJalanRaf = false;
  let sebelumnya = 0;
  let merekam = false;
  let rekamRecorder = null;

  /* --- kendali --- */
  kosongkan(wadahKendali);

  const tombolPutar = el('button', {
    class: 'kendali__tombol kendali__tombol--utama', type: 'button',
    'aria-pressed': 'false', 'data-kursor': 'mainkan', text: ui.putar,
    onclick: () => (berjalan ? jeda() : putar()),
  });

  const scrubber = el('input', {
    type: 'range', class: 's7-scrub', min: '0', max: String(durasi),
    step: '0.05', value: '0', 'aria-label': ui.garisWaktu,
    oninput: () => { hentikanRekamanJikaAda(); jeda(); loncatKe(scrubber.valueAsNumber); },
  });

  const waktuTampil = el('span', { class: 'mono s7-waktu', text: `${formatWaktu(0)} / ${formatWaktu(durasi)}` });

  const tombolBab = s7.bab.map((b, i) => el('button', {
    class: 'kendali__tombol', type: 'button', 'data-kursor': 'mainkan',
    text: `${i + 1}. ${b.judul}`,
    onclick: () => { hentikanRekamanJikaAda(); loncatKe(waktu[i]); },
  }));

  const tombolKecepatan = KECEPATAN.map((k) => el('button', {
    class: 'kendali__tombol' + (k === 1 ? ' kendali__tombol--aktif' : ''),
    type: 'button', 'data-kursor': 'mainkan',
    text: `${String(k).replace('.', ',')}×`,
    onclick: () => aturKecepatan(k),
  }));

  const tombolRekam = el('button', {
    class: 'kendali__tombol', type: 'button', 'data-kursor': 'mainkan', text: ui.rekam,
    onclick: () => (merekam ? berhentiRekam() : mulaiRekam()),
  });
  if (typeof HTMLCanvasElement.prototype.captureStream !== 'function' || typeof window.MediaRecorder === 'undefined') {
    tombolRekam.disabled = true;
    tombolRekam.title = 'Perekaman tidak didukung peramban ini';
  }

  const gugusRekam = el('div', { class: 'kendali__gugus' }, [tombolRekam]);

  wadahKendali.append(
    el('div', { class: 'kendali__baris' }, [tombolPutar, scrubber, waktuTampil]),
    el('div', { class: 'kendali__gugus', role: 'group', 'aria-label': ui.lompatBab }, tombolBab),
    el('div', { class: 'kendali__gugus', role: 'group', 'aria-label': ui.kecepatan }, tombolKecepatan),
    gugusRekam
  );

  function semuaTombolKendali() {
    return [tombolPutar, scrubber, ...tombolBab, ...tombolKecepatan];
  }

  function aturKecepatan(k) {
    kecepatan = k;
    tombolKecepatan.forEach((t, i) => t.classList.toggle('kendali__tombol--aktif', KECEPATAN[i] === k));
  }

  // §S7 bab terakhir ("Penutup"): "ringkasan tiga angka muncul". Dipakai ulang
  // dari tiga statistik hero (CONTENT.s1.statistik) — angka yang sama, bukan
  // duplikat baru, supaya tidak ada dua sumber kebenaran untuk angka yang sama.
  const INDEKS_PENUTUP = s7.bab.length - 1;
  let ringkasanTampil = false;

  function perbaruiRingkasan(indeks) {
    const harusTampil = indeks === INDEKS_PENUTUP;
    if (harusTampil === ringkasanTampil) return;
    ringkasanTampil = harusTampil;
    kosongkan(wadahRingkasan);
    wadahRingkasan.hidden = !harusTampil;
    if (!harusTampil) return;

    wadahRingkasan.append(
      el('p', { class: 'panggung__ringkasan-judul mono', text: s7.ui.ringkasan }),
      el('ul', { class: 'panggung__ringkasan-daftar' },
        CONTENT.s1.statistik.map((s) => {
          const nilai = el('span', { class: 'panggung__ringkasan-nilai mono' });
          hitungNaik(nilai, s.nilai, { durasi: 1100 });
          return el('li', {}, [
            nilai,
            el('span', { class: 'panggung__ringkasan-label' }, [
              document.createTextNode(s.label + ' '),
              buatSitasi(s.sumber, cariPustakaId(s.sumberId, CONTENT.s10.pustaka), CONTENT.ui.sitasi.petunjuk),
            ]),
          ]);
        })
      )
    );
  }

  function perbaruiTampilan(indeks) {
    scrubber.value = String(tSaatIni);
    waktuTampil.textContent = `${formatWaktu(tSaatIni)} / ${formatWaktu(durasi)}`;
    if (indeks === babAktif) return;
    babAktif = indeks;
    const b = s7.bab[indeks];
    kosongkan(wadahTakarir);
    wadahTakarir.append(
      el('span', { class: 's7-takarir__bab mono', text: `${b.waktu} · ${b.judul}` }),
      par(b.deskripsi, 's7-takarir__teks')
    );
    tombolBab.forEach((t, i) => t.classList.toggle('kendali__tombol--aktif', i === indeks));
    perbaruiRingkasan(indeks);
  }

  /* --- garis waktu --- */

  function loncatKe(t) {
    tSaatIni = Math.min(durasi, Math.max(0, t));
    if (panggung) perbaruiTampilan(panggung.evaluasi(tSaatIni).indeks);
    else { scrubber.value = String(tSaatIni); waktuTampil.textContent = `${formatWaktu(tSaatIni)} / ${formatWaktu(durasi)}`; }
  }

  function tick(kini) {
    if (!sedangJalanRaf) return;
    const dt = Math.min(0.1, (kini - sebelumnya) / 1000) || 0;
    sebelumnya = kini;
    if (berjalan) {
      tSaatIni += dt * kecepatan;
      if (tSaatIni >= durasi) {
        tSaatIni = durasi;
        jeda();
        if (merekam) berhentiRekam();
      }
      if (panggung) perbaruiTampilan(panggung.evaluasi(tSaatIni).indeks);
    }
    requestAnimationFrame(tick);
  }

  function aturJalan() {
    const harus = berjalan && terlihat && !document.hidden;
    if (harus && !sedangJalanRaf) {
      sedangJalanRaf = true;
      sebelumnya = performance.now();
      requestAnimationFrame(tick);
    } else if (!harus) {
      sedangJalanRaf = false;
    }
  }

  function putar() {
    berjalan = true;
    tombolPutar.textContent = ui.jeda;
    tombolPutar.setAttribute('aria-pressed', 'true');
    if (tSaatIni >= durasi) tSaatIni = 0;
    aturJalan();
  }
  function jeda() {
    berjalan = false;
    tombolPutar.textContent = ui.putar;
    tombolPutar.setAttribute('aria-pressed', 'false');
    aturJalan();
  }

  /* --- rekam ke .webm --- */

  function mulaiRekam() {
    if (tombolRekam.disabled || !renderer) return;
    merekam = true;
    tombolRekam.textContent = ui.merekam;
    semuaTombolKendali().forEach((t) => { t.disabled = true; });

    loncatKe(0);
    aturKecepatan(1);

    const stream = renderer.domElement.captureStream(30);
    const mime = ['video/webm;codecs=vp9', 'video/webm']
      .find((m) => window.MediaRecorder.isTypeSupported(m)) || 'video/webm';
    const potongan = [];
    rekamRecorder = new MediaRecorder(stream, { mimeType: mime });
    rekamRecorder.ondataavailable = (e) => { if (e.data.size) potongan.push(e.data); };
    rekamRecorder.onstop = () => {
      const blob = new Blob(potongan, { type: mime });
      const url = URL.createObjectURL(blob);
      gugusRekam.append(el('a', {
        href: url, download: 'tiram-sinema.webm', class: 'kendali__tombol',
        text: ui.unduhRekaman,
      }));
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    };
    rekamRecorder.start();
    putar();
  }

  function berhentiRekam() {
    if (!merekam) return;
    merekam = false;
    tombolRekam.textContent = ui.rekam;
    semuaTombolKendali().forEach((t) => { t.disabled = false; });
    rekamRecorder?.stop();
    rekamRecorder = null;
  }
  function hentikanRekamanJikaAda() { if (merekam) berhentiRekam(); }

  /* --- panggung 3D --- */

  perbaruiTampilan(0);   // takarir bab pertama tampil sebelum scene selesai dimuat

  pengelolaScene.daftar({
    id: 's7-sinema',
    wadah: wadahScene,
    bangun: ({ mutuRendah, renderer: r }) => {
      renderer = r;
      panggung = bangunPanggungSinema({ mutuRendah, renderer: r, waktu, durasi });
      perbaruiTampilan(panggung.evaluasi(tSaatIni).indeks);
      return panggung;
    },
    fallback: (wadah) => {
      // Takarir dan transkrip tetap terisi tanpa WebGL — itu tetap memenuhi
      // inti §7 (memahami sekuens) meski panggung 3D tidak tersedia.
      wadah.classList.add('panggung__scene--fallback');
      wadah.insertAdjacentHTML('afterbegin', fallbackSinemaSvg());
      wadah.append(
        el('div', { class: 'fallback-pesan' }, [
          el('p', { class: 'fallback-pesan__judul mono', text: CONTENT.ui.fallbackWebgl.judul }),
          el('p', { text: CONTENT.ui.fallbackWebgl.narasi }),
        ])
      );
      tombolRekam.disabled = true;
    },
  });

  wadahScene.append(el('p', { class: 'sr-only', text: ui.padananTeks }));

  const pengamat = new IntersectionObserver(([e]) => { terlihat = e.isIntersecting; aturJalan(); }, { rootMargin: '10% 0px' });
  pengamat.observe(section);
  document.addEventListener('visibilitychange', aturJalan);

  return { get panggung() { return panggung; }, loncatKe };
}
