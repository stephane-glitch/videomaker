// Kidi-science — image de test du style (moteur à essence, temps « Boum »).
// Génère index.html : un SVG isométrique en coupe, couleurs par fonction.
// Usage : node build.mjs   puis   node shot.mjs
import { writeFileSync } from "node:fs";

// ---------- Palette (codes couleur de la série) ----------
const C = {
  paper: "#FFF8EC",
  ink: "#1F2A44",
  // structure (pièces fixes)
  top: "#F4F6FA",
  side: "#D3DAE6",
  inner: "#B9C3D3",
  cut: "#F6E7C8",
  hatch: "#E6CF9F",
  // pièces qui bougent
  blue: "#2F5BD3",
  blueLight: "#5F86F0",
  blueDark: "#1E3F9E",
  // énergies
  fire: "#FF8A1F",
  fireHot: "#FFD23F",
  spark: "#FFE14D",
  air: "#8FD3FF",
  smoke: "#A7AFBA",
  metal: "#9AA6B8",
  ceramic: "#FBFBFD",
};

// ---------- Projection ----------
const A = (-28 * Math.PI) / 180; // azimut
const E = (24 * Math.PI) / 180; // élévation
const S = 1.12; // échelle
const OX = 900;
const OY = 790;
const ca = Math.cos(A),
  sa = Math.sin(A),
  ce = Math.cos(E),
  se = Math.sin(E);
const P = ([x, y, z]) => {
  const xr = x * ca - y * sa;
  const yr = x * sa + y * ca;
  return [OX + S * xr, OY - S * (z * ce + yr * se)];
};
const f = (n) => Math.round(n * 100) / 100;
const pathOf = (pts, close = true) =>
  pts.map((p, i) => `${i ? "L" : "M"}${f(p[0])} ${f(p[1])}`).join("") + (close ? "Z" : "");
const poly3 = (pts3, close = true) => pathOf(pts3.map(P), close);

// cercle 3D : centre c, axes u et v, rayon r
const circle = (c, u, v, r, n = 72, t0 = 0, t1 = Math.PI * 2) => {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    out.push([
      c[0] + r * (Math.cos(t) * u[0] + Math.sin(t) * v[0]),
      c[1] + r * (Math.cos(t) * u[1] + Math.sin(t) * v[1]),
      c[2] + r * (Math.cos(t) * u[2] + Math.sin(t) * v[2]),
    ]);
  }
  return out;
};
const hull = (pts) => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [],
    up = [];
  for (const q of p) {
    while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (const q of p.reverse()) {
    while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return lo.slice(0, -1).concat(up.slice(0, -1));
};

// ---------- Sortie SVG ----------
const defs = [];
const out = [];
let gid = 0;
const stroke = (w = 3) =>
  `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const add = (s) => out.push(s);
const lin = (x1, y1, x2, y2, stops) => {
  const id = `g${gid++}`;
  defs.push(
    `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${stops
      .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
      .join("")}</linearGradient>`,
  );
  return `url(#${id})`;
};
const rad = (cx, cy, r, stops) => {
  const id = `g${gid++}`;
  defs.push(
    `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}">${stops
      .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
      .join("")}</radialGradient>`,
  );
  return `url(#${id})`;
};

// Cylindre : c0 -> c1 le long de l'axe, u/v perpendiculaires. cap = extrémité visible (0 ou 1).
function cylinder({ c0, c1, u, v, r, light, mid, dark, capFill, cap = 1, w = 3 }) {
  const a = circle(c0, u, v, r).map(P);
  const b = circle(c1, u, v, r).map(P);
  const h = hull([...a, ...b]);
  // dégradé perpendiculaire à l'axe projeté
  const p0 = P(c0),
    p1 = P(c1);
  let dx = p1[0] - p0[0],
    dy = p1[1] - p0[1];
  const L = Math.hypot(dx, dy) || 1;
  let nx = -dy / L,
    ny = dx / L;
  if (L < 1e-6) {
    nx = 1;
    ny = 0;
  }
  const proj = h.map((q) => q[0] * nx + q[1] * ny);
  const mn = Math.min(...proj),
    mx = Math.max(...proj);
  const cx = (p0[0] + p1[0]) / 2,
    cy = (p0[1] + p1[1]) / 2;
  const base = cx * nx + cy * ny;
  const g = lin(
    cx + nx * (mn - base),
    cy + ny * (mn - base),
    cx + nx * (mx - base),
    cy + ny * (mx - base),
    [
      [0, dark],
      [0.35, mid],
      [0.62, light],
      [0.85, mid],
      [1, dark],
    ],
  );
  add(`<path d="${pathOf(h)}" fill="${g}" ${stroke(w)}/>`);
  const capPts = cap ? b : a;
  add(`<path d="${pathOf(capPts)}" fill="${capFill ?? light}" ${stroke(w)}/>`);
  return { top: capPts };
}
// arc avant (le plus proche du spectateur) d'un cercle horizontal, pour les gorges, etc.
function frontArc(c, r, z) {
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    const t = Math.PI + (Math.PI * i) / 60; // y < 0 => devant
    pts.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t), z]);
  }
  return poly3(pts, false);
}
// pièce plate extrudée le long de y (profil dans le plan x-z)
function slab(profileXZ, y0, y1, front, back) {
  const fr = profileXZ.map(([x, z]) => [x, y0, z]);
  const bk = profileXZ.map(([x, z]) => [x, y1, z]);
  add(`<path d="${poly3(bk)}" fill="${back}" ${stroke()}/>`);
  for (let i = 0; i < fr.length; i++) {
    const j = (i + 1) % fr.length;
    add(
      `<path d="${poly3([fr[i], fr[j], bk[j], bk[i]])}" fill="${back}" stroke="${back}" stroke-width="1"/>`,
    );
  }
  // contour de la tranche
  const all = hull([...fr.map(P), ...bk.map(P)]);
  add(`<path d="${pathOf(all)}" fill="none" ${stroke()}/>`);
  add(`<path d="${poly3(fr)}" fill="${front}" ${stroke()}/>`);
}
const circ2 = (cx, cz, r, n = 40) => {
  const o = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    o.push([cx + r * Math.cos(t), cz + r * Math.sin(t)]);
  }
  return o;
};
const hull2 = (pts) => hull(pts);

