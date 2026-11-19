/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs : ces fonctions servent aux autres fragments */
// Boîte à outils commune : couleurs, temps, repères de voix, engrenages, étiquettes.
const C = {
  ink: "#1F2A44",
  paper: "#FFF8EC",
  top: "#F4F6FA",
  side: "#D3DAE6",
  inner: "#B9C3D3",
  cut: "#F6E7C8",
  hatch: "#E6CF9F",
  blue: "#2F5BD3",
  blueL: "#5F86F0",
  blueD: "#1E3F9E",
  fire: "#FF8A1F",
  hot: "#FFD23F",
  spark: "#FFE14D",
  air: "#8FD3FF",
  smoke: "#A7AFBA",
  metal: "#9AA6B8",
};
const $ = (s) => document.querySelector(s);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, u) => a + (b - a) * u;
const easeIO = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const easeO = (u) => 1 - Math.pow(1 - u, 3);
const lin = (t, a, b) => clamp((t - a) / (b - a));
const ramp = (t, a, b) => easeIO(lin(t, a, b));
const rampO = (t, a, b) => easeO(lin(t, a, b));
const f2 = (n) => Math.round(n * 100) / 100;
const TAU = Math.PI * 2;
const mixHex = (a, b, u) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a),
    B = p(b);
  return "rgb(" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(u)))).join(",") + ")";
};

// --- Repères : moment (en secondes du film) où un mot est prononcé ---
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

// --- Timeline principale et dessin image par image ---
const tl = gsap.timeline({ paused: true });
const DRAWS = [];
// Enregistre une fonction de dessin appelée à chaque image tant que la scène est à l'écran.
const onDraw = (sceneId, fn) =>
  DRAWS.push({ a: scn(sceneId).start - 0.2, b: scn(sceneId).end + 0.2, fn });
const drawAll = () => {
  const t = tl.time();
  for (const d of DRAWS) if (t >= d.a && t <= d.b) d.fn(t);
};

const OUT = "power3.out";
const INN = "power3.in";
// Apparition standard (léger glissement + fondu).
const show = (sel, t, o = {}) =>
  tl.fromTo(
    sel,
    { opacity: 0, x: o.x ?? 0, y: o.y ?? 24, scale: o.s ?? 1 },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: o.d ?? 0.45,
      ease: o.e ?? OUT,
      stagger: o.st ?? 0,
    },
    t,
  );
const pop = (sel, t, o = {}) =>
  tl.fromTo(
    sel,
    { opacity: 0, scale: o.s ?? 0.4 },
    { opacity: 1, scale: 1, duration: o.d ?? 0.4, ease: "back.out(1.7)", stagger: o.st ?? 0 },
    t,
  );
const hide = (sel, t, o = {}) =>
  tl.to(
    sel,
    { opacity: 0, x: o.x ?? 0, y: o.y ?? 0, scale: o.s ?? 1, duration: o.d ?? 0.3, ease: INN },
    t,
  );
// Couture « dans le courant » : sortie vers la gauche, entrée par la droite.
const seam = (a, b) => {
  const cut = scn(b).start;
  tl.to(`#${a}-in`, { x: -240, opacity: 0, duration: 0.32, ease: INN }, cut - 0.32);
  tl.fromTo(
    `#${b}-in`,
    { x: 240, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.5, ease: "power4.out" },
    cut,
  );
};

// --- Engrenage : contour à dents trapézoïdales ---
const gearPath = (cx, cy, r, n, rot, depth) => {
  const d = depth ?? Math.min(r * 0.22, 26);
  const ro = r + d / 2,
    ri = r - d / 2,
    p = TAU / n;
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = rot + i * p;
    const pts = [
      [ri, a - 0.27 * p],
      [ro, a - 0.13 * p],
      [ro, a + 0.13 * p],
      [ri, a + 0.27 * p],
    ];
    for (const [rr, aa] of pts)
      s += `${s ? "L" : "M"}${f2(cx + rr * Math.cos(aa))} ${f2(cy + rr * Math.sin(aa))}`;
  }
  return s + "Z";
};
// Rotation de l'engrenage B pour qu'il engrène avec A (phi = direction de A vers B).
const meshRot = (rotA, nA, nB, phi) => phi + Math.PI - Math.PI / nB - ((rotA - phi) * nA) / nB;
// Engrenage complet (corps, moyeu, repère) en SVG.
const gearSVG = (cx, cy, r, n, rot, fill = C.blue, hub = C.blueD) =>
  `<path d="${gearPath(cx, cy, r, n, rot)}" fill="${fill}" class="ink"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${f2(r * 0.52)}" fill="${hub}" opacity="0.35"/>` +
  `<circle cx="${cx}" cy="${cy}" r="${f2(Math.max(10, r * 0.16))}" fill="#fff" class="ink"/>` +
  `<circle cx="${f2(cx + r * 0.62 * Math.cos(rot))}" cy="${f2(cy + r * 0.62 * Math.sin(rot))}" r="${f2(Math.max(6, r * 0.08))}" fill="#fff" opacity="0.9"/>`;

