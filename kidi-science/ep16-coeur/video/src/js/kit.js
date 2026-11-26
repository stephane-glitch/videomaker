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

// --- Petites formes de l'épisode « mer salée » ---
// la mer : trois bandes de vagues entre x0 et x1, surface en y, fond en yb
const seaSVG = (x0, x1, y, yb, t) => {
  let s = "";
  for (let r = 0; r < 3; r++) {
    const yy = y + r * (yb - y) * 0.28,
      n = Math.ceil((x1 - x0) / 120);
    let d = `M${x0} ${f2(yy)}`;
    for (let i = 0; i < n; i++) d += ` q30 ${f2(-22 * Math.sin(t * 2 + r * 1.3))} 60 0 t60 0`;
    s += `<path d="${d} V${yb} H${x0} Z" fill="${["#8FD3FF", "#5FB4F0", "#2F7BD3"][r]}" class="ink" stroke-width="4"/>`;
  }
  return s;
};
// une montagne : sommet en (x, y), base de largeur w en yb
const mountSVG = (x, y, w, yb, snow = true) =>
  `<path d="M${f2(x - w / 2)} ${yb} L${f2(x - w * 0.12)} ${f2(y + (yb - y) * 0.2)} L${x} ${y} L${f2(x + w * 0.16)} ${f2(y + (yb - y) * 0.3)} L${f2(x + w / 2)} ${yb} Z" fill="#9AA6B8" class="ink" stroke-width="5"/>` +
  (snow
    ? `<path d="M${f2(x - w * 0.12)} ${f2(y + (yb - y) * 0.2)} L${x} ${y} L${f2(x + w * 0.16)} ${f2(y + (yb - y) * 0.3)} L${f2(x + w * 0.06)} ${f2(y + (yb - y) * 0.22)} L${x} ${f2(y + (yb - y) * 0.32)} L${f2(x - w * 0.06)} ${f2(y + (yb - y) * 0.2)} Z" fill="#fff" class="ink" stroke-width="4"/>`
    : "");
// un nuage : centre (x, y), taille k, plus ou moins gris (g = 0…1)
const cloudSVG = (x, y, k = 1, g = 0) => {
  const col = mixHex("#FFFFFF", "#A7AFBA", g);
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})"><path d="M-120 30 a46 46 0 0 1 14 -88 a70 70 0 0 1 128 -22 a56 56 0 0 1 96 46 a40 40 0 0 1 -8 64 Z" fill="${col}" class="ink" stroke-width="${f2(5 / k)}"/></g>`;
};
// un grain de sel : petit cube blanc
const saltSVG = (x, y, r = 8, rot = 0, op = 1) =>
  `<rect x="${f2(x - r)}" y="${f2(y - r)}" width="${f2(r * 2)}" height="${f2(r * 2)}" rx="${f2(r * 0.25)}" fill="#fff" stroke="${C.ink}" stroke-width="2.5" opacity="${f2(op)}" transform="rotate(${f2(rot)} ${f2(x)} ${f2(y)})"/>`;
// la pluie entre x0 et x1, de y0 à y1
const rainSVG = (x0, x1, y0, y1, t, n = 14, op = 1) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const u = (t * 1.4 + rnd(i * 3)) % 1,
      x = x0 + rnd(i) * (x1 - x0) - u * 30,
      y = lerp(y0, y1, u);
    s += `<path d="M${f2(x)} ${f2(y)} l-8 26" stroke="${C.blue}" stroke-width="6" stroke-linecap="round" opacity="${f2(op * (1 - u * 0.4))}"/>`;
  }
  return s;
};

