/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs */
// Les trois décors de l'essai : la cuisine (l'accroche), le générique, le corps en coupe.
const T = (id) => scn(id).start;
const newsprint = (w, h) => {
  let s = `<g fill="#33302c" opacity=".38">`,
    k = 0;
  for (let y = 8; y < h; y += 12) {
    let x = 6;
    while (x < w - 10) {
      const ww = 8 + rnd(k++) * 30;
      s += `<rect x="${f1(x)}" y="${y}" width="${f1(Math.min(ww, w - 6 - x))}" height="5"/>`;
      x += ww + 6;
    }
  }
  return s + "</g>";
};
const board = (layer) =>
  P({
    layer,
    pts: rect(-400, -400, 2720, 1880),
    fill: "#c4ab88",
    stock: "board",
    lift: 0,
    pad: 0,
    boil: 0,
    rb: 0,
    jmp: 0,
  });

// ================= A : la cuisine — l'accroche =================
{
  const S = set("A", [
    ["board", 0.9],
    ["wall", 0.95],
    ["world", 1],
    ["front", 1.08, 2.2],
  ]);
  const tH1 = cue("a-1", "hic"),
    tH2 = cue("a-1", "hic", 1);
  S.jump = jumpAt([tH1, tH2]);
  S.cam = camKeys([
    [0, { x: 1000, y: 600, z: 1.22 }],
    [tH2 - 0.1, { x: 1060, y: 630, z: 1.3 }, "lin"],
    [scn("a").end, { x: 1120, y: 650, z: 1.4 }, "lin"],
  ]);
  S.shake = (t, st) => {
    const j = S.jump(t);
    return [(rnd(st * 1.7) - 0.5) * 30 * j, -22 * j];
  };
  board("board");
  // le mur et sa fenêtre
  P({
    layer: "wall",
    pts: rect(60, 30, 1800, 640, 3, 7),
    fill: "#f4e4b6",
    stock: "sugar",
    lift: 5,
    extra: dots("p-wall", 1),
    boil: 0.4,
    jmp: 0.15,
  });
  tape(30, 18, -8, "wall");
  tape(1760, 22, 7, "wall");
  P({ layer: "wall", pts: rect(190, 90, 440, 340, 5, 3), fill: "#fbf8f0", lift: 6, jmp: 0.4 });
  P({
    layer: "wall",
    pts: rect(216, 114, 388, 292, 6, 2),
    fill: "#a8d5ee",
    stock: "sugar",
    lift: 2,
    jmp: 0.4,
  });
  P({
    layer: "wall",
    pts: blob(330, 210, 82, 30, 11, 4, 0.22),
    fill: "#ffffff",
    torn: 2,
    deckle: false,
    alpha: 0.95,
    lift: 4,
    jmp: 0.6,
    anim: (t, st) => ({ x: (Math.floor(st / 2) * 1.2) % 160 }),
  });
  P({
    layer: "wall",
    pts: blob(500, 300, 60, 22, 9, 14, 0.22),
    fill: "#ffffff",
    torn: 1,
    deckle: false,
    alpha: 0.9,
    lift: 3,
    jmp: 0.6,
    anim: (t, st) => ({ x: -((Math.floor(st / 2) * 0.9) % 90) }),
  });
  P({ layer: "wall", pts: rect(404, 114, 16, 292, 7, 1), fill: "#fbf8f0", lift: 4, jmp: 0.5 });
  P({ layer: "wall", pts: rect(216, 252, 388, 16, 8, 1), fill: "#fbf8f0", lift: 4, jmp: 0.5 });
  // l'horloge : l'aiguille avance à chaque pose
  P({
    layer: "wall",
    pts: blob(1520, 250, 128, 128, 30, 2, 0.01),
    smooth: true,
    fill: "#e4572e",
    lift: 7,
    jmp: 0.8,
  });
  P({
    layer: "wall",
    pts: blob(1520, 250, 104, 104, 30, 5, 0.01),
    smooth: true,
    fill: "#fbf8f0",
    lift: 2,
    jmp: 0.8,
    over: (w, h) =>
      Array.from(
        { length: 12 },
        (_, i) =>
          `<rect x="${w / 2 - 3}" y="8" width="6" height="${i % 3 ? 10 : 18}" fill="${INK}" transform="rotate(${i * 30} ${w / 2} ${h / 2})"/>`,
      ).join(""),
  });
  P({
    layer: "wall",
    pts: rect(1515, 196, 11, 62),
    fill: INK,
    lift: 4,
    pivot: [1520, 250],
    rot: 60,
    jmp: 0.8,
    anim: (t, st) => ({ r: Math.floor(st / 2) * 0.5 }),
  });
  P({
    layer: "wall",
    pts: rect(1516, 160, 8, 98),
    fill: "#d9482f",
    lift: 5,
    pivot: [1520, 250],
    jmp: 0.8,
    anim: (t, st) => ({ r: Math.floor(st / 2) * 6 }),
  });
  brass(1520, 250, "wall", 11);
  // la nappe à carreaux
  P({
    pts: band(-80, 2000, 610, 1400, 11, 10, 90),
    fill: "#f8f1e2",
    torn: 1,
    dw: 10,
    extra: dots("p-ging", 1),
    lift: 7,
    jmp: 0.25,
  });
  // la serviette pliée
  P({
    pts: [
      [380, 760],
      [560, 720],
      [520, 900],
      [360, 930],
    ],
    fill: "#3a9d6e",
    lift: 5,
    rot: -6,
    over: (w, h) =>
      `<path d="M10 ${h * 0.3}L${w - 10} ${h * 0.12}" stroke="#2c7a55" stroke-width="5"/>`,
  });
  // l'assiette et le sandwich
  P({ pts: blob(820, 820, 280, 104, 44, 4, 0.004), smooth: true, fill: "#cfe0ee", lift: 7 });
  P({ pts: blob(820, 812, 222, 78, 40, 9, 0.004), smooth: true, fill: "#fbfbf6", lift: 2 });
  P({
    pts: [
      [650, 830],
      [960, 812],
      [790, 690],
    ],
    fill: "#e6b86a",
    stock: "kraft",
    lift: 4,
    over: (w, h) =>
      `<path d="M6 ${h - 16}L${w - 6} ${h - 30}" stroke="#b07a32" stroke-width="10" stroke-linecap="round"/>`,
  });
  {
    const lt = [];
    for (let i = 0; i <= 12; i++) lt.push([660 + i * 24, 790 - i * 7 + (i % 2 ? -14 : 8)]);
    P({
      pts: lt.concat([
        [952, 712],
        [672, 800],
      ]),
      fill: "#74c05a",
      stock: "sugar",
      lift: 3,
      torn: 2,
      deckle: false,
    });
  }
  P({ pts: blob(760, 770, 46, 22, 14, 3, 0.03), smooth: true, fill: "#e4472a", lift: 3, rot: -12 });
  P({ pts: blob(860, 750, 40, 20, 14, 6, 0.03), smooth: true, fill: "#e4472a", lift: 3, rot: -14 });
  P({
    pts: [
      [668, 788],
      [948, 720],
      [800, 610],
    ],
    fill: "#ebc47a",
    stock: "kraft",
    lift: 6,
    over: (w, h) =>
      `<path d="M8 ${h - 12}L${w - 8} ${h - 60}" stroke="#b07a32" stroke-width="10" stroke-linecap="round"/>`,
  });
  for (let i = 0; i < 6; i++)
    P({
      pts: blob(560 + rnd(i) * 520, 900 + rnd(i + 7) * 70, 7, 5, 6, i, 0.3),
      fill: "#d9a24f",
      stock: "kraft",
      lift: 2,
      rot: rnd(i) * 90,
    });
  // le verre d'eau : l'eau est une forme de rechange qui clapote
  P({ pts: rect(1180, 540, 190, 340, 3, 2), fill: "#d6ecf7", alpha: 0.5, lift: 7 });
  const slosh = (t, st) => {
    const j = S.jump(t);
    return j > 0.05 ? [0, 2, 4, 2][st % 4] : [1, 2, 3, 2][Math.floor(st / 3) % 4];
  };
  for (let k = 0; k < 5; k++) {
    const tilt = (k - 2) * 12,
      top = [];
    for (let i = 0; i <= 8; i++)
      top.push([1186 + i * 22.25, 660 + tilt * (1 - i / 4) + Math.sin(i * 1.3 + k) * 5]);
    P({
      pts: top.concat([
        [1364, 872],
        [1186, 872],
      ]),
      fill: "#5fb0e0",
      alpha: 0.82,
      lift: 2,
      show: (t, st) => slosh(t, st) === k,
      boil: 0.6,
    });
  }
  for (let i = 0; i < 4; i++)
    P({
      pts: blob(0, 0, 7, 7, 8, i, 0.05),
      smooth: true,
      fill: "#e8f6ff",
      lift: 1,
      boil: 0,
      anim: (t) => ({
        x: 1215 + i * 40 + Math.sin(t * 3 + i) * 6,
        y: 860 - ((t * 60 + i * 50) % 180),
      }),
    });
  P({
    pts: rect(1304, 470, 26, 330, 4, 1),
    fill: "#fbf8f0",
    lift: 3,
    rot: 12,
    pivot: [1317, 800],
    over: (w, h) =>
      Array.from(
        { length: 10 },
        (_, i) => `<rect x="0" y="${i * 34}" width="${w}" height="16" fill="#e4572e"/>`,
      ).join(""),
    anim: (t, st) => ({ r: S.jump(t) > 0.05 ? [4, -4][st % 2] : 0 }),
  });
  P({ pts: rect(1200, 560, 22, 300, 5, 1), fill: "#ffffff", alpha: 0.55, lift: 1 });
  // la bouteille de limonade, pleine de bulles
  P({
    pts: [
      [1528, 420],
      [1572, 420],
      [1574, 500],
      [1618, 560],
      [1618, 880],
      [1482, 880],
      [1482, 560],
      [1526, 500],
    ],
    fill: "#8fd06e",
    alpha: 0.88,
    lift: 7,
  });
  P({ pts: rect(1520, 396, 60, 34, 2, 2), fill: "#e4572e", lift: 4 });
  P({
    pts: rect(1482, 640, 136, 120, 3, 2),
    fill: "#ece7da",
    lift: 3,
    extra: newsprint,
    over: (w, h) =>
      `<circle cx="${w / 2}" cy="${h / 2}" r="30" fill="#e4572e"/><text x="${w / 2}" y="${h / 2 + 10}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="28" fill="#fff6e0">psch</text>`,
  });
  for (let i = 0; i < 6; i++)
    P({
      pts: blob(0, 0, 5 + (i % 3) * 2, 5 + (i % 3) * 2, 8, i + 20, 0.05),
      smooth: true,
      fill: "#f2fbe8",
      lift: 1,
      boil: 0,
      anim: (t) => ({
        x: 1500 + ((i * 37) % 100) + Math.sin(t * 4 + i) * 5,
        y: 870 - ((t * 90 + i * 55) % 300),
      }),
      show: (t) => true,
    });
  // devant, flou : le bord de la table et une miette géante
  P({
    layer: "front",
    pts: blob(1830, 1040, 120, 60, 9, 3, 0.2),
    fill: "#d9a24f",
    stock: "kraft",
    lift: 12,
    jmp: 1.4,
  });
  P({
    layer: "front",
    pts: blob(120, 1060, 160, 70, 10, 7, 0.15),
    fill: "#3a9d6e",
    lift: 12,
    jmp: 1.2,
  });
  // les « HIC ! » découpés, à chaque hoquet
  [tH1, tH2].forEach((t0, k) =>
    letters("HIC !", 640 + k * 80, 120 + k * 40, {
      layer: "fixed",
      size: 150,
      tin: t0 + 0.03,
      tout: t0 + 1.05,
      dt: 0.034,
      shift: k * 2,
      seed: k * 40,
      jmp: 0,
      snd: "pop",
      from: [0, -120, 30],
      anim: (t, st, i) =>
        t > t0 + 0.8
          ? {
              y: -500 * E(t, t0 + 0.8, t0 + 1.02),
              x: (i - 2) * 140 * E(t, t0 + 0.8, t0 + 1.02),
              r: (i - 2) * 30 * E(t, t0 + 0.8, t0 + 1.02),
            }
          : null,
    }),
  );
}

