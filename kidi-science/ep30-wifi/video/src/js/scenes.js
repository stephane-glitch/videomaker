/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs */
// Les scènes : d'immenses formes hachurées, et de tout petits personnages en bas de l'image.
const BIG = [-400, -1000, 2900, 2300];
const skyF = (o = {}) =>
  R(-400, -1000, 2900, 2300, {
    k: 0.15,
    lo: 0,
    hi: 5,
    flow: FLOW.h(),
    lit: (x, y) => 1 - Math.abs(y - 620) / 1000,
    dens: 330,
    max: 12000,
    len: 38,
    ph: 0.5,
    ...o,
  });
const groundF = (y, o = {}) =>
  R(-400, y, 2900, 400, {
    lo: 1,
    hi: 4,
    flow: FLOW.h(),
    lit: (x, yy) => 0.9 - (yy - y) / 260,
    dens: 150,
    len: 40,
    ...o,
  });
const shadowF = (x, y, w, l) =>
  F(`M${x} ${y}H${x + w}L${x + w + l} ${y + 150}H${x + l}Z`, [x, y, w + l, 150], {
    lo: 4,
    hi: 6,
    flow: FLOW.h(),
    lit: LIT.flat(0.4),
    dens: 150,
    len: 40,
  });
const win = (x, y, w, h, col = ACC.yellow) => {
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = RAMP[6];
  ctx.fillRect(x + w / 2 - 3, y, 6, h);
  ctx.fillRect(x, y + h / 2 - 3, w, 6);
};
const SRC = (x, y, t0, o = {}) => ({ x, y, t0, sp: 300, lam: 130, amp: 0.8, rmax: 1500, ...o });

