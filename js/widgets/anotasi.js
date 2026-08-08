// js/widgets/anotasi.js — lapisan anotasi HTML di atas canvas 3D.
//
// Titik jangkar 3D diproyeksikan ke koordinat layar tiap frame, lalu elemen HTML
// biasa ditempatkan di sana. Dibanding sprite kanvas, cara ini menghasilkan teks
// yang tajam di semua kerapatan piksel dan tetap bisa dijangkau keyboard (§5).
//
// Dipakai S6 untuk penanda bernomor, dan disiapkan untuk anotasi komponen S5.

import { el } from '../dom.js';

export function buatLapisanAnotasi(wadah) {
  const lapis = el('div', { class: 'anotasi' });
  wadah.append(lapis);

  const butir = [];

  return {
    el: lapis,

    /** @param {HTMLElement} node @param {THREE.Vector3} pos titik jangkar dunia */
    tambah(node, pos) {
      lapis.append(node);
      butir.push({ node, pos });
      return node;
    },

    kosongkan() {
      butir.length = 0;
      while (lapis.firstChild) lapis.removeChild(lapis.firstChild);
    },

    /** Dipanggil tiap frame dari loop render scene. */
    perbarui(camera, w, h) {
      for (const b of butir) {
        const v = b.pos.clone().project(camera);
        // v.z > 1 berarti titik ada di belakang kamera.
        const dibelakang = v.z > 1;
        if (dibelakang) {
          b.node.style.opacity = '0';
          b.node.style.pointerEvents = 'none';
          continue;
        }
        const x = (v.x * 0.5 + 0.5) * w;
        const y = (-v.y * 0.5 + 0.5) * h;
        b.node.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        b.node.style.opacity = '';
        b.node.style.pointerEvents = '';
      }
    },
  };
}
