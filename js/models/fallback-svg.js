// js/models/fallback-svg.js — padanan gambar statis untuk scene 3D S5, S6, S7.
//
// CLAUDE.md mensyaratkan setiap scene 3D punya padanan gambar/SVG statis DAN
// pesan singkat — bukan pesan teks saja. Sebelumnya hanya hero (S1) yang punya
// padanannya; ketiga scene lain cuma menampilkan pesan, sehingga pembaca tanpa
// WebGL kehilangan gambaran bentuk alatnya sama sekali.
//
// Semuanya digambar tangan dengan primitif SVG (§CLAUDE.md: tanpa aset pihak
// ketiga), memakai warna token yang sama dengan versi 3D-nya supaya terbaca
// sebagai alat yang sama, bukan ilustrasi lain.

const ABISAL = '#071016';
const LAMBUNG = '#0F1D26';
const GARIS = '#1E3340';
const BAJA = '#C9D6DD';
const KABUT = '#7C93A1';
const GAMMA = '#E9B93A';
const MAGNET = '#3FB8C4';
const MONASIT = '#8C4A2F';

// xmlns tidak wajib saat markup ini disisipkan lewat innerHTML ke dokumen HTML
// (parser HTML memberi namespace SVG sendiri), tetapi wajib begitu markup yang
// sama dipakai mandiri — mis. sebagai data URL. Disertakan supaya keduanya sah.
const bungkus = (viewBox, isi) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet"
       role="img" aria-hidden="true" focusable="false" class="fallback-svg">
    ${isi}
  </svg>`;

/**
 * S5 — satu komponen tunggal di atas panggung. Digambar sebagai pengkondisi
 * umpan (komponen pertama yang tampil) lengkap dengan motor, vent, dan dua
 * sambungan pipa, mengikuti susunan bangunPengkondisi().
 */
export function fallbackKomponenSvg() {
  return bungkus('0 0 320 300', `
    <rect width="320" height="300" fill="${LAMBUNG}"/>
    <ellipse cx="160" cy="252" rx="86" ry="12" fill="${ABISAL}" opacity="0.55"/>

    <!-- badan tangki + tutup atas & bawah -->
    <rect x="112" y="112" width="96" height="112" rx="4" fill="#16242E" stroke="${GARIS}"/>
    <ellipse cx="160" cy="112" rx="48" ry="15" fill="#1B2C38" stroke="${GARIS}"/>
    <ellipse cx="160" cy="224" rx="48" ry="15" fill="#111E27" stroke="${GARIS}"/>

    <!-- muka bubur di dalam tangki -->
    <rect x="114" y="168" width="92" height="55" fill="#9A8F7E" opacity="0.32"/>
    <line x1="114" y1="168" x2="206" y2="168" stroke="${MAGNET}" stroke-width="2"/>

    <!-- poros & pengaduk -->
    <rect x="157" y="96" width="6" height="86" fill="${BAJA}" opacity="0.8"/>
    <rect x="138" y="178" width="44" height="6" rx="2" fill="${BAJA}" opacity="0.8"/>

    <!-- motor -->
    <rect x="146" y="70" width="28" height="26" rx="3" fill="#243541" stroke="${GARIS}"/>
    <rect x="140" y="56" width="40" height="16" rx="3" fill="#243541" stroke="${GARIS}"/>

    <!-- vent udara -->
    <path d="M196 96 L214 74" stroke="${KABUT}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="216" cy="70" r="3.5" fill="${KABUT}"/>

    <!-- pipa masuk & keluar -->
    <rect x="66" y="150" width="48" height="13" rx="4" fill="${GARIS}"/>
    <rect x="206" y="150" width="48" height="13" rx="4" fill="${GARIS}"/>
    <path d="M78 156 h20 m-6 -5 l6 5 l-6 5" stroke="${KABUT}" stroke-width="1.6" fill="none"/>
    <path d="M222 156 h20 m-6 -5 l6 5 l-6 5" stroke="${KABUT}" stroke-width="1.6" fill="none"/>

    <!-- gelembung yang naik -->
    <circle cx="146" cy="196" r="3" fill="${BAJA}" opacity="0.45"/>
    <circle cx="170" cy="182" r="2.2" fill="${BAJA}" opacity="0.4"/>
    <circle cx="158" cy="208" r="2.6" fill="${BAJA}" opacity="0.35"/>
  `);
}

/**
 * S6 — rakitan lima komponen di atas dek KIP, dengan penanda bernomor 1–5 dan
 * sosok manusia sebagai acuan skala, sama seperti scene 3D-nya.
 */
export function fallbackRakitanSvg() {
  const penanda = (x, y, n) => `
    <circle cx="${x}" cy="${y}" r="11" fill="${ABISAL}" stroke="${GAMMA}" stroke-width="1.4"/>
    <text x="${x}" y="${y + 4}" text-anchor="middle" font-family="IBM Plex Mono, monospace"
          font-size="11" fill="${GAMMA}">${n}</text>`;

  return bungkus('0 0 640 300', `
    <rect width="640" height="300" fill="${LAMBUNG}"/>

    <!-- dek kapal -->
    <rect x="40" y="212" width="560" height="14" fill="#16242E" stroke="${GARIS}"/>
    <rect x="40" y="226" width="560" height="30" fill="#101C25"/>
    <g stroke="${GARIS}" stroke-width="1" opacity="0.8">
      <line x1="110" y1="226" x2="110" y2="256"/>
      <line x1="240" y1="226" x2="240" y2="256"/>
      <line x1="380" y1="226" x2="380" y2="256"/>
      <line x1="520" y1="226" x2="520" y2="256"/>
    </g>

    <!-- pipa penghubung sepanjang rakitan -->
    <path d="M92 190 H548" stroke="${GARIS}" stroke-width="7" fill="none"/>

    <!-- 1 pengkondisi -->
    <rect x="76" y="132" width="42" height="58" rx="3" fill="#16242E" stroke="${GARIS}"/>
    <ellipse cx="97" cy="132" rx="21" ry="6" fill="#1B2C38" stroke="${GARIS}"/>
    <rect x="90" y="116" width="14" height="16" rx="2" fill="#243541" stroke="${GARIS}"/>

    <!-- 2 WHIMS -->
    <rect x="168" y="140" width="66" height="50" rx="3" fill="#1A2A34" stroke="${GARIS}"/>
    <circle cx="201" cy="165" r="15" fill="none" stroke="${BAJA}" stroke-width="4" opacity="0.75"/>
    <rect x="156" y="156" width="14" height="18" rx="2" fill="#7A4A2A"/>
    <rect x="232" y="156" width="14" height="18" rx="2" fill="#7A4A2A"/>

    <!-- 3 sensor gamma + PLC -->
    <rect x="296" y="118" width="16" height="72" fill="${GARIS}"/>
    <rect x="288" y="146" width="32" height="20" rx="3" fill="${GAMMA}" opacity="0.85"/>
    <rect x="326" y="152" width="26" height="38" rx="2" fill="#1E2F3B" stroke="${GARIS}"/>

    <!-- 4 katup pengarah -->
    <path d="M410 190 L446 168" stroke="${GARIS}" stroke-width="7" fill="none"/>
    <path d="M410 190 L446 212" stroke="${GARIS}" stroke-width="7" fill="none"/>
    <circle cx="410" cy="190" r="9" fill="#2A2320" stroke="${KABUT}"/>
    <rect x="403" y="160" width="14" height="22" rx="2" fill="#243541" stroke="${GARIS}"/>

    <!-- 5 bunker berperisai -->
    <rect x="486" y="150" width="66" height="40" rx="2" fill="#1C2730" stroke="${BAJA}" stroke-width="2.5"/>
    <rect x="494" y="158" width="50" height="24" fill="${MONASIT}" opacity="0.55"/>
    <rect x="512" y="134" width="14" height="18" rx="2" fill="${GARIS}"/>

    <!-- acuan skala: sosok manusia -->
    <g fill="${KABUT}" opacity="0.9">
      <circle cx="592" cy="182" r="5"/>
      <rect x="588" y="189" width="8" height="23" rx="3"/>
    </g>
    <text x="576" y="228" font-family="IBM Plex Mono, monospace" font-size="9" fill="${KABUT}">1,7 m</text>

    ${penanda(97, 106, 1)}
    ${penanda(201, 122, 2)}
    ${penanda(304, 100, 3)}
    ${penanda(410, 142, 4)}
    ${penanda(519, 116, 5)}
  `);
}

/**
 * S7 — satu bidikan mewakili sekuens sinema: bubur keluar dari jig, melewati
 * gerbang gamma, lalu terbelah menjadi dua jalur (bunker vs laut).
 */
export function fallbackSinemaSvg() {
  return bungkus('0 0 640 280', `
    <rect width="640" height="280" fill="${ABISAL}"/>

    <!-- pipa utama -->
    <path d="M40 140 H360" stroke="${GARIS}" stroke-width="18" fill="none" stroke-linecap="round"/>

    <!-- butiran dalam aliran -->
    <g>
      <circle cx="86" cy="140" r="4" fill="#9A8F7E"/>
      <circle cx="126" cy="136" r="3.4" fill="${MONASIT}"/>
      <circle cx="166" cy="143" r="4.2" fill="#9A8F7E"/>
      <circle cx="206" cy="138" r="3.2" fill="${MONASIT}"/>
      <circle cx="246" cy="142" r="3.8" fill="#9A8F7E"/>
    </g>

    <!-- gerbang gamma -->
    <rect x="286" y="112" width="30" height="56" rx="3" fill="none" stroke="${GAMMA}" stroke-width="2"/>
    <line x1="301" y1="112" x2="301" y2="168" stroke="${GAMMA}" stroke-width="1" opacity="0.55"/>
    <text x="272" y="102" font-family="IBM Plex Mono, monospace" font-size="10" fill="${GAMMA}">gerbang gamma</text>

    <!-- percabangan -->
    <path d="M360 140 L436 96 H600" stroke="${GARIS}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M360 140 L436 190 H600" stroke="${GARIS}" stroke-width="14" fill="none" stroke-linecap="round"/>

    <!-- jalur kaya monasit menuju bunker -->
    <circle cx="470" cy="96" r="3.6" fill="${MONASIT}"/>
    <circle cx="510" cy="96" r="3.6" fill="${MONASIT}"/>
    <rect x="556" y="72" width="52" height="46" rx="2" fill="#1C2730" stroke="${BAJA}" stroke-width="2.5"/>
    <text x="548" y="62" font-family="IBM Plex Mono, monospace" font-size="10" fill="${KABUT}">bunker</text>

    <!-- jalur buangan terverifikasi -->
    <circle cx="470" cy="190" r="3.4" fill="#9A8F7E"/>
    <circle cx="510" cy="190" r="3.4" fill="#9A8F7E"/>
    <g stroke="${MAGNET}" stroke-width="1.4" opacity="0.75" fill="none">
      <path d="M556 206 Q 578 200 600 206"/>
      <path d="M556 218 Q 578 212 600 218"/>
    </g>
    <text x="548" y="240" font-family="IBM Plex Mono, monospace" font-size="10" fill="${KABUT}">ke laut</text>
  `);
}
