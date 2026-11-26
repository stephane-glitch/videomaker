/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs ; certains paramètres (w, h, t, s) ne servent pas partout */
// Scène 1 : un seul grand collage vertical. La caméra descend du titre jusqu'au centre de la Terre.
scene("S1", [
  ["board", 1],
  ["sky", 0.82],
  ["far", 0.9],
  ["world", 1],
]);
const T = (id) => scn(id).start;
const CX = 960;
const CORE_Y = 6900; // centre de la Terre dans le collage

// Carton du fond, en plusieurs plaques
for (let i = 0; i < 5; i++) board("board", -1140 + i * 1900, 1900);

// Caméra (position verticale du haut de l'image dans le collage)
const K = {
  dig: cue("s0-1", "creuse"),
  press: cue("s2-3", "descends") - 0.3,
  rec: cue("s2-6") - 1.0,
  dia: cue("s3-4") - 0.6,
  ball: cue("s4-3", "centre") - 0.9,
};
const camY = track([
  [0, -1080],
  [T("s0") - 0.2, -1066],
  [T("s0") + 1.1, 0, "e"],
  [T("s1") - 0.1, 26],
  [T("s1") + 1.0, 430, "e"],
  [T("s2") - 0.1, 470],
  [T("s2") + 1.1, 900, "e"],
  [K.press, 930],
  [K.press + 1.3, 1560, "e"],
  [K.rec, 1600],
  [K.rec + 1.3, 2420, "e"],
  [T("s3") - 0.1, 2450],
  [T("s3") + 1.4, 3260, "e"],
  [K.dia, 3310],
  [K.dia + 1.3, 4200, "e"],
  [T("s4") - 0.1, 4240],
  [T("s4") + 1.4, 5090, "e"],
  [K.ball, 5130],
  [K.ball + 1.5, 6330, "e"],
  [T("s5") + 1, 6370],
]);
SCENES.S1.cam = camY;

// ================= Générique : la feuille de titre =================
{
  P({ pts: rect(210, -985, 1500, 850, 3, 8), fill: "#2f5bd3", stock: "sugar", lift: 8, boil: 0.5 });
  tape(170, -1000, -9);
  tape(1630, -995, 8);
  P({
    pts: starPts(CX, -590, 330, 210, 14),
    fill: "#f6b93b",
    lift: 6,
    tin: 0.2,
    from: [0, 0, -40],
    anim: (t, s) => ({ r: Math.floor(s / 2) * 4 }),
    boil: 0.5,
  });
  P({
    pts: blob(CX, -590, 205, 205, 26, 4, 0.02),
    fill: "#ffd84a",
    extra: dots("p-half2", 0.5),
    lift: 7,
    tin: 0.27,
    snd: false,
  });
  letters("Kidi-science", 390, -690, { size: 118, tin: 0.45, dt: 0.1, shift: 1 });
  label(600, -470, "Dis… comment ça marche ?", {
    tin: cue("g-1") + 0.1,
    fs: 54,
    rot: -2,
    snd: false,
  });
  // ciseaux et confettis
  for (let i = 0; i < 14; i++) {
    const x = 280 + rnd(i * 3) * 1360,
      y = -940 + rnd(i * 3 + 1) * 760;
    if (Math.abs(x - CX) < 620 && Math.abs(y + 590) < 300) continue;
    P({
      pts: starPts(x, y, 26, 26, 2 + (i % 3), rnd(i) * 3),
      fill: LCOL[i % 6][0],
      lift: 3,
      rot: rnd(i) * 80,
      tin: 1.2 + i * 0.1,
      snd: false,
      from: [0, -70, 60],
      anim: (t, s) => ({ r: [0, 8, 0, -8][(Math.floor(s / 3) + i) % 4] }),
    });
  }
  label(650, -250, "Qu'y a-t-il sous nos pieds ?", {
    tin: cue("g-1") + 2.3,
    fs: 46,
    rot: 2,
    fill: "#2b2b2b",
    ink: "#ffd84a",
    from: [0, 60, -6],
  });
}

// ================= Le jardin =================
P({
  layer: "sky",
  pts: rect(58, 34, 1804, 830, 5, 7),
  fill: "#a8d5ee",
  stock: "sugar",
  lift: 6,
  boil: 0.5,
});
tape(40, 22, -8, "sky");
tape(1770, 26, 7, "sky");
P({
  layer: "sky",
  pts: starPts(1590, 235, 168, 108, 12),
  fill: "#f6b93b",
  anim: (t, s) => ({ r: Math.floor(s / 2) * 5 }),
  boil: 0.6,
});
P({
  layer: "sky",
  pts: blob(1590, 235, 96, 96, 20, 3, 0.03),
  fill: "#ffd84a",
  extra: dots("p-half2", 0.55),
  lift: 7,
});
{
  const cloud = (x, y, s, sd) => {
    const drift = (t, st) => ({ x: (Math.floor(st / 2) * 1.5) % 500 });
    P({
      layer: "far",
      pts: blob(x, y, 150 * s, 52 * s, 11, sd, 0.22),
      fill: "#fbf8f0",
      torn: 2,
      deckle: false,
      alpha: 0.93,
      lift: 8,
      shA: 0.25,
      anim: drift,
    });
    P({
      layer: "far",
      pts: blob(x + 30 * s, y - 38 * s, 85 * s, 48 * s, 9, sd + 9, 0.2),
      fill: "#ffffff",
      torn: 1,
      deckle: false,
      alpha: 0.9,
      lift: 6,
      shA: 0.22,
      anim: drift,
    });
  };
  cloud(1050, 420, 0.8, 11);
  cloud(140, 480, 0.7, 31);
  const hill = (seed, base, amp, k, ph) => {
    const pts = [];
    for (let i = 0; i <= 24; i++)
      pts.push([
        66 + (1788 * i) / 24,
        base - amp * Math.sin((i / 24) * Math.PI * k + ph) + (rnd(seed + i) - 0.5) * 14,
      ]);
    pts.push([1854, 850], [66, 850]);
    return pts;
  };
  P({
    layer: "far",
    pts: hill(3, 640, 60, 2.2, 0.4),
    fill: "#9ccb7c",
    stock: "sugar",
    torn: 1,
    lift: 5,
    boil: 0.5,
  });
  P({
    layer: "far",
    pts: hill(47, 700, 42, 3.1, 2.2),
    fill: "#74b565",
    stock: "sugar",
    torn: 2,
    lift: 6,
    boil: 0.5,
  });
}
letters("Qu'y a-t-il", 110, 96, { layer: "sky", tin: T("s0") + 0.5 });
letters("sous nos pieds ?", 150, 224, { layer: "sky", tin: T("s0") + 1.1, n0: 9, shift: 1 });

