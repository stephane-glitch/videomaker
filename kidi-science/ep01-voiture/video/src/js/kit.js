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