// ================= La rue, le soir (générique, s0, s6) =================
const STREET = [
  skyF(),
  ...[0, 1, 2, 3, 4, 5, 6].map((i) =>
    F(bullet(60 + i * 360, 930, 300, 520 + rnd(i) * 260), [-90 + i * 360, 100, 300, 830], {
      k: 0.4,
      lo: 2,
      hi: 4,
      dens: 210,
    }),
  ),
  F(house(140, 330, 700, 620, 300), [140, 30, 700, 920], { k: 0.75, lo: 1, hi: 6 }),
  F(house(1100, 420, 640, 540, 250), [1100, 170, 640, 790], { k: 0.75, lo: 1, hi: 6 }),
  groundF(930),
  shadowF(120, 935, 560, 520),
  shadowF(1080, 935, 500, 480),
  F(bullet(-60, 1200, 420, 1250), [-270, -50, 420, 1250], { k: 1.2, lo: 3, hi: 7 }),
  F(bullet(2010, 1200, 380, 1100), [1820, 100, 380, 1100], { k: 1.2, lo: 3, hi: 7 }),
];
const streetWins = (c, on = true) => {
  setCam(c, 0.75);
  win(300, 470, 110, 130, on ? ACC.yellow : RAMP[5]);
  win(560, 470, 110, 130, RAMP[5]);
  win(1340, 560, 110, 120, on ? ACC.orange : RAMP[5]);
  setCam(c, 1);
};
{
  const t0 = T("s0"),
    tPond = cue("s0-3") - 0.3,
    tW = cue("s0-2", "ondes");
  sfx(tW, "whoosh");
  SC.push({
    a: 0,
    b: tPond,
    forms: STREET,
    cam: (t) => [0, lerp(-640, 0, ease(lin(t, t0 - 1.6, t0 + 0.8))), 1 + 0.04 * lin(t, 0, tPond)],
    waves: () => [SRC(355 * 0.75 + 240, 600, tW, { amp: 0.9 })],
    figs: (t, im, tq, s3, srcs, c) => {
      streetWins(c);
      rings(srcs, tq, s3);
      kid(1000, 936, 1, {
        bob: [0, -2][Math.floor(im / 8) % 2],
        up: t > cue("s0-1", "vois") && t < tW,
      });
    },
    over: (t) =>
      (t < t0 - 1
        ? `<g transform="translate(960 400) rotate(-2) scale(${pop(t, 0.4, 0.5).toFixed(3)})"><rect x="-470" y="-100" width="960" height="220" rx="16" fill="#07122e" opacity=".35"/><rect x="-480" y="-110" width="960" height="220" rx="16" fill="${ACC.cream}"/><text x="0" y="48" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="140" fill="#1c438a">Kidi-science</text></g>` +
          cap("Comment marche le Wi-Fi ?", 960, 610, t, cue("g-1") + 2.2, { fs: 56, rot: 1.5 })
        : "") +
      cap("aucun fil ?", 1210, 800, t, cue("s0-1", "aucun"), { t1: tW }) +
      cap("des ondes invisibles", 1260, 800, t, tW + 0.3) +
      (t > t0 ? logo() : ""),
  });
  // ----- La mare -----
  const tTh = cue("s0-4", "caillou"),
    tSp = tTh + 0.7,
    tAir = cue("s0-4", "Wi-Fi");
  sfx(tSp, "pop");
  sfx(tAir, "chime");
  SC.push({
    a: tPond,
    b: T("s1"),
    forms: [
      R(-400, -200, 2900, 1500, {
        lo: 1,
        hi: 5,
        flow: FLOW.rad(960, 520),
        lit: (x, y) => 0.55 + 0.25 * Math.sin(y * 0.01),
        dens: 150,
        max: 16000,
        len: 34,
      }),
      ...[0, 1, 2, 3, 4].map((i) =>
        F(
          bullet(120 + i * 70 + (i > 2 ? 1500 : 0), 1200, 46, 700 + rnd(i) * 420),
          [97 + i * 70 + (i > 2 ? 1500 : 0), 80, 46, 1120],
          { k: 1.15, lo: 4, hi: 7, dens: 110 },
        ),
      ),
      groundF(950, { lo: 0, hi: 3 }),
    ],
    cam: (t) => [0, 0, 1 + 0.05 * lin(t, tPond, T("s1"))],
    waves: () => [SRC(960, 520, tSp, { sp: 230, lam: 120, amp: 1, rmax: 1200 })],
    figs: (t, im, tq, s3, srcs) => {
      rings(srcs, tq, s3);
      const u = lin(t, tTh, tSp);
      if (u > 0 && u < 1)
        dot(lerp(450, 960, u), lerp(860, 520, u) - Math.sin(u * Math.PI) * 300, 10, RAMP[7]);
      kid(420, 956, 1, { tablet: false, bob: u > 0 && u < 0.4 ? -8 : 0 });
    },
    over: (t) =>
      cap("un caillou dans la mare…", 1380, 960, t, tTh - 0.3, { t1: tAir }) +
      cap("le Wi-Fi : pareil, mais dans l'air", 1300, 960, t, tAir, { fs: 42 }) +
      logo(),
  });
}