// ================= Les grandes feuilles du sous-sol =================
// (les couches du dessous viennent se coller par-dessus celles du dessus)
P({
  pts: band(26, 1894, 770, 1345, 7, 12),
  fill: "#6f4a2b",
  stock: "sugar",
  torn: 1,
  deckle: false,
  lift: 6,
  boil: 0.5,
});
P({
  pts: band(22, 1898, 1295, 3440, 21, 20),
  fill: "#a5a59f",
  torn: 2,
  dw: 12,
  lift: 7,
  extra: newsprint,
  boil: 0.4,
});
P({
  pts: band(26, 1894, 3360, 5720, 33, 24),
  fill: "#e56a2c",
  stock: "marble",
  torn: 1,
  dw: 12,
  lift: 8,
  boil: 0.4,
});
{
  // noyau liquide : une grande feuille dont le haut est un arc de cercle
  const arc = (R, x0, x1, n, seed, jag) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      pts.push([x, CORE_Y - Math.sqrt(R * R - (x - CX) * (x - CX)) + (rnd(seed + i) - 0.5) * jag]);
    }
    return pts;
  };
  P({
    pts: [...arc(1680, 30, 1890, 40, 3, 26), [1890, 7560], [30, 7560]],
    fill: "#ffd23f",
    alpha: 0.42,
    torn: 2,
    deckle: false,
    lift: 0,
    boil: 0.4,
    anim: (t, s) => ({ y: [0, -10][Math.floor(s / 4) % 2] }),
  });
  P({
    pts: [...arc(1600, 26, 1894, 40, 9, 12), [1894, 7560], [26, 7560]],
    fill: "#f6a623",
    torn: 2,
    dw: 10,
    lift: 8,
    extra: dots("p-half", 0.6),
    boil: 0.4,
  });
}

// ================= Les pointillés du trou =================
{
  const t0 = cue("s0-1", "droit");
  for (let k = 0; k < 90; k++) {
    const y = 850 + k * 68;
    if (y > CORE_Y - 430) break;
    const real = y < 2880; // au-delà du record, le trou n'existe que dans notre tête
    if (y > 4640 && y < 4900) continue;
    P({
      pts: rect(952, y, 16, 40, k, 2.5),
      fill: real ? "#fbf3dc" : "#ffd84a",
      alpha: real ? 0 : 0.85,
      lift: 2,
      rot: (rnd(k) - 0.5) * 10,
      boil: 0.8,
      anim: (t) => ({ o: t >= t0 + k * 0.2 && (k < 4 || y < camY(t) + 640) ? 1 : 0 }),
    });
  }
}

// ================= Détails de la terre du jardin =================
const R1 = cue("s1-1", "racines"),
  R2 = cue("s1-1", "vers"),
  R3 = cue("s1-1", "cailloux");
const shake =
  (t0, d = 1.2) =>
  (t, s) =>
    t >= t0 && t < t0 + d ? { r: [6, -6][s % 2], y: [-4, 2][s % 2] } : null;
for (const [dx, len, r] of [
  [-22, 170, 16],
  [4, 230, -3],
  [26, 150, -22],
])
  P({
    pts: [
      [415 + dx, 790],
      [433 + dx, 790],
      [428 + dx, 790 + len * 0.6],
      [424 + dx, 790 + len],
    ],
    fill: "#b98a55",
    stock: "kraft",
    lift: 2,
    rot: r,
    pivot: [424 + dx, 790],
    boil: 0.6,
    anim: shake(R1),
  });
for (let i = 0; i < 9; i++) {
  const x = 150 + rnd(i * 3 + 1) * 1620,
    y = 900 + rnd(i * 3 + 2) * 330,
    r = 16 + rnd(i * 3 + 3) * 22;
  if (
    Math.abs(x - CX) < 70 ||
    (x > 1100 && x < 1600 && y > 940 && y < 1130) ||
    (x > 560 && x < 1000 && y > 1100)
  )
    continue;
  P({
    pts: blob(x, y, r, r * 0.75, 7, i * 11, 0.18),
    fill: ["#b9b4aa", "#8f8c86", "#d2ccbf"][i % 3],
    lift: 3,
    rot: rnd(i) * 90,
    anim: shake(R3 + i * 0.05, 1),
  });
}
{
  const x = 690,
    y = 1190;
  P({
    pts: [
      [x - 70, y - 20],
      [x - 52, y - 26],
      [x - 44, y - 10],
      [x + 44, y - 10],
      [x + 52, y - 26],
      [x + 70, y - 20],
      [x + 66, y],
      [x + 70, y + 20],
      [x + 52, y + 26],
      [x + 44, y + 10],
      [x - 44, y + 10],
      [x - 52, y + 26],
      [x - 70, y + 20],
      [x - 66, y],
    ],
    fill: "#f3ecda",
    lift: 3,
    rot: -18,
    anim: shake(cue("s1-2", "os"), 1.4),
  });
  // le chien du voisin
  const td = cue("s1-3", "chien");
  P({
    pts: blob(900, 1180, 62, 54, 12, 8, 0.05),
    fill: "#c98a4b",
    lift: 5,
    tin: td,
    snd: "pop",
    from: [90, 0, 20],
    anim: (t, s) => ({ r: [0, 7, 0, -7][Math.floor(s / 3) % 4] }),
    art: `<path d="M850 1140l-30 50 44 6zM950 1140l30 50-44 6z" fill="#7c4a2d"/><circle cx="880" cy="1170" r="7" fill="${INK}"/><circle cx="920" cy="1170" r="7" fill="${INK}"/><ellipse cx="900" cy="1196" rx="13" ry="9" fill="${INK}"/><path d="M886 1212q14 14 28 0" stroke="${INK}" stroke-width="5" fill="none"/><path d="M900 1214v0q4 22 14 14" fill="#e98fa6"/>`,
  });
}
{
  const worm = (ph) => {
    const top = [],
      bot = [];
    for (let i = 0; i <= 10; i++) {
      const x = 250 + i * 17,
        y = 1010 + Math.sin(i * 0.9 + ph) * 14;
      top.push([x, y - 9]);
      bot.unshift([x, y + 9]);
    }
    return top.concat(bot);
  };
  [0, 1].forEach((k) =>
    P({
      pts: worm(k * 2.4),
      fill: "#e98fa6",
      lift: 3,
      boil: 0.4,
      alt: [3, k, 2],
      anim: (t, s) => ({ x: (Math.floor(s / 3) * 2.4) % 260 }),
    }),
  );
}
P({
  pts: [
    [682, 792],
    [732, 792],
    [712, 925],
    [704, 930],
  ],
  fill: "#f08a24",
  lift: 3,
  rot: 4,
});
label(480, 870, "des racines", { tin: R1, fs: 36, rot: 3 });
label(190, 1050, "des vers", { tin: R2, fs: 36, rot: -3 });
label(1230, 1150, "des cailloux", { tin: R3, fs: 36, rot: 2 });
{
  // règle : la terre, une couche toute fine
  const tr = cue("s1-3", "fine");
  P({
    pts: rect(1690, 790, 46, 520, 4, 3),
    fill: "#f2b134",
    lift: 5,
    tin: tr,
    from: [80, 0, 6],
    extra: (w, h) =>
      Array.from(
        { length: 17 },
        (_, i) =>
          `<rect x="0" y="${14 + i * 30}" width="${i % 2 ? 16 : 26}" height="5" fill="${INK}"/>`,
      ).join(""),
  });
  label(1300, 990, "quelques mètres", { tin: cue("s1-3", "quelques"), fs: 44 });
}

