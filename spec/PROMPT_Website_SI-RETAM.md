# PROMPT PEMBUATAN WEBSITE INTERAKTIF — SI-RETAM

> **Cara pakai:** salin seluruh isi dokumen ini sebagai prompt ke model/agen pembangun web (Claude Code, Cowork, atau chat biasa). **Lampirkan juga tiga berkas sumber:** `Draf_Esai_SI-RETAM_TANDAI.docx`, `Justifikasi_Prinsip_SI-RETAM.docx`, dan `SI-RETAM_3D.html`. Dokumen ini adalah spesifikasi; berkas-berkas itu adalah sumber kebenaran isinya.

---

## 0. PERAN & MISI

Kamu adalah *creative technologist* sekaligus *design lead* yang membangun **microsite ilmiah-interaktif** untuk sebuah karya tulis kompetisi mahasiswa teknik pertambangan (PCMC — Perhimpunan Ahli Pertambangan Indonesia Student Chapter). Situs ini adalah **presentasi gagasan rekayasa**, bukan situs pemasaran.

Tujuannya satu: membuat juri yang membuka situs ini **paham dalam 3 menit** mengapa monasit tidak bisa dipisahkan dengan jig, mengapa magnet + gamma adalah kombinasi yang benar, dan seperti apa alatnya bekerja — lalu tetap ingat situs ini seminggu kemudian.

Standar mutu yang dituju: setara *award-winning scrollytelling* (Awwwards / Webby / interaktif NYT–Reuters), tapi dengan **disiplin ilmiah**: setiap angka, klaim, dan istilah harus bisa dilacak ke esai.

**Dorong kemampuanmu sampai batas maksimal pada sisi teknis dan visual. Satu-satunya yang dibatasi adalah isi.**

---

## 1. ATURAN ISI — TIDAK BOLEH DILANGGAR

1. **Nol halusinasi.** Semua angka, nama mineral, nomor regulasi, dan sitasi diambil dari Lampiran A dokumen ini atau dari berkas esai. Jangan menambah statistik baru, jangan membulatkan angka, jangan mengarang nama peneliti.
2. **Jujur soal kebaruan.** Situs **tidak boleh** mengklaim penemuan alat baru. Kalimat wajib muncul di bagian solusi: kebaruannya ada pada **susunan** (pemisahan magnetik terpandu sensor gamma, dipasang inline di atas KIP, di hilir jig), bukan pada penemuan komponen. WHIMS, spektrometri gamma, dan katup pinch semuanya sudah lama dipakai industri pasir mineral.
3. **Jujur soal dampak radiologis.** Situs **tidak boleh** menyatakan sistem ini "membersihkan laut dari radioaktivitas". Rumusan yang benar: (a) memberi **verifikasi** pada setiap pelepasan sekaligus jaring pengaman, dan (b) mengangkat fraksi pekat yang justru benar-benar bersifat radiologis. Tidak ada bukti publik bahwa pembuangan tailing KIP selama ini menimbulkan persoalan radiologis — ini harus disebut.
4. **Status rancangan: konseptual.** Semua penyebutan kinerja adalah potensi, bukan jaminan. Angka recovery 94,8% (Dieye dkk., 2021) berasal dari pasir mineral Senegal, bukan dari KIP.
5. **Bagian "Keterbatasan" wajib ada dan wajib terlihat**, dengan bobot visual setara bagian keunggulan. Jangan disembunyikan di footer, jangan dikecilkan.
6. **Bahasa: Indonesia sepenuhnya.** Istilah teknis Inggris hanya bila memang tidak ada padanan lazim (WHIMS, PLC, TENORM, MCA, NaI(Tl)) dan diberi penjelasan singkat pada kemunculan pertama.
7. **Aset visual: buat sendiri, jangan ambil.** Dilarang menyisipkan foto KIP PT Timah, logo PT Timah/BAPETEN, atau gambar hasil scraping. Semua latar dan ilustrasi dibuat **prosedural** (three.js, canvas, SVG). Sediakan satu slot berlabel `#slot-foto-kip` agar pemilik situs bisa memasukkan fotonya sendiri belakangan.

---

## 2. TUMPUKAN TEKNIS

**Utama (wajib):** situs statis, tanpa proses build, bisa langsung dibuka dari `file://` maupun di-drag ke Netlify/GitHub Pages.

```
/index.html
/css/main.css
/js/main.js          → orkestrasi scroll, nav, state
/js/scene.js         → renderer three.js tunggal, manajemen scene
/js/models/*.js      → geometri 5 komponen + rakitan (port dari SI-RETAM_3D.html)
/js/widgets/*.js     → simulasi kecil per komponen (canvas 2D)
/js/cinema.js        → sekuens animasi akhir
/data/content.js     → SELURUH teks & angka terpusat di satu berkas
```

**Pustaka (via CDN + importmap):**
- `three` r160+ — **gunakan `OrbitControls` dari `three/addons/controls/OrbitControls.js`** (versi r128 pada berkas lama tidak punya ini; itulah sebabnya kontrol orbit di sana ditulis manual — silakan ganti).
- `gsap` + `ScrollTrigger` — semua animasi berbasis scroll.
- `lenis` — smooth scroll (wajib hormati `prefers-reduced-motion`).
- Tanpa React, tanpa Tailwind. CSS ditulis tangan dengan custom properties.

