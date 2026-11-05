// kebun layar — logika utama (vanilla, 0 dependency)
import { TANAMAN, RUANG, CAHAYA_LABEL, AIR_LABEL, SULIT_LABEL } from "./data.js";

const KEY = "kebunlayar.v1";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function el(tag, cls, teks) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (teks !== undefined) n.textContent = teks;
  return n;
}
function ikon(id, label) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("class", "ikon");
  s.setAttribute("aria-hidden", label ? "false" : "true");
  if (label) s.setAttribute("aria-label", label);
  const u = document.createElementNS("http://www.w3.org/2000/svg", "use");
  u.setAttribute("href", "#" + id);
  s.appendChild(u);
  return s;
}
const DAUN_IKON = { belah: "d-belah", pedang: "d-pedang", hati: "d-hati", bulat: "d-bulat", biola: "d-biola", pita: "d-pita", panah: "d-panah" };

// ---------- toast ----------
let toastTimer = null;
function toast(pesan) {
  const t = $("#toast");
  t.textContent = pesan;
  t.classList.add("tampil");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("tampil"), 3200);
}

// ---------- salin (clipboard + fallback) ----------
async function salinTeks(teks, pesanOk) {
  try {
    await navigator.clipboard.writeText(teks);
    toast(pesanOk);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = teks;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    ta.remove();
    toast(ok ? pesanOk : "salinan gagal — salin manual dari layar, ya.");
    return ok;
  }
}

// ---------- koleksi (localStorage berversi) ----------
function muatKoleksi() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const d = JSON.parse(raw);
    if (!d || d.v !== 1 || !Array.isArray(d.slug)) return [];
    return d.slug.filter((s) => TANAMAN.some((t) => t.slug === s));
  } catch {
    return [];
  }
}
function simpanKoleksi(list) {
  try { localStorage.setItem(KEY, JSON.stringify({ v: 1, slug: list })); } catch { /* penyimpanan penuh — koleksi hanya di memori */ }
}
let koleksi = muatKoleksi();
const diKoleksi = (slug) => koleksi.includes(slug);
function toggleKoleksi(slug) {
  koleksi = diKoleksi(slug) ? koleksi.filter((s) => s !== slug) : [...koleksi, slug];
  simpanKoleksi(koleksi);
  renderSemua();
}

// ---------- kartu pemain ----------
function kartuTanaman(t, konteks) {
  const art = el("article", "kartu");
  art.dataset.slug = t.slug;
  const strip = el("div", "clap-strip");
  strip.append(ikon("i-clap"), el("span", null, `adegan ${String(t.no).padStart(2, "0")} · ${t.famili}`));
  const bintang = el("span", null, diKoleksi(t.slug) ? "★ tersimpan" : "☆ simpan");
  strip.appendChild(bintang);
  art.appendChild(strip);

  const gbr = el("div", "gambar");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 120 120");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#" + (DAUN_IKON[t.daun] || "d-bulat"));
  svg.appendChild(use);
  gbr.appendChild(svg);
  art.appendChild(gbr);

  art.appendChild(el("h3", null, t.nama));
  const latin = el("p", "latin", t.latin + (t.sinonim ? ` (${t.sinonim})` : ""));
  art.appendChild(latin);

  const rawat = el("div", "rawat");
  const c = el("span"); c.append(ikon("i-matahari"), document.createTextNode(`cahaya ${CAHAYA_LABEL[t.cahaya]}`));
  const a = el("span"); a.append(ikon("i-tetes"), document.createTextNode(`air ${AIR_LABEL[t.air]}`));
  const s = el("span"); s.append(ikon("i-bintang"), document.createTextNode(SULIT_LABEL[t.sulit]));
  rawat.append(c, a, s);
  art.appendChild(rawat);
  art.appendChild(el("p", "fakta", t.fakta));

  const aksi = el("div", "aksi");
  const baca = el("button", null, "baca naskah");
  baca.type = "button";
  baca.addEventListener("click", () => bukaDialog(t.slug));
  const fav = el("button", "fav");
  fav.type = "button";
  fav.setAttribute("aria-pressed", String(diKoleksi(t.slug)));
  fav.append(ikon("i-bintang"), document.createTextNode(diKoleksi(t.slug) ? "tersimpan" : "simpan"));
  fav.addEventListener("click", () => {
    toggleKoleksi(t.slug);
    toast(diKoleksi(t.slug) ? `${t.nama} masuk koleksi.` : `${t.nama} keluar dari koleksi.`);
  });
  aksi.append(baca, fav);
  art.appendChild(aksi);
  if (konteks === "koleksi") art.classList.add("di-koleksi");
  return art;
}

