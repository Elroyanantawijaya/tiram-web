// js/sections/s1-hero.js — S1 Hero. Seluruh teks dari CONTENT.s1.

import { gsap } from 'gsap';
import { el, kosongkan, pecahBaris, hitungNaik, kurangiGerak } from '../dom.js';
import { pengelolaScene } from '../scene.js';
import { bangunHeroKip, fallbackHeroSvg } from '../models/kip-hero.js';

export function rakitS1(CONTENT) {
  const section = document.getElementById('s1-hero');
  if (!section) return null;

  const s1 = CONTENT.s1;
  const latar = section.querySelector('.section__bg');
  const isi = section.querySelector('.section__content');
  kosongkan(isi);

  const judul = el('h1', { class: 'hero__judul', text: s1.judul });
  const subjudul = el('p', { class: 'hero__subjudul', text: s1.subjudul });

  const statistik = el('ul', { class: 'hero__statistik' },
    s1.statistik.map((s) => el('li', { class: 'stat' }, [
      el('span', { class: 'stat__nilai mono', 'data-nilai': s.nilai }),
      el('span', { class: 'stat__label', text: s.label }),
      el('span', { class: 'stat__sumber mono', text: s.sumber }),
    ]))
  );

  isi.append(
    el('div', { class: 'hero__inner' }, [
      el('p', { class: 'eyebrow hero__eyebrow', text: s1.eyebrow }),
      judul,
      subjudul,
      el('p', { class: 'hero__kunci', text: s1.kalimatKunci }),
      statistik,
      el('div', { class: 'hero__petunjuk' }, [
        el('span', { class: 'hero__petunjuk-teks mono', text: s1.petunjukScroll }),
        el('span', { class: 'hero__petunjuk-rel', 'aria-hidden': 'true' }),
      ]),
    ])
  );

  // --- Latar 3D ---
  if (latar) {
    latar.append(el('p', { class: 'sr-only', text: CONTENT.ui.padananTeks.heroScene }));
    pengelolaScene.daftar({
      id: 's1-hero',
      wadah: latar,
      bangun: ({ mutuRendah }) => bangunHeroKip({ mutuRendah }),
      fallback: (wadah) => {
        wadah.classList.add('section__bg--fallback');
        wadah.insertAdjacentHTML('afterbegin', fallbackHeroSvg());
        wadah.append(
          el('div', { class: 'fallback-pesan' }, [
            el('p', { class: 'fallback-pesan__judul mono', text: CONTENT.ui.fallbackWebgl.judul }),
            el('p', { text: CONTENT.ui.fallbackWebgl.narasi }),
          ])
        );
      },
    });
  }

  let sudahAnimasi = false;

  return {
    /** Dipanggil setelah preloader keluar. */
    animasikan() {
      if (sudahAnimasi) return;
      sudahAnimasi = true;

      const barisJudul = pecahBaris(judul);
      const barisSub = pecahBaris(subjudul);
      const semuaBaris = [...barisJudul, ...barisSub];

      const nilaiStat = [...statistik.querySelectorAll('.stat__nilai')];
      const tampilkanStat = () => nilaiStat.forEach((n, i) => {
        hitungNaik(n, n.dataset.nilai, { durasi: 1200 + i * 160, poisson: true });
      });

      if (kurangiGerak()) {
        gsap.set(semuaBaris, { yPercent: 0, opacity: 1 });
        gsap.set(['.hero__eyebrow', '.hero__kunci', '.hero__statistik', '.hero__petunjuk'], { opacity: 1, y: 0 });
        tampilkanStat();
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero__eyebrow', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(semuaBaris, { yPercent: 115 }, { yPercent: 0, duration: 0.95, stagger: 0.08 }, '-=0.25')
        .fromTo('.hero__kunci', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
        .fromTo('.stat', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, onStart: tampilkanStat }, '-=0.35')
        .fromTo('.hero__petunjuk', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');
    },
  };
}
