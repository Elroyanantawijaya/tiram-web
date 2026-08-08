# Status terhadap Lampiran B

Daftar periksa penerimaan ada di `spec/PROMPT_Website_TIRAM.md` Lampiran B. Berkas ini
mencatat posisi terkini terhadap daftar itu, diperbarui di akhir tiap sesi.

**Posisi:** setelah sesi S9+S10 (peta jalan, daftar pustaka & kredit) + verifikasi menyeluruh.
**Cakupan yang sudah dikerjakan:** S0–S10 seluruhnya punya tampilan sekarang. S0 preloader, S1
hero, S2 pendahuluan (a–f), S3 argumen + simulator empat mode, S4 gagasan, S5 model komponen
(tampil + dapat diputar, widget komponen 1 dari 5), S6 rakitan di atas dek KIP, S7 sekuens
sinema 8 bab, S8 kelayakan, S9 peta jalan enam langkah, S10 daftar pustaka (18 entri, dapat
dicari) & kredit, infrastruktur bersama.
**Belum disentuh:** tidak ada section yang kosong lagi. Yang tersisa adalah kedalaman di dalam
section yang sudah ada (lihat "belum dikerjakan" di bawah), bukan section baru.

> **Catatan sesi ini.** S9 dan S10 dibangun, lalu ditemukan dan diperbaiki **bug lintas situs
> yang cukup serius**: `scrollIntoView({behavior:'smooth'})` — dipakai baik oleh tombol nav rel
> pipa maupun (rencana semula) lompatan sitasi — dilawan setiap frame oleh loop `raf` Lenis dan
> gagal total, `scrollY` macet di titik awal. Diperbaiki dengan `gulirKe()` baru di `dom.js`
> yang memakai `lenis.scrollTo()`, plus `lenis.resize()` eksplisit setelah seluruh section
> selesai dibangun (Lenis sempat mengukur dirinya sendiri sebelum konten ada, jadi limit
> scroll-nya keliru). Ini menutup cacat #9 (klik sitasi ke section kosong) sekaligus
> memperbaiki nav rel pipa yang selama ini **belum pernah benar-benar diuji jalan** — lihat
> cacat #26. Ditemukan juga celah baru: fallback non-WebGL S5/S6/S7 cuma pesan teks, tanpa
> padanan gambar/SVG statis yang diwajibkan CLAUDE.md (S1 sudah punya) — lihat cacat #27.
> Di luar itu masih menunggu: empat widget komponen S5, tampilan urai & potongan melintang S5,
> dan cacat #8 (rel pipa belum punya sambungan bernomor 1–5).

Lampiran B adalah daftar penerimaan untuk **situs jadi**, bukan per sesi. Karena itu
mayoritas butir di bawah wajar berstatus belum — bukan karena terlewat, melainkan karena
memang belum gilirannya.

---

## Butir yang sudah terpenuhi

