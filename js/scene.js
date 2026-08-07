// js/scene.js — satu instance WebGLRenderer untuk seluruh halaman.
// Canvas-nya dipindahkan (mount ulang) ke section yang sedang aktif, bukan
// membuat renderer baru per section. Scene di-init malas lewat IntersectionObserver
// dan render loop berhenti begitu section keluar viewport.

import * as THREE from 'three';
import { kurangiGerak } from './dom.js';

export const mutuRendah = () => window.matchMedia('(max-width: 767px)').matches;

class PengelolaScene {
  constructor() {
    this.renderer = null;
    this.dukungWebgl = null; // null = belum pernah dicoba
    this.terdaftar = new Map();
    this.aktif = null;
    this.jalan = false;
    this.jam = new THREE.Clock();
    this._loop = this._loop.bind(this);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this._berhenti();
      else if (this.aktif) this._mulai();
    });
  }

  _siapkanRenderer() {
    if (this.dukungWebgl !== null) return this.dukungWebgl;
    try {
      const r = new THREE.WebGLRenderer({ antialias: !mutuRendah(), alpha: true, powerPreference: 'high-performance' });
      r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      r.domElement.className = 'scene-canvas';
      this.renderer = r;
      this.dukungWebgl = true;
    } catch (e) {
      console.warn('WebGL tidak tersedia:', e);
      this.dukungWebgl = false;
    }
    return this.dukungWebgl;
  }

  /**
   * @param {object} o
   * @param {string} o.id
   * @param {HTMLElement} o.wadah  elemen tempat canvas dipasang
   * @param {Function} o.bangun    () => ({ scene, camera, perbarui?, ukurUlang? })
   * @param {Function} o.fallback  (wadah) => void, dipanggil bila WebGL gagal
   */
  daftar({ id, wadah, bangun, fallback }) {
    if (!wadah) return;
    const entri = { id, wadah, bangun, fallback, isi: null, gagal: false };
    this.terdaftar.set(id, entri);

    const pengamat = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) this._aktifkan(entri);
        else if (this.aktif === entri) this._nonaktifkan();
      }
    }, { rootMargin: '10% 0px' });
    pengamat.observe(wadah);

    const ro = new ResizeObserver(() => { if (this.aktif === entri) this._ukurUlang(); });
    ro.observe(wadah);
  }

  _aktifkan(entri) {
    if (this.aktif === entri) return;
    if (this.aktif) this._nonaktifkan();

    if (!this._siapkanRenderer()) {
      if (!entri.gagal) { entri.gagal = true; entri.fallback?.(entri.wadah); }
      return;
    }
    if (!entri.isi) {
      try {
        // Renderer ikut diserahkan: OrbitControls butuh domElement-nya, dan
        // envMap butuh PMREMGenerator yang terikat ke renderer yang sama.
        entri.isi = entri.bangun({ mutuRendah: mutuRendah(), renderer: this.renderer });
      } catch (e) {
        console.warn(`Scene "${entri.id}" gagal dibangun:`, e);
        entri.gagal = true;
        entri.fallback?.(entri.wadah);
        return;
      }
    }
    entri.wadah.append(this.renderer.domElement);
    this.aktif = entri;
    // Setelan renderer bersifat per scene. Kalau disetel global, tampilan hero
    // yang sudah diverifikasi ikut bergeser begitu scene lain menyetelnya.
    this.renderer.toneMapping = entri.isi.toneMapping ?? THREE.NoToneMapping;
    this.renderer.toneMappingExposure = entri.isi.toneMappingExposure ?? 1;
    entri.isi.aktifkan?.();
    this._ukurUlang();
    this._mulai();
  }

  _nonaktifkan() {
    this._berhenti();
    // Kontrol scene yang tidak aktif harus dimatikan: canvas dipakai bergantian,
    // jadi kalau tidak, ia ikut menanggapi gestur milik scene lain.
    this.aktif?.isi?.nonaktifkan?.();
    if (this.renderer?.domElement.parentNode) this.renderer.domElement.remove();
    this.aktif = null;
  }

  _ukurUlang() {
    const e = this.aktif;
    if (!e || !this.renderer) return;
    const { clientWidth: w, clientHeight: h } = e.wadah;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    if (e.isi.camera.isPerspectiveCamera) {
      e.isi.camera.aspect = w / h;
      e.isi.camera.updateProjectionMatrix();
    }
    e.isi.ukurUlang?.(w, h);
  }

  _mulai() {
    if (this.jalan || !this.aktif) return;
    this.jalan = true;
    this.jam.getDelta();
    requestAnimationFrame(this._loop);
  }

  _berhenti() { this.jalan = false; }

  _loop() {
    if (!this.jalan || !this.aktif) return;
    const dt = this.jam.getDelta();
    // Waktu dibekukan bila pengguna meminta gerak dikurangi: scene tetap tampil,
    // hanya tidak beranimasi.
    this.aktif.isi.perbarui?.(kurangiGerak() ? 0 : dt);
    this.renderer.render(this.aktif.isi.scene, this.aktif.isi.camera);
    requestAnimationFrame(this._loop);
  }
}

export const pengelolaScene = new PengelolaScene();
