/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs : ces fonctions servent aux autres fragments */
// Moteur « papier découpé » : chaque morceau est un papier fabriqué en code (grain, déchirure, ombre),
// posé sur un carton et animé pose par pose, comme une animation image par image.
const TAU = Math.PI * 2;
const FPS = 15; // « sur deux » : une pose tient deux images de la vidéo
const rnd = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lin = (t, a, b) => clamp((t - a) / (b - a));
const ease = (u) => u * u * (3 - 2 * u);
const f1 = (v) => v.toFixed(1);
const hashStr = (s) => {
  let a = 5381,
    b = 52711;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    a = (a * 33) ^ c;
    b = (b * 33) ^ c;
  }
  return (a >>> 0).toString(36) + (b >>> 0).toString(36);
};
const INK = "#2a2320";

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
const SFX_LOG = (window.__SFX = []);

// --- Scènes et calques ---
const pieces = [];
const SCENES = {};
let CUR = null;
let uid = 0;
function scene(id, layers) {
  const root = document.getElementById(id);
  CUR = SCENES[id] = { id, root, layers: {} };
  for (const [name, k] of layers) {
    const el = document.createElement("div");
    el.className = "layer";
    root.appendChild(el);
    CUR.layers[name] = { el, k };
  }
  return CUR;
}
const FIXED = { el: document.getElementById("L-fixed"), k: 0 };

// --- Formes ---
const poly = (pts) => "M" + pts.map((p) => f1(p[0]) + " " + f1(p[1])).join("L") + "Z";
function blob(cx, cy, rx, ry, n, seed, jag = 0.1) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU;
    const r = 1 + (rnd(seed + i) - 0.5) * 2 * jag;
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return pts;
}
function band(x0, x1, y0, y1, seed, amp = 18, stepx = 95) {
  const pts = [];
  const n = Math.round((x1 - x0) / stepx);
  const side = (i, s) => (i === 0 || i === n ? (rnd(seed + s + i) - 0.5) * 26 : 0);
  for (let i = 0; i <= n; i++)
    pts.push([x0 + ((x1 - x0) * i) / n + side(i, 60), y0 + (rnd(seed + i) - 0.5) * 2 * amp]);
  for (let i = n; i >= 0; i--)
    pts.push([x0 + ((x1 - x0) * i) / n + side(i, 80), y1 + (rnd(seed + 100 + i) - 0.5) * 2 * amp]);
  return pts;
}
function rect(x, y, w, h, seed = 0, j = 0) {
  const q = (k) => (rnd(seed + k) - 0.5) * 2 * j;
  return [
    [x + q(1), y + q(2)],
    [x + w + q(3), y + q(4)],
    [x + w + q(5), y + h + q(6)],
    [x + q(7), y + h + q(8)],
  ];
}
function starPts(cx, cy, r1, r2, n, rot = 0) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i / (n * 2)) * TAU,
      r = i % 2 ? r2 : r1;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}
// Flèche qui part de (x, y) dans la direction `deg` (0 = vers la droite, 90 = vers le bas)
function arrowPts(x, y, len, deg, wd = 26) {
  const a = (deg * Math.PI) / 180,
    c = Math.cos(a),
    s = Math.sin(a);
  const q = (u, v) => [x + u * c - v * s, y + u * s + v * c];
  const h = wd * 1.9;
  return [
    q(0, -wd / 2),
    q(len - h, -wd / 2),
    q(len - h, -wd * 1.25),
    q(len, 0),
    q(len - h, wd * 1.25),
    q(len - h, wd / 2),
    q(0, wd / 2),
  ];
}