// --- Étiquette avec trait de rappel : créée une fois au chargement ---
// p = point visé, t = coin du texte, align = "l" (texte à droite du point) ou "r".
const label = (sceneId, id, p, t, title, sub, o = {}) => {
  const host = document.getElementById(`${sceneId}-labels`);
  const svg = host.querySelector("svg");
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", `${id}-ln`);
  // Le trait arrive sur le côté du texte si le point est en dehors, sinon dessous ou dessus.
  const h = sub ? 86 : 48,
    right = o.align === "r";
  let ex, ey;
  if (!right && p[0] < t[0] - 30) [ex, ey] = [t[0] - 14, t[1] + 24];
  else if (right && p[0] > t[0] + 30) [ex, ey] = [t[0] + 14, t[1] + 24];
  else
    [ex, ey] = [
      right ? clamp(p[0], t[0] - 170, t[0] - 20) : clamp(p[0], t[0] + 20, t[0] + 170),
      p[1] > t[1] ? t[1] + h + 8 : t[1] - 8,
    ];
  g.innerHTML =
    `<path d="M${p[0]} ${p[1]} L${ex} ${ey}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/>`;
  svg.appendChild(g);
  const d = document.createElement("div");
  d.id = id;
  d.className = "lab" + (o.align === "r" ? " r" : "");
  d.style.top = t[1] + "px";
  if (o.align === "r") d.style.right = 1920 - t[0] + "px";
  else d.style.left = t[0] + "px";
  d.innerHTML =
    `<div class="lt" style="color:${o.color ?? C.ink}">${title}</div>` +
    (sub ? `<div class="ls">${sub}</div>` : "");
  host.appendChild(d);
  return [`#${id}`, `#${id}-ln`];
};
const showLabel = (sel, t) => {
  tl.fromTo(sel[1], { opacity: 0 }, { opacity: 1, duration: 0.3, ease: OUT }, t);
  tl.fromTo(
    sel[0],
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.4, ease: OUT },
    t + 0.05,
  );
};
const hideLabel = (sel, t) => tl.to(sel, { opacity: 0, duration: 0.25, ease: INN }, t);

// --- Vitesse définie par segments linéaires [[t, v], …] : valeur et intégrale (distance, angle) ---
const rateAt = (kf, t) => {
  if (t <= kf[0][0]) return kf[0][1];
  for (let i = 1; i < kf.length; i++)
    if (t <= kf[i][0])
      return lerp(kf[i - 1][1], kf[i][1], (t - kf[i - 1][0]) / (kf[i][0] - kf[i - 1][0]));
  return kf[kf.length - 1][1];
};
const integ = (kf, t) => {
  let s = 0;
  for (let i = 1; i < kf.length; i++) {
    const [ta, va] = kf[i - 1],
      [tb, vb] = kf[i];
    if (t <= ta) return s;
    const te = Math.min(t, tb),
      ve = va + ((vb - va) * (te - ta)) / (tb - ta);
    s += ((va + ve) / 2) * (te - ta);
    if (t <= tb) return s;
  }
  const [tn, vn] = kf[kf.length - 1];
  return s + vn * (t - tn);
};
const rad = (d) => (d * Math.PI) / 180;

