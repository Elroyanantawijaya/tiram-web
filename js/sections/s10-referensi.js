// js/sections/s10-referensi.js — S10 Daftar pustaka & kredit.
// Seluruh teks dari CONTENT.s10. Kartu id-nya lewat idPustaka() — satu-satunya
// sumber juga dipakai buatSitasi() di dom.js, sehingga klik sitasi di badan
// teks selalu menemukan kartu yang tepat di sini.

import { gsap } from 'gsap';
import { el, kosongkan, kurangiGerak, idPustaka } from '../dom.js';

function teksEntri(p) {
  // Sama seperti entriLengkap() di dom.js (titik akhir dilepas dulu supaya
  // tidak jadi titik ganda saat digabung), tapi dipecah per ruas karena kartu
  // di sini menampilkan tiap ruas sebagai baris sendiri, bukan satu kalimat.
  const bersih = (s) => String(s).replace(/\.\s*$/, '');
  return {
    penulisTahun: `${bersih(p.penulis)} (${p.tahun})`,
    judul: bersih(p.judul),
    sumber: p.sumber ? bersih(p.sumber) : null,
  };
}

export function rakitS10(CONTENT) {
  const section = document.getElementById('s10-referensi');
  if (!section) return null;

  const s10 = CONTENT.s10;
  const isi = section.querySelector('.section__content');
  const subPustaka = section.querySelector('[data-subsection="pustaka"]');
  const subKredit = section.querySelector('[data-subsection="kredit"]');
  const slotFoto = document.getElementById('slot-foto-kip');

  /* ------------------------------------------------------------- kepala */

  const kepala = el('div', { class: 's10__kepala' }, [
    el('p', { class: 'eyebrow', text: s10.eyebrow }),
    el('h2', { class: 'section__judul', text: s10.judul }),
  ]);
  isi.insertBefore(kepala, isi.firstChild);

  /* --------------------------------------------------------------- pustaka */

  kosongkan(subPustaka);

  const kartu = s10.pustaka.map((p) => {
    const t = teksEntri(p);
    const teksCari = `${p.penulis} ${p.tahun} ${p.judul} ${p.sumber ?? ''}`.toLowerCase();
    const anak = [
      el('p', { class: 'pustaka__penulis', text: t.penulisTahun }),
      el('p', { class: 'pustaka__judul', text: t.judul }),
    ];
    if (t.sumber) anak.push(el('p', { class: 'pustaka__sumber', text: t.sumber }));
    if (p.url) {
      anak.push(el('a', {
        class: 'pustaka__tautan',
        href: p.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        'data-kursor': 'buka',
        text: s10.ui.bukaTab,
      }));
    }
    const node = el('article', {
      class: 'pustaka__kartu mono',
      id: `pustaka-${idPustaka(p)}`,
      tabindex: '-1',
    }, anak);
    node.dataset.cari = teksCari;
    return node;
  });

  const daftar = el('div', { class: 'pustaka__daftar', role: 'list' }, kartu);
  const status = el('p', { class: 'pustaka__status', 'aria-live': 'polite' });

  const cariId = 's10-cari';
  const cariInput = el('input', {
    class: 'pustaka__cari-input',
    type: 'search',
    id: cariId,
    placeholder: s10.ui.cariPlaceholder,
    autocomplete: 'off',
    oninput: (e) => saring(e.target.value),
  });

  const saring = (kueri) => {
    const q = kueri.trim().toLowerCase();
    let tampil = 0;
    for (const n of kartu) {
      const cocok = !q || n.dataset.cari.includes(q);
      n.hidden = !cocok;
      if (cocok) tampil++;
    }
    daftar.hidden = tampil === 0;
    status.textContent = q
      ? (tampil === 0 ? s10.ui.hasilKosong : `${tampil} dari ${kartu.length} entri cocok dengan "${kueri.trim()}".`)
      : `${kartu.length} entri.`;
  };
  saring('');

  subPustaka.append(
    el('div', { class: 'pustaka__cari', role: 'search' }, [
      el('label', { class: 'sr-only', for: cariId, text: s10.ui.cariLabel }),
      cariInput,
    ]),
    status,
    daftar
  );

  /* --------------------------------------------------------------- kredit */

  // slotFoto tetap kosong dan tetap di tempatnya (§CLAUDE.md: "#slot-foto-kip
  // disediakan kosong") — dua paragraf disisipkan di sekelilingnya, bukan
  // menimpanya lewat kosongkan().
  const judulKredit = el('h3', { class: 'subsection__judul', text: s10.ui.kreditJudul });
  const catatan = el('p', { class: 's10-kredit__catatan', text: s10.catatanPresentasi });
  const prosedural = el('p', { class: 's10-kredit__catatan', text: s10.pernyataanProsedural });
  subKredit.append(prosedural);               // urutan akhir diatur lewat insertBefore di bawah
  subKredit.insertBefore(catatan, slotFoto);
  subKredit.insertBefore(judulKredit, catatan);

  /* ------------------------------------------------------------------ gerak */

  if (!kurangiGerak()) {
    for (const n of [kepala, subPustaka, subKredit]) {
      gsap.fromTo(n, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: n, start: 'top 88%' },
      });
    }
  }

  return {};
}
