// js/sections/s3-argumen.js — S3 Argumen: simulator "Empat Sifat" + S3b.
// Seluruh teks dari CONTENT.s3.

import { gsap } from 'gsap';
import { el, kosongkan, paragraf, kurangiGerak } from '../dom.js';
import { buatSimulatorEmpatSifat } from '../widgets/empat-sifat.js';

export function rakitS3(CONTENT) {
  const section = document.getElementById('s3-argumen');
  if (!section) return null;

  const s3 = CONTENT.s3;
  const par = (t, kelas) => paragraf(t, CONTENT.s10.pustaka, CONTENT.ui.sitasi.petunjuk, kelas);
  const isi = section.querySelector('.section__content');

  /* --- kepala + mount simulator --- */
  const wadahSimulator = section.querySelector('[data-component="simulator-empat-sifat"]');

  // Kepala disisipkan di depan simulator yang sudah ada di HTML, S3b di
  // belakangnya — tidak mengosongkan section__content secara keseluruhan,
  // supaya wadahSimulator (dan subsection b) tidak ikut lepas dari DOM.
  const kepala = el('div', { class: 's3__kepala' }, [
    el('p', { class: 'eyebrow', text: s3.eyebrow }),
    el('h2', { class: 'section__judul', text: s3.judul }),
    par(s3.intro, 's3__intro'),
  ]);
  isi.insertBefore(kepala, wadahSimulator);

  /* --- simulator --- */
  kosongkan(wadahSimulator);
  wadahSimulator.append(buatSimulatorEmpatSifat(CONTENT).el);

  /* --- S3b --- */
  const subB = section.querySelector('[data-subsection="b"]');
  kosongkan(subB);

  const ak = s3.b.angkaKunci;
  const angka = (nilai, label) => el('div', {}, [
    el('span', { class: 's3b__angka-nilai mono', text: nilai }),
    el('span', { class: 's3b__angka-label', text: label }),
  ]);
  const angkaKunciEl = el('div', { class: 's3b__angka' }, [
    angka(ak.konsentratNaik, ak.konsentratNaikLabel),
    angka(ak.lossesTailing, ak.lossesTailingLabel),
    angka(ak.pengotorKonsentratPeleburan, ak.pengotorKonsentratPeleburanLabel),
  ]);

  const duaJalur = el('div', { class: 's3b__jalur' }, s3.b.duaJalur.map((j) =>
    el('div', { class: 's3b__jalur-kartu' }, [
      el('p', { class: 's3b__jalur-label', text: j.label }),
      el('p', { class: 's3b__jalur-konsekuensi', text: j.konsekuensi }),
    ])
  ));

  subB.append(
    el('h3', { class: 'subsection__judul', text: s3.b.judul }),
    ...s3.b.narasi.map((t) => par(t)),
    angkaKunciEl,
    el('p', { class: 's3b__sumber', text: ak.sumberAngka }),
    duaJalur
  );

  /* --- reveal sederhana --- */
  if (!kurangiGerak()) {
    for (const n of [kepala, wadahSimulator, subB]) {
      gsap.fromTo(n, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: n, start: 'top 88%' },
      });
    }
  }

  return {};
}