// --- Petites formes de l'épisode « odorat » ---
// une molécule d'odeur : trois petites boules collées
const molSVG = (x, y, r = 9, col = "#FF8A1F", rot = 0, op = 1) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})" opacity="${f2(op)}"><circle cx="${f2(-r * 0.9)}" cy="0" r="${f2(r * 0.8)}" fill="${col}" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${f2(r * 0.9)}" cy="0" r="${f2(r * 0.8)}" fill="${col}" stroke="${C.ink}" stroke-width="2.5"/><circle cx="0" cy="${f2(-r * 0.7)}" r="${r}" fill="${col}" stroke="${C.ink}" stroke-width="2.5"/></g>`;
// un point le long d'une ligne brisée P (u de 0 à 1)
const along = (P, u) => {
  const f = clamp(u) * (P.length - 1),
    i = Math.min(P.length - 2, Math.floor(f)),
    k = f - i;
  return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k)];
};
// une tête de profil (regarde à gauche) coupée pour montrer l'intérieur du nez ; centre (x, y), échelle k ; blocked = nez bouché 0…1
const headCutSVG = (x, y, k = 1, blocked = 0) =>
  `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-40 -300 C 160 -320, 300 -180, 290 20 C 284 160, 220 250, 120 300 H-120 C -140 250, -200 250, -230 210 C -250 180, -230 150, -250 130 C -280 110, -250 80, -270 60 C -330 40, -360 0, -300 -20 C -260 -40, -240 -120, -220 -180 C -190 -260, -130 -296, -40 -300 Z" fill="#FFD9B8" class="ink" stroke-width="6"/><path d="M-292 6 C -240 -10, -200 -60, -150 -110 C -100 -150, -20 -150, 20 -100 C 60 -50, 60 40, 40 130 C 20 80, -20 40, -80 30 C -160 20, -230 30, -292 6 Z" fill="#F7B9B0" class="ink" stroke-width="4"/><path d="M-140 -112 C -90 -146, -20 -144, 14 -104" fill="none" stroke="${C.hot}" stroke-width="18" stroke-linecap="round"/><path d="M-140 -112 C -90 -146, -20 -144, 14 -104" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="3 9"/><path d="M-60 -150 C -40 -230, 80 -260, 150 -200 C 220 -140, 200 -60, 140 -40 C 90 -24, 40 -60, 20 -110" fill="#F7A8B8" class="ink" stroke-width="4"/><path d="M-60 -136 C -50 -160, -20 -160, -10 -140" fill="none" class="ink" stroke-width="8" stroke-linecap="round"/>` +
  (blocked > 0
    ? `<path d="M-250 -4 C -220 -30, -190 -50, -160 -80 C -140 -40, -150 0, -200 14 Z" fill="#B7DB8A" class="ink" stroke-width="4" opacity="${f2(blocked)}"/>`
    : "") +
  `</g>`;
// un chien assis de profil (regarde à droite), pieds en (x, y)
const dogSVG = (x, y, k = 1, t = 0) =>
  `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-90 -40 Q-150 ${f2(-120 + 30 * Math.sin(t * 9))} -120 -170" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M-90 -40 Q-150 ${f2(-120 + 30 * Math.sin(t * 9))} -120 -170" fill="none" stroke="#B9772E" stroke-width="20" stroke-linecap="round"/><ellipse cx="-20" cy="-90" rx="100" ry="110" fill="#B9772E" class="ink" stroke-width="5"/><rect x="20" y="-70" width="34" height="74" rx="14" fill="#B9772E" class="ink" stroke-width="5"/><circle cx="60" cy="-220" r="76" fill="#B9772E" class="ink" stroke-width="5"/><path d="M90 -230 H190 Q210 -230 204 -206 L190 -180 H100 Z" fill="#D9A260" class="ink" stroke-width="5"/><circle cx="204" cy="${f2(-222 + 3 * Math.sin(t * 14))}" r="16" fill="${C.ink}"/><circle cx="84" cy="-240" r="9" fill="${C.ink}"/><path d="M20 -280 Q-30 -250 -6 -170 Q30 -190 40 -270 Z" fill="#8A5A22" class="ink" stroke-width="5"/></g>`;