// ================= G : le générique, court =================
{
  const S = set("G", [
    ["board", 1],
    ["world", 1],
  ]);
  const t0 = T("g");
  S.cam = (t) => ({ x: 960, y: 540, z: 1 + 0.05 * lin(t, t0, T("b")) });
  board("board");
  P({
    pts: rect(-60, -60, 2040, 1200),
    fill: "#2f5bd3",
    stock: "sugar",
    lift: 0,
    pad: 0,
    boil: 0,
    rb: 0,
    jmp: 0,
  });
  for (let i = 0; i < 18; i++) {
    const a0 = (i / 18) * TAU,
      a1 = ((i + 0.5) / 18) * TAU;
    P({
      pts: [
        [960, 540],
        [960 + Math.cos(a0) * 1300, 540 + Math.sin(a0) * 1300],
        [960 + Math.cos(a1) * 1300, 540 + Math.sin(a1) * 1300],
      ],
      fill: i % 2 ? "#f2b134" : "#e4572e",
      lift: 4,
      pivot: [960, 540],
      pad: 10,
      boil: 0.3,
      rb: 0.05,
      jmp: 0,
      anim: (t, st) => ({ r: Math.floor(st / 2) * 0.8 }),
    });
  }
  P({
    pts: blob(960, 540, 420, 260, 40, 3, 0.04),
    torn: 1,
    fill: "#f7f0dc",
    lift: 9,
    tin: t0 + 0.05,
    from: [0, 0, -20],
    snd: false,
    extra: dots("p-grid", 0.5),
  });
  letters("Kidi-science", 252, 470, {
    size: 110,
    tin: t0 + 0.16,
    dt: 0.05,
    from: [0, -140, 30],
    shift: 1,
    snd: "pop",
  });
}