// ================= s1 : la box, immense =================
{
  const t0 = T("s1"),
    tCa = cue("s1-1", "câble"),
    tTr = cue("s1-2", "transforme"),
    tAn = cue("s1-3", "antennes");
  sfx(tCa, "tic");
  sfx(tAn, "whoosh");
  SC.push({
    a: t0,
    b: T("s2"),
    forms: [
      R(-400, -600, 2900, 1500, {
        k: 0.3,
        lo: 1,
        hi: 4,
        flow: FLOW.down(0.3),
        lit: LIT.glow(960, 300, 1500),
        dens: 300,
        max: 9000,
        len: 36,
        ph: 0.6,
      }),
      groundF(800, { lo: 2, hi: 5 }),
      shadowF(480, 805, 980, 420),
      R(590, 60, 64, 440, { r: 32, lo: 2, hi: 6, dens: 90 }),
      R(1290, 60, 64, 440, { r: 32, lo: 2, hi: 6, dens: 90 }),
      R(430, 470, 1060, 334, {
        r: 70,
        lo: 0,
        hi: 5,
        flow: FLOW.h(),
        lit: (x, y, u, v) => 0.95 - 0.5 * u - 0.45 * v * v,
        dens: 120,
        max: 9000,
        len: 34,
        ph: 0.4,
      }),
    ],
    cam: (t) => [0, lerp(40, -60, ease(lin(t, t0, T("s2")))), 1 + 0.05 * lin(t, t0, T("s2"))],
    waves: () => [
      SRC(622, 70, tAn, { amp: 0.9 }),
      SRC(1322, 70, tAn + 0.25, { amp: 0.9 }),
      SRC(960, 470, tTr, { amp: 0.4, rmax: 700, draw: false }),
    ],
    figs: (t, im, tq, s3, srcs) => {
      // le câble qui sort du mur, et les signaux qui y courent
      ctx.lineCap = "round";
      ctx.strokeStyle = RAMP[7];
      ctx.lineWidth = 26;
      ctx.beginPath();
      ctx.moveTo(-60, 560);
      ctx.bezierCurveTo(150, 560, 200, 720, 440, 700);
      ctx.stroke();
      if (t > tCa)
        for (let i = 0; i < 5; i++) {
          const u = (tq * 0.7 + i * 0.2) % 1,
            m = 1 - u,
            x = m * m * m * -60 + 3 * m * m * u * 150 + 3 * m * u * u * 200 + u * u * u * 440,
            y = m * m * m * 560 + 3 * m * m * u * 560 + 3 * m * u * u * 720 + u * u * u * 700;
          dot(x, y, 9, ACC.yellow);
        }
      for (let i = 0; i < 4; i++)
        dot(
          560 + i * 70,
          640,
          16,
          i === 3 ? (Math.floor(im / 6) % 2 ? ACC.red : RAMP[6]) : ACC.green,
        );
      rings(srcs, tq, s3);
      kid(1690, 806, 1, { flip: true, bob: [0, -2][Math.floor(im / 8) % 2], up: t > tAn });
    },
    over: (t) =>
      cap("la box", 960, 930, t, cue("s1-1", "box"), { fs: 60 }) +
      cap("Internet arrive par un câble", 420, 400, t, tCa, { t1: tTr, fs: 40, rot: 2 }) +
      cap("… et repart en ondes", 420, 400, t, tTr, { fs: 40, rot: 2 }) +
      logo(),
  });
}

// ================= s2 : des ondes radio, cousines de la lumière =================
{
  const t0 = T("s2"),
    tOn = cue("s2-2", "ondes"),
    tLu = cue("s2-2", "lumière"),
    tYe = cue("s2-2", "yeux"),
    tPl = cue("s2-3", "pleine");
  sfx(tOn, "pop");
  sfx(tLu, "chime");
  sfx(tPl, "whoosh");
  SC.push({
    a: t0,
    b: T("s3"),
    forms: [
      R(-400, -600, 2900, 1700, {
        k: 0.3,
        lo: 2,
        hi: 5,
        flow: FLOW.down(0.3),
        lit: LIT.flat(0.5),
        dens: 300,
        max: 9000,
        len: 36,
      }),
      groundF(860, { lo: 2, hi: 5 }),
      F("M190 300L360 300L640 862L-90 862Z", [-90, 300, 730, 562], {
        lo: 0,
        hi: 3,
        flow: FLOW.down(0.9),
        lit: (x, y, u, v) => 1 - 0.5 * v,
        dens: 120,
      }),
      F("M150 300L400 300L350 110L200 110Z", [150, 110, 250, 190], { lo: 0, hi: 2, dens: 80 }),
      R(262, 300, 26, 562, { lo: 5, hi: 7, dens: 60 }),
      R(820, 360, 760, 260, { r: 90, lo: 4, hi: 7 }),
      R(760, 540, 880, 322, { r: 70, lo: 3, hi: 7, flow: FLOW.down(0.4) }),
      R(1700, 640, 190, 222, { r: 8, lo: 3, hi: 6 }),
      R(1720, 592, 150, 50, { r: 14, lo: 0, hi: 3, flow: FLOW.h(), dens: 70 }),
    ],
    cam: (t) => [lerp(-30, 30, lin(t, t0, T("s3"))), 0, 1.03],
    waves: (tq) => {
      const a = tq < tOn ? 0 : tq < tYe ? 0.8 : tq < tPl ? 0.8 * (1 - lin(tq, tYe, tYe + 0.8)) : 1;
      return a <= 0.01
        ? []
        : [
            SRC(1795, 580, tq < tPl ? tOn : tPl - 3, { amp: a, lam: 120 }),
            ...(tq >= tPl
              ? [
                  SRC(200, 200, tPl - 2, { amp: 0.6, lam: 150 }),
                  SRC(900, 1100, tPl - 2.5, { amp: 0.5, lam: 110 }),
                ]
              : []),
          ];
    },
    figs: (t, im, tq, s3, srcs) => {
      dot(1750, 617, 7, ACC.green);
      rings(srcs, tq, s3);
      kid(600, 866, 1, {
        bob: [0, -2][Math.floor(im / 8) % 2],
        tablet: false,
        flip: t > tLu && t < tYe,
      });
    },
    over: (t) =>
      cap("?", 600, 690, t, cue("s2-1", "vois"), { t1: tOn, fs: 70 }) +
      cap("des ondes radio", 1500, 250, t, tOn, { rot: 3 }) +
      cap("la lumière", 320, 950, t, tLu, { rot: -3 }) +
      cap("invisibles pour nos yeux", 1420, 960, t, tYe, { t1: tPl, fs: 40 }) +
      cap("des ronds partout !", 1420, 960, t, tPl, { fs: 46 }) +
      logo(),
  });
}

