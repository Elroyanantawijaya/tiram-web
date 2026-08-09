// data/content.js
// SELURUH teks & angka situs TIRAM. Satu-satunya tempat string isi hidup.
// Sumber: spec/Draf_Esai_TIRAM_TANDAI.docx, spec/Justifikasi_Prinsip_TIRAM.docx,
// spec/PROMPT_Website_TIRAM.md (Lampiran A). Jangan menambah angka atau mengarang
// isi di luar tiga sumber ini — tandai `todo` bila sumber tidak memberi jawaban.
//
// Catatan penamaan: TIRAM bukan akronim. Ia tidak punya kepanjangan, dan tidak
// boleh dieja sebagai singkatan di mana pun.

export const CONTENT = {

  // ===== A.1 Identitas =====
  meta: {
    judulEsai: 'TIRAM: Rangkaian Pengolahan Tailing Timah Lepas Pantai untuk Memulihkan Monasit Berbasis Pemisahan Magnetik Terpandu Sensor Gamma',
    konteks: 'Kepulauan Bangka Belitung, modul retrofit di hilir jig Kapal Isap Produksi (KIP)',
    kompetisi: 'PCMC, Perhimpunan Ahli Pertambangan Indonesia Student Chapter, subtopik Ekstraksi Tambang Mineral',
  },

  // ===== String antarmuka =====
  // Bukan isi esai, tetapi tetap ditaruh di sini supaya tidak ada teks yang
  // ter-hardcode di HTML atau JS lain.
  ui: {
    kursor: {
      putar: 'putar',
      buka: 'buka',
      mainkan: 'mainkan',
    },
    fallbackWebgl: {
      judul: 'Grafik 3D tidak tersedia',
      narasi: 'Peramban ini tidak dapat menampilkan WebGL, sehingga latar tiga dimensi diganti gambar diam. Seluruh isi dan penjelasan di halaman ini tetap lengkap dan dapat dibaca.',
    },
    sitasi: {
      petunjuk: 'Buka entri lengkap di daftar pustaka',
    },
    nav: [
      { id: 's1-hero', label: 'Hero' },
      { id: 's2-pendahuluan', label: 'Pendahuluan' },
      { id: 's3-argumen', label: 'Argumen' },
      { id: 's4-solusi', label: 'Solusi' },
      { id: 's5-komponen', label: 'Komponen' },
      { id: 's6-integrasi', label: 'Integrasi' },
      { id: 's7-sinema', label: 'Sinema' },
      { id: 's8-kelayakan', label: 'Kelayakan' },
      { id: 's9-peta-jalan', label: 'Peta jalan' },
      { id: 's10-referensi', label: 'Daftar pustaka' },
    ],
    navLabel: 'Navigasi bagian',
    // §3.4b: rel pipa punya sambungan bernomor 1–5 yang berdenyut saat komponen
    // terkait sedang aktif. Elemen ini berbeda dari sepuluh titik navigasi
    // section di atasnya.
    relSambungan: {
      label: 'Sambungan komponen',
      lompatKe: 'Lompat ke komponen',
    },
    // Penanda pembuat, menempel di sudut kiri atas sepanjang halaman digulir.
    watermark: 'by Men Love Mining',
    padananTeks: {
      heroScene: 'Latar beranimasi: siluet Kapal Isap Produksi di garis cakrawala senja, dengan laut gelap beriak di bawahnya.',
      panggungKomponen: 'Model tiga dimensi komponen TIRAM yang sedang dibaca, dapat diputar dan diperbesar. Seluruh keterangan komponen tersedia sebagai teks di samping model ini.',
    },
  },

  // ===== S0 — Preloader =====
  s0: {
    label: 'KALIBRASI DETEKTOR · 0-100%',
    wordmark: 'TIRAM',
  },

  // ===== S1 — Hero =====
  s1: {
    eyebrow: 'PCMC · INOVASI TEKNOLOGI · EKSTRAKSI TAMBANG MINERAL',
    judul: 'TIRAM',
    subjudul: 'Rangkaian Pengolahan Tailing Timah Lepas Pantai untuk Memulihkan Monasit Berbasis Pemisahan Magnetik Terpandu Sensor Gamma',
    // sumberId menunjuk entri di s10.pustaka (lihat idPustaka() di js/dom.js)
    statistik: [
      { nilai: '>3,5 juta m³/bulan', label: 'kapasitas gali satu unit KIP', sumber: 'Bisnis.com, 2025', sumberId: 'bisnis-com-2025' },
      { nilai: '10-20%', label: 'monasit dalam fraksi mineral berat tailing Bangka', sumber: 'Widana dkk., 2024', sumberId: 'widana-2024' },
      { nilai: '1 Bq/g', label: 'tingkat klierens deret Th-232 & U-238', sumber: 'Perka BAPETEN No. 16 Tahun 2012', sumberId: 'peraturan-kepala-bapeten-2012' },
    ],
    petunjukScroll: 'gulir untuk mulai',
  },

  // ===== S2 — Pendahuluan =====
  s2: {
    eyebrow: 'Pendahuluan',
    judul: 'Dari mana masalahnya',

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
      labelTitikKeluar: 'di sinilah TIRAM menyisip',
      narasi: 'KIP pada dasarnya adalah kapal keruk sekaligus pengolah terapung. Material dari dasar laut disedot naik, lalu dilewatkan ke jig primer dan sekunder yang memanfaatkan perbedaan berat jenis untuk menangkap kasiterit (Widaputra dkk., 2014). Yang tertangkap dibawa ke penampungan, sementara sisanya dialirkan keluar sebagai tailing. Pada titik keluar inilah gagasan TIRAM menyisip.',
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
          radioaktivitas: 'ya (Th/U), pembawa utama deret luruh Th-232 dan U-238, ditambah Ra-226 dan K-40 (Ngadenin dkk., 2023)',
          catatan: 'Menjadi fokus utama rancangan karena mendominasi fraksi mineral berat tailing Bangka pada kisaran 10-20%, dan mencapai 19% pada beberapa lokasi pengolahan (Widana dkk., 2024).',
        },
        {
          id: 'zirkon',
          nama: 'Zirkon',
          densitas: '~4,6',
          kerentananMagnetik: 'non-magnetik',
          konduktivitas: 'non-konduktor',
          radioaktivitas: 'tidak, menurut Lampiran A.3 ia bukan bagian deret Th/U yang dibahas rancangan ini',
          catatan: null,
        },
        {
          id: 'ilmenit',
          nama: 'Ilmenit',
          densitas: '~4,7',
          kerentananMagnetik: 'magnetik kuat',
          konduktivitas: 'konduktor',
          radioaktivitas: 'tidak',
          catatan: 'Ikut tertahan bersama monasit pada pemisahan magnetik, dan dari sinilah keterbatasan "masih bercampur ilmenit" berasal (Lampiran A.6 butir 2).',
        },
        {
          id: 'xenotim',
          nama: 'Xenotim',
          // Ketiga sumber tidak menyebut angka untuk xenotim. TODO lama di sini
          // sudah dijawab penulis: rentang densitas 4,4-5,1 dan penulis meminta
          // nilai tengahnya saja yang ditampilkan, ditambah paramagnetik dan
          // non-konduktor. Provenance-nya dicatat pada `sumberSifat` supaya tetap
          // dapat dibedakan dari angka yang datang dari ketiga berkas sumber.
          densitas: '~4,75',
          kerentananMagnetik: 'paramagnetik',
          konduktivitas: 'non-konduktor',
          sumberSifat: 'Konfirmasi penulis, nilai tengah rentang 4,4-5,1.',
          radioaktivitas: 'ya (Th/U), bersama monasit ia satu-satunya mineral pembawa deret luruh thorium dan uranium pada tailing ini, sehingga keduanya sama-sama memancarkan gamma khas (esai, Isi dan Pembahasan §Dasar Teknis)',
          catatan: 'LTJ sekunder yang sangat minor, hanya 1-2% dari fraksi mineral berat (Zglinicki dkk., 2021; Ngadenin dkk., 2023). Angka itu jauh di bawah monasit, sehingga xenotim tidak menjadi fokus rancangan.',
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
      kalimatPenyeimbang: 'Keberadaan mineral ini tidak dengan sendirinya membuktikan bahwa tailing yang dilepas melewati ambang yang memerlukan pengawasan radiologis. Status tersebut perlu ditentukan melalui pengukuran, dan justru di sanalah celahnya, sebab pemeriksaan semacam itu belum tampak sebagai praktik rutin sebelum material dilepas ke laut.',
    },

    // S2d · Paradoksnya
    d: {
      judul: 'Paradoksnya',
      labelBerputar: ['kontaminan', 'bahan baku'],
      narasi: 'Monasit yang menjadi kontaminan justru bernilai tinggi karena merupakan sumber utama logam tanah jarang (LTJ), termasuk neodimium (Nd), praseodimium (Pr), lantanum (La), dan serium (Ce). Keempatnya dibutuhkan dalam pembuatan magnet permanen, motor kendaraan listrik, dan turbin angin.',
      alurNilai: ['Nd, Pr, La, Ce', 'magnet permanen', 'motor kendaraan listrik & turbin angin'],
      penghambat: 'Indonesia belum memproduksi LTJ pada skala komersial. Salah satu penghambatnya bukan kandungan LTJ yang nihil, tetapi thorium dan uranium yang menempel dan harus ditangani lebih dulu (Andini & Sari, 2020).',
    },

    // S2e · Peta regulasi
    e: {
      judul: 'Peta regulasi',
      linimasa: [
        {
          regulasi: 'Kepmen ESDM No. 296.K/MB.01/MEM.B/2023',
          implikasi: 'Menetapkan Logam Tanah Jarang (LTJ) sebagai mineral kritis. Sejak regulasi ini terbit, urgensi pemisahan monasit dari tailing makin menguat.',
        },
        {
          regulasi: 'Kepmen ESDM No. 69.K/MB.01/MEM.B/2024',
          implikasi: 'Mengukuhkan LTJ sebagai mineral strategis. Penetapan ini menggeser posisi monasit dari produk sekunder menjadi pilar krusial bagi rantai pasok teknologi transisi energi nasional.',
        },
        {
          regulasi: 'PP No. 96 Tahun 2021',
          implikasi: 'Mewajibkan peningkatan nilai tambah bagi setiap mineral logam. Membiarkan monasit terbuang ke dasar laut berlawanan dengan amanat ini.',
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
    eyebrow: 'Argumen',
    judul: 'Mengapa jig tidak cukup',
    intro: 'Persoalan inti bukan memisahkan monasit dari kuarsa (itu mudah karena kuarsa ringan), melainkan memisahkan monasit dari sesama mineral berat: zirkon, ilmenit, dan kasiterit.',

    // Tabel sifat mineral — Lampiran A.3, dipakai simulator "Empat Sifat"
    tabelSifat: [
      {
        sifat: 'Densitas',
        monasit: '~5,0',
        mineralLain: 'zirkon ~4,6 · ilmenit ~4,7 · rutil ~4,3 (berimpitan)',
        verdict: 'Tidak, terlalu mirip',
        warnaVerdict: 'merah',
      },
      {
        sifat: 'Kerentanan magnetik',
        monasit: 'paramagnetik',
        mineralLain: 'ilmenit magnetik kuat · kuarsa, zirkon, kasiterit non-magnetik',
        verdict: 'Sebagian, non-magnetik terbuang tapi ilmenit ikut',
        warnaVerdict: 'kuning',
      },
      {
        sifat: 'Konduktivitas listrik',
        monasit: 'non-konduktor',
        mineralLain: 'ilmenit, rutil, kasiterit konduktor · zirkon non-konduktor',
        verdict: 'Sebagian, tapi butuh umpan kering',
        warnaVerdict: 'kuning',
      },
      {
        sifat: 'Radioaktivitas',
        monasit: 'ya (Th/U)',
        mineralLain: 'ilmenit, rutil, kuarsa, kasiterit: tidak',
        verdict: 'Ya, satu-satunya yang selektif',
        warnaVerdict: 'hijau',
      },
    ],

    // Simulator "Empat Sifat" — ±400 partikel: monasit, zirkon, ilmenit, kasiterit, kuarsa
    simulator: {
      partikel: ['monasit', 'zirkon', 'ilmenit', 'kasiterit', 'kuarsa'],

      // Bentuk terstruktur dari tabelSifat di atas, supaya simulator membaca data
      // dan bukan mem-parse kalimat. Nilai `null` berarti sumber tidak menyebutkannya —
      // jangan diisi angka karangan.
      mineral: [
        { id: 'monasit', nama: 'Monasit', densitas: '~5,0', densitasNilai: 5.0, magnetik: 'paramagnetik', tertahanMagnet: true, konduktor: false, radioaktif: true },
        { id: 'ilmenit', nama: 'Ilmenit', densitas: '~4,7', densitasNilai: 4.7, magnetik: 'magnetik kuat', tertahanMagnet: true, konduktor: true, radioaktif: false },
        { id: 'zirkon', nama: 'Zirkon', densitas: '~4,6', densitasNilai: 4.6, magnetik: 'non-magnetik', tertahanMagnet: false, konduktor: false, radioaktif: false },
        { id: 'kasiterit', nama: 'Kasiterit', densitas: null, densitasNilai: null, magnetik: 'non-magnetik', tertahanMagnet: false, konduktor: true, radioaktif: false },
        { id: 'kuarsa', nama: 'Kuarsa', densitas: null, densitasNilai: null, magnetik: 'non-magnetik', tertahanMagnet: false, konduktor: null, radioaktif: false },
      ],

      catatanDensitas: 'Angka densitas hanya ditampilkan untuk mineral yang disebut di sumber, yaitu monasit ~5,0, ilmenit ~4,7, zirkon ~4,6, dan rutil ~4,3. Kuarsa ditempatkan pada lapisan ringan mengikuti keterangan "kuarsa ringan" pada dokumen justifikasi. TODO: butuh konfirmasi penulis, sebab densitas kasiterit tidak disebut di ketiga sumber sehingga ditampilkan tanpa angka.',
      catatanKonduktivitas: 'TODO: butuh konfirmasi penulis, sebab konduktivitas kuarsa tidak disebut di ketiga sumber. Pada mode ini kuarsa dibiarkan netral, tidak dibelokkan ke sisi mana pun.',
      catatanProporsi: 'Jumlah partikel tiap jenis diatur agar terbaca di layar, bukan proporsi sebenarnya. Esai menyebut mineral berat hanya sebagian kecil dari tailing yang didominasi kuarsa.',

      // Label antarmuka simulator. Bukan klaim baru — semuanya memparafrase
      // atau memendekkan fakta yang sudah bersumber di atas.
      ui: {
        instruksi: 'Pilih satu sifat fisik untuk melihat bagaimana kelima mineral berpencar.',
        putusan: 'Putusan',
        petunjukSebelumSelesai: 'Coba keempat sifat untuk melihat kesimpulannya.',
        tabelJudul: 'Ringkasan empat sifat',
        tabelKolom: { sifat: 'Sifat', monasit: 'Monasit', mineralLain: 'Mineral lain' },
        padananTeks: 'Simulasi partikel dua dimensi berisi lima jenis mineral. Posisi partikel berubah mengikuti sifat fisik yang dipilih, dan penjelasan tiap sifat tersedia di bawah kanvas.',
        cacah: 'cacah',
        overlayUmpanKering: 'Butuh umpan kering',
        tidakDiketahui: 'Tidak diketahui',
        netral: 'Netral',
      },

      mode: {
        densitas: {
          label: 'Densitas',
          perilaku: 'Partikel berstratifikasi menurut berat jenis. Monasit (~5,0), ilmenit (~4,7), zirkon (~4,6), rutil (~4,3) berakhir pada lapisan yang sama dan tumpang tindih.',
          verdict: 'Tidak, terlalu mirip',
          warnaVerdict: 'merah',
        },
        magnetik: {
          label: 'Kerentanan magnetik',
          perilaku: 'Medan magnet muncul dari kiri. Kuarsa, zirkon, dan kasiterit lolos ke kanan, sedangkan monasit dan ilmenit sama-sama tertahan.',
          verdict: 'Sebagian, ilmenit ikut',
          warnaVerdict: 'kuning',
        },
        konduktivitas: {
          label: 'Konduktivitas listrik',
          perilaku: 'Pemisahan terjadi, tetapi muncul peringatan bahwa cara ini butuh umpan kering, dan itu tidak masuk akal untuk bubur basah di atas kapal.',
          verdict: 'Sebagian, tapi butuh umpan kering',
          warnaVerdict: 'kuning',
        },
        radioaktivitas: {
          label: 'Radioaktivitas',
          perilaku: 'Semua partikel meredup. Hanya monasit yang berpendar dan memancarkan pulsa gamma menuju detektor kecil di tepi kanvas, yang cacahnya terus naik.',
          verdict: 'Ya, satu-satunya yang selektif',
          warnaVerdict: 'hijau',
        },
      },
      kesimpulan: 'Magnet melakukan pemisahan fisiknya, lalu gamma menjadi penuntun yang menunjuk mana yang benar-benar monasit.',
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
        konsentratNaikLabel: 'monasit & kasiterit pada konsentrat',
        lossesTailing: '0 sampai 0,17%',
        lossesTailingLabel: 'losses pada tailing',
        pengotorKonsentratPeleburan: '~30%',
        pengotorKonsentratPeleburanLabel: 'pengotor pada konsentrat umpan peleburan',
        sumberAngka: 'Rosita, 2017. Angka ini berasal dari kondisi eksperimen terkendali pada satu kapal, bukan dari operasional rutin.',
      },
      duaJalur: [
        { label: 'monasit ke jalur timah', konsekuensi: 'menumpuk beban di terak' },
        { label: 'monasit ke jalur tailing', konsekuensi: 'ditangani terpisah' },
      ],
    },
  },

  // ===== S4 — Solusi: gagasan TIRAM =====
  // TIRAM bukan akronim: tidak ada blok pengejaan suku kata di sini, dan
  // namanya tidak boleh diperlakukan sebagai singkatan.
  s4: {
    eyebrow: 'Solusi',
    judul: 'Gagasan TIRAM',
    pembuka: 'TIRAM adalah rangkaian tambahan yang disambungkan ke saluran keluar tailing. Ia bukan kapal baru dan tidak menggantikan jig. Namanya dipinjam dari tiram laut yang menyaring air untuk menahan yang bernilai lalu mengembalikan sisanya dalam keadaan lebih bersih, sekaligus mengubah butiran asing yang semula mengganggu menjadi sesuatu yang berharga, persis peran sistem ini.',
    diagramBatas: {
      hulu: { label: 'hulu, di luar sistem', isi: 'Jig milik PT Timah.' },
      tiram: { label: 'TIRAM', isi: 'Rangkaian di antara jig dan pengolahan darat: pengkondisi umpan, pemisah magnetik, sensor gamma + PLC, katup pengarah, bunker berperisai.' },
      hilir: { label: 'hilir, di luar sistem', isi: 'Pemisahan akhir monasit dari ilmenit secara elektrostatik dan penarikan logam tanah jarang lewat proses kimia di darat, sejalan dengan pabrik yang disiapkan PT Timah bersama Perminas (Bisnis.com, 2026).' },
    },
    kalimatPenutup: 'Magnet menjadi tangan yang memisah, gamma menjadi mata yang memilih.',
    batasKebaruan: {
      judul: 'Batas kebaruan',
      narasi: 'Konsentrator sentrifugal, pemisah magnetik, spektrometri gamma, dan katup pinch bukan barang baru. Semuanya sudah lama dipakai di industri pasir mineral dunia. Kebaruan gagasan ini tidak terletak pada penemuan alat, tetapi pada susunannya, yaitu memasang pemisahan magnetik yang dipandu sensor gamma secara inline di atas KIP, di hilir jig, untuk memulihkan monasit dari tailing timah lepas pantai. Susunan itu bertumpu pada satu kenyataan sederhana. Di antara semua mineral berat pada tailing hanya monasit yang radioaktif, sehingga radiasi menjadi penanda yang paling khas untuknya. Susunan semacam ini belum pernah diterapkan untuk konteks Indonesia.',
    },
  },

  // ===== S5 — Komponen: lima alat, satu per satu =====
  // apa/bagaimana/ilmu disalin utuh dari Justifikasi_Prinsip_TIRAM.docx Bagian B.
  s5: {
    eyebrow: 'Komponen',
    judul: 'Lima alat, satu per satu',
    intro: 'Modul tersusun atas lima komponen inti dengan aliran material satu arah dari jig sampai keluaran.',

    // Tiga blok tetap yang wajib ada di setiap komponen (§5).
    labelBlok: {
      apa: 'Apa yang dilakukan',
      bagaimana: 'Bagaimana caranya',
      ilmu: 'Ilmu yang melandasi',
    },

    // Kendali model 3D per komponen (Lampiran B: "dapat diputar, di-zoom,
    // diurai, dan dipotong"). Putar & zoom lewat gestur OrbitControls;
    // dua sisanya perlu tombol.
    kendaliModel: {
      urai: 'Urai',
      uraiAktif: 'Pasang kembali',
      uraiLabel: 'Uraikan bagian-bagian model',
      xray: 'Tembus pandang',
      xrayAktif: 'Tutup kembali',
      xrayLabel: 'Buat kulit luar tembus pandang supaya bagian dalam alat terlihat',
      anotasi: 'Label bagian',
      anotasiLabel: 'Tampilkan label bagian pada model',
      petunjukGestur: 'Seret untuk memutar, gulir untuk memperbesar. Di layar sentuh, putar dengan dua jari.',
      petunjukDalam: 'Saat tembus pandang menyala, label berpindah ke bagian dalam alat.',
    },
    komponen: [
      {
        id: 'c1',
        nomor: 1,
        nama: 'Pengkondisi umpan',
        subjudul: 'Tangki penstabil dan de-aerasi',
        apa: 'Menerima tailing yang keluar berdenyut dari jig, meredam lonjakan aliran, membuang gelembung udara yang terperangkap, menyeragamkan kandungan padatan, lalu mengalirkannya dengan laju dan kekentalan yang stabil.',
        bagaimana: 'Tangki ini berfungsi sebagai penampung penyangga (buffer) dengan keluaran terkontrol, dan bekerja seperti kapasitor hidraulik yang menghaluskan fluktuasi laju alir. Gelembung udara naik dan dibuang karena gaya apung, sebab udara yang terperangkap mengubah densitas semu dan mengganggu baik penangkapan magnetik maupun pembacaan gamma. Sebuah pengukur densitas menjaga persen padatan tetap konstan.',
        ilmu: 'Landasannya mekanika fluida, yaitu asas kekekalan massa (kontinuitas) untuk aliran mantap, asas Archimedes (gaya apung) untuk de-aerasi, konsep kapasitansi hidraulik dan waktu tinggal untuk meredam lonjakan, serta reologi bubur (ada kecepatan minimum agar padatan tetap melayang dan tidak mengendap). Gaya magnet pada partikel dan laju cacah gamma sama-sama bergantung pada aliran yang stabil, sehingga menstabilkan umpan sama dengan membuat pengukuran menjadi sahih.',
        // Teks label pada model 3D, disalin dari pemanggilan label() di
        // spec/TIRAM_3D.html beserta titik jangkarnya dalam koordinat model.
        anotasi: [
          { teks: 'vent udara', pos: [0.9, 3.5, 0] },
          { teks: 'motor pengaduk', pos: [0, 3.95, 0] },
          { teks: 'masuk (dari jig)', pos: [-1.7, 0.1, 0] },
          { teks: 'keluar', pos: [1.8, 0.1, 0] },
        ],
        // Label bagian dalam, tampil hanya saat mode tembus pandang menyala.
        // Titik jangkarnya mengikuti geometri di js/models/dalaman.js.
        anotasiDalam: [
          { teks: 'muka bubur', pos: [-1.05, 1.82, 0] },
          { teks: 'ruang gelembung', pos: [0, 2.6, 0] },
          { teks: 'baling pengaduk', pos: [0.85, 1.48, 0] },
          { teks: 'sekat penahan pusaran', pos: [0, 1.1, 1.02] },
          { teks: 'pipa celup masuk', pos: [-0.72, 0.05, 0] },
          { teks: 'corong keluar', pos: [0.55, 0.32, 0] },
        ],
        widget: {
          jenis: 'slider tunggal untuk keberdenyutan keluaran jig',
          tampilan: 'Grafik kiri menunjukkan masukan berdenyut, grafik kanan menunjukkan keluaran yang dihaluskan.',
          perilaku: 'Naikkan denyut dan keluaran tetap tenang sampai kapasitas penyangga terlampaui. Gelembung naik dan keluar lewat vent.',
          labelIlmu: ['kontinuitas', 'asas Archimedes', 'kapasitansi hidraulik', 'reologi bubur'],

          // Label antarmuka widget. Seluruhnya diturunkan dari rumusan §S5 di
          // atas, bukan istilah baru.
          ui: {
            slider: 'Keberdenyutan keluaran jig',
            grafikMasuk: 'masukan (berdenyut)',
            grafikKeluar: 'keluaran (dihaluskan)',
            bacaanRiak: 'riak keluaran',
            bacaanTinggi: 'tinggi muka bubur',
            labelVent: 'vent udara',
            status: {
              tenang: 'Penyangga menahan lonjakan',
              terlampaui: 'Kapasitas penyangga terlampaui',
            },
            padananTeks: 'Simulasi pengkondisi umpan: grafik masukan yang berdenyut dari jig di satu sisi, tangki penyangga dengan gelembung yang naik ke vent di tengah, dan grafik keluaran yang sudah dihaluskan di sisi lain.',
          },
        },
      },
      {
        id: 'c2',
        nomor: 2,
        nama: 'Pemisah magnetik (WHIMS)',
        subjudul: 'Pemisah magnetik basah intensitas tinggi',
        apa: 'Melewatkan bubur melalui daerah bermedan magnet kuat yang diisi matriks baja (misalnya wol baja atau pelat beralur). Partikel magnetik (monasit yang paramagnetik dan ilmenit yang magnetik kuat) tertangkap dan tertahan pada matriks, sementara partikel non-magnetik (kuarsa, zirkon, kasiterit) mengalir lolos. Setelah itu medan dimatikan dan fraksi magnetik dibilas keluar sebagai aliran tersendiri.',
        bagaimana: 'Gaya magnet pada partikel sebanding dengan volume partikel dikali kerentanan magnetiknya dikali kuat medan dikali gradien medan. Matriks baja menciptakan gradien medan lokal yang sangat tajam pada tepi-tepinya, dan gradien inilah yang melipatgandakan gaya. Dari situ datang sebutan gradien tinggi. Mineral paramagnetik seperti monasit hanya punya kerentanan kecil, sehingga butuh medan tinggi (1 sampai 2 Tesla) agar tertangkap, dan dari situ pula datang sebutan intensitas tinggi. Pemisahan terjadi karena keseimbangan gaya. Bagi partikel magnetik, gaya magnet mengalahkan gaya seret aliran dan gravitasi, sedangkan bagi partikel non-magnetik tidak.',
        ilmu: 'Kemagnetan bahan (paramagnetik dan diamagnetik), persamaan gaya magnet pada partikel, serta keseimbangan gaya antara magnet, seret fluida, dan gravitasi. Ini benar-benar berbeda dari jig, yang memakai densitas dan denyut air (stratifikasi berdasarkan kecepatan mengendap), tanpa kemagnetan sama sekali. Batasnya perlu dikatakan terus terang. Gaya magnet sebanding dengan diameter pangkat tiga sedangkan gaya seret hanya sebanding dengan diameter, sehingga pada butir sangat halus gaya magnet mengecil lebih cepat daripada seret dan partikel halus lolos. Dari sinilah keterbatasan fraksi ultrahalus berasal.',
        anotasi: [
          { teks: 'umpan (bubur)', pos: [0, 3.6, 0.5] },
          { teks: 'kumparan magnet', pos: [-2.0, 1.4, 0] },
          { teks: 'cincin + matriks baja', pos: [0, 2.35, 1.4] },
          { teks: 'fraksi magnetik', pos: [-0.7, -0.75, 0.4] },
          { teks: 'non-magnetik → laut', pos: [1.1, -0.75, 0.4] },
        ],
        anotasiDalam: [
          { teks: 'rangka besi pengarah fluks', pos: [-1.05, 2.15, -0.1] },
          { teks: 'sepatu kutub', pos: [-0.78, 0.98, 0.3] },
          { teks: 'pelat beralur (matriks baja)', pos: [0.7, 1.4, 0.3] },
          { teks: 'kotak umpan', pos: [0, 2.4, 0.5] },
          { teks: 'header air bilas', pos: [0.85, 1.98, 0.56] },
          { teks: 'talang keluaran', pos: [0.95, 0.62, 0.28] },
        ],
        widget: {
          jenis: 'dua slider, yaitu kuat medan (0 sampai 2 T) dan ukuran butir (5 sampai 500 µm)',
          tampilan: 'Partikel mengalir melalui matriks baja, dan yang tertangkap menempel di tepi matriks. Pembacaan mono menampilkan efisiensi tangkap.',
          perilaku: 'Pada butir sangat halus efisiensi jatuh, dan widget wajib menampilkan pengingat bahwa gaya magnet sebanding pangkat tiga diameter sedangkan gaya seret hanya sebanding diameter. Widget ini menunjukkan keterbatasan sistem sendiri, bukan menyembunyikannya.',
          buktiRelevansi: 'Pada bahan pascapengolahan timah Bangka, pemisahan magnetik menaikkan kadar monasit dari sekitar 19% menjadi 37 sampai 46% (Widana dkk., 2024).',
          ui: {
            sliderMedan: 'Kuat medan',
            sliderButir: 'Ukuran butir',
            bacaanEfisiensi: 'efisiensi tangkap',
            bacaanRasio: 'gaya magnet ÷ gaya seret',
            labelMatriks: 'matriks baja',
            labelLolos: 'non-magnetik → laut',
            labelTertangkap: 'fraksi magnetik',
            status: {
              baik: 'Butir tertangkap pada matriks',
              jatuh: 'Fraksi ultrahalus lolos, gaya magnet kalah oleh seret',
            },
            // Pengingat yang diwajibkan `perilaku` di atas. Ditulis di sini,
            // bukan di kode, supaya penulis bisa mengoreksinya.
            pengingatPangkatTiga: 'Gaya magnet sebanding dengan diameter pangkat tiga, sedangkan gaya seret hanya sebanding dengan diameter. Karena itu pada butir sangat halus gaya magnet mengecil jauh lebih cepat, dan monasit terhalus lolos. Keterbatasan ini memang melekat pada alatnya.',
            padananTeks: 'Simulasi pemisah magnetik. Butiran mengalir melalui matriks baja bermedan magnet, butir magnetik menempel pada tepi matriks, dan sisanya lolos ke kanan. Dua slider mengatur kuat medan dan ukuran butir.',
          },
        },
      },
      {
        id: 'c3',
        nomor: 3,
        nama: 'Sensor gamma + PLC',
        subjudul: 'Spektrometri gamma sebagai pengukur kadar',
        apa: 'Detektor kilau yang dipasang di luar pipa mencacah foton gamma dari material yang lewat, memilahnya menurut energi untuk mengenali sidik deret Th/U, mengubah laju cacah menjadi aktivitas, lalu lewat kurva kalibrasi menjadi kadar monasit. PLC membandingkan hasilnya dengan ambang dan menggerakkan katup.',
        bagaimana: 'Deret luruh Th-232 dan U-238 memancarkan gamma pada energi khas (misalnya Pb-212 pada 239 keV dan Tl-208 pada 2,61 MeV untuk deret torium) yang berfungsi sebagai sidik jari. Foton gamma menumbuk kristal NaI(Tl) dan memicu kilau cahaya yang sebanding dengan energinya. Tabung pengganda foto (PMT) mengubah kilau itu menjadi pulsa listrik dan memperkuatnya melalui efek fotolistrik dan penggandaan elektron. Penganalisis salur ganda (MCA) lalu memilah pulsa menurut tingginya, yaitu menurut energi, membentuk spektrum tempat puncak Th/U dibaca dan latar dikurangi. Ketelitiannya mengikuti statistik Poisson, sebab ketidakpastian relatif kira-kira satu dibagi akar jumlah cacah, sehingga makin banyak cacah makin teliti.',
        ilmu: 'Fisika inti (peluruhan radioaktif dan pancaran gamma), efek fotolistrik dan pendaran (skintilasi), statistik cacah Poisson, dan kalibrasi. Yang membuatnya bekerja adalah daya tembus gamma. Tidak seperti alfa atau beta, gamma dapat dibaca menembus dinding pipa dan mewakili keseluruhan material, bukan hanya permukaan, dan itulah yang membuatnya cocok untuk sensor inline non-kontak. Karena di antara mineral ini hanya monasit yang memancarkan gamma tersebut, pembacaan gamma pada dasarnya adalah pembacaan kadar monasit.',
        anotasi: [
          { teks: 'detektor NaI(Tl) + PMT', pos: [-1.3, 1.95, 0] },
          { teks: 'kabinet MCA / PLC', pos: [1.6, 1.6, 0] },
          { teks: 'fraksi magnetik masuk', pos: [0, 4.1, 0] },
        ],
        anotasiDalam: [
          { teks: 'kolom bubur di dalam pipa', pos: [-0.5, 0.85, 0] },
          { teks: 'kolimator timbal', pos: [-0.62, 1.7, 0] },
          { teks: 'kristal NaI(Tl)', pos: [0.42, 1.42, 0.42] },
          { teks: 'tabung pengganda foto (PMT)', pos: [0.4, 2.18, 0] },
          { teks: 'rangkaian dinode', pos: [0.42, 1.93, 0.3] },
          { teks: 'modul MCA / PLC pada rel DIN', pos: [1.6, 1.48, 0] },
          { teks: 'blok terminal', pos: [1.6, 0.5, 0.35] },
        ],
        widget: {
          jenis: 'spektrum langsung di canvas ditambah slider waktu cacah',
          tampilan: 'Sumbu energi dengan puncak Pb-212 pada 239 keV dan Tl-208 pada 2,61 MeV, latar yang dikurangi.',
          perilaku: 'Ketidakpastian relatif ≈ 1/√N ditampilkan langsung. Ketelitian ~5% menuntut orde beberapa ratus cacah, dan cacah rendah memaksa waktu ukur lebih lama sehingga membatasi laju alir.',
          rantaiFisika: ['foton', 'kristal NaI(Tl)', 'kilau', 'PMT', 'pulsa', 'MCA', 'spektrum', 'kadar monasit'],
          ui: {
            slider: 'Waktu cacah',
            bacaanCacah: 'cacah terkumpul (N)',
            bacaanKetidakpastian: 'ketidakpastian relatif (1/√N)',
            sumbuEnergi: 'energi',
            labelPuncakTh: 'Pb-212 · 239 keV',
            labelPuncakTl: 'Tl-208 · 2,61 MeV',
            labelLatar: 'latar (dikurangi)',
            status: {
              cukup: 'Cacah cukup, puncak Th terbaca jelas',
              kurang: 'Cacah masih sedikit, puncak tenggelam dalam derau',
            },
            // §A.2: ketelitian ±5% menuntut orde beberapa ratus cacah.
            catatanKetelitian: 'Ketelitian ±5% menuntut orde beberapa ratus cacah. Cacah rendah memaksa waktu ukur lebih lama, dan itu membatasi laju alir yang boleh dilewatkan.',
            padananTeks: 'Simulasi spektrometri gamma. Spektrum terbentuk di sumbu energi dengan dua puncak penanda deret torium, yaitu Pb-212 pada 239 keV dan Tl-208 pada 2,61 MeV, di atas latar yang dikurangi. Slider mengatur lama waktu cacah.',
          },
        },
      },
      {
        id: 'c4',
        nomor: 4,
        nama: 'Katup pengarah',
        subjudul: 'Katup jepit (pinch valve)',
        apa: 'Pembelok dua arah yang mengarahkan aliran bubur ke salah satu dari dua keluaran berdasarkan sinyal PLC.',
        bagaimana: 'Katup jepit memiliki selongsong karet lentur yang dijepit atau dibuka oleh aktuator pneumatik, dan menjepit satu cabang memaksa aliran ke cabang lain. Ia dipilih karena bubur bersifat abrasif, sedangkan katup jepit berlubang penuh dan mulus tanpa celah atau dudukan logam yang mudah tergerus atau tersumbat. Satu-satunya bagian yang terkena bubur adalah selongsong karet, dan bagian itu bisa diganti. Katup gerbang atau bola akan cepat aus dan macet oleh pasir.',
        ilmu: 'Mekanika aktuasi pneumatik dan deformasi elastis selongsong, serta pertimbangan ketahanan aus terhadap bubur abrasif. Ada jeda tempuh antara sensor dan katup, sehingga PLC harus menunda perintah persis selama waktu tempuh itu agar katup membelokkan bongkahan aliran yang sama dengan yang tadi diukur. Katup tidak memisahkan apa pun, ia hanya membelokkan seluruh segmen aliran.',
        anotasi: [
          { teks: 'aktuator pneumatik', pos: [0, 1.65, 0] },
          { teks: 'selongsong karet', pos: [-0.2, -0.95, 0] },
          { teks: 'ke bunker', pos: [1.85, 0.95, 0] },
          { teks: 'ke laut', pos: [1.85, -0.95, 0] },
          { teks: 'masuk', pos: [-1.8, 0, 0] },
        ],
        anotasiDalam: [
          { teks: 'selongsong karet', pos: [0, -0.48, 0] },
          { teks: 'batang penjepit', pos: [0, 0.34, 0.42] },
          { teks: 'bubur mengalir', pos: [-1.0, 0.24, 0] },
          { teks: 'piston', pos: [-0.4, 0.86, 0] },
          { teks: 'pegas balik', pos: [0.36, 0.7, 0] },
        ],
        widget: {
          jenis: 'demo waktu tunda PLC',
          tampilan: 'Segmen bubur bergerak di pipa dari sensor ke katup. Selongsong karet terlihat terjepit oleh aktuator pneumatik.',
          perilaku: 'Pengguna menyetel tunda. Bila setelannya salah, katup membelokkan segmen yang keliru dan segmen kaya monasit lolos ke laut. Bila benar, segmen yang sama dengan yang tadi diukur itulah yang dibelokkan.',
          catatanWajib: 'Katup tidak memisahkan apa pun, ia hanya membelokkan seluruh segmen aliran.',
          ui: {
            slider: 'Tunda perintah PLC',
            tundaBenar: 'waktu tempuh sensor → katup',
            bacaanTunda: 'tunda disetel',
            bacaanSelisih: 'selisih dari waktu tempuh',
            bacaanTepat: 'segmen kaya monasit tertangkap',
            // Ditampilkan selama belum ada satu pun segmen kaya yang lewat.
            nilaiKosong: '· · ·',
            labelSensor: 'sensor gamma',
            labelKatup: 'katup jepit',
            labelBunker: 'ke bunker',
            labelLaut: 'ke laut',
            status: {
              tepat: 'Segmen yang diukur itu juga yang dibelokkan',
              terlaluCepat: 'Tunda terlalu pendek, katup membelok sebelum segmennya tiba',
              terlaluLambat: 'Tunda terlalu panjang, segmen kaya monasit sudah lewat dan lolos ke laut',
            },
            padananTeks: 'Simulasi tunda PLC. Segmen bubur bergerak di sepanjang pipa dari sensor gamma menuju katup jepit. Slider mengatur berapa lama PLC menunda perintah, dan bila tundanya tidak sama dengan waktu tempuh, katup membelokkan segmen yang keliru.',
          },
        },
      },
      {
        id: 'c5',
        nomor: 5,
        nama: 'Bunker berperisai',
        subjudul: null,
        apa: 'Menyimpan konsentrat kaya monasit (yang sudah ditiriskan) sampai diangkut ke darat.',
        bagaimana: 'Monasit yang terpekatkan adalah pemancar gamma kuat, dan perisai menahan gamma. Peredaman gamma mengikuti hukum eksponensial, yaitu intensitas menurun sebagai fungsi eksponen dari tebal dan koefisien serap bahan. Bahan padat bernomor atom tinggi seperti timbal, atau baja dan beton tebal, menyerap lebih banyak per sentimeter. Dengan dinding berperisai, laju dosis di luar bunker ditekan ke tingkat aman.',
        ilmu: 'Peredaman gamma (serapan eksponensial dan koefisien atenuasi), serta asas proteksi radiasi (dosis dikurangi dengan menambah jarak, mengurangi waktu, dan menambah perisai). Ketebalan perisai adalah hasil perhitungan berdasarkan aktivitas nyata, sehingga rancangan menyebut "perisai sesuai kajian keselamatan" dan tidak memaku tebal timbal tertentu.',
        anotasi: [
          { teks: 'masuk: konsentrat kaya monasit', pos: [0, 2.35, 0] },
          { teks: 'dinding berperisai (timbal)', pos: [-1.7, 0.96, 0] },
        ],
        anotasiDalam: [
          { teks: 'pelapis baja', pos: [-0.9, 1.05, 0] },
          { teks: 'timbunan konsentrat', pos: [0.62, 0.62, 0] },
          { teks: 'penyebar isian', pos: [-0.45, 1.3, 0] },
          { teks: 'sensor tinggi isian', pos: [0.62, 1.62, 0] },
        ],
        widget: {
          jenis: 'slider untuk tebal perisai timbal',
          tampilan: 'Laju dosis di luar dinding turun mengikuti peluruhan eksponensial I = I₀e^(−µx), dibaca pada panel mono.',
          perilaku: 'Menyertakan tiga asas proteksi radiasi, yaitu jarak, waktu, dan perisai.',
          catatanWajib: 'Tebal perisai adalah hasil perhitungan berdasarkan aktivitas nyata. Rancangan menyebut "perisai sesuai kajian keselamatan" dan tidak memaku angka tertentu.',
          ui: {
            slider: 'Tebal perisai timbal',
            bacaanTembus: 'gamma yang lolos (I/I₀)',
            bacaanLapisNilai: 'setara berapa lapis nilai paruh',
            rumus: 'I = I₀ · e^(−µx)',
            labelSumber: 'konsentrat kaya monasit',
            labelDinding: 'dinding berperisai',
            labelLuar: 'di luar bunker',
            // Tiga asas proteksi radiasi yang disebut blok "ilmu" komponen ini.
            asasProteksi: ['jarak', 'waktu', 'perisai'],
            asasJudul: 'Asas proteksi radiasi',
            status: {
              tebal: 'Peredaman kuat, laju dosis di luar dinding ditekan',
              tipis: 'Perisai masih tipis, sebagian besar gamma menembus',
            },
            padananTeks: 'Simulasi perisai bunker: berkas gamma dari konsentrat kaya monasit menembus dinding timbal, dan intensitas yang lolos meluruh secara eksponensial mengikuti tebal perisai. Slider mengatur tebal dinding.',
          },
        },
      },
    ],
    opsional: {
      id: 'hidrosiklon',
      nama: 'Hidrosiklon (desliming)',
      badge: 'opsional, di hulu',
      apa: 'Memisahkan partikel halus dari yang lebih kasar berdasarkan kecepatan mengendap.',
      bagaimana: 'Bubur masuk secara tangensial dengan kecepatan tinggi dan membentuk pusaran. Gaya sentrifugal melempar partikel kasar ke dinding lalu turun ke keluaran bawah, sedangkan partikel halus terbawa ke keluaran atas.',
      ilmu: 'Sedimentasi sentrifugal dan hukum Stokes (kecepatan mengendap sebanding dengan kuadrat diameter dan selisih densitas). Tanpa bagian bergerak, alat ini murah dan tahan lama.',
      guna: 'Melindungi matriks magnetik dari lumpur ultrahalus yang memang tidak dapat dipulihkan.',
    },
    keputusanDesain: [
      'Jig dan konsentrator gravitasi ditolak sebagai pemisah selektif. Keduanya hanya bekerja pada densitas, sementara monasit, zirkon, dan ilmenit berdensitas hampir sama sehingga tak terpisah. Jig pun sudah beroperasi di hulu, dan menambah tahap densitas lagi hanya mengulang proses yang sama tanpa selektivitas baru.',
      'Pemisah magnetik basah (WHIMS) dipilih sebagai pemisah fisik utama. Ia bekerja pada kerentanan magnetik, sifat yang berbeda dari densitas, sehingga mampu membuat belahan yang mustahil dibuat jig. Versi basahnya realistis di atas kapal, tidak memakai reagen, dan mekanismenya sederhana.',
      'Elektrostatik dan flotasi ditunda ke darat. Pemisahan elektrostatik menuntut umpan kering pada suhu tinggi sehingga tidak masuk akal dijalankan pada bubur basah di kapal. Flotasi menuntut reagen kimia, pengaturan pH, dan pengelolaan buih yang rumit dan sulit distabilkan di kapal yang bergoyang.',
      'Sensor gamma dipilih sebagai otak, bukan XRF. Gamma unik karena selektif (hanya monasit yang radioaktif), kuantitatif (aktivitas sebanding dengan kadar monasit), dan non-kontak (menembus dinding pipa dan membaca material secara menyeluruh, bukan hanya permukaan). Alternatif XRF hanya membaca permukaan dan peka terhadap kadar air serta matriks.',
      'Ditempatkan di atas KIP, bukan di darat. Alasannya ada tiga, yaitu memverifikasi material sebelum dilepas ke lingkungan, memusatkan material pembawa radionuklida menjadi satu aliran kecil terkendali di sumbernya, dan menjaga monasit keluar dari aliran konsentrat timah sejak awal. Perlu diakui terus terang bahwa model pengolahan di darat seperti pabrik amang Malaysia juga sah. Ini pilihan desain, bukan pilihan yang sudah terbukti paling optimal.',
    ],
  },

  // ===== S6 — Integrasi: satu rakitan di atas dek KIP =====
  s6: {
    eyebrow: 'Integrasi',
    judul: 'Satu rakitan di atas dek KIP',

    // Label antarmuka. "Dek KIP …" disalin dari label() di spec/TIRAM_3D.html.
    // Tidak ada satu pun angka dimensi kapal atau modul yang ditampilkan di
    // sini: ukuran itu perkiraan rekayasa untuk proporsi geometri, bukan data
    // dari esai. Hanya tinggi siluet manusia yang berlabel, dan angka itu
    // memang disebut §S6.
    labelSkala: '1,7 m',
    labelDek: 'Dek KIP, alat hanya sebagian kecil dari kapal',
    tombol: {
      xray: 'Mode X-ray',
      dekat: 'Bidikan dekat',
      lebar: 'Posisi di kapal',
    },
    padananTeks: 'Model tiga dimensi rakitan TIRAM di atas dek Kapal Isap Produksi, dapat diputar dan diperbesar. Lima penanda bernomor menandai tiap komponen, dan tiga tombol menyorot jalur aliran yang berbeda. Seluruh keterangan komponen tersedia sebagai teks di bagian sebelumnya.',

    referensiSkala: 'Siluet manusia setinggi 1,7 m dan garis panjang lambung, agar terbaca bahwa modul hanya sebagian kecil dari kapal.',
    penandaBernomor: 'Penanda bernomor 1 sampai 5 yang bisa diklik. Klik memindahkan kamera ke komponen itu, kartu ringkas muncul, dan penanda lain meredup.',
    sorotJalur: {
      tombol: ['seluruh aliran', 'jalur fraksi magnetik → bunker', 'jalur non-magnetik → laut'],
      warna: {
        umpan: '--magnet',
        konsentrat: '--monasit',
        buangan: '--sedimen',
      },
      catatan: 'Pipa yang tidak aktif menjadi abu-abu transparan, sedangkan pipa aktif menyala dengan partikel yang mengalir di dalamnya.',
    },
    modeXray: 'Material menjadi wireframe/transparan sehingga isi WHIMS dan bunker terlihat.',
    togglePosisiKapal: 'Kamera mundur jauh memperlihatkan seluruh KIP dengan modul disorot di dek, dan dari situ terbaca bahwa ini retrofit, bukan kapal baru.',
  },

  // ===== S7 — Sinema: alat itu bekerja =====
  s7: {
    eyebrow: 'Sinema',
    judul: 'Alat itu bekerja',

    // Label antarmuka pemutar. Bukan isi esai, tapi tetap tinggal di sini
    // supaya tidak ada teks yang ter-hardcode di luar content.js.
    ui: {
      putar: 'Putar',
      jeda: 'Jeda',
      garisWaktu: 'Garis waktu sinema',
      lompatBab: 'Lompat ke bab',
      kecepatan: 'Kecepatan putar',
      rekam: 'Rekam ke .webm',
      merekam: 'Merekam…',
      unduhRekaman: 'Unduh rekaman',
      transkripJudul: 'Transkrip takarir',
      ringkasan: 'Ringkasan',
      padananTeks: 'Sekuens sinematik tiga dimensi berdurasi sekitar satu menit yang menunjukkan modul TIRAM bekerja dalam delapan babak, dari bubur tailing keluar dari pipa jig sampai aliran buangan diverifikasi dan dilepas ke laut lewat sisi kapal. Transkrip lengkap kedelapan babak tersedia sebagai teks dan dapat disalin di bawah pemutar.',
    },

    catatanTeknis: 'Yang diminta adalah "video", dan yang dibuat bukan berkas video melainkan sekuens sinematik 3D yang dianimasikan di dalam scene, dengan kontrol pemutar layaknya video (putar dan jeda, garis waktu bisa di-scrub, lompat bab, kecepatan 0,5 sampai 2 kali). Tombol "Rekam ke .webm" tersedia lewat canvas.captureStream() dan MediaRecorder bagi yang benar-benar butuh berkas video.',
    durasiTotal: '±60 detik',
    bab: [
      { waktu: '0:00', judul: 'Keluar dari jig', deskripsi: 'Bubur tailing berdenyut keluar dari pipa jig, masuk ke modul. Kamera mengikuti aliran.' },
      { waktu: '0:07', judul: 'Penstabilan', deskripsi: 'Dinding pengkondisi menjadi tembus pandang. Di dalamnya baling pengaduk berputar, gelembung naik dari muka bubur dan keluar lewat vent, denyut mereda, dan keluaran menjadi rata.' },
      { waktu: '0:15', judul: 'Pemisahan magnetik', deskripsi: 'Rumah WHIMS dibuka. Medan menyala, butir magnetik berupa monasit dan ilmenit tertahan di pelat matriks, sedangkan kuarsa, zirkon, dan kasiterit terus turun melewatinya.' },
      { waktu: '0:24', judul: 'Pembilasan', deskripsi: 'Medan dimatikan. Butir yang tadi menempel terlepas dari matriks dan meluncur keluar sebagai aliran tersendiri.' },
      { waktu: '0:31', judul: 'Pembacaan gamma', deskripsi: 'Pipa menjadi tembus pandang dan kolom bubur di dalamnya terlihat. Pulsa gamma melesat dari kolom itu ke kristal NaI(Tl) yang berpendar, cacah naik, puncak Th teridentifikasi, lalu PLC menyalakan keputusan.' },
      { waktu: '0:39', judul: 'Keputusan katup', deskripsi: 'Badan katup dibuka. Piston turun, batang penjepit merapat, selongsong terjepit, dan segmen kaya monasit dibelokkan ke bunker sementara sisanya lurus.' },
      { waktu: '0:46', judul: 'Verifikasi dan pelepasan', deskripsi: 'Aliran buangan melewati gerbang gamma, bacaan dibandingkan dengan acuan klierens, lalu dilepas lewat sisi luar kapal, bukan ke bawah.' },
      { waktu: '0:54', judul: 'Penutup', deskripsi: 'Kamera naik menjadi bidikan lebar: modul kecil di atas dek KIP, ringkasan tiga angka muncul.' },
    ],
    kontrolPemutar: ['putar dan jeda', 'garis waktu scrub', 'lompat bab', 'kecepatan 0,5 sampai 2 kali', 'rekam ke .webm'],
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
    eyebrow: 'Kelayakan',
    judul: 'Kelayakan, dampak, dan keterbatasan',
    neraca: {
      judul: 'Neraca laju alir',
      modul: {
        pipa: 'Ø200 mm',
        kecepatan: '2,5 m/s',
        debit: '0,08 m³/detik ≈ 280 m³/jam',
        padatan: '180-200 ton padatan/jam pada kandungan padatan ±25%',
      },
      modulLabel: {
        pipa: 'Diameter pipa',
        kecepatan: 'Kecepatan aliran',
        debit: 'Debit bubur',
        padatan: 'Setara padatan',
      },
      satuKip: '~7.000 ton padatan/jam (orde besaran)',
      labelPeringatan: 'Modul dipasang pada satu aliran cabang dan berperan sebagai unit uji, bukan penanganan seluruh kapal.',
      // Nilai numerik untuk menggambar kedua batang pada satu skala yang sama.
      // Sumbernya persis string di atas (Lampiran A.2); dipisah ke sini supaya
      // tidak ada angka yang di-parse dari teks di dalam kode.
      skala: {
        modulMin: 180,
        modulMaks: 200,
        kip: 7000,
        satuan: 'ton padatan/jam',
      },
      batangLabel: {
        modul: 'Satu modul TIRAM',
        kip: 'Keluaran tailing satu KIP',
      },
      // Batang modul memang nyaris tak terlihat di samping batang KIP. Itu
      // bukan cacat gambar melainkan isi pernyataannya, jadi dikatakan terus
      // terang alih-alih dibesarkan supaya "terbaca".
      catatanSkala: 'Kedua batang digambar pada satu skala yang sama. Batang modul memang setipis itu.',
      padananTeks: 'Diagram batang perbandingan pada satu skala yang sama. Keluaran tailing satu Kapal Isap Produksi berorde ±7.000 ton padatan per jam dan digambar sebagai batang penuh, sedangkan satu modul TIRAM menangani 180 sampai 200 ton padatan per jam dan digambar sebagai batang yang jauh lebih pendek di skala yang sama. Modul dipasang pada satu aliran cabang sebagai unit uji, bukan untuk menangani seluruh keluaran kapal.',
    },
    tigaSudutJudul: 'Tiga sudut manfaat',
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
    enamKeterbatasanJudul: 'Enam keterbatasan',
    // CLAUDE.md butir 5: keenamnya wajib tampil dengan bobot visual penuh —
    // tidak dikecilkan, tidak dipindah ke footer. Kalimat pengantar ini ada
    // supaya bagian ini terbaca sebagai pernyataan sadar, bukan disclaimer.
    enamKeterbatasanPengantar: 'Keenam hal berikut belum terselesaikan oleh rancangan ini dan ditulis dengan bobot yang sama seperti bagian manfaat di atas.',
    enamKeterbatasan: [
      {
        judul: 'Fraksi ultrahalus',
        narasi: 'Pada butir sangat halus gaya magnet mengecil lebih cepat daripada gaya seret air, sehingga monasit terhalus lolos dan sebagian sengaja dibuang lewat desliming.',
      },
      {
        judul: 'Masih bercampur ilmenit',
        narasi: 'Monasit murni baru diperoleh setelah pemisahan elektrostatik di darat. Modul di kapal menghasilkan konsentrat antara, bukan produk akhir.',
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
        narasi: 'Penempatan di kapal alih-alih mengolah tumpukan di darat adalah pilihan yang menekankan pemeriksaan sebelum pelepasan, bukan sesuatu yang sudah terbukti paling ekonomis.',
      },
      {
        judul: 'Seluruh rancangan masih konseptual',
        narasi: 'Komponennya terbukti secara terpisah, integrasi khusus ini belum diuji di lapangan.',
      },
    ],
    pernyataanKalibrasiJudul: 'Pernyataan kalibrasi klaim',
    pernyataanKalibrasi: 'Karena monasit hanya pecahan kecil dari tailing yang didominasi kuarsa, aktivitas rata-rata aliran yang dilepas kemungkinan besar memang sudah rendah, dan tidak ada bukti publik bahwa pembuangan tailing KIP selama ini menimbulkan persoalan radiologis. Nilai radiologis TIRAM karena itu tidak boleh dibaca sebagai klaim membersihkan laut dari radioaktivitas. Yang bisa dipertanggungjawabkan ada dua dan keduanya lebih terukur. Gerbang gamma memberi verifikasi pada setiap pelepasan sekaligus jaring pengaman terhadap segmen aliran yang sewaktu-waktu terbaca jauh di atas ambang, sesuatu yang tidak akan terpantau bila hanya kekeruhan yang diawasi. Yang lebih penting, justru fraksi pekat yang diangkatlah yang benar-benar bersifat radiologis, sebab begitu monasit terkonsentrasi ia menjadi TENORM yang panas dan wajib ditangani terkendali, sebagaimana PT Timah pun menyimpan mineral ikutan yang terkumpul alih-alih membuangnya. Dengan mengangkat monasit di jalur tailing yang terpisah, monasit itu tidak ikut mencemari aliran konsentrat timah menuju peleburan.',
  },

  // ===== S9 — Peta jalan menuju penerapan =====
  s9: {
    eyebrow: 'Peta jalan',
    judul: 'Peta jalan menuju penerapan',
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
  // pada Draf_Esai_TIRAM_TANDAI.docx memuat 18 entri berbeda (Perka BAPETEN 9/2009 dan
  // 16/2012 masing-masing satu entri tersendiri). Seluruh 18 disalin apa adanya dari sumber;
  // tidak ada yang ditambah atau dihilangkan supaya cocok dengan angka "17".
  s10: {
    eyebrow: 'Daftar pustaka',
    judul: 'Daftar pustaka & kredit',
    ui: {
      cariPlaceholder: 'Cari penulis, tahun, atau judul…',
      cariLabel: 'Cari daftar pustaka',
      hasilKosong: 'Tidak ada entri yang cocok.',
      bukaTab: 'buka di tab baru',
      kreditJudul: 'Tentang situs ini',
    },
    catatanJumlah: 'TODO: butuh konfirmasi penulis. Spesifikasi menyebut 17 entri, sedangkan naskah esai memuat 18. Seluruh 18 entri ditampilkan sesuai sumber.',
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
    pernyataanProsedural: 'Seluruh visual pada situs ini dibuat prosedural dengan three.js, canvas, dan SVG. Tidak ada foto, logo, atau aset pihak ketiga yang disisipkan.',
  },

  // ===== Lampiran A.2 — angka latar belakang yang dipakai lintas section =====
  angkaLatarBelakang: {
    kapasitasKip: '>3,5 juta m³/bulan (Bisnis.com, 2025)',
    monasitFraksiBerat: '10-20%, mencapai 19% pada beberapa lokasi pengolahan (Widana dkk., 2024)',
    xenotimFraksiBerat: '1-2% (Zglinicki dkk., 2021; Ngadenin dkk., 2023)',
    peningkatanKadarMagnetik: 'dari sekitar 19% menjadi 37-46% (Widana dkk., 2024)',
    recoverySenegal: '94,8% (Dieye dkk., 2021), berasal dari konteks lain dan bukan dari KIP',
    medanMagnetDibutuhkan: '1-2 Tesla (sekitar 1,5 T disebut di esai)',
    tingkatKlierens: '1.000 Bq/kg = 1 Bq/g (Perka BAPETEN No. 16 Tahun 2012)',
    selisihKlierens: 'dua sampai tiga orde besaran',
    kip11SetelahOptimasi: 'fraksi monasit dan kasiterit pada konsentrat naik hingga rata-rata di atas 35%, losses pada tailing 0 sampai 0,17% (Rosita, 2017), pada kondisi eksperimen terkendali dan bukan operasional rutin',
    pengotorKonsentratPeleburan: 'sekitar 30%',
    kapasitasModul: 'pipa Ø200 mm, kecepatan 2,5 m/s, menghasilkan 0,08 m³/detik ≈ 280 m³/jam ≈ 180-200 ton padatan/jam pada kandungan padatan ±25%',
    keluaranTailingSatuKip: 'orde ±7.000 ton padatan/jam',
    ketelitianCacah: 'ketidakpastian relatif ≈ 1/√N, sehingga ketelitian ±5% menuntut orde beberapa ratus cacah',
    energiGammaPenanda: 'Pb-212 pada 239 keV, Tl-208 pada 2,61 MeV (deret torium)',
  },
};