// ================= La croûte =================
for (let i = 0; i < 26; i++) {
  const x = 110 + ((i * 211) % 1720),
    y = 1400 + rnd(i * 5 + 2) * 1900,
    r = 50 + rnd(i * 5 + 3) * 60;
  if (Math.abs(x - CX) < 120) continue;
  if (y > 1800 && y < 2640) continue; // la place des strates
  if (y < 1800 && x > 250 && x < 1500) continue;
  if (y > 2700 && y < 3260 && x > 380 && x < 1640) continue;
  P({
    pts: blob(x, y, r, r * 0.62, 6, i * 13 + 5, 0.22),
    fill: ["#77797c", "#8d8a84", "#5f6367"][i % 3],
    lift: 4,
    rot: rnd(i + 40) * 60 - 30,
    extra: i % 2 ? newsprint : null,
  });
}
P({
  pts: blob(1640, 1640, 62, 62, 14, 77, 0.05),
  fill: "#ddd3bb",
  lift: 4,
  over: (w, h) => {
    let d = "";
    for (let i = 0; i <= 60; i++)
      d +=
        (i ? "L" : "M") +
        f1(w / 2 + Math.cos(i * 0.3) * (4 + i * 0.8)) +
        " " +
        f1(h / 2 + Math.sin(i * 0.3) * (4 + i * 0.8));
    return `<path d="${d}" fill="none" stroke="#7a6a4c" stroke-width="5" stroke-linecap="round"/>`;
  },
});
{
  // « ta pelle cogne »
  const tc = cue("s2-1", "cogne");
  P({
    pts: starPts(CX, 1330, 150, 92, 11, 0.2),
    fill: "#e4472a",
    lift: 8,
    tin: tc,
    tout: tc + 1.6,
    snd: "zap",
    from: [0, 0, -30],
    anim: (t, s) => ({ s: [1, 1.1][s % 2] }),
    over: (w, h) =>
      `<text x="${w / 2}" y="${h / 2 + 20}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="58" fill="#fff6e0">TOC !</text>`,
  });
  label(1090, 1430, "la croûte terrestre", { tin: cue("s2-1", "croûte"), fs: 52 });
  // le pain et sa croûte
  const tp = cue("s2-2", "pain");
  P({
    pts: blob(520, 1560, 190, 120, 16, 12, 0.05),
    fill: "#b7702d",
    stock: "kraft",
    lift: 7,
    tin: tp,
    tout: K.press + 0.2,
    snd: "pop",
    from: [-120, 0, -14],
    art: `<path d="${poly(blob(520, 1564, 162, 94, 16, 12, 0.05))}" fill="#f6e2b3"/><circle cx="460" cy="1540" r="10" fill="#e6c98c"/><circle cx="560" cy="1590" r="14" fill="#e6c98c"/><circle cx="600" cy="1530" r="8" fill="#e6c98c"/>`,
  });
  label(330, 1700, "la croûte du pain", { tin: tp + 0.3, tout: K.press + 0.2, fs: 36, rot: 3 });
}
{
  // ----- La pression : des couches de plus en plus écrasées -----
  const ST = [
    ["#d8c29a", "sugar", 190],
    ["#b98a55", "kraft", 160],
    ["#c9c2b2", "fine", 132],
    ["#8d8a84", "sugar", 108],
    ["#6f6a66", "fine", 90],
    ["#55524f", "sugar", 76],
  ];
  let y = 1850;
  const tS = K.press + 0.6;
  ST.forEach(([fill, stock, h], i) => {
    P({
      pts: band(24, 1896, y, y + h + 26, 50 + i * 7, 9, 120),
      fill,
      stock,
      torn: 1 + (i % 2),
      dw: 7,
      lift: 5,
      boil: 0.4,
      tin: tS + i * 0.13,
      snd: i % 2 ? false : "tic",
      from: [i % 2 ? 160 : -160, 0, 0],
      extra: i === 2 || i === 4 ? newsprint : null,
    });
    y += h;
  });
  const tp = cue("s2-3", "pèse");
  for (let i = 0; i < 5; i++)
    P({
      pts: arrowPts(600 + i * 180, 1660, 150, 90, 34),
      fill: "#e4472a",
      lift: 6,
      tin: tp + i * 0.07,
      snd: i ? false : "whoosh",
      from: [0, -90, 0],
      press: { d: [0, 22], t0: tp + 0.4, per: 3 },
    });
  label(770, 1595, "la pression", {
    tin: cue("s2-3", "pression"),
    fs: 54,
    rot: -2,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });

  // la pile de copains
  const tb = cue("s2-4", "bas");
  P({
    pts: rect(130, 1930, 520, 430, 6, 6),
    fill: "#f7f0dc",
    lift: 8,
    tin: tb - 0.5,
    rot: -2,
    from: [-200, 0, -8],
    extra: dots("p-grid", 0.5),
  });
  const buddy = (bx, by, col, tin, squash) => {
    const art =
      `<circle cx="${bx - 22}" cy="${by + 28}" r="33" fill="#f3c9a0"/><circle cx="${bx - 32}" cy="${by + 20}" r="4.5" fill="${INK}"/><circle cx="${bx - 14}" cy="${by + 20}" r="4.5" fill="${INK}"/>` +
      (squash
        ? `<path d="M${bx - 36} ${by + 42}q12 -10 26 0" stroke="${INK}" stroke-width="4" fill="none"/>`
        : `<path d="M${bx - 36} ${by + 36}q12 10 26 0" stroke="${INK}" stroke-width="4" fill="none"/>`) +
      `<rect x="${bx + 196}" y="${by + 6}" width="70" height="20" fill="#2c5d7c"/><rect x="${bx + 196}" y="${by + 32}" width="70" height="20" fill="#2c5d7c"/>`;
    P({
      pts: rect(bx, by, 200, 58, bx, 3),
      fill: col,
      lift: 5,
      tin,
      snd: "pop",
      from: [0, -260, squash ? 0 : 14],
      pivot: [bx + 100, by + 58],
      art,
      anim: squash
        ? (t, s) =>
            t > tb + 0.9
              ? { sy: [0.66, 0.6][Math.floor(s / 2) % 2], sx: 1.08 }
              : t > tb + 0.3
                ? { sy: 0.85 }
                : null
        : (t, s) => ({ r: [0, 1.5][Math.floor(s / 3 + bx) % 2] }),
    });
  };
  buddy(270, 2260, "#d9486e", tb - 0.3, true);
  buddy(250, 2196, "#3a9d6e", tb + 0.2, false);
  buddy(290, 2134, "#f2b134", tb + 0.6, false);
  buddy(260, 2072, "#2f6f8f", tb + 1.0, false);
  label(200, 1950, "Aïe ! Ça pèse !", { tin: tb + 1.3, fs: 34, rot: 2 });

  // sable + boue → pierre
  const ts = cue("s2-5", "sable"),
    tq = cue("s2-5", "pierre");
  P({
    pts: rect(1270, 1930, 520, 430, 9, 6),
    fill: "#f7f0dc",
    lift: 8,
    tin: ts - 0.5,
    rot: 2,
    from: [200, 0, 8],
    extra: dots("p-grid", 0.5),
  });
  const sandDots = (w, h) =>
    Array.from(
      { length: 90 },
      (_, i) =>
        `<circle cx="${f1(rnd(i) * w)}" cy="${f1(rnd(i + 200) * h)}" r="${f1(3 + rnd(i + 400) * 3)}" fill="#b8892c"/>`,
    ).join("");
  P({
    pts: band(1310, 1750, 2050, 2170, 3, 6, 80),
    fill: "#f2cf6b",
    torn: 1,
    deckle: false,
    lift: 3,
    tin: ts,
    tout: tq,
    extra: sandDots,
    snd: "pop",
    anim: (t) => ({ sy: 1 - 0.35 * lin(t, tq - 1.2, tq) }),
    pivot: [1530, 2290],
  });
  P({
    pts: band(1310, 1750, 2180, 2290, 5, 6, 80),
    fill: "#6f4a2b",
    stock: "sugar",
    torn: 2,
    deckle: false,
    lift: 3,
    tin: cue("s2-5", "boue"),
    tout: tq,
    snd: "pop",
    anim: (t) => ({ sy: 1 - 0.35 * lin(t, tq - 1.2, tq) }),
    pivot: [1530, 2290],
  });
  P({
    pts: band(1310, 1750, 2190, 2240, 7, 4, 80),
    fill: "#d8c29a",
    stock: "sugar",
    lift: 3,
    tin: tq,
    snd: "chime",
    from: [0, -20, 0],
    extra: sandDots,
  });
  P({
    pts: band(1310, 1750, 2244, 2292, 8, 4, 80),
    fill: "#77797c",
    lift: 3,
    tin: tq,
    snd: false,
    from: [0, -20, 0],
    extra: newsprint,
  });
  for (let i = 0; i < 3; i++)
    P({
      pts: arrowPts(1400 + i * 130, 1975, 80, 90, 22),
      fill: "#e4472a",
      lift: 4,
      tin: ts + 0.9 + i * 0.07,
      snd: false,
      from: [0, -60, 0],
      anim: (t) => ({ y: 70 * lin(t, tq - 1.2, tq) + 30 * lin(t, tq, tq + 0.2) }),
      press: { d: [0, 12], t0: ts + 1.2, per: 3 },
    });
  label(1340, 2310, "de la pierre !", {
    tin: tq + 0.2,
    fs: 40,
    rot: -2,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });
  label(700, 2420, "la pression fabrique les couches", {
    tin: cue("s2-5", "fabrique"),
    fs: 42,
    rot: -1,
  });
}
{
  // ----- Le trou record -----
  const tr = cue("s2-6", "douze"),
    t20 = cue("s2-6", "vingt"),
    tn = cue("s2-6", "traversé");
  P({
    pts: [
      [930, 2880],
      [990, 2880],
      [984, 2950],
      [960, 2996],
      [936, 2950],
    ],
    fill: "#9aa6b2",
    lift: 5,
    tin: tr - 0.6,
    from: [0, -120, 0],
    anim: (t, s) => ({ r: [0, 5, 0, -5][s % 4] }),
    extra: (w, h) => `<path d="M0 20L${w} 34M0 44L${w} 58" stroke="#5f6a76" stroke-width="6"/>`,
  });
  label(1050, 2850, "12 km : le record !", { tin: tr, fs: 50, rot: 2 });
  // calendrier
  P({
    pts: rect(520, 2800, 250, 250, 3, 4),
    fill: "#f7f0dc",
    lift: 7,
    tin: t20,
    snd: "pop",
    rot: -4,
    from: [-90, 0, -10],
    art: `<rect x="520" y="2800" width="250" height="64" fill="#d9482f"/><text x="645" y="2990" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="120" fill="${INK}">20</text><text x="645" y="2846" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="40" fill="#fff6e0">ANS</text>`,
  });
  P({
    pts: arrowPts(CX, 3040, 290, 90, 22),
    fill: "#fbf3dc",
    lift: 3,
    tin: tn,
    from: [0, -60, 0],
    alpha: 0.9,
    press: { d: [0, 14], t0: tn + 0.3, per: 3 },
  });
  label(1040, 3140, "encore de la croûte…", { tin: tn + 0.2, fs: 42, rot: -2 });
  // le goûter périmé
  const tg = cue("s2-7", "goûter");
  P({
    pts: blob(650, 3200, 74, 70, 14, 6, 0.05),
    fill: "#c98a4b",
    lift: 5,
    tin: tg,
    snd: "pop",
    from: [-80, 0, -30],
    anim: (t, s) => ({ r: [0, 6][Math.floor(s / 3) % 2] }),
    art: `<circle cx="625" cy="3180" r="13" fill="#5a3a20"/><circle cx="676" cy="3216" r="11" fill="#5a3a20"/><circle cx="640" cy="3232" r="15" fill="#6fae3c"/><circle cx="684" cy="3176" r="12" fill="#8fc94f"/><circle cx="610" cy="3214" r="8" fill="#6fae3c"/>`,
  });
  label(420, 3290, "Beurk !", {
    tin: cue("s2-7", "périmé"),
    fs: 40,
    rot: 4,
    fill: "#6fae3c",
    ink: "#fff6e0",
    snd: "zap",
  });
}