// --- Hasard reproductible (même valeur à chaque rendu) et petites formes ---
const rnd = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// va-et-vient entre 0 et 1 (rebond sur les bords)
const tri = (x) => {
  const u = ((x % 2) + 2) % 2;
  return u < 1 ? u : 2 - u;
};
// boule avec contour et reflet
const ball = (x, y, r, fill, o = {}) =>
  `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}" stroke="${C.ink}" stroke-width="${o.w ?? 4}" opacity="${o.op ?? 1}"/>` +
  (o.plain
    ? ""
    : `<circle cx="${f2(x - r * 0.32)}" cy="${f2(y - r * 0.34)}" r="${f2(r * 0.22)}" fill="#fff" opacity="${f2(0.7 * (o.op ?? 1))}"/>`);
const txt = (x, y, s, size, o = {}) =>
  `<text x="${f2(x)}" y="${f2(y)}" text-anchor="${o.anchor ?? "middle"}" font-family="Fredoka" font-weight="${o.w ?? 600}" font-size="${size}" fill="${o.fill ?? C.ink}" opacity="${o.op ?? 1}">${s}</text>`;
const ATOM = { H: ["#FFFFFF", 30], O: ["#E0455E", 48], C: ["#3A4256", 52], N: ["#5F86F0", 48] };

// --- Chemin fermé ou ouvert fait de segments droits : longueur et point à une distance donnée ---
const mkPath = (pts, closed = true) => {
  const P = closed ? pts.concat([pts[0]]) : pts;
  const seg = [];
  let L = 0;
  for (let i = 1; i < P.length; i++) {
    const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    seg.push([L, d, P[i - 1], P[i]]);
    L += d;
  }
  const at = (s) => {
    const u = closed ? ((s % L) + L) % L : clamp(s, 0, L);
    for (const [a, d, p, q] of seg)
      if (u <= a + d) return [lerp(p[0], q[0], (u - a) / d), lerp(p[1], q[1], (u - a) / d)];
    return P[P.length - 1];
  };
  return {
    L,
    at,
    d: P.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("") + (closed ? "Z" : ""),
  };
};
// fil électrique : gaine sombre + âme claire
const wireSVG = (d, col = "#F2C9A0", w = 26) =>
  `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w - 10}" stroke-linejoin="round" stroke-linecap="round"/>`;
// ampoule : on = 0 (éteinte) à 1 (allumée)
const bulbSVG = (x, y, on, k = 1) =>
  (on > 0.02
    ? `<circle cx="${x}" cy="${f2(y - 20 * k)}" r="${f2(190 * k * on)}" fill="${C.spark}" opacity="${f2(0.38 * on)}"/>`
    : "") +
  `<path d="M${x} ${f2(y - 120 * k)} C ${f2(x + 96 * k)} ${f2(y - 120 * k)}, ${f2(x + 130 * k)} ${f2(y - 24 * k)}, ${f2(x + 70 * k)} ${f2(y + 46 * k)} C ${f2(x + 54 * k)} ${f2(y + 70 * k)}, ${f2(x + 52 * k)} ${f2(y + 92 * k)}, ${f2(x + 52 * k)} ${f2(y + 112 * k)} H${f2(x - 52 * k)} C ${f2(x - 52 * k)} ${f2(y + 92 * k)}, ${f2(x - 54 * k)} ${f2(y + 70 * k)}, ${f2(x - 70 * k)} ${f2(y + 46 * k)} C ${f2(x - 130 * k)} ${f2(y - 24 * k)}, ${f2(x - 96 * k)} ${f2(y - 120 * k)}, ${x} ${f2(y - 120 * k)} Z" fill="${mixHex("#FFFFFF", "#FFE14D", on)}" class="ink" stroke-width="5"/>` +
  `<path d="M${f2(x - 24 * k)} ${f2(y + 60 * k)} L${f2(x - 10 * k)} ${f2(y - 6 * k)} L${f2(x + 10 * k)} ${f2(y + 30 * k)} L${f2(x + 24 * k)} ${f2(y - 6 * k)}" fill="none" stroke="${on > 0.5 ? C.fire : C.ink}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>` +
  `<rect x="${f2(x - 48 * k)}" y="${f2(y + 112 * k)}" width="${f2(96 * k)}" height="${f2(60 * k)}" rx="12" fill="${C.metal}" class="ink"/>`;

