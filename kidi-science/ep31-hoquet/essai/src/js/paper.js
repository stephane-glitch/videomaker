/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs : ces fonctions servent aux autres fragments */
// Moteur « papier découpé », deuxième version.
// Chaque morceau de papier est fabriqué une fois en image (grain, déchirure) avec, à part, son ombre portée.
// À chaque pose, le morceau bouge et son ombre s'écarte et s'adoucit quand il se soulève du carton.
const TAU = Math.PI * 2;
const FPS = 15; // « sur deux » ; les actions très rapides passent « sur un » (voir `ones`)
const rnd = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lin = (t, a, b) => clamp((t - a) / (b - a));
const ease = (u) => u * u * (3 - 2 * u);
const E = (t, a, b) => ease(lin(t, a, b));
const lerp = (a, b, u) => a + (b - a) * u;
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
const LIGHT = [0.55, 0.9]; // la lampe est en haut à gauche : les ombres tombent en bas à droite

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
const sfx = (t, kind = "pop") => SFX_LOG.push([t, kind]);

// --- Décors (« sets ») et calques ---
const SETS = {};
let CUR = null;
let uid = 0;
function set(id, layers) {
  const root = document.createElement("div");
  root.className = "scene";
  root.style.visibility = "hidden";
  document.getElementById("sets").appendChild(root);
  CUR = SETS[id] = {
    id,
    root,
    layers: {},
    pieces: [],
    cam: () => ({ x: 960, y: 540, z: 1 }),
    jump: () => 0,
    shake: () => [0, 0],
  };
  for (const [name, k, blur] of layers) {
    const el = document.createElement("div");
    el.className = "layer";
    el.style.transformOrigin = "0 0";
    if (blur) el.style.filter = `blur(${blur}px)`;
    root.appendChild(el);
    CUR.layers[name] = { el, k };
  }
  return CUR;
}
const FIXED = {
  id: "fixed",
  root: null,
  layers: { fixed: { el: document.getElementById("L-fixed"), k: 0 } },
  pieces: [],
};

// --- Formes ---
const poly = (pts) => "M" + pts.map((p) => f1(p[0]) + " " + f1(p[1])).join("L") + "Z";
// contour arrondi passant au milieu des points (formes organiques : poumon, nuages…)
function smoothD(pts) {
  const n = pts.length,
    m = (i) => [
      (pts[i % n][0] + pts[(i + 1) % n][0]) / 2,
      (pts[i % n][1] + pts[(i + 1) % n][1]) / 2,
    ];
  let d = `M${f1(m(n - 1)[0])} ${f1(m(n - 1)[1])}`;
  for (let i = 0; i < n; i++)
    d += `Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(m(i)[0])} ${f1(m(i)[1])}`;
  return d + "Z";
}
function blob(cx, cy, rx, ry, n, seed, jag = 0.1) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU,
      r = 1 + (rnd(seed + i) - 0.5) * 2 * jag;
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return pts;
}
function band(x0, x1, y0, y1, seed, amp = 18, stepx = 95) {
  const pts = [],
    n = Math.round((x1 - x0) / stepx);
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
// bande de largeur w (de w0 à w1) autour d'une ligne médiane
function strip(cl, w0, w1 = w0) {
  const L = [],
    R = [],
    n = cl.length;
  for (let i = 0; i < n; i++) {
    const a = cl[Math.max(0, i - 1)],
      b = cl[Math.min(n - 1, i + 1)],
      dx = b[0] - a[0],
      dy = b[1] - a[1],
      l = Math.hypot(dx, dy) || 1,
      w = lerp(w0, w1, i / (n - 1)) / 2;
    L.push([cl[i][0] - (dy / l) * w, cl[i][1] + (dx / l) * w]);
    R.unshift([cl[i][0] + (dy / l) * w, cl[i][1] - (dx / l) * w]);
  }
  return L.concat(R);
}
// point à la fraction u d'une ligne brisée
function along(cl, u) {
  const seg = [];
  let tot = 0;
  for (let i = 1; i < cl.length; i++) {
    const l = Math.hypot(cl[i][0] - cl[i - 1][0], cl[i][1] - cl[i - 1][1]);
    seg.push(l);
    tot += l;
  }
  let d = clamp(u) * tot;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? d / seg[i] : 0;
      return [
        lerp(cl[i][0], cl[i + 1][0], k),
        lerp(cl[i][1], cl[i + 1][1], k),
        (Math.atan2(cl[i + 1][1] - cl[i][1], cl[i + 1][0] - cl[i][0]) * 180) / Math.PI,
      ];
    }
    d -= seg[i];
  }
  return [cl[0][0], cl[0][1], 0];
}
const dots = (id, op) => (w, h) =>
  `<rect width="${w}" height="${h}" fill="url(#${id})" opacity="${op}"/>`;