// ---------- saring + urut ----------
const SULIT_SKOR = { mudah: 0, sedang: 1, sulit: 2 };
function tanamanTersaring() {
  const q = ($("#cari").value || "").trim().toLowerCase();
  const cahaya = ($('input[name="cahaya"]:checked') || {}).value || "semua";
  const air = ($('input[name="air"]:checked') || {}).value || "semua";
  const sulit = ($('input[name="sulit"]:checked') || {}).value || "semua";
  const urut = $("#urut").value;
  let list = TANAMAN.filter((t) => {
    if (q && !(t.nama + " " + t.latin + " " + t.famili).toLowerCase().includes(q)) return false;
    if (cahaya !== "semua" && t.cahaya !== cahaya) return false;
    if (air !== "semua" && t.air !== air) return false;
    if (sulit !== "semua" && t.sulit !== sulit) return false;
    return true;
  });
  if (urut === "nama") list = [...list].sort((a, b) => a.nama.localeCompare(b.nama, "id"));
  else if (urut === "termudah") list = [...list].sort((a, b) => SULIT_SKOR[a.sulit] - SULIT_SKOR[b.sulit] || a.no - b.no);
  else list = [...list].sort((a, b) => a.no - b.no);
  return list;
}
function renderGrid() {
  const grid = $("#grid-pemain");
  grid.replaceChildren();
  const list = tanamanTersaring();
  list.forEach((t) => grid.appendChild(kartuTanaman(t, "katalog")));
  $("#kosong").hidden = list.length > 0;
  $("#hasil-hitung").textContent = list.length === 16
    ? "16 pemain siap tampil."
    : list.length === 0
      ? "tidak ada pemain yang cocok — adegan ini kosong."
      : `${list.length} pemain cocok dengan saringanmu.`;
}
function renderKoleksi() {
  const grid = $("#grid-koleksi");
  grid.replaceChildren();
  const list = TANAMAN.filter((t) => diKoleksi(t.slug));
  list.forEach((t) => grid.appendChild(kartuTanaman(t, "koleksi")));
  $("#kosong-koleksi").hidden = list.length > 0;
  grid.hidden = list.length === 0;
}
function renderKredit() {
  const ol = $("#kredit-pemain");
  ol.replaceChildren();
  TANAMAN.forEach((t) => {
    const li = el("li", null, `adegan ${String(t.no).padStart(2, "0")} — ${t.nama} sebagai dirinya sendiri (${t.latin})`);
    ol.appendChild(li);
  });
}
function renderSemua() { renderGrid(); renderKoleksi(); }

// ---------- dialog detail ----------
const dialog = $("#dialog");
let dialogSlug = null;
function bukaDialog(slug) {
  const t = TANAMAN.find((x) => x.slug === slug);
  if (!t) { toast("adegan ini tidak ada di naskah."); return; }
  dialogSlug = slug;
  $("#dialog-nomor").textContent = `adegan ${String(t.no).padStart(2, "0")} · famili ${t.famili}`;
  $("#dialog-judul").textContent = t.nama;
  $("#dialog-latin").textContent = t.latin + (t.sinonim ? ` (${t.sinonim})` : "");
  $("#dialog-fakta").textContent = t.fakta;
  const dl = $("#dialog-rawat");
  dl.replaceChildren();
  [["cahaya", `cahaya ${CAHAYA_LABEL[t.cahaya]}`], ["air", `air ${AIR_LABEL[t.air]} — siram saat media kering`], ["kesulitan", SULIT_LABEL[t.sulit]], ["asal", t.fakta.split(";")[0]]].forEach(([k, v]) => {
    const div = el("div");
    div.append(el("dt", null, k), el("dd", null, v));
    dl.appendChild(div);
  });
  $("#dialog-ruang").textContent = `betah di: ${t.ruang.join(", ")}.`;
  const per = $("#dialog-peringatan");
  if (t.slug === "dieffenbachia") {
    per.hidden = false;
    per.textContent = "peringatan sutradara: getahnya iritan dan beracun jika tertelan — jauhkan dari anak kecil dan hewan peliharaan.";
  } else per.hidden = true;
  const fav = $("#dialog-favorit");
  fav.textContent = diKoleksi(slug) ? "sudah di koleksi — keluarkan" : "simpan ke koleksi";
  fav.setAttribute("aria-pressed", String(diKoleksi(slug)));
  const url = new URL(location.href);
  url.searchParams.set("tanaman", slug);
  history.replaceState(null, "", url);
  dialog.showModal();
}
function tutupDialog() {
  if (dialog.open) dialog.close();
  dialogSlug = null;
  const url = new URL(location.href);
  url.searchParams.delete("tanaman");
  history.replaceState(null, "", url);
}
dialog.addEventListener("close", () => {
  if (dialogSlug) {
    dialogSlug = null;
    const url = new URL(location.href);
    url.searchParams.delete("tanaman");
    history.replaceState(null, "", url);
  }
});
$("#dialog-favorit").addEventListener("click", () => {
  if (!dialogSlug) return;
  toggleKoleksi(dialogSlug);
  const t = TANAMAN.find((x) => x.slug === dialogSlug);
  const fav = $("#dialog-favorit");
  fav.textContent = diKoleksi(dialogSlug) ? "sudah di koleksi — keluarkan" : "simpan ke koleksi";
  toast(diKoleksi(dialogSlug) ? `${t.nama} masuk koleksi.` : `${t.nama} keluar dari koleksi.`);
});
$("#dialog-salin").addEventListener("click", () => {
  const t = TANAMAN.find((x) => x.slug === dialogSlug);
  if (!t) return;
  salinTeks(`kebun layar — adegan ${String(t.no).padStart(2, "0")}: ${t.nama} (${t.latin}). cahaya ${CAHAYA_LABEL[t.cahaya]}, air ${AIR_LABEL[t.air]}, ${SULIT_LABEL[t.sulit]}. ${t.fakta} lihat: ${location.origin}${location.pathname}?tanaman=${t.slug}`, `${t.nama} tersalin — tinggal tempel di wa.`);
});
$("#dialog-tautan").addEventListener("click", () => {
  if (!dialogSlug) return;
  salinTeks(`${location.origin}${location.pathname}?tanaman=${dialogSlug}`, "tautan adegan tersalin.");
});

