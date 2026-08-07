# Status terhadap Lampiran B

Daftar periksa penerimaan ada di `spec/PROMPT_Website_SI-RETAM.md` Lampiran B. Berkas ini
mencatat posisi terkini terhadap daftar itu, diperbarui di akhir tiap sesi.

**Posisi:** setelah sesi port model 3D S5.
**Cakupan yang sudah dikerjakan:** S0 preloader, S1 hero, S2 pendahuluan (a–f), S5 model
komponen (tampil + dapat diputar), infrastruktur bersama.
**Belum disentuh:** S3, S4, S6–S10.

> **Catatan urutan.** S3 (simulator "Empat Sifat") dan S4 dilompati atas permintaan penulis
> demi mengerjakan port geometri 3D lebih dulu. Keduanya masih kosong. S3 khususnya penting
> karena ia adalah inti argumen esai yang dibuat bisa dimainkan.

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
| Enam sub-bagian pendahuluan (S2a–S2f) lengkap dan terhubung ke visual sticky | Diverifikasi lewat scroll terprogram melalui keempat sub-bagian a–d: panel sticky berganti tepat mengikuti posisi baca (`panel--a` aktif saat di S2a, dst., tanpa satu pun yang salah). S2e (linimasa lima regulasi) dan S2f (kalimat celah) tampil dengan naskah lengkap dari `content.js`. |

## Butir yang baru terpenuhi sebagian

| Butir Lampiran B | Yang sudah | Yang belum |
|---|---|---|
| Berfungsi di 360px; `prefers-reduced-motion` dihormati; fallback non-WebGL tersedia | S1 **dan** S2 kini terverifikasi tanpa overflow horizontal di 360px dan 1440px. Di S2, panel sticky pindah ke atas kolom teks di layar sempit (bukan menumpuk di akhir) dan pin linimasa dilepas jadi daftar vertikal. Guard `kurangiGerak()` ada di titik yang benar dalam kode (loop gambar panel, pembuatan pin ScrollTrigger) dengan pola yang sama seperti S1 yang sudah terverifikasi jalan. | **Tidak bisa diverifikasi langsung**: lingkungan otomasi ini tidak punya cara mengemulasi `prefers-reduced-motion` di level OS, jadi perilaku reduced-motion S2 dijamin lewat pembacaan kode, bukan pengamatan runtime langsung — beda dengan S1 yang sempat diverifikasi dengan override `matchMedia`. S3–S10 belum bisa dinilai sama sekali. |
| Kelima komponen punya model 3D yang dapat diputar, di-zoom, diurai, dan dipotong | Kelima geometri diport ke `js/models/komponen.js` dan **terbukti identik** dengan sumber: jumlah mesh dan kotak batas sama persis sampai 4 desimal, dibandingkan terhadap kode asli yang diambil langsung dari `spec/SI-RETAM_3D.html`, bukan diketik ulang. Model tampil, dapat **diputar** (diuji lewat seret pointer sungguhan: kamera berpindah dari `-6.260,5.816,-2.653` ke `0.089,8.577,3.914`) dan **di-zoom** lewat OrbitControls. | **Tampilan urai dan potongan melintang belum ada** — dua dari empat kemampuan yang diminta butir ini. Anotasi label juga belum dirender (teks dan titik jangkarnya sudah tersimpan di `s5.komponen[].anotasi`, menunggu lapisan anotasi HTML + leader line SVG). |
| Kelima komponen punya blok `APA · BAGAIMANA · ILMU` dan satu widget simulasi | Ketiga blok tetap terpasang untuk kelima komponen plus hidrosiklon opsional — 18 blok, teksnya disalin utuh dari dokumen justifikasi lewat `content.js`. | **Widget simulasi belum ada satu pun.** Kelimanya menunggu sesi tersendiri. |
| Daftar pustaka lengkap, tertaut, dapat dicari | 18 entri lengkap dengan DOI/URL di `s10.pustaka`. Mesin tooltip sitasi makin teruji: kini menangani sitasi ganda dalam satu kurung (dipecah per titik koma, tiap sub-sitasi resolve sendiri) dan dibangun ulang sebagai `<span role="button">` karena Chrome memaksa `<button>` jadi `inline-block` sehingga sitasi tak bisa pecah antar baris. 12 elemen `.sitasi` di S1+S2, semuanya resolve ke entri benar. | S10 sendiri belum dirender, jadi belum ada daftar yang tampil dan belum ada pencarian. Klik sitasi melompat ke `#s10-referensi` yang masih kosong. |

## Butir yang belum dikerjakan — di luar cakupan sesi ini

Naskah dan angkanya sudah lengkap di `data/content.js`; yang belum ada adalah tampilannya.