// ================= s3 : le code, un coup fort, un coup faible =================
{
  const t0 = T("s3"),
    tSi = cue("s3-2", "signaux"),
    tFo = cue("s3-2", "fort"),
    tFa = cue("s3-2", "faible"),
    tCo = cue("s3-2", "code"),
    tRe = cue("s3-3", "reconstruit"),
    tMi = cue("s3-3", "millions"),
    tE = lineEnd("s3-3");
  sfx(tSi, "tic");
  sfx(tCo, "pop");
  sfx(tMi, "whoosh");
  sfx(tE - 0.3, "chime");
  const CODE = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0];
  // l'image qui se reconstruit sur la tablette : un petit chat
  const PIX = [
    "..O....O..",
    ".OOO..OOO.",
    ".OOOOOOOO.",
    "OOOOOOOOOO",
    "OOYOOOOYOO",
    "OOOOOOOOOO",
    "OOOORROOOO",
    ".OOOOOOOO.",
    "..OOOOOO..",
    "...........",
  ];
  SC.push({
    a: t0,
    b: T("s4"),
    forms: [
      R(-400, -600, 2900, 1700, {
        k: 0.3,
        lo: 2,
        hi: 5,
        flow: FLOW.down(0.3),
        lit: LIT.glow(960, 400, 1700),
        dens: 300,
        max: 9000,
        len: 36,
      }),
      groundF(880, { lo: 2, hi: 5 }),
      R(190, 160, 44, 300, { r: 22, lo: 2, hi: 6, dens: 70 }),
      R(50, 440, 340, 200, { r: 40, lo: 0, hi: 5, flow: FLOW.h(), dens: 110 }),
      R(90, 640, 260, 242, { r: 6, lo: 3, hi: 6 }),
      R(1320, 150, 520, 730, { r: 50, lo: 4, hi: 7, dens: 150 }),
      R(1362, 196, 436, 600, { r: 14, lo: 0, hi: 2, flow: FLOW.h(), dens: 150, ph: 0 }),
    ],
    cam: (t) => [0, 0, 1 + 0.04 * lin(t, t0, T("s4"))],
    waves: () => [],
    figs: (t, im, tq, s3) => {
      // les signaux : des paquets de traits, grands (fort) ou petits (faible), qui filent vers la tablette
      if (tq >= tSi) {
        const sp = tq < tMi ? 150 : 150 + 1500 * ease(lin(tq, tMi, tMi + 1)),
          off = tq < tMi ? (tq - tSi) * 150 : (tMi - tSi) * 150 + (tq - tMi) * sp;
        ctx.lineCap = "round";
        ctx.lineWidth = 4.5;
        for (let i = 0; i < 9; i++) {
          const x = 420 + ((off + i * 100) % 900),
            n = Math.floor((off + i * 100) / 900),
            bit = CODE[(i + n * 3) % CODE.length],
            h = bit ? 170 : 60;
          if (x > 1300) continue;
          ctx.strokeStyle = bit ? RAMP[0] : RAMP[2];
          ctx.beginPath();
          for (let k = 0; k < 26; k++) {
            const sx = x + (rnd(i * 7 + k + s3 * 0.7) - 0.5) * 50,
              sy = 520 + (rnd(i * 3 + k * 1.3 + s3) - 0.5) * 2 * h,
              l = 14 + rnd(k) * 10;
            ctx.moveTo(sx, sy - l);
            ctx.lineTo(sx + (rnd(k + s3) - 0.5) * 6, sy + l);
          }
          ctx.stroke();
        }
      }
      // l'image, carré par carré
      const done = Math.floor(lin(t, tRe, tE - 0.2) * 100);
      for (let k = 0; k < done; k++) {
        const r = Math.floor(k / 10),
          c = k % 10,
          ch = PIX[r][c];
        if (ch === ".") continue;
        ctx.fillStyle = ch === "Y" ? ACC.yellow : ch === "R" ? ACC.red : ACC.orange;
        ctx.fillRect(1380 + c * 40, 290 + r * 40, 36, 36);
      }
      dot(110, 600, 8, ACC.green);
      kid(1180, 886, 1, { bob: [0, -2][Math.floor(im / 8) % 2], tablet: false, up: true });
    },
    over: (t) =>
      cap("fort", 620, 250, t, tFo, { t1: tMi, rot: -4 }) +
      cap("faible", 900, 250, t, tFa, { t1: tMi, rot: 3 }) +
      cap("c'est un code", 760, 830, t, tCo, { t1: tRe }) +
      cap("la tablette reconstruit l'image", 720, 830, t, tRe, { t1: tMi, fs: 40 }) +
      cap("des millions de signaux par seconde", 720, 830, t, tMi, { fs: 40 }) +
      logo(),
  });
}