// --- Un morceau de papier ---
function P(o) {
  const pts = o.pts;
  let x0 = 1e9,
    y0 = 1e9,
    x1 = -1e9,
    y1 = -1e9;
  for (const [x, y] of pts) {
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    x1 = Math.max(x1, x);
    y1 = Math.max(y1, y);
  }
  const pad = o.pad ?? 36;
  const w = x1 - x0,
    h = y1 - y0;
  const d = poly(pts.map(([x, y]) => [x - x0, y - y0]));
  uid++;
  const el = document.createElement("div");
  el.className = "pc";
  el.style.left = f1(x0 - pad) + "px";
  el.style.top = f1(y0 - pad) + "px";
  el.style.width = f1(w + 2 * pad) + "px";
  el.style.height = f1(h + 2 * pad) + "px";
  const piv = o.pivot ? [o.pivot[0] - x0 + pad, o.pivot[1] - y0 + pad] : [w / 2 + pad, h / 2 + pad];
  el.style.transformOrigin = `${f1(piv[0])}px ${f1(piv[1])}px`;
  const lift = o.lift ?? 5;
  if (lift)
    el.style.filter = `drop-shadow(${f1(lift * 0.6)}px ${f1(lift)}px ${f1(lift * 0.7)}px rgba(40,22,6,${o.shA ?? 0.45}))`;
  const tear = o.torn ? ` filter="url(#tear${o.torn})"` : "";
  const stock = ` filter="url(#st-${o.stock || "fine"})"`;
  const extra = o.extra ? `<g clip-path="url(#cP)">${o.extra(w, h)}</g>` : "";
  const art = o.art ? `<g transform="translate(${f1(-x0)} ${f1(-y0)})">${o.art}</g>` : "";
  const dk = o.dk || [-2, -6];
  const white =
    o.torn && o.deckle !== false
      ? `<path d="${d}" transform="translate(${dk[0]} ${dk[1]})" fill="#f6f0e2" stroke="#f6f0e2" stroke-width="${o.dw ?? 8}" stroke-linejoin="round" filter="url(#tearW)"/>`
      : "";
  const html =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${f1(w + 2 * pad)}" height="${f1(h + 2 * pad)}" viewBox="${-pad} ${-pad} ${f1(w + 2 * pad)} ${f1(h + 2 * pad)}"${o.alpha ? ` style="opacity:${o.alpha}"` : ""}>` +
    `<defs><clipPath id="cP"><path d="${d}"/></clipPath></defs>${white}<g${tear}><g${stock}><path d="${d}" fill="${o.fill}"/>${extra}${o.over ? o.over(w, h) : ""}${art}</g></g></svg>`;
  // Chaque papier est fabriqué une seule fois en image (scripts/bake.cjs), puis seulement déplacé.
  const key = hashStr(html + "|" + (el.style.filter || ""));
  if (window.__BAKE)
    window.__BAKE[key] = {
      html,
      shadow: el.style.filter || "",
      w: Math.ceil(w + 2 * pad),
      h: Math.ceil(h + 2 * pad),
    };
  el.style.filter = "";
  el.innerHTML = `<img src="assets/pieces/${key}.png" width="${f1(w + 2 * pad)}" height="${f1(h + 2 * pad)}" alt="">`;
  const L = o.layer === "fixed" ? FIXED : CUR.layers[o.layer || "world"];
  L.el.appendChild(el);
  const size = Math.max(w, h);
  const p = {
    el,
    sc: o.layer === "fixed" ? null : CUR,
    k: L.k,
    y0: (o.span ? o.span[0] : y0) - 260,
    y1: (o.span ? o.span[1] : y1) + 260,
    seed: o.seed ?? uid * 7.3,
    rot: o.rot || 0,
    tin: o.tin,
    tout: o.tout,
    from: o.from || [0, -50, 10],
    anim: o.anim,
    alt: o.alt,
    press: o.press,
    boil: o.boil ?? (size > 900 ? 0.7 : 1.3),
    rb: o.rb ?? 0.35 * Math.min(1, 120 / size),
  };
  if (o.tin != null && o.snd !== false) SFX_LOG.push([o.tin, o.snd || "tic"]);
  pieces.push(p);
  return p;
}

// Étiquette en papier quadrillé, tenue par un bout de ruban
function label(x, y, text, o = {}) {
  const fs = o.fs ?? 50;
  const w = o.w ?? text.length * fs * 0.54 + 80;
  const h = fs * 1.75;
  const base = {
    layer: o.layer,
    tin: o.tin,
    tout: o.tout,
    from: o.from || [70, -30, 9],
    rot: o.rot ?? -2,
    seed: x * 1.7 + y,
    pivot: [x + w / 2, y + h / 2],
  };
  P({
    ...base,
    snd: o.snd ?? "pop",
    pts: rect(x, y, w, h, x + y, 4),
    fill: o.fill || "#f7f0dc",
    lift: 7,
    extra: (W, H) => `<rect width="${W}" height="${H}" fill="url(#p-grid)" opacity=".5"/>`,
    over: (W, H) =>
      `<text x="${W / 2}" y="${H / 2 + fs * 0.35}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${o.ink || INK}">${text}</text>`,
  });
  const tx = x + w * 0.5 - 55,
    ty = y - 20;
  P({
    ...base,
    snd: false,
    pts: [
      [tx, ty + 4],
      [tx + 8, ty - 2],
      [tx + 102, ty],
      [tx + 110, ty + 6],
      [tx + 104, ty + 38],
      [tx + 112, ty + 44],
      [tx + 6, ty + 42],
      [tx - 2, ty + 36],
    ],
    fill: "#ead9a6",
    alpha: 0.82,
    lift: 2,
    shA: 0.3,
  });
}
// Plaque de carton du fond
const board = (layer, y, h) =>
  P({
    layer,
    pts: rect(0, y, 1920, h),
    fill: "#c4ab88",
    stock: "board",
    lift: 0,
    pad: 0,
    boil: 0,
    rb: 0,
  });
