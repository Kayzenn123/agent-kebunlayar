// data tanaman — kebun layar, hari 27
// sumber nama latin: kew plants of the world online (powo.science.kew.org) via riset 2026-11-05.
// 8 nama terverifikasi >=2 sumber; 8 lainnya nama latin mapan umum. perawatan = panduan umum hortikultura.
// semua teks tampil huruf kecil (constraint seed) — nama latin pun ditulis kecil.
export const TANAMAN = [
  { slug: "monstera", no: 1, nama: "monstera", latin: "monstera deliciosa", famili: "araceae", cahaya: "terang", air: "sedang", sulit: "mudah", fakta: "asli meksiko selatan sampai panama; daun dewasa berlubang seperti jendela.", ruang: ["ruang tamu", "balkon", "meja kerja"], daun: "belah" },
  { slug: "lidah-mertua", no: 2, nama: "lidah mertua", latin: "dracaena trifasciata", sinonim: "sin. sansevieria trifasciata", famili: "asparagaceae", cahaya: "sedang", air: "jarang", sulit: "mudah", fakta: "asli afrika barat sampai tanzania; daun sukulen menyimpan air, sangat tahan kering.", ruang: ["kamar tidur", "meja kerja", "ruang tamu"], daun: "pedang" },
  { slug: "sirih-gading", no: 3, nama: "sirih gading", latin: "epipremnum aureum", famili: "araceae", cahaya: "sedang", air: "sedang", sulit: "mudah", fakta: "asli pulau mo'orea, polinesia prancis; hampir semua pothos yang dijual adalah spesies ini.", ruang: ["ruang tamu", "dapur", "kamar mandi"], daun: "hati" },
  { slug: "aglaonema", no: 4, nama: "aglaonema", latin: "aglaonema commutatum", famili: "araceae", cahaya: "teduh", air: "sedang", sulit: "mudah", fakta: "tersebar di filipina dan sulawesi timur laut; daun hijau dengan bercak tengah keperakan.", ruang: ["kamar tidur", "meja kerja", "ruang tamu"], daun: "bulat" },
  { slug: "calathea-orbifolia", no: 5, nama: "calathea orbifolia", latin: "goeppertia orbifolia", sinonim: "sin. calathea orbifolia", famili: "marantaceae", cahaya: "teduh", air: "sering", sulit: "sulit", fakta: "endemik brasil, hutan atlantik; daun besar bulat bergaris hijau-perak.", ruang: ["kamar mandi", "ruang tamu"], daun: "bulat" },
  { slug: "philodendron-hati", no: 6, nama: "philodendron hati", latin: "philodendron hederaceum", sinonim: "sin. p. scandens", famili: "araceae", cahaya: "sedang", air: "sedang", sulit: "mudah", fakta: "asli amerika tengah dan karibia; daun berbentuk hati, bisa merambat atau menjuntai.", ruang: ["ruang tamu", "dapur", "kamar mandi"], daun: "hati" },
  { slug: "ketapang-biola", no: 7, nama: "ketapang biola", latin: "ficus lyrata", famili: "moraceae", cahaya: "terang", air: "sedang", sulit: "sedang", fakta: "asli afrika barat; daun besar kaku berbentuk seperti biola.", ruang: ["ruang tamu", "balkon"], daun: "biola" },
  { slug: "karet-kebo", no: 8, nama: "karet kebo", latin: "ficus elastica", famili: "moraceae", cahaya: "terang", air: "sedang", sulit: "mudah", fakta: "asli asia tropis, india timur laut sampai indonesia; getahnya dulu sumber karet.", ruang: ["ruang tamu", "balkon"], daun: "bulat" },
  { slug: "lili-perdamaian", no: 9, nama: "lili perdamaian", latin: "spathiphyllum wallisii", famili: "araceae", cahaya: "teduh", air: "sering", sulit: "mudah", fakta: "asli kolombia, amerika selatan; bunga putihnya adalah seludang, bukan kelopak.", ruang: ["kamar mandi", "kamar tidur", "ruang tamu"], daun: "pedang" },
  { slug: "lili-paris", no: 10, nama: "lili paris", latin: "chlorophytum comosum", famili: "asparagaceae", cahaya: "sedang", air: "sedang", sulit: "mudah", fakta: "asli afrika selatan; menghasilkan anakan gantung di ujung tangkai seperti laba-laba.", ruang: ["dapur", "kamar mandi", "meja kerja"], daun: "pita" },
  { slug: "zz-plant", no: 11, nama: "zz plant", latin: "zamioculcas zamiifolia", famili: "araceae", cahaya: "teduh", air: "jarang", sulit: "mudah", fakta: "asli afrika timur; menyimpan air di rimpang bawah tanah, tahan lupa disiram.", ruang: ["kamar tidur", "meja kerja", "ruang tamu"], daun: "pita" },
  { slug: "peperomia", no: 12, nama: "peperomia", latin: "peperomia obtusifolia", famili: "piperaceae", cahaya: "sedang", air: "sedang", sulit: "mudah", fakta: "asli amerika tengah dan selatan; daun tebal mengilap yang menyimpan air.", ruang: ["meja kerja", "dapur", "ruang tamu"], daun: "bulat" },
  { slug: "syngonium", no: 13, nama: "syngonium", latin: "syngonium podophyllum", famili: "araceae", cahaya: "sedang", air: "sedang", sulit: "mudah", fakta: "asli amerika tengah dan selatan; daun berubah bentuk dari panah menjadi berlobus saat dewasa.", ruang: ["ruang tamu", "kamar mandi", "meja kerja"], daun: "panah" },
  { slug: "anthurium", no: 14, nama: "anthurium bunga", latin: "anthurium andraeanum", famili: "araceae", cahaya: "sedang", air: "sedang", sulit: "sedang", fakta: "asli kolombia dan ekuador; seludang merah mengilap bisa bertahan berbulan-bulan.", ruang: ["ruang tamu", "meja kerja"], daun: "hati" },
  { slug: "dieffenbachia", no: 15, nama: "dieffenbachia", latin: "dieffenbachia seguine", famili: "araceae", cahaya: "sedang", air: "sedang", sulit: "mudah", fakta: "asli amerika tropis dan karibia; getahnya mengandung kalsium oksalat — iritan dan beracun jika tertelan.", ruang: ["ruang tamu", "kamar tidur"], daun: "pedang" },
  { slug: "maranta", no: 16, nama: "maranta", latin: "maranta leuconeura", famili: "marantaceae", cahaya: "teduh", air: "sering", sulit: "sedang", fakta: "asli brasil; daunnya melipat ke atas di malam hari seperti tangan berdoa.", ruang: ["kamar mandi", "kamar tidur"], daun: "bulat" },
];

export const RUANG = [
  { id: "ruang tamu", label: "ruang tamu", cahaya: "terang", lembap: false },
  { id: "kamar tidur", label: "kamar tidur", cahaya: "teduh", lembap: false },
  { id: "kamar mandi", label: "kamar mandi", cahaya: "teduh", lembap: true },
  { id: "dapur", label: "dapur", cahaya: "sedang", lembap: true },
  { id: "meja kerja", label: "meja kerja", cahaya: "teduh", lembap: false },
  { id: "balkon", label: "balkon", cahaya: "terang", lembap: false },
];

export const CAHAYA_LABEL = { teduh: "teduh", sedang: "sedang", terang: "terang" };
export const AIR_LABEL = { jarang: "jarang", sedang: "sedang", sering: "sering" };
export const SULIT_LABEL = { mudah: "mudah", sedang: "sedang", sulit: "sulit" };
