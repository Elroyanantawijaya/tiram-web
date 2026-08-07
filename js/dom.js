// js/dom.js — helper DOM kecil yang dipakai lintas section.
// Tidak memuat satu pun string isi; semua teks datang dari data/content.js.

/** Buat elemen. `opts.text` mengisi textContent, `opts.html` hanya untuk markup yang kita bangun sendiri. */
export function el(tag, opts = {}, anak = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(opts)) {
    if (v === null || v === undefined) continue;
    if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(anak)) {
    if (c === null || c === undefined) continue;
    node.append(c);
  }
  return node;
}

export const kosongkan = (node) => { while (node.firstChild) node.removeChild(node.firstChild); };

export const kurangiGerak = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Pecah teks sebuah elemen menjadi baris-baris visual, tiap baris dibungkus
 * mask (overflow hidden) supaya bisa di-reveal naik. Dipanggil ulang saat resize.
 * Mengembalikan array elemen bagian dalam yang boleh dianimasikan.
 */
export function pecahBaris(node) {
  const teks = node.dataset.teksAsli ?? node.textContent.trim();
  node.dataset.teksAsli = teks;

  kosongkan(node);
  const kata = teks.split(/\s+/).map((k) => {
    const s = el('span', { class: 'kata', text: k });
    node.append(s, document.createTextNode(' '));
    return s;
  });

  // Kelompokkan kata menurut posisi vertikalnya.
  const baris = [];
  let atasSekarang = null;
  for (const k of kata) {
    const atas = k.offsetTop;
    if (atasSekarang === null || Math.abs(atas - atasSekarang) > 2) {
      baris.push([]);
      atasSekarang = atas;
    }
    baris[baris.length - 1].push(k.textContent);
  }

  kosongkan(node);
  return baris.map((kataBaris) => {
    const dalam = el('span', { class: 'baris__dalam', text: kataBaris.join(' ') });
    node.append(el('span', { class: 'baris' }, dalam));
    return dalam;
  });
}

/** Format angka gaya Indonesia: koma sebagai pemisah desimal, titik sebagai pemisah ribuan. */
export function formatAngka(n, desimal) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: desimal, maximumFractionDigits: desimal });
}

/**
 * Count-up untuk setiap angka di dalam sebuah string, dengan format aslinya dipertahankan.
 * `poisson` menambahkan derau cacah kecil sebelum angka mengunci (§5).
 */
export function hitungNaik(node, teksTarget, { durasi = 1400, poisson = false } = {}) {
  const potongan = teksTarget.split(/(\d+(?:,\d+)?)/);
  const angka = [];
  kosongkan(node);

  for (const p of potongan) {
    if (/^\d+(,\d+)?$/.test(p)) {
      const desimal = p.includes(',') ? p.split(',')[1].length : 0;
      const target = parseFloat(p.replace(',', '.'));
      const span = el('span', { class: 'angka-hidup', text: formatAngka(0, desimal) });
      node.append(span);
      angka.push({ span, target, desimal });
    } else if (p) {
      node.append(document.createTextNode(p));
    }
  }

  if (!angka.length) { node.textContent = teksTarget; return; }

  if (kurangiGerak()) {
    for (const a of angka) a.span.textContent = formatAngka(a.target, a.desimal);
    return;
  }

  const mulai = performance.now();
  const langkah = (kini) => {
    const t = Math.min(1, (kini - mulai) / durasi);
    const eased = 1 - Math.pow(1 - t, 3);
    for (const a of angka) {
      let nilai = a.target * eased;
      // Derau Poisson kecil: hanya sebelum mengunci, dan hanya di angka bertema cacah.
      if (poisson && t < 0.92 && nilai > 0) nilai += (Math.random() - 0.5) * Math.sqrt(nilai) * 0.6;
      a.span.textContent = formatAngka(Math.max(0, nilai), a.desimal);
    }
    if (t < 1) requestAnimationFrame(langkah);
    else for (const a of angka) a.span.textContent = formatAngka(a.target, a.desimal);
  };
  requestAnimationFrame(langkah);
}

/**
 * Ubah sitasi dalam teks — pola `(Nama dkk., 2024)` — menjadi elemen yang bisa
 * di-hover/fokus. Entri lengkap diambil dari daftar pustaka di content.js.
 */
export function tautkanSitasi(teks, pustaka, petunjuk) {
  const frag = document.createDocumentFragment();
  const pola = /\(([^()]*?\d{4}[^()]*?)\)/g;
  let akhir = 0;
  let m;

  while ((m = pola.exec(teks)) !== null) {
    if (m.index > akhir) frag.append(document.createTextNode(teks.slice(akhir, m.index)));
    frag.append(buatSitasi(m[0], cariPustaka(m[1], pustaka), petunjuk));
    akhir = m.index + m[0].length;
  }
  if (akhir < teks.length) frag.append(document.createTextNode(teks.slice(akhir)));
  return frag;
}

/**
 * Id stabil untuk satu entri pustaka: nama keluarga penulis pertama + tahun.
 * Diturunkan, bukan disimpan, supaya daftar pustaka tetap apa adanya seperti di esai.
 */
export function idPustaka(p) {
  const nama = p.penulis
    .split(/\s*(?:,|&|dkk\.)/)[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${nama}-${(p.tahun.match(/\d{4}/) || [''])[0]}`;
}

export const cariPustakaId = (id, pustaka) => pustaka.find((p) => idPustaka(p) === id) || null;

/** Elemen sitasi yang bisa di-hover dan difokus keyboard. */
export function buatSitasi(teks, entri, petunjuk) {
  if (!entri) return document.createTextNode(teks);
  return el('button', {
    class: 'sitasi',
    type: 'button',
    title: entriLengkap(entri),
    'aria-label': `${petunjuk}: ${entriLengkap(entri)}`,
    'data-kursor': 'buka',
    text: teks,
    onclick: () => { location.hash = '#s10-referensi'; },
  });
}

function cariPustaka(kunci, pustaka) {
  const nama = kunci.split(/\s*(?:dkk\.|&|,)/)[0].trim().toLowerCase();
  const tahun = (kunci.match(/\d{4}/) || [])[0];
  if (!nama || !tahun) return null;
  return pustaka.find((p) => p.penulis.toLowerCase().startsWith(nama) && p.tahun.startsWith(tahun)) || null;
}

export function entriLengkap(p) {
  // Sebagian ruas di daftar pustaka sudah berakhir dengan titik (mis. inisial
  // penulis "Manawan, M."); titiknya dilepas dulu agar tidak jadi titik ganda.
  return [p.penulis, `(${p.tahun})`, p.judul, p.sumber, p.url]
    .filter(Boolean)
    .map((s) => String(s).replace(/\.\s*$/, ''))
    .join('. ');
}

/** Paragraf dengan sitasi yang sudah tertaut. */
export function paragraf(teks, pustaka, petunjuk, kelas = null) {
  const p = el('p', { class: kelas });
  p.append(tautkanSitasi(teks, pustaka, petunjuk));
  return p;
}
