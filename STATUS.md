# Status terhadap Lampiran B

Daftar periksa penerimaan ada di `spec/PROMPT_Website_SI-RETAM.md` Lampiran B. Berkas ini
mencatat posisi terkini terhadap daftar itu, diperbarui di akhir tiap sesi.

**Posisi:** setelah sesi S1 (commit `ee42a06`).
**Cakupan yang sudah dikerjakan:** S0 preloader, S1 hero, infrastruktur bersama.
**Belum disentuh:** S2–S10.

Lampiran B adalah daftar penerimaan untuk **situs jadi**, bukan per sesi. Karena itu
mayoritas butir di bawah wajar berstatus belum — bukan karena terlewat, melainkan karena
memang belum gilirannya.

---

## Butir yang sudah terpenuhi

| Butir Lampiran B | Bukti |
|---|---|
| Hero menampilkan judul lengkap esai dengan latar KIP prosedural yang beranimasi | Judul dan subjudul lengkap dirender dari `s1.subjudul`. Latar three.js: siluet KIP dari primitif, laut shader, langit senja, kabut. Cakrawala konsisten 37% dari atas di 360/768/1440, siluet selalu utuh dalam bingkai. |
| Tidak ada klaim "membersihkan laut dari radioaktivitas" | Rumusan yang benar tersimpan di `s8.pernyataanKalibrasi` (verifikasi + pemusatan fraksi pekat, dan tidak ada bukti publik soal persoalan radiologis). Belum dirender, tetapi juga tidak ada klaim terlarang di mana pun. |
| Tidak ada foto/logo pihak ketiga | Seluruh visual prosedural (three.js, canvas, SVG). `#slot-foto-kip` ada dan sengaja kosong. |
| Tidak ada angka di luar Lampiran A atau berkas esai | Seluruh angka bersumber dari `data/content.js`, yang disalin dari ketiga berkas sumber. Dua lubang data ditandai `TODO` alih-alih dikarang — lihat bagian bawah. |

## Butir yang baru terpenuhi sebagian

| Butir Lampiran B | Yang sudah | Yang belum |
|---|---|---|
| Berfungsi di 360px; `prefers-reduced-motion` dihormati; fallback non-WebGL tersedia | Terverifikasi untuk S1: tanpa overflow horizontal di 360px, hero tepat 1,00× viewport di 360×800 dan 1440×900. Reduced-motion: lenis, kursor retikel, parallax, dan derau count-up mati; count-up langsung mengunci. Fallback WebGL: siluet SVG statis + bilah pesan yang tidak menimpa teks. | Hanya bisa diuji sejauh S1 ada. S2–S10 belum bisa dinilai. |
| Preloader kalibrasi detektor tampil dan keluar mulus (< 2,2 detik) | Tampil dan keluar mulus: pencacah dengan derau Poisson, spektrum dua puncak terbentuk kiri→kanan, garis progres, keluar seperti permukaan air tersibak. | **Waktunya belum memenuhi.** Lihat cacat terbuka di bawah. |
| Daftar pustaka lengkap, tertaut, dapat dicari | 18 entri lengkap dengan DOI/URL di `s10.pustaka`. Mesin tooltip sitasi sudah ditulis (`tautkanSitasi`, `paragraf`, `siapkanTooltipSitasi`). | S10 belum dirender, jadi tidak ada yang tampil dan belum ada pencarian. Mesin tooltip itu **belum pernah terpakai sekali pun saat berjalan** — lihat cacat terbuka. |

## Butir yang belum dikerjakan — di luar cakupan sesi ini

Naskah dan angkanya sudah lengkap di `data/content.js`; yang belum ada adalah tampilannya.

