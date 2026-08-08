// js/sections/s4-solusi.js — S4 Solusi: gagasan TIRAM. Seluruh teks dari CONTENT.s4.
// TIRAM bukan akronim — tidak ada blok pengejaan suku kata di sini.

import { gsap } from 'gsap';
import { el, kosongkan, paragraf, kurangiGerak } from '../dom.js';

export function rakitS4(CONTENT) {
  const section = document.getElementById('s4-solusi');
  if (!section) return null;

  const s4 = CONTENT.s4;
  const par = (t, kelas) => paragraf(t, CONTENT.s10.pustaka, CONTENT.ui.sitasi.petunjuk, kelas);
  const isi = section.querySelector('.section__content');
  kosongkan(isi);

  const zona = (label, isiNode, modifier) => el('div', { class: `s4__zona s4__zona--${modifier}` }, [
    el('p', { class: 's4__zona-label mono', text: label }),
    isiNode,
  ]);

  const diagram = el('div', { class: 's4__diagram' }, [
    zona(s4.diagramBatas.hulu.label, el('p', { class: 's4__zona-isi', text: s4.diagramBatas.hulu.isi }), 'luar'),
    el('span', { class: 's4__panah', 'aria-hidden': 'true' }),
    zona(s4.diagramBatas.tiram.label, el('p', { class: 's4__zona-isi', text: s4.diagramBatas.tiram.isi }), 'tiram'),
    el('span', { class: 's4__panah', 'aria-hidden': 'true' }),
    // hilir.isi memuat sitasi (Bisnis.com, 2026) — pakai paragraf() supaya tertaut.
    zona(s4.diagramBatas.hilir.label, par(s4.diagramBatas.hilir.isi, 's4__zona-isi'), 'luar'),
  ]);

  isi.append(
    el('p', { class: 'eyebrow', text: s4.eyebrow }),
    el('h2', { class: 'section__judul', text: s4.judul }),
    par(s4.pembuka, 's4__pembuka'),
    diagram,
    el('p', { class: 's4__penutup', text: s4.kalimatPenutup }),
    el('div', { class: 's4__batas-kebaruan' }, [
      el('p', { class: 'eyebrow', text: s4.batasKebaruan.judul }),
      el('p', { class: 's4__batas-kebaruan-teks', text: s4.batasKebaruan.narasi }),
    ])
  );

  if (!kurangiGerak()) {
    for (const n of [isi.querySelector('.s4__pembuka'), diagram, isi.querySelector('.s4__penutup'), isi.querySelector('.s4__batas-kebaruan')]) {
      gsap.fromTo(n, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: n, start: 'top 88%' },
      });
    }
  }

  return {};
}
