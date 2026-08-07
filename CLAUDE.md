# Proyek: Website Interaktif TIRAM

Microsite ilmiah-interaktif untuk esai kompetisi PCMC (Perhimpunan Ahli Pertambangan Indonesia Student Chapter), subtopik Ekstraksi Tambang Mineral. Isinya gagasan rekayasa: modul retrofit di hilir jig Kapal Isap Produksi untuk memulihkan monasit dari tailing timah lepas pantai Bangka.

Spesifikasi lengkap ada di `spec/PROMPT_Website_TIRAM.md`. Baca bagian yang relevan sebelum mengerjakan setiap sesi.

## Sumber kebenaran isi

Hanya tiga berkas ini, tidak ada yang lain:

- `spec/Draf_Esai_TIRAM_TANDAI.docx` — naskah esai
- `spec/Justifikasi_Prinsip_TIRAM.docx` — justifikasi pemilihan & prinsip kerja komponen
- `spec/TIRAM_3D.html` — geometri 3D yang sudah ada, untuk di-port

Angka yang mengikat direkap di Lampiran A pada berkas spesifikasi.

## Aturan isi — jangan dilanggar

1. **Nol halusinasi.** Jangan menambah statistik, nama peneliti, atau nomor regulasi yang tidak ada di ketiga sumber. Jangan membulatkan angka.
2. **Jangan mengklaim penemuan alat baru.** Kebaruannya ada pada susunan (pemisahan magnetik terpandu sensor gamma, inline di atas KIP, di hilir jig). WHIMS, spektrometri gamma, dan katup pinch sudah lama dipakai industri pasir mineral.
3. **Jangan menulis bahwa sistem ini "membersihkan laut dari radioaktivitas".** Rumusan yang benar: memberi verifikasi pada setiap pelepasan, dan memusatkan fraksi pekat yang justru benar-benar bersifat radiologis. Sebutkan juga bahwa tidak ada bukti publik bahwa pembuangan tailing KIP selama ini menimbulkan persoalan radiologis.
4. **Status rancangan konseptual.** Semua kinerja adalah potensi, bukan jaminan. Recovery 94,8% (Dieye dkk., 2021) berasal dari pasir mineral Senegal, bukan dari KIP.
5. **Enam keterbatasan wajib tampil dengan bobot visual penuh.** Tidak boleh dikecilkan atau dipindah ke footer.
6. **Bahasa Indonesia sepenuhnya.** Istilah Inggris hanya bila tidak ada padanan lazim (WHIMS, PLC, TENORM, MCA, NaI(Tl)), dan dijelaskan pada kemunculan pertama.
7. **Jangan menyisipkan foto, logo, atau aset pihak ketiga.** Semua visual dibuat prosedural (three.js, canvas, SVG). Slot `#slot-foto-kip` disediakan kosong.

Kalau sebuah bagian visual butuh isi yang tidak ada di sumber: jangan dikarang. Tulis `TODO: butuh konfirmasi penulis` dan lanjutkan.

## Arsitektur

Situs statis, tanpa build step, harus bisa dibuka dari `file://` maupun di-drag ke Netlify.

```
index.html
css/main.css
js/main.js          orkestrasi scroll, nav, state
js/scene.js         renderer three.js tunggal, manajemen scene
js/models/*.js      geometri 5 komponen + rakitan
js/widgets/*.js     simulasi canvas 2D per komponen
js/cinema.js        sekuens sinematik 8 bab
data/content.js     SELURUH teks & angka
```

Aturan yang mengikat:

- **Seluruh teks dan angka hidup di `data/content.js`.** Tidak ada string isi yang di-hardcode di HTML atau JS lain. Ini supaya penulis bisa mengoreksi naskah tanpa menyentuh kode.
- **Satu instance `WebGLRenderer` untuk seluruh halaman**, di-mount ulang ke section aktif. Bukan lima canvas hidup bersamaan.
- Scene 3D di-init malas lewat `IntersectionObserver`; render loop berhenti saat section keluar viewport.
- `three` r160+ via importmap CDN, `OrbitControls` dari `three/addons/`. Jangan pakai r128 — versi itu tidak punya OrbitControls (itu sebabnya `spec/TIRAM_3D.html` menulis kontrol orbitnya manual).
- `gsap` + `ScrollTrigger` untuk semua animasi berbasis scroll. `lenis` untuk smooth scroll.
- Tanpa React, tanpa Tailwind. CSS ditulis tangan dengan custom properties.

## Token desain

Warna: `--abisal #071016`, `--lambung #0F1D26`, `--garis #1E3340`, `--baja #C9D6DD`, `--kabut #7C93A1`, `--gamma #E9B93A`, `--magnet #3FB8C4`, `--monasit #8C4A2F`, `--sedimen #9A8F7E`.

Kuning `--gamma` dipakai hemat: hanya penanda gamma, angka aktif, dan status keputusan PLC. Bukan warna tombol umum.

Font: **Archivo** (display, lebar ekspan 112–125%), **IBM Plex Sans** (isi), **IBM Plex Mono** (angka instrumen dan satuan). Setiap angka yang merupakan bacaan alat diset dengan Plex Mono.

Latar gelap sepanjang situs, kecuali section "Kelayakan & Keterbatasan" yang beralih ke `#E8E6E1` dengan tinta `#0F1D26`.

Easing standar `cubic-bezier(0.16, 1, 0.3, 1)`. Satu momen terorkestrasi per section, bukan efek tersebar.

## Mutu dasar yang tidak boleh ditawar

- Responsif sampai 360px.
- `prefers-reduced-motion: reduce` dihormati: parallax, auto-rotate, partikel, dan smooth scroll mati; section sinema jadi kartu langkah statis.
- Fallback bila WebGL gagal: setiap scene 3D punya padanan gambar/SVG statis dan pesan singkat yang jelas. Jangan layar kosong.
- Fokus keyboard terlihat: garis `--gamma` 2px, offset 3px. Jangan hapus outline.
- Kontras teks minimal 4.5:1 di latar gelap maupun terang.
- Setiap visual punya padanan teks untuk pembaca layar.

## Cara verifikasi

Setelah setiap perubahan berarti, jalankan `python3 -m http.server 8000`, buka halamannya, ambil screenshot pada lebar 360px, 768px, dan 1440px, lalu periksa sendiri hasilnya sebelum melapor. Jangan menyatakan selesai berdasarkan pembacaan kode saja.

Sebelum menutup sebuah sesi, cocokkan hasil dengan butir-butir Lampiran B (daftar periksa penerimaan) pada berkas spesifikasi yang relevan dengan sesi itu. Laporkan butir yang belum terpenuhi secara eksplisit alih-alih mendiamkannya.

## Nada laporan

Jujur soal apa yang belum jadi. Kalau sebuah widget baru setengah bekerja, katakan begitu. Jangan menyatakan butir daftar periksa terpenuhi kalau belum diverifikasi di browser.
