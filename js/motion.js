// kebun layar — lapisan gerak (kamera, marquee, teks, input, reveal)
// narasi: scroll = kamera masuk ke dalam poster, lalu dolly menyamping antar adegan.
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const saveData = navigator.connection && navigator.connection.saveData;
let gerakNyala = !reduceMotion;
let lite = false;

function terapkanMode() {
  document.body.classList.toggle("gerak-mati", !gerakNyala);
  document.body.classList.toggle("ringan", lite);
  if (gerakNyala && !reduceMotion) document.documentElement.classList.add("js-gerak");
  else document.documentElement.classList.remove("js-gerak");
  if (!gerakNyala) document.querySelectorAll(".adegan").forEach((s) => s.classList.add("terlihat"));
  const b = document.querySelector("#tombol-gerak");
  b.textContent = gerakNyala ? "gerak: nyala" : "gerak: mati";
  b.setAttribute("aria-pressed", String(gerakNyala));
}
document.querySelector("#tombol-gerak").addEventListener("click", () => {
  gerakNyala = !gerakNyala;
  terapkanMode();
});

// mode ringan otomatis
if (navigator.hardwareConcurrency <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 4) || saveData) lite = true;

// ---------- A. kamera: zoom poster + pan ----------
const posterDalam = document.querySelector("#poster-dalam");
const poster = document.querySelector("#poster");
let ticking = false;
function kamera() {
  ticking = false;
  if (!gerakNyala || lite || reduceMotion) { posterDalam.style.transform = ""; return; }
  const r = poster.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  const p = Math.min(Math.max(-r.top / (r.height || 1), 0), 1);
  const zoom = 1 + p * 0.14;
  const pan = p * 26;
  posterDalam.style.transform = `scale(${zoom.toFixed(3)}) translateX(${pan.toFixed(1)}px)`;
}
function mintaKamera() { if (!ticking) { ticking = true; requestAnimationFrame(kamera); } }
addEventListener("scroll", mintaKamera, { passive: true });
addEventListener("resize", mintaKamera);

// ---------- B. marquee: skew ikut velocity + tombol jeda ----------
const pita = document.querySelector(".pita");
let jedaUser = false;
let lastY = scrollY, lastT = performance.now(), skew = 0;
function marqueeSkew() {
  const now = performance.now();
  const v = (scrollY - lastY) / Math.max(now - lastT, 1);
  lastY = scrollY; lastT = now;
  const target = Math.max(-6, Math.min(6, v * 14));
  skew += (target - skew) * 0.2;
  if (Math.abs(skew) > 0.2) pita.style.setProperty("--skew", `${skew.toFixed(2)}deg`);
  else pita.style.setProperty("--skew", "0deg");
  requestAnimationFrame(marqueeSkew);
}
if (!reduceMotion) requestAnimationFrame(marqueeSkew);
document.querySelector("#tombol-jeda").addEventListener("click", (e) => {
  jedaUser = !jedaUser;
  pita.classList.toggle("jeda", jedaUser);
  e.currentTarget.textContent = jedaUser ? "putar pita" : "jeda pita";
  e.currentTarget.setAttribute("aria-pressed", String(jedaUser));
});
document.addEventListener("visibilitychange", () => {
  if (!jedaUser) pita.classList.toggle("jeda", document.hidden);
});

// ---------- C. teks: scramble nama latin saat masuk viewport ----------
const HURUF = "abcdefghijklmnopqrstuvwxyz";
function scramble(elm) {
  if (elm.dataset.scrambleSelesai) return;
  elm.dataset.scrambleSelesai = "1";
  const asli = elm.textContent;
  let frame = 0;
  const total = 14;
  const id = setInterval(() => {
    frame++;
    const tampil = asli.split("").map((ch, i) => {
      if (ch === " " || ch === "(" || ch === ")") return ch;
      const batas = (i / asli.length) * total;
      return frame >= batas ? ch : HURUF[Math.floor(Math.random() * HURUF.length)];
    }).join("");
    elm.textContent = tampil;
    if (frame >= total) { elm.textContent = asli; clearInterval(id); }
  }, 28);
}
const ioTeks = new IntersectionObserver((es) => {
  es.forEach((en) => { if (en.isIntersecting && gerakNyala && !lite) scramble(en.target); });
}, { threshold: 0.4 });
function amatiLatin() { document.querySelectorAll(".kartu .latin").forEach((n) => ioTeks.observe(n)); }

// ---------- D. input: tilt 3d kartu ----------
const pointerHalus = matchMedia("(pointer: fine)").matches;
function pasangTilt() {
  if (!pointerHalus) return;
  document.querySelectorAll(".kartu").forEach((k) => {
    if (k.dataset.tilt) return;
    k.dataset.tilt = "1";
    k.addEventListener("pointermove", (e) => {
      if (!gerakNyala || lite || reduceMotion) return;
      const r = k.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      k.style.setProperty("--ry", `${(x * 8).toFixed(1)}deg`);
      k.style.setProperty("--rx", `${(-y * 8).toFixed(1)}deg`);
      k.classList.add("miring");
    });
    k.addEventListener("pointerleave", () => k.classList.remove("miring"));
  });
}

// ---------- E. reveal: tirai section ----------
const ioReveal = new IntersectionObserver((es) => {
  es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("terlihat"); ioReveal.unobserve(en.target); } });
}, { threshold: 0.08 });
document.querySelectorAll(".adegan").forEach((s) => ioReveal.observe(s));

// kartu dirender dinamis oleh app.js — amati setelah render + tiap perubahan grid
const pengamatGrid = new MutationObserver(() => { amatiLatin(); pasangTilt(); });
document.querySelectorAll(".grid-pemain").forEach((g) => pengamatGrid.observe(g, { childList: true }));
amatiLatin();
pasangTilt();

// ---------- penjaga fps: <40 selama 2 detik -> mode ringan ----------
if (!reduceMotion) {
  let frames = 0, mulai = performance.now(), sudahLite = lite;
  const hitung = () => {
    frames++;
    const dt = performance.now() - mulai;
    if (dt >= 2000) {
      const fps = frames / (dt / 1000);
      if (fps < 40 && !sudahLite) { lite = true; sudahLite = true; terapkanMode(); }
      frames = 0; mulai = performance.now();
    }
    requestAnimationFrame(hitung);
  };
  requestAnimationFrame(hitung);
}

terapkanMode();
kamera();