// ---------- Mécanique (vraies relations : bielle-manivelle) ----------
const R = 90; // alésage / 2
const crankZ = 20,
  crankR = 60,
  rodL = 290;
const theta = (60 * Math.PI) / 180; // 60° après le point mort haut : début du « Boum »
const pinX = crankR * Math.sin(theta),
  pinZ = crankZ + crankR * Math.cos(theta);
const pistonPinZ =
  crankZ + crankR * Math.cos(theta) + Math.sqrt(rodL ** 2 - (crankR * Math.sin(theta)) ** 2);
const pistonTop = pistonPinZ + 42;
const pistonBottom = pistonTop - 118;

const BW = 150,
  BD = 150,
  B0 = 120,
  B1 = 420; // bloc
const HW = 172,
  HD = 160,
  H1 = 500; // culasse
const KW = 192,
  KD = 150,
  K0 = -90; // carter

// ---------- Dessin, de l'arrière vers l'avant ----------
// ombre au sol
{
  const [sx, sy] = P([0, 60, K0]);
  add(
    `<ellipse cx="${f(sx + 30)}" cy="${f(sy + 18)}" rx="330" ry="70" fill="${C.ink}" opacity="0.08"/>`,
  );
}

// Carter : faces extérieures
add(
  `<path d="${poly3([
    [-KW, 0, B0],
    [KW, 0, B0],
    [KW, KD, B0],
    [-KW, KD, B0],
  ])}" fill="${C.top}" ${stroke()}/>`,
);
add(
  `<path d="${poly3([
    [KW, 0, K0],
    [KW, KD, K0],
    [KW, KD, B0],
    [KW, 0, B0],
  ])}" fill="${C.side}" ${stroke()}/>`,
);
// intérieur du carter (paroi du fond)
const KT = 20;
add(
  `<path d="${poly3([
    [-KW + KT, KD - KT, K0 + KT],
    [KW - KT, KD - KT, K0 + KT],
    [KW - KT, KD - KT, B0],
    [-KW + KT, KD - KT, B0],
  ])}" fill="${lin(0, P([0, 0, K0])[1], 0, P([0, 0, B0])[1], [
    [0, C.inner],
    [1, "#CBD3E0"],
  ])}" ${stroke(2)}/>`,
);
// fond et côté intérieurs
add(
  `<path d="${poly3([
    [-KW + KT, 0, K0 + KT],
    [KW - KT, 0, K0 + KT],
    [KW - KT, KD - KT, K0 + KT],
    [-KW + KT, KD - KT, K0 + KT],
  ])}" fill="#C7CFDC" ${stroke(2)}/>`,
);
add(
  `<path d="${poly3([
    [-KW + KT, 0, K0 + KT],
    [-KW + KT, KD - KT, K0 + KT],
    [-KW + KT, KD - KT, B0],
    [-KW + KT, 0, B0],
  ])}" fill="#DCE2EC" ${stroke(2)}/>`,
);
// huile au fond
add(
  `<path d="${poly3([
    [-KW + KT, 0, K0 + KT + 14],
    [KW - KT, 0, K0 + KT + 14],
    [KW - KT, KD - KT, K0 + KT + 14],
    [-KW + KT, KD - KT, K0 + KT + 14],
  ])}" fill="#F2C266" opacity="0.55"/>`,
);