| Butir Lampiran B | Bukti |
|---|---|
| Hero menampilkan judul lengkap esai dengan latar KIP prosedural yang beranimasi | Judul dan subjudul lengkap dirender dari `s1.subjudul`. Latar three.js: siluet KIP dari primitif, laut shader, langit senja, kabut. Cakrawala konsisten 37% dari atas di 360/768/1440, siluet selalu utuh dalam bingkai. |
| Tidak ada klaim "membersihkan laut dari radioaktivitas" | `s8.pernyataanKalibrasi` kini **dirender** dalam kotak khusus di badan S8. Diperiksa lewat pemindaian `innerText` seluruh section: frasa "membersihkan laut dari radioaktivitas" memang muncul, tetapi hanya sebagai bagian dari kalimat penyangkalannya ("nilai radiologis TIRAM **bukanlah klaim** membersihkan laut dari radioaktivitas") — dikonfirmasi dengan mencocokkan frasa penyangkal utuh, bukan sekadar mencari kata kuncinya. Kalimat "tidak ada bukti publik" juga tampil. |
| Neraca 280 m³/jam vs ~7.000 ton/jam ditampilkan dengan skala yang jujur | Kedua batang berbagi satu jalur selebar sama dan lebarnya dihitung dari satu pembagi yang sama di kode, jadi skalanya benar menurut konstruksi. **Diukur, bukan disimpulkan dari kode:** rasio lebar terender = 0,02857, cocok persis dengan 200/7.000. Di 360px batang KIP 320px vs batang modul 9,14px; di 1440px 1.216px vs 34,74px. Tidak ada `min-width` yang menyelamatkan batang modul agar "terbaca" — ia memang setipis itu, dan `s8.neraca.catatanSkala` mengatakannya terus terang. Label peringatan "unit uji, bukan penanganan seluruh kapal" tampil dalam kotak sendiri, tidak diperhalus. Tidak ada persentase turunan yang dikarang: perbandingannya disampaikan lewat gambar, bukan lewat angka baru. |
| Enam keterbatasan tampil dengan bobot visual penuh | **Dibuktikan dengan pengukuran, bukan pernyataan.** Diukur di 360px: blok keterbatasan adalah subsection tertinggi di S8 (1.636px, vs neraca 823, manfaat 1.072, kalibrasi 1.027). Judulnya 36px sementara judul subsection lain 28px. Narasinya 17,04px — **sama persis dengan ukuran badan teks halaman**, dan lebih besar daripada narasi kartu manfaat yang 15px; jadi keterbatasan diset lebih besar daripada manfaat, bukan lebih kecil. Letaknya subsection ketiga dari empat di badan section, bukan footer. Keenam judulnya cocok persis dengan Lampiran A.6. Nomor 01–06 memakai `--terang-gamma` pada 41,6px. |
| Tidak ada foto/logo pihak ketiga | Seluruh visual prosedural (three.js, canvas, SVG). `#slot-foto-kip` ada dan sengaja kosong. Diperiksa ulang sesi ini: nol elemen `<img>` di seluruh halaman, nol `background-image` non-gradient. |
| Tidak ada angka di luar Lampiran A atau berkas esai | Seluruh angka bersumber dari `data/content.js`, yang disalin dari ketiga berkas sumber. Dua lubang data ditandai `TODO` alih-alih dikarang — lihat bagian bawah. Angka baru sesi ini (`s8.neraca.skala.modulMin/Maks/kip`) murni untuk menghitung lebar batang, bukan angka baru yang ditampilkan — teksnya tetap memakai rentang "180–200" apa adanya. |
| Daftar pustaka lengkap, tertaut, dapat dicari | S10 kini **dirender**: 18 kartu gaya mono, tiap kartu bertaut `target="_blank" rel="noopener"` ke DOI/URL aslinya (kecuali dua entri Perka BAPETEN yang memang tidak semuanya punya URL di sumber). Kotak pencarian diuji dengan mengetik "widana" → tepat 1 dari 18 kartu tersisa; kata yang tak cocok → daftar kosong dengan pesan "Tidak ada entri yang cocok."; dikosongkan lagi → 18 kartu kembali. Klik sitasi di badan teks (diuji dari S1) melompat **tepat ke kartu yang benar** (`#pustaka-bisnis-com-2025`), menyorotnya 2,2 detik, dan memindahkan fokus keyboard ke sana — bukan cuma ke section. Ini menutup cacat #9. |
| Argumen "mengapa bukan sekadar menyetel ulang jig" tersaji lengkap dengan angka Rosita (2017) | Diperiksa lewat `innerText` S3: kalimat "…ditekan sampai kisaran 0 hingga 0,17 persen (Rosita, 2017)" tampil apa adanya. |
| Preloader kalibrasi detektor tampil dan keluar mulus (< 2,2 detik) | Diukur dengan `performance.measure('preloader')` di peramban, empat kali muat berturut-turut: **1027, 1027, 1028, 1030 ms**. Hero tampil ~1,11 detik sejak navigasi. Aturan §S0 "kalau aset sudah siap lebih cepat, percepat" kini diterapkan: kemajuan hanya merayap sampai font terpasang dan `load` selesai, lalu diselesaikan cepat. |
| Enam sub-bagian pendahuluan (S2a–S2f) lengkap dan terhubung ke visual sticky | Diverifikasi lewat scroll terprogram melalui keempat sub-bagian a–d: panel sticky berganti tepat mengikuti posisi baca (`panel--a` aktif saat di S2a, dst., tanpa satu pun yang salah). S2e (linimasa lima regulasi) dan S2f (kalimat celah) tampil dengan naskah lengkap dari `content.js`. |
| Rakitan 3D lengkap dengan referensi skala, penanda bernomor, sorot jalur aliran, dan mode X-ray | Kelima fitur wajib §S6 ada dan terverifikasi lewat interaksi sungguhan, bukan hanya lewat kode: kelima penanda memindahkan kamera dan memunculkan kartu ringkas yang benar; ketiga tombol sorot jalur menghasilkan opasitas pipa yang tepat (1 vs 0,12); X-ray mengubah 6 mesh selubung dari opasitas 1 ke 0,18 dan memulihkannya; kedua bidikan (dekat & "posisi di kapal") menjaga modul tetap dalam bingkai. Proporsi modul terhadap kapal diukur 20,0% (target ~19%), dan modul hasil port punya 65 mesh dengan kotak batas identik terhadap `bAssembly` asli. |
| Sekuens sinema 8 bab dengan kontrol putar/jeda/scrub/kecepatan dan takarir Indonesia | Diverifikasi menyeluruh: menggeser garis waktu ke enam titik berbeda memindahkan kamera dan mengganti takarir tepat pada batas bab; kecepatan 2× membuat waktu maju dua kali lebih cepat dari waktu nyata (terukur langsung); jeda benar-benar membekukan waktu; lompat bab langsung menuju waktu yang tepat. Efek visual per bab (medan WHIMS menyala/padam, selongsong katup terjepit, bunker menyala, gerbang gamma berkedip saat verifikasi) semuanya murni fungsi dari waktu — aman di-scrub ke titik mana pun tanpa kehilangan keadaan. Ringkasan tiga angka muncul tepat di bab penutup dan hilang saat digeser mundur. Rekam ke `.webm` menghasilkan berkas video valid (240 KB untuk ~2 detik rekaman, `video/webm`) yang berhenti dan bisa diunduh baik otomatis di akhir maupun dihentikan manual. Bukan berkas video statis — seluruhnya animasi di dalam scene sesuai §S7. |
| Diagram batas sistem (hulu / TIRAM / hilir) jelas | Tiga zona berdampingan: hulu dan hilir bergaris putus-putus beropasitas 0,7 ("di luar sistem"), zona TIRAM bergaris tegas `--gamma` beropasitas penuh — kontras visualnya langsung terbaca, bukan cuma lewat label teks. Sitasi (Bisnis.com, 2026) di teks zona hilir tertaut dan resolve. Diagram menumpuk vertikal di 360px (panah ikut berotasi 90°), sejajar horizontal di 1440px — keduanya diverifikasi tanpa overflow. |
| Pernyataan batas kebaruan muncul dan tidak dilunakkan | Kotak `s4.batasKebaruan` tampil penuh di badan section (bukan footer), memakai pola visual "catatan penting" yang sama dengan `.s3-sim__kesimpulan` — border kiri `--gamma`, bukan dikecilkan atau diberi warna redup. |
| Simulator "Empat Sifat" berfungsi untuk keempat mode dan menghasilkan verdict yang benar | **Diverifikasi bukan lewat kode, melainkan lewat piksel yang benar-benar dirender** — sebuah penyadap dipasang pada `ctx.arc()` khusus kanvas simulator untuk membaca posisi x/y dan warna fill setiap partikel pada frame final tiap mode. Hasilnya cocok persis dengan §S3: mode Magnetik — monasit & ilmenit di x≈0,13–0,14 (tertahan kiri), zirkon/kasiterit/kuarsa di x≈0,77–0,79 (lolos kanan); mode Konduktivitas — monasit & zirkon kiri (x≈0,19–0,21), ilmenit & kasiterit kanan (x≈0,75–0,79), **kuarsa persis di tengah x=0,50** (netral, tidak dibelokkan, sesuai `catatanKonduktivitas`); mode Radioaktivitas — monasit alpha≈0,99 (berpendar gamma), keempat mineral lain alpha≈0,14 (redup). Kesimpulan diuji tidak muncul sebelum 4 mode dicoba (urutan acak: magnetik→radioaktivitas→densitas→konduktivitas), muncul tepat di klik ke-4, dan tetap terlihat setelah mode diganti lagi. Tabel Lampiran A.3 menyala mengikuti mode aktif. Reduced-motion diuji lewat pembacaan piksel yang sama: posisi sudah final dalam 31 ms (bukan menunggu 900 ms), tepat 120 panggilan `arc()` per mode ganti (satu frame, tanpa loop animasi berjalan). |