// --- Petites formes de l'épisode « goût » ---
// une cloche d'alarme : ring = 0…1
const bellSVG = (x, y, ring, t, k = 1) =>
  `<g transform="translate(${x} ${y}) scale(${k}) rotate(${f2(16 * ring * Math.sin(t * 22))})"><path d="M-60 40 Q-60 -70 0 -80 Q60 -70 60 40 Z" fill="${C.hot}" class="ink" stroke-width="5"/><rect x="-74" y="34" width="148" height="20" rx="10" fill="${C.hot}" class="ink" stroke-width="5"/><circle cy="66" r="14" fill="${C.ink}"/></g>` +
  (ring > 0.2
    ? [-1, 1]
        .map(
          (d) =>
            `<path d="M${x + d * 90 * k} ${y - 50 * k} q${d * 26} 40 0 80" fill="none" stroke="${C.fire}" stroke-width="8" stroke-linecap="round" opacity="${f2(ring)}"/>`,
        )
        .join("")
    : "");
// une langue vue de dessus, pointe en bas : centre (x, y), échelle k ; bumps = papilles visibles 0…1
const tongueSVG = (x, y, k = 1, bumps = 1, col = "#F08A9B") => {
  let s = `<path d="M-150 -260 H150 V60 Q150 260 0 260 Q-150 260 -150 60 Z" fill="${col}" class="ink" stroke-width="${f2(6 / k)}"/><path d="M0 -240 V150" stroke="#D76A7E" stroke-width="${f2(7 / k)}" stroke-linecap="round"/>`;
  if (bumps > 0)
    for (let i = 0; i < 46; i++) {
      const bx = (rnd(i) - 0.5) * 250,
        by = -230 + rnd(i + 80) * 440;
      if (Math.abs(bx) < 16 || (by > 60 && Math.hypot(bx / 150, (by - 60) / 200) > 0.85)) continue;
      s += `<circle cx="${f2(bx)}" cy="${f2(by)}" r="${f2(7 + 4 * rnd(i + 9))}" fill="#F7B5C0" stroke="#D76A7E" stroke-width="2" opacity="${f2(bumps)}"/>`;
    }
  return `<g transform="translate(${x} ${y}) scale(${k})">${s}</g>`;
};
// une fraise, centre (x, y)
const berrySVG = (x, y, k = 1) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})"><path d="M-50 -30 Q-60 50 0 80 Q60 50 50 -30 Q0 -60 -50 -30 Z" fill="#E0455E" class="ink" stroke-width="5"/><path d="M-40 -34 L-10 -60 L0 -40 L10 -60 L40 -34 Q0 -14 -40 -34 Z" fill="#3DBE8B" class="ink" stroke-width="4"/><g fill="#FFE14D"><circle cx="-20" cy="0" r="4"/><circle cx="14" cy="-6" r="4"/><circle cx="-4" cy="30" r="4"/><circle cx="24" cy="24" r="4"/></g></g>`;

// --- Petites formes de l'épisode « toucher » ---
// un cerveau, centre (x, y)
const brainSVG = (x, y, k = 1) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})"><path d="M-110 20 C -150 -40, -110 -110, -40 -100 C -10 -150, 80 -140, 96 -84 C 150 -70, 160 10, 110 40 C 100 90, 20 100, -10 70 C -60 100, -120 70, -110 20 Z" fill="#F7A8B8" class="ink" stroke-width="5"/><path d="M-40 -100 C -20 -60, -50 -30, -20 0 M96 -84 C 60 -60, 80 -20, 40 0" fill="none" class="ink" stroke-width="4"/></g>`;
// une main ouverte, doigts vers le haut : poignet en (x, y), échelle k, tournée de rot degrés
const handSVG = (x, y, k = 1, rot = 0, col = "#FFD9B8") =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(k)})"><path d="M-60 0 V-140 Q-60 -170 -40 -170 Q-20 -170 -20 -140 V-250 Q-20 -276 0 -276 Q20 -276 20 -250 V-270 Q20 -296 40 -296 Q60 -296 60 -270 V-240 Q60 -264 80 -264 Q100 -264 100 -240 V-120 L130 -170 Q150 -196 168 -180 Q180 -166 168 -140 L110 -30 V0 Z" fill="${col}" class="ink" stroke-width="${f2(5 / k)}"/></g>`;
// un message nerveux : une étincelle qui file le long de la ligne brisée P (u de 0 à 1)
const sparkSVG = (P, u, col = C.spark, r = 16) => {
  if (u <= 0 || u >= 1) return "";
  const [x, y] = along(P, u);
  return `<circle cx="${f2(x)}" cy="${f2(y)}" r="${r + 8}" fill="${col}" opacity="0.35"/><circle cx="${f2(x)}" cy="${f2(y)}" r="${r}" fill="${col}" class="ink" stroke-width="3"/>`;
};
const pathD = (P) => P.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");