// Bloc : face de côté
add(
  `<path d="${poly3([
    [BW, 0, B0],
    [BW, BD, B0],
    [BW, BD, B1],
    [BW, 0, B1],
  ])}" fill="${C.side}" ${stroke()}/>`,
);
// ailettes de refroidissement sur le côté
for (let z = B0 + 40; z < B1 - 10; z += 44) {
  add(
    `<path d="${poly3(
      [
        [BW, 8, z],
        [BW, BD - 8, z],
      ],
      false,
    )}" fill="none" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="2"/>`,
  );
}
// Culasse : faces extérieures
add(
  `<path d="${poly3([
    [-HW, 0, H1],
    [HW, 0, H1],
    [HW, HD, H1],
    [-HW, HD, H1],
  ])}" fill="${C.top}" ${stroke()}/>`,
);
add(
  `<path d="${poly3([
    [HW, 0, B1],
    [HW, HD, B1],
    [HW, HD, H1],
    [HW, 0, H1],
  ])}" fill="${C.side}" ${stroke()}/>`,
);
// vis de culasse
for (const [x, y] of [
  [-140, 30],
  [-140, 130],
  [140, 130],
  [140, 30],
  [-70, 135],
  [70, 135],
]) {
  const e = circle([x, y, H1], [1, 0, 0], [0, 1, 0], 9, 24).map(P);
  add(`<path d="${pathOf(e)}" fill="${C.side}" ${stroke(2)}/>`);
}

// Paroi du fond du cylindre (demi-cylindre intérieur), assombrie
{
  const pts = [];
  for (let i = 0; i <= 48; i++) {
    const t = (Math.PI * i) / 48;
    pts.push([R * Math.cos(t), R * Math.sin(t), B0]);
  }
  for (let i = 48; i >= 0; i--) {
    const t = (Math.PI * i) / 48;
    pts.push([R * Math.cos(t), R * Math.sin(t), B1]);
  }
  const [lx] = P([-R, 0, 0]),
    [rx] = P([R, 0, 0]);
  add(
    `<path d="${poly3(pts)}" fill="${lin(lx, 0, rx, 0, [
      [0, "#A9B4C7"],
      [0.5, "#C9D1DE"],
      [1, "#9EAABF"],
    ])}" ${stroke(2)}/>`,
  );
}

// Profil de la chambre de combustion et des conduits (dans le plan de coupe y = 0)
const dome = [
  [-R, B1],
  [-R + 10, B1 + 30],
  [-40, B1 + 46],
  [40, B1 + 46],
  [R - 10, B1 + 30],
  [R, B1],
];
const intake = [
  [-HW, H1 - 58],
  [-HW, H1 - 22],
  [-70, H1 - 22],
  [-28, B1 + 46],
  [-66, B1 + 44],
  [-100, H1 - 58],
];
const exhaust = [
  [HW, H1 - 58],
  [HW, H1 - 22],
  [70, H1 - 22],
  [28, B1 + 46],
  [66, B1 + 44],
  [100, H1 - 58],
];
const xz = (pts) => pts.map(([x, z]) => [x, 0, z]);

// Conduits : contenu coloré (air bleu / fumée grise)
add(`<path d="${poly3(xz(intake))}" fill="${C.air}" />`);
add(`<path d="${poly3(xz(exhaust))}" fill="${C.smoke}" />`);
// petites bulles d'air immobiles dans le conduit d'admission
for (const [x, z, r] of [
  [-150, H1 - 40, 5],
  [-128, H1 - 33, 4],
  [-110, H1 - 46, 6],
  [-92, H1 - 36, 4],
]) {
  const [sx, sy] = P([x, 0, z]);
  add(`<circle cx="${f(sx)}" cy="${f(sy)}" r="${r}" fill="#fff" opacity="0.8"/>`);
}
for (const [x, z, r] of [
  [150, H1 - 40, 7],
  [126, H1 - 34, 5],
  [104, H1 - 46, 6],
]) {
  const [sx, sy] = P([x, 0, z]);
  add(`<circle cx="${f(sx)}" cy="${f(sy)}" r="${r}" fill="#8A93A0" opacity="0.6"/>`);
}

