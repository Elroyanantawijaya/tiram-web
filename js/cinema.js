// js/cinema.js — logika sekuens sinema S7: parsing waktu bab dan evaluasi bab
// aktif pada suatu waktu. Sengaja tidak menyentuh DOM atau three.js sama sekali,
// supaya bisa diuji dan dibaca terpisah dari kerumitan render.

/** "0:07" → 7 (detik). */
export function uraiWaktu(str) {
  const [m, s] = str.split(':').map(Number);
  return m * 60 + s;
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * @param {{waktu:string}[]} bab
 * @param {number} ekorDetik jeda setelah bab terakhir dimulai sampai sekuens usai
 */
export function buatGarisWaktu(bab, ekorDetik = 6) {
  const waktu = bab.map((b) => uraiWaktu(b.waktu));
  const durasi = waktu[waktu.length - 1] + ekorDetik;
  return { waktu, durasi };
}

/**
 * Bab aktif dan progres di dalamnya untuk suatu waktu t. Murni fungsi dari t —
 * tidak ada keadaan yang diakumulasi — supaya menggeser garis waktu ke waktu
 * mana pun selalu menghasilkan keadaan yang sama persis, baik dari memutar maju
 * maupun dari lompat langsung.
 */
export function babPadaWaktu(t, waktu, durasi) {
  let i = waktu.length - 1;
  for (let k = 0; k < waktu.length; k++) {
    const akhirBab = waktu[k + 1] ?? durasi;
    if (t < akhirBab) { i = k; break; }
  }
  const awal = waktu[i];
  const akhir = waktu[i + 1] ?? durasi;
  const progres = akhir > awal ? Math.min(1, Math.max(0, (t - awal) / (akhir - awal))) : 1;
  return { indeks: i, progres, progresHalus: easeInOutCubic(progres) };
}