// ================= s4 et s5 : la maison en coupe, le jardin, les voisins =================
const HOME = [
  skyF({ lit: (x, y) => 0.9 - Math.abs(y - 500) / 1100 }),
  ...[0, 1, 2, 3].map((i) =>
    F(bullet(1050 + i * 400, 910, 330, 560 + rnd(i + 9) * 240), [885 + i * 400, 100, 330, 810], {
      k: 0.5,
      lo: 2,
      hi: 4,
      dens: 210,
    }),
  ),
  R(100, 300, 620, 606, {
    lo: 0,
    hi: 3,
    flow: FLOW.down(0.2),
    lit: LIT.glow(250, 640, 800),
    dens: 170,
  }),
  F("M10 300L410 40L810 300Z", [10, 40, 800, 260], { lo: 3, hi: 6 }),
  R(60, 300, 50, 606, { lo: 5, hi: 7, dens: 70, ph: 0.3 }),
  R(400, 300, 40, 606, { lo: 5, hi: 7, dens: 70, ph: 0.3 }),
  R(710, 300, 56, 606, { lo: 5, hi: 7, dens: 70, ph: 0.3 }),
  F(house(2050, 470, 520, 440, 210), [2050, 260, 520, 650], { lo: 2, hi: 6 }),
  groundF(906),
  shadowF(760, 910, 200, 420),
  F(bullet(1560, 906, 300, 760), [1410, 146, 300, 760], { lo: 3, hi: 6 }),
  R(150, 760, 140, 146, { r: 6, lo: 4, hi: 6 }),
  R(160, 718, 120, 44, { r: 12, lo: 0, hi: 2, flow: FLOW.h(), dens: 70, ph: 0 }),
];
const wallAtt = (cut) => (x) =>
  cut != null && x > cut ? 0 : (x > 400 ? 0.62 : 1) * (x > 710 ? 0.6 : 1);
