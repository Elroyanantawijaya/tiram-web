// js/sections/s6-integrasi.js — S6 Integrasi: rakitan di atas dek KIP.
// Seluruh teks dari CONTENT.s6 dan CONTENT.s5.komponen.

import * as THREE from 'three';
import { el, kosongkan, paragraf } from '../dom.js';
import { pengelolaScene } from '../scene.js';
import { bangunPanggungRakitan } from '../models/panggung-rakitan.js';
import { buatLapisanAnotasi } from '../widgets/anotasi.js';

export function rakitS6(CONTENT) {
  const section = document.getElementById('s6-integrasi');
  if (!section) return null;

  const s6 = CONTENT.s6;
  const komponen = CONTENT.s5.komponen;
  const par = (t, kelas) => paragraf(t, CONTENT.s10.pustaka, CONTENT.ui.sitasi.petunjuk, kelas);

  /* --- kepala --- */
  const kepala = section.querySelector('.s6__kepala');
  kosongkan(kepala);
  kepala.append(
    el('p', { class: 'eyebrow', text: s6.eyebrow }),
    el('h2', { class: 'section__judul', text: s6.judul })
  );

  /* --- catatan di bawah panggung --- */
  const catatan = section.querySelector('.s6__catatan');
  kosongkan(catatan);
  catatan.append(
    par(s6.referensiSkala, 's6__catatan-baris'),
    par(s6.sorotJalur.catatan, 's6__catatan-baris'),
    par(s6.togglePosisiKapal, 's6__catatan-baris')
  );

  const wadahScene = section.querySelector('[data-component="canvas-3d-rakitan"]');
  const wadahKendali = section.querySelector('[data-s6-kendali]');
  const wadahKartu = section.querySelector('[data-s6-kartu]');

  let panggung = null;
  let lapisan = null;
  let sorotAktif = 0;
  let komponenAktif = null;

  /* --- kendali --- */
  kosongkan(wadahKendali);

  const tombolJalur = s6.sorotJalur.tombol.map((label, i) =>
    el('button', {
      class: 'kendali__tombol' + (i === 0 ? ' kendali__tombol--aktif' : ''),
      type: 'button',
      'aria-pressed': i === 0 ? 'true' : 'false',
      'data-kursor': 'mainkan',
      text: label,
      onclick: () => pilihJalur(i),
    })
  );

  const MODE = [null, 'konsentrat', 'buangan'];
  function pilihJalur(i) {
    sorotAktif = i;
    tombolJalur.forEach((t, n) => {
      t.classList.toggle('kendali__tombol--aktif', n === i);
      t.setAttribute('aria-pressed', String(n === i));
    });
    panggung?.aturSorot(MODE[i]);
  }

  const tombolXray = el('button', {
    class: 'kendali__tombol', type: 'button', 'aria-pressed': 'false',
    'data-kursor': 'mainkan', text: s6.tombol.xray,
    onclick: () => {
      const nyala = !panggung?.xrayNyala;
      panggung?.aturXray(nyala);
      tombolXray.classList.toggle('kendali__tombol--aktif', nyala);
      tombolXray.setAttribute('aria-pressed', String(nyala));
    },
  });

  const tombolDekat = el('button', {
    class: 'kendali__tombol kendali__tombol--aktif', type: 'button', 'aria-pressed': 'true',
    'data-kursor': 'mainkan', text: s6.tombol.dekat,
    onclick: () => pilihBidikan('dekat'),
  });
  const tombolLebar = el('button', {
    class: 'kendali__tombol', type: 'button', 'aria-pressed': 'false',
    'data-kursor': 'mainkan', text: s6.tombol.lebar,
    onclick: () => pilihBidikan('lebar'),
  });

  function pilihBidikan(nama) {
    panggung?.bidikan(nama);
    const dekat = nama === 'dekat';
    tombolDekat.classList.toggle('kendali__tombol--aktif', dekat);
    tombolDekat.setAttribute('aria-pressed', String(dekat));
    tombolLebar.classList.toggle('kendali__tombol--aktif', !dekat);
    tombolLebar.setAttribute('aria-pressed', String(!dekat));
    if (!dekat) tutupKartu();
  }

  wadahKendali.append(
    el('div', { class: 'kendali__gugus', role: 'group' }, tombolJalur),
    el('div', { class: 'kendali__gugus', role: 'group' }, [tombolXray, tombolDekat, tombolLebar])
  );

  /* --- kartu ringkas komponen --- */
  function tutupKartu() {
    komponenAktif = null;
    wadahKartu.hidden = true;
    lapisan?.el.querySelectorAll('.penanda').forEach((p) => p.classList.remove('penanda--redup'));
  }

  function bukaKartu(id) {
    const k = komponen.find((x) => x.id === id);
    if (!k) return;
    komponenAktif = id;
    kosongkan(wadahKartu);
    wadahKartu.append(
      el('button', {
        class: 'kartu__tutup', type: 'button',
        'aria-label': CONTENT.ui.kursor.buka, text: '×',
        onclick: tutupKartu,
      }),
      el('p', { class: 'komponen__nomor mono', text: String(k.nomor).padStart(2, '0') }),
      el('h3', { class: 'kartu-ringkas__nama', text: k.nama }),
      k.subjudul ? el('p', { class: 'kartu-ringkas__sub', text: k.subjudul }) : null,
      par(k.apa, 'kartu-ringkas__apa')
    );
    wadahKartu.hidden = false;
    // Penanda lain meredup.
    lapisan?.el.querySelectorAll('.penanda').forEach((p) => {
      p.classList.toggle('penanda--redup', p.dataset.komponen !== id);
    });
    panggung?.keKomponen(id);
  }

  /* --- panggung 3D --- */
  pengelolaScene.daftar({
    id: 's6-integrasi',
    wadah: wadahScene,
    bangun: ({ mutuRendah, renderer }) => {
      panggung = bangunPanggungRakitan({ mutuRendah, renderer });

      lapisan = buatLapisanAnotasi(wadahScene);
      for (const p of panggung.penanda()) {
        lapisan.tambah(
          el('button', {
            class: 'penanda', type: 'button',
            'data-komponen': p.id, 'data-kursor': 'buka',
            'aria-label': komponen.find((k) => k.id === p.id)?.nama ?? String(p.nomor),
            text: String(p.nomor),
            onclick: () => bukaKartu(p.id),
          }),
          p.dunia
        );
      }
      // Penanda skala pada siluet manusia dan keterangan dek.
      const posOrang = panggung.rakitan.orang.position.clone();
      posOrang.y += 2.2;
      lapisan.tambah(el('span', { class: 'anotasi__label mono', text: s6.labelSkala }), posOrang);
      // Keterangan dek: dipatok di tepi depan dek, sedikit di atas permukaannya.
      lapisan.tambah(
        el('span', { class: 'anotasi__label anotasi__label--kabur mono', text: s6.labelDek }),
        new THREE.Vector3(14, 0.8, 12)
      );

      // Lapisan anotasi ikut diperbarui tiap frame.
      const perbaruiAsli = panggung.perbarui;
      panggung.perbarui = (dt) => {
        perbaruiAsli.call(panggung, dt);
        lapisan.perbarui(panggung.camera, wadahScene.clientWidth, wadahScene.clientHeight);
      };

      return panggung;
    },
    fallback: (wadah) => {
      wadah.classList.add('panggung__scene--fallback');
      wadah.append(
        el('div', { class: 'fallback-pesan' }, [
          el('p', { class: 'fallback-pesan__judul mono', text: CONTENT.ui.fallbackWebgl.judul }),
          el('p', { text: CONTENT.ui.fallbackWebgl.narasi }),
        ])
      );
    },
  });

  wadahScene.append(el('p', { class: 'sr-only', text: s6.padananTeks }));

  return { get panggung() { return panggung; } };
}