// --- Petites formes de l'épisode « vue » ---
// un œil vu de face : centre (x, y), rayon r de l'iris, p = taille de la pupille (0…1)
const frontEyeSVG = (x, y, r, p = 0.45, iris = "#3DBE8B", closed = 0) =>
  closed > 0.5
    ? `<path d="M${f2(x - r * 2.2)} ${f2(y)} Q${f2(x)} ${f2(y + r * 0.8)} ${f2(x + r * 2.2)} ${f2(y)}" fill="none" class="ink" stroke-width="${f2(r * 0.12)}" stroke-linecap="round"/>`
    : `<path d="M${f2(x - r * 2.2)} ${f2(y)} Q${f2(x)} ${f2(y - r * 1.9)} ${f2(x + r * 2.2)} ${f2(y)} Q${f2(x)} ${f2(y + r * 1.9)} ${f2(x - r * 2.2)} ${f2(y)} Z" fill="#fff" class="ink" stroke-width="${f2(r * 0.09)}"/><circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${iris}" class="ink" stroke-width="${f2(r * 0.07)}"/><circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r * p)}" fill="${C.ink}"/><circle cx="${f2(x - r * 0.35)}" cy="${f2(y - r * 0.4)}" r="${f2(r * 0.16)}" fill="#fff"/>`;
// un œil en coupe : centre (x, y), rayon r ; la lumière entre par la gauche
const eyeCutSVG = (x, y, r) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" class="ink" stroke-width="6"/><path d="M${f2(x + r * 0.5)} ${f2(y - r * 0.86)} A ${r} ${r} 0 0 1 ${f2(x + r * 0.5)} ${f2(y + r * 0.86)}" fill="none" stroke="#E0455E" stroke-width="16" stroke-linecap="round"/><path d="M${f2(x - r * 0.9)} ${f2(y - r * 0.42)} Q${f2(x - r * 1.3)} ${y} ${f2(x - r * 0.9)} ${f2(y + r * 0.42)}" fill="#CFEFFF" class="ink" stroke-width="5"/><path d="M${f2(x - r * 0.84)} ${f2(y - r * 0.5)} V${f2(y - r * 0.18)} M${f2(x - r * 0.84)} ${f2(y + r * 0.18)} V${f2(y + r * 0.5)}" stroke="#3DBE8B" stroke-width="16" stroke-linecap="round"/><ellipse cx="${f2(x - r * 0.62)}" cy="${y}" rx="${f2(r * 0.14)}" ry="${f2(r * 0.34)}" fill="#DFF3FF" class="ink" stroke-width="5"/>`;

// --- Petites formes de l'épisode « volcans » ---
// une fontaine de lave qui jaillit de (x, y) ; k = force 0…1
const lavaSVG = (x, y, t, k = 1, n = 14, spread = 70) => {
  let s = "";
  for (let i = 0; i < n; i++) {
    const u = (t * 0.7 + i / n) % 1,
      a = rad(-90 + (rnd(i) - 0.5) * spread),
      v = (420 + rnd(i + 9) * 200) * k;
    s += `<circle cx="${f2(x + Math.cos(a) * v * u)}" cy="${f2(y + Math.sin(a) * v * u + 520 * k * u * u)}" r="${f2((16 - 8 * u) * (0.4 + 0.6 * k))}" fill="${i % 2 ? C.fire : "#E0455E"}" class="ink" stroke-width="3" opacity="${f2(Math.min(1, k * 3))}"/>`;
  }
  return s;
};
// un cône de volcan : base de x0 à x1 en yb, sommet plat de largeur w en y
const coneSVG = (x0, x1, yb, y, w, col = "#6B5B4E") => {
  const xm = (x0 + x1) / 2;
  return `<path d="M${x0} ${yb} L${f2(xm - w / 2)} ${y} H${f2(xm + w / 2)} L${x1} ${yb} Z" fill="${col}" class="ink" stroke-width="6"/>`;
};