**Aturan performa yang mengikat:**
- **Satu instance `WebGLRenderer` saja** untuk seluruh halaman, di-*mount* ulang ke section aktif — bukan lima canvas hidup bersamaan.
- Setiap scene 3D di-*init* malas (lazy) lewat `IntersectionObserver`; render loop **berhenti** saat section keluar viewport.
- `setPixelRatio(Math.min(devicePixelRatio, 2))`.
- Target: 60 fps di laptop kelas menengah, ≥30 fps di ponsel mid-range. Muat awal < 3 detik di 4G.
- Di layar < 768px: geometri disederhanakan (segmen silinder 28 → 12), bayangan mati, partikel dikurangi 70%, section sinema pakai kontrol tombol alih-alih scroll-scrub.

---

## 3. SISTEM DESAIN

Ambil kosakata visual dari dunia subjeknya sendiri: **laut dalam, lambung baja, panel instrumen, dan simbol radiologis.** Bukan dari template startup.

### 3.1 Warna

| Token | Hex | Peran |
|---|---|---|
| `--abisal` | `#071016` | latar utama, laut dalam |
| `--lambung` | `#0F1D26` | permukaan panel, kartu |
| `--garis` | `#1E3340` | garis, pemisah, kisi |
| `--baja` | `#C9D6DD` | teks utama |
| `--kabut` | `#7C93A1` | teks sekunder, keterangan |
| `--gamma` | `#E9B93A` | **aksen utama** — kuning radiologis |
| `--magnet` | `#3FB8C4` | aksen medan magnet, aliran, garis gaya |
| `--monasit` | `#8C4A2F` | fraksi berharga, konsentrat, sorotan LTJ |
| `--sedimen` | `#9A8F7E` | plume tailing, partikel kuarsa |

**Justifikasi aksen kuning:** ini bukan pilihan gaya, ini material subjeknya — warna trefoil radiologis. Dipakai **hemat**: hanya untuk penanda gamma, angka aktif, dan status keputusan PLC. Jangan jadikan warna tombol umum.

Latar keseluruhan gelap sepanjang situs, **kecuali** bagian "Kelayakan & Keterbatasan" yang beralih ke `#E8E6E1` dengan tinta `#0F1D26` — pergeseran nada ini disengaja: bagian jujur dibaca di ruang terang, bukan di ruang gelap yang dramatis.

### 3.2 Tipografi

| Peran | Font | Catatan |
|---|---|---|
| Display | **Archivo** (variabel, sumbu lebar) | judul; pakai lebar ekspan 112–125% dan berat 700–800. Huruf besar hanya untuk eyebrow. |
| Isi | **IBM Plex Sans** | paragraf, 17–19px, tinggi baris 1,7, panjang baris maks 68 karakter |
| Data | **IBM Plex Mono** | angka instrumen, satuan (Bq/kg, keV, T, m³/jam), nomor komponen, sitasi |

Skala tipe: 13 / 15 / 17 / 21 / 28 / 40 / 64 / 96 px (`clamp()` untuk responsif). Judul hero boleh sampai `clamp(40px, 8vw, 112px)`.

Gunakan **Plex Mono** setiap kali sebuah angka adalah *bacaan alat* — ini membuat halaman terasa seperti panel kendali, bukan brosur.

### 3.3 Gerak

- Easing standar: `cubic-bezier(0.16, 1, 0.3, 1)`. Durasi: mikro 180ms, transisi 420ms, sinematik 900ms+.
- Semua reveal berbasis scroll dengan `ScrollTrigger`, bukan `animationend` acak.
- **Satu momen terorkestrasi per section** lebih baik daripada sepuluh efek tersebar. Jangan animasikan segalanya.
- `@media (prefers-reduced-motion: reduce)`: matikan parallax, auto-rotate, partikel, dan smooth scroll; sisakan fade sederhana. Section sinema berubah jadi kartu-kartu langkah statis.

### 3.4 Elemen Tanda Tangan (signature)

Dua, dan hanya dua:

**(a) "Empat Sifat" — simulator pemisahan interaktif.** Ini inti argumen esai yang dibuat bisa dimainkan. Pengguna memilih satu sifat fisik; simulasi partikel langsung menunjukkan hasilnya. Detail di §4, S3.

**(b) Rel pipa sebagai indikator progres.** Sisi kanan layar menampilkan skema pipa vertikal; posisi scroll digambarkan sebagai **bubur yang merambat** naik di dalam pipa. Kelima komponen muncul sebagai sambungan bernomor pada pipa itu, dan berfungsi sebagai navigasi. Penomoran 1–5 dibenarkan di sini karena isinya memang urutan proses satu arah, bukan hiasan.

---

## 4. STRUKTUR HALAMAN

### S0 — Preloader: "Kalibrasi detektor"

Bukan spinner. Layar gelap, di tengah ada **pencacah gamma yang sedang dikalibrasi**: angka cacah mono berdetak dengan derau acak (statistik Poisson yang terlihat), sebuah spektrum kecil terbentuk dari kiri ke kanan, dan garis progres berlabel `KALIBRASI DETEKTOR · 0–100%`. Di bawahnya: `SI-RETAM`.

Keluar: seluruh layar terangkat seperti permukaan air yang tersibak, memperlihatkan hero. Maksimum 2,2 detik; kalau aset sudah siap lebih cepat, percepat.

### S1 — Hero: judul esai di atas KIP

Satu viewport penuh.

