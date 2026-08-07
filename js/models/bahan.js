// js/models/bahan.js — primitif dan material bersama untuk model komponen.
//
// Diport dari helper di spec/TIRAM_3D.html. Tanda tangan dan perhitungannya
// dipertahankan persis; yang berubah hanya `S.` menjadi `THREE.` dan bentuk modul.
// Warna serta nilai metalness/roughness kedelapan material juga tidak diubah —
// peningkatan §5 datang dari lingkungan render (envMap RoomEnvironment, tone
// mapping, bayangan kontak), bukan dari mengutak-atik angka materialnya.

import * as THREE from 'three';

/* --------------------------------------------------------------- material */

export const M = (c, m, r) => new THREE.MeshStandardMaterial({
  color: c, metalness: m, roughness: r, envMapIntensity: 0.9,
});

export const bahan = {
  steel: M(0x9aa3ab, 0.8, 0.35),
  dark: M(0x55606a, 0.7, 0.5),
  copper: M(0xb87333, 0.75, 0.4),
  yellow: M(0xf1c40f, 0.3, 0.5),
  lead: M(0x6b7078, 0.5, 0.6),
  pipe: M(0x8a9096, 0.7, 0.4),
  rubber: M(0x2b2f36, 0.1, 0.9),
  innerM: M(0x3a4048, 0.3, 0.9),
};

/* -------------------------------------------------------------- primitif */

// §2 meminta segmen silinder disederhanakan 28 → 12 di bawah 768px. Faktor ini
// hanya menyentuh kerapatan segmen, bukan ukuran atau susunan.
let detail = 1;
export const aturDetail = (f) => { detail = f; };
const seg = (n) => Math.max(8, Math.round(n * detail));

export function cyl(r1, r2, h, mat, segmen) {
  return new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg(segmen || 28)), mat);
}

export function box(w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

export function torus(r, t, mat, segmen) {
  return new THREE.Mesh(new THREE.TorusGeometry(r, t, seg(14), seg(segmen || 26)), mat);
}

export function sphere(r, mat) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, seg(24), seg(18)), mat);
}

export function pipeBetween(a, b, r, mat) {
  const A = new THREE.Vector3(a[0], a[1], a[2]);
  const B = new THREE.Vector3(b[0], b[1], b[2]);
  const d = new THREE.Vector3().subVectors(B, A);
  const m = cyl(r, r, d.length(), mat, 20);
  m.position.copy(A).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  return m;
}

export function arrowPipe(a, b, r, mat) {
  const g = new THREE.Group();
  g.add(pipeBetween(a, b, r, mat));
  const B = new THREE.Vector3(b[0], b[1], b[2]);
  const A = new THREE.Vector3(a[0], a[1], a[2]);
  const d = new THREE.Vector3().subVectors(B, A).normalize();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(r * 2, r * 4, seg(16)), mat);
  cone.position.copy(B);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  g.add(cone);
  return g;
}

export function route(pts, r, mat) {
  const g = new THREE.Group();
  for (let i = 0; i < pts.length - 1; i++) {
    g.add(pipeBetween(pts[i], pts[i + 1], r, mat));
    if (i > 0) {
      const j = sphere(r * 1.1, mat);
      j.position.set(pts[i][0], pts[i][1], pts[i][2]);
      g.add(j);
    }
  }
  return g;
}

export function routeArrow(pts, r, mat) {
  const g = route(pts, r, mat);
  const a = pts[pts.length - 2];
  const b = pts[pts.length - 1];
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(r * 2, r * 4, seg(16)), mat);
  cone.position.set(b[0], b[1], b[2]);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  g.add(cone);
  return g;
}

/* ------------------------------------------------- tekstur trefoil (bunker) */

function roundRect(x, X, Y, w, h, r) {
  x.beginPath();
  x.moveTo(X + r, Y);
  x.arcTo(X + w, Y, X + w, Y + h, r);
  x.arcTo(X + w, Y + h, X, Y + h, r);
  x.arcTo(X, Y + h, X, Y, r);
  x.arcTo(X, Y, X + w, Y, r);
  x.closePath();
}
export { roundRect };

let _trefoil = null;
export function trefoilTexture() {
  if (_trefoil) return _trefoil;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const x = cv.getContext('2d');
  x.fillStyle = '#f1c40f';
  x.fillRect(0, 0, 256, 256);
  x.fillStyle = '#111';
  const cx = 128, cy = 128;
  for (let i = 0; i < 3; i++) {
    const a = i * 2 * Math.PI / 3 - Math.PI / 2;
    x.beginPath();
    x.moveTo(cx, cy);
    x.arc(cx, cy, 110, a - 0.52, a + 0.52);
    x.closePath();
    x.fill();
  }
  x.beginPath();
  x.arc(cx, cy, 22, 0, 7);
  x.fill();
  _trefoil = new THREE.CanvasTexture(cv);
  _trefoil.colorSpace = THREE.SRGBColorSpace;
  return _trefoil;
}