// ================= Le manteau =================
{
  label(250, 3520, "le manteau", {
    tin: cue("s3-1", "manteau"),
    fs: 56,
    rot: -3,
    from: [-70, -30, -9],
  });
  const t3 = cue("s3-1", "trois");
  P({
    pts: rect(1700, 3470, 46, 800, 4, 3),
    fill: "#f7f0dc",
    lift: 5,
    tin: t3,
    from: [80, 0, 6],
    extra: (w, h) =>
      Array.from(
        { length: 26 },
        (_, i) =>
          `<rect x="0" y="${14 + i * 30}" width="${i % 2 ? 16 : 26}" height="5" fill="${INK}"/>`,
      ).join(""),
  });
  label(1330, 3560, "3 000 km", { tin: t3 + 0.15, fs: 56, rot: 2 });
  const tq = cue("s3-2", "fondu");
  letters("?", 1010, 3760, { tin: tq, tout: cue("s3-3"), size: 130, shift: 2 });
  // un bloc de roche serré de tous les côtés
  const tp = cue("s3-3", "pression"),
    tsol = cue("s3-3", "solide"),
    tf = cue("s3-3", "coule");
  P({
    pts: blob(CX, 3920, 150, 120, 9, 31, 0.12),
    fill: "#b8431c",
    stock: "sugar",
    torn: 1,
    lift: 8,
    tin: tp - 0.3,
    snd: "pop",
    from: [0, -80, 20],
    anim: (t, s) => (t > tp + 0.4 && t < tf ? { s: [1, 0.96][Math.floor(s / 3) % 2] } : null),
  });
  for (const [x, y, deg] of [
    [640, 3920, 0],
    [1280, 3920, 180],
    [CX, 3640, 90],
    [CX, 4200, 270],
  ])
    P({
      pts: arrowPts(x, y, 150, deg, 32),
      fill: "#2b2b2b",
      lift: 6,
      tin: tp,
      tout: tf,
      snd: false,
      from: [-Math.cos((deg * Math.PI) / 180) * 120, -Math.sin((deg * Math.PI) / 180) * 120, 0],
      press: {
        d: [Math.cos((deg * Math.PI) / 180) * 20, Math.sin((deg * Math.PI) / 180) * 20],
        t0: tp + 0.4,
        per: 3,
      },
    });
  label(1300, 3770, "solide !", {
    tin: tsol,
    tout: tf + 0.6,
    fs: 50,
    rot: 3,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });
  // elle coule tout doucement : des flèches qui tournent lentement
  for (let i = 0; i < 8; i++)
    P({
      pts: arrowPts(-45, 0, 90, 0, 24),
      fill: "#ffd84a",
      lift: 5,
      tin: tf + i * 0.06,
      snd: i ? false : "whoosh",
      pivot: [0, 0],
      span: [3600, 4260],
      boil: 0.4,
      from: [0, 0, 0],
      anim: (t, s) => {
        const a = (i / 8) * TAU + Math.floor(s / 2) * 0.035;
        return {
          x: CX + Math.cos(a) * 560,
          y: 3930 + Math.sin(a) * 290,
          r: (Math.atan2(Math.cos(a) * 290, -Math.sin(a) * 560) * 180) / Math.PI,
        };
      },
    });
  // l'escargot
  const te = cue("s3-3", "doucement");
  P({
    pts: blob(420, 4190, 58, 54, 14, 9, 0.04),
    fill: "#d9486e",
    lift: 5,
    tin: te,
    snd: "pop",
    from: [-80, 0, 0],
    anim: (t, s) => ({ x: Math.floor(s / 4) * 2 }),
    over: (w, h) => {
      let d = "";
      for (let i = 0; i <= 44; i++)
        d +=
          (i ? "L" : "M") +
          f1(w / 2 + Math.cos(i * 0.32) * (3 + i * 0.95)) +
          " " +
          f1(h / 2 + Math.sin(i * 0.32) * (3 + i * 0.95));
      return `<path d="${d}" fill="none" stroke="#fff6e0" stroke-width="6" stroke-linecap="round"/>`;
    },
    art: `<path d="M350 4244h170q40 0 44 -50l10 -44" fill="none" stroke="#f2b134" stroke-width="30" stroke-linecap="round"/><path d="M574 4150l-14 -36M580 4152l14 -34" stroke="#f2b134" stroke-width="7" stroke-linecap="round"/><circle cx="571" cy="4184" r="5" fill="${INK}"/>`,
  });
  // l'ongle
  const to = cue("s3-3", "ongles");
  P({
    pts: rect(1330, 4150, 300, 110, 3, 3),
    fill: "#f3c9a0",
    lift: 6,
    tin: to,
    snd: "pop",
    from: [200, 0, 0],
    art: `<circle cx="1330" cy="4205" r="55" fill="#f3c9a0"/><path d="M1290 4170h90v70h-90q-22 -35 0 -70z" fill="#fbe9dc"/><path d="M1275 4186v38" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`,
  });
  label(1260, 4040, "quelques centimètres par an", { tin: to + 0.2, fs: 36, rot: -2 });
}
{
  // ----- Le diamant -----
  const tc = cue("s3-5", "carbone"),
    te = cue("s3-5", "écrase"),
    tk = cue("s3-5", "crayon"),
    td = cue("s3-5", "diamant"),
    t6 = cue("s3-6", "diamant");
  letters("trésor ?", 620, 4380, { tin: cue("s3-4", "trésors"), tout: tc + 2, size: 96, shift: 3 });
  // le morceau de carbone
  P({
    pts: blob(CX, 4760, 120, 105, 8, 40, 0.16),
    fill: "#2b2b2b",
    stock: "sugar",
    lift: 7,
    tin: Math.min(tc, te) - 0.2,
    tout: td,
    snd: "pop",
    from: [0, -90, 30],
    anim: (t, s) => (t > te ? { s: 1 - 0.3 * lin(t, te + 0.3, td) + [0, 0.03][s % 2] } : null),
  });
  label(1130, 4590, "du carbone", { tin: tc, tout: td, fs: 42, rot: 3 });
  for (const [dx, dy, deg] of [
    [-330, 0, 0],
    [330, 0, 180],
    [0, -330, 90],
    [0, 330, 270],
  ])
    P({
      pts: arrowPts(CX + dx, 4760 + dy, 150, deg, 32),
      fill: "#e4472a",
      lift: 6,
      tin: te + 0.1,
      snd: false,
      from: [dx * 0.4, dy * 0.4, 0],
      anim: (t) => ({ x: -dx * 0.22 * lin(t, te + 0.3, td), y: -dy * 0.22 * lin(t, te + 0.3, td) }),
      press: { d: [-dx * 0.05, -dy * 0.05], t0: te + 0.4, per: 2 },
    });
  // le diamant, en papier clair à facettes
  const dia = (x, y, k) => [
    [x - 100 * k, y - 40 * k],
    [x - 50 * k, y - 95 * k],
    [x + 50 * k, y - 95 * k],
    [x + 100 * k, y - 40 * k],
    [x, y + 105 * k],
  ];
  const facets = (x, y, k) =>
    `<path d="M${x - 100 * k} ${y - 40 * k}H${x + 100 * k}M${x - 50 * k} ${y - 95 * k}L${x - 36 * k} ${y - 40 * k}L${x} ${y + 105 * k}L${x + 36 * k} ${y - 40 * k}L${x + 50 * k} ${y - 95 * k}M${x - 36 * k} ${y - 40 * k}L${x} ${y - 95 * k}L${x + 36 * k} ${y - 40 * k}" fill="none" stroke="#5aa9d6" stroke-width="${5 * k}"/>`;
  P({
    pts: dia(CX, 4760, 1.1),
    fill: "#d4f1ff",
    lift: 9,
    tin: td,
    snd: "chime",
    from: [0, 0, -20],
    art: facets(CX, 4760, 1.1),
    anim: (t, s) => ({ r: [0, 4, 0, -4][Math.floor(s / 3) % 4] }),
  });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + 0.4;
    P({
      pts: starPts(CX + Math.cos(a) * 230, 4750 + Math.sin(a) * 200, 34, 9, 4),
      fill: "#fff6e0",
      lift: 3,
      tin: td + 0.1,
      snd: false,
      from: [0, 0, 40],
      alt: [2, i % 2, 2],
    });
  }
  label(1120, 4900, "un diamant !", {
    tin: td + 0.2,
    fs: 50,
    rot: -3,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });
  // le crayon
  const pen = {
    pivot: [430, 4760],
    rot: -28,
    tin: tk,
    from: [-200, 60, -20],
    seed: 800,
    boil: 0.8,
    rb: 0.2,
  };
  P({
    ...pen,
    snd: "pop",
    pts: rect(250, 4730, 300, 60, 2, 2),
    fill: "#f2b134",
    lift: 6,
    art: `<rect x="250" y="4730" width="46" height="60" fill="#d9486e"/><rect x="296" y="4730" width="16" height="60" fill="#9aa6b2"/><path d="M330 4750h220M330 4770h220" stroke="#d99a1d" stroke-width="5"/>`,
  });
  P({
    ...pen,
    snd: false,
    pts: [
      [550, 4730],
      [626, 4760],
      [550, 4790],
    ],
    fill: "#e8c9a0",
    lift: 6,
  });
  P({
    ...pen,
    snd: false,
    tout: t6,
    pts: [
      [604, 4751],
      [636, 4760],
      [604, 4769],
    ],
    fill: "#2b2b2b",
    lift: 2,
  });
  P({
    ...pen,
    snd: "chime",
    tin: t6,
    from: [0, 0, 0],
    pts: dia(634, 4756, 0.42),
    fill: "#d4f1ff",
    lift: 6,
    art: facets(634, 4756, 0.42),
    anim: (t, s) => ({ s: [1, 1.12][Math.floor(s / 2) % 2] }),
  });
  label(250, 4560, "la mine du crayon", { tin: tk + 0.2, tout: t6, fs: 36, rot: 3 });
}