**Latar (three.js, ringan):** siluet **Kapal Isap Produksi** di garis cakrawala senja — lambung memanjang, menara, rangkaian tangga ladder. Buat dari primitif sederhana bergaya *silhouette*, bukan model detail. Di bawahnya laut gelap dengan riak berbasis shader (gelombang sinus berlapis + kilau garis pada puncak). Kabut volumetrik tipis. Kamera bergeser sangat lambat (parallax terhadap gerak kursor, amplitudo kecil).

**Foreground:**
- Eyebrow mono: `PCMC · INOVASI TEKNOLOGI · EKSTRAKSI TAMBANG MINERAL`
- Judul (display, reveal per baris dengan *mask* naik, stagger 80ms):
  **SI-RETAM** — lalu subjudul lengkap esai (Lampiran A.1)
- Satu baris kunci: *Sistem Rekaveri Tailing Aman Monasit*
- Tiga statistik mono kecil di baris bawah, muncul dengan count-up: `>3,5 juta m³/bulan` · `10–20% monasit dalam fraksi berat` · `1 Bq/g tingkat klierens`
- Petunjuk scroll: garis vertikal tipis dengan titik yang turun berulang.

**Mikro-interaksi:** kursor kustom berbentuk **retikel detektor** (lingkaran + garis silang tipis) yang membesar saat berada di atas elemen interaktif, dan menampilkan label mono kecil (`putar`, `buka`, `mainkan`). Aktif hanya di perangkat berpointer halus.

### S2 — Pendahuluan: dari mana masalahnya

Scrollytelling: kolom teks bergulir di kiri, **panel visual sticky** di kanan yang berubah mengikuti sub-bagian.

**S2a · Bagaimana KIP bekerja.** Diagram potongan melintang (SVG yang tergambar mengikuti scroll, `stroke-dashoffset`): material dasar laut disedot → jig primer & sekunder → kasiterit ke penampungan → sisanya keluar sebagai tailing → dibuang kembali ke laut. Titik keluar tailing berkedip pelan dengan label: **"di sinilah SI-RETAM menyisip."**

**S2b · Isi tailing itu apa.** Panel berubah jadi ladang partikel: mayoritas kuarsa (`--sedimen`), dengan minoritas berwarna berbeda. Muncul empat kartu mineral yang bisa di-hover — **monasit, zirkon, ilmenit, xenotim** — masing-masing menampilkan densitas, sifat magnetik, konduktivitas, dan radioaktivitas (Lampiran A.3). Saat kartu di-hover, partikel jenis itu menyala dan sisanya meredup.

**S2c · Dua masalah bertautan.** Layar terbelah dua. Kiri: **fisik** — animasi plume kekeruhan menyebar, endapan menebal, biota bentik tertekan. Kanan: **radiologis** — monasit sebagai TENORM, deret luruh Th-232 & U-238, ditambah Ra-226 dan K-40. Sertakan kalimat penyeimbang dari esai: keberadaan mineral ini belum membuktikan tailing melewati ambang pengawasan; itu harus **diukur** — dan di situlah celahnya.

**S2d · Paradoksnya.** Momen paling dramatis di bagian ini. Satu butir monasit membesar di tengah layar; label di sekelilingnya berputar: kontaminan ⇄ bahan baku. Uraikan Nd, Pr, La, Ce → magnet permanen → motor kendaraan listrik & turbin angin. Sebutkan penghambatnya: bukan nihilnya LTJ, melainkan thorium dan uranium yang menempel.

**S2e · Peta regulasi.** Linimasa horizontal (scroll horizontal terkunci sepanjang 100vh): Kepmen ESDM 296.K/MB.01/MEM.B/2023 → Kepmen ESDM 69.K/MB.01/MEM.B/2024 → PP No. 96/2021 → Perka BAPETEN 16/2012 → Perka BAPETEN 9/2009. Tiap kartu berisi satu kalimat implikasi.

**S2f · Celahnya.** Teks besar, tanpa hiasan: sejauh penelusuran penulis, belum ada rancangan yang menyatukan pemulihan monasit dan verifikasi radioaktivitas dalam satu alur, sebelum pasir dikembalikan ke dasar laut.

### S3 — Argumen: mengapa jig tidak cukup ★ SIGNATURE

**Simulator "Empat Sifat".** Kanvas 2D lebar (bukan 3D — 2D lebih terbaca di sini), berisi ±400 partikel berlabel warna: monasit, zirkon, ilmenit, kasiterit, kuarsa.

Empat tombol di bawah: **Densitas · Kerentanan magnetik · Konduktivitas listrik · Radioaktivitas**.

Perilaku tiap mode:
- **Densitas** → partikel berstratifikasi menurut berat jenis. Monasit (~5,0), ilmenit (~4,7), zirkon (~4,6), rutil (~4,3) **berakhir pada lapisan yang sama dan tumpang tindih.** Verdict merah: *Tidak — terlalu mirip.*
- **Kerentanan magnetik** → medan magnet muncul dari kiri; kuarsa/zirkon/kasiterit lolos ke kanan, monasit **dan ilmenit** sama-sama tertahan. Verdict kuning: *Sebagian — ilmenit ikut.*
- **Konduktivitas** → pemisahan terjadi, tetapi muncul overlay peringatan: **butuh umpan kering**, tidak masuk akal untuk bubur basah di atas kapal. Verdict kuning.
- **Radioaktivitas** → semua partikel meredup; **hanya monasit yang berpendar** dan memancarkan pulsa gamma menuju detektor kecil di tepi kanvas, yang mencacah naik. Verdict hijau: *Ya — satu-satunya yang selektif.*

