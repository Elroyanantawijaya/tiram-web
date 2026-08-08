// js/sections/s8-kelayakan.js — S8 Kelayakan, dampak, dan keterbatasan.
// Satu-satunya section berlatar terang (§3.1). Seluruh teks dari CONTENT.s8.
//
// Dua hal di sini sengaja tidak "dirapikan":
//   1. Batang modul pada neraca memang nyaris tak terlihat di samping batang
//      KIP. Keduanya digambar dari satu skala yang sama, jadi memperbesar
//      batang modul supaya "terbaca" justru akan memalsukan pernyataannya.
//   2. Enam keterbatasan diberi bobot visual paling besar di section ini,
//      bukan paling kecil (aturan mengikat CLAUDE.md butir 5).

import { gsap } from 'gsap';
import { el, kosongkan, paragraf, kurangiGerak } from '../dom.js';

export function rakitS8(CONTENT) {
  const section = document.getElementById('s8-kelayakan');
  if (!section) return null;

  const s8 = CONTENT.s8;
  const par = (t, kelas) => paragraf(t, CONTENT.s10.pustaka, CONTENT.ui.sitasi.petunjuk, kelas);
  const isi = section.querySelector('.section__content');
  const sub = (nama) => section.querySelector(`[data-subsection="${nama}"]`);

  /* ------------------------------------------------------------- kepala */

  const kepala = el('div', { class: 's8__kepala' }, [
    el('p', { class: 'eyebrow', text: s8.eyebrow }),
    el('h2', { class: 'section__judul', text: s8.judul }),
  ]);
  isi.insertBefore(kepala, isi.firstChild);

  /* ------------------------------------------------- neraca laju alir */

  const nr = s8.neraca;
  const subNeraca = sub('neraca');
  kosongkan(subNeraca);

  // Lebar batang dihitung dari satu pembagi yang sama, sehingga skalanya
  // benar menurut konstruksi — bukan menurut angka yang diketik terpisah.
  const persen = (nilai) => `${(nilai / nr.skala.kip) * 100}%`;

  const baris = (label, lebar, nilai, modifier) => {
    const batang = el('div', { class: `s8-neraca__batang s8-neraca__batang--${modifier}` });
    batang.style.width = lebar;
    return el('div', { class: 's8-neraca__baris' }, [
      el('p', { class: 's8-neraca__baris-label', text: label }),
      el('div', { class: 's8-neraca__jalur' }, batang),
      el('p', { class: 's8-neraca__baris-nilai mono', text: nilai }),
    ]);
  };

  const grafik = el('div', {
    class: 's8-neraca__grafik',
    role: 'img',
    'aria-label': nr.padananTeks,
  }, [
    baris(nr.batangLabel.kip, persen(nr.skala.kip), nr.satuKip, 'kip'),
    baris(nr.batangLabel.modul, persen(nr.skala.modulMaks), nr.modul.padatan, 'modul'),
  ]);

  const spek = el('dl', { class: 's8-neraca__spek' });
  for (const kunci of ['pipa', 'kecepatan', 'debit', 'padatan']) {
    spek.append(
      el('dt', { class: 's8-neraca__spek-label', text: nr.modulLabel[kunci] }),
      el('dd', { class: 's8-neraca__spek-nilai mono', text: nr.modul[kunci] })
    );
  }

  subNeraca.append(
    el('h3', { class: 'subsection__judul', text: nr.judul }),
    grafik,
    el('p', { class: 's8-neraca__catatan', text: nr.catatanSkala }),
    spek,
    el('p', { class: 's8-neraca__peringatan', text: nr.labelPeringatan })
  );

  /* ---------------------------------------------------- tiga sudut manfaat */

  const subSudut = sub('tiga-sudut');
  kosongkan(subSudut);

  const kartuSudut = el('div', { class: 's8-sudut' }, s8.tigaSudut.map((s) =>
    el('article', { class: 's8-sudut__kartu' }, [
      el('h4', { class: 's8-sudut__nama', text: s.sudut }),
      el('p', { class: 's8-sudut__label', text: s.label }),
      par(s.narasi, 's8-sudut__narasi'),
    ])
  ));

  subSudut.append(
    el('h3', { class: 'subsection__judul', text: s8.tigaSudutJudul }),
    kartuSudut
  );

  /* ------------------------------------------------- enam keterbatasan */

  const subBatas = sub('enam-keterbatasan');
  kosongkan(subBatas);

  // role="list" dipertahankan eksplisit: Safari melepas semantik daftar
  // begitu list-style dibuat none, dan nomor visual di bawah aria-hidden.
  const daftarBatas = el('ol', { class: 's8-batas__daftar', role: 'list' }, s8.enamKeterbatasan.map((k, i) =>
    el('li', { class: 's8-batas__butir' }, [
      el('span', { class: 's8-batas__nomor mono', 'aria-hidden': 'true', text: String(i + 1).padStart(2, '0') }),
      el('div', { class: 's8-batas__isi' }, [
        el('h4', { class: 's8-batas__judul', text: k.judul }),
        el('p', { class: 's8-batas__narasi', text: k.narasi }),
      ]),
    ])
  ));

  subBatas.append(
    el('h3', { class: 'subsection__judul s8-batas__kepala', text: s8.enamKeterbatasanJudul }),
    el('p', { class: 's8-batas__pengantar', text: s8.enamKeterbatasanPengantar }),
    daftarBatas
  );
  subBatas.classList.add('s8-batas');

  /* ------------------------------------------------ pernyataan kalibrasi */

  const subKalibrasi = sub('kalibrasi-klaim');
  kosongkan(subKalibrasi);
  subKalibrasi.append(
    el('div', { class: 's8-kalibrasi' }, [
      el('p', { class: 'eyebrow', text: s8.pernyataanKalibrasiJudul }),
      par(s8.pernyataanKalibrasi, 's8-kalibrasi__teks'),
    ])
  );

  /* ------------------------------------------------------------- gerak */

  if (!kurangiGerak()) {
    // Satu momen terorkestrasi untuk section ini: kedua batang tumbuh dengan
    // laju yang sama persis, sehingga batang modul sudah berhenti jauh
    // sebelum batang KIP selesai menyapu lebar layar.
    const batang = grafik.querySelectorAll('.s8-neraca__batang');
    gsap.fromTo(batang, { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: grafik, start: 'top 85%' },
    });

    for (const n of [kepala, subNeraca, subSudut, subBatas, subKalibrasi]) {
      gsap.fromTo(n, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: n, start: 'top 88%' },
      });
    }
  }

  return {};
}
