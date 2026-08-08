// js/sections/s9-peta-jalan.js — S9 Peta jalan menuju penerapan.
// Enam langkah sebagai jalur mendatar (§S9). Seluruh teks dari CONTENT.s9.

import { gsap } from 'gsap';
import { el, kosongkan, kurangiGerak } from '../dom.js';

export function rakitS9(CONTENT) {
  const section = document.getElementById('s9-peta-jalan');
  if (!section) return null;

  const s9 = CONTENT.s9;
  const isi = section.querySelector('.section__content');
  kosongkan(isi);

  const langkahEl = s9.langkah.map((teks, i) => el('div', { class: 's9__langkah' }, [
    el('span', { class: 's9__nomor mono', 'aria-hidden': 'true', text: String(i + 1).padStart(2, '0') }),
    el('p', { class: 's9__teks', text: teks }),
  ]));

  // Panah di antara tiap langkah, bukan setelah langkah terakhir.
  const jalurAnak = [];
  langkahEl.forEach((n, i) => {
    jalurAnak.push(n);
    if (i < langkahEl.length - 1) jalurAnak.push(el('span', { class: 's9__panah', 'aria-hidden': 'true' }));
  });

  const jalur = el('ol', {
    class: 's9__jalur',
    role: 'list',
    'aria-label': `Enam langkah menuju penerapan, berurutan: ${s9.langkah.join('; ')}.`,
  }, jalurAnak);

  isi.append(
    el('p', { class: 'eyebrow', text: s9.eyebrow }),
    el('h2', { class: 'section__judul', text: s9.judul }),
    jalur,
    el('p', { class: 's9__penutup', text: s9.kalimatPenutup })
  );

  if (!kurangiGerak()) {
    gsap.fromTo(langkahEl, { opacity: 0, y: 18 }, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: jalur, start: 'top 85%' },
    });
    gsap.fromTo(isi.querySelector('.s9__penutup'), { opacity: 0, y: 18 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: isi.querySelector('.s9__penutup'), start: 'top 88%' },
    });
  }

  return {};
}