| Butir Lampiran B | Naskah siap di |
|---|---|
| Enam sub-bagian pendahuluan (S2a–S2f) lengkap dan terhubung ke visual sticky | `s2.a` – `s2.f` |
| Simulator "Empat Sifat" berfungsi untuk keempat mode dengan verdict yang benar | `s3.simulator` (termasuk data mineral terstruktur) |
| Argumen "mengapa bukan sekadar menyetel ulang jig" lengkap dengan angka Rosita (2017) | `s3.b` |
| Diagram batas sistem (hulu / SI-RETAM / hilir) jelas | `s4.diagramBatas` |
| Pernyataan batas kebaruan muncul dan tidak dilunakkan | `s4.batasKebaruan` |
| Kelima komponen punya model 3D yang dapat diputar, di-zoom, diurai, dan dipotong | — (geometri diport dari `spec/SI-RETAM_3D.html`) |
| Kelima komponen punya blok `APA · BAGAIMANA · ILMU` dan satu widget simulasi | `s5.komponen[].apa/bagaimana/ilmu/widget` |
| Widget WHIMS menunjukkan jatuhnya efisiensi pada butir halus | `s5.komponen[1].widget` |
| Widget katup menunjukkan konsekuensi tunda PLC yang salah | `s5.komponen[3].widget` |
| Rakitan 3D dengan referensi skala, penanda bernomor, sorot jalur, mode X-ray | `s6` |
| Sekuens sinema 8 bab dengan kontrol putar/jeda/scrub/kecepatan dan takarir | `s7.bab` |
| Neraca 280 m³/jam vs ~7.000 ton/jam dengan skala yang jujur | `s8.neraca` |
| Enam keterbatasan tampil dengan bobot visual penuh | `s8.enamKeterbatasan` |

---

## Cacat terbuka yang ditemukan saat audit

**1. Waktu preloader melampaui 2,2 detik.**
Rancangannya 2.200 ms kalibrasi **ditambah** 1.000 ms animasi keluar = 3.200 ms sebelum hero
tampil. Butir Lampiran B menyebut `< 2,2 detik`, jadi bila animasi keluar ikut dihitung,
butir ini tidak terpenuhi. Selain itu §S0 meminta *"kalau aset sudah siap lebih cepat,
percepat"* — ini **belum diterapkan sama sekali**: kalibrasi selalu berjalan penuh 2.200 ms
tanpa memandang kesiapan aset.

Pengukuran ujung-ke-ujung di lingkungan otomasi tidak dapat dipercaya: satu probe mendapati
preloader masih ada pada ~7,2 detik, sementara pengamatan lewat screenshot konsisten dengan
~3,2 detik. `requestAnimationFrame` terukur normal (145 fps), jadi throttling bukan
penyebabnya, dan probe saya selalu mulai terlambat. **Angka sebenarnya perlu diukur di
peramban biasa.**

**2. Mesin tooltip sitasi belum pernah aktif.**
`tautkanSitasi`, `paragraf`, `siapkanTooltipSitasi`, serta gaya `.sitasi` dan
`.tooltip-sitasi` sudah ditulis, tetapi jumlah elemen `.sitasi` di halaman terukur **nol**:
S1 merender sumber statistik sebagai teks biasa, dan belum ada paragraf yang melewati
`paragraf()`. Jadi kode itu belum teruji saat berjalan. Ia baru benar-benar terpakai di S2.

**3. Rel pipa belum punya sambungan bernomor 1–5.**
Saat ini hanya progres scroll dan navigasi sepuluh section. Penomoran komponen menunggu S5,
sesuai §3.4b.

---

## Lubang isi yang menunggu konfirmasi penulis

Ditandai `TODO: butuh konfirmasi penulis` di `data/content.js`, tidak diisi angka karangan:

1. **Densitas kasiterit** — tidak disebut di ketiga sumber. Di mode Densitas simulator nanti
   ia ditampilkan tanpa angka. Kuarsa ditempatkan di lapisan ringan mengikuti keterangan
   "kuarsa ringan" pada dokumen justifikasi.
2. **Konduktivitas kuarsa** — tidak disebut di ketiga sumber; pada mode Konduktivitas ia
   dibiarkan netral, tidak dibelokkan ke sisi mana pun.
3. **Densitas, kerentanan magnetik, dan konduktivitas xenotim** — tidak disebut; kartu
   xenotim di S2b hanya memuat sifat radioaktif dan proporsi 1–2% yang memang bersumber.
4. **Jumlah entri daftar pustaka** — Lampiran A.7 menyebut 17 entri, naskah esai memuat 18
   (Perka BAPETEN 9/2009 dan 16/2012 masing-masing entri tersendiri). Ditampilkan seluruhnya
   sesuai sumber, tidak dipangkas agar cocok dengan angka 17.