Di samping kanvas, tabel dari Lampiran A.3 ikut menyoroti baris yang sedang aktif. Setelah pengguna mencoba keempatnya, kesimpulan muncul dengan animasi: **magnet melakukan pemisahan fisiknya; gamma menjadi penuntun yang menunjuk mana yang benar-benar monasit.**

**S3b · "Mengapa bukan sekadar menyetel ulang jig".** Sub-bagian teks + grafik kecil. Sampaikan temuan Rosita (2017) pada KIP 11 secara jujur: fraksi monasit & kasiterit pada konsentrat dapat naik hingga rata-rata di atas 35%, losses pada tailing ditekan ke 0–0,17% — **tetapi** itu hasil terbaik dari kondisi eksperimen terkendali pada satu kapal, bukan operasional rutin, dan penyetelan itu tetap bekerja pada densitas. Lanjutkan dengan argumen terak: konsentrat umpan peleburan tetap membawa sekitar 30% pengotor; terak peleburan mengandung thorium dan uranium yang sulit dibersihkan dari fase silika dan titania. Visual: dua jalur bercabang — "monasit ke jalur timah" (menumpuk beban di terak) vs "monasit ke jalur tailing" (ditangani terpisah).

### S4 — Solusi: gagasan SI-RETAM

Momen pengungkapan. Layar menggelap sesaat, lalu modul muncul dari kegelapan dengan pencahayaan rim-light.

- Akronim dieja dengan animasi: **SI**stem **RE**kaveri **TA**iling Aman **M**onasit.
- **Diagram batas sistem** yang penting sekali dan sering dilupakan: tiga zona berdampingan — *(hulu, di luar sistem)* jig PT Timah · **(SI-RETAM)** · *(hilir, di luar sistem)* pemisahan elektrostatik & proses kimia di darat. Zona luar digambar dengan garis putus-putus dan opasitas rendah.
- Kalimat penutup section, diberi bobot tipografi besar: **"Magnet menjadi tangan yang memisah; gamma menjadi mata yang memilih."**
- Kotak "Batas kebaruan" — sengaja ditampilkan di sini, bukan disembunyikan: komponennya lama, susunannya yang baru.

### S5 — Komponen: lima alat, satu per satu ★ 3D INTERAKTIF

Struktur: **canvas 3D sticky memenuhi 60% layar**, panel teks bergulir di sisi lain. Saat scroll melewati batas sub-bagian, model **bertransisi** (bukan potong keras): komponen lama menyusut & memudar, kamera bergerak, komponen baru terbentuk.

**Sumber geometri:** port dari `SI-RETAM_3D.html` yang dilampirkan — fungsi `bConditioner`, `bWHIMS`, `bSensor`, `bValve`, `bBunker`, `bAssembly` sudah menyediakan bentuk dasar yang benar. **Tingkatkan:** material PBR yang lebih baik (`envMap` dari `RoomEnvironment`), bevel pada tepi, sambungan flensa & baut pada pipa, bayangan kontak, dan sedikit *ambient occlusion*. Ganti label sprite dengan **anotasi HTML** ber-*leader line* SVG yang mengikuti proyeksi titik 3D ke layar (lebih tajam dan bisa diakses keyboard).

**Kontrol pada setiap model:** OrbitControls (batasi `minDistance`/`maxDistance`/`maxPolarAngle`), tombol **Tampilan urai** (exploded view — bagian terpisah sepanjang sumbu dengan `gsap`), **Potongan melintang** (clipping plane yang bisa digeser), **Sembunyikan label**, dan **Reset**. Auto-rotate lembut yang berhenti begitu pengguna menyentuh.

Untuk **tiap** komponen, panel teks memuat tiga blok tetap dengan gaya konsisten:
`APA YANG DILAKUKAN` · `BAGAIMANA CARANYA` · `ILMU YANG MELANDASI`
(isi persis mengikuti `Justifikasi_Prinsip_SI-RETAM.docx` Bagian B — jangan diringkas sampai hilang isinya, jangan ditambahi.)

Dan **tiap** komponen mendapat **satu widget simulasi kecil** (canvas 2D di bawah teks) — ini yang membuat situs terasa hidup, bukan sekadar model diam:

**1 · Pengkondisi umpan.** Slider "keberdenyutan keluaran jig". Grafik kiri menunjukkan masukan berdenyut, grafik kanan menunjukkan keluaran yang dihaluskan. Naikkan denyut → keluaran tetap tenang sampai kapasitas penyangga terlampaui. Gelembung naik dan keluar lewat vent. Label ilmu: kontinuitas, asas Archimedes, kapasitansi hidraulik, reologi bubur.

**2 · Pemisah magnetik (WHIMS).** Dua slider: **kuat medan (0–2 T)** dan **ukuran butir (5–500 µm)**. Partikel mengalir melalui matriks baja; yang tertangkap menempel di tepi matriks. Tampilkan pembaca mono: *efisiensi tangkap*. **Wajib**: pada butir sangat halus efisiensi jatuh — tampilkan pengingat bahwa gaya magnet sebanding pangkat tiga diameter sedangkan gaya seret hanya sebanding diameter. Widget ini harus **menunjukkan keterbatasan sistem sendiri**, bukan menyembunyikannya.