// --- Un morceau de papier ---
// o : pts (contour), smooth, fill, stock, torn, deckle, extra(w,h), over(w,h), art (SVG en coordonnées du décor),
//     alpha, pivot, rot, layer, lift (hauteur au-dessus du carton), jmp (sensibilité aux sauts « hic »),
//     tin/tout/from (entrée et sortie), anim(t, pose) → {x, y, r, s, sx, sy, o, lift}, show(t, pose) → vrai/faux
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
  const pad = o.pad ?? 36,
    w = x1 - x0,
    h = y1 - y0,
    W = Math.ceil(w + 2 * pad),
    H = Math.ceil(h + 2 * pad);
  const loc = pts.map(([x, y]) => [x - x0, y - y0]);
  const d = o.smooth ? smoothD(loc) : poly(loc);
  uid++;
  const tear = o.torn ? ` filter="url(#tear${o.torn})"` : "";
  const stock = ` filter="url(#st-${o.stock || "fine"})"`;
  const extra = o.extra ? `<g clip-path="url(#cP)">${o.extra(w, h)}</g>` : "";
  const art = o.art
    ? `<g clip-path="url(#cP)"><g transform="translate(${f1(-x0)} ${f1(-y0)})">${o.art}</g></g>`
    : "";
  const free = o.free ? `<g transform="translate(${f1(-x0)} ${f1(-y0)})">${o.free}</g>` : "";
  const dk = o.dk || [-2, -6];
  const white =
    o.torn && o.deckle !== false
      ? `<path d="${d}" transform="translate(${dk[0]} ${dk[1]})" fill="#f6f0e2" stroke="#f6f0e2" stroke-width="${o.dw ?? 8}" stroke-linejoin="round" filter="url(#tearW)"/>`
      : "";
  const body = `<defs><clipPath id="cP"><path d="${d}"/></clipPath></defs>${white}<g${tear}><g${stock}><path d="${d}" fill="${o.fill}"/>${extra}${o.over ? o.over(w, h) : ""}${art}</g></g>${free}`;
  const head = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${-pad} ${-pad} ${W} ${H}">`;
  const html = head + (o.alpha ? `<g opacity="${o.alpha}">${body}</g>` : body) + "</svg>";
  const key = hashStr(html);
  const lift = o.lift ?? 6;
  const hasSh = lift > 0 || o.shadow;
  if (window.__BAKE) {
    window.__BAKE[key] = { html, shadow: "", w: W, h: H };
    if (hasSh)
      window.__BAKE[key + "s"] = {
        html:
          head +
          `<g filter="url(#toSh)" opacity="${o.alpha ? Math.min(1, o.alpha + 0.2) : 1}">${body}</g></svg>`,
        shadow: "",
        w: W,
        h: H,
      };
  }
  const el = document.createElement("div");
  el.className = "pc";
  el.style.left = f1(x0 - pad) + "px";
  el.style.top = f1(y0 - pad) + "px";
  el.style.width = W + "px";
  el.style.height = H + "px";
  const piv = o.pivot ? [o.pivot[0] - x0 + pad, o.pivot[1] - y0 + pad] : [w / 2 + pad, h / 2 + pad];
  el.style.transformOrigin = `${f1(piv[0])}px ${f1(piv[1])}px`;
  el.innerHTML =
    (hasSh
      ? `<img class="sh" src="assets/pieces/${key}s.png" width="${W}" height="${H}" alt="">`
      : "") + `<img src="assets/pieces/${key}.png" width="${W}" height="${H}" alt="">`;
  const S = o.layer === "fixed" ? FIXED : CUR;
  S.layers[o.layer === "fixed" ? "fixed" : o.layer || "world"].el.appendChild(el);
  const size = Math.max(w, h);
  const p = {
    el,
    sh: hasSh ? el.firstChild : null,
    seed: o.seed ?? uid * 7.3,
    rot: o.rot || 0,
    lift,
    jmp: o.jmp ?? (size > 1200 ? 0.15 : 1),
    tin: o.tin,
    tout: o.tout,
    from: o.from || [0, -50, 10],
    anim: o.anim,
    show: o.show,
    boil: o.boil ?? (size > 900 ? 0.6 : 1.2),
    rb: o.rb ?? 0.35 * Math.min(1, 120 / size),
    last: "",
  };
  if (o.tin != null && o.snd !== false) sfx(o.tin, o.snd || "tic");
  S.pieces.push(p);
  return p;
}

