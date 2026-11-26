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
  const p = (h) =>
    h[0] === "#"
      ? [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
      : h.match(/\d+/g).map(Number);
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
// chaque apparition est notée : scripts/autosfx.cjs en tire un petit bruitage
const SFX_LOG = (window.__SFX = []);
const show = (sel, t, o = {}) =>
  SFX_LOG.push([t, "tic"]) &&
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
  SFX_LOG.push([t, "pop"]) &&
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
  SFX_LOG.push([t, "tic"]);
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

// --- Formes de l'épisode « lumière » ---
const RAINBOW = ["#E0455E", "#FF8A1F", "#FFD23F", "#3DBE8B", "#2F5BD3", "#8E5BD6"];
// le Soleil, centré en (x, y)
const sunSVG = (x, y, r, t = 0) => {
  let s = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU + t * 0.3;
    s += `<path d="M${f2(x + (r + 14) * Math.cos(a))} ${f2(y + (r + 14) * Math.sin(a))} L${f2(x + (r + 44) * Math.cos(a))} ${f2(y + (r + 44) * Math.sin(a))}" stroke="${C.fire}" stroke-width="10" stroke-linecap="round"/>`;
  }
  return s + `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.hot}" class="ink" stroke-width="5"/>`;
};
// un rayon : trait coloré bordé de sombre, dessiné jusqu'à la fraction u de sa longueur
const raySVG = (x1, y1, x2, y2, col, u = 1, w = 14) => {
  if (u <= 0) return "";
  const x = lerp(x1, x2, Math.min(1, u)),
    y = lerp(y1, y2, Math.min(1, u));
  return `<path d="M${f2(x1)} ${f2(y1)} L${f2(x)} ${f2(y)}" stroke="${C.ink}" stroke-width="${w + 6}" stroke-linecap="round"/><path d="M${f2(x1)} ${f2(y1)} L${f2(x)} ${f2(y)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
};
// un rayon installé, avec des petits traits blancs qui filent dedans pour montrer le sens
const beamSVG = (x1, y1, x2, y2, col, t, u = 1, w = 14) => {
  if (u <= 0) return "";
  const k = Math.min(1, u),
    x = lerp(x1, x2, k),
    y = lerp(y1, y2, k);
  return (
    raySVG(x1, y1, x2, y2, col, u, w) +
    `<path d="M${f2(x1)} ${f2(y1)} L${f2(x)} ${f2(y)}" stroke="#fff" stroke-width="${f2(w * 0.3)}" stroke-dasharray="26 60" stroke-dashoffset="${f2(-t * 420)}" stroke-linecap="round" opacity="0.8"/>`
  );
};
// un œil vu de face, centré en (x, y)
const eyeSVG = (x, y, k = 1, iris = "#3DBE8B") =>
  `<g transform="translate(${f2(x)} ${f2(y)}) scale(${k})"><path d="M-110 0 Q0 -90 110 0 Q0 90 -110 0 Z" fill="#fff" class="ink" stroke-width="6"/><circle r="44" fill="${iris}" class="ink"/><circle r="20" fill="${C.ink}"/><circle cx="-12" cy="-14" r="9" fill="#fff"/></g>`;
// un chat assis, pieds en (x, y)
const catSVG = (x, y, k = 1, col = "#FF8A1F") =>
  `<g transform="translate(${f2(x)} ${f2(y)}) scale(${k})"><path d="M60 -20 Q150 -30 130 -120" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M60 -20 Q150 -30 130 -120" fill="none" stroke="${col}" stroke-width="20" stroke-linecap="round"/><ellipse cx="0" cy="-80" rx="78" ry="96" fill="${col}" class="ink" stroke-width="5"/><circle cx="0" cy="-210" r="66" fill="${col}" class="ink" stroke-width="5"/><path d="M-56 -244 L-64 -300 L-18 -268 Z M56 -244 L64 -300 L18 -268 Z" fill="${col}" class="ink" stroke-width="5"/><circle cx="-24" cy="-216" r="9" fill="${C.ink}"/><circle cx="24" cy="-216" r="9" fill="${C.ink}"/><path d="M-8 -194 L8 -194 L0 -184 Z" fill="#F7A8B8" class="ink" stroke-width="3"/></g>`;

// --- Petites formes de l'épisode « allergies » ---
// un grain de pollen : boule jaune à picots, l'air innocent
const pollenSVG = (x, y, r, rot = 0, op = 1) => {
  let s = "";
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU + rot;
    s += `<path d="M${f2(x + r * 0.9 * Math.cos(a))} ${f2(y + r * 0.9 * Math.sin(a))} L${f2(x + r * 1.45 * Math.cos(a))} ${f2(y + r * 1.45 * Math.sin(a))}" stroke="${C.ink}" stroke-width="${f2(r * 0.18)}" stroke-linecap="round"/>`;
  }
  return `<g opacity="${f2(op)}">${s}<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${C.hot}" class="ink" stroke-width="4"/><circle cx="${f2(x - r * 0.32)}" cy="${f2(y - r * 0.1)}" r="${f2(r * 0.11)}" fill="${C.ink}"/><circle cx="${f2(x + r * 0.32)}" cy="${f2(y - r * 0.1)}" r="${f2(r * 0.11)}" fill="${C.ink}"/><path d="M${f2(x - r * 0.25)} ${f2(y + r * 0.3)} Q${f2(x)} ${f2(y + r * 0.55)} ${f2(x + r * 0.25)} ${f2(y + r * 0.3)}" fill="none" stroke="${C.ink}" stroke-width="${f2(r * 0.1)}" stroke-linecap="round"/></g>`;
};
// un virus : boule verte à ventouses, l'air méchant ; k = taille (1 → 0 quand il est avalé)
const virusSVG = (x, y, r, rot = 0, k = 1) => {
  if (k <= 0.02) return "";
  let s = "";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + rot;
    s += `<path d="M${f2(r * 0.9 * Math.cos(a))} ${f2(r * 0.9 * Math.sin(a))} L${f2(r * 1.4 * Math.cos(a))} ${f2(r * 1.4 * Math.sin(a))}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/><circle cx="${f2(r * 1.5 * Math.cos(a))}" cy="${f2(r * 1.5 * Math.sin(a))}" r="${f2(r * 0.2)}" fill="#3DBE8B" class="ink" stroke-width="3"/>`;
  }
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})">${s}<circle r="${r}" fill="#3DBE8B" class="ink" stroke-width="4"/><path d="M${f2(-r * 0.55)} ${f2(-r * 0.4)} L${f2(-r * 0.15)} ${f2(-r * 0.2)} M${f2(r * 0.55)} ${f2(-r * 0.4)} L${f2(r * 0.15)} ${f2(-r * 0.2)}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><circle cx="${f2(-r * 0.32)}" cy="0" r="${f2(r * 0.12)}" fill="${C.ink}"/><circle cx="${f2(r * 0.32)}" cy="0" r="${f2(r * 0.12)}" fill="${C.ink}"/><path d="M${f2(-r * 0.3)} ${f2(r * 0.5)} Q0 ${f2(r * 0.3)} ${f2(r * 0.3)} ${f2(r * 0.5)}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>`;
};
// un globule blanc, « garde » du corps : mood 0 = tranquille, 1 = en alerte ; look = -1…1 (direction du regard)
const guardSVG = (x, y, r, t, mood = 0, look = 0) => {
  const w = 0.05 * Math.sin(t * 3 + x * 0.01),
    ex = look * r * 0.14;
  let s = `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(r * (1 + w))}" ry="${f2(r * (1 - w))}" fill="#fff" class="ink" stroke-width="5"/><ellipse cx="${f2(x - r * 0.35)}" cy="${f2(y - r * 0.5)}" rx="${f2(r * 0.22)}" ry="${f2(r * 0.12)}" fill="#DCE6F5"/>`;
  s += `<circle cx="${f2(x - r * 0.3 + ex)}" cy="${f2(y - r * 0.08)}" r="${f2(r * 0.12)}" fill="${C.ink}"/><circle cx="${f2(x + r * 0.3 + ex)}" cy="${f2(y - r * 0.08)}" r="${f2(r * 0.12)}" fill="${C.ink}"/>`;
  if (mood > 0.5) {
    s += `<path d="M${f2(x - r * 0.5 + ex)} ${f2(y - r * 0.42)} L${f2(x - r * 0.14 + ex)} ${f2(y - r * 0.26)} M${f2(x + r * 0.5 + ex)} ${f2(y - r * 0.42)} L${f2(x + r * 0.14 + ex)} ${f2(y - r * 0.26)}" stroke="${C.ink}" stroke-width="${f2(r * 0.09)}" stroke-linecap="round"/><path d="M${f2(x - r * 0.22 + ex)} ${f2(y + r * 0.4)} H${f2(x + r * 0.22 + ex)}" stroke="${C.ink}" stroke-width="${f2(r * 0.09)}" stroke-linecap="round"/>`;
    s += `<g transform="translate(${f2(x)} ${f2(y - r * 1.55)})"><circle r="${f2(r * 0.36)}" fill="#E0455E" class="ink" stroke-width="4"/><text y="${f2(r * 0.2)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${f2(r * 0.56)}" fill="#fff">!</text></g>`;
  } else
    s += `<path d="M${f2(x - r * 0.24 + ex)} ${f2(y + r * 0.3)} Q${f2(x + ex)} ${f2(y + r * 0.52)} ${f2(x + r * 0.24 + ex)} ${f2(y + r * 0.3)}" fill="none" stroke="${C.ink}" stroke-width="${f2(r * 0.09)}" stroke-linecap="round"/>`;
  return s;
};
// un anticorps : une antenne en Y, pied en (x, y), tournée de rot degrés
const antibodySVG = (x, y, rot, k = 1, op = 1) => {
  const d = "M0 0 V-30 M0 -30 L-18 -56 M0 -30 L18 -56";
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(k)})" opacity="${f2(op)}" fill="none" stroke-linecap="round"><path d="${d}" stroke="${C.ink}" stroke-width="15"/><path d="${d}" stroke="${C.fire}" stroke-width="8"/></g>`;
};
// la cellule pleine de sacs (mastocyte) : n antennes plantées dessus, burst 0 → 1 = les sacs éclatent et l'histamine sort
const mastSVG = (x, y, r, t, burst = 0, nAnt = 8, antK = 1) => {
  let s = "";
  for (let i = 0; i < nAnt; i++) {
    const a = (i / nAnt) * TAU + 0.4;
    s += antibodySVG(
      x + (r - 6) * Math.cos(a),
      y + (r - 6) * Math.sin(a),
      (a * 180) / Math.PI + 90,
      antK,
    );
  }
  s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#EBDDFB" class="ink" stroke-width="6"/><circle cx="${f2(x + r * 0.1)}" cy="${f2(y + r * 0.05)}" r="${f2(r * 0.3)}" fill="#C9B1EE" class="ink" stroke-width="4"/>`;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU + rnd(i) * 0.3,
      d0 = r * (0.5 + 0.3 * rnd(i + 20)),
      d1 = r + 60 + rnd(i + 40) * 190;
    const d = lerp(d0, d1, burst) + (burst > 0 ? 10 * Math.sin(t * 2 + i) : 0);
    s += `<circle cx="${f2(x + d * Math.cos(a))}" cy="${f2(y + d * Math.sin(a))}" r="${f2(lerp(r * 0.1, 13, burst))}" fill="${C.fire}" stroke="${C.ink}" stroke-width="3"/>`;
  }
  return s;
};
// un vaisseau sanguin en coupe, avec ses globules rouges qui défilent
const vesselSVG = (t, id) => {
  let s = `<defs><clipPath id="${id}"><rect x="130" y="270" width="1660" height="520"/></clipPath></defs><rect x="130" y="270" width="1660" height="520" fill="#FFE9E6"/><g clip-path="url(#${id})">`;
  for (let i = 0; i < 16; i++) {
    const x = 60 + ((rnd(i) * 1800 + t * 70 * (0.7 + rnd(i + 5) * 0.6)) % 1800),
      y = 330 + rnd(i + 9) * 400;
    s += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="36" ry="26" fill="#F29AA6" opacity="0.75"/><ellipse cx="${f2(x)}" cy="${f2(y)}" rx="16" ry="11" fill="#E77888" opacity="0.75"/>`;
  }
  return (
    s +
    `</g><rect x="130" y="246" width="1660" height="30" rx="12" fill="#E0455E" class="ink"/><rect x="130" y="784" width="1660" height="30" rx="12" fill="#E0455E" class="ink"/>`
  );
};
// une fleur toute simple, pied en (x, y)
const flowerSVG = (x, y, k = 1) => {
  let s = `<path d="M0 0 V-300" stroke="#3DBE8B" stroke-width="20" stroke-linecap="round"/><path d="M0 -140 q-90 -20 -110 -90 q90 0 110 90 Z" fill="#3DBE8B" class="ink"/>`;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU + 0.2,
      px = 96 * Math.cos(a),
      py = -360 + 96 * Math.sin(a);
    s += `<ellipse cx="${f2(px)}" cy="${f2(py)}" rx="62" ry="40" transform="rotate(${f2((a * 180) / Math.PI)} ${f2(px)} ${f2(py)})" fill="#F7A8B8" class="ink"/>`;
  }
  return `<g transform="translate(${x} ${y}) scale(${k})">${s}<circle cx="0" cy="-360" r="56" fill="${C.hot}" class="ink" stroke-width="5"/></g>`;
};

// --- Petites formes de l'épisode « feu » ---
// une flamme vivante : pied en (x, y), hauteur h ; o.k = vigueur 0…1, o.blue = flamme toute bleue, o.lean = penche (px)
const flameSVG = (x, y, h, t, o = {}) => {
  const k = o.k ?? 1;
  if (k <= 0.02) return "";
  const H = h * k * (1 + 0.06 * Math.sin(t * 11 + x)),
    sway = (o.lean ?? 0) + H * (0.07 * Math.sin(t * 9 + x * 0.01) + 0.04 * Math.sin(t * 14.3 + 1));
  const lay = (s, col, op = 1) => {
    const hh = H * s,
      w = hh * 0.36;
    return `<path d="M${f2(x)} ${f2(y)} C ${f2(x - w)} ${f2(y)}, ${f2(x - w * 1.15)} ${f2(y - hh * 0.5)}, ${f2(x + sway * s)} ${f2(y - hh)} C ${f2(x + w * 1.15)} ${f2(y - hh * 0.5)}, ${f2(x + w)} ${f2(y)}, ${f2(x)} ${f2(y)} Z" fill="${col}" opacity="${op}"${s === 1 ? ` stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"` : ""}/>`;
  };
  return o.blue
    ? lay(1, "#5F86F0") + lay(0.6, "#BFD4FF")
    : lay(1, C.fire) + lay(0.66, C.hot) + lay(0.3, "#5F86F0", 0.9);
};
// une bougie : pied en (x, y), largeur w, hauteur h (la mèche dépasse de 24)
const candleSVG = (x, y, w, h, col = "#FBF1D8") =>
  `<rect x="${f2(x - w / 2)}" y="${f2(y - h)}" width="${w}" height="${h}" rx="${f2(w * 0.12)}" fill="${col}" class="ink" stroke-width="4"/><ellipse cx="${x}" cy="${f2(y - h + 3)}" rx="${f2(w * 0.36)}" ry="${f2(w * 0.1)}" fill="#fff" opacity="0.8"/><path d="M${x} ${f2(y - h)} v-24" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
// un filet de fumée qui monte en ondulant depuis (x, y) ; k = 0…1 (hauteur), col = couleur
const smokeSVG = (x, y, t, k = 1, col = "#fff", n = 14, H = 260) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const u = ((t * 0.45 + i / n) % 1) * k,
      yy = y - u * H,
      xx = x + 26 * Math.sin(u * 7 + t * 2 + i) * u;
    s += `<circle cx="${f2(xx)}" cy="${f2(yy)}" r="${f2(8 + 16 * u)}" fill="${col}" stroke="${C.smoke}" stroke-width="2.5" opacity="${f2((1 - u / (k || 1)) * 0.9)}"/>`;
  }
  return s;
};
// une bûche couchée, centre (x, y), longueur L, épaisseur e
const logSVG = (x, y, L, e) =>
  `<rect x="${f2(x - L / 2)}" y="${f2(y - e / 2)}" width="${f2(L)}" height="${f2(e)}" rx="${f2(e / 2)}" fill="#B9772E" class="ink" stroke-width="4"/><ellipse cx="${f2(x + L / 2 - e * 0.32)}" cy="${f2(y)}" rx="${f2(e * 0.3)}" ry="${f2(e * 0.42)}" fill="#EBC07E" class="ink" stroke-width="3"/><path d="M${f2(x - L * 0.3)} ${f2(y - e * 0.12)} h${f2(L * 0.3)} M${f2(x - L * 0.2)} ${f2(y + e * 0.16)} h${f2(L * 0.24)}" stroke="#8A5A22" stroke-width="3" stroke-linecap="round"/>`;
// un sapin tout simple, pied en (x, y), hauteur h
const treeSVG = (x, y, h, col = "#3DBE8B") =>
  `<rect x="${f2(x - h * 0.05)}" y="${f2(y - h * 0.22)}" width="${f2(h * 0.1)}" height="${f2(h * 0.22)}" fill="#B9772E" class="ink" stroke-width="3"/><path d="M${f2(x)} ${f2(y - h)} L${f2(x + h * 0.3)} ${f2(y - h * 0.2)} H${f2(x - h * 0.3)} Z" fill="${col}" class="ink" stroke-width="4"/>`;
