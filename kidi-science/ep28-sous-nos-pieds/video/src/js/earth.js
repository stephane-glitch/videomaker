/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs ; certains paramètres (w, h, t, s) ne servent pas partout */
// Scène 2 : la Terre coupée en deux, pour « comment on le sait » et le résumé.
scene("S2", [["main", 0]]);
board("main", 0, 1080);
{
  const L = "main",
    T5 = scn("s5").start,
    EX = 720,
    EY = 560;
  const stars = (w, h) =>
    Array.from(
      { length: 70 },
      (_, i) =>
        `<circle cx="${f1(rnd(i) * w)}" cy="${f1(rnd(i + 99) * h)}" r="${f1(2 + rnd(i + 7) * 3)}" fill="#fff6e0" opacity="${f1(0.4 + rnd(i + 3) * 0.6)}"/>`,
    ).join("");
  P({
    layer: L,
    pts: rect(56, 40, 1808, 1000, 4, 7),
    fill: "#1f2a44",
    stock: "sugar",
    lift: 8,
    boil: 0.4,
    extra: stars,
  });
  tape(30, 26, -8, L);
  tape(1774, 30, 7, L);
  const t0 = T5 + 0.5;
  P({
    layer: L,
    pts: blob(EX, EY, 432, 432, 48, 3, 0.012),
    fill: "#7c5a3a",
    stock: "sugar",
    torn: 1,
    dw: 9,
    lift: 9,
    tin: t0,
    from: [0, -80, -8],
    boil: 0.4,
  });
  P({
    layer: L,
    pts: blob(EX, EY, 410, 410, 44, 13, 0.012),
    fill: "#e56a2c",
    stock: "marble",
    torn: 2,
    deckle: false,
    lift: 4,
    tin: t0 + 0.13,
    snd: false,
    from: [0, -80, 8],
    boil: 0.4,
  });
  P({
    layer: L,
    pts: blob(EX, EY, 236, 236, 36, 23, 0.014),
    fill: "#f6a623",
    torn: 2,
    dw: 8,
    lift: 7,
    tin: t0 + 0.27,
    from: [0, -80, -8],
    extra: dots("p-half", 0.6),
    boil: 0.4,
  });
  P({
    layer: L,
    pts: blob(EX, EY, 86, 86, 22, 33, 0.02),
    fill: "#ffe066",
    torn: 1,
    dw: 6,
    lift: 7,
    tin: t0 + 0.4,
    snd: false,
    from: [0, -80, 8],
    extra: dots("p-half2", 0.7),
    anim: (t, s) => ({ s: [1, 1.05][Math.floor(s / 3) % 2] }),
  });
  letters("comment ?", 1200, 90, {
    layer: L,
    tin: cue("s5-1", "comment"),
    tout: cue("s5-3") - 0.3,
    size: 70,
    shift: 2,
  });

  // ----- Les tremblements de terre -----
  const tq = cue("s5-2", "tremblements"),
    tw = cue("s5-2", "secousses"),
    te = cue("s5-2", "écoute"),
    tEnd = cue("s5-3") - 0.3;
  const QX = EX - 425;
  P({
    layer: L,
    pts: starPts(QX, EY, 96, 50, 10, 0.3),
    fill: "#e4472a",
    lift: 8,
    tin: tq,
    tout: tEnd,
    snd: "zap",
    from: [-60, 0, 30],
    anim: (t, s) => ({ s: [1, 1.18][s % 2], r: [0, 10][s % 2] }),
  });
  for (let k = 1; k <= 7; k++) {
    const r = 110 * k,
      pts = [];
    for (let i = -8; i <= 8; i++)
      pts.push([
        QX + Math.cos((i * 6.5 * Math.PI) / 180) * (r + 8),
        EY + Math.sin((i * 6.5 * Math.PI) / 180) * (r + 8),
      ]);
    for (let i = 8; i >= -8; i--)
      pts.push([
        QX + Math.cos((i * 6.5 * Math.PI) / 180) * (r - 8),
        EY + Math.sin((i * 6.5 * Math.PI) / 180) * (r - 8),
      ]);
    P({
      layer: L,
      pts,
      fill: "#fff6e0",
      lift: 3,
      boil: 0.5,
      anim: (t, s) => ({
        o: t >= tw && t < tEnd && (((Math.floor(s / 2) - k) % 10) + 10) % 10 < 3 ? 1 : 0,
      }),
    });
  }
  // le sismographe
  let zz = "M1290 470";
  for (let i = 1; i <= 26; i++)
    zz += `L${1290 + i * 17} ${470 + (i % 2 ? -1 : 1) * (8 + rnd(i) * 46 * (i > 8 && i < 20 ? 1 : 0.25))}`;
  P({
    layer: L,
    pts: rect(1260, 360, 520, 220, 5, 5),
    fill: "#f7f0dc",
    lift: 8,
    tin: te - 0.4,
    tout: tEnd,
    snd: "pop",
    rot: 2,
    from: [200, 0, 10],
    extra: dots("p-grid", 0.5),
    art: `<path d="${zz}" fill="none" stroke="#e4472a" stroke-width="6" stroke-linejoin="round"/>`,
  });
  P({
    layer: L,
    pts: [
      [1150, 448],
      [1290, 462],
      [1290, 476],
      [1150, 490],
    ],
    fill: "#2b2b2b",
    lift: 5,
    tin: te - 0.3,
    tout: tEnd,
    snd: false,
    pivot: [1160, 470],
    anim: (t, s) => ({ r: [0, 9, -7, 5, -10, 3][s % 6] }),
  });
  label(1280, 620, "on écoute les secousses", { layer: L, tin: te, tout: tEnd, fs: 38, rot: -2 });
  label(1300, 760, "comme une échographie", {
    layer: L,
    tin: cue("s5-2", "échographie"),
    tout: tEnd,
    fs: 38,
    rot: 3,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });

  // ----- Le résumé -----
  const link = (x0, y0, x1, y1, tin) => {
    const a = Math.atan2(y1 - y0, x1 - x0),
      nx = -Math.sin(a) * 4,
      ny = Math.cos(a) * 4;
    P({
      layer: L,
      pts: [
        [x0 + nx, y0 + ny],
        [x1 + nx, y1 + ny],
        [x1 - nx, y1 - ny],
        [x0 - nx, y0 - ny],
      ],
      fill: "#fff6e0",
      lift: 2,
      tin,
      snd: false,
      from: [0, 0, 0],
    });
    P({
      layer: L,
      pts: blob(x1, y1, 13, 13, 8, 2, 0.05),
      fill: "#fff6e0",
      lift: 2,
      tin,
      snd: false,
      from: [0, 0, 0],
    });
  };
  const REC = [
    ["la croûte", cue("s5-3", "croûte"), 190, 1010, 240, 56],
    ["le manteau", cue("s5-3", "manteau"), 380, 1010, 470, 56],
    ["le noyau liquide", cue("s5-3", "noyau"), 550, 880, 600, 50],
    ["la boule de fer", cue("s5-3", "boule"), 700, 740, 585, 50],
  ];
  for (const [txt, tin, y, px, py, fs] of REC) {
    link(1290, y + 44, px, py, tin);
    label(1280, y, txt, { layer: L, tin, fs, rot: (y % 4) - 2 });
  }
  // ----- La pression -----
  const tp = cue("s5-4", "pression");
  for (const deg of [70, 110, 150, 180, 210, 250, 290]) {
    const a = (deg * Math.PI) / 180,
      R = 610;
    P({
      layer: L,
      pts: arrowPts(EX + Math.cos(a) * R, EY + Math.sin(a) * R, 150, deg + 180, 34),
      fill: "#e4472a",
      lift: 7,
      tin: tp + (deg % 7) * 0.04,
      snd: deg === 180 ? "whoosh" : false,
      from: [Math.cos(a) * 200, Math.sin(a) * 200, 0],
      press: { d: [-Math.cos(a) * 24, -Math.sin(a) * 24], t0: tp + 0.4, per: 3 },
    });
  }
  label(100, 70, "la pression", {
    layer: L,
    tin: tp,
    fs: 54,
    rot: -3,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });

  // ----- La fin -----
  const tr = cue("s6-1", "range");
  const sh = {
    layer: L,
    pivot: [210, 1000],
    rot: 24,
    tin: tr,
    from: [-300, 0, -40],
    seed: 900,
    boil: 0.8,
    rb: 0.3,
    anim: (t, s) => ({ r: [0, 1.5][Math.floor(s / 4) % 2] }),
  };
  P({
    ...sh,
    snd: "whoosh",
    pts: rect(198, 650, 24, 260, 1, 1.5),
    fill: "#b98a55",
    stock: "kraft",
    lift: 6,
  });
  P({ ...sh, snd: false, pts: rect(168, 634, 84, 26, 2, 2), fill: "#d9482f", lift: 6 });
  P({
    ...sh,
    snd: false,
    pts: [
      [166, 890],
      [254, 890],
      [248, 960],
      [210, 996],
      [172, 960],
    ],
    fill: "#9aa6b2",
    lift: 7,
  });
  label(100, 190, "6 400 km… trop loin !", { layer: L, tin: cue("s6-1", "loin"), fs: 40, rot: 2 });
  const th = cue("s6-2", "hoquet");
  P({
    layer: L,
    pts: starPts(1350, 905, 125, 78, 11, 0.2),
    fill: "#d9486e",
    lift: 9,
    tin: th,
    snd: "zap",
    from: [0, 0, -30],
    anim: (t, s) => ({ s: [1, 1.1][Math.floor(s / 2) % 2], y: [0, -14][Math.floor(s / 2) % 2] }),
    over: (w, h) =>
      `<text x="${w / 2}" y="${h / 2 + 17}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="50" fill="#fff6e0">HIC !</text>`,
  });
  label(300, 950, "La prochaine fois : le hoquet !", {
    layer: L,
    tin: cue("s6-3", "prochaine"),
    fs: 48,
    rot: -1,
    from: [0, 90, -4],
  });
}
label(1560, 975, "Kidi-science", {
  layer: "fixed",
  tin: scn("s0").start + 1.3,
  snd: false,
  fs: 34,
  rot: -2,
  fill: "#2f5bd3",
  ink: "#fff6e0",
});