| Butir Lampiran B | Naskah siap di |
|---|---|
| Simulator "Empat Sifat" berfungsi untuk keempat mode dengan verdict yang benar | `s3.simulator` (termasuk data mineral terstruktur) |
| Argumen "mengapa bukan sekadar menyetel ulang jig" lengkap dengan angka Rosita (2017) | `s3.b` |
| Diagram batas sistem (hulu / SI-RETAM / hilir) jelas | `s4.diagramBatas` |
| Pernyataan batas kebaruan muncul dan tidak dilunakkan | `s4.batasKebaruan` |
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

**3. (Sesi S2) Kartu mineral awalnya `<button>` bersarang dengan sitasi — selesai.**
Kartu mineral S2b semula `<button>`, padahal sitasi di dalam catatannya juga tombol.
Tombol bersarang tidak sah dalam HTML dan merusak interaksi. Diganti `<article tabindex="0">`
dengan `pointerenter`/`focusin` sebagai pemicu sorot, bukan semantik tombol.

**4. (Sesi S2) Sitasi ganda dalam satu kurung hilang diam-diam — selesai.**
`(Zglinicki dkk., 2021; Widana dkk., 2024)` hanya menghasilkan satu elemen `.sitasi` yang
resolve ke penulis pertama; sitasi kedua lenyap dan tooltip menunjuk sumber yang salah.
Untuk situs yang mengklaim kedisiplinan ilmiah ini bukan hal sepele. `tautkanSitasi()`
sekarang memecah isi kurung pada `;` sehingga tiap sub-sitasi jadi elemen sendiri.

**5. (Sesi S2) Sitasi `<button>` memutus alir baris — selesai.**
Chrome memaksa `<button>` menjadi `display: inline-block` terlepas dari CSS, sehingga sitasi
jadi kotak atomik yang tidak bisa pecah antar baris — kurung pembuka tertinggal sendirian di
ujung baris sebelumnya. Diganti `<span role="button" tabindex="0">` dengan penanganan
`Enter`/`Space` manual, yang mengikuti aliran teks seperti elemen inline lain.

**6. (Sesi S2) Pin linimasa S2e tidak dievaluasi ulang saat ukuran layar berubah — selesai.**
Keputusan pin-atau-tidak (§ambang 900px) hanya diambil sekali saat halaman dimuat. Jendela
yang di-resize lintas ambang itu terkunci pada keputusan lama. Ditambahkan listener
`matchMedia('(min-width: 900px)').addEventListener('change', ...)` yang membangun ulang
pemicu ScrollTrigger.

**7. (Sesi S2) Diagram SVG panel S2a terhimpit sampai tinggi nol di panel pendek — selesai.**
Daftar lima langkah proses menghabiskan seluruh tinggi panel sticky sebelum diagram sempat
kebagian ruang. SVG kini punya `min-height`, dan di layar sempit daftar hanya menampilkan
langkah yang sedang berjalan alih-alih kelimanya sekaligus.

**11. (Sesi S5) Pemicu ScrollTrigger S5 meleset setelah jendela melewati ambang 900px — selesai.**
Pin linimasa S2e menyisipkan spacer setinggi ~1.428px yang menggeser seluruh isi di bawahnya.
Karena pin itu baru dibuat saat ambang lebar terlampaui — jadi *setelah* pemicu S5 dibuat —
pemicu S5 menghitung posisinya lebih dulu, sebelum spacer ada, dan meleset **konstan ~1.131px**.
Akibatnya model yang tampil tidak cocok dengan komponen yang sedang dibaca.
`ScrollTrigger.refresh()` maupun `refresh(true)` tidak menyelesaikannya karena urutan refresh
yang salah, bukan nilai yang basi. Diperbaiki dengan `refreshPriority: 1` pada pemicu pin agar
ia selalu dihitung lebih dulu. Terverifikasi: pergeseran kelima pemicu turun dari ~1.131px
menjadi tepat 0 pada skenario muat-di-360px-lalu-diperbesar-ke-1440px.

## Cacat terbuka

**8. Rel pipa belum punya sambungan bernomor 1–5.**
Saat ini hanya progres scroll dan navigasi sepuluh section. Penomoran komponen menunggu S5,
sesuai §3.4b.

**9. Klik sitasi melompat ke section kosong.**
`#s10-referensi` belum berisi apa pun sampai sesi S10.

**10. Reduced-motion S2 belum diverifikasi lewat pengamatan runtime.**
Guard `kurangiGerak()` ada di kode (loop gambar panel, pembuatan pin ScrollTrigger), tapi
lingkungan otomasi sesi ini tidak punya cara mengemulasi `prefers-reduced-motion` di level
OS untuk mengonfirmasinya secara langsung — beda dari S1 yang sempat diverifikasi dengan
override `matchMedia`. Perlu dicek manual di peramban biasa (DevTools → Rendering →
Emulate CSS media feature).

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