// ================= Le noyau =================
{
  label(770, 5360, "le noyau", { tin: cue("s4-1", "noyau"), fs: 60, rot: -2 });
  const to = cue("s4-1", "océan");
  // des vagues de fer fondu : formes de rechange
  for (let j = 0; j < 4; j++) {
    const wave = (ph) => {
      const top = [],
        bot = [];
      for (let i = 0; i <= 14; i++) {
        const x = 230 + j * 60 + i * 100,
          y = 5650 + j * 130 + Math.sin(i * 0.9 + ph + j) * 22;
        if (x > 1750) break;
        top.push([x, y - 16]);
        bot.unshift([x, y + 16]);
      }
      return top.concat(bot);
    };
    [0, 1].forEach((k) =>
      P({
        pts: wave(k * 1.6),
        fill: j % 2 ? "#ffd84a" : "#fff0a8",
        lift: 3,
        tin: to + j * 0.1,
        snd: false,
        from: [j % 2 ? 90 : -90, 0, 0],
        boil: 0.5,
        alt: [3, k, 2],
      }),
    );
  }
  label(640, 5840, "un océan de fer fondu", {
    tin: cue("s4-1", "fer"),
    fs: 50,
    rot: 2,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });
  const tm = cue("s4-2", "liquide");
  for (let i = 0; i < 7; i++) {
    const x = 330 + i * 210,
      y = 6040 + rnd(i) * 80;
    P({
      pts: [
        [x, y - 46],
        [x + 24, y],
        [x + 16, y + 26],
        [x - 16, y + 26],
        [x - 24, y],
      ],
      fill: "#fff0a8",
      lift: 4,
      tin: tm + i * 0.07,
      snd: i % 3 ? false : "pop",
      from: [0, 60, 0],
      anim: (t, s) => ({ y: [0, -26, -40, -26][(Math.floor(s / 2) + i) % 4] }),
    });
  }
  // la boule de fer, au centre
  P({
    pts: blob(CX, CORE_Y, 470, 470, 44, 5, 0.012),
    fill: "#fff0a8",
    alpha: 0.5,
    torn: 2,
    deckle: false,
    lift: 0,
    anim: (t, s) => ({ s: [1, 1.03][Math.floor(s / 3) % 2] }),
    boil: 0.4,
  });
  P({
    pts: blob(CX, CORE_Y, 400, 400, 40, 19, 0.014),
    fill: "#ffe066",
    torn: 1,
    dw: 9,
    lift: 10,
    extra: dots("p-half2", 0.7),
    boil: 0.5,
  });
  const tb = cue("s4-3", "boule"),
    th = cue("s4-3", "chaude"),
    tso = cue("s4-3", "Soleil"),
    t5 = cue("s4-5"),
    tpo = cue("s4-5", "poids"),
    tdu = cue("s4-5", "dur");
  label(110, 6400, "une boule de fer", { tin: tb, fs: 52, rot: -3, from: [-70, -30, -9] });
  // thermomètre et petit soleil
  P({
    pts: rect(1540, 6560, 50, 420, 2, 2),
    fill: "#f7f0dc",
    lift: 6,
    tin: th,
    tout: t5,
    snd: "pop",
    from: [120, 0, 8],
    art: `<circle cx="1565" cy="7000" r="52" fill="#f7f0dc"/><circle cx="1565" cy="7000" r="36" fill="#e4472a"/><rect x="1553" y="6590" width="24" height="410" fill="#e4472a"/>`,
    anim: (t, s) => ({ r: [0, 1.5][Math.floor(s / 3) % 2] }),
    pivot: [1565, 7000],
  });
  label(1480, 6420, "5 500 °C", {
    tin: th + 0.2,
    tout: t5,
    fs: 54,
    rot: 3,
    fill: "#e4472a",
    ink: "#fff6e0",
  });
  P({
    pts: starPts(1740, 6700, 100, 62, 12),
    fill: "#f6b93b",
    lift: 6,
    tin: tso,
    tout: t5,
    snd: "chime",
    from: [80, -60, 40],
    anim: (t, s) => ({ r: Math.floor(s / 2) * 6 }),
  });
  P({
    pts: blob(1740, 6700, 56, 56, 16, 2, 0.03),
    fill: "#ffd84a",
    lift: 6,
    tin: tso,
    tout: t5,
    snd: false,
    from: [80, -60, 0],
  });
  label(1470, 6830, "comme le Soleil", { tin: tso + 0.2, tout: t5, fs: 34, rot: -3 });
  letters("?", 925, 6790, { tin: cue("s4-4", "fond"), tout: t5, size: 150, shift: 4 });
  // la pression de toute la Terre
  for (const deg of [150, 180, 210, 330, 0, 30, 270]) {
    const a = (deg * Math.PI) / 180,
      R = 640;
    P({
      pts: arrowPts(CX + Math.cos(a) * R, CORE_Y + Math.sin(a) * R, 190, deg + 180, 38),
      fill: "#e4472a",
      lift: 7,
      tin: tpo + 0.05 * (deg % 7),
      snd: deg === 0 ? "whoosh" : false,
      from: [Math.cos(a) * 200, Math.sin(a) * 200, 0],
      press: { d: [-Math.cos(a) * 26, -Math.sin(a) * 26], t0: tpo + 0.4, per: 3 },
    });
  }
  label(1330, 6400, "la pression", {
    tin: cue("s4-5", "pression"),
    fs: 54,
    rot: 3,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });
  label(770, 6850, "du fer solide", { tin: tdu - 0.2, fs: 60, rot: -2 });
}

