# Status terhadap Lampiran B

Daftar periksa penerimaan ada di `spec/PROMPT_Website_SI-RETAM.md` Lampiran B. Berkas ini
mencatat posisi terkini terhadap daftar itu, diperbarui di akhir tiap sesi.

**Posisi:** setelah sesi S1 dan dua perbaikan lanjutannya.
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
| Preloader kalibrasi detektor tampil dan keluar mulus (< 2,2 detik) | Diukur dengan `performance.measure('preloader')` di peramban, empat kali muat berturut-turut: **1027, 1027, 1028, 1030 ms**. Hero tampil ~1,11 detik sejak navigasi. Aturan §S0 "kalau aset sudah siap lebih cepat, percepat" kini diterapkan: kemajuan hanya merayap sampai font terpasang dan `load` selesai, lalu diselesaikan cepat. |

## Butir yang baru terpenuhi sebagian

| Butir Lampiran B | Yang sudah | Yang belum |
|---|---|---|
| Berfungsi di 360px; `prefers-reduced-motion` dihormati; fallback non-WebGL tersedia | Terverifikasi untuk S1: tanpa overflow horizontal di 360px, hero tepat 1,00× viewport di 360×800 dan 1440×900. Reduced-motion: lenis, kursor retikel, parallax, dan derau count-up mati; count-up langsung mengunci. Fallback WebGL: siluet SVG statis + bilah pesan yang tidak menimpa teks. | Hanya bisa diuji sejauh S1 ada. S2–S10 belum bisa dinilai. |
| Daftar pustaka lengkap, tertaut, dapat dicari | 18 entri lengkap dengan DOI/URL di `s10.pustaka`. Mesin tooltip sitasi kini **aktif dan terverifikasi**: tiga sumber statistik di S1 dirender sebagai elemen `.sitasi`, tooltip muncul pada hover tetikus sungguhan maupun fokus keyboard, dan entri lengkap tampil benar. | S10 sendiri belum dirender, jadi belum ada daftar yang tampil dan belum ada pencarian. Klik sitasi melompat ke `#s10-referensi` yang masih kosong. |

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

## Cacat yang sudah ditutup

**1. Waktu preloader melampaui 2,2 detik — selesai.**
Sebelumnya 2.200 ms kalibrasi ditambah 1.000 ms animasi keluar = 3.200 ms, dan aturan §S0
*"kalau aset sudah siap lebih cepat, percepat"* tidak diterapkan sama sekali.

Sekarang kemajuan hanya merayap sampai batas 82% selama aset belum siap, lalu diselesaikan
cepat begitu font terpasang dan `load` selesai. Ada ambang bawah 600 ms agar tidak sekadar
berkedip, dan batas keras: paling lambat mulai keluar pada 1.720 ms sehingga kasus terburuk
tetap ~2.140 ms. Animasi keluar dipendekkan ke 420 ms (`--durasi-transisi`).

Terukur di peramban lewat `performance.measure('preloader')`, empat kali muat:
**1027, 1027, 1028, 1030 ms**. Batas keras kasus terburuk belum diukur langsung — itu
disimpulkan dari konstanta, bukan dari pengamatan.

Sebagai catatan metode: pengukuran lama yang sempat menunjukkan ~7,2 detik ternyata salah.
Probe yang disuntikkan lewat otomasi selalu mulai beberapa detik setelah navigasi, sehingga
yang terukur adalah latensi probe itu sendiri. `performance.mark`/`measure` menyelesaikan ini
karena hasilnya mengendap di linimasa dan bisa dibaca kapan pun setelahnya.

**2. Mesin tooltip sitasi belum pernah aktif — selesai.**
Tiga sumber statistik S1 kini dirender sebagai elemen `.sitasi` melalui `buatSitasi()`.
Penautan memakai id yang diturunkan dari nama penulis pertama dan tahun (`idPustaka()`),
bukan pencocokan pola teks — cara ini juga menangkap entri Perka BAPETEN yang tidak
tertangkap oleh pola sitasi dalam kurung.

Terverifikasi di peramban: hover tetikus sungguhan memunculkan tooltip berisi entri lengkap
(`.sitasi:hover` mengonfirmasi sasarannya benar), fokus keyboard juga memunculkannya, dan
outline fokus `--gamma` 2px offset 3px tampil. Satu cacat ikutan ditemukan dan diperbaiki di
sini: `entriLengkap()` menghasilkan titik ganda pada penulis yang berakhir dengan inisial
(`"Manawan, M.. (2024)"`).

## Cacat terbuka

**3. Rel pipa belum punya sambungan bernomor 1–5.**
Saat ini hanya progres scroll dan navigasi sepuluh section. Penomoran komponen menunggu S5,
sesuai §3.4b.

**4. Klik sitasi melompat ke section kosong.**
`#s10-referensi` belum berisi apa pun sampai sesi S10.

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