const tape = (x, y, rot, layer) =>
  P({
    layer,
    pts: rect(x, y, 120, 40, x, 3),
    fill: "#ead9a6",
    alpha: 0.85,
    lift: 2,
    rot,
    boil: 0.3,
  });

// Lettres découpées façon « lettre anonyme »
const LCOL = [
  ["#e4572e", "#fff6e0"],
  ["#f2b134", INK],
  ["#2f6f8f", "#fff6e0"],
  ["#f7f0dc", INK],
  ["#3a9d6e", "#fff6e0"],
  ["#d9486e", "#fff6e0"],
  ["#2b2b2b", "#ffd84a"],
];
function letters(text, x, y, o = {}) {
  const k = (o.size ?? 78) / 78;
  let n = o.n0 ?? 0;
  for (const ch of text) {
    if (ch === " ") {
      x += 44 * k;
      continue;
    }
    const narrow = "'-il!.:".includes(ch);
    const tw = (narrow ? 50 : 76) * k,
      th = (102 + (rnd(n) - 0.5) * 10) * k;
    const [bg, fg] = (o.col || LCOL)[(n * 3 + (o.shift ?? 0)) % (o.col || LCOL).length];
    const yy = y + (rnd(n + 9) - 0.5) * 14 * k;
    const i = n;
    P({
      layer: o.layer,
      pts: rect(x, yy, tw, th, n * 5, 4 * k),
      fill: bg,
      stock: n % 3 ? "fine" : "sugar",
      lift: 6,
      rot: (rnd(n + 3) - 0.5) * 11,
      tin: o.tin != null ? o.tin + (i - (o.n0 ?? 0)) * (o.dt ?? 0.067) : undefined,
      tout: o.tout,
      snd: (i - (o.n0 ?? 0)) % 4 === 0 ? "tic" : false,
      from: [0, -46, 16 * (n % 2 ? 1 : -1)],
      over: (w, h) =>
        `<text x="${w / 2}" y="${h / 2 + 27 * k}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${78 * k}" fill="${fg}">${ch}</text>`,
    });
    x += tw + 8 * k;
    n++;
  }
  return n;
}

// Papier journal : colonnes de faux texte illisible
const newsprint = (w, h) => {
  let s = `<g transform="rotate(-5 ${w / 2} ${h / 2})" fill="#33302c" opacity=".36">`;
  let k = 0;
  for (let cx = -160; cx < w + 160; cx += 300)
    for (let y = -90; y < h + 90; y += 13) {
      if (rnd(cx + y * 0.37) < 0.035) {
        s += `<rect x="${cx}" y="${y}" width="${f1(150 + rnd(k++) * 100)}" height="18"/>`;
        y += 16;
        continue;
      }
      let x = cx;
      while (x < cx + 262) {
        const ww = 10 + rnd(k++) * 42;
        s += `<rect x="${f1(x)}" y="${y}" width="${f1(Math.min(ww, cx + 268 - x))}" height="5.5"/>`;
        x += ww + 7;
      }
    }
  return s + "</g>";
};
const dots = (id, op) => (w, h) =>
  `<rect width="${w}" height="${h}" fill="url(#${id})" opacity="${op}"/>`;

// --- Caméra : liste de [temps, valeur] ; « e » = déplacement adouci, sinon dérive lente ---
function track(keys) {
  return (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const u = lin(t, keys[i - 1][0], keys[i][0]);
        return keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * (keys[i][2] === "e" ? ease(u) : u);
      }
    }
    return keys[keys.length - 1][1];
  };
}