**3 · Sensor gamma + PLC.** Spektrum langsung di canvas: sumbu energi dengan puncak **Pb-212 pada 239 keV** dan **Tl-208 pada 2,61 MeV**, latar yang dikurangi. Slider **waktu cacah**; tampilkan ketidakpastian relatif ≈ 1/√N secara langsung — pengguna melihat sendiri bahwa ketelitian ~5% menuntut orde beberapa ratus cacah, dan bahwa cacah rendah memaksa waktu ukur lebih lama sehingga membatasi laju alir. Rantai fisikanya divisualkan sebagai jalur: foton → kristal NaI(Tl) → kilau → PMT → pulsa → MCA → spektrum → kadar monasit.

**4 · Katup pengarah.** Demo **waktu tunda PLC**. Segmen bubur bergerak di pipa dari sensor ke katup. Pengguna menyetel tunda; jika salah, katup membelokkan segmen yang keliru (tampilkan gagalnya secara eksplisit — "segmen kaya monasit lolos ke laut"), jika benar segmen yang sama yang tadi diukur yang dibelokkan. Selongsong karet terlihat terjepit oleh aktuator pneumatik. Catatan penting yang harus tertulis: **katup tidak memisahkan apa pun — ia hanya membelokkan seluruh segmen aliran.**

**5 · Bunker berperisai.** Slider **tebal perisai timbal**; laju dosis di luar dinding turun mengikuti peluruhan eksponensial I = I₀e^(−µx), dibaca pada panel mono. Sertakan asas proteksi radiasi: jarak, waktu, perisai. Tegaskan bahwa tebal perisai adalah hasil perhitungan berdasarkan aktivitas nyata — rancangan menyebut "perisai sesuai kajian keselamatan", bukan memaku angka tertentu.

**Opsional · Hidrosiklon (desliming).** Tampilkan sebagai kartu tambahan bertanda "opsional, di hulu": pusaran, gaya sentrifugal, hukum Stokes, tanpa bagian bergerak; gunanya melindungi matriks magnetik dari lumpur ultrahalus yang memang tidak dapat dipulihkan.

### S6 — Integrasi: satu rakitan di atas dek KIP ★ 3D INTERAKTIF

Kamera menarik mundur dari komponen terakhir dan **kelima komponen menyusun diri** menjadi satu skid di atas dek — gunakan `bAssembly()` sebagai basis, lengkap dengan dek, lambung, pagar kuning, rel, dan bidang laut.

Fitur wajib:
- **Referensi skala**: siluet manusia setinggi 1,7 m dan garis panjang lambung, agar terbaca bahwa modul hanya sebagian kecil dari kapal.
- **Penanda bernomor 1–5** yang bisa diklik; klik → kamera terbang (`gsap` ke posisi & target) ke komponen itu, kartu ringkas muncul, dan penanda lain meredup.
- **Sorot jalur aliran**: tiga tombol — *seluruh aliran*, *jalur fraksi magnetik → bunker*, *jalur non-magnetik → laut*. Pipa yang tidak aktif menjadi abu-abu transparan; pipa aktif menyala dengan partikel yang mengalir di dalamnya (`--magnet` untuk umpan, `--monasit` untuk konsentrat, `--sedimen` untuk buangan).
- **Mode X-ray**: material menjadi wireframe/transparan sehingga isi WHIMS dan bunker terlihat.
- **Toggle "posisi di kapal"**: kamera mundur jauh memperlihatkan seluruh KIP dengan modul disorot di dek — menegaskan ini *retrofit*, bukan kapal baru.

### S7 — Sinema: alat itu bekerja ★ ANIMASI PENUH

> **Catatan teknis penting untuk pembangun:** yang diminta adalah "video". Jangan mencoba menghasilkan berkas video — **buat sekuens sinematik 3D yang dianimasikan di dalam scene**, dengan kontrol pemutar layaknya video (putar/jeda, garis waktu bisa di-scrub, lompat bab, kecepatan 0,5×–2×). Ini lebih baik dari video: bisa diputar ulang, diperbesar, dan tetap tajam di layar apa pun. Sediakan tombol **"Rekam ke .webm"** menggunakan `canvas.captureStream()` + `MediaRecorder` bagi yang benar-benar butuh berkas video.

Sekuens (total ±60 detik), dengan takarir bahasa Indonesia di bawah layar dan penanda bab:

| Waktu | Bab | Yang terjadi |
|---|---|---|
| 0:00 | Keluar dari jig | Bubur tailing berdenyut keluar dari pipa jig, masuk ke modul. Kamera mengikuti aliran. |
| 0:07 | Penstabilan | Di dalam pengkondisi: denyut mereda, gelembung naik dan keluar lewat vent, keluaran menjadi rata. |
| 0:15 | Pemisahan magnetik | Potongan melintang WHIMS: medan menyala, partikel magnetik (monasit + ilmenit) menempel pada matriks; kuarsa, zirkon, kasiterit lolos ke kanan. |
| 0:24 | Pembilasan | Medan dimatikan; fraksi magnetik dibilas keluar sebagai aliran tersendiri. |
| 0:31 | Pembacaan gamma | Kamera menempel pada detektor. Cacah naik, spektrum terbentuk, puncak Th teridentifikasi, PLC menyalakan keputusan. |
| 0:39 | Keputusan katup | Selongsong terjepit; segmen kaya monasit dibelokkan ke bunker (warna `--monasit`), sisanya lurus. |
| 0:46 | Verifikasi & pelepasan | Aliran buangan melewati gerbang gamma, bacaan dibandingkan dengan acuan klierens, lalu dilepas **lewat sisi luar kapal** — bukan ke bawah. |
| 0:54 | Penutup | Kamera naik menjadi bidikan lebar: modul kecil di atas dek KIP, ringkasan tiga angka muncul. |