// --- Petites formes de l'épisode « pluie et nuages » ---
// un éléphant de profil (regarde à gauche), centre (x, y)
const elephSVG = (x, y, k = 1) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) scale(${k})"><ellipse rx="90" ry="64" fill="#A7AFBA" class="ink" stroke-width="5"/><circle cx="-90" cy="-30" r="50" fill="#A7AFBA" class="ink" stroke-width="5"/><path d="M-130 -20 Q-170 40 -140 80" fill="none" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/><path d="M-130 -20 Q-170 40 -140 80" fill="none" stroke="#A7AFBA" stroke-width="16" stroke-linecap="round"/><ellipse cx="-70" cy="-40" rx="26" ry="36" fill="#8E96A3" class="ink" stroke-width="4"/><circle cx="-106" cy="-40" r="6" fill="${C.ink}"/><rect x="-60" y="40" width="30" height="50" rx="8" fill="#A7AFBA" class="ink" stroke-width="5"/><rect x="30" y="40" width="30" height="50" rx="8" fill="#A7AFBA" class="ink" stroke-width="5"/></g>`;
// une gouttelette : petit disque bleu clair
const dropletSVG = (x, y, r = 6, op = 1) =>
  `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="#8FD3FF" stroke="${C.blue}" stroke-width="2" opacity="${f2(op)}"/>`;
// de la vapeur d'eau (invisible) : une bulle en pointillés
const vaporSVG = (x, y, r = 22, op = 1) =>
  `<circle cx="${f2(x)}" cy="${f2(y)}" r="${r}" fill="#8FD3FF" fill-opacity="0.18" stroke="${C.blue}" stroke-width="3" stroke-dasharray="7 7" opacity="${f2(op)}"/>`;

// --- Petites formes de l'épisode « cœur » ---
// le battement : deux coups rapprochés puis une pause ; bpm = battements par minute ; renvoie 0…1
const beatAt = (t, bpm = 80) => {
  const ph = ((t * bpm) / 60) % 1;
  return Math.exp(-ph * 14) + 0.7 * Math.exp(-Math.abs(ph - 0.28) * 22);
};
// un cœur de dessin, centre (x, y), échelle k
const heartSVG = (x, y, k = 1, col = "#E0455E") =>
  `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})"><path d="M0 100 C -150 -10, -130 -130, -60 -130 C -20 -130, 0 -100, 0 -80 C 0 -100, 20 -130, 60 -130 C 130 -130, 150 -10, 0 100 Z" fill="${col}" class="ink" stroke-width="${f2(5 / k)}"/><path d="M-70 -90 Q-90 -60 -76 -30" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.7"/></g>`;
// un globule rouge, centre (x, y) ; cargo = "o2" (colis bleu), "co2" (sac gris) ou rien
const rbcSVG = (x, y, r = 30, cargo = "", op = 1) =>
  `<g opacity="${f2(op)}"><ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${r}" ry="${f2(r * 0.74)}" fill="#E0455E" class="ink" stroke-width="4"/><ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(r * 0.45)}" ry="${f2(r * 0.3)}" fill="#C2334A"/>` +
  (cargo === "o2"
    ? `<rect x="${f2(x - 16)}" y="${f2(y - r * 0.74 - 30)}" width="32" height="28" rx="6" fill="#8FD3FF" class="ink" stroke-width="3"/>`
    : cargo === "co2"
      ? `<path d="M${f2(x - 16)} ${f2(y - r * 0.74 - 4)} q-6 -30 16 -30 q22 0 16 30 Z" fill="#A7AFBA" class="ink" stroke-width="3"/>`
      : "") +
  `</g>`;