// ================= Herbe, maison, arbre (par-dessus la terre) =================
P({
  pts: band(18, 1902, 742, 806, 13, 9, 70),
  fill: "#5aa845",
  stock: "sugar",
  torn: 1,
  dk: [0, 5],
  lift: 6,
  boil: 0.5,
});
P({
  pts: [
    [690, 800],
    [700, 730],
    [708, 770],
    [716, 722],
    [722, 772],
    [734, 738],
    [730, 800],
  ],
  fill: "#2f8a3c",
  lift: 3,
});
for (let i = 0; i < 14; i++) {
  const x = 90 + i * 132 + rnd(i) * 40;
  if (Math.abs(x - CX) < 200 || Math.abs(x - 712) < 60) continue;
  P({
    pts: [
      [x, 762],
      [x + 7, 722 - rnd(i + 5) * 14],
      [x + 14, 752],
      [x + 22, 716],
      [x + 30, 764],
    ],
    fill: i % 2 ? "#3f9440" : "#74c05a",
    lift: 2,
    anim: (t, s) => ({ r: [0, 3, 0, -3][(Math.floor(s / 3) + i) % 4] }),
    pivot: [x + 15, 764],
  });
}
P({ pts: rect(1420, 520, 34, 80, 3, 2), fill: "#7c4a2d", stock: "kraft", lift: 3 });
P({ pts: rect(1270, 592, 210, 180, 9, 3), fill: "#d9482f", extra: dots("p-ori", 0.8) });
P({
  pts: [
    [1236, 606],
    [1374, 478],
    [1512, 604],
  ],
  fill: "#a8703c",
  stock: "kraft",
  lift: 7,
});
P({ pts: rect(1392, 672, 54, 100, 2, 2), fill: "#2c5d7c", lift: 3, extra: dots("p-stripe", 0.5) });
P({
  pts: rect(1298, 630, 52, 52, 4, 2),
  fill: "#ffe9a8",
  lift: 3,
  over: (w, h) =>
    `<path d="M${w / 2} 2V${h - 2}M2 ${h / 2}H${w - 2}" stroke="#a8703c" stroke-width="5"/>`,
});
{
  const sway = (t, s) => ({ r: [0, 1.4, 0, -1.4][Math.floor(s / 4) % 4] });
  P({
    pts: [
      [404, 560],
      [446, 560],
      [452, 776],
      [398, 776],
    ],
    fill: "#8a5a33",
    stock: "kraft",
  });
  const pivot = [425, 600];
  P({
    pts: blob(345, 500, 92, 82, 9, 5, 0.14),
    fill: "#4fb07a",
    stock: "sugar",
    torn: 2,
    deckle: false,
    anim: sway,
    pivot,
  });
  P({
    pts: blob(505, 490, 96, 86, 9, 15, 0.14),
    fill: "#2f8a5c",
    stock: "sugar",
    torn: 1,
    deckle: false,
    anim: sway,
    pivot,
  });
  P({
    pts: blob(425, 420, 128, 112, 10, 25, 0.12),
    fill: "#3a9d6e",
    stock: "sugar",
    torn: 1,
    anim: sway,
    pivot,
    lift: 8,
  });
}