const bars = (x, y, n) => {
  let s = `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-58" y="-62" width="116" height="84" rx="10" fill="${ACC.cream}"/>`;
  for (let i = 0; i < 4; i++)
    s += `<rect x="${-40 + i * 22}" y="${-4 - i * 14}" width="15" height="${16 + i * 14}" rx="3" fill="${i < n ? "#1c438a" : "#c9c2ae"}"/>`;
  return s + "</g>";
};
{
  const t0 = T("s4"),
    tEl = cue("s4-2", "éloigne"),
    tMu = cue("s4-2", "mur"),
    tPr = cue("s4-3", "près"),
    tB = cue("s4-3", "meilleur");
  sfx(tMu, "tic");
  sfx(tB, "chime");
  const kx = (t) => lerp(1790, 570, ease(lin(t, tPr - 2.6, tB)));
  const camX = (t) => lerp(330, 0, ease(lin(t, tPr - 2.4, tB)));
  SC.push({
    a: t0,
    b: T("s5"),
    forms: HOME,
    cam: (t) => [camX(t), 0, 1],
    waves: () => [SRC(220, 730, t0 - 3, { amp: 0.95, rmax: 1700, lam: 140, att: wallAtt() })],
    figs: (t, im, tq, s3, srcs) => {
      dot(190, 740, 6, ACC.green);
      rings(srcs, tq, s3);
      const x = kx(Math.floor(t * 15) / 15),
        moving = t > tPr - 2.6 && t < tB;
      kid(x, 912, 1, {
        flip: true,
        walk: moving ? [1, -1][Math.floor(im / 4) % 2] : 0,
        bob: moving ? [0, -3][Math.floor(im / 4) % 2] : 0,
      });
    },
    over: (t) => {
      const x = kx(Math.floor(t * 15) / 15),
        n = x > 1400 ? 1 : x > 1000 ? 2 : x > 760 ? 3 : 4;
      return (
        bars(x - camX(t), 760, n) +
        cap("plus on s'éloigne, plus c'est faible", 1180, 200, t, tEl, { t1: tMu, fs: 40 }) +
        cap("chaque mur en arrête un peu", 1180, 200, t, tMu, { t1: tB, fs: 40 }) +
        cap("près de la box : le meilleur endroit !", 1180, 200, t, tB, { fs: 40 }) +
        logo()
      );
    },
  });
  // ----- s5 : la tablette répond, et le mot de passe -----
  const t5 = T("s5"),
    tRp = cue("s5-1", "répond"),
    tVo = cue("s5-3", "voisins"),
    tPw = cue("s5-3", "protégé"),
    tCl = cue("s5-4", "clé");
  sfx(tRp, "pop");
  sfx(tPw, "chime");
  sfx(tCl, "pop");
  const cam5 = (t) => {
    const u = ease(lin(t, tVo - 1, tVo + 0.6));
    return [lerp(0, 760, u), lerp(0, -60, u), lerp(1.08, 0.9, u)];
  };
  SC.push({
    a: t5,
    b: T("s6"),
    forms: HOME,
    cam: cam5,
    waves: (tq) => [
      SRC(220, 730, t5 - 3, {
        amp: 0.8,
        rmax: 2400,
        lam: 150,
        att: wallAtt(tq > tPw ? 1250 : null),
      }),
      ...(tq > tRp ? [SRC(588, 850, tRp, { amp: 0.7, rmax: 900, lam: 90, sp: 260 })] : []),
    ],
    figs: (t, im, tq, s3, srcs) => {
      dot(190, 740, 6, ACC.green);
      rings([srcs[0]], tq, s3);
      if (srcs[1]) rings([srcs[1]], tq, s3, RAMP[1]);
      kid(570, 912, 1, { flip: false, bob: [0, -2][Math.floor(im / 8) % 2] });
      kid(1960, 912, 1, {
        col: ACC.green,
        flip: true,
        bob: [0, -2][Math.floor(im / 10) % 2],
        up: t > tVo && t < tPw,
      });
      // le cadenas
      const p = pop(t, tPw);
      if (p > 0) {
        ctx.save();
        ctx.translate(1250, 560);
        ctx.scale(p * 1.6, p * 1.6);
        ctx.strokeStyle = RAMP[7];
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.arc(0, -40, 34, Math.PI, TAU);
        ctx.stroke();
        ctx.fillStyle = ACC.yellow;
        ctx.beginPath();
        ctx.roundRect(-56, -40, 112, 90, 14);
        ctx.fill();
        ctx.fillStyle = RAMP[7];
        ctx.beginPath();
        ctx.arc(0, -4, 12, 0, TAU);
        ctx.fill();
        ctx.fillRect(-5, -4, 10, 30);
        ctx.restore();
      }
    },
    over: (t) => {
      return (
        cap("la tablette répond !", 1080, 220, t, tRp, { t1: tVo - 0.6 }) +
        cap("mot de passe : ••••••", 960, 180, t, tPw + 0.3, { fs: 50 }) +
        cap("la clé… pour les ondes", 960, 300, t, tCl, { fs: 40, rot: 2 }) +
        logo()
      );
    },
  });
}

