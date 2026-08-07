// js/sections/s5-komponen.js — S5 Komponen: panel 3D sticky + teks bergulir.
// Seluruh teks dari CONTENT.s5.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { el, kosongkan, paragraf, kurangiGerak } from '../dom.js';
import { pengelolaScene } from '../scene.js';
import { bangunPanggungKomponen } from '../models/panggung-komponen.js';

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
  };

  for (const k of s5.komponen) {
    const wadah = kolom.querySelector(`[data-component-id="${k.id}"]`);
    if (wadah) isiKomponen(k, wadah);
  }

  // Hidrosiklon: kartu tambahan bertanda opsional, di hulu.
  const wadahOpsional = kolom.querySelector('[data-component-id="hidrosiklon"]');
  if (wadahOpsional) {
    const o = s5.opsional;
    kosongkan(wadahOpsional);
    wadahOpsional.append(
      el('div', { class: 'kartu-opsional' }, [
        el('p', { class: 'eyebrow kartu-opsional__badge', text: o.badge }),
        el('h3', { class: 'komponen__nama', text: o.nama }),
        blok(s5.labelBlok.apa, o.apa),
        blok(s5.labelBlok.bagaimana, o.bagaimana),
        blok(s5.labelBlok.ilmu, o.ilmu),
        par(o.guna, 'kartu-opsional__guna'),
      ])
    );
  }

  /* --- panggung 3D --- */
  let panggung = null;
  pengelolaScene.daftar({
    id: 's5-komponen',
    wadah: wadahPanel,
    bangun: ({ mutuRendah, renderer }) => {
      panggung = bangunPanggungKomponen({ mutuRendah, renderer });
      panggung.tampilkan(s5.komponen[0].id);
      return panggung;
    },
    fallback: (wadah) => {
      wadah.classList.add('scrolly__panel--fallback');
      wadah.append(
        el('div', { class: 'fallback-pesan' }, [
          el('p', { class: 'fallback-pesan__judul mono', text: CONTENT.ui.fallbackWebgl.judul }),
          el('p', { text: CONTENT.ui.fallbackWebgl.narasi }),
        ])
      );
    },
  });

  wadahPanel.append(el('p', { class: 'sr-only', text: CONTENT.ui.padananTeks.panggungKomponen }));

  /* --- pemicu scroll: model mengikuti komponen yang sedang dibaca --- */
  for (const k of s5.komponen) {
    const wadah = kolom.querySelector(`[data-component-id="${k.id}"]`);
    if (!wadah) continue;
    ScrollTrigger.create({
      trigger: wadah,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => { if (self.isActive) panggung?.tampilkan(k.id); },
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
