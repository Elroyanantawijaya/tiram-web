// data/content.js
// SELURUH teks & angka situs SI-RETAM. Satu-satunya tempat string isi hidup.
// Sumber: spec/Draf_Esai_SI-RETAM_TANDAI.docx, spec/Justifikasi_Prinsip_SI-RETAM.docx,
// spec/PROMPT_Website_SI-RETAM.md (Lampiran A). Jangan menambah angka atau mengarang
// isi di luar tiga sumber ini — tandai `todo` bila sumber tidak memberi jawaban.

export const CONTENT = {

  // ===== A.1 Identitas =====
  meta: {
    judulEsai: 'SI-RETAM: Pemisahan Magnetik Terpandu Sensor Gamma untuk Memulihkan Monasit dari Tailing Timah Lepas Pantai di Hilir Jig Kapal Isap Produksi',
    kepanjangan: 'Sistem Rekaveri Tailing Aman Monasit',
    konteks: 'Kepulauan Bangka Belitung; modul retrofit di hilir jig Kapal Isap Produksi (KIP)',
    kompetisi: 'PCMC — Perhimpunan Ahli Pertambangan Indonesia Student Chapter, subtopik Ekstraksi Tambang Mineral',
  },

  // ===== S0 — Preloader =====
  s0: {
    label: 'KALIBRASI DETEKTOR · 0–100%',
    wordmark: 'SI-RETAM',
  },

  // ===== S1 — Hero =====
  s1: {
    eyebrow: 'PCMC · INOVASI TEKNOLOGI · EKSTRAKSI TAMBANG MINERAL',
    judul: 'SI-RETAM',
    subjudul: 'Pemisahan Magnetik Terpandu Sensor Gamma untuk Memulihkan Monasit dari Tailing Timah Lepas Pantai di Hilir Jig Kapal Isap Produksi',
    kalimatKunci: 'Sistem Rekaveri Tailing Aman Monasit',
    statistik: [
      { nilai: '>3,5 juta m³/bulan', label: 'kapasitas gali satu unit KIP', sumber: 'Bisnis.com, 2025' },
      { nilai: '10–20%', label: 'monasit dalam fraksi mineral berat tailing Bangka', sumber: 'Widana dkk., 2024' },
      { nilai: '1 Bq/g', label: 'tingkat klierens deret Th-232 & U-238', sumber: 'Perka BAPETEN No. 16 Tahun 2012' },
    ],
    petunjukScroll: 'gulir untuk mulai',
  },

  // ===== S2 — Pendahuluan =====
  s2: {

    // S2a · Bagaimana KIP bekerja
    a: {
      judul: 'Bagaimana KIP bekerja',
      alur: [
        'Material dasar laut disedot naik',
        'Dilewatkan ke jig primer & sekunder',
        'Kasiterit tertangkap, dibawa ke penampungan',
        'Sisanya dialirkan keluar sebagai tailing',
        'Tailing dibuang kembali ke laut',
      ],
      labelTitikKeluar: 'di sinilah SI-RETAM menyisip',
      narasi: 'KIP pada dasarnya adalah kapal keruk sekaligus pengolah terapung. Material dari dasar laut disedot naik, lalu dilewatkan ke jig primer dan sekunder yang memanfaatkan perbedaan berat jenis untuk menangkap kasiterit (Widaputra dkk., 2014). Yang tertangkap dibawa ke penampungan, sementara sisanya dialirkan keluar sebagai tailing. Pada titik keluar inilah gagasan SI-RETAM menyisip.',
    },

    // S2b · Isi tailing itu apa — empat kartu mineral (Lampiran A.3 + esai)
    b: {
      judul: 'Isi tailing itu apa',
      narasi: 'Susunan mineral tailing timah Bangka sudah banyak diteliti. Selain kuarsa sebagai bagian terbesar, terdapat monasit, xenotim, zirkon, dan ilmenit (Zglinicki dkk., 2021; Widana dkk., 2024).',
      mineralDominan: 'kuarsa',
      kartu: [
        {
          id: 'monasit',
          nama: 'Monasit',
          densitas: '~5,0',
          kerentananMagnetik: 'paramagnetik',
          konduktivitas: 'non-konduktor',
          radioaktivitas: 'ya (Th/U) — pembawa utama deret luruh Th-232 & U-238, ditambah Ra-226 dan K-40 (Ngadenin dkk., 2023)',
          catatan: 'Fokus utama rancangan: mendominasi fraksi mineral berat tailing Bangka pada kisaran 10–20%, mencapai 19% pada beberapa lokasi pengolahan (Widana dkk., 2024).',
        },
        {
          id: 'zirkon',
          nama: 'Zirkon',
          densitas: '~4,6',
          kerentananMagnetik: 'non-magnetik',
          konduktivitas: 'non-konduktor',
          radioaktivitas: 'tidak (menurut Lampiran A.3 — bukan bagian deret Th/U yang dibahas rancangan ini)',
          catatan: null,
        },
        {
          id: 'ilmenit',
          nama: 'Ilmenit',
          densitas: '~4,7',
          kerentananMagnetik: 'magnetik kuat',
          konduktivitas: 'konduktor',
          radioaktivitas: 'tidak',
          catatan: 'Ikut tertahan bersama monasit pada pemisahan magnetik — sumber keterbatasan "masih bercampur ilmenit" (Lampiran A.6 butir 2).',
        },
        {
          id: 'xenotim',
          nama: 'Xenotim',
          densitas: null,
          kerentananMagnetik: null,
          konduktivitas: null,
          todoDensitasDkk: 'TODO: butuh konfirmasi penulis — densitas, kerentanan magnetik, dan konduktivitas xenotim tidak disebutkan angkanya di ketiga sumber.',
          radioaktivitas: 'ya (Th/U) — bersama monasit, satu-satunya mineral pembawa deret luruh thorium & uranium pada tailing ini, sehingga sama-sama memancarkan gamma khas (esai, Isi dan Pembahasan §Dasar Teknis)',
          catatan: 'LTJ sekunder, sangat minor: 1–2% dari fraksi mineral berat (Zglinicki dkk., 2021; Ngadenin dkk., 2023) — jauh di bawah monasit sehingga bukan fokus rancangan.',
        },
      ],
    },

    // S2c · Dua masalah bertautan
    c: {
      judul: 'Dua masalah bertautan',
      fisik: {
        label: 'Fisik',
        narasi: 'Pembuangan menaikkan kekeruhan, menebalkan endapan di dasar, dan menekan biota bentik di sekitar parit galian.',
      },
      radiologis: {
        label: 'Radiologis',
        narasi: 'Monasit tergolong TENORM (Technologically Enhanced Naturally Occurring Radioactive Material) karena membawa deret luruh Th-232 dan U-238, ditambah Ra-226 dan K-40 (Ngadenin dkk., 2023).',
      },
      kalimatPenyeimbang: 'Keberadaan mineral ini tidak dengan sendirinya membuktikan bahwa tailing yang dilepas melewati ambang yang memerlukan pengawasan radiologis; status tersebut perlu ditentukan melalui pengukuran, dan justru di sanalah celahnya, sebab pemeriksaan semacam itu belum tampak sebagai praktik rutin sebelum material dilepas ke laut.',
    },

    // S2d · Paradoksnya
    d: {
      judul: 'Paradoksnya',
      labelBerputar: ['kontaminan', 'bahan baku'],
      narasi: 'Monasit yang menjadi kontaminan justru bernilai tinggi karena merupakan sumber utama logam tanah jarang (LTJ), termasuk neodimium (Nd), praseodimium (Pr), lantanum (La), dan serium (Ce) — bahan yang dibutuhkan dalam pembuatan magnet permanen, motor kendaraan listrik, dan turbin angin.',
      alurNilai: ['Nd, Pr, La, Ce', 'magnet permanen', 'motor kendaraan listrik & turbin angin'],
      penghambat: 'Indonesia belum memproduksi LTJ pada skala komersial, dan salah satu penghambatnya bukan dari nihilnya kandungan LTJ, melainkan thorium dan uranium yang menempel dan harus ditangani lebih dulu (Andini & Sari, 2020).',
    },

    // S2e · Peta regulasi
    e: {
      judul: 'Peta regulasi',
      linimasa: [
        {
          regulasi: 'Kepmen ESDM No. 296.K/MB.01/MEM.B/2023',
          implikasi: 'Menetapkan Logam Tanah Jarang (LTJ) sebagai mineral kritis — urgensi pemisahan monasit dari tailing makin menguat sejak regulasi ini terbit.',
        },
        {
          regulasi: 'Kepmen ESDM No. 69.K/MB.01/MEM.B/2024',
          implikasi: 'Mengukuhkan LTJ sebagai mineral strategis. Penetapan ini menggeser posisi monasit dari produk sekunder menjadi pilar krusial bagi rantai pasok teknologi transisi energi nasional.',
        },
        {
          regulasi: 'PP No. 96 Tahun 2021',
          implikasi: 'Mewajibkan peningkatan nilai tambah bagi setiap mineral logam — membiarkan monasit terbuang ke dasar laut berlawanan dengan amanat ini.',
        },
        {
          regulasi: 'Perka BAPETEN No. 16 Tahun 2012',
          implikasi: 'Menetapkan tingkat klierens, yaitu batas aktivitas saat suatu bahan boleh dilepas dari pengawasan: 1.000 Bq/kg atau setara 1 Bq/g untuk deret Th-232 dan U-238 pada material padat.',
        },
        {
          regulasi: 'Perka BAPETEN No. 9 Tahun 2009',
          implikasi: 'Mengatur kewajiban intervensi terhadap paparan yang berasal dari TENORM.',
        },
      ],
    },

    // S2f · Celahnya
    f: {
      judul: 'Celahnya',
      kalimatUtama: 'Sejauh penelusuran penulis, belum ada rancangan yang menyatukan pemulihan monasit dan verifikasi radioaktivitas dalam satu alur, sebelum pasir dikembalikan ke dasar laut.',
      narasiLengkap: 'Kajian tentang penimbunan dan penutupan tailing di dasar air umumnya memperlakukan tailing sebagai limbah yang perlu dibuang seaman mungkin (USACE-ERDC, 2005). Meskipun paradigma evaluasi tersebut rasional untuk sebagian besar komoditas, penerapannya pada konteks timah Bangka dinilai kurang memadai. Keterbatasan ini bersumber dari sifat ambivalen monasit, yang tidak hanya membawa risiko bahaya tetapi juga menyimpan potensi nilai strategis.',
    },
  },

  // ===== S3 — Argumen: mengapa jig tidak cukup (signature) =====
  s3: {
    judul: 'Mengapa jig tidak cukup',
    intro: 'Persoalan inti bukan memisahkan monasit dari kuarsa (itu mudah karena kuarsa ringan), melainkan memisahkan monasit dari sesama mineral berat: zirkon, ilmenit, dan kasiterit.',

    // Tabel sifat mineral — Lampiran A.3, dipakai simulator "Empat Sifat"
    tabelSifat: [
      {
        sifat: 'Densitas',
        monasit: '~5,0',
        mineralLain: 'zirkon ~4,6; ilmenit ~4,7; rutil ~4,3 (berimpitan)',
        verdict: 'Tidak — terlalu mirip',
        warnaVerdict: 'merah',
      },
      {
        sifat: 'Kerentanan magnetik',
        monasit: 'paramagnetik',
        mineralLain: 'ilmenit magnetik kuat; kuarsa/zirkon/kasiterit non-magnetik',
        verdict: 'Sebagian — buang non-magnetik, tapi ilmenit ikut',
        warnaVerdict: 'kuning',
      },
      {
        sifat: 'Konduktivitas listrik',
        monasit: 'non-konduktor',
        mineralLain: 'ilmenit/rutil/kasiterit konduktor; zirkon non-konduktor',
        verdict: 'Sebagian — tapi butuh umpan kering',
        warnaVerdict: 'kuning',
      },
      {
        sifat: 'Radioaktivitas',
        monasit: 'ya (Th/U)',
        mineralLain: 'ilmenit, rutil, kuarsa, kasiterit: tidak',
        verdict: 'Ya — satu-satunya yang selektif',
        warnaVerdict: 'hijau',
      },
    ],

    // Simulator "Empat Sifat" — ±400 partikel: monasit, zirkon, ilmenit, kasiterit, kuarsa
    simulator: {
      partikel: ['monasit', 'zirkon', 'ilmenit', 'kasiterit', 'kuarsa'],
      mode: {
        densitas: {
          label: 'Densitas',
          perilaku: 'Partikel berstratifikasi menurut berat jenis. Monasit (~5,0), ilmenit (~4,7), zirkon (~4,6), rutil (~4,3) berakhir pada lapisan yang sama dan tumpang tindih.',
          verdict: 'Tidak — terlalu mirip',
          warnaVerdict: 'merah',
        },
        magnetik: {
          label: 'Kerentanan magnetik',
          perilaku: 'Medan magnet muncul dari kiri; kuarsa/zirkon/kasiterit lolos ke kanan, monasit dan ilmenit sama-sama tertahan.',
          verdict: 'Sebagian — ilmenit ikut',
          warnaVerdict: 'kuning',
        },
        konduktivitas: {
          label: 'Konduktivitas listrik',
          perilaku: 'Pemisahan terjadi, tetapi muncul overlay peringatan: butuh umpan kering — tidak masuk akal untuk bubur basah di atas kapal.',
          verdict: 'Sebagian — tapi butuh umpan kering',
          warnaVerdict: 'kuning',
        },
        radioaktivitas: {
          label: 'Radioaktivitas',
          perilaku: 'Semua partikel meredup; hanya monasit yang berpendar dan memancarkan pulsa gamma menuju detektor kecil di tepi kanvas, yang mencacah naik.',
          verdict: 'Ya — satu-satunya yang selektif',
          warnaVerdict: 'hijau',
        },
      },
      kesimpulan: 'Magnet melakukan pemisahan fisiknya; gamma menjadi penuntun yang menunjuk mana yang benar-benar monasit.',
    },

    // S3b · Mengapa bukan sekadar menyetel ulang jig
    b: {
      judul: 'Mengapa bukan sekadar menyetel ulang jig',
      narasi: [
        'Penelitian terhadap KIP 11 PT Timah menunjukkan bahwa dengan mengubah panjang pukulan, kecepatan aliran air, serta jenis dan ukuran ragging, fraksi monasit dan kasiterit pada konsentrat dapat dinaikkan hingga rata-rata di atas 35 persen, dengan losses pada tailing ditekan sampai kisaran 0 hingga 0,17 persen (Rosita, 2017). Angka ini menarik, tetapi merupakan hasil terbaik dari kondisi eksperimen terkendali pada satu kapal, bukan gambaran operasional rutin, dan penelitian yang sama mencatat bahwa sebelum optimasi monasit justru banyak terbuang. Lagi pula, seperti jig pada umumnya, penyetelan itu tetap bekerja pada densitas, sehingga monasit tetap bercampur dengan mineral berat lain yang densitasnya mirip.',
        'Ada pertimbangan yang lebih mendasar. Jig tidak dapat membedakan kasiterit dari monasit, sehingga keduanya ikut bersama ke konsentrat yang dibawa ke darat. Di darat, PT Timah memang menjalankan sirkuit pemurnian lanjutan yang memisahkan mineral ikutan dari bijih timah, tetapi pemisahan itu tidak sempurna, dan konsentrat umpan peleburan tetap membawa sekitar 30 persen pengotor. Akibatnya, terak hasil peleburan timah dikenal sebagai limbah yang turut mengandung thorium dan uranium (Prasetyo dkk., 2020), dan thorium yang telanjur terikat pada fase silika serta titania di dalam terak sulit dibersihkan. Karena pengolahan timah di Bangka juga tercatat menghasilkan paparan radiasi di atas latar alami (Ishigaki dkk., 2026), memindahkan lebih banyak monasit ke jalur timah bukanlah langkah tanpa biaya.',
        'Dari sini pilihan desainnya menjadi jelas. Menyetel ulang jig agar menangkap lebih banyak monasit justru menambah beban pada sirkuit pemurnian yang sudah kewalahan dan memperberat persoalan terak. Lebih aman mencegah monasit memasuki aliran menuju peleburan sejak awal, dengan menanganinya pada jalur tailing yang memang sudah dibuang, bukan pada jig. Di jalur itu pula pemisahan bisa memakai sifat magnetik dan penanda gamma, dua hal yang tidak tersedia bagi jig.',
      ],
      angkaKunci: {
        konsentratNaik: 'di atas 35% (rata-rata)',
        lossesTailing: '0–0,17%',
        pengotorKonsentratPeleburan: '~30%',
        sumberAngka: 'Rosita, 2017 — kondisi eksperimen terkendali pada satu kapal, bukan operasional rutin',
      },
      duaJalur: [
        { label: 'monasit ke jalur timah', konsekuensi: 'menumpuk beban di terak' },
        { label: 'monasit ke jalur tailing', konsekuensi: 'ditangani terpisah' },
      ],
    },
  },

  // ===== S4 — Solusi: gagasan SI-RETAM =====
  s4: {
    akronim: [
      { suku: 'SI', kata: 'stem' },
      { suku: 'RE', kata: 'kaveri' },
      { suku: 'TA', kata: 'iling Aman' },
      { suku: 'M', kata: 'onasit' },
    ],
    diagramBatas: {
      hulu: { label: 'hulu, di luar sistem', isi: 'Jig milik PT Timah.' },
      siretam: { label: 'SI-RETAM', isi: 'Rangkaian di antara jig dan pengolahan darat: pengkondisi umpan, pemisah magnetik, sensor gamma + PLC, katup pengarah, bunker berperisai.' },
      hilir: { label: 'hilir, di luar sistem', isi: 'Pemisahan akhir monasit dari ilmenit secara elektrostatik dan penarikan logam tanah jarang lewat proses kimia di darat, sejalan dengan pabrik yang disiapkan PT Timah bersama Perminas (Bisnis.com, 2026).' },
    },
    kalimatPenutup: 'Magnet menjadi tangan yang memisah; gamma menjadi mata yang memilih.',
    batasKebaruan: {
      judul: 'Batas kebaruan',
      narasi: 'Konsentrator sentrifugal, pemisah magnetik, spektrometri gamma, dan katup pinch bukan barang baru; semuanya sudah lama dipakai di industri pasir mineral dunia. Kebaruan gagasan ini bukan pada penemuan alat, melainkan pada susunannya, yaitu memasang pemisahan magnetik yang dipandu sensor gamma secara inline di atas KIP, di hilir jig, untuk memulihkan monasit dari tailing timah lepas pantai. Kunci susunan itu bertumpu pada satu kenyataan sederhana: di antara semua mineral berat pada tailing hanya monasit yang radioaktif, sehingga radiasi menjadi penanda yang paling khas untuknya. Susunan semacam ini belum pernah diterapkan untuk konteks Indonesia.',
    },
  },

  // ===== S5 — Komponen: lima alat, satu per satu =====
  // apa/bagaimana/ilmu disalin utuh dari Justifikasi_Prinsip_SI-RETAM.docx Bagian B.
  s5: {
    intro: 'Modul tersusun atas lima komponen inti dengan aliran material satu arah dari jig sampai keluaran.',
    komponen: [
      {
        id: 'c1',
        nomor: 1,
        nama: 'Pengkondisi umpan',
        subjudul: 'Tangki penstabil dan de-aerasi',
        apa: 'Menerima tailing yang keluar berdenyut dari jig, meredam lonjakan aliran, membuang gelembung udara yang terperangkap, menyeragamkan kandungan padatan, lalu mengalirkannya dengan laju dan kekentalan yang stabil.',
        bagaimana: 'Tangki ini berfungsi sebagai penampung penyangga (buffer) dengan keluaran terkontrol; ia bekerja seperti kapasitor hidraulik yang menghaluskan fluktuasi laju alir. Gelembung udara naik dan dibuang karena gaya apung, sebab udara yang terperangkap mengubah densitas semu dan mengganggu baik penangkapan magnetik maupun pembacaan gamma. Sebuah pengukur densitas menjaga persen padatan tetap konstan.',
        ilmu: 'Mekanika fluida — asas kekekalan massa (kontinuitas) untuk aliran mantap, asas Archimedes (gaya apung) untuk de-aerasi, konsep kapasitansi hidraulik dan waktu tinggal untuk meredam lonjakan, serta reologi bubur (ada kecepatan minimum agar padatan tetap melayang dan tidak mengendap). Intinya: gaya magnet pada partikel dan laju cacah gamma sama-sama bergantung pada aliran yang stabil, sehingga menstabilkan umpan sama dengan membuat pengukuran menjadi sahih.',
        widget: {
          jenis: 'slider tunggal — keberdenyutan keluaran jig',
          tampilan: 'Grafik kiri menunjukkan masukan berdenyut, grafik kanan menunjukkan keluaran yang dihaluskan.',
          perilaku: 'Naikkan denyut → keluaran tetap tenang sampai kapasitas penyangga terlampaui. Gelembung naik dan keluar lewat vent.',
          labelIlmu: ['kontinuitas', 'asas Archimedes', 'kapasitansi hidraulik', 'reologi bubur'],
        },
      },
      {
        id: 'c2',
        nomor: 2,
        nama: 'Pemisah magnetik (WHIMS)',
        subjudul: 'Pemisah magnetik basah intensitas tinggi',
        apa: 'Melewatkan bubur melalui daerah bermedan magnet kuat yang diisi matriks baja (misalnya wol baja atau pelat beralur). Partikel magnetik (monasit yang paramagnetik dan ilmenit yang magnetik kuat) tertangkap dan tertahan pada matriks, sementara partikel non-magnetik (kuarsa, zirkon, kasiterit) mengalir lolos. Setelah itu medan dimatikan dan fraksi magnetik dibilas keluar sebagai aliran tersendiri.',
        bagaimana: 'Gaya magnet pada partikel sebanding dengan volume partikel dikali kerentanan magnetiknya dikali kuat medan dikali gradien medan. Matriks baja menciptakan gradien medan lokal yang sangat tajam pada tepi-tepinya, dan gradien inilah yang melipatgandakan gaya; itu sebabnya disebut gradien tinggi. Mineral paramagnetik seperti monasit hanya punya kerentanan kecil, sehingga butuh medan tinggi (1–2 Tesla) agar tertangkap; itu sebabnya disebut intensitas tinggi. Pemisahan terjadi karena keseimbangan gaya: bagi partikel magnetik, gaya magnet mengalahkan gaya seret aliran dan gravitasi; bagi non-magnetik, tidak.',
        ilmu: 'Kemagnetan bahan (paramagnetik vs diamagnetik), persamaan gaya magnet pada partikel, dan keseimbangan gaya (magnet vs seret fluida vs gravitasi). Ini benar-benar berbeda dari jig, yang memakai densitas dan denyut air (stratifikasi berdasarkan kecepatan mengendap), tanpa kemagnetan sama sekali. Batas jujurnya: gaya magnet sebanding dengan diameter pangkat tiga sedangkan gaya seret hanya sebanding dengan diameter, sehingga pada butir sangat halus gaya magnet mengecil lebih cepat daripada seret dan partikel halus lolos — inilah dasar keterbatasan fraksi ultrahalus.',
        widget: {
          jenis: 'dua slider — kuat medan (0–2 T) dan ukuran butir (5–500 µm)',
          tampilan: 'Partikel mengalir melalui matriks baja; yang tertangkap menempel di tepi matriks. Pembaca mono: efisiensi tangkap.',
          perilaku: 'Wajib: pada butir sangat halus efisiensi jatuh — tampilkan pengingat bahwa gaya magnet sebanding pangkat tiga diameter sedangkan gaya seret hanya sebanding diameter. Widget ini menunjukkan keterbatasan sistem sendiri, bukan menyembunyikannya.',
          buktiRelevansi: 'Pada bahan pascapengolahan timah Bangka, pemisahan magnetik menaikkan kadar monasit dari sekitar 19% menjadi 37–46% (Widana dkk., 2024).',
        },
      },
      {
        id: 'c3',
        nomor: 3,
        nama: 'Sensor gamma + PLC',
        subjudul: 'Spektrometri gamma sebagai pengukur kadar',
        apa: 'Detektor kilau yang dipasang di luar pipa mencacah foton gamma dari material yang lewat, memilahnya menurut energi untuk mengenali sidik deret Th/U, mengubah laju cacah menjadi aktivitas, lalu lewat kurva kalibrasi menjadi kadar monasit; PLC membandingkannya dengan ambang dan menggerakkan katup.',
        bagaimana: 'Deret luruh Th-232 dan U-238 memancarkan gamma pada energi khas (misalnya Pb-212 pada 239 keV dan Tl-208 pada 2,61 MeV untuk deret torium) yang berfungsi sebagai sidik jari. Foton gamma menumbuk kristal NaI(Tl) dan memicu kilau cahaya yang sebanding dengan energinya; tabung pengganda foto (PMT) mengubah kilau itu menjadi pulsa listrik dan memperkuatnya melalui efek fotolistrik dan penggandaan elektron; penganalisis salur ganda (MCA) memilah pulsa menurut tingginya, yaitu menurut energi, membentuk spektrum tempat puncak Th/U dibaca dan latar dikurangi. Ketelitian mengikuti statistik Poisson: ketidakpastian relatif kira-kira satu dibagi akar jumlah cacah, sehingga makin banyak cacah makin teliti.',
        ilmu: 'Fisika inti (peluruhan radioaktif dan pancaran gamma), efek fotolistrik dan pendaran (skintilasi), statistik cacah Poisson, dan kalibrasi. Kuncinya: gamma menembus materi (tidak seperti alfa atau beta), sehingga dapat dibaca menembus dinding pipa dan mewakili keseluruhan material, bukan hanya permukaan — ideal untuk sensor inline non-kontak. Dan karena di antara mineral ini hanya monasit yang memancarkan gamma tersebut, pembacaan gamma pada dasarnya adalah pembacaan kadar monasit.',
        widget: {
          jenis: 'spektrum langsung di canvas + slider waktu cacah',
          tampilan: 'Sumbu energi dengan puncak Pb-212 pada 239 keV dan Tl-208 pada 2,61 MeV, latar yang dikurangi.',
          perilaku: 'Ketidakpastian relatif ≈ 1/√N ditampilkan langsung — ketelitian ~5% menuntut orde beberapa ratus cacah; cacah rendah memaksa waktu ukur lebih lama sehingga membatasi laju alir.',
          rantaiFisika: ['foton', 'kristal NaI(Tl)', 'kilau', 'PMT', 'pulsa', 'MCA', 'spektrum', 'kadar monasit'],
        },
      },
      {
        id: 'c4',
        nomor: 4,
        nama: 'Katup pengarah',
        subjudul: 'Katup jepit (pinch valve)',
        apa: 'Pembelok dua arah yang mengarahkan aliran bubur ke salah satu dari dua keluaran berdasarkan sinyal PLC.',
        bagaimana: 'Katup jepit memiliki selongsong karet lentur yang dijepit atau dibuka oleh aktuator pneumatik; menjepit satu cabang memaksa aliran ke cabang lain. Ia dipilih karena bubur bersifat abrasif, sedangkan katup jepit berlubang penuh dan mulus tanpa celah atau dudukan logam yang mudah tergerus atau tersumbat — satu-satunya bagian yang terkena bubur adalah selongsong karet yang bisa diganti. Katup gerbang atau bola akan cepat aus dan macet oleh pasir.',
        ilmu: 'Mekanika aktuasi pneumatik dan deformasi elastis selongsong, serta pertimbangan ketahanan aus terhadap bubur abrasif. Satu hal penting: ada jeda tempuh antara sensor dan katup, sehingga PLC harus menunda perintah persis selama waktu tempuh itu agar katup membelokkan bongkahan aliran yang sama dengan yang tadi diukur. Katup tidak memisahkan apa pun — ia hanya membelokkan seluruh segmen aliran.',
        widget: {
          jenis: 'demo waktu tunda PLC',
          tampilan: 'Segmen bubur bergerak di pipa dari sensor ke katup. Selongsong karet terlihat terjepit oleh aktuator pneumatik.',
          perilaku: 'Pengguna menyetel tunda; jika salah, katup membelokkan segmen yang keliru ("segmen kaya monasit lolos ke laut"); jika benar, segmen yang sama yang tadi diukur yang dibelokkan.',
          catatanWajib: 'Katup tidak memisahkan apa pun — ia hanya membelokkan seluruh segmen aliran.',
        },
      },
      {
        id: 'c5',
        nomor: 5,
        nama: 'Bunker berperisai',
        subjudul: null,
        apa: 'Menyimpan konsentrat kaya monasit (yang sudah ditiriskan) sampai diangkut ke darat.',
        bagaimana: 'Monasit yang terpekatkan adalah pemancar gamma kuat, dan perisai menahan gamma. Peredaman gamma mengikuti hukum eksponensial, yaitu intensitas menurun sebagai fungsi eksponen dari tebal dan koefisien serap bahan; bahan padat bernomor atom tinggi seperti timbal, atau baja dan beton tebal, menyerap lebih banyak per sentimeter. Dengan dinding berperisai, laju dosis di luar bunker ditekan ke tingkat aman.',
        ilmu: 'Peredaman gamma (serapan eksponensial dan koefisien atenuasi), serta asas proteksi radiasi (dosis dikurangi dengan menambah jarak, mengurangi waktu, dan menambah perisai). Ketebalan perisai adalah hasil perhitungan berdasarkan aktivitas nyata, sehingga rancangan menyebut "perisai sesuai kajian keselamatan", bukan memaku tebal timbal tertentu.',
        widget: {
          jenis: 'slider — tebal perisai timbal',
          tampilan: 'Laju dosis di luar dinding turun mengikuti peluruhan eksponensial I = I₀e^(−µx), dibaca pada panel mono.',
          perilaku: 'Menyertakan asas proteksi radiasi: jarak, waktu, perisai.',
          catatanWajib: 'Tebal perisai adalah hasil perhitungan berdasarkan aktivitas nyata — rancangan menyebut "perisai sesuai kajian keselamatan", bukan memaku angka tertentu.',
        },
      },
    ],
    opsional: {
      id: 'hidrosiklon',
      nama: 'Hidrosiklon (desliming)',
      badge: 'opsional, di hulu',
      apa: 'Memisahkan partikel halus dari yang lebih kasar berdasarkan kecepatan mengendap.',
      bagaimana: 'Bubur masuk secara tangensial dengan kecepatan tinggi dan membentuk pusaran; gaya sentrifugal melempar partikel kasar ke dinding lalu turun ke keluaran bawah, sedangkan partikel halus terbawa ke keluaran atas.',
      ilmu: 'Sedimentasi sentrifugal dan hukum Stokes (kecepatan mengendap sebanding dengan kuadrat diameter dan selisih densitas). Tanpa bagian bergerak, alat ini murah dan tahan lama.',
      guna: 'Melindungi matriks magnetik dari lumpur ultrahalus yang memang tidak dapat dipulihkan.',
    },
    keputusanDesain: [
      'Jig / konsentrator gravitasi ditolak sebagai pemisah selektif. Ia hanya bekerja pada densitas, sementara monasit, zirkon, dan ilmenit berdensitas hampir sama sehingga tak terpisah. Selain itu jig sudah beroperasi di hulu; menambah tahap densitas lagi hanya mengulang proses yang sama tanpa selektivitas baru.',
      'Pemisah magnetik basah (WHIMS) dipilih sebagai pemisah fisik utama. Ia bekerja pada kerentanan magnetik, sifat yang berbeda dari densitas, sehingga mampu membuat belahan yang mustahil dibuat jig. Versi basahnya realistis di atas kapal, tidak memakai reagen, dan mekanismenya sederhana.',
      'Elektrostatik dan flotasi ditunda ke darat. Pemisahan elektrostatik menuntut umpan kering pada suhu tinggi sehingga tidak masuk akal dijalankan pada bubur basah di kapal. Flotasi menuntut reagen kimia, pengaturan pH, dan pengelolaan buih yang rumit dan sulit distabilkan di kapal yang bergoyang.',
      'Sensor gamma dipilih sebagai otak (bukan XRF). Gamma unik karena selektif (hanya monasit radioaktif), kuantitatif (aktivitas sebanding dengan kadar monasit), dan non-kontak (menembus dinding pipa dan membaca material secara menyeluruh, bukan hanya permukaan). Alternatif XRF hanya membaca permukaan, peka terhadap kadar air dan matriks.',
      'Ditempatkan di atas KIP, bukan di darat. Alasannya: memverifikasi material sebelum dilepas ke lingkungan, memusatkan material pembawa radionuklida menjadi satu aliran kecil terkendali di sumbernya, dan menjaga monasit keluar dari aliran konsentrat timah sejak awal. Diakui jujur: model pengolahan di darat seperti pabrik amang Malaysia juga sah; ini pilihan desain, bukan yang terbukti paling optimal.',
    ],
  },

  // ===== S6 — Integrasi: satu rakitan di atas dek KIP =====
  s6: {
    referensiSkala: 'Siluet manusia setinggi 1,7 m dan garis panjang lambung, agar terbaca bahwa modul hanya sebagian kecil dari kapal.',
    penandaBernomor: 'Penanda bernomor 1–5 yang bisa diklik; klik memindahkan kamera ke komponen itu, kartu ringkas muncul, dan penanda lain meredup.',
    sorotJalur: {
      tombol: ['seluruh aliran', 'jalur fraksi magnetik → bunker', 'jalur non-magnetik → laut'],
      warna: {
        umpan: '--magnet',
        konsentrat: '--monasit',
        buangan: '--sedimen',
      },
      catatan: 'Pipa yang tidak aktif menjadi abu-abu transparan; pipa aktif menyala dengan partikel yang mengalir di dalamnya.',
    },
    modeXray: 'Material menjadi wireframe/transparan sehingga isi WHIMS dan bunker terlihat.',
    togglePosisiKapal: 'Kamera mundur jauh memperlihatkan seluruh KIP dengan modul disorot di dek — menegaskan ini retrofit, bukan kapal baru.',
  },

  // ===== S7 — Sinema: alat itu bekerja =====
  s7: {
    catatanTeknis: 'Yang diminta adalah "video". Bukan berkas video — sekuens sinematik 3D yang dianimasikan di dalam scene, dengan kontrol pemutar layaknya video (putar/jeda, garis waktu bisa di-scrub, lompat bab, kecepatan 0,5×–2×). Tombol "Rekam ke .webm" tersedia via canvas.captureStream() + MediaRecorder bagi yang benar-benar butuh berkas video.',
    durasiTotal: '±60 detik',
    bab: [
      { waktu: '0:00', judul: 'Keluar dari jig', deskripsi: 'Bubur tailing berdenyut keluar dari pipa jig, masuk ke modul. Kamera mengikuti aliran.' },
      { waktu: '0:07', judul: 'Penstabilan', deskripsi: 'Di dalam pengkondisi: denyut mereda, gelembung naik dan keluar lewat vent, keluaran menjadi rata.' },
      { waktu: '0:15', judul: 'Pemisahan magnetik', deskripsi: 'Potongan melintang WHIMS: medan menyala, partikel magnetik (monasit + ilmenit) menempel pada matriks; kuarsa, zirkon, kasiterit lolos ke kanan.' },
      { waktu: '0:24', judul: 'Pembilasan', deskripsi: 'Medan dimatikan; fraksi magnetik dibilas keluar sebagai aliran tersendiri.' },
      { waktu: '0:31', judul: 'Pembacaan gamma', deskripsi: 'Kamera menempel pada detektor. Cacah naik, spektrum terbentuk, puncak Th teridentifikasi, PLC menyalakan keputusan.' },
      { waktu: '0:39', judul: 'Keputusan katup', deskripsi: 'Selongsong terjepit; segmen kaya monasit dibelokkan ke bunker (warna --monasit), sisanya lurus.' },
      { waktu: '0:46', judul: 'Verifikasi & pelepasan', deskripsi: 'Aliran buangan melewati gerbang gamma, bacaan dibandingkan dengan acuan klierens, lalu dilepas lewat sisi luar kapal — bukan ke bawah.' },
      { waktu: '0:54', judul: 'Penutup', deskripsi: 'Kamera naik menjadi bidikan lebar: modul kecil di atas dek KIP, ringkasan tiga angka muncul.' },
    ],
    kontrolPemutar: ['putar/jeda', 'garis waktu scrub', 'lompat bab', 'kecepatan 0,5×–2×', 'rekam ke .webm'],
    detailMeyakinkan: [
      'Sistem partikel GPU untuk bubur (bukan mesh per butir)',
      'Depth of field ringan pada bidikan dekat',
      'Gerak kamera dengan easing sinematik (tidak linear)',
      'Bunyi opsional (dengung pompa, klik aktuator, detak pencacah) dengan tombol suara mati secara bawaan',
      'Takarir bahasa Indonesia yang sinkron dan bisa disalin sebagai teks',
    ],
  },

  // ===== S8 — Kelayakan, dampak, dan keterbatasan =====
  s8: {
    neraca: {
      modul: {
        pipa: 'Ø200 mm',
        kecepatan: '2,5 m/s',
        debit: '0,08 m³/detik ≈ 280 m³/jam',
        padatan: '180–200 ton padatan/jam pada kandungan padatan ±25%',
      },
      satuKip: '~7.000 ton padatan/jam (orde besaran)',
      labelPeringatan: 'Modul dipasang pada satu aliran cabang dan berperan sebagai unit uji, bukan penanganan seluruh kapal.',
    },
    tigaSudut: [
      {
        sudut: 'Ekonomi',
        label: 'beban → calon aset',
        narasi: 'Gagasan ini mengubah beban menjadi calon aset. Monasit yang selama ini menjadi sumber pencemaran berpindah status menjadi bahan baku LTJ, sejalan dengan dorongan hilirisasi mineral nasional (Bisnis.com, 2026). Neodimium dan praseodimium dalam monasit adalah bahan utama magnet permanen yang permintaannya terus naik, meski kelayakan finansialnya tetap harus dihitung dari biaya alat, biaya operasi, dan nilai konsentrat.',
      },
      {
        sudut: 'Tata kelola',
        label: 'verifikasi melekat pada proses, bukan sampling sesekali',
        narasi: 'Keunggulan sistem terletak pada verifikasi yang melekat pada proses. Karena setiap aliran yang hendak dibuang diukur lebih dulu terhadap tingkat klierens, kepatuhan tidak lagi bergantung pada pengambilan sampel sesekali, tetapi menjadi bagian rutin dari operasi. Pola ini sesuai dengan semangat kewajiban intervensi TENORM yang diatur BAPETEN.',
      },
      {
        sudut: 'Lingkungan',
        label: 'muatan radiologis sisa lebih ringan, besarnya masih perlu dibuktikan',
        narasi: 'Mengangkat monasit membuat sisa yang dikembalikan ke laut lebih ringan muatan radiologisnya, meski besarnya masih perlu dibuktikan.',
      },
    ],
    enamKeterbatasan: [
      {
        judul: 'Fraksi ultrahalus',
        narasi: 'Pada butir sangat halus gaya magnet mengecil lebih cepat daripada gaya seret air, sehingga monasit terhalus lolos dan sebagian sengaja dibuang lewat desliming.',
      },
      {
        judul: 'Masih bercampur ilmenit',
        narasi: 'Monasit murni baru diperoleh setelah pemisahan elektrostatik di darat; modul di kapal menghasilkan konsentrat antara, bukan produk akhir.',
      },
      {
        judul: 'Bacaan gamma peka',
        narasi: 'Peka terhadap kadar air dan densitas, sehingga perlu dinormalkan lewat pengkondisian umpan dan kalibrasi.',
      },
      {
        judul: 'Kadar dan sebaran monasit pada tailing KIP belum terverifikasi untuk umum',
        narasi: 'Sehingga besaran recovery masih terbuka.',
      },
      {
        judul: 'Menambah biaya dan kompleksitas',
        narasi: 'Pada kapal; penempatan di kapal alih-alih mengolah tumpukan di darat adalah pilihan yang menekankan pemeriksaan sebelum pelepasan, bukan sesuatu yang sudah terbukti paling ekonomis.',
      },
      {
        judul: 'Seluruh rancangan masih konseptual',
        narasi: 'Komponennya terbukti secara terpisah, integrasi khusus ini belum diuji di lapangan.',
      },
    ],
    pernyataanKalibrasi: 'Karena monasit hanya pecahan kecil dari tailing yang didominasi kuarsa, aktivitas rata-rata aliran yang dilepas kemungkinan besar memang sudah rendah, dan tidak ada bukti publik bahwa pembuangan tailing KIP selama ini menimbulkan persoalan radiologis. Karena itu, nilai radiologis SI-RETAM bukanlah klaim membersihkan laut dari radioaktivitas, melainkan dua hal yang lebih terukur. Pertama, gerbang memberi verifikasi pada setiap pelepasan sekaligus jaring pengaman terhadap segmen aliran yang sewaktu-waktu terbaca jauh di atas ambang, sesuatu yang tidak akan terpantau bila hanya kekeruhan yang diawasi. Kedua, dan lebih penting, justru fraksi pekat yang diangkatlah yang benar-benar bersifat radiologis, sebab begitu monasit terkonsentrasi ia menjadi TENORM yang panas dan wajib ditangani terkendali, sebagaimana PT Timah pun menyimpan mineral ikutan yang terkumpul alih-alih membuangnya. Dengan mengangkat monasit di jalur tailing yang terpisah, ia tidak ikut mencemari aliran konsentrat timah menuju peleburan.',
  },

  // ===== S9 — Peta jalan menuju penerapan =====
  s9: {
    langkah: [
      'Ukur kadar & ukuran butir monasit pada tailing KIP Bangka',
      'Uji kinerja pemisah magnetik pada rentang butir tersebut',
      'Kalibrasi kurva gamma terhadap kadar monasit',
      'Uji pilot skala kecil di atas kapal',
      'Kajian tekno-ekonomi',
      'Konsultasi dini dengan BAPETEN',
    ],
    kalimatPenutup: 'Bila rangkaian itu ditempuh, penanganan tailing timah berpeluang bergeser dari beban lingkungan menjadi titik awal pasokan bahan baku logam tanah jarang dalam negeri.',
  },

  // ===== S10 — Daftar pustaka & kredit =====
  // Catatan: naskah spesifikasi (Lampiran A.7) menyebut "17 entri", tetapi Daftar Pustaka
  // pada Draf_Esai_SI-RETAM_TANDAI.docx memuat 18 entri berbeda (Perka BAPETEN 9/2009 dan
  // 16/2012 masing-masing satu entri tersendiri). Seluruh 18 disalin apa adanya dari sumber;
  // tidak ada yang ditambah atau dihilangkan supaya cocok dengan angka "17".
  s10: {
    catatanJumlah: 'TODO: butuh konfirmasi penulis — spesifikasi menyebut 17 entri, naskah esai memuat 18. Ditampilkan seluruhnya (18) sesuai sumber.',
    pustaka: [
      { penulis: 'Andini, D. E., & Sari, F. I. P.', tahun: '2020', judul: 'Study of Rare Earth Elements and Heavy Metals in Tin Tailing from Mining Activities on North Bangka Island', sumber: 'Journal of Physics: Conference Series, 1517, 012084', url: 'https://doi.org/10.1088/1742-6596/1517/1/012084' },
      { penulis: 'Awang Kechik, N. A. H., & Ku Ishak, K. E. H.', tahun: '2025', judul: 'Optimizing Monazite Recovery from Tin Tailings: A Comprehensive Review of Physical Techniques and Methodologies', sumber: 'Physicochemical Problems of Mineral Processing, 61(6), 215442', url: 'https://doi.org/10.37190/ppmp/215442' },
      { penulis: 'Bisnis.com', tahun: '2025, 19 Oktober', judul: 'Begini Proses Penambangan Timah di Laut Bangka Barat Gunakan Kapal Isap Produksi', sumber: null, url: 'https://foto.bisnis.com/view/20251019/1921516/' },
      { penulis: 'Bisnis.com', tahun: '2026, 13 April', judul: 'PT Timah Groundbreaking Proyek Logam Tanah Jarang pada 20 Mei 2026', sumber: null, url: 'https://ekonomi.bisnis.com/read/20260413/44/1966331/' },
      { penulis: 'Dieye, M., Thiam, M. M., Geneyton, A., & Gueye, M.', tahun: '2021', judul: 'Monazite Recovery by Magnetic and Gravity Separation of Medium Grade Zircon Concentrate from Senegalese Heavy Mineral Sands Deposit', sumber: 'Journal of Minerals and Materials Characterization and Engineering, 9(6), 590–608', url: 'https://doi.org/10.4236/jmmce.2021.96038' },
      { penulis: 'Ishigaki, Y., Moritake, T., Pradana, H. A., Eunjoo, K., Permana, S., Shimazaki, K., & Hayashi, K.', tahun: '2026', judul: 'Occupational and Environmental Radiation Exposures from Small-Scale Tin Ore Processing: A Case Study from Bangka Island', sumber: 'PLoS ONE, 21(2), e0343118', url: 'https://doi.org/10.1371/journal.pone.0343118' },
      { penulis: 'Ngadenin, N., Sukadana, I. G., Muhammad, A. G., Indrastomo, F. D., Rosianna, I., Ciputra, R. C., Adimedha, T. B., Pratiwi, F., & Rachael, Y.', tahun: '2023', judul: 'Radioactive Mineral Distribution on Tin Placer Deposits of Southeast Asia Tin Belt Granite in Bangka Island', sumber: 'Eksplorium, 44(2), 49–56', url: 'https://doi.org/10.55981/eksplorium.2023.8162' },
      { penulis: 'Peraturan Kepala BAPETEN', tahun: '2009', judul: 'Peraturan Kepala BAPETEN Nomor 9 Tahun 2009 tentang Intervensi terhadap Paparan yang Berasal dari TENORM', sumber: 'Jakarta: BAPETEN', url: null },
      { penulis: 'Peraturan Kepala BAPETEN', tahun: '2012', judul: 'Peraturan Kepala BAPETEN Nomor 16 Tahun 2012 tentang Tingkat Klierens', sumber: 'Jakarta: BAPETEN', url: 'https://jdih.bapeten.go.id/id/dokumen/peraturan/' },
      { penulis: 'Prasetyo, E., Supriyatna, Y. I., Bahfie, F., & Trinopiawan, K.', tahun: '2020', judul: 'Extraction of Thorium from Tin Slag Using Acidic Roasting and Leaching Method', sumber: 'AIP Conference Proceedings, 2232(1), 040008', url: 'https://doi.org/10.1063/5.0002176' },
      { penulis: 'PT Timah', tahun: '2025', judul: 'Penambangan Timah', sumber: null, url: 'https://timah.com/blog/bisnis-kami/penambangan-timah.html' },
      { penulis: 'Robben, C., & Wotruba, H.', tahun: '2019', judul: 'Sensor-Based Ore Sorting Technology in Mining—Past, Present and Future', sumber: 'Minerals, 9(9), 523', url: 'https://doi.org/10.3390/min9090523' },
      { penulis: 'Rosita, A.', tahun: '2017', judul: 'Pengaruh Variabel Proses Jigging terhadap Peningkatan Konsentrasi Mineral Monasit pada Unit Pencucian Bijih Timah di Pulau Bangka, Indonesia', sumber: 'Tesis S2 Teknik Geologi, Universitas Gadjah Mada', url: 'https://etd.repository.ugm.ac.id/penelitian/detail/116591' },
      { penulis: 'USACE-ERDC', tahun: '2005', judul: 'Equipment and Placement Techniques for Subaqueous Capping (TN-DOER-R9)', sumber: 'Vicksburg: U.S. Army Engineer Research and Development Center', url: 'https://clu-in.org/download/contaminantfocus/sediments/placement-capping-doerr9.pdf' },
      { penulis: 'Wang, D., Zhang, X., Liu, Y., Yan, Y., Wang, B., Wu, S., Liu, Q., Cai, X., Wang, R., & Tang, B.', tahun: '2026', judul: 'Study on Radiometric Sorting of Uranium Ore Based on Deconvolution', sumber: 'Minerals, 16(3), 267', url: 'https://doi.org/10.3390/min16030267' },
      { penulis: 'Widana, K. S., Faizah, Y., Pratiwi, F., Sumaryanto, A., & Manawan, M.', tahun: '2024', judul: 'Beneficiation and Characterization of Low-Grade Monazite from Bangka Tin Mining Post Processing', sumber: 'AIP Conference Proceedings, 2967(1), 170006', url: 'https://doi.org/10.1063/5.0192972' },
      { penulis: 'Widaputra, Y., Arief, A. T., & Herlina, W.', tahun: '2014', judul: 'Evaluasi Kinerja Jig pada Kapal Isap Produksi Timah 12, Perairan Laut Tempilang, Bangka Barat, di Unit Laut Bangka PT Timah (Persero) Tbk [Skripsi]', sumber: 'Universitas Sriwijaya', url: 'http://repository.unsri.ac.id/141211/' },
      { penulis: 'Zglinicki, K., dkk.', tahun: '2021', judul: 'Critical Minerals from Post-Processing Tailings: A Case Study from Bangka Island, Indonesia', sumber: 'Minerals, 11(4), 352', url: 'https://doi.org/10.3390/min11040352' },
    ],
    catatanPresentasi: 'Situs ini adalah presentasi konsep untuk PCMC.',
    slotFoto: '#slot-foto-kip',
    pernyataanProsedural: 'Seluruh visual pada situs ini dibuat prosedural (three.js, canvas, SVG) — tidak ada foto, logo, atau aset pihak ketiga yang disisipkan.',
  },

  // ===== Lampiran A.2 — angka latar belakang yang dipakai lintas section =====
  angkaLatarBelakang: {
    kapasitasKip: '>3,5 juta m³/bulan (Bisnis.com, 2025)',
    monasitFraksiBerat: '10–20%, mencapai 19% pada beberapa lokasi pengolahan (Widana dkk., 2024)',
    xenotimFraksiBerat: '1–2% (Zglinicki dkk., 2021; Ngadenin dkk., 2023)',
    peningkatanKadarMagnetik: 'dari sekitar 19% menjadi 37–46% (Widana dkk., 2024)',
    recoverySenegal: '94,8% (Dieye dkk., 2021) — konteks lain, bukan KIP',
    medanMagnetDibutuhkan: '1–2 Tesla (sekitar 1,5 T disebut di esai)',
    tingkatKlierens: '1.000 Bq/kg = 1 Bq/g (Perka BAPETEN No. 16 Tahun 2012)',
    selisihKlierens: 'dua sampai tiga orde besaran',
    kip11SetelahOptimasi: 'fraksi monasit & kasiterit pada konsentrat naik hingga rata-rata di atas 35%, losses pada tailing 0–0,17% (Rosita, 2017) — kondisi eksperimen terkendali, bukan operasional rutin',
    pengotorKonsentratPeleburan: 'sekitar 30%',
    kapasitasModul: 'pipa Ø200 mm, kecepatan 2,5 m/s → 0,08 m³/detik ≈ 280 m³/jam ≈ 180–200 ton padatan/jam pada kandungan padatan ±25%',
    keluaranTailingSatuKip: 'orde ±7.000 ton padatan/jam',
    ketelitianCacah: 'ketidakpastian relatif ≈ 1/√N; ketelitian ±5% menuntut orde beberapa ratus cacah',
    energiGammaPenanda: 'Pb-212 pada 239 keV, Tl-208 pada 2,61 MeV (deret torium)',
  },
};