// ---------- casting ----------
function skorCasting(t, ruangId, cahayaRuang) {
  let skor = 0;
  const ruang = RUANG.find((r) => r.id === ruangId);
  if (t.ruang.includes(ruangId)) skor += 2;
  if (t.cahaya === cahayaRuang) skor += 3;
  else if ((t.cahaya === "sedang" && cahayaRuang !== "sedang") || (cahayaRuang === "sedang" && t.cahaya !== "sedang")) skor += 1;
  if (t.sulit === "mudah") skor += 1;
  if (ruang && ruang.lembap && t.air === "sering") skor += 1;
  if (ruang && ruang.lembap && t.air === "jarang") skor -= 1;
  return skor;
}
$("#form-casting").addEventListener("submit", (e) => {
  e.preventDefault();
  const ruangId = $("#ruang").value;
  const cahayaRuang = $("#cahaya-ruang").value;
  const salah = $("#casting-salah");
  salah.hidden = true;
  if (!ruangId || !cahayaRuang) {
    salah.hidden = false;
    salah.textContent = "sutradara butuh dua jawaban: lokasi syuting dan cahayanya. isi keduanya dulu.";
    return;
  }
  const hasil = TANAMAN.map((t) => ({ t, skor: skorCasting(t, ruangId, cahayaRuang) }))
    .sort((a, b) => b.skor - a.skor || SULIT_SKOR[a.t.sulit] - SULIT_SKOR[b.t.sulit])
    .slice(0, 3);
  const wadah = $("#hasil-casting");
  wadah.replaceChildren();
  const rendah = hasil[0].skor < 4;
  const judul = el("p", "hasil-hitung", rendah
    ? `casting selesai — tapi kecocokannya rendah. ${ruangId} bercahaya ${CAHAYA_LABEL[cahayaRuang]} itu panggung yang sulit; tiga ini yang paling tahan banting:`
    : `casting selesai — tiga pemain paling betah di ${ruangId} (${CAHAYA_LABEL[cahayaRuang]}):`);
  wadah.appendChild(judul);
  const grid = el("div", "grid-pemain");
  hasil.forEach(({ t, skor }) => {
    const kartu = kartuTanaman(t, "casting");
    const alasan = el("p", "alasan", skor >= 5
      ? "cocok sekali: cahaya dan ruangannya klop."
      : skor >= 4 ? "cocok: butuh sedikit penyesuaian cahaya." : "paling tahan banting di antara yang lain — tetap awasi daunnya minggu pertama.");
    kartu.appendChild(alasan);
    grid.appendChild(kartu);
  });
  wadah.appendChild(grid);
  const url = new URL(location.href);
  url.searchParams.set("ruang", ruangId);
  url.searchParams.set("cahaya", cahayaRuang);
  history.replaceState(null, "", url);
  $("#hasil-casting").scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// ---------- koleksi: aksi ----------
$("#salin-koleksi").addEventListener("click", () => {
  const list = TANAMAN.filter((t) => diKoleksi(t.slug));
  if (!list.length) { toast("koleksimu masih kosong — simpan dulu satu pemain."); return; }
  const teks = `koleksi kebun layarku (${list.length} pemain):\n` + list.map((t) => `• ${t.nama} (${t.latin}) — cahaya ${CAHAYA_LABEL[t.cahaya]}, air ${AIR_LABEL[t.air]}`).join("\n") + `\nlihat: ${location.origin}${location.pathname}`;
  salinTeks(teks, "daftar koleksi tersalin — tinggal tempel di wa.");
});
$("#unduh-koleksi").addEventListener("click", () => {
  const list = TANAMAN.filter((t) => diKoleksi(t.slug));
  const blob = new Blob([JSON.stringify({ v: 1, diekspor: new Date().toISOString(), koleksi: list }, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "koleksi-kebun-layar.json";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("koleksi diunduh sebagai json.");
});
let hapusSiap = false, hapusTimer = null;
$("#hapus-koleksi").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  if (!hapusSiap) {
    hapusSiap = true;
    btn.textContent = "yakin hapus semua? tekan lagi";
    hapusTimer = setTimeout(() => { hapusSiap = false; btn.innerHTML = ""; btn.append(ikon("i-hapus"), document.createTextNode(" hapus koleksi")); }, 4000);
    return;
  }
  clearTimeout(hapusTimer);
  hapusSiap = false;
  koleksi = [];
  simpanKoleksi(koleksi);
  renderSemua();
  btn.innerHTML = "";
  btn.append(ikon("i-hapus"), document.createTextNode(" hapus koleksi"));
  toast("koleksi dikosongkan — pemain kembali ke katalog.");
});

// ---------- saring: event ----------
$("#form-saring").addEventListener("input", renderGrid);
$("#form-saring").addEventListener("submit", (e) => e.preventDefault());
function resetSaring() {
  $("#cari").value = "";
  $("#urut").value = "adegan";
  $$('input[name="cahaya"]').forEach((r) => { r.checked = r.value === "semua"; });
  $$('input[name="air"]').forEach((r) => { r.checked = r.value === "semua"; });
  $$('input[name="sulit"]').forEach((r) => { r.checked = r.value === "semua"; });
  renderGrid();
}
$("#reset-saring").addEventListener("click", resetSaring);
$("#kosong-reset").addEventListener("click", resetSaring);

// ---------- easter egg: ketik "tayang" ----------
let bufferKetik = "";
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, select, textarea")) return;
  bufferKetik = (bufferKetik + e.key.toLowerCase()).slice(-6);
  if (bufferKetik === "tayang") {
    bufferKetik = "";
    tiraiDaun();
  }
});
function tiraiDaun() {
  const tirai = $("#tirai");
  tirai.classList.add("tutup");
  toast("tirai ditutup — selamat datang di pemutaran perdana.");
  setTimeout(() => {
    tirai.classList.remove("tutup");
    for (let i = 0; i < 14; i++) {
      const d = document.createElement("span");
      d.className = "daun-terbang";
      d.style.left = `${4 + Math.random() * 90}vw`;
      d.style.fontSize = `${18 + Math.random() * 22}px`;
      d.style.animationDelay = `${Math.random() * 0.5}s`;
      d.textContent = "❦";
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 3400);
    }
  }, 700);
}
// ---------- easter egg: clap 5x = malam pemutaran ----------
let ketukClap = 0, clapTimer = null;
$("#clap").addEventListener("click", () => {
  ketukClap++;
  clearTimeout(clapTimer);
  clapTimer = setTimeout(() => { ketukClap = 0; }, 2500);
  if (ketukClap >= 5) {
    ketukClap = 0;
    document.body.classList.toggle("malam");
    toast(document.body.classList.contains("malam") ? "mode malam pemutaran nyala — lampu studio dipadamkan." : "mode malam pemutaran mati — lampu studio nyala lagi.");
  }
});

// ---------- deep-link saat muat ----------
function terapkanDeepLink() {
  const p = new URLSearchParams(location.search);
  const slug = p.get("tanaman");
  if (slug && TANAMAN.some((t) => t.slug === slug)) bukaDialog(slug);
  const ruang = p.get("ruang");
  const cahaya = p.get("cahaya");
  if (ruang && RUANG.some((r) => r.id === ruang)) $("#ruang").value = ruang;
  if (cahaya && ["teduh", "sedang", "terang"].includes(cahaya)) $("#cahaya-ruang").value = cahaya;
}

// ---------- init ----------
renderSemua();
renderKredit();
terapkanDeepLink();