Detail yang membuatnya meyakinkan: sistem partikel GPU untuk bubur (jangan mesh per butir), *depth of field* ringan pada bidikan dekat, gerak kamera dengan easing sinematik (tidak linear), bunyi opsional (dengung pompa, klik aktuator, detak pencacah) dengan **tombol suara mati secara bawaan**, dan takarir yang sinkron.

### S8 — Kelayakan, dampak, dan keterbatasan

Pergeseran ke latar terang. Bagian ini harus terbaca sebagai bagian yang paling dewasa dari seluruh situs.

- **Neraca laju alir**, divisualkan proporsional dan jujur: satu modul ≈ 280 m³/jam bubur ≈ 180–200 ton padatan/jam, sementara satu KIP menghasilkan tailing pada orde ~7.000 ton padatan/jam. Tampilkan sebagai batang perbandingan yang benar skalanya, dengan label eksplisit: **modul dipasang pada satu aliran cabang dan berperan sebagai unit uji, bukan penanganan seluruh kapal.** Jangan diperhalus.
- **Tiga sudut manfaat** sebagai kartu: ekonomi (beban → calon aset), tata kelola (verifikasi melekat pada proses, bukan sampling sesekali), lingkungan (muatan radiologis sisa lebih ringan, besarnya masih perlu dibuktikan).
- **Enam keterbatasan** sebagai daftar bernomor yang berbobot penuh (Lampiran A.6): fraksi ultrahalus, keluaran masih bercampur ilmenit, kepekaan bacaan gamma terhadap kadar air & densitas, kadar monasit pada tailing KIP yang belum terverifikasi untuk umum, tambahan biaya & kompleksitas, dan status yang masih konseptual.
- **Pernyataan kalibrasi klaim** dalam kotak khusus: nilai radiologis SI-RETAM bukan klaim membersihkan laut, melainkan verifikasi + pemusatan fraksi pekat.

### S9 — Peta jalan menuju penerapan

Enam langkah sebagai jalur mendatar: ukur kadar & ukuran butir monasit pada tailing KIP Bangka → uji kinerja pemisah magnetik pada rentang butir tersebut → kalibrasi kurva gamma terhadap kadar monasit → uji pilot skala kecil di atas kapal → kajian tekno-ekonomi → konsultasi dini dengan BAPETEN.

### S10 — Daftar pustaka & kredit

Seluruh 17 rujukan (Lampiran A.7), dapat dicari, tiap entri tertaut ke DOI/URL aslinya, dibuka di tab baru. Tampilkan gaya kartu mono. Di bawahnya: catatan bahwa situs ini adalah presentasi konsep untuk PCMC, slot `#slot-foto-kip`, dan pernyataan bahwa seluruh visual dibuat prosedural.

---

## 5. KATALOG MIKRO-INTERAKSI

Pakai yang mendukung isi, buang sisanya:

- Kursor retikel detektor dengan label kontekstual (§S1).
- Hover pada kartu mineral → partikel jenis itu menyala di panel.
- Tombol dengan tarikan magnetis lembut (translate maks 4px) — dibenarkan tematis, gunakan hanya pada aksi utama.
- Angka penting memakai count-up saat masuk viewport, dengan **derau Poisson kecil pada angka bertema cacah** sebelum mengunci.
- Judul section memakai efek *scramble* singkat pada karakter mono saja, bukan pada isi paragraf.
- Rel pipa progres: bubur naik mengikuti scroll; sambungan bernomor berdenyut saat section terkait aktif; klik untuk lompat.
- Sorot sitasi: hover pada `(Widana dkk., 2024)` di badan teks → tooltip berisi entri lengkap; klik → melompat ke S10 dengan entri tersorot.
- Fokus keyboard terlihat jelas: garis `--gamma` 2px, offset 3px. Jangan hilangkan outline.
- Transisi antar section: pergeseran warna latar yang halus, bukan potongan keras.

---

## 6. AKSESIBILITAS & MUTU DASAR

- Responsif penuh sampai 360px. Di ponsel, canvas 3D tetap dapat diputar dengan sentuh; scroll halaman tidak boleh terkunci oleh canvas (gunakan `touch-action` yang tepat dan area drag yang jelas).
- Setiap kontrol 3D dan hotspot dapat dijangkau keyboard, dengan `aria-label` bahasa Indonesia.
- Setiap visual 3D/canvas punya padanan teks yang terbaca pembaca layar (ringkasan apa yang ditampilkan).
- Kontras teks minimal 4.5:1 pada latar gelap maupun terang.
- Situs harus tetap **terbaca dan lengkap** bila WebGL gagal: sediakan fallback gambar/SVG statis untuk setiap scene 3D, dan pesan singkat yang jelas tentang apa yang tidak tersedia — bukan layar kosong.
- Takarir sinema tersedia sebagai teks yang bisa disalin.

---

## 7. CARA KERJAMU