// Le feu : chambre + haut du cylindre (côté fond)
{
  const [tx, ty] = P([0, 0, B1 + 40]);
  const fire = rad(tx, ty, 190, [
    [0, "#FFFBE0"],
    [0.25, C.fireHot],
    [0.6, C.fire],
    [1, "#F05A14"],
  ]);
  // haut du cylindre, du piston jusqu'à la culasse
  const band = [];
  for (let i = 0; i <= 48; i++) {
    const t = (Math.PI * i) / 48;
    band.push([R * Math.cos(t), R * Math.sin(t), pistonTop]);
  }
  for (let i = 48; i >= 0; i--) {
    const t = (Math.PI * i) / 48;
    band.push([R * Math.cos(t), R * Math.sin(t), B1]);
  }
  add(`<path d="${poly3(band)}" fill="${fire}"/>`);
  add(`<path d="${poly3(xz(dome))}" fill="${fire}"/>`);
  defs.push(
    `<clipPath id="fireclip"><path d="${poly3(xz(dome))}"/><path d="${poly3(band)}"/><path d="${poly3(
      [
        [-R, 0, pistonTop],
        [R, 0, pistonTop],
        [R, 0, B1],
        [-R, 0, B1],
      ],
    )}"/></clipPath>`,
  );
}

// Coupe (sable hachuré) : carter, bloc, culasse
defs.push(
  `<pattern id="hatch" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)"><rect width="14" height="14" fill="${C.cut}"/><line x1="0" y1="0" x2="0" y2="14" stroke="${C.hatch}" stroke-width="5"/></pattern>`,
);
const cutFace = (outer, holes = []) =>
  add(
    `<path d="${[outer, ...holes].map((h) => poly3(xz(h))).join("")}" fill="url(#hatch)" fill-rule="evenodd" ${stroke()}/>`,
  );
// carter : cadre
cutFace(
  [
    [-KW, K0],
    [KW, K0],
    [KW, B0],
    [-KW, B0],
  ],
  [
    [
      [-KW + KT, K0 + KT],
      [KW - KT, K0 + KT],
      [KW - KT, B0],
      [-KW + KT, B0],
    ],
  ],
);
// bloc : deux murs
cutFace([
  [-BW, B0],
  [-R, B0],
  [-R, B1],
  [-BW, B1],
]);
cutFace([
  [R, B0],
  [BW, B0],
  [BW, B1],
  [R, B1],
]);
// culasse avec chambre et conduits
cutFace(
  [
    [-HW, B1],
    [HW, B1],
    [HW, H1],
    [-HW, H1],
  ],
  [dome, intake, exhaust],
);
// re-trace des conduits (bords nets)
add(`<path d="${poly3(xz(intake))}" fill="none" ${stroke()}/>`);
add(`<path d="${poly3(xz(exhaust))}" fill="none" ${stroke()}/>`);

// Vilebrequin : tourillon (axe le long de y)
cylinder({
  c0: [0, KD + 10, crankZ],
  c1: [0, -110, crankZ],
  u: [1, 0, 0],
  v: [0, 0, 1],
  r: 22,
  light: C.blueLight,
  mid: C.blue,
  dark: C.blueDark,
  capFill: C.blueLight,
});
// bras de manivelle avec contrepoids (derrière la bielle)
{
  const ang = Math.atan2(pinZ - crankZ, pinX); // direction du maneton
  const pts = [...circ2(pinX, pinZ, 32), ...circ2(0, crankZ, 38)];
  for (let i = 0; i <= 24; i++) {
    const t = ang + Math.PI * 0.55 + (Math.PI * 0.9 * i) / 24;
    pts.push([86 * Math.cos(t), crankZ + 86 * Math.sin(t)]);
  }
  slab(hull2(pts), 22, 48, C.blue, C.blueDark);
  // reflet
  const [hx, hy] = P([-40 * Math.cos(ang), 22, crankZ - 40 * Math.sin(ang)]);
  add(`<circle cx="${f(hx)}" cy="${f(hy)}" r="10" fill="#fff" opacity="0.25"/>`);
}