// Étiquette en papier quadrillé tenue par un ruban (une seule à la fois à l'écran)
function label(x, y, text, o = {}) {
  const fs = o.fs ?? 56,
    w = o.w ?? text.length * fs * 0.54 + 90,
    h = fs * 1.75;
  const base = {
    layer: o.layer ?? "fixed",
    tin: o.tin,
    tout: o.tout,
    from: o.from || [80, -40, 10],
    rot: o.rot ?? -2,
    seed: x * 1.7 + y,
    pivot: [x + w / 2, y + h / 2],
    jmp: 0,
  };
  P({
    ...base,
    snd: o.snd ?? "pop",
    pts: rect(x, y, w, h, x + y, 4),
    fill: o.fill || "#f7f0dc",
    lift: 9,
    extra: (W, H) => `<rect width="${W}" height="${H}" fill="url(#p-grid)" opacity=".5"/>`,
    over: (W, H) =>
      `<text x="${W / 2}" y="${H / 2 + fs * 0.35}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${o.ink || INK}">${text}</text>`,
  });
  const tx = x + w * 0.5 - 60,
    ty = y - 22;
  P({
    ...base,
    snd: false,
    pts: [
      [tx, ty + 4],
      [tx + 8, ty - 2],
      [tx + 112, ty],
      [tx + 120, ty + 6],
      [tx + 114, ty + 40],
      [tx + 122, ty + 46],
      [tx + 6, ty + 44],
      [tx - 2, ty + 38],
    ],
    fill: "#ead9a6",
    alpha: 0.82,
    lift: 3,
  });
}
const tape = (x, y, rot, layer) =>
  P({
    layer,
    pts: rect(x, y, 130, 42, x, 3),
    fill: "#ead9a6",
    alpha: 0.82,
    lift: 2,
    rot,
    boil: 0.3,
    jmp: 0.3,
  });
const brass = (x, y, layer, r = 15) =>
  P({
    layer,
    pts: blob(x, y, r, r, 12, x + y, 0.02),
    smooth: true,
    fill: "#d4a640",
    lift: 3,
    jmp: 0.2,
    over: (w, h) =>
      `<circle cx="${w / 2 - 4}" cy="${h / 2 - 4}" r="5" fill="#fff0b8" opacity=".8"/><path d="M${w / 2 - 7} ${h / 2}h14" stroke="#8a6a1c" stroke-width="3"/>`,
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
  const out = [];
  for (const ch of text) {
    if (ch === " ") {
      x += 44 * k;
      continue;
    }
    const narrow = "'-il!.:".includes(ch);
    const tw = (narrow ? 50 : 76) * k,
      th = (102 + (rnd(n) - 0.5) * 10) * k;
    const [bg, fg] = (o.col || LCOL)[(n * 3 + (o.shift ?? 0)) % (o.col || LCOL).length];
    const yy = y + (rnd(n + 9) - 0.5) * 14 * k,
      i = n - (o.n0 ?? 0);
    out.push(
      P({
        layer: o.layer,
        pts: rect(x, yy, tw, th, n * 5 + (o.seed || 0), 4 * k),
        fill: bg,
        stock: n % 3 ? "fine" : "sugar",
        lift: 7,
        jmp: o.jmp ?? 0.6,
        rot: (rnd(n + 3 + (o.seed || 0)) - 0.5) * 12,
        tin: o.tin != null ? o.tin + i * (o.dt ?? 0.067) : undefined,
        tout: o.tout != null ? o.tout + i * (o.dto ?? 0) : undefined,
        snd: i % 3 === 0 ? o.snd || "tic" : false,
        from: o.from || [0, -60, 18 * (n % 2 ? 1 : -1)],
        anim: o.anim ? (t, s) => o.anim(t, s, i) : undefined,
        over: (w, h) =>
          `<text x="${w / 2}" y="${h / 2 + 27 * k}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${78 * k}" fill="${fg}">${ch}</text>`,
      }),
    );
    x += tw + 8 * k;
    n++;
  }
  return out;
}

// Caméra : liste de [temps, {x, y, z}] (x, y = point visé au centre de l'image), reliés en douceur
function camKeys(keys) {
  return (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++)
      if (t <= keys[i][0]) {
        const u =
          keys[i][2] === "lin"
            ? lin(t, keys[i - 1][0], keys[i][0])
            : E(t, keys[i - 1][0], keys[i][0]);
        const a = keys[i - 1][1],
          b = keys[i][1];
        return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u) };
      }
    return keys[keys.length - 1][1];
  };
}
// saut de tout le décor (le « hic ») : forme du saut, pose par pose après l'instant t0
const JUMP = [0, 1, 0.86, 0.55, 0.25, 0.08, 0];
// times : liste d'instants, ou de paires [instant, force]
const jumpAt = (times) => (t) => {
  let j = 0;
  for (const e of times) {
    const [t0, a] = Array.isArray(e) ? e : [e, 1],
      k = Math.floor((t - t0) * 30 + 1e-4);
    if (k >= 0 && k < JUMP.length * 2) j = Math.max(j, a * (JUMP[Math.floor(k / 2)] ?? 0));
  }
  return j;
};
