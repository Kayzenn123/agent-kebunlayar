# kebun layar — sebuah film dokumenter botani

Hari 27 · 30 Days of Code · 2026-11-05

**Konsep satu kalimat:** satu poster film dokumenter botani lawas — pengunjung masuk lewat judul raksasa, lalu menonton katalog 16 tanaman hias indonesia adegan demi adegan.

**Live:** https://kayzenn123.github.io/agent-kebunlayar/

## Fitur
- poster film raksasa: judul "kebun layar" jatuh kata demi kata, kamera zoom masuk saat scroll, tirai terbuka antar adegan
- 16 pemain (tanaman hias indonesia) dengan nomor adegan, nama latin, famili, kebutuhan cahaya/air/kesulitan, dan 1 fakta
- saring + cari + urut (nomor adegan / nama a–z / paling gampang dulu)
- detail adegan per tanaman (dialog): fakta, blok kebutuhan tumbuh, ruangan yang cocok, peringatan racun (dieffenbachia)
- casting ruangan: pilih ruangan + cahaya → 3 rekomendasi dengan alasan kecocokan
- koleksi (favorit) localStorage berversi, deep-link `?tanaman=` / `?ruang=&cahaya=`, salin daftar via wa, unduh json, hapus 2-langkah
- 3 pita marquee bertumpuk beda kecepatan + skew ikut velocity scroll + tombol jeda
- tilt 3d kartu, scramble nama latin, mode ringan otomatis + toggle gerak + reduced-motion
- easter egg: ketik `tayang` → tirai + confetti daun; klik clapperboard 5× → mode malam pemutaran

## Tech
Vanilla JS (ESM, 0 dependency), CSS `@layer` + custom properties oklch. Font self-host: encode sans semi condensed, noto serif khojki, rubik wet paint (172KB).

## Skor
- Lighthouse: mobile 93/100/100/100 (LCP 1.4 dtk, CLS 0.01), desktop 98/100/100/100 (LCP 0.5 dtk, CLS 0.019)
- qa.js: exit 0 (4 viewport, 0 overflow, 0 console issue, 0 tap kecil, 1 h1, lang=id); e2e Playwright 13/13 lulus
- FPS 4x CPU throttle: 60.3–60.4

## Data
- Nama latin merujuk kew plants of the world online (powo.science.kew.org); 8 nama terverifikasi ≥2 sumber, 8 lainnya nama latin mapan umum.
- Perawatan = panduan umum hortikultura, dilabeli begitu di situs.
- Nama latin ditulis huruf kecil semua mengikuti constraint seed (semua teks huruf kecil).
- Referensi desain: poster "secrets of life" (disney, 1956), saul bass, cooper hewitt "how posters work"; geneva herbaria catalogue, powo kew, missouri botanical garden plant finder.
- Ikon: streamline (cc-by) + svg digambar sendiri.
