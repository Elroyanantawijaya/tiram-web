// js/models/komponen.js — geometri lima komponen inti SI-RETAM.
//
// Diport dari bConditioner/bWHIMS/bSensor/bValve/bBunker di
// spec/SI-RETAM_3D.html. Setiap posisi, ukuran, rotasi, dan urutan penambahan
// disalin persis — bentuk dan susunan alat sudah benar secara teknis dan tidak
// boleh diubah. Hanya tiga penyesuaian mekanis yang dilakukan:
//
//   1. `S.` menjadi `THREE.`, helper diimpor sebagai modul.
//   2. Pemanggilan label() dihapus; teks label kini hidup di data/content.js
//      (s5.komponen[].anotasi) untuk dirender sebagai anotasi HTML nanti.
//   3. userData {focus, dist} dipertahankan apa adanya — kedua angka itulah yang
//      menentukan titik pandang dan jarak orbit awal tiap komponen.

import * as THREE from 'three';
import { bahan, M, box, cyl, torus, sphere, pipeBetween, arrowPipe, trefoilTexture } from './bahan.js';

const { steel, dark, copper, yellow, lead, pipe, rubber, innerM } = bahan;

/* 1 · Pengkondisi umpan */
export function bangunPengkondisi() {
  const g = new THREE.Group();
  const body = cyl(1, 1, 2.2, steel); body.position.y = 1.3; g.add(body);
  const top = sphere(1, steel); top.scale.y = 0.5; top.position.y = 2.4; g.add(top);
  const bot = sphere(1, steel); bot.scale.y = 0.5; bot.position.y = 0.2; g.add(bot);
  const motor = cyl(0.28, 0.28, 0.5, dark); motor.position.y = 3.0; g.add(motor);
  const mbox = box(0.5, 0.35, 0.5, dark); mbox.position.y = 3.35; g.add(mbox);
  const shaft = cyl(0.05, 0.05, 1.4, steel); shaft.position.y = 2.2; g.add(shaft);
  const paddle = box(0.7, 0.08, 0.18, steel); paddle.position.y = 1.55; g.add(paddle);
  const vent = cyl(0.09, 0.09, 0.7, pipe); vent.position.set(0.55, 3.0, 0); vent.rotation.z = -0.5; g.add(vent);
  g.add(pipeBetween([-1.6, 0.6, 0], [-0.9, 0.6, 0], 0.16, pipe));
  g.add(pipeBetween([0.9, 0.6, 0], [1.6, 0.6, 0], 0.16, pipe));
  g.userData = { focus: new THREE.Vector3(0, 1.6, 0), dist: 8 };
  return g;
}

/* 2 · Pemisah magnetik (WHIMS) */
export function bangunWhims() {
  const g = new THREE.Group();
  const hous = box(2.2, 1.8, 1.6, dark); hous.position.y = 1.4; g.add(hous);
  const ring = torus(0.75, 0.16, steel); ring.position.set(0, 1.4, 0.82); g.add(ring);
  const matrix = torus(0.75, 0.30, M(0x8b949c, 0.4, 0.85)); matrix.position.set(0, 1.4, 0.7); g.add(matrix);
  const coilL = cyl(0.34, 0.34, 0.5, copper); coilL.rotation.z = Math.PI / 2; coilL.position.set(-1.2, 1.4, 0); g.add(coilL);
  const coilR = coilL.clone(); coilR.position.x = 1.2; g.add(coilR);
  g.add(pipeBetween([0, 2.6, 0.5], [0, 3.3, 0.5], 0.15, pipe));
  g.add(arrowPipe([-0.5, 0.5, 0.4], [-0.5, -0.4, 0.4], 0.14, pipe));
  g.add(arrowPipe([0.5, 0.5, 0.4], [0.5, -0.4, 0.4], 0.14, pipe));
  g.userData = { focus: new THREE.Vector3(0, 1.4, 0), dist: 9 };
  return g;
}

/* 3 · Sensor gamma + PLC */
export function bangunSensor() {
  const g = new THREE.Group();
  const p = cyl(0.28, 0.28, 3.2, pipe); p.position.y = 1.6; g.add(p);
  const collar = cyl(0.55, 0.55, 0.7, yellow); collar.position.y = 1.7; g.add(collar);
  const collar2 = cyl(0.6, 0.6, 0.2, dark); collar2.position.y = 2.1; g.add(collar2);
  const cab = box(0.9, 1.3, 0.6, steel); cab.position.set(1.6, 0.75, 0); g.add(cab);
  const door = box(0.02, 1.1, 0.5, M(0x778391, 0.6, 0.4)); door.position.set(1.14, 0.8, 0); g.add(door);
  g.add(pipeBetween([0.55, 1.7, 0], [1.2, 1.1, 0], 0.05, rubber));
  g.add(arrowPipe([0, 3.2, 0], [0, 3.9, 0], 0.1, pipe));
  g.add(arrowPipe([0, 0, 0], [0, -0.5, 0], 0.1, pipe));
  g.userData = { focus: new THREE.Vector3(0.6, 1.6, 0), dist: 8 };
  return g;
}

/* 4 · Katup pengarah */
export function bangunKatup() {
  const g = new THREE.Group();
  g.add(pipeBetween([-1.5, 0, 0], [0, 0, 0], 0.24, pipe));
  const bodyv = cyl(0.34, 0.34, 0.7, rubber); bodyv.rotation.z = Math.PI / 2; g.add(bodyv);
  g.add(arrowPipe([0, 0, 0], [1.3, 0.85, 0], 0.22, pipe));
  g.add(arrowPipe([0, 0, 0], [1.3, -0.85, 0], 0.22, pipe));
  const act = cyl(0.3, 0.3, 0.7, dark); act.position.y = 0.75; g.add(act);
  const knob = cyl(0.18, 0.18, 0.25, yellow); knob.position.y = 1.2; g.add(knob);
  g.userData = { focus: new THREE.Vector3(0, 0, 0), dist: 7 };
  return g;
}

/* 5 · Bunker berperisai */
export function bangunBunker() {
  const g = new THREE.Group();
  const w = 2, h = 1.6, d = 1.6, t = 0.16;
  const wall = (ww, hh, dd, x, y, z) => { const m = box(ww, hh, dd, lead); m.position.set(x, y, z); g.add(m); };
  wall(w, t, d, 0, 0.0, 0);
  wall(w, h, t, 0, h / 2, d / 2 - t / 2);
  wall(w, h, t, 0, h / 2, -d / 2 + t / 2);
  wall(t, h, d, -w / 2 + t / 2, h / 2, 0);
  wall(t, h, d, w / 2 - t / 2, h / 2, 0);
  const inner = box(w - 2 * t, h - t, d - 2 * t, innerM); inner.position.y = h / 2 + 0.06; g.add(inner);
  const chute = cyl(0.3, 0.3, 0.6, pipe); chute.position.set(0, h + 0.25, 0); g.add(chute);
  const tre = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshBasicMaterial({ map: trefoilTexture() }));
  tre.position.set(w / 2 - t / 2 + 0.01, h * 0.55, 0); tre.rotation.y = Math.PI / 2; g.add(tre);
  g.userData = { focus: new THREE.Vector3(0, h * 0.5, 0), dist: 8 };
  return g;
}

/** Dipetakan dengan id komponen di data/content.js (s5.komponen[].id). */
export const PEMBANGUN = {
  c1: bangunPengkondisi,
  c2: bangunWhims,
  c3: bangunSensor,
  c4: bangunKatup,
  c5: bangunBunker,
};