// ================= B : le corps en coupe =================
{
  const S = set("B", [
    ["board", 0.9],
    ["world", 1],
  ]);
  const tDia = cue("b-1", "diaphragme"),
    tRes = cue("b-1", "respires"),
    tDesc = cue("b-1", "descend"),
    tEntre = cue("b-1", "entre"),
    tQ = cue("c-1", "hoquet"),
    tContr = cue("c-2", "contracte"),
    tCoup = cue("c-2", "coup"),
    tEng = cue("c-2", "engouffre"),
    tPorte = cue("c-2", "porte"),
    tFerme = cue("c-2", "ferme"),
    tHic = cue("c-3", "Hic"),
    B0 = T("b");
  S.jump = jumpAt([[tCoup, 0.45], tHic]);
  S.shake = (t, st) => {
    const j = S.jump(t);
    return [(rnd(st * 2.3) - 0.5) * 30 * j, -20 * j];
  };
  S.ones = (t) =>
    (t > tCoup - 0.05 && t < tCoup + 0.35) ||
    (t > tFerme - 0.05 && t < tFerme + 0.3) ||
    (t > tHic - 0.05 && t < tHic + 0.4);
  S.cam = camKeys([
    [B0, { x: 960, y: 545, z: 1.0 }],
    [tDia - 0.3, { x: 960, y: 560, z: 1.03 }, "lin"],
    [tDia + 0.6, { x: 930, y: 800, z: 1.55 }],
    [tRes - 0.2, { x: 932, y: 790, z: 1.58 }, "lin"],
    [tRes + 0.9, { x: 945, y: 640, z: 1.2 }],
    [tContr - 0.5, { x: 945, y: 645, z: 1.24 }, "lin"],
    [tContr + 0.15, { x: 930, y: 770, z: 1.5 }],
    [tPorte - 0.5, { x: 932, y: 740, z: 1.54 }, "lin"],
    [tPorte + 0.4, { x: 960, y: 410, z: 2.05 }],
    [tHic - 0.12, { x: 958, y: 412, z: 2.1 }, "lin"],
    [tHic + 0.25, { x: 960, y: 560, z: 1.06 }],
    [SCHED.total, { x: 960, y: 560, z: 1.1 }, "lin"],
  ]);
  // la respiration : 0 = poumons vides, 1 = pleins, 1,3 = le hoquet
  const breath = (t) => {
    const calm = (x) => 0.2 + 0.16 * Math.sin((x - B0) * 1.9);
    if (t < tDesc - 0.2) return calm(t);
    if (t < tEntre + 0.5) return lerp(calm(tDesc - 0.2), 1, E(t, tDesc - 0.2, tEntre + 0.4));
    const relax = (x) => lerp(1, calm(x), E(x, tEntre + 0.5, tEntre + 2.2));
    if (t < tCoup) return relax(t);
    const k = (t - tCoup) * 30,
      base = relax(tCoup);
    if (k < 2) return lerp(base, 1.3, k / 2);
    if (t < tHic + 0.6) return 1.25 + 0.05 * Math.sin(t * 30);
    return lerp(1.25, calm(t), E(t, tHic + 0.6, tHic + 2));
  };
  const STATES = [0, 0.25, 0.5, 0.75, 1, 1.3];
  const state = (t) => {
    const b = breath(t);
    let best = 0;
    for (let i = 1; i < STATES.length; i++)
      if (Math.abs(STATES[i] - b) < Math.abs(STATES[best] - b)) best = i;
    return best;
  };
  const DX0 = 745,
    DX1 = 1095;
  const domeH = (b) => 88 - 72 * b;
  const domeY = (x, h) => {
    const u = clamp((x - DX0) / (DX1 - DX0));
    return lerp(874, 894, u) - h * Math.sin(Math.PI * u);
  };
  board("board");
  P({
    pts: rect(330, 40, 1260, 1000, 4, 5),
    fill: "#f7f3e8",
    lift: 6,
    extra: dots("p-grid", 0.9),
    boil: 0.4,
    jmp: 0.2,
  });
  for (const [x, y] of [
    [372, 82],
    [1548, 82],
    [372, 998],
    [1548, 998],
  ])
    brass(x, y);
  const SKIN = "#f3c9a0";
  // le buste, de profil
  P({ pts: rect(850, 360, 120, 120, 3, 2), fill: SKIN, stock: "sugar", lift: 4 });
  P({
    pts: [
      [820, 450],
      [880, 440],
      [960, 445],
      [1030, 470],
      [1080, 540],
      [1100, 650],
      [1095, 800],
      [1110, 900],
      [1118, 1010],
      [742, 1010],
      [735, 900],
      [730, 700],
      [745, 560],
      [780, 480],
    ],
    smooth: true,
    fill: SKIN,
    stock: "sugar",
    lift: 7,
  });
  P({
    pts: blob(900, 235, 150, 162, 30, 3, 0.02),
    smooth: true,
    fill: SKIN,
    stock: "sugar",
    lift: 7,
  });
  P({
    pts: [
      [1036, 210],
      [1094, 270],
      [1040, 286],
    ],
    fill: SKIN,
    stock: "sugar",
    lift: 5,
  });
  P({ pts: blob(858, 252, 26, 36, 12, 4, 0.04), smooth: true, fill: "#e0a87c", lift: 3 });
  P({
    pts: [
      [760, 250],
      [748, 160],
      [800, 92],
      [900, 66],
      [1004, 86],
      [1056, 140],
      [1000, 128],
      [924, 150],
      [864, 196],
      [842, 262],
      [800, 306],
    ],
    smooth: true,
    fill: "#5a3a26",
    torn: 2,
    deckle: false,
    lift: 6,
  });
  P({ pts: blob(1000, 205, 11, 13, 10, 2, 0.02), smooth: true, fill: INK, lift: 2 });
  P({
    pts: blob(1012, 262, 24, 16, 10, 6, 0.04),
    smooth: true,
    fill: "#f4978e",
    alpha: 0.55,
    lift: 1,
  });
  // le chemin de l'air : bouche, gorge, trachée
  const CL = [
    [1040, 302],
    [1000, 306],
    [962, 318],
    [942, 350],
    [936, 400],
    [934, 450],
    [933, 500],
    [930, 550],
    [926, 600],
  ];
  const AP = [[1150, 300], [1100, 300], ...CL, [924, 660]];
  P({ pts: strip(CL, 48, 34), fill: "#e98a9a", lift: 3, extra: dots("p-rings", 1) });
  P({ pts: blob(1040, 304, 20, 10, 12, 3, 0.03), smooth: true, fill: "#8a2f2a", lift: 2 });
  // l'estomac, plein de bulles de limonade
  P({
    pts: blob(995, 962, 98, 66, 22, 6, 0.04),
    smooth: true,
    fill: "#f6a64a",
    lift: 4,
    over: (w, h) =>
      `<path d="M${w * 0.25} ${h * 0.35}q${w * 0.25} -${h * 0.2} ${w * 0.5} 0" stroke="#fbd08a" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  });
  for (let i = 0; i < 5; i++)
    P({
      pts: blob(0, 0, 6, 6, 8, i + 40, 0.05),
      smooth: true,
      fill: "#fff3d6",
      lift: 1,
      boil: 0,
      anim: (t) => ({
        x: 940 + i * 26 + Math.sin(t * 3 + i) * 5,
        y: 1000 - ((t * 30 + i * 13) % 56),
      }),
    });
  // les poumons et le diaphragme : une forme de rechange par état de la respiration
  STATES.forEach((b, k) => {
    const h = domeH(b),
      rx = 150 + 14 * b,
      ry = 200 + 16 * b,
      cx = 925,
      cy = 682 + 8 * b;
    const pts = [];
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * TAU;
      let x = cx + Math.cos(a) * rx * (1 + (rnd(i + k * 50) - 0.5) * 0.04),
        y = cy + Math.sin(a) * ry * (1 + (rnd(i + 9 + k * 50) - 0.5) * 0.04);
      x = clamp(x, 752, 1086);
      y = Math.min(y, domeY(x, h) - 12);
      pts.push([x, y]);
    }
    let tree = "";
    const br = (x, y, a, l, n) => {
      if (n === 0) return;
      const x2 = x + Math.cos(a) * l,
        y2 = y + Math.sin(a) * l;
      tree += `<path d="M${f1(x)} ${f1(y)}L${f1(x2)} ${f1(y2)}" stroke="#c4546a" stroke-width="${n * 2.4}" stroke-linecap="round"/>`;
      br(x2, y2, a - 0.45, l * 0.7, n - 1);
      br(x2, y2, a + 0.45, l * 0.7, n - 1);
    };
    br(926, 600, Math.PI / 2, 50 + 14 * b, 4);
    P({
      pts,
      smooth: true,
      fill: "#f49ab0",
      stock: "sugar",
      torn: 2,
      deckle: false,
      alpha: 0.9,
      lift: 5,
      extra: dots("p-alv", 1),
      art: tree,
      show: (t) => state(t) === k,
      boil: 0.5,
    });
    const cl = [];
    for (let i = 0; i <= 14; i++) {
      const x = DX0 - 8 + ((DX1 - DX0 + 16) * i) / 14;
      cl.push([x, domeY(x, h)]);
    }
    P({
      pts: strip(cl, 30, 26),
      fill: "#c4543a",
      stock: "kraft",
      lift: 6,
      extra: dots("p-muscle", 1),
      show: (t) => state(t) === k,
      boil: 0.5,
    });
  });
  // les côtes, qui s'écartent quand on inspire
  for (let i = 0; i < 4; i++) {
    const y0 = 520 + i * 80,
      cl = [];
    for (let k = 0; k <= 8; k++) {
      const u = k / 8;
      cl.push([lerp(758, 1082, u), lerp(y0, y0 + 46, u) - 34 * Math.sin(Math.PI * u)]);
    }
    P({
      pts: strip(cl, 22, 18),
      fill: "#f7efd8",
      alpha: 0.72,
      lift: 3,
      pivot: [758, y0],
      anim: (t) => ({ r: -2.2 * breath(t) }),
    });
  }
  // la glotte : une petite porte de papier, accrochée par une attache
  const door = (t) => {
    if (t < tFerme) return 78;
    const k = Math.floor((t - tFerme) * 30);
    if (k < 4) return [78, 30, -8, 3][k];
    if (t < tHic + 0.8) return 0;
    return 78 * E(t, tHic + 0.8, tHic + 1.6);
  };
  P({
    pts: rect(910, 401, 54, 17, 2, 1),
    fill: "#f2b134",
    lift: 5,
    pivot: [916, 409],
    anim: (t) => ({ r: door(t) }),
    over: (w, h) => `<rect x="4" y="${h / 2 - 2}" width="${w - 8}" height="4" fill="#c98a1c"/>`,
  });
  brass(916, 409, "world", 8);
  // les flèches d'air
  let uDoor = 0;
  for (let u = 0; u <= 1; u += 0.002) if (along(AP, u)[1] < 409) uDoor = u;
  for (let i = 0; i < 5; i++) {
    const a = arrowPts(-30, 0, 60, 0, 18);
    P({
      pts: a,
      fill: "#7cc3ea",
      lift: 6,
      pivot: [0, 0],
      boil: 0.6,
      anim: (t) => {
        let u = -1;
        if (t > tDesc - 0.2 && t < tEntre + 0.7) u = ((t - tDesc) * 0.3 + i * 0.2) % 1;
        else if (t > tEng - 0.2 && t < tFerme) u = ((t - tEng) * 1.25 + i * 0.2) % 1;
        else if (t >= tFerme && t < tHic + 0.5)
          u = uDoor - 0.05 - i * 0.055 + (Math.floor(t * 15) % 2) * 0.008;
        if (u < 0) return { o: 0 };
        const [x, y, r] = along(AP, u);
        return { x, y, r };
      },
    });
  }
  // les étiquettes (une seule à la fois, à l'écran)
  label(1150, 830, "le diaphragme", { tin: tDia + 0.15, tout: tEntre + 1.0 });
  label(1180, 190, "d'un coup !", {
    tin: tCoup + 0.05,
    tout: tPorte - 0.35,
    fill: "#2b2b2b",
    ink: "#ffd84a",
    rot: 3,
  });
  label(1060, 700, "une petite porte : la glotte", {
    tin: tPorte + 0.35,
    tout: tHic - 0.08,
    fs: 50,
  });
  letters("HIC!", 1170, 180, {
    layer: "fixed",
    size: 130,
    tin: tHic + 0.03,
    dt: 0.034,
    shift: 4,
    seed: 99,
    jmp: 0,
    snd: "pop",
    from: [0, -120, 30],
  });
}
label(1560, 975, "Kidi-science", {
  tin: T("b") + 0.5,
  snd: false,
  fs: 34,
  rot: -2,
  fill: "#2f5bd3",
  ink: "#fff6e0",
});