// Bielle (dans le plan de coupe)
{
  const pts = [...circ2(pinX, pinZ, 38), ...circ2(0, pistonPinZ, 24)];
  slab(hull2(pts), -16, 16, C.blueLight, C.blueDark);
  // nervure centrale
  const dx = 0 - pinX,
    dz = pistonPinZ - pinZ,
    L = Math.hypot(dx, dz);
  const ux = dx / L,
    uz = dz / L,
    nx = -uz,
    nz = ux;
  const g = [];
  for (const [s, w] of [
    [52, 9],
    [L - 40, 6],
  ]) {
    g.push([pinX + ux * s + nx * w, pinZ + uz * s + nz * w]);
  }
  for (const [s, w] of [
    [L - 40, -6],
    [52, -9],
  ]) {
    g.push([pinX + ux * s + nx * w, pinZ + uz * s + nz * w]);
  }
  add(`<path d="${poly3(g.map(([x, z]) => [x, -16, z]))}" fill="${C.blue}" ${stroke(2)}/>`);
  // maneton
  const pin = circle([pinX, -16, pinZ], [1, 0, 0], [0, 0, 1], 18, 36).map(P);
  add(`<path d="${pathOf(pin)}" fill="${C.blueDark}" ${stroke(2)}/>`);
  const pin2 = circle([pinX, -16, pinZ], [1, 0, 0], [0, 0, 1], 9, 24).map(P);
  add(`<path d="${pathOf(pin2)}" fill="${C.blueLight}" stroke="none"/>`);
  // boulons de tête de bielle
  for (const s of [-1, 1]) {
    const [bx, by] = P([
      pinX + s * 30 * Math.cos(Math.atan2(dz, dx) + Math.PI / 2),
      -16,
      pinZ + s * 30 * Math.sin(Math.atan2(dz, dx) + Math.PI / 2),
    ]);
    add(`<circle cx="${f(bx)}" cy="${f(by)}" r="5" fill="${C.ink}"/>`);
  }
}

// Poulie avant du vilebrequin
cylinder({
  c0: [0, -70, crankZ],
  c1: [0, -100, crankZ],
  u: [1, 0, 0],
  v: [0, 0, 1],
  r: 46,
  light: C.blueLight,
  mid: C.blue,
  dark: C.blueDark,
  capFill: C.blueLight,
});
{
  const groove = circle([0, -100, crankZ], [1, 0, 0], [0, 0, 1], 30, 48).map(P);
  add(`<path d="${pathOf(groove)}" fill="none" stroke="${C.blueDark}" stroke-width="3"/>`);
  const hub = circle([0, -100, crankZ], [1, 0, 0], [0, 0, 1], 10, 24).map(P);
  add(`<path d="${pathOf(hub)}" fill="${C.ink}"/>`);
}

// Piston (entier)
{
  const top = cylinder({
    c0: [0, 0, pistonBottom],
    c1: [0, 0, pistonTop],
    u: [1, 0, 0],
    v: [0, 1, 0],
    r: R - 3,
    light: C.blueLight,
    mid: C.blue,
    dark: C.blueDark,
    capFill: "#FFB347",
  });
  // segments
  for (const dz of [14, 26, 38])
    add(
      `<path d="${frontArc([0, 0], R - 3, pistonTop - dz)}" fill="none" stroke="${C.blueDark}" stroke-width="3"/>`,
    );
  // tête du piston chauffée par le feu
  const [cx, cy] = P([0, 0, pistonTop]);
  add(
    `<path d="${pathOf(top.top)}" fill="${rad(cx, cy, 120, [
      [0, "#FFE7A0"],
      [1, "#FF8A1F"],
    ])}" ${stroke()}/>`,
  );
}

