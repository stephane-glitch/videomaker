/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs : ces fonctions servent aux autres fragments */
// Moteur « gouache hachurée » : de grandes formes plates sans contour, dont le volume n'est donné que par
// des milliers de petits traits qui suivent la forme. Les traits sont redessinés une image sur trois.
const TAU = Math.PI * 2;
const rnd = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lin = (t, a, b) => clamp((t - a) / (b - a));
const ease = (u) => u * u * (3 - 2 * u);
const lerp = (a, b, u) => a + (b - a) * u;
const f1 = (v) => v.toFixed(1);
const pop = (t, t0, d = 0.36) => {
  const u = lin(t, t0, t0 + d);
  return u === 0 ? 0 : 1 - Math.pow(1 - u, 3) + 0.22 * Math.sin(u * Math.PI) * (1 - u);
};
// Une seule famille de couleurs, du plus lumineux au presque noir
const RAMP = [
  "#eef8ff",
  "#c3e3fb",
  "#8fc1ec",
  "#5a94d6",
  "#3467b4",
  "#1c438a",
  "#0f2758",
  "#07122e",
];
const ACC = {
  red: "#e2452f",
  yellow: "#ffd84a",
  skin: "#f3c9a0",
  green: "#5fc26a",
  cream: "#f4ecd8",
  orange: "#f08a3c",
};

// --- Repères de voix ---
const normW = (w) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
const cue = (id, frag, nth = 0) => {
  const l = SCHED.lines[id];
  if (!frag) return l.start;
  const hits = l.words.filter(([w]) => normW(w).includes(normW(frag)));
  return hits[nth] ? hits[nth][1] : l.start;
};
const lineEnd = (id) => SCHED.lines[id].end;
const scn = (id) => SCHED.scenes[id];
const T = (id) => scn(id).start;
const SFX_LOG = (window.__SFX = []);
const sfx = (t, kind = "pop") => SFX_LOG.push([t, kind]);

// --- Formes ---
const ictx = document.createElement("canvas").getContext("2d");
const FLOW = {
  down:
    (c = 0.6) =>
    (x, y, u) =>
      Math.PI / 2 + (u - 0.5) * c,
  h: () => (x, y) => (rnd(x * 0.013 + y * 0.021) - 0.5) * 0.16,
  rad: (cx, cy) => (x, y) => Math.atan2(y - cy, x - cx) + Math.PI / 2,
  ang: (a) => () => a,
};
const LIT = {
  left: (x, y, u, v) => 0.95 - 0.7 * u - 0.3 * v * v,
  top: (x, y, u, v) => 0.92 - 0.6 * v,
  flat: (l) => () => l,
  glow: (cx, cy, R) => (x, y) => 1 - Math.hypot(x - cx, y - cy) / R,
};
const bullet = (cx, base, w, h) =>
  `M${cx - w / 2} ${base}V${base - h + w / 2}Q${cx - w / 2} ${base - h} ${cx} ${base - h}Q${cx + w / 2} ${base - h} ${cx + w / 2} ${base - h + w / 2}V${base}Z`;
const house = (x, y, w, h, rh) =>
  `M${x} ${y + h}V${y}L${x + w / 2} ${y - rh}L${x + w} ${y}V${y + h}Z`;
const rr = (x, y, w, h, r = 0) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
let FID = 0;
// F(chemin, options) : k = profondeur (0 = très loin, 1 = plan du sujet), lo/hi = tons extrêmes dans RAMP
function F(d, box, o = {}) {
  const p = new Path2D(d),
    seed = ++FID * 53.7,
    [bx, by, bw, bh] = box;
  const f = {
    p,
    k: o.k ?? 1,
    lo: o.lo ?? 1,
    hi: o.hi ?? 6,
    w: o.w || 3.2,
    len: o.len || 26,
    ph: o.ph ?? 1,
    strokes: [],
  };
  f.base = o.base ?? Math.round((f.lo + f.hi) / 2);
  const flow = o.flow || FLOW.down(),
    lit = o.lit || LIT.left,
    n = Math.min(o.max || 7000, (bw * bh) / (o.dens || 190));
  for (let i = 0; i < n; i++) {
    const x = bx + rnd(seed + i * 2.13) * bw,
      y = by + rnd(seed + i * 3.71 + 9) * bh;
    if (!ictx.isPointInPath(p, x, y)) continue;
    const u = (x - bx) / bw,
      v = (y - by) / bh;
    f.strokes.push([
      x,
      y,
      flow(x, y, u, v),
      clamp(lit(x, y, u, v) + (rnd(seed + i * 7.7) - 0.5) * 0.34),
      seed + i,
      f.len * (0.7 + rnd(seed + i * 1.9) * 0.6),
    ]);
  }
  return f;
}
const R = (x, y, w, h, o) => F(rr(x, y, w, h, o?.r || 0), [x, y, w, h], o);

// --- Dessin ---
const cv = document.getElementById("cv"),
  ctx = cv.getContext("2d");
