/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs : ces fonctions servent aux autres fragments */
// Boîte à outils « dessin animé classique » : décors peints à l'aquarelle (fabriqués une fois en image),
// personnages redessinés à chaque pose comme des celluloïds encrés et peints.
const TAU = Math.PI * 2;
const FPS = 15; // animation « sur deux » ; les actions rapides sont calculées à chaque image
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
// apparition « pop » avec un léger dépassement
const pop = (t, t0, d = 0.36) => {
  const u = lin(t, t0, t0 + d);
  return u === 0 ? 0 : 1 - Math.pow(1 - u, 3) + 0.22 * Math.sin(u * Math.PI) * (1 - u);
};
const INK = "#3a2a22";

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

// --- Décors : chaque plan est fabriqué une fois en image (scripts/bake.cjs) ---
const BW = 2304,
  BH = 1296;
const SETS = {};
function mkSet(name, layers) {
  const el = document.createElement("div");
  el.className = "set";
  el.style.visibility = "hidden";
  const imgs = layers.map(([k, inner]) => {
    const html = `<svg xmlns="http://www.w3.org/2000/svg" width="${BW}" height="${BH}" viewBox="0 0 ${BW} ${BH}">${inner}</svg>`;
    const key = hashStr(html);
    if (window.__BAKE) window.__BAKE[key] = { html, shadow: "", w: BW, h: BH };
    const img = document.createElement("img");
    img.src = `assets/pieces/${key}.png`;
    img.width = BW;
    img.height = BH;
    img.alt = "";
    el.appendChild(img);
    return [img, k];
  });
  document.getElementById("bg").appendChild(el);
  SETS[name] = { el, imgs };
}

// --- Dessin des celluloïds (chaînes SVG) ---
const PA = (d, fill, sw = 5, extra = "") =>
  `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const LN = (d, col = INK, sw = 4, extra = "") =>
  `<path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const EL = (cx, cy, rx, ry, fill, sw = 5, rot = 0) =>
  `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}"${sw ? ` stroke="${INK}" stroke-width="${sw}"` : ""}${rot ? ` transform="rotate(${f1(rot)} ${f1(cx)} ${f1(cy)})"` : ""}/>`;
const G = (inner, x, y, s = 1, rot = 0, sy) =>
  `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s.toFixed(3)}${sy != null ? " " + sy.toFixed(3) : ""})">${inner}</g>`;
const OP = (inner, o) =>
  o >= 1 ? inner : o <= 0 ? "" : `<g opacity="${o.toFixed(2)}">${inner}</g>`;
let MID = 0; // compteur d'identifiants, remis à zéro à chaque image

// Feuille : tige à gauche, pointe à droite ; `bites` = morsures [x, y, r] dans le repère de la feuille
const leafD = (L, W) =>
  `M${-L / 2} 0C${-L / 4} ${-W} ${L / 4} ${-W * 0.9} ${L / 2} 0C${L / 4} ${W * 0.9} ${-L / 4} ${W} ${-L / 2} 0Z`;