// Flammes (devant, découpées à la chambre)
{
  const flames = [];
  const tip = [0, B1 + 30];
  const tongues = [
    [-80, 0.95],
    [-48, 1.0],
    [-15, 1.1],
    [18, 1.05],
    [52, 1.0],
    [82, 0.9],
  ];
  for (const [x, k] of tongues) {
    const zb = pistonTop + 4;
    const p = [
      [x - 22, zb],
      [x - 18, zb + 40 * k],
      [x - 4, zb + 70 * k],
      [x + 6, zb + 92 * k],
      [x + 10, zb + 64 * k],
      [x + 22, zb + 30 * k],
      [x + 22, zb],
    ];
    flames.push(p);
  }
  add(`<g clip-path="url(#fireclip)">`);
  for (const p of flames) {
    const pts = p.map(([x, z]) => P([x, -2, z]));
    add(
      `<path d="M${f(pts[0][0])} ${f(pts[0][1])} Q${f(pts[1][0])} ${f(pts[1][1])} ${f(pts[2][0])} ${f(pts[2][1])} T${f(pts[3][0])} ${f(pts[3][1])} Q${f(pts[4][0])} ${f(pts[4][1])} ${f(pts[5][0])} ${f(pts[5][1])} T${f(pts[6][0])} ${f(pts[6][1])}Z" fill="${C.fireHot}" opacity="0.85"/>`,
    );
  }
  const [sx, sy] = P([tip[0], 0, tip[1]]);
  add(`<circle cx="${f(sx)}" cy="${f(sy)}" r="60" fill="#FFFBE0" opacity="0.7"/>`);
  add(`</g>`);
}

// Soupapes fermées (temps « Boum ») + ressorts
for (const [x, col] of [
  [-48, C.blue],
  [48, C.blue],
]) {
  // tige
  cylinder({
    c0: [x, 0, B1 + 46],
    c1: [x, 0, H1 + 52],
    u: [1, 0, 0],
    v: [0, 1, 0],
    r: 6,
    light: C.blueLight,
    mid: col,
    dark: C.blueDark,
    w: 2,
  });
  // tête (champignon) dans son siège
  cylinder({
    c0: [x, 0, B1 + 40],
    c1: [x, 0, B1 + 48],
    u: [1, 0, 0],
    v: [0, 1, 0],
    r: 26,
    light: C.blueLight,
    mid: col,
    dark: C.blueDark,
    w: 2.5,
  });
  // ressort
  const coil = [];
  for (let i = 0; i <= 5 * 36; i++) {
    const t = (i / 36) * Math.PI * 2;
    coil.push([x + 16 * Math.cos(t), 16 * Math.sin(t), H1 + 4 + (i / (5 * 36)) * 40]);
  }
  add(`<path d="${poly3(coil, false)}" fill="none" stroke="${C.ink}" stroke-width="3.5"/>`);
  add(`<path d="${poly3(coil, false)}" fill="none" stroke="${C.metal}" stroke-width="1.5"/>`);
  cylinder({
    c0: [x, 0, H1 + 44],
    c1: [x, 0, H1 + 52],
    u: [1, 0, 0],
    v: [0, 1, 0],
    r: 20,
    light: "#E3E8F0",
    mid: C.metal,
    dark: "#6C7890",
    w: 2.5,
  });
}