const setCam = (c, k) => {
  const z = 1 + (c[2] - 1) * (0.5 + 0.5 * Math.min(k, 1));
  ctx.setTransform(z, 0, 0, z, 960 - z * (960 + c[0] * k), 540 - z * (540 + c[1] * k));
};
// lumière ajoutée par les ondes : anneaux qui s'écartent d'une source
function waveL(srcs, x, y, tq) {
  let L = 0;
  for (const s of srcs) {
    const d = Math.hypot(x - s.x, y - s.y),
      front = s.sp * (tq - s.t0);
    if (d > front || d > s.rmax || front <= 0) continue;
    const c = Math.cos((TAU * (d - front)) / s.lam);
    if (c > 0) L += s.amp * c * c * (1 - d / s.rmax) * (s.att ? s.att(x, y) : 1);
  }
  return L;
}
function drawForms(S, c, tq, s3, srcs) {
  for (const f of S.forms) {
    ctx.save();
    setCam(c, f.k);
    ctx.clip(f.p);
    ctx.fillStyle = RAMP[f.base];
    ctx.fill(f.p);
    const B = [[], [], [], [], [], [], [], []],
      ox = c[0] * (1 - f.k),
      oy = c[1] * (1 - f.k),
      band = S.band;
    for (const st of f.strokes) {
      let L = st[3];
      if (f.ph) {
        if (srcs.length) L += f.ph * waveL(srcs, st[0] + ox, st[1] + oy, tq);
        if (band) L += band(st[0] + ox, st[1] + oy, tq);
      }
      B[clamp(Math.round(f.lo + (1 - L) * (f.hi - f.lo)), 0, 7)].push(st);
    }
    ctx.lineCap = "round";
    ctx.lineWidth = f.w;
    for (let i = 0; i < 8; i++) {
      if (!B[i].length) continue;
      ctx.beginPath();
      for (const st of B[i]) {
        const a = st[2] + (rnd(st[4] + s3 * 1.37) - 0.5) * 0.42,
          x = st[0] + (rnd(st[4] * 1.3 + s3) - 0.5) * 3,
          y = st[1] + (rnd(st[4] * 1.7 + s3) - 0.5) * 3,
          l = st[5] / 2,
          ca = Math.cos(a) * l,
          sa = Math.sin(a) * l,
          cu = (rnd(st[4] * 2.3) - 0.5) * l * 0.5;
        ctx.moveTo(x - ca, y - sa);
        ctx.quadraticCurveTo(x - sa * 0.3 + cu * 0.3, y + ca * 0.3 + cu, x + ca, y + sa);
      }
      ctx.strokeStyle = RAMP[i];
      ctx.stroke();
    }
    ctx.restore();
  }
}
// anneaux dessinés en petits traits clairs (on « voit » les ondes)
function rings(srcs, tq, s3, col = RAMP[0]) {
  ctx.lineCap = "round";
  ctx.lineWidth = 4;
  ctx.strokeStyle = col;
  ctx.beginPath();
  for (const s of srcs) {
    if (s.draw === false) continue;
    const front = s.sp * (tq - s.t0);
    for (let j = 0; j < 14; j++) {
      const r = front - j * s.lam;
      if (r < 24 || r > s.rmax) continue;
      const n = Math.floor(r * 0.34),
        fall = (1 - r / s.rmax) * s.amp;
      for (let i = 0; i < n; i++) {
        const th = rnd(j * 31.7 + i * 1.71 + s3 * 0.37 + s.x) * TAU,
          x = s.x + Math.cos(th) * r,
          y = s.y + Math.sin(th) * r;
        if (rnd(i * 3.3 + j + s3) > fall * (s.att ? s.att(x, y) : 1) * 1.5) continue;
        const a = th + Math.PI / 2 + (rnd(i * 5.1 + s3) - 0.5) * 0.5,
          l = 9 + rnd(i * 7.3) * 9;
        ctx.moveTo(x - Math.cos(a) * l, y - Math.sin(a) * l);
        ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      }
    }
  }
  ctx.stroke();
}
// petits personnages plats (les seules autres couleurs de l'image)
function kid(x, y, s, o = {}) {
  const b = o.bob || 0,
    w = o.walk || 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * (o.flip ? -1 : 1), s);
  ctx.fillStyle = RAMP[7];
  ctx.fillRect(-10 + w * 5, -34, 8, 34);
  ctx.fillRect(2 - w * 5, -34, 8, 34);
  ctx.fillStyle = o.col || ACC.red;
  ctx.beginPath();
  ctx.roundRect(-14, -78 + b, 28, 48, 9);
  ctx.fill();
  ctx.fillStyle = ACC.skin;
  ctx.beginPath();
  ctx.arc(0, -92 + b, 14, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#3a2a22";
  ctx.beginPath();
  ctx.arc(0, -96 + b, 14, Math.PI, TAU);
  ctx.fill();
  if (o.tablet !== false) {
    ctx.fillStyle = ACC.yellow;
    ctx.save();
    ctx.translate(18, -58 + b + (o.up ? -34 : 0));
    ctx.rotate(-0.25);
    ctx.fillRect(-4, -11, 22, 16);
    ctx.restore();
  }
  ctx.restore();
}
const dot = (x, y, r, col) => {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
};

// --- Étiquettes (au-dessus du dessin) ---
function cap(text, x, y, t, t0, o = {}) {
  const p = pop(t, t0);
  if (p <= 0 || (o.t1 && t > o.t1)) return "";
  const fs = o.fs || 44,
    w = text.length * fs * 0.54 + 64,
    h = fs * 1.65;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${o.rot ?? -2}) scale(${p.toFixed(3)})"><rect x="${f1(-w / 2 + 7)}" y="${f1(-h / 2 + 9)}" width="${f1(w)}" height="${f1(h)}" rx="10" fill="#07122e" opacity=".35"/><rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="10" fill="${o.fill || ACC.cream}"/><text x="0" y="${f1(fs * 0.35)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${o.ink || "#0f2758"}">${text}</text></g>`;
}
const logo = () =>
  `<g transform="translate(1750 1012) rotate(-2)"><rect x="-120" y="-28" width="240" height="56" rx="10" fill="${ACC.cream}"/><text x="0" y="11" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="30" fill="#1c438a">Kidi-science</text></g>`;

// --- Scènes : { a, b, forms, cam(t) → [x, y, zoom], waves(tq) → sources, figs(t, im, tq, s3, srcs), over(t) } ---
const SC = [];