## Butir yang baru terpenuhi sebagian

| Butir Lampiran B | Yang sudah | Yang belum |
|---|---|---|
| Berfungsi di 360px; `prefers-reduced-motion` dihormati; fallback non-WebGL tersedia | **360px/768px/1440px:** diperiksa di level **seluruh dokumen** (bukan per-section) sesi ini — `document.documentElement.scrollWidth === clientWidth` persis di ketiganya, nol elemen yang tepinya melewati viewport (linimasa S2e sengaja dikecualikan: horizontal-scroll itu disengaja dan tetap terkurung dalam pin-nya sendiri, terbukti dari scrollWidth dokumen yang tetap sama). **Reduced-motion:** S8, S9, S10 (baru) dan **S2 (celah lama, cacat #10)** kini diverifikasi runtime dengan teknik pulihkan-markup-mentah + timpa `matchMedia` + panggil ulang `rakitSX`. S2 secara khusus diuji dengan membandingkan dua `canvas.toDataURL()` panel berjarak 900ms — identik persis, jadi bukan cuma "diam sesaat" tapi benar-benar tidak beranimasi; linimasa S2e terbukti tidak ter-pin (`transform: matrix(1,0,0,1,0,0)`, `position: static`) saat gerak dikurangi. **Fallback non-WebGL:** mekanisme dispatch-nya sendiri diuji langsung (bukan cuma dibaca) dengan menyimulasikan `HTMLCanvasElement.getContext()` gagal pada instance `PengelolaScene` terisolasi — `bangun()` tidak pernah terpanggil, `fallback()` terpanggil tepat sekali dengan wadah yang benar, `dukungWebgl` terkunci `false`. **Tapi isi fallback-nya sendiri tidak lengkap** — lihat cacat #27: hanya S1 yang punya padanan SVG statis, S5/S6/S7 cuma pesan teks, padahal `CONTENT.ui.fallbackWebgl.narasi` sendiri menjanjikan "diganti gambar diam". | S4 belum diukur ulang khusus sesi ini (tapi tercakup dalam pemeriksaan overflow seluruh-dokumen di atas). Fallback non-WebGL S5/S6/S7 melanggar §CLAUDE.md secara harfiah (cacat #27, terbuka). |
| Kelima komponen punya model 3D yang dapat diputar, di-zoom, diurai, dan dipotong | Kelima geometri diport ke `js/models/komponen.js` dan **terbukti identik** dengan sumber: jumlah mesh dan kotak batas sama persis sampai 4 desimal, dibandingkan terhadap kode asli yang diambil langsung dari `spec/TIRAM_3D.html`, bukan diketik ulang. Model tampil, dapat **diputar** (diuji lewat seret pointer sungguhan: kamera berpindah dari `-6.260,5.816,-2.653` ke `0.089,8.577,3.914`) dan **di-zoom** lewat OrbitControls. Anotasi label sudah punya mekanisme umum yang terpakai nyata di S6 (`js/widgets/anotasi.js`, lihat baris rakitan di atas). | **Tampilan urai dan potongan melintang di S5 sendiri belum ada** — dua dari empat kemampuan yang diminta butir ini, spesifik untuk komponen satu-per-satu (bukan rakitan). Anotasi label komponen S5 (`s5.komponen[].anotasi`) belum disambungkan ke `js/widgets/anotasi.js` walau mekanismenya sudah ada dan terbukti jalan di S6. |
| Kelima komponen punya blok `APA · BAGAIMANA · ILMU` dan satu widget simulasi | Ketiga blok tetap terpasang untuk kelima komponen plus hidrosiklon opsional — 18 blok, teksnya disalin utuh dari dokumen justifikasi lewat `content.js`. **Satu dari lima widget selesai**: Pengkondisi umpan (komponen 1) — simulasi kapasitor hidraulik, terverifikasi tenang sampai ~60% slider lalu jebol tajam ke 476% riak pada 88%, persis pola yang diminta §S5. | **Empat widget belum ada**: WHIMS (2), sensor gamma (3), katup (4), bunker (5). Widget WHIMS dan katup masing-masing adalah butir Lampiran B tersendiri (lihat tabel di bawah). |

## Butir yang belum dikerjakan — di luar cakupan sesi ini

Naskah dan angkanya sudah lengkap di `data/content.js`; yang belum ada adalah tampilannya.

| Butir Lampiran B | Naskah siap di |
|---|---|
| Widget WHIMS menunjukkan jatuhnya efisiensi pada butir halus | `s5.komponen[1].widget` |
| Widget katup menunjukkan konsekuensi tunda PLC yang salah | `s5.komponen[3].widget` |

### Dua dari lima "detail meyakinkan" §S7 ditunda, bukan terlewat

Daftar §S7 menyebut lima detail yang membuat sinema meyakinkan. Tiga sudah ada: sistem
partikel GPU (bukan mesh per butir), gerak kamera dengan easing sinematik per bab, dan
takarir Indonesia yang sinkron + bisa disalin. Dua sengaja ditunda:

- **Depth of field ringan** — butuh `EffectComposer` + bokeh pass, penambahan kompleksitas
  yang lebih pas dikerjakan di sesi poles akhir bersama optimasi lain.
- **Bunyi opsional** — sudah diputuskan penulis di sesi perencanaan S6/S7: ditunda demi
  memastikan kedelapan bab dan takarirnya benar dulu.

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

**12. (Sesi S6, telat dicatat) Ketiga jalur pipa berbagi satu instance material — selesai.**
Meredupkan satu jalur aliran (mis. "jalur fraksi magnetik → bunker") ikut meredupkan dua
jalur lainnya, sebab ketiganya menunjuk objek `Material` yang sama. Sorot jalur tidak
berfungsi sama sekali sampai diperbaiki. Tiap jalur kini memakai salinan (`clone()`)
materialnya sendiri.

**13. (Sesi S6, telat dicatat) Lapisan anotasi tertimpa canvas — selesai.**
`scene.js` memasang ulang elemen `<canvas>` ke wadah setiap kali section diaktifkan, jadi
canvas selalu jadi saudara DOM yang lebih akhir dan menimpa lapisan penanda bernomor —
urutan DOM saja tidak cukup, ditambahkan `z-index` pada `.anotasi`.

**14. (Sesi S6, telat dicatat) Kendali yang ditumpangkan di atas scene menutupi model — selesai.**
Tombol sorot jalur, X-ray, dan bidikan yang semula berupa overlay di atas panggung 3D
membungkus jadi banyak baris di layar sempit dan menghabiskan hampir seluruh bingkai. Diganti
jadi blok biasa di bawah scene, pola yang sejak itu dipakai ulang di S7.

**15. (Berasal dari S6, ditemukan & diperbaiki sesi S7) Selubung WHIMS berbagi material dengan motor pengkondisi dan aktuator katup — selesai.**
Housing WHIMS ditandai `userData.selubung` untuk mode X-ray, tetapi memakai `b.dark`
langsung — material yang sama juga dipakai motor pengkondisi (k1) dan aktuator katup (k4),
yang **tidak** ditandai selubung. Akibatnya menyalakan X-ray di S6 diam-diam ikut membuat
motor dan aktuator transparan/wireframe juga, meski keduanya tidak seharusnya terpengaruh.
Verifikasi S6 sebelumnya hanya memeriksa opasitas mesh yang tertandai, tidak memeriksa
apakah mesh lain yang tidak tertandai ikut berubah — itu sebabnya lolos saat itu. Ditemukan
saat menandai selongsong katup untuk animasi sinema (yang butuh pola serupa) dan menyadari
`bx` belum diklon. Diperbaiki dengan `b.dark.clone()` khusus untuk `bx`, dan pola yang sama
diterapkan sejak awal pada selongsong katup baru (`b.rubber.clone()`, sebab `b.rubber` juga
dipakai pipa kecil sensor). Terverifikasi ulang: `bx.material !== motorK1.material` dan
`!== aktuatorK4.material`; menyalakan X-ray sekarang hanya mengubah opasitas `bx` dan dinding
bunker, motor dan aktuator tetap opasitas 1.

**16. (Sesi S3) Kuarsa ikut masuk kotak "tidak diketahui" bersama kasiterit di mode Densitas — selesai.**
Kuarsa dan kasiterit sama-sama punya `densitasNilai: null` di content.js (kuarsa karena
sumbernya hanya kualitatif — "kuarsa ringan" — bukan karena benar-benar tidak diketahui).
Kode mengecek `densitasNilai === null` LEBIH DULU sebelum mengecek `id === 'kuarsa'`, sehingga
kuarsa ikut jatuh ke cabang "tidak diketahui" yang seharusnya khusus kasiterit. **Ditemukan
lewat pembacaan piksel sungguhan**, bukan lewat membaca kode: rentang x kuarsa (0,77–0,93)
identik dengan kotak kasiterit, bukan pita ringan yang dituju. Diperbaiki dengan menukar
urutan pengecekan; diverifikasi ulang dengan teknik yang sama — kuarsa sekarang tersebar
penuh (x 0,11–0,92) di pita ringan, terpisah jelas dari kasiterit.

**17. (Sesi S3) Tabel Lampiran A.3 memaksa lebar 467px di viewport 360px, overflow horizontal — selesai.**
`table-layout` default (auto) menghitung lebar kolom dari konten terpanjang tanpa memedulikan
lebar container, dan kolom "Mineral lain" berisi teks panjang tanpa titik potong alami
("zirkon ~4,6; ilmenit ~4,7; rutil ~4,3 (berimpitan)"). `document.documentElement.scrollWidth`
terukur 503px padahal viewport diminta 360px. Diperbaiki dengan `table-layout: fixed` +
`overflow-wrap: break-word` pada sel. Efek ikutan: `white-space: nowrap` pada `tbody th`
(disalin dari asumsi lama bahwa nama sifat selalu muat satu baris) membuat teks seperti
"Kerentanan magnetik" meluber keluar sel yang kini sempit dan tumpang tindih visual dengan
baris lain — dihapus, dibiarkan wrap wajar.

**18. (Sesi S3) Tiga label baris angka S3b dan tiga header kolom tabel ter-hardcode di JS — selesai.**
`'monasit & kasiterit pada konsentrat'`, `'losses pada tailing'`,
`'pengotor pada konsentrat umpan peleburan'` (di `s3-argumen.js`) dan `'Sifat'`/`'Monasit'`/
`'Mineral lain'` (di `empat-sifat.js`) ditulis langsung sebagai literal, melanggar aturan
mengikat "seluruh teks isi hidup di `data/content.js`". Ditemukan lewat `grep` sistematis atas
kedua berkas baru sebelum sesi ditutup, bukan lolos tanpa diperiksa. Dipindah ke
`s3.b.angkaKunci.*Label` dan `s3.simulator.ui.tabelKolom`.

**21. (Sesi S8) Palet situs tidak bisa dipakai apa adanya di section berlatar terang — selesai.**
`--gamma`, `--kabut`, `--magnet`, dan `--sedimen` semuanya dirancang untuk latar gelap. Di atas
`--terang-latar` (#E8E6E1) kontrasnya jatuh jauh di bawah 4.5:1 — `--gamma` hanya ~1,6:1,
`--magnet` ~1,9:1, `--kabut` ~2,5:1. Sebelum sesi ini S8 masih kosong sehingga masalahnya belum
pernah muncul. Ditambahkan empat token padanan yang mempertahankan hue tetapi menurunkan
luminansi: `--terang-redup`, `--terang-gamma`, `--terang-magnet`, `--terang-sedimen`. Seluruh
20 gaya teks di S8 lalu diukur satu per satu terhadap latarnya: **kontras terendah 5,01:1**
(nomor keterbatasan dan eyebrow kalibrasi yang memakai `--terang-gamma`), tertinggi 13,76:1.
Kedua warna batang neraca juga diperiksa sebagai elemen non-teks: 4,65:1 dan 4,67:1.

**22. (Sesi S8) Outline fokus keyboard praktis tak terlihat di section terang — selesai.**
Aturan global `:focus-visible { outline: 2px solid var(--gamma) }` menghasilkan kuning di atas
krem, sekitar 1,6:1 — penanda fokusnya ada tetapi tidak terbaca. Ini melanggar butir mutu dasar
"fokus keyboard terlihat" sekaligus ambang kontras. Ditambahkan
`.section--terang :focus-visible { outline-color: var(--terang-gamma) }`; tebal 2px dan offset
3px tidak diubah. **Terverifikasi lewat fokus keyboard sungguhan**, bukan lewat kode: fokus
programatis saja tidak menyalakan `:focus-visible` di Chrome, jadi tombol Tab ditekan lebih dulu
supaya heuristik keyboard Chrome aktif, baru fokus dipindahkan. Setelah itu
`sitasi.matches(':focus-visible')` bernilai true dan `outlineColor` terbaca `rgb(122, 92, 0)`
dengan kontras 5,01:1. Tooltip sitasi di S8 juga resolve ke entri yang benar (Bisnis.com, 2026).

**23. (Sesi S8) Judul section, subsection, dan judul multi-baris saling menempel — selesai.**
Tiga cacat tata letak yang hanya kelihatan dari screenshot, bukan dari kode:
`.section__judul` cuma punya margin atas dan `.subsection__judul` cuma punya margin bawah,
sehingga h2 S8 menempel ke "Neraca laju alir"; keempat subsection cukup panjang untuk melampaui
`min-height: 40vh` sehingga tidak ada jarak alami di antaranya dan tiap judul berikutnya
menempel ke isi sebelumnya; dan `line-height: 1.05` global untuk h1–h4 membuat judul
keterbatasan yang pecah jadi 2–4 baris (butir 02, 04, 05, 06) terlihat berdesakan. Diperbaiki
dengan margin bawah pada `.s8__kepala`, aturan `.subsection + .subsection`, dan
`line-height: 1.2` khusus judul kartu manfaat & butir keterbatasan.

**24. (Sesi S8) Tiga kartu manfaat jatuh 2+1 di 768px — selesai.**
`repeat(auto-fit, minmax(min(100%, 17rem), 1fr))` hanya muat dua kolom pada 768px, sehingga
kartu "Lingkungan" berdiri sendirian di samping satu sel kosong. Diganti aturan eksplisit: satu
kolom bertumpuk di bawah 900px, tiga kolom penuh di atasnya — tidak ada keadaan di antaranya.

**26. (Sesi S9/S10) `scrollIntoView({behavior:'smooth'})` dilawan Lenis dan gagal total di
seluruh situs, bukan cuma di lompatan sitasi baru — selesai.**
Ditemukan saat menguji lompatan sitasi baru: `scrollY` macet di titik awal meski
`scrollIntoView` dipanggil dengan benar. Diselidiki sampai akar dua penyebab terpisah yang
kebetulan bertumpuk:

1. Loop `raf` Lenis (`gsap.ticker.add((t) => lenis.raf(t*1000))`) berjalan tiap frame terlepas
   dari input pengguna dan menimpa posisi scroll balik ke target internalnya sendiri —
   permintaan gulir native yang tidak lewat Lenis kalah setiap frame. **Diverifikasi lewat
   pengukuran, bukan dugaan:** `scrollY` tetap 0 sesudah `scrollIntoView` dengan `behavior:
   'smooth'`, tapi berhasil dan bertahan dengan `behavior: 'auto'` (instan) — perbedaan itu
   hanya masuk akal kalau ada loop lain yang secara aktif melawan animasi smooth-nya.
2. `siapkanScroll()` (yang membuat Lenis) dipanggil **sebelum** `rakitS1..rakitS10()` mengisi
   konten section, jadi dimensi tinggi yang di-cache Lenis jauh lebih pendek dari dokumen
   sesungguhnya (`limit` terukur 7.459px vs `scrollHeight` riil 28.690px saat itu) — `scrollTo`
   ke section jauh salah hitung.

Ini bukan cuma bug pada fitur baru — **tombol nav rel pipa yang sudah ada sejak sesi awal
ternyata juga tidak pernah benar-benar berpindah** kalau diuji dengan mengukur `scrollY`
sebelum/sesudah klik (bukan cuma membaca kode-nya), sebab keduanya memakai
`scrollIntoView({behavior:'smooth'})` yang sama. Kemungkinan besar lolos di sesi-sesi
sebelumnya karena verifikasi rel pipa hanya memeriksa elemen tombolnya ada dan bisa diklik,
tidak mengukur posisi scroll sesudahnya.

Diperbaiki dengan `gulirKe()` baru di `js/dom.js` yang memakai `lenis.scrollTo()` (didaftarkan
lewat `daftarkanLenis()` dari `main.js`) alih-alih `scrollIntoView` native, plus
`lenis.resize()` eksplisit di `main.js` setelah seluruh section selesai dibangun. Dipakai ulang
di tombol nav rel pipa dan lompatan sitasi S10. **Terverifikasi dengan mengukur `scrollY`
sungguhan sebelum/sesudah klik** (bukan cuma membaca kode): tombol nav "Solusi" berpindah dari
0 ke ~8.560–9.190px (posisi S4 yang benar), klik sitasi berpindah ke ~24.918–26.326px (posisi
S10) sekaligus menyorot dan memfokuskan kartu yang tepat.

**Catatan metode.** Butuh beberapa putaran salah sebelum menemukan akar masalah ini, sebab
gejalanya bertumpuk dengan **dua masalah lingkungan otomasi yang tidak berhubungan**:
`document.visibilityState` sempat diam-diam kembali ke `"hidden"` di antara pemanggilan tool
(rAF berhenti total selama itu, termasuk `lenis.raf`), dan `python -m http.server` bawaan
(tanpa header `Cache-Control`) membuat peramban menyajikan `dom.js` versi lama dari permintaan
sebelumnya meski berkasnya sudah diedit — bahkan setelah hard-reload dan tab baru, sampai
akhirnya pindah ke origin/port yang belum pernah dikunjungi. Diatasi dengan server pengganti
`.claude/no-cache-server.py` (mengirim `Cache-Control: no-store` pada tiap respons) yang kini
dipakai `.claude/launch.json`, dan dengan selalu memanggil `tabs_select` sebelum operasi yang
bergantung pada rAF/compositing.

## Cacat terbuka

**27. Fallback non-WebGL S5/S6/S7 cuma pesan teks, tanpa padanan gambar/SVG statis.**
CLAUDE.md mensyaratkan "setiap scene 3D punya padanan gambar/SVG statis **dan** pesan singkat
yang jelas" — dan teks pesannya sendiri (`CONTENT.ui.fallbackWebgl.narasi`) menjanjikan "latar
tiga dimensi diganti gambar diam". Hanya S1 (`fallbackHeroSvg()`) yang benar-benar memenuhi ini.
`fallback()` di `s5-komponen.js`, `s6-integrasi.js`, dan `s7-sinema.js` hanya menambahkan blok
`.fallback-pesan` (judul + narasi teks) tanpa elemen gambar apa pun — dikonfirmasi dari
pembacaan langsung ketiga berkas dan CSS terkait (`.scrolly__panel--fallback`,
`.panggung__scene--fallback` hanya mengatur `display:flex`, tidak ada `background-image` atau
SVG). Mekanisme dispatch-nya sendiri (kapan `fallback()` dipanggil) sudah diuji benar dan
berfungsi — lihat cacat #26 — celah ini murni soal kelengkapan isi fallback, bukan mekanismenya.
Di luar cakupan sesi ini untuk diperbaiki (butuh tiga ilustrasi SVG prosedural baru, satu per
scene, sesuai gaya `fallbackHeroSvg()`).


**8. Rel pipa (nav kiri, `#rel-pipa`) belum punya sambungan bernomor 1–5.**
Ini elemen berbeda dari penanda bernomor di atas model S6 (yang sudah ada dan berfungsi).
Rel pipa saat ini hanya progres scroll dan navigasi sepuluh section, belum diberi lima titik
tambahan yang berdenyut saat komponen terkait aktif, sesuai §3.4b. S5 dan S6 sudah selesai
tapi penyambungan ini belum dikerjakan di keduanya — masih terbuka.

**9. Klik sitasi melompat ke section kosong.**
`#s10-referensi` belum berisi apa pun sampai sesi S10.

**10. Reduced-motion S2 belum diverifikasi lewat pengamatan runtime.**
Guard `kurangiGerak()` ada di kode (loop gambar panel, pembuatan pin ScrollTrigger), tapi
lingkungan otomasi sesi ini tidak punya cara mengemulasi `prefers-reduced-motion` di level
OS untuk mengonfirmasinya secara langsung — beda dari S1 yang sempat diverifikasi dengan
override `matchMedia`.

*Pembaruan sesi S7:* teknik yang lebih baik ditemukan dan berhasil dipakai — pulihkan markup
section dari `index.html` mentah, timpa `window.matchMedia` sementara, lalu panggil ulang
fungsi `rakitSX` section itu secara langsung. Ini terbukti bekerja untuk memverifikasi jalur
statis S7 (lihat commit sesi ini). Belum diterapkan balik ke S2 — di luar cakupan sesi ini —
tapi sekarang ada jalan untuk melakukannya tanpa perlu emulasi OS.

**19. Aktivasi Enter/Space pada tombol lewat `computer` tool tidak bisa diandalkan diuji di sesi ini.**
Fokus keyboard sungguhan (Tab) terverifikasi benar di S3 — outline `--gamma` tampil, dan
`document.activeElement` mengonfirmasi elemen yang tepat. Tapi menekan Enter atau Space pada
tombol yang fokus **tidak memicu aksinya** — diuji dua kali di tombol simulator S3 dan sekali
lagi di tombol Putar S7 (yang sudah terbukti berfungsi lewat klik mouse), hasilnya konsisten
gagal di ketiganya. Kode tidak melakukan apa pun yang mencegah perilaku native (`<button
type="button">` polos, tidak ada `preventDefault` pada `keydown` di listener mana pun) — ini
kemungkinan besar keterbatasan cara `computer` tool mengirim event keyboard di lingkungan ini,
bukan bug produk. Dicatat sebagai keterbatasan verifikasi, bukan diklaim "terverifikasi".

**25. (Sesi S8) Screenshot mati total selama Browser pane tidak ditampilkan — dan diam-diam
melumpuhkan verifikasi animasi.**
Selama pane tertutup, halaman berhenti meng-compose frame sehingga `requestAnimationFrame`
ikut mati. Akibatnya bukan cuma screenshot yang gagal: ticker gsap berhenti, ScrollTrigger tidak
pernah menyala, dan **seluruh** reveal berbasis scroll di situs diam pada keadaan awalnya
(`opacity: 0`, `scaleX: 0`). Sempat terbaca seperti bug S8 sampai disadari S3 — yang sudah
terverifikasi di sesi sebelumnya — juga ikut membeku. Pengukuran geometri, kontras, dan overflow
tetap sahih dalam keadaan ini karena tidak bergantung pada compositing; yang tidak sahih adalah
apa pun yang menunggu rAF. Sesi ini menyelesaikannya dengan menampilkan pane, lalu animasi batang
neraca diverifikasi sungguhan (`transform` berpindah dari `matrix(0,…)` ke `matrix(1,…)`).
Ekstensi Claude in Chrome tidak tersambung di sesi ini, jadi tidak ada jalur cadangan.

**20. `resize_window` macet di lebar 503px untuk permintaan di bawah itu (360px, preset mobile 375px).**
Muncul pertama kali di sesi S3, setelah enam tab menumpuk dari sesi-sesi sebelumnya. Resize ke
1440px berhasil normal; resize ke 360/375px konsisten menghasilkan `innerWidth: 503` meski
dicoba ulang, di-reload, bahkan di tab browser baru. Namun `document.documentElement.clientWidth`
(yang dipakai breakpoint CSS media query) tetap benar mengikuti permintaan (360px) — jadi
verifikasi layout sempit tetap valid, hanya `window.innerWidth` yang menyesatkan dan sempat
membuat pengukuran overflow horizontal pertama salah baca sebelum disadari (lihat cacat #17,
yang overflow-nya sendiri nyata dan sudah dikonfirmasi lewat `scrollWidth` vs `clientWidth`,
bukan `innerWidth`). Kemungkinan keterbatasan pane setelah sesi otomasi berjalan lama dengan
banyak tab. Tab baru tidak menyelesaikannya dalam sesi ini.

*Pembaruan sesi S8:* tidak berulang. `resize_window` ke 360px menghasilkan `innerWidth: 360`
yang benar. Kemungkinan memang gejala sesi otomasi yang sudah panjang, bukan cacat menetap.

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