// Bougie
{
  const x = 0;
  cylinder({
    c0: [x, 0, B1 + 30],
    c1: [x, 0, B1 + 52],
    u: [1, 0, 0],
    v: [0, 1, 0],
    r: 6,
    light: "#E3E8F0",
    mid: C.metal,
    dark: "#6C7890",
    w: 2,
  });
  cylinder({
    c0: [x, 0, B1 + 46],
    c1: [x, 0, H1 + 6],
    u: [1, 0, 0],
    v: [0, 1, 0],
    r: 12,
    light: "#E3E8F0",
    mid: C.metal,
    dark: "#6C7890",
    w: 2.5,
  });
  // écrou hexagonal
  {
    const hex = (z) =>
      Array.from({ length: 6 }, (_, i) => {
        const t = (i / 6) * Math.PI * 2 + 0.3;
        return [x + 22 * Math.cos(t), 22 * Math.sin(t), z];
      });
    const lo = hex(H1 + 6),
      hi = hex(H1 + 24);
    const h = hull([...lo.map(P), ...hi.map(P)]);
    add(`<path d="${pathOf(h)}" fill="${C.metal}" ${stroke(2.5)}/>`);
    for (let i = 0; i < 6; i++) {
      const a = lo[i],
        b = hi[i];
      if (a[1] < 4)
        add(
          `<path d="${poly3([a, b], false)}" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-opacity="0.5"/>`,
        );
    }
    add(`<path d="${poly3(hi)}" fill="#E3E8F0" ${stroke(2.5)}/>`);
  }
  cylinder({
    c0: [x, 0, H1 + 24],
    c1: [x, 0, H1 + 84],
    u: [1, 0, 0],
    v: [0, 1, 0],
    r: 13,
    light: "#FFFFFF",
    mid: C.ceramic,
    dark: "#C9CFDA",
    w: 2.5,
  });
  for (const z of [H1 + 44, H1 + 56, H1 + 68])
    add(
      `<path d="${frontArc([x, 0], 13, z)}" fill="none" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="2"/>`,
    );
  cylinder({
    c0: [x, 0, H1 + 84],
    c1: [x, 0, H1 + 100],
    u: [1, 0, 0],
    v: [0, 1, 0],
    r: 7,
    light: "#E3E8F0",
    mid: C.metal,
    dark: "#6C7890",
    w: 2,
  });
  // câble électrique (jaune = électricité)
  const c = [
    P([x, 0, H1 + 96]),
    P([x + 40, 0, H1 + 150]),
    P([x + 160, 0, H1 + 150]),
    P([x + 250, 0, H1 + 175]),
  ];
  const d = `M${f(c[0][0])} ${f(c[0][1])} C${f(c[1][0])} ${f(c[1][1])} ${f(c[2][0])} ${f(c[2][1])} ${f(c[3][0])} ${f(c[3][1])}`;
  add(`<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="13" stroke-linecap="round"/>`);
  add(`<path d="${d}" fill="none" stroke="${C.spark}" stroke-width="7" stroke-linecap="round"/>`);
  // étincelle
  const [sx, sy] = P([x, 0, B1 + 26]);
  const rays = 10;
  let star = "";
  for (let i = 0; i < rays * 2; i++) {
    const r = i % 2 ? 9 : 30;
    const t = (i / (rays * 2)) * Math.PI * 2 - Math.PI / 2;
    star += `${i ? "L" : "M"}${f(sx + r * Math.cos(t))} ${f(sy + r * Math.sin(t))}`;
  }
  add(
    `<path d="${star}Z" fill="${C.spark}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`,
  );
  add(`<circle cx="${f(sx)}" cy="${f(sy)}" r="6" fill="#fff"/>`);
}

// Flèches de mouvement
{
  // le piston est poussé vers le bas
  const [ax, ay] = P([0, -R, pistonTop - 50]);
  add(
    `<g transform="translate(${f(ax)} ${f(ay)})"><path d="M-16 -50 L16 -50 L16 0 L34 0 L0 40 L-34 0 L-16 0 Z" fill="#fff" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/></g>`,
  );
  // rotation du vilebrequin (autour de la poulie)
  const pts = circle(
    [0, -104, crankZ],
    [1, 0, 0],
    [0, 0, 1],
    70,
    40,
    Math.PI * 0.15,
    Math.PI * 1.05,
  ).map(P);
  const d = pathOf(pts, false);
  add(`<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>`);
  add(`<path d="${d}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`);
  const e = pts[pts.length - 1],
    p2 = pts[pts.length - 3];
  const ang = Math.atan2(e[1] - p2[1], e[0] - p2[0]);
  add(
    `<g transform="translate(${f(e[0])} ${f(e[1])}) rotate(${f((ang * 180) / Math.PI)})"><path d="M-6 -20 L24 0 L-6 20 Z" fill="#fff" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/></g>`,
  );
}

// ---------- Étiquettes ----------
const labels = [];
function label({ at, to, title, sub, color = C.ink, align = "left" }) {
  const [px, py] = P(at);
  const [tx, ty] = to;
  const anchor = align === "left" ? "start" : "end";
  const dir = align === "left" ? 1 : -1;
  const lineEnd = tx - dir * 14;
  labels.push(
    `<path d="M${f(px)} ${f(py)} L${f(lineEnd)} ${f(ty - 10)}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`,
  );
  labels.push(
    `<circle cx="${f(px)}" cy="${f(py)}" r="7" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`,
  );
  labels.push(
    `<text x="${tx}" y="${ty}" text-anchor="${anchor}" class="lt" fill="${color}">${title}</text>`,
  );
  if (sub)
    labels.push(`<text x="${tx}" y="${ty + 34}" text-anchor="${anchor}" class="ls">${sub}</text>`);
}
label({ at: [0, 0, H1 + 60], to: [1290, 160], title: "La bougie", sub: "fait une étincelle" });
label({
  at: [-150, 0, H1 - 40],
  to: [520, 250],
  title: "L’air et l’essence",
  sub: "entrent par ici",
  color: "#1A7FC4",
  align: "right",
});
label({
  at: [150, 0, H1 - 40],
  to: [1360, 330],
  title: "Les fumées",
  sub: "sortent par là",
  color: "#6B7380",
});
label({
  at: [R - 3, -10, pistonTop - 70],
  to: [1360, 520],
  title: "Le piston",
  sub: "est poussé vers le bas",
});
label({
  at: [pinX * 0.45, -16, (pinZ + pistonPinZ) * 0.42],
  to: [520, 640],
  title: "La bielle",
  sub: "transmet la poussée",
  align: "right",
});
label({
  at: [24, -100, crankZ - 22],
  to: [1360, 760],
  title: "Le vilebrequin",
  sub: "se met à tourner",
});