1. Baca ketiga berkas lampiran sampai tuntas sebelum menulis kode. Pindahkan **seluruh** teks dan angka ke `data/content.js` lebih dulu, baru bangun tampilannya di atas data itu.
2. Buat rencana desain singkat (token warna, tipe, tata letak, elemen tanda tangan), tinjau sendiri apakah ada bagian yang terasa seperti template umum, perbaiki, baru mulai membangun.
3. Bangun berurutan: kerangka & sistem desain → S1–S4 (2D) → S5 (3D per komponen) → S6 (rakitan) → S7 (sinema) → S8–S10 → poles & optimasi.
4. Uji di lebar 360px, 768px, dan 1440px. Uji dengan `prefers-reduced-motion` menyala. Uji dengan JavaScript 3D gagal dimuat.
5. Setelah selesai, tulis `README.md` singkat: cara menjalankan, cara mengganti teks di `content.js`, cara menyisipkan foto di `#slot-foto-kip`, dan daftar hal yang sengaja **tidak** diklaim.

---

# LAMPIRAN A — ISI YANG MENGIKAT

Gunakan angka-angka ini persis. Jangan tambah, jangan bulatkan.

### A.1 Identitas
- **Judul esai:** SI-RETAM: Pemisahan Magnetik Terpandu Sensor Gamma untuk Memulihkan Monasit dari Tailing Timah Lepas Pantai di Hilir Jig Kapal Isap Produksi
- **Kepanjangan:** Sistem Rekaveri Tailing Aman Monasit
- **Konteks:** Kepulauan Bangka Belitung; modul retrofit di hilir jig Kapal Isap Produksi (KIP)

### A.2 Angka latar belakang
- Satu unit KIP mampu memindahkan lebih dari **3,5 juta meter kubik** material dasar laut per bulan (Bisnis.com, 2025)
- Monasit dalam fraksi mineral berat tailing Bangka: **10–20%**, mencapai **19%** pada beberapa lokasi pengolahan (Widana dkk., 2024)
- Xenotim sebagai LTJ sekunder: **1–2%** (Zglinicki dkk., 2021; Ngadenin dkk., 2023)
- Pemisahan magnetik pada bahan pascapengolahan timah Bangka menaikkan kadar monasit dari sekitar **19% menjadi 37–46%** (Widana dkk., 2024)
- Recovery monasit pada pasir mineral Senegal: **94,8%** (Dieye dkk., 2021) — *konteks lain, bukan KIP*
- Medan magnet yang dibutuhkan: **1–2 Tesla** (sekitar 1,5 T disebut di esai)
- Tingkat klierens deret Th-232 & U-238 pada material padat: **1.000 Bq/kg = 1 Bq/g** (Perka BAPETEN No. 16 Tahun 2012)
- Selisih antara monasit pekat dan acuan klierens: **dua sampai tiga orde besaran**
- Jig KIP 11 setelah optimasi: fraksi monasit & kasiterit pada konsentrat naik hingga rata-rata **di atas 35%**, losses pada tailing **0–0,17%** (Rosita, 2017) — *kondisi eksperimen terkendali, bukan operasional rutin*
- Konsentrat umpan peleburan tetap membawa sekitar **30% pengotor**
- Kapasitas modul: pipa **Ø200 mm**, kecepatan **2,5 m/s** → **0,08 m³/detik** ≈ **280 m³/jam** ≈ **180–200 ton padatan/jam** pada kandungan padatan **±25%**
- Keluaran tailing satu KIP: orde **±7.000 ton padatan/jam**
- Ketelitian cacah: ketidakpastian relatif ≈ 1/√N; ketelitian **±5%** menuntut orde **beberapa ratus cacah**
- Energi gamma penanda: **Pb-212 pada 239 keV**, **Tl-208 pada 2,61 MeV** (deret torium)

### A.3 Tabel sifat mineral (inti argumen)

| Sifat | Monasit | Mineral lain | Bisa isolasi monasit? |
|---|---|---|---|
| Densitas | ~5,0 | zirkon ~4,6; ilmenit ~4,7; rutil ~4,3 (berimpitan) | **Tidak** — terlalu mirip |
| Kerentanan magnetik | paramagnetik | ilmenit magnetik kuat; kuarsa/zirkon/kasiterit non-magnetik | **Sebagian** — buang non-magnetik, tapi ilmenit ikut |
| Konduktivitas listrik | non-konduktor | ilmenit/rutil/kasiterit konduktor; zirkon non-konduktor | **Sebagian** — tapi butuh umpan kering |
| Radioaktivitas | ya (Th/U) | ilmenit, rutil, kuarsa, kasiterit: tidak | **Ya** — satu-satunya yang selektif |

### A.4 Lima keputusan desain (Bagian A dokumen justifikasi)
1. Jig/konsentrator gravitasi **ditolak** sebagai pemisah selektif — hanya bekerja pada densitas, dan sudah beroperasi di hulu.
2. **WHIMS dipilih** sebagai pemisah fisik utama — bekerja pada kerentanan magnetik, realistis di atas kapal, tanpa reagen.
3. **Elektrostatik dan flotasi ditunda ke darat** — elektrostatik butuh umpan kering bersuhu tinggi; flotasi butuh reagen, pengaturan pH, dan pengelolaan buih yang sulit distabilkan di kapal yang bergoyang.
4. **Sensor gamma dipilih sebagai otak**, bukan XRF — gamma selektif, kuantitatif, dan non-kontak (membaca menyeluruh menembus dinding pipa); XRF hanya membaca permukaan dan peka pada kadar air serta matriks.
5. **Ditempatkan di atas KIP**, bukan di darat — verifikasi sebelum pelepasan, pemusatan material pembawa radionuklida di sumbernya, dan menjaga monasit keluar dari aliran konsentrat timah. *Diakui jujur:* model pengolahan di darat seperti pabrik amang Malaysia juga sah; ini pilihan desain, bukan yang terbukti paling optimal.