// ================= s6 : le résumé et la fin =================
{
  const t0 = T("s6"),
    tCa = cue("s6-1", "câble"),
    tOn = cue("s6-1", "ondes"),
    tMp = cue("s6-2", "mot"),
    tDe = cue("s6-3", "devoirs"),
    tEnd = lineEnd("s6-4") + 0.5;
  sfx(tCa, "tic");
  sfx(tOn, "whoosh");
  sfx(tDe, "pop");
  sfx(tEnd, "pop");
  SC.push({
    a: t0,
    b: SCHED.total + 1,
    forms: STREET,
    cam: (t) => [0, 0, 1.04 - 0.04 * lin(t, t0, SCHED.total)],
    waves: () => [SRC(505, 600, tOn, { amp: 0.9 })],
    figs: (t, im, tq, s3, srcs, c) => {
      streetWins(c);
      // le câble sous la rue, jusqu'à la box
      if (t > tCa - 0.2) {
        const u = ease(lin(t, tCa - 0.2, tCa + 0.9));
        ctx.strokeStyle = ACC.yellow;
        ctx.lineWidth = 9;
        ctx.setLineDash([26, 18]);
        ctx.lineDashOffset = -tq * 60;
        ctx.beginPath();
        ctx.moveTo(-200, 1030);
        ctx.lineTo(lerp(-200, 505, u), 1030);
        if (u >= 1) ctx.lineTo(505, 940);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      rings(srcs, tq, s3);
      const jump = t > tMp && t < tMp + 1.2 ? -Math.abs(Math.sin((t - tMp) * 7)) * 26 : 0;
      kid(1000, 936 + jump, 1, { bob: [0, -2][Math.floor(im / 8) % 2], up: t > tMp && t < tDe });
    },
    over: (t) =>
      cap("un câble jusqu'à la box…", 520, 840, t, tCa, { t1: tMp, fs: 40 }) +
      cap("… puis des ondes jusqu'à toi", 1340, 780, t, tOn, { t1: tMp, fs: 40, rot: 2 }) +
      cap("les devoirs d'abord !", 1300, 760, t, tDe, { t1: tEnd, rot: 3 }) +
      (pop(t, tEnd, 0.5) > 0
        ? `<g transform="translate(960 300) rotate(-2) scale(${pop(t, tEnd, 0.5).toFixed(3)})"><rect x="-370" y="-76" width="760" height="170" rx="14" fill="#07122e" opacity=".35"/><rect x="-380" y="-86" width="760" height="170" rx="14" fill="${ACC.cream}"/><text x="0" y="36" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="108" fill="#1c438a">Kidi-science</text></g>` +
          cap("À bientôt pour une nouvelle question !", 960, 470, t, tEnd + 0.6, {
            fs: 46,
            rot: 1.5,
          })
        : logo()),
  });
}
