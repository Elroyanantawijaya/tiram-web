// js/sections/s2-pendahuluan.js — S2 Pendahuluan (a–f). Teks dari CONTENT.s2.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { el, kosongkan, paragraf, kurangiGerak } from '../dom.js';
import { buatPanelS2 } from '../widgets/panel-s2.js';

const mutuRendah = () => window.matchMedia('(max-width: 767px)').matches;
const sempit = () => window.matchMedia('(max-width: 899px)').matches;

export function rakitS2(CONTENT) {
  const section = document.getElementById('s2-pendahuluan');
  if (!section) return null;

  const s2 = CONTENT.s2;
  const pustaka = CONTENT.s10.pustaka;
  const petunjuk = CONTENT.ui.sitasi.petunjuk;
  const par = (teks, kelas) => paragraf(teks, pustaka, petunjuk, kelas);

  /* --- kepala section --- */
  const kepala = section.querySelector('.s2__kepala');
  kosongkan(kepala);
  kepala.append(
    el('p', { class: 'eyebrow', text: s2.eyebrow }),
    el('h2', { class: 'section__judul', text: s2.judul })
  );

  /* --- panel sticky --- */
  const wadahPanel = section.querySelector('[data-panel="s2"]');
  const panel = buatPanelS2(wadahPanel, CONTENT, { mutuRendah: mutuRendah() });

  const isiSub = (kunci) => section.querySelector(`[data-subsection="${kunci}"]`);

  /* --- a --- */
  const subA = isiSub('a');
  kosongkan(subA);
  subA.append(
    el('h3', { class: 'subsection__judul', text: s2.a.judul }),
    par(s2.a.narasi)
  );

  /* --- b: kartu mineral --- */
  const subB = isiSub('b');
  kosongkan(subB);
  const kartu = s2.b.kartu.map((k) => {
    const baris = [];
    const tambah = (label, nilai) => { if (nilai) baris.push(el('div', { class: 'kartu__baris' }, [
      el('span', { class: 'kartu__kunci mono', text: label }),
      el('span', { class: 'kartu__nilai', text: nilai }),
    ])); };
    tambah('densitas', k.densitas);
    tambah('magnetik', k.kerentananMagnetik);
    tambah('konduktivitas', k.konduktivitas);
    tambah('radioaktif', k.radioaktivitas);

    const isi = [el('h4', { class: 'kartu__nama', text: k.nama }), ...baris];
    // Lubang data ditandai apa adanya, bukan diisi angka karangan.
    if (k.todoDensitasDkk) isi.push(el('p', { class: 'kartu__todo', text: k.todoDensitasDkk }));
    // Sifat yang datang dari konfirmasi penulis, bukan dari ketiga berkas sumber,
    // tetap disebut asalnya alih-alih diam-diam disamakan dengan yang tersitasi.
    if (k.sumberSifat) isi.push(el('p', { class: 'kartu__sumber-sifat', text: k.sumberSifat }));
    if (k.catatan) isi.push(par(k.catatan, 'kartu__catatan'));

    // Sengaja <article> yang dapat difokus, bukan <button>: catatan di dalamnya
    // memuat sitasi yang sendirinya berupa tombol, dan tombol bersarang tidak sah.
    const node = el('article', {
      class: 'kartu-mineral',
      tabindex: '0',
      'data-mineral': k.id,
      'data-kursor': 'mainkan',
    }, isi);

    const nyala = () => { panel.sorotMineral(k.id); node.classList.add('kartu-mineral--nyala'); };
    const padam = () => { panel.sorotMineral(null); node.classList.remove('kartu-mineral--nyala'); };
    node.addEventListener('pointerenter', nyala);
    node.addEventListener('pointerleave', padam);
    node.addEventListener('focusin', nyala);
    node.addEventListener('focusout', (e) => { if (!node.contains(e.relatedTarget)) padam(); });
    return node;
  });

  subB.append(
    el('h3', { class: 'subsection__judul', text: s2.b.judul }),
    par(s2.b.narasi),
    el('div', { class: 'kartu-mineral__kisi' }, kartu)
  );

  /* --- c --- */
  const subC = isiSub('c');
  kosongkan(subC);
  subC.append(
    el('h3', { class: 'subsection__judul', text: s2.c.judul }),
    el('div', { class: 's2-c__pasangan' }, [
      el('div', { class: 's2-c__blok' }, [
        el('p', { class: 'eyebrow', text: s2.c.fisik.label }),
        par(s2.c.fisik.narasi),
      ]),
      el('div', { class: 's2-c__blok' }, [
        el('p', { class: 'eyebrow', text: s2.c.radiologis.label }),
        par(s2.c.radiologis.narasi),
      ]),
    ]),
    par(s2.c.kalimatPenyeimbang, 'penyeimbang')
  );

  /* --- d --- */
  const subD = isiSub('d');
  kosongkan(subD);
  subD.append(
    el('h3', { class: 'subsection__judul', text: s2.d.judul }),
    par(s2.d.narasi),
    par(s2.d.penghambat)
  );

  /* --- e: linimasa regulasi --- */
  const wadahE = section.querySelector('.s2-linimasa');
  kosongkan(wadahE);
  const relE = el('div', { class: 'linimasa__rel' },
    s2.e.linimasa.map((r) => el('article', { class: 'linimasa__kartu' }, [
      el('p', { class: 'linimasa__regulasi mono', text: r.regulasi }),
      el('p', { class: 'linimasa__implikasi', text: r.implikasi }),
    ]))
  );
  wadahE.append(
    el('h3', { class: 'subsection__judul', text: s2.e.judul }),
    el('div', { class: 'linimasa__bingkai' }, relE)
  );

  /* --- f: celah --- */
  const wadahF = section.querySelector('.s2-celah');
  kosongkan(wadahF);
  wadahF.append(
    el('h3', { class: 'eyebrow', text: s2.f.judul }),
    el('p', { class: 's2-celah__utama', text: s2.f.kalimatUtama }),
    par(s2.f.narasiLengkap, 's2-celah__dukung')
  );

  /* --- pemicu scroll --- */
  const pemicu = [];

  const pasangPemicu = () => {
    pemicu.forEach((t) => t.kill());
    pemicu.length = 0;

    // Panel berganti mengikuti sub-bagian yang sedang dibaca.
    for (const kunci of ['a', 'b', 'c', 'd']) {
      pemicu.push(ScrollTrigger.create({
        trigger: isiSub(kunci),
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => { if (self.isActive) panel.tampilkan(kunci); },
        onUpdate: (self) => { if (kunci === 'a' && self.isActive) panel.panel.a.aturProgres(self.progress); },
      }));
    }

    // Linimasa: digeser mendatar sambil di-pin. Di layar sempit dan saat gerak
    // dikurangi, pin dilepas dan kartu jadi daftar vertikal biasa (CSS), sebab
    // pinned horizontal scroll gampang merebut gestur scroll di layar sentuh.
    if (!sempit() && !kurangiGerak()) {
      const jarak = () => Math.max(0, relE.scrollWidth - wadahE.clientWidth + 32);
      pemicu.push(ScrollTrigger.create({
        trigger: wadahE,
        start: 'top top',
        end: () => `+=${jarak() + window.innerHeight * 0.6}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        // Pin ini menyisipkan spacer yang menggeser seluruh isi di bawahnya.
        // Karena ia dibuat belakangan (saat ambang lebar terlampaui), tanpa
        // prioritas ini pemicu S5 menghitung posisinya lebih dulu — sebelum
        // spacer ada — dan meleset sejauh tinggi spacer itu.
        refreshPriority: 1,
        // Progres dijepit: scrub boleh melampaui 0..1 sesaat, dan tanpa jepitan
        // rel ikut tergeser melewati kartu terakhir.
        onUpdate: (self) => {
          const p = Math.min(1, Math.max(0, self.progress));
          gsap.set(relE, { x: -jarak() * p });
        },
      }));
    } else {
      gsap.set(relE, { x: 0 });
    }
  };

  pasangPemicu();
  ScrollTrigger.addEventListener('refreshInit', () => gsap.set(relE, { x: 0 }));

  // Pin linimasa hanya dipakai di layar lebar dan saat gerak tidak dikurangi.
  // Keputusan itu harus dinilai ulang ketika ambangnya terlampaui — kalau tidak,
  // jendela yang diubah ukurannya (atau ponsel yang diputar) terkunci pada
  // keputusan yang diambil saat halaman pertama dimuat.
  const pasangUlang = () => { pasangPemicu(); ScrollTrigger.refresh(); };
  window.matchMedia('(min-width: 900px)').addEventListener('change', pasangUlang);
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', pasangUlang);

  // Reveal sederhana per sub-bagian.
  if (!kurangiGerak()) {
    for (const n of section.querySelectorAll('.subsection, .s2-linimasa, .s2-celah')) {
      gsap.fromTo(n, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: n, start: 'top 85%' },
      });
    }
  }

  panel.tampilkan('a');

  return { panel, pasangPemicu };
}
