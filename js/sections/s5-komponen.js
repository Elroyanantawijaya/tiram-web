// js/sections/s5-komponen.js — S5 Komponen: panel 3D sticky + teks bergulir.
// Seluruh teks dari CONTENT.s5.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { el, kosongkan, paragraf, kurangiGerak } from '../dom.js';
import * as THREE from 'three';
import { pengelolaScene } from '../scene.js';
import { bangunPanggungKomponen } from '../models/panggung-komponen.js';
import { fallbackKomponenSvg } from '../models/fallback-svg.js';
import { buatLapisanAnotasi } from '../widgets/anotasi.js';
import { buatWidgetPengkondisi } from '../widgets/pengkondisi.js';
import { buatWidgetWhims } from '../widgets/whims.js';
import { buatWidgetGamma } from '../widgets/gamma.js';
import { buatWidgetKatup } from '../widgets/katup.js';
import { buatWidgetBunker } from '../widgets/bunker.js';

/** Widget simulasi per komponen — kelimanya kini terisi (§S5). */
const WIDGET = {
  c1: buatWidgetPengkondisi,
  c2: buatWidgetWhims,
  c3: buatWidgetGamma,
  c4: buatWidgetKatup,
  c5: buatWidgetBunker,
};

export function rakitS5(CONTENT) {
  const section = document.getElementById('s5-komponen');
  if (!section) return null;

  const s5 = CONTENT.s5;
  const pustaka = CONTENT.s10.pustaka;
  const petunjuk = CONTENT.ui.sitasi.petunjuk;
  const par = (teks, kelas) => paragraf(teks, pustaka, petunjuk, kelas);

  const wadahPanel = section.querySelector('[data-component="canvas-3d"]');
  const kolom = section.querySelector('.scrolly__teks');

  /* --- kepala section --- */
  if (!section.querySelector('.s5__kepala')) {
    section.insertBefore(
      el('div', { class: 'section__content s5__kepala' }, [
        el('p', { class: 'eyebrow', text: s5.eyebrow ?? '' }),
        par(s5.intro, 's5__intro'),
      ]),
      section.firstElementChild
    );
  }

  /* --- blok tetap tiap komponen --- */
  const blok = (label, teks) => el('div', { class: 'komponen__blok' }, [
    el('p', { class: 'eyebrow komponen__label', text: label }),
    par(teks),
  ]);

  const isiKomponen = (k, wadah) => {
    kosongkan(wadah);
    wadah.append(
      el('p', { class: 'komponen__nomor mono', text: String(k.nomor ?? '').padStart(2, '0') }),
      el('h3', { class: 'komponen__nama', text: k.nama }),
      k.subjudul ? el('p', { class: 'komponen__subjudul', text: k.subjudul }) : null,
      blok(s5.labelBlok.apa, k.apa),
      blok(s5.labelBlok.bagaimana, k.bagaimana),
      blok(s5.labelBlok.ilmu, k.ilmu)
    );
    const buat = WIDGET[k.id];
    if (buat) wadah.append(buat(k).el);
  };

  for (const k of s5.komponen) {
    const wadah = kolom.querySelector(`[data-component-id="${k.id}"]`);
    if (wadah) isiKomponen(k, wadah);
  }

  /* --- panggung 3D --- */
  let panggung = null;
  let lapisan = null;
  const km = s5.kendaliModel;

  // Label bagian menyala sejak awal: itu isi, bukan efek. Disimpan sebagai
  // keadaan tersendiri, bukan dibaca dari kelas tombol — tombolnya dibuat
  // setelah fungsi ini dan pembacaan lintas-urutan itu gampang putus diam-diam.
  let anotasiNyala = true;
  // Mode tembus pandang disimpan di sini untuk alasan yang sama seperti
  // anotasiNyala: label yang dipasang bergantung padanya, dan membacanya dari
  // kelas tombol berarti bergantung pada urutan pembuatan elemen.
  let xrayNyala = false;

  /** Anotasi label bagian untuk komponen yang sedang tampil. */
  const pasangAnotasi = (id) => {
    if (!lapisan) return;
    lapisan.kosongkan();
    if (!anotasiNyala) return;
    const k = s5.komponen.find((x) => x.id === id);
    // Saat kulit luar tembus pandang, label kulit tidak lagi menunjuk apa pun
    // yang menonjol; yang relevan justru bagian dalamnya.
    const daftar = xrayNyala ? (k?.anotasiDalam ?? k?.anotasi ?? []) : (k?.anotasi ?? []);
    for (const a of daftar) {
      lapisan.tambah(
        el('span', { class: `anotasi__label mono${xrayNyala ? ' anotasi__label--dalam' : ''}`, text: a.teks }),
        new THREE.Vector3(...a.pos)
      );
    }
  };

  pengelolaScene.daftar({
    id: 's5-komponen',
    wadah: wadahPanel,
    bangun: ({ mutuRendah, renderer }) => {
      panggung = bangunPanggungKomponen({ mutuRendah, renderer });
      panggung.tampilkan(s5.komponen[0].id);

      lapisan = buatLapisanAnotasi(wadahPanel);
      pasangAnotasi(s5.komponen[0].id);

      const perbaruiAsli = panggung.perbarui.bind(panggung);
      panggung.perbarui = (dt) => {
        perbaruiAsli(dt);
        lapisan.perbarui(panggung.camera, wadahPanel.clientWidth, wadahPanel.clientHeight);
      };
      return panggung;
    },
    fallback: (wadah) => {
      wadah.classList.add('scrolly__panel--fallback');
      wadah.insertAdjacentHTML('afterbegin', fallbackKomponenSvg());
      wadah.append(
        el('div', { class: 'fallback-pesan' }, [
          el('p', { class: 'fallback-pesan__judul mono', text: CONTENT.ui.fallbackWebgl.judul }),
          el('p', { text: CONTENT.ui.fallbackWebgl.narasi }),
        ])
      );
      // Tanpa WebGL, urai/tembus pandang tidak punya arti — tombolnya
      // disembunyikan alih-alih dibiarkan sebagai kendali yang diam saja
      // saat ditekan.
      kendaliModel.hidden = true;
    },
  });

  wadahPanel.append(el('p', { class: 'sr-only', text: CONTENT.ui.padananTeks.panggungKomponen }));

  /* --- kendali model: urai, potongan melintang, label bagian ---
     Diletakkan sebagai blok biasa di bawah panel, bukan overlay di atasnya —
     pola yang sama dipakai S6/S7 setelah cacat #14 (overlay menutupi model
     di layar sempit). */
  const tombolSakelar = (teksMati, teksNyala, ariaLabel, saatUbah) => {
    const t = el('button', {
      class: 'kendali__tombol', type: 'button', 'aria-pressed': 'false',
      'aria-label': ariaLabel, 'data-kursor': 'mainkan', text: teksMati,
    });
    t.addEventListener('click', () => {
      const nyala = t.getAttribute('aria-pressed') !== 'true';
      t.setAttribute('aria-pressed', String(nyala));
      t.classList.toggle('kendali__tombol--aktif', nyala);
      t.textContent = nyala ? teksNyala : teksMati;
      saatUbah(nyala);
    });
    return t;
  };

  const tombolUrai = tombolSakelar(km.urai, km.uraiAktif, km.uraiLabel, (n) => panggung?.setUrai(n));
  const tombolXray = tombolSakelar(km.xray, km.xrayAktif, km.xrayLabel, (n) => {
    xrayNyala = n;
    panggung?.setXray(n);
    // Label ikut berpindah ke bagian dalam pada saat yang sama, bukan menunggu
    // komponen berikutnya digulir.
    if (panggung) pasangAnotasi(panggung.idAktif);
  });
  const tombolAnotasi = tombolSakelar(km.anotasi, km.anotasi, km.anotasiLabel, (n) => {
    anotasiNyala = n;
    if (panggung) pasangAnotasi(panggung.idAktif);
  });
  tombolAnotasi.setAttribute('aria-pressed', String(anotasiNyala));
  tombolAnotasi.classList.toggle('kendali__tombol--aktif', anotasiNyala);

  const kendaliModel = el('div', { class: 'panggung__kendali s5__kendali' }, [
    el('div', { class: 'kendali__gugus' }, [tombolUrai, tombolXray, tombolAnotasi]),
    el('p', { class: 's5__petunjuk-gestur', text: km.petunjukGestur }),
    el('p', { class: 's5__petunjuk-gestur', text: km.petunjukDalam }),
  ]);

  // Panel dan kendalinya harus jadi SATU anak grid `.scrolly`, bukan dua.
  // Kalau dua, kendali merebut kolom kanan dan kolom teks terdorong ke baris
  // berikutnya — persis di bawah panel yang sticky, sehingga teksnya tertimpa.
  const kolomModel = el('div', { class: 's5__kolom' });
  wadahPanel.replaceWith(kolomModel);
  kolomModel.append(wadahPanel, kendaliModel);

  /* --- pemicu scroll: model mengikuti komponen yang sedang dibaca --- */
  for (const k of s5.komponen) {
    const wadah = kolom.querySelector(`[data-component-id="${k.id}"]`);
    if (!wadah) continue;
    ScrollTrigger.create({
      trigger: wadah,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (!self.isActive) return;
        panggung?.tampilkan(k.id);
        // Label bagian ikut berganti mengikuti komponen yang sedang dibaca;
        // kalau tidak, label komponen sebelumnya menempel di model yang baru.
        pasangAnotasi(k.id);
        // tampilkan() mengembalikan model ke keadaan terpasang, jadi tombol
        // urai harus ikut kembali agar labelnya tidak berbohong.
        if (tombolUrai.getAttribute('aria-pressed') === 'true') {
          tombolUrai.setAttribute('aria-pressed', 'false');
          tombolUrai.classList.remove('kendali__tombol--aktif');
          tombolUrai.textContent = km.urai;
        }
      },
    });
  }

  if (!kurangiGerak()) {
    for (const n of kolom.children) {
      gsap.fromTo(n, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: n, start: 'top 85%' },
      });
    }
  }

  return { get panggung() { return panggung; } };
}