// ---------- Mise en page ----------
const steps = [
  { n: 1, t: "Aspire", c: C.air, on: false },
  { n: 2, t: "Serre", c: "#C9D1DE", on: false },
  { n: 3, t: "Boum !", c: C.fire, on: true },
  { n: 4, t: "Recrache", c: C.smoke, on: false },
];
const stepW = 250,
  gap = 26,
  total = steps.length * stepW + (steps.length - 1) * gap;
let sx0 = (1920 - total) / 2;
const stepSvg = steps
  .map((s, i) => {
    const x = sx0 + i * (stepW + gap);
    const y = 958,
      h = 74;
    const fill = s.on ? s.c : "#FFFFFF";
    const op = s.on ? 1 : 0.9;
    return `<g opacity="${op}">
      <rect x="${x}" y="${y}" width="${stepW}" height="${h}" rx="37" fill="${fill}" stroke="${C.ink}" stroke-width="${s.on ? 4 : 3}"/>
      <circle cx="${x + 40}" cy="${y + h / 2}" r="22" fill="${s.on ? "#fff" : s.c}" stroke="${C.ink}" stroke-width="3"/>
      <text x="${x + 40}" y="${y + h / 2 + 9}" text-anchor="middle" class="sn">${s.n}</text>
      <text x="${x + 76}" y="${y + h / 2 + 12}" class="st" fill="${s.on ? "#fff" : C.ink}" ${s.on ? `stroke="${C.ink}" stroke-width="1.5" paint-order="stroke"` : ""}>${s.t}</text>
    </g>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Kidi-science — test de style</title>
<style>
@font-face{font-family:Fredoka;font-weight:500;src:url(../../fonts/fredoka-500.woff2) format("woff2")}
@font-face{font-family:Fredoka;font-weight:600;src:url(../../fonts/fredoka-600.woff2) format("woff2")}
@font-face{font-family:Fredoka;font-weight:700;src:url(../../fonts/fredoka-700.woff2) format("woff2")}
html,body{margin:0;background:${C.paper}}
svg{display:block;width:1920px;height:1080px}
text{font-family:Fredoka,sans-serif}
.lt{font-size:38px;font-weight:600}
.ls{font-size:27px;font-weight:500;fill:#55607A}
.sn{font-size:24px;font-weight:700;fill:${C.ink}}
.st{font-size:34px;font-weight:600}
.logo{font-size:40px;font-weight:700}
.chap{font-size:34px;font-weight:600;fill:${C.ink}}
</style></head><body>
<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
<defs>${defs.join("")}
<radialGradient id="bg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#FCEFD9"/></radialGradient>
<pattern id="dots" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="${C.ink}" opacity="0.07"/></pattern>
</defs>
<rect width="1920" height="1080" fill="url(#bg)"/>
<rect width="1920" height="1080" fill="url(#dots)"/>
${out.join("\n")}
${labels.join("\n")}
<!-- logo de la série -->
<g transform="translate(64 58)">
  <rect x="0" y="0" width="276" height="70" rx="35" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/>
  <text x="30" y="49" class="logo" fill="${C.ink}">Kidi<tspan fill="${C.fire}">-</tspan><tspan fill="${C.blue}">science</tspan></text>
</g>
<!-- chapitre -->
<g transform="translate(1856 58)">
  <rect x="-420" y="0" width="420" height="70" rx="35" fill="${C.ink}"/>
  <text x="-210" y="47" text-anchor="middle" class="chap" fill="#fff" style="fill:#fff">Le moteur à essence</text>
</g>
${stepSvg}
</svg></body></html>`;

writeFileSync(new URL("./index.html", import.meta.url), html);
console.log("index.html écrit", { pistonTop: f(pistonTop), pinX: f(pinX), pinZ: f(pinZ) });