// --- Petites formes de l'épisode « gravité » ---
// un bonhomme tout simple (tête ronde, corps en capsule), pieds en (x, y)
const figSVG = (x, y, k = 1, col = C.blue) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})"><path d="M-14 0 V-34 M14 0 V-34" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><rect x="-28" y="-104" width="56" height="78" rx="26" fill="${col}" class="ink"/><circle cx="0" cy="-134" r="30" fill="#FFD9B8" class="ink"/></g>`;
// la tartine : face confiture vers le haut quand l'angle vaut 0
const toastSVG = (x, y, rot, k = 1) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(k)})"><rect x="-120" y="-20" width="240" height="44" rx="18" fill="#EBC07E" stroke="#B9772E" stroke-width="8"/><rect x="-110" y="-34" width="220" height="22" rx="11" fill="#E0455E"/><rect x="-120" y="-20" width="240" height="44" rx="18" fill="none" class="ink" stroke-width="3"/></g>`;
// la Terre : disque bleu, continents verts, centrée en (x, y), rayon r, tournée de rot degrés
const earthSVG = (x, y, r, rot = 0) => {
  const blob = (a, d, w, h) =>
    `<ellipse cx="${f2(d * Math.cos(rad(a)))}" cy="${f2(d * Math.sin(rad(a)))}" rx="${f2(w)}" ry="${f2(h)}" transform="rotate(${a + 20} ${f2(d * Math.cos(rad(a)))} ${f2(d * Math.sin(rad(a)))})" fill="#6CC98A"/>`;
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})"><circle r="${r}" fill="#5FB7E8" class="ink" stroke-width="5"/><clipPath id="ec${Math.round(x)}${Math.round(r)}"><circle r="${r - 3}"/></clipPath><g clip-path="url(#ec${Math.round(x)}${Math.round(r)})">${blob(-70, r * 0.5, r * 0.42, r * 0.26)}${blob(40, r * 0.62, r * 0.3, r * 0.4)}${blob(150, r * 0.55, r * 0.36, r * 0.22)}${blob(250, r * 0.78, r * 0.3, r * 0.16)}<ellipse cx="${f2(-r * 0.3)}" cy="${f2(-r * 0.4)}" rx="${f2(r * 0.5)}" ry="${f2(r * 0.3)}" fill="#fff" opacity="0.16"/></g></g>`;
};
// flèche droite de (x1, y1) vers (x2, y2)
const arrowSVG = (x1, y1, x2, y2, col = C.fire, w = 14, op = 1) => {
  const a = Math.atan2(y2 - y1, x2 - x1),
    h = w * 2.2;
  const p = (da) => `${f2(x2 - h * Math.cos(a + da))} ${f2(y2 - h * Math.sin(a + da))}`;
  return `<g opacity="${f2(op)}"><path d="M${f2(x1)} ${f2(y1)} L${f2(x2)} ${f2(y2)} M${p(0.5)} L${f2(x2)} ${f2(y2)} L${p(-0.5)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
};

// --- Formes de l'épisode « son » ---
// arcs d'onde sonore partant de (x, y) vers la direction dir (en degrés), décalés par la phase ph
const waves = (x, y, dir, ph, o = {}) => {
  const n = o.n ?? 4,
    gap = o.gap ?? 60,
    r0 = o.r0 ?? 40,
    half = o.half ?? 38,
    col = o.col ?? C.blueL,
    max = o.max ?? n * gap + r0;
  let s = "";
  for (let i = 0; i < n + 1; i++) {
    const r = r0 + (i + (((ph % 1) + 1) % 1)) * gap;
    if (r > max) continue;
    const a0 = rad(dir - half),
      a1 = rad(dir + half);
    s += `<path d="M${f2(x + r * Math.cos(a0))} ${f2(y + r * Math.sin(a0))} A${f2(r)} ${f2(r)} 0 0 1 ${f2(x + r * Math.cos(a1))} ${f2(y + r * Math.sin(a1))}" fill="none" stroke="${col}" stroke-width="${o.w ?? 9}" stroke-linecap="round" opacity="${f2((o.op ?? 1) * (1 - (r - r0) / (max - r0 + 1)))}"/>`;
  }
  return s;
};
// courbe sinusoïdale entre x0 et x1 : amplitude amp, longueur d'onde lam, phase ph
const sineD = (x0, x1, y, amp, lam, ph) => {
  let d = "";
  for (let x = x0; x <= x1; x += 6)
    d += `${x === x0 ? "M" : "L"}${x} ${f2(y + amp * Math.sin(((x - x0) / lam) * TAU - ph))}`;
  return d;
};