### A.5 Regulasi yang disebut
- Kepmen ESDM No. 296.K/MB.01/MEM.B/2023 — LTJ sebagai mineral kritis
- Kepmen ESDM No. 69.K/MB.01/MEM.B/2024 — LTJ sebagai mineral strategis
- PP No. 96 Tahun 2021 — kewajiban peningkatan nilai tambah mineral logam
- Perka BAPETEN No. 16 Tahun 2012 — tingkat klierens
- Perka BAPETEN No. 9 Tahun 2009 — intervensi terhadap paparan TENORM

### A.6 Enam keterbatasan (wajib tampil utuh)
1. **Fraksi ultrahalus** — pada butir sangat halus gaya magnet mengecil lebih cepat daripada gaya seret air, sehingga monasit terhalus lolos dan sebagian sengaja dibuang lewat desliming.
2. **Masih bercampur ilmenit** — monasit murni baru diperoleh setelah pemisahan elektrostatik di darat; modul di kapal menghasilkan konsentrat antara, bukan produk akhir.
3. **Bacaan gamma peka** terhadap kadar air dan densitas, sehingga perlu dinormalkan lewat pengkondisian umpan dan kalibrasi.
4. **Kadar dan sebaran monasit pada tailing KIP belum terverifikasi untuk umum**, sehingga besaran recovery masih terbuka.
5. **Menambah biaya dan kompleksitas** pada kapal; penempatan di kapal alih-alih mengolah tumpukan di darat adalah pilihan yang menekankan pemeriksaan sebelum pelepasan, bukan sesuatu yang sudah terbukti paling ekonomis.
6. **Seluruh rancangan masih konseptual** — komponennya terbukti secara terpisah, integrasi khusus ini belum diuji di lapangan.

### A.7 Daftar pustaka
Salin lengkap dari bagian DAFTAR PUSTAKA pada `Draf_Esai_SI-RETAM_TANDAI.docx` (17 entri: Andini & Sari 2020; Awang Kechik & Ku Ishak 2025; Bisnis.com 2025; Bisnis.com 2026; Dieye dkk. 2021; Ishigaki dkk. 2026; Ngadenin dkk. 2023; Perka BAPETEN 9/2009; Perka BAPETEN 16/2012; Prasetyo dkk. 2020; PT Timah 2025; Robben & Wotruba 2019; Rosita 2017; USACE-ERDC 2005; Wang dkk. 2026; Widana dkk. 2024; Widaputra dkk. 2014; Zglinicki dkk. 2021), lengkap dengan DOI/URL.

---

# LAMPIRAN B — DAFTAR PERIKSA PENERIMAAN

Situs dianggap selesai bila **semua** terpenuhi:

- [ ] Preloader kalibrasi detektor tampil dan keluar mulus (< 2,2 detik)
- [ ] Hero menampilkan judul lengkap esai dengan latar KIP prosedural yang beranimasi
- [ ] Enam sub-bagian pendahuluan (S2a–S2f) lengkap dan terhubung ke visual sticky
- [ ] Simulator "Empat Sifat" berfungsi untuk keempat mode dan menghasilkan verdict yang benar
- [ ] Argumen "mengapa bukan sekadar menyetel ulang jig" tersaji lengkap dengan angka Rosita (2017)
- [ ] Diagram batas sistem (hulu / SI-RETAM / hilir) jelas
- [ ] Kelima komponen punya model 3D yang dapat diputar, di-zoom, diurai, dan dipotong
- [ ] Kelima komponen punya blok `APA · BAGAIMANA · ILMU` dan satu widget simulasi masing-masing
- [ ] Widget WHIMS menunjukkan jatuhnya efisiensi pada butir halus
- [ ] Widget katup menunjukkan konsekuensi tunda PLC yang salah
- [ ] Rakitan 3D lengkap dengan referensi skala, penanda bernomor, sorot jalur aliran, dan mode X-ray
- [ ] Sekuens sinema 8 bab berjalan dengan kontrol putar/jeda/scrub/kecepatan dan takarir Indonesia
- [ ] Neraca 280 m³/jam vs ~7.000 ton/jam ditampilkan dengan skala yang jujur
- [ ] Enam keterbatasan tampil dengan bobot visual penuh
- [ ] Pernyataan batas kebaruan muncul dan tidak dilunakkan
- [ ] Tidak ada klaim "membersihkan laut dari radioaktivitas"
- [ ] Daftar pustaka lengkap, tertaut, dapat dicari
- [ ] Berfungsi di 360px; `prefers-reduced-motion` dihormati; fallback non-WebGL tersedia
- [ ] Tidak ada foto/logo pihak ketiga
- [ ] Tidak ada satu pun angka yang tidak ada di Lampiran A atau berkas esai

---

**Bila ada bagian esai yang terasa kurang untuk kebutuhan visual, jangan mengarang isinya — tandai sebagai `TODO: butuh konfirmasi penulis` dan lanjutkan.**