// ================= Le trou, la pelle, le goûter =================
{
  const S0 = Math.round(K.dig * FPS),
    T1 = K.dig + 3.2,
    tBig = cue("s0-3", "grande");
  P({
    pts: blob(CX, 778, 74, 17, 12, 4, 0.06),
    fill: "#33200f",
    lift: 0,
    tin: K.dig + 0.33,
    snd: false,
    from: [0, 0, 0],
  });
  const POSE = [
    [-30, -10],
    [-70, -6],
    [-88, -4],
    [-88, -4],
    [10, -4],
    [24, -4],
    [24, 6],
    [18, 20],
    [4, 30],
    [-10, 22],
    [-20, 6],
    [-26, -6],
  ];
  const dig = (t, s) => {
    if (t < K.dig) return { r: -14 };
    if (t >= tBig)
      return { y: 16, r: [9, 12][Math.floor(s / 3) % 2], s: 1 + 0.8 * lin(t, tBig, tBig + 0.3) };
    if (t >= T1) return { y: 16, r: 9 };
    const [y, r] = POSE[(s - S0) % 12];
    return { y, r };
  };
  const base = {
    pivot: [CX, 780],
    anim: dig,
    tin: T("s0") + 1.2,
    snd: false,
    from: [120, -160, 40],
    seed: 500,
    boil: 0.8,
    rb: 0.3,
  };
  P({ ...base, pts: rect(951, 540, 18, 196, 1, 1.5), fill: "#b98a55", stock: "kraft", lift: 5 });
  P({ ...base, pts: rect(928, 528, 64, 20, 2, 2), fill: "#d9482f", lift: 5 });
  P({
    ...base,
    pts: [
      [926, 716],
      [994, 716],
      [990, 770],
      [960, 796],
      [930, 770],
    ],
    fill: "#9aa6b2",
    lift: 6,
    extra: (w, h) => `<path d="M${w / 2} 6V${h - 14}" stroke="#6d7884" stroke-width="5"/>`,
  });
  for (let i = 0; i < 3; i++)
    P({
      pts: blob(CX, 760, 13 + i * 3, 11 + i * 2, 6, i * 9, 0.2),
      fill: ["#6f4a2b", "#5a3a20", "#845a36"][i],
      lift: 4,
      boil: 0,
      anim: (t, s) => {
        const c = (s - S0) % 12;
        if (t < K.dig || t >= T1 || c < 7) return { o: 0 };
        const u = (c - 7) / 4;
        return {
          x: (120 + 45 * i) * u,
          y: -Math.sin(u * Math.PI) * (130 + 25 * i) + 26 * u,
          r: u * 220,
        };
      },
    });
  [0, 1, 2].forEach((i) =>
    P({
      pts: blob(1075 + i * 38, 772 - i * 3, 46 + i * 6, 22 + i * 3, 8, i * 21 + 3, 0.16),
      fill: ["#5a3a20", "#6f4a2b", "#845a36"][i],
      stock: "sugar",
      torn: 2,
      deckle: false,
      lift: 3,
      tin: K.dig + 0.74 + i * 0.8,
      snd: "tic",
      from: [0, -14, 0],
    }),
  );
  P({
    pts: blob(962, 800, 96, 22, 9, 8, 0.14),
    fill: "#5a3a20",
    stock: "sugar",
    torn: 1,
    deckle: false,
    lift: 3,
    tin: K.dig + 0.33,
    snd: false,
    from: [0, 10, 0],
  });

  // carte : jusqu'au centre de la Terre
  const tc = cue("s0-2", "centre"),
    t6 = cue("s0-2", "six");
  P({
    pts: rect(640, 340, 250, 210, 6, 5),
    fill: "#1f2a44",
    lift: 8,
    tin: tc,
    snd: "pop",
    rot: -3,
    from: [0, -120, -12],
    art: `<circle cx="765" cy="445" r="84" fill="#b7702d"/><circle cx="765" cy="445" r="74" fill="#e56a2c"/><circle cx="765" cy="445" r="42" fill="#f6a623"/><circle cx="765" cy="445" r="17" fill="#ffe066"/><path d="M765 361V445" stroke="#fff6e0" stroke-width="6" stroke-dasharray="10 8"/>`,
  });
  label(900, 400, "6 400 km", { tin: t6, fs: 62, rot: 2 });
  // le goûter
  const tg = cue("s0-2", "goûter");
  P({
    pts: blob(1150, 735, 46, 44, 12, 6, 0.05),
    fill: "#c98a4b",
    lift: 5,
    tin: tg,
    snd: "pop",
    from: [0, -200, 60],
    art: `<circle cx="1135" cy="722" r="8" fill="#5a3a20"/><circle cx="1164" cy="742" r="7" fill="#5a3a20"/><circle cx="1140" cy="752" r="6" fill="#5a3a20"/><circle cx="1166" cy="716" r="5" fill="#5a3a20"/>`,
    anim: (t, s) => ({ r: [0, 8][Math.floor(s / 4) % 2] }),
  });
}