function leaf(cx, cy, L, W, rot, o = {}) {
  const fill = o.fill || "#74c056",
    dark = o.dark || "#4f9f43",
    vein = o.vein || "#3f8a35";
  let veins = `M${-L / 2} 0H${L / 2}`;
  for (let i = 1; i <= 5; i++) {
    const x = -L / 2 + (L * i) / 6.5,
      w = W * 0.62 * Math.sin((i / 6.5) * Math.PI);
    veins += `M${f1(x)} 0l${f1(L * 0.08)} ${f1(-w)}M${f1(x)} 0l${f1(L * 0.08)} ${f1(w)}`;
  }
  let body =
    PA(leafD(L, W), fill, o.sw ?? 5) +
    `<path d="M${-L / 2} 0C${-L / 4} ${W} ${L / 4} ${W * 0.9} ${L / 2} 0Z" fill="${dark}" opacity=".55"/>` +
    LN(veins, vein, 3) +
    LN(`M${-L / 2 - L * 0.12} ${W * 0.04}L${-L / 2} 0`, INK, 7);
  if (o.bites && o.bites.length) {
    const id = "m" + MID++;
    const holes = o.bites
      .map(([x, y, r]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="#000"/>`)
      .join("");
    const rims = o.bites
      .map(
        ([x, y, r]) =>
          `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="none" stroke="${INK}" stroke-width="5"/>`,
      )
      .join("");
    const cid = "c" + MID++;
    body = `<defs><mask id="${id}"><rect x="${-L}" y="${-W * 2}" width="${L * 2}" height="${W * 4}" fill="#fff"/>${holes}</mask><clipPath id="${cid}"><path d="${leafD(L, W)}"/></clipPath></defs><g mask="url(#${id})">${body}<g clip-path="url(#${cid})">${rims}</g></g>`;
  }
  return G(body, cx, cy, 1, rot);
}
// Branche : un trait brun épais avec son contour d'encre
const branch = (d, w = 34, col = "#9a6a43") =>
  LN(d, INK, w + 9) +
  LN(d, col, w) +
  LN(d, "#b98558", w * 0.3, `transform="translate(0 ${-w * 0.2})"`);

// Chenille : `pts` = centres des anneaux, de la queue vers la tête
function cat(pts, r, o = {}) {
  const n = pts.length,
    col = o.col || "#8fd04e",
    stripe = o.stripe || "#f4d03f",
    down = o.down || [0, 1],
    K = Math.min(5, Math.max(1.6, r * 0.13));
  let s = "";
  if (o.legs !== false)
    for (let i = 0; i < n - 1; i++) {
      const [x, y] = pts[i],
        sw = Math.sin((o.walk || 0) * TAU + i * 1.3) * r * 0.22;
      s += LN(
        `M${f1(x + down[0] * r * 0.6)} ${f1(y + down[1] * r * 0.6)}l${f1(down[0] * r * 0.62 + sw * down[1])} ${f1(down[1] * r * 0.62 + sw * down[0])}`,
        INK,
        r * 0.24,
      );
    }
  for (let i = 0; i < n - 1; i++) {
    const [x, y] = pts[i],
      k = i === 0 ? 0.82 : 1;
    s += EL(x, y, r * k, r * k * (o.sq || 1), col, o.husk ? 3 : K);
    if (!o.husk)
      s +=
        EL(x, y - r * 0.05, r * 0.2, r * 0.7 * k, stripe, 0) +
        `<circle cx="${f1(x)}" cy="${f1(y - r * 0.5)}" r="${f1(r * 0.09)}" fill="${INK}"/>`;
    if (o.pull && i >= n - 5 && i <= n - 3)
      s +=
        EL(x, y, r * 1.04, r * 1.04, "#e2452f", K) +
        LN(
          `M${f1(x - r * 0.5)} ${f1(y - r * 0.2)}h${f1(r)}M${f1(x - r * 0.5)} ${f1(y + r * 0.3)}h${f1(r)}`,
          "#f6b3a7",
          5,
        );
  }
  if (o.husk) return OP(s, 0.75);
  // la tête
  const [hx, hy] = pts[n - 1],
    R = r * 1.2,
    m = o.mouth || 0,
    look = o.look || [0, 0];
  let h = LN(
    `M${-R * 0.3} ${-R * 0.85}q${-R * 0.2} ${-R * 0.6} ${-R * 0.5} ${-R * 0.72}M${R * 0.3} ${-R * 0.85}q${R * 0.2} ${-R * 0.6} ${R * 0.5} ${-R * 0.72}`,
    INK,
    R * 0.11,
  );
  h += `<circle cx="${f1(-R * 0.82)}" cy="${f1(-R * 1.6)}" r="${f1(R * 0.13)}" fill="${INK}"/><circle cx="${f1(R * 0.82)}" cy="${f1(-R * 1.6)}" r="${f1(R * 0.13)}" fill="${INK}"/>`;
  h += EL(0, 0, R, R * (o.hsq || 1), o.head || "#a9de62", K);
  h += `<circle cx="${f1(-R * 0.62)}" cy="${f1(R * 0.28)}" r="${f1(R * 0.2)}" fill="#f4978e" opacity=".75"/><circle cx="${f1(R * 0.62)}" cy="${f1(R * 0.28)}" r="${f1(R * 0.2)}" fill="#f4978e" opacity=".75"/>`;
  for (const sx of [-1, 1]) {
    if (o.blink)
      h += LN(
        `M${f1(sx * R * 0.38 - R * 0.2)} ${f1(-R * 0.12)}q${f1(R * 0.2)} ${f1(R * 0.2)} ${f1(R * 0.4)} 0`,
        INK,
        R * 0.1,
      );
    else
      h +=
        EL(sx * R * 0.38, -R * 0.14, R * 0.25, R * (o.wide ? 0.36 : 0.31), "#fff", K * 0.8) +
        `<circle cx="${f1(sx * R * 0.38 + look[0] * R * 0.1)}" cy="${f1(-R * 0.1 + look[1] * R * 0.12)}" r="${f1(R * 0.14)}" fill="${INK}"/><circle cx="${f1(sx * R * 0.38 + look[0] * R * 0.1 - R * 0.05)}" cy="${f1(-R * 0.17 + look[1] * R * 0.12)}" r="${f1(R * 0.05)}" fill="#fff"/>`;
  }
  if (o.sad)
    h += LN(
      `M${f1(-R * 0.22)} ${f1(R * 0.5)}q${f1(R * 0.22)} ${f1(-R * 0.2)} ${f1(R * 0.44)} 0`,
      INK,
      R * 0.1,
    );
  else if (m > 0.05) h += EL(0, R * 0.44, R * 0.2, R * 0.22 * m, "#8a2f2a", K * 0.8);
  else
    h += LN(
      `M${f1(-R * 0.24)} ${f1(R * 0.4)}q${f1(R * 0.24)} ${f1(R * 0.24)} ${f1(R * 0.48)} 0`,
      INK,
      R * 0.1,
    );
  return s + G(h, hx, hy, 1, o.face || 0);
}
// Pose « qui rampe » : la tête est en (hx, hy), le corps suit vers l'arrière avec une petite vague
function crawl(hx, hy, n, r, phase = 0, dir = 1) {
  const pts = [];
  let x = hx;
  for (let k = 0; k < n; k++) {
    const w = Math.max(0, Math.sin(phase * TAU - k * 0.85));
    pts.unshift([x, hy - (k ? r * 0.55 * w : r * 0.25)]);
    x -= dir * r * (1.22 - 0.22 * w);
  }
  return pts;
}
// Pose « suspendue en J » sous le point d'attache (ax, ay)
function hang(ax, ay, n, r, sway = 0, curl = 1) {
  const sp = r * 1.2,
    Ls = sp * (n - 3.2),
    Ra = sp * 1.5,
    c = Math.cos((sway * Math.PI) / 180),
    s = Math.sin((sway * Math.PI) / 180),
    pts = [];
  for (let k = 0; k < n; k++) {
    const d = r * 0.9 + k * sp;
    let x = 0,
      y = d;
    if (d > Ls) {
      const th = ((d - Ls) / Ra) * curl;
      x = Ra * (1 - Math.cos(th));
      y = Ls + Ra * Math.sin(th);
    }
    pts.push([ax + x * c - y * s, ay + x * s + y * c]);
  }
  return pts;
}
const mixPts = (a, b, u) => a.map((p, i) => [lerp(p[0], b[i][0], u), lerp(p[1], b[i][1], u)]);

// Œuf (le bas est collé à la feuille ; `flip` = pendu sous la feuille)
function egg(x, y, s, o = {}) {
  let e =
    PA("M-22 0C-24 -40 24 -40 22 0Z", o.fill || "#fff3c4", 4) +
    LN("M-10 -4q-4 -16 0 -26M0 -3v-30M10 -4q4 -16 0 -26", "#d9c27a", 2.5);
  if (o.crack)
    e += LN("M-18 -14l8 -6 6 7 7 -8 6 7 8 -5", INK, 3, `stroke-dasharray="${f1(60 * o.crack)} 80"`);
  return G(e, x, y, s, o.rot || 0, o.flip ? -s : s);
}
// Chrysalide suspendue par son fil en (x, y)
function chrys(x, y, s, o = {}) {
  const col = o.col || "#8fd06a",
    hi = o.hi || "#c4ec9a",
    rid = o.rid || "#5fa64a";
  const shape =
    "M0 18C34 22 46 70 30 120C22 160 8 196 0 212C-8 196 -22 160 -30 120C-46 70 -34 22 0 18Z";
  let c = LN("M0 0V20", INK, 6) + PA(shape, col, 5);
  if (o.wing)
    c += `<path d="M4 40C28 52 32 110 12 170C4 150 0 90 4 40Z" fill="#f39a2b" opacity="${f1(o.wing)}"/><path d="M8 60l14 40M6 80l10 50" stroke="${INK}" stroke-width="3" opacity="${f1(o.wing)}" fill="none"/>`;
  c +=
    `<path d="M-14 32C-32 50 -34 100 -22 140C-26 100 -24 60 -14 32Z" fill="${hi}"/>` +
    LN("M-30 96q30 12 60 0M-26 128q26 10 52 0M-18 160q18 8 36 0", rid, 3);
  for (let i = 0; i < 5; i++)
    c += `<circle cx="${-24 + i * 12}" cy="${56 + Math.abs(i - 2) * -2}" r="4" fill="#f2c94c" stroke="${INK}" stroke-width="1.5"/>`;
  if (o.crack)
    c += `<path d="M0 ${f1(212 - 150 * o.crack)}l-7 22 9 18 -8 24 6 ${f1(150 * o.crack)}" fill="none" stroke="${INK}" stroke-width="${f1(3 + 3 * o.crack)}" stroke-linejoin="round"/>`;
  return G(OP(c, o.alpha ?? 1), x, y, s, o.sway || 0);
}
// Papillon vu de dessus. flap : 1 = ailes ouvertes, 0 = fermées ; crumple : 1 = ailes fripées
function bfly(x, y, s, o = {}) {
  const fl = 0.16 + 0.84 * (o.flap ?? 1),
    c = o.crumple || 0,
    A = o.col || "#f39a2b",
    B = "#4a2f22";
  const up = "M8 -22C60 -150 210 -172 232 -72C242 -12 150 30 20 8Z",
    lo = "M12 4C120 18 190 88 152 160C112 212 40 150 10 40Z";
  let w =
    PA(up, B, 5) +
    `<path d="${up}" fill="${A}" transform="translate(18 -8) scale(0.84)"/>` +
    PA(lo, B, 5) +
    `<path d="${lo}" fill="${o.col2 || "#f7b84a"}" transform="translate(14 12) scale(0.82)"/>`;
  w += LN("M22 -16L150 -120M30 -8L196 -70M26 0L170 -6M22 22L120 120M18 30L70 150", "#c9701c", 3);
  for (const [px, py, pr] of [
    [206, -92, 9],
    [222, -58, 7],
    [196, -128, 7],
    [146, 150, 8],
    [118, 178, 6],
    [164, 112, 6],
  ])
    w += `<circle cx="${px}" cy="${py}" r="${pr}" fill="#fff3c4"/>`;
  if (c > 0.05)
    w += LN(
      "M40 -40l30 -14 20 22 34 -20 26 24M40 60l26 -10 18 24 28 -8",
      B,
      3,
      `opacity="${f1(c)}"`,
    );
  const wing = (sx) =>
    `<g transform="scale(${f1(sx * fl * (1 - 0.6 * c))} ${f1(1 - 0.45 * c)}) rotate(${f1(c * 28)})">${w}</g>`;
  let b = wing(1) + wing(-1);
  b +=
    LN("M-5 -84q-16 -40 -42 -52M5 -84q16 -40 42 -52", INK, 4) +
    `<circle cx="-48" cy="-137" r="6" fill="${INK}"/><circle cx="48" cy="-137" r="6" fill="${INK}"/>`;
  if (o.prob > 0.02) b += LN(`M0 -88v${f1(-70 * o.prob)}`, INK, 5);
  else if (o.prob != null) b += LN("M0 -88q-10 -12 0 -18q10 6 2 12", INK, 4);
  b +=
    EL(0, 0, 15, 64, B, 5) +
    LN("M-12 -20h24M-13 4h26M-11 28h22", "#8a5a3c", 3) +
    EL(0, -72, 18, 17, B, 5);
  b += `<circle cx="-8" cy="-76" r="5" fill="#fff"/><circle cx="8" cy="-76" r="5" fill="#fff"/><circle cx="-8" cy="-77" r="2.4" fill="${INK}"/><circle cx="8" cy="-77" r="2.4" fill="${INK}"/>`;
  return G(b, x, y, s, o.rot || 0);
}
// Fleur sur sa tige (le pied en (x, y))
function flower(x, y, h, col, o = {}) {
  const sw = o.sway || 0;
  let f =
    LN(`M0 0Q${f1(sw * 0.4)} ${f1(-h * 0.5)} ${f1(sw)} ${-h}`, "#3f8a35", 9) +
    G(PA(leafD(90, 26), "#74c056", 4), 30, -h * 0.4, 1, -28);
  let p = "";
  for (let i = 0; i < 7; i++) p += G(EL(0, -44, 22, 36, col, 4), 0, 0, 1, (i * 360) / 7);
  f += G(
    p +
      EL(0, 0, 24, 24, "#f4d03f", 4) +
      `<circle cx="-7" cy="-5" r="4" fill="#d99a1d"/><circle cx="8" cy="4" r="4" fill="#d99a1d"/>`,
    sw,
    -h,
    o.s || 1,
    sw * 0.3,
  );
  return G(f, x, y);
}
// Effets : étincelle, petit nuage de poussière, miettes
const spark = (x, y, r, o = 1, col = "#fff8d6") =>
  OP(
    `<path d="M${f1(x)} ${f1(y - r)}Q${f1(x)} ${f1(y)} ${f1(x + r)} ${f1(y)}Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y + r)}Q${f1(x)} ${f1(y)} ${f1(x - r)} ${f1(y)}Q${f1(x)} ${f1(y)} ${f1(x)} ${f1(y - r)}Z" fill="${col}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    o,
  );
const puff = (x, y, r, o = 1) =>
  OP(
    EL(x, y, r, r * 0.8, "#fff8e8", 3) +
      EL(x + r * 0.9, y + r * 0.2, r * 0.6, r * 0.5, "#fff8e8", 3) +
      EL(x - r * 0.8, y + r * 0.25, r * 0.55, r * 0.45, "#fff8e8", 3),
    o,
  );
// salve d'étincelles autour d'un point, entre t0 et t0 + d
function sparks(t, t0, x, y, R, n = 6, d = 0.7) {
  const u = lin(t, t0, t0 + d);
  if (u <= 0 || u >= 1) return "";
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + rnd(i + x) * 0.8,
      rr = R * (0.5 + 0.7 * u);
    s += spark(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 16 * (1 - u) + 6, 1 - u * u);
  }
  return s;
}
// Bandeau peint avec un mot (les « notes » de la série)
function cap(text, x, y, t, t0, o = {}) {
  const p = pop(t, t0);
  if (p <= 0 || (o.t1 && t > o.t1)) return "";
  const fs = o.fs || 46,
    w = text.length * fs * 0.54 + 70,
    h = fs * 1.7;
  return G(
    `<rect x="${-w / 2}" y="${-h / 2}" width="${f1(w)}" height="${f1(h)}" rx="${h * 0.3}" fill="${o.fill || "#fff6dc"}" stroke="${INK}" stroke-width="5"/><text x="0" y="${f1(fs * 0.35)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${o.ink || INK}">${text}</text>`,
    x,
    y,
    p,
    o.rot ?? -2,
  );
}

// --- Scènes ---
const SC = [];
// set : décor ; cam(t) → [décalage x, décalage y, zoom] ; draw(t, pose, tempsLocal) → SVG des celluloïds
const sceneDef = (id, set, cam, draw, o = {}) =>
  SC.push({ id, set, cam, draw, a: scn(id).start, b: scn(id).end, ...o });
