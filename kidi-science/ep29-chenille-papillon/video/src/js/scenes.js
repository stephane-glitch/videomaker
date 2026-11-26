/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs */
// Les scènes : chaque fonction rend les celluloïds d'une image (t = temps du film, st = numéro de pose).
const T = (id) => scn(id).start;
const zoomTo = (px, py, z, tx = 960, ty = 540) => [
  tx - 960 - z * (px - 960),
  ty - 540 - z * (py - 540),
  z,
];
// caméra : liste de [temps, [x, y, zoom]] reliés en douceur
const camKeys = (keys) => (t) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++)
    if (t <= keys[i][0]) {
      const u = ease(lin(t, keys[i - 1][0], keys[i][0]));
      return keys[i][1].map((v, k) => lerp(keys[i - 1][1][k], v, u));
    }
  return keys[keys.length - 1][1];
};
const blinkAt = (t, sd = 0) => (t * 0.31 + sd) % 1 < 0.045;
const txt = (s, x, y, fs, fill = INK, extra = "") =>
  `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${fill}" ${extra}>${s}</text>`;
const halo = (x, y, rx, ry) =>
  EL(x, y, rx, ry, "#fff6dc", 5) +
  EL(x - rx * 0.7, y + ry * 0.5, rx * 0.4, ry * 0.4, "#fff6dc", 0) +
  EL(x + rx * 0.65, y + ry * 0.55, rx * 0.45, ry * 0.4, "#fff6dc", 0);
const logo = () =>
  G(
    `<rect x="-120" y="-28" width="240" height="56" rx="18" fill="#2f5bd3" stroke="${INK}" stroke-width="4"/>` +
      txt("Kidi-science", 0, 11, 30, "#fff6dc"),
    1750,
    1012,
    1,
    -2,
  );

// ================= Générique =================
sceneDef(
  "g",
  "meadow",
  (t) => [-30 * lin(t, 0, 7), 0, 1 + 0.08 * lin(t, 0, 7)],
  (t, st) => {
    const q = st / FPS;
    let s =
      flower(1480, 1100, 380, "#f7a8b8", { sway: Math.sin(q * 1.6) * 14 }) +
      flower(1700, 1120, 300, "#fff6dc", { sway: Math.sin(q * 1.3 + 1) * 12 }) +
      flower(240, 1110, 320, "#f08a5d", { sway: Math.sin(q * 1.4 + 2) * 12 });
    s += cat(crawl(360 + q * 46, 930, 7, 34, q * 1.5), 34, { walk: q * 1.5, blink: blinkAt(q) });
    const p = pop(t, 0.4, 0.5);
    if (p > 0)
      s += G(
        `<rect x="-520" y="-110" width="1040" height="220" rx="60" fill="#fff6dc" stroke="${INK}" stroke-width="8"/>` +
          txt(
            "Kidi-science",
            0,
            50,
            150,
            "#2f5bd3",
            `stroke="${INK}" stroke-width="6" paint-order="stroke"`,
          ),
        960,
        340,
        p,
        -3 + Math.sin(q * 2) * 0.8,
      );
    s += cap("Comment une chenille devient papillon ?", 960, 560, t, cue("g-1") + 2.3, {
      fs: 52,
      rot: 1.5,
    });
    const a = t * 1.1 + 2;
    s += bfly(960 + Math.cos(a) * 720, 760 + Math.sin(a * 1.9) * 110, 0.8, {
      flap: Math.abs(Math.sin(t * 16)),
      rot: 90 - Math.sin(a) * 90 + Math.cos(a * 1.9) * 15,
    });
    return s;
  },
);

// ================= s0 : la saucisse à pattes =================
{
  const by = (x) => {
    const u = (x + 40) / 2000;
    return (1 - u) * (1 - u) * 760 + 2 * u * (1 - u) * 700 + u * u * 750;
  };
  const t0 = T("s0"),
    tStop = cue("s0-2") - 0.3,
    tSa = cue("s0-2", "saucisse"),
    tQ = cue("s0-3", "comment"),
    tP = cue("s0-3", "papillon");
  sfx(tSa, "pop");
  sfx(tP, "chime");
  sceneDef(
    "s0",
    "macroA",
    (t) => [-20 * lin(t, t0, scn("s0").end), 0, 1 + 0.07 * lin(t, t0, scn("s0").end)],
    (t, st) => {
      const q = st / FPS,
        r = 46;
      let s =
        leaf(380, 610, 380, 110, -38, { fill: "#6ab651" }) +
        leaf(1560, 640, 420, 120, -150) +
        branch("M-40 760Q960 700 1960 750", 40);
      const mv = ease(lin(q, t0 + 0.2, tStop)),
        hx = 330 + 620 * mv,
        moving = q < tStop;
      const look = q > tP ? [1, -1] : q > tSa && q < tQ ? [1, -0.8] : moving ? [0.6, 0] : [0, 0];
      s += cat(crawl(hx, by(hx) - 20 - r * 0.9, 7, r, moving ? q * 1.7 : 0), r, {
        walk: moving ? q * 1.7 : 0,
        blink: blinkAt(q, 0.3),
        look,
        sad: q > tSa + 0.5 && q < tQ,
        wide: q > tP,
        face: moving ? 0 : Math.sin(q * 2) * 3,
      });
      // la saucisse à pattes
      const ps = pop(t, tSa);
      if (ps > 0 && t < tQ) {
        let sa = halo(0, 0, 250, 150) + LN("M-150 20l-34 -20M150 20l34 -20", INK, 8);
        for (let i = 0; i < 5; i++)
          sa += LN(`M${-100 + i * 50} 50l${[-6, 6][(Math.floor(q * 6) + i) % 2]} 44`, INK, 8);
        sa += `<rect x="-150" y="-40" width="300" height="96" rx="48" fill="#d9825a" stroke="${INK}" stroke-width="6"/><path d="M-110 -18q110 -22 220 0" stroke="#f3b08a" stroke-width="9" fill="none" stroke-linecap="round"/>`;
        s += G(sa, 1430, 400, ps, -4 + Math.sin(q * 3) * 2);
      }
      // … qui devient papillon ?
      const pq = pop(t, tQ);
      if (pq > 0)
        s += G(
          halo(0, 0, 270, 190) +
            txt(
              "?",
              -170,
              60,
              190,
              "#e2452f",
              `stroke="${INK}" stroke-width="6" paint-order="stroke"`,
            ),
          1420,
          400,
          pq,
        );
      const pb = pop(t, tP);
      if (pb > 0)
        s +=
          bfly(1490, 410, 0.62 * pb, { flap: 0.6 + 0.4 * Math.sin(q * 5), rot: 8 }) +
          sparks(t, tP, 1490, 410, 190);
      return s;
    },
    { over: logo },
  );
}

// ================= s1 : l'œuf =================
{
  const t0 = T("s1"),
    EX = 990,
    EY = 512,
    tO = cue("s1-1", "œuf"),
    tPin = cue("s1-2", "épingle"),
    tC = cue("s1-3", "crac"),
    tPe = cue("s1-3", "petite"),
    tRe = cue("s1-3", "repas"),
    tCo = cue("s1-3", "coquille"),
    tB = cue("s1-4", "bon");
  sfx(tC, "zap");
  sfx(tPin, "pop");
  sfx(tB, "chime");
  const wide = [0, 0, 1],
    close = zoomTo(EX + 40, EY + 30, 2.5, 960, 560);
  sceneDef(
    "s1",
    "macroB",
    camKeys([
      [t0, wide],
      [tO - 0.2, wide],
      [tO + 1.6, close],
      [scn("s1").end, zoomTo(EX + 40, EY + 30, 2.7, 960, 560)],
    ]),
    (t, st) => {
      const q = st / FPS;
      let s =
        branch("M-40 250Q500 330 240 300", 30) + leaf(960, 300, 1500, 300, -1, { fill: "#7cc45a" });
      // l'épingle, pour comparer
      const pp = pop(t, tPin);
      if (pp > 0 && t < tC - 0.6)
        s += G(
          LN("M0 0L60 150", "#9aa6b2", 6) +
            LN("M0 0L60 150", INK, 2) +
            EL(0, 0, 30, 30, "#e2452f", 4) +
            `<circle cx="-9" cy="-9" r="8" fill="#f6b3a7"/>`,
          EX + 120,
          EY + 44,
          pp,
          8,
        );
      // l'œuf : il tremble, se fend, puis la chenille le mange
      const shake = q > tC - 0.9 && q < tC ? [7, -7][st % 2] : 0;
      const eaten = lin(t, tCo + 0.2, tCo + 2.2),
        es = 1 - eaten;
      if (es > 0.03) s += egg(EX, EY, es, { flip: true, rot: shake, crack: lin(t, tC, tC + 0.3) });
      s += sparks(t, tC, EX, EY + 20, 70, 7, 0.6);
      // la toute petite chenille
      if (q >= tC + 0.2) {
        const r = 11,
          out = ease(lin(q, tC + 0.3, tPe + 0.4)),
          back = ease(lin(q, tRe - 0.2, tCo));
        const hx = EX + 30 + 110 * out - 96 * back,
          dir = back > 0.05 ? -1 : 1,
          moving = (out > 0 && out < 1) || (back > 0 && back < 1),
          munch = q > tCo && eaten < 1;
        const pts = crawl(hx, EY + 22, 5, r, moving ? q * 2.2 : 0, dir).map(([x, y]) => [
          x,
          2 * (EY + 16) - y + 6,
        ]);
        s += G(
          cat(pts, r, {
            down: [0, -1],
            walk: moving ? q * 2 : 0,
            mouth: munch ? [0.2, 1][st % 2] : 0,
            blink: blinkAt(q, 0.6) || q > tB,
            look: [dir, 0],
          }),
          0,
          0,
          pop(t, tC + 0.2, 0.3) > 0 ? 1 : 0,
        );
        if (munch)
          for (let i = 0; i < 4; i++)
            s += `<circle cx="${f1(EX + 12 + rnd(st + i) * 30)}" cy="${f1(EY + 30 + ((q * 60 + i * 17) % 40))}" r="2.5" fill="#fff3c4" stroke="${INK}" stroke-width="1"/>`;
        if (q > tB) s += sparks(t, tB, hx, EY + 30, 46, 5, 0.8);
      }
      return s;
    },
    {
      over: (t) =>
        cap("un œuf minuscule", 620, 880, t, tO + 0.3, { t1: tC - 0.3 }) +
        cap("crac !", 1380, 300, t, tC, {
          t1: tPe + 0.6,
          fill: "#e2452f",
          ink: "#fff6dc",
          rot: 5,
          fs: 60,
        }) +
        cap("son premier repas : la coquille", 960, 930, t, tCo, { fs: 42 }) +
        logo(),
    },
  );
}

// ================= s2 : manger, grossir, muer =================
{
  const t0 = T("s2"),
    tM = cue("s2-1", "manger"),
    tE1 = lineEnd("s2-1"),
    tR = cue("s2-2", "rêve"),
    tG = cue("s2-3", "grossit"),
    tTp = cue("s2-3", "trop"),
    tK = cue("s2-3", "craque"),
    tN = cue("s2-3", "neuve"),
    tPu = cue("s2-4", "pull"),
    tPuE = lineEnd("s2-4") + 0.3,
    t4 = cue("s2-5", "quatre"),
    tMu = cue("s2-5", "mue");
  sfx(tK, "zap");
  sfx(tPuE, "pop");
  sfx(tMu, "chime");
  for (let i = 0; i < 5; i++) sfx(t4 + i * 0.32, "tic");
  sceneDef(
    "s2",
    "macroA",
    (t) => [0, 0, 1 + 0.06 * lin(t, t0, scn("s2").end)],
    (t, st) => {
      const q = st / FPS;
      let s = branch("M-40 850Q960 800 1960 840", 40);
      // la feuille, tirée vers la bouche et grignotée
      const eat = lin(q, tM, tE1 + 0.3),
        nb = Math.floor(eat * 11),
        L = 820;
      if (eat < 1) {
        const bites = [];
        for (let k = 0; k < nb; k++)
          bites.push([-L / 2 + 10 + k * 72, k % 2 ? 62 : -62, 84], [-L / 2 + k * 72, 0, 56]);
        const sh = nb * 72,
          a = (-24 * Math.PI) / 180;
        s += leaf(1230 - Math.cos(a) * sh, 560 - Math.sin(a) * sh, L, 250, -24, { bites });
      }
      const pile = pop(t, cue("s2-1", "encore"));
      if (pile > 0 && q < tG)
        s += OP(
          leaf(1560, 770, 320, 100, -8, { fill: "#6ab651" }) + leaf(1600, 730, 300, 96, 10),
          1 - lin(q, tR + 1.5, tG),
        );
      // la chenille grossit
      const grow = lerp(30, 44, eat) + 12 * ease(lin(q, tG, tTp)) + (q >= tK ? 6 : 0),
        tight = q > tTp && q < tK,
        molt = q >= tK,
        out = ease(lin(q, tK + 0.15, tN)),
        r = grow;
      const hx0 = 800,
        hx = hx0 + (molt ? 360 * out : 0),
        hy = 838 - 20 - r * 0.9;
      const munch = q > tM && eat < 1;
      if (molt)
        s += cat(crawl(hx0, 838 - 20 - 50, 7, 54, 0), 54, {
          husk: true,
          col: "#dfe8bb",
          legs: false,
          sq: 0.8,
        });
      if (molt && q < tK + 0.6) s += sparks(t, tK, hx0 - 120, hy - 20, 150, 8, 0.6);
      const pulse =
        q > tR && q < tR + 1.2
          ? 1 + 0.08 * Math.sin((q - tR) * 16)
          : tight
            ? 1 + [0.05, -0.03][st % 2]
            : 1;
      s += cat(crawl(hx, hy, 7, r, molt && out < 1 ? q * 1.8 : munch ? q * 0.8 : 0), r, {
        walk: molt && out < 1 ? q * 1.8 : 0,
        mouth: munch ? [0.15, 1, 0.5][st % 3] : 0,
        blink: blinkAt(q, 0.2) || (q > tR && q < tR + 1.2),
        wide: tight,
        sad: tight,
        sq: pulse,
        col: molt ? "#9be04f" : "#8fd04e",
        pull: q > tPu && q < tPuE,
        look: munch ? [1, -0.4] : [0, 0],
      });
      if (munch)
        for (let i = 0; i < 5; i++)
          s += `<path d="M${f1(hx + 50 + rnd(st * 3 + i) * 60)} ${f1(hy - 30 + rnd(st * 5 + i) * 70)}l8 -6 4 9z" fill="#74c056" stroke="${INK}" stroke-width="2"/>`;
      if (tight)
        s += LN(
          `M${hx - 60} ${hy - r - 26}l-14 -26M${hx - 150} ${hy - r - 22}l0 -30M${hx - 240} ${hy - r - 22}l14 -26`,
          "#e2452f",
          6,
        );
      if (q >= tPuE && q < tPuE + 0.5)
        s += puff(
          hx - 150,
          hy - 10,
          40 + 60 * lin(t, tPuE, tPuE + 0.5),
          1 - lin(t, tPuE, tPuE + 0.5),
        );
      // quatre ou cinq mues : les vieilles peaux, de plus en plus grandes
      for (let i = 0; i < 5; i++) {
        const p = pop(t, t4 + i * 0.32);
        if (p > 0)
          s += G(
            cat(crawl(0, 0, 5, 12 + i * 5, 0), 12 + i * 5, {
              husk: true,
              col: "#dfe8bb",
              legs: false,
              sq: 0.8,
            }) + txt(String(i + 1), -30 - i * 8, 62, 40, INK),
            520 + i * 230,
            930,
            p,
          );
      }
      return s;
    },
    {
      over: (t) =>
        cap("trop serrée !", 520, 420, t, tTp, { t1: tK, rot: -4, fs: 46 }) +
        cap("crac !", 560, 520, t, tK, {
          t1: tN + 0.4,
          fill: "#e2452f",
          ink: "#fff6dc",
          rot: -6,
          fs: 60,
        }) +
        cap("la mue", 960, 240, t, tMu, { fs: 70 }) +
        logo(),
    },
  );
}

// ================= s3 : la chrysalide =================
{
  const t0 = T("s3"),
    AX = 640,
    BY = 262,
    tSt = cue("s3-1", "arrête"),
    tAc = cue("s3-1", "accroche"),
    tTb = cue("s3-2", "tombe"),
    tCh = cue("s3-2", "chrysalide"),
    tZ = cue("s3-3", "dort"),
    tNo = cue("s3-4"),
    tCn = cue("s3-4", "chantier"),
    tDf = cue("s3-4", "défait"),
    tSo = cue("s3-4", "soupe"),
    tGr = cue("s3-6", "groupes"),
    tAi = cue("s3-6", "ailes"),
    tPa = cue("s3-6", "pattes"),
    tAn = cue("s3-6", "antennes");
  sfx(tTb, "whoosh");
  sfx(tCh, "chime");
  sfx(tCn, "pop");
  sfx(tGr, "pop");
  sfx(tAi, "chime");
  sfx(tPa, "tic");
  sfx(tAn, "tic");
  const CXc = 1300,
    CYc = 590,
    CR = 330;
  sceneDef(
    "s3",
    "branch",
    (t) => [0, -10 * lin(t, t0, scn("s3").end), 1 + 0.05 * lin(t, t0, scn("s3").end)],
    (t, st) => {
      const q = st / FPS,
        r = 46,
        n = 8;
      let s = leaf(1500, 150, 420, 120, 160, { fill: "#6ab651" }) + leaf(200, 170, 380, 110, 20);
      const dropped = q >= tTb;
      // la vieille peau qui tombe
      if (dropped) {
        const u = lin(t, tTb, tTb + 0.9);
        if (u < 1)
          s += G(
            cat(hang(0, 0, n, r, 0), r, { husk: true, col: "#dfe8bb", legs: false }),
            AX + 60 * u,
            BY + 24 + 1100 * u * u,
            1,
            70 * u,
          );
      }
      if (!dropped) {
        const mv = ease(lin(q, t0, tSt)),
          hx = 300 + 380 * mv,
          moving = q < tSt,
          u = ease(lin(q, tAc, tAc + 1.3));
        const a = crawl(hx, BY - 22 - r * 0.9, n, r, moving ? q * 1.7 : 0).reverse(),
          b = hang(
            AX,
            BY + 20,
            n,
            r,
            u >= 1 ? Math.sin(q * (q > tTb - 1 ? 14 : 2.4)) * (q > tTb - 1 ? 7 : 4) : 0,
          );
        const pts = u > 0 ? mixPts(a, b, u) : a;
        s += branch("M-40 250Q960 190 1960 260", 44);
        s += cat(u > 0 ? pts : pts.reverse(), r, {
          legs: u < 0.3,
          walk: moving ? q * 1.7 : 0,
          blink: blinkAt(q, 0.4) || u >= 1,
          face: 25 * u,
          look: [0, u],
        });
      } else {
        s += branch("M-40 250Q960 190 1960 260", 44);
        s +=
          chrys(AX, BY + 20, 1.5 * (0.6 + 0.4 * pop(t, tTb, 0.3)), { sway: Math.sin(q * 2) * 3 }) +
          sparks(t, tTb, AX, BY + 190, 190, 8, 0.7);
        // elle dort ?
        if (q > tZ && q < tNo + 0.3)
          for (let i = 0; i < 3; i++)
            s += txt(
              "z",
              AX + 110 + i * 46 + Math.sin(q * 3 + i) * 8,
              BY + 150 - i * 56 - (((q - tZ) * 30) % 30),
              50 + i * 16,
              "#fff6dc",
              `stroke="${INK}" stroke-width="5" paint-order="stroke"`,
            );
        // la loupe : ce qui se passe dedans
        const pc = pop(t, tCn - 0.3);
        if (pc > 0) {
          const id = "k" + MID++;
          let inn =
            `<rect x="-400" y="-400" width="800" height="800" fill="#fff6dc"/>` +
            G(
              PA(
                "M0 18C34 22 46 70 30 120C22 160 8 196 0 212C-8 196 -22 160 -30 120C-46 70 -34 22 0 18Z",
                "#d9f0b4",
                2,
              ),
              0,
              -300,
              2.75,
            );
          const soup = lin(t, tDf, tSo + 0.4);
          if (soup < 1)
            inn += OP(
              G(cat(hang(0, -150, 6, 40, 0, 1.4), 40, { legs: false, blink: true }), 0, 0, 1),
              1 - soup,
            );
          if (soup > 0) {
            let d = "M-130 260";
            for (let i = 0; i <= 10; i++)
              d += `L${-110 + i * 22} ${f1(250 - 300 * soup + Math.sin(q * 5 + i * 1.1) * 9)}`;
            inn +=
              `<clipPath id="${id}s"><path d="M0 18C34 22 46 70 30 120C22 160 8 196 0 212C-8 196 -22 160 -30 120C-46 70 -34 22 0 18Z" transform="translate(0 -300) scale(2.75)"/></clipPath><g clip-path="url(#${id}s)">` +
              PA(d + "L130 320L-130 320Z", "#a9d95f", 4);
            for (let i = 0; i < 7; i++) {
              const bu = (q * 0.5 + i * 0.37) % 1;
              inn += `<circle cx="${f1(-80 + i * 27 + Math.sin(q * 3 + i) * 6)}" cy="${f1(240 - bu * 280 * soup)}" r="${f1(6 + (i % 3) * 4)}" fill="#d6f0a0" stroke="${INK}" stroke-width="2.5"/>`;
            }
            inn += "</g>";
          }
          // les petits groupes de cellules qui reconstruisent tout
          const disc = (x, y, p) =>
            p <= 0
              ? ""
              : G(
                  Array.from(
                    { length: 7 },
                    (_, i) =>
                      `<circle cx="${f1(i ? Math.cos(i * 1.047) * 20 : 0)}" cy="${f1(i ? Math.sin(i * 1.047) * 20 : 0)}" r="9" fill="#ffe066" stroke="${INK}" stroke-width="3"/>`,
                  ).join(""),
                  x,
                  y,
                  p * (1 + 0.08 * Math.sin(q * 8 + x)),
                );
          const pA = pop(t, tAi),
            pP = pop(t, tPa),
            pN = pop(t, tAn);
          inn +=
            disc(-50, -60, pop(t, tGr) * (1 - lin(t, tAi, tAi + 0.3))) +
            disc(40, 40, pop(t, tGr + 0.15) * (1 - lin(t, tPa, tPa + 0.3))) +
            disc(-20, 140, pop(t, tGr + 0.3) * (1 - lin(t, tAn, tAn + 0.3)));
          if (pA > 0)
            inn +=
              G(
                PA("M0 0C20 -60 90 -70 100 -24C104 4 60 20 8 8Z", "#f39a2b", 4) +
                  PA("M0 0C-20 -60 -90 -70 -100 -24C-104 4 -60 20 -8 8Z", "#f39a2b", 4),
                -30,
                -60,
                pA * 0.8,
                -8,
              ) + sparks(t, tAi, -30, -80, 90, 5);
          if (pP > 0)
            inn +=
              G(LN("M0 0l40 30 -10 40M0 14l50 34 -6 40M0 28l34 44 -14 34", INK, 6), 30, 20, pP) +
              sparks(t, tPa, 60, 70, 70, 4);
          if (pN > 0)
            inn +=
              G(
                LN("M0 0q-30 -50 -60 -40M0 0q30 -50 60 -40", INK, 6) +
                  `<circle cx="-62" cy="-40" r="8" fill="${INK}"/><circle cx="62" cy="-40" r="8" fill="${INK}"/>`,
                -20,
                170,
                pN,
              ) + sparks(t, tAn, -20, 150, 80, 4);
          s += LN(
            `M${AX + 60} ${BY + 130}L${CXc - CR * 0.8} ${CYc - CR * 0.62}M${AX + 50} ${BY + 300}L${CXc - CR * 0.7} ${CYc + CR * 0.72}`,
            INK,
            5,
            `stroke-dasharray="4 16" opacity="${f1(pc)}"`,
          );
          s += G(
            `<clipPath id="${id}"><circle r="${CR}"/></clipPath><g clip-path="url(#${id})">${inn}</g><circle r="${CR}" fill="none" stroke="${INK}" stroke-width="10"/><circle r="${CR - 12}" fill="none" stroke="#f2c94c" stroke-width="8"/>`,
            CXc,
            CYc,
            pc,
          );
        }
      }
      return s;
    },
    {
      over: (t) =>
        cap("la tête en bas", 1250, 620, t, cue("s3-1", "tête"), { t1: tTb }) +
        cap("la chrysalide", 640, 900, t, tCh, { fs: 60 }) +
        cap("un vrai chantier !", 1300, 120, t, tCn, { t1: tDf + 0.2, rot: 3 }) +
        cap("une soupe de chenille", 1300, 120, t, tSo, { t1: tGr, rot: 3 }) +
        cap("des cellules qui reconstruisent tout", 1220, 990, t, tGr + 0.4, { fs: 40, rot: 1 }) +
        logo(),
    },
  );
}

// ================= s4 : le papillon sort =================
{
  const t0 = T("s4"),
    AX = 960,
    BY = 222,
    tL = cue("s4-1"),
    tFe = cue("s4-1", "fend"),
    tSo = cue("s4-1", "sort"),
    tPp = cue("s4-2", "papillon"),
    tFr = cue("s4-2", "fripées"),
    tGo = cue("s4-3", "gonfle"),
    tSe = cue("s4-3", "sécher"),
    tHop = cue("s4-4", "hop"),
    tEnv = cue("s4-4", "envole"),
    tDays = tFe - 0.4;
  sfx(tFe, "zap");
  sfx(tSo, "pop");
  sfx(tPp, "chime");
  sfx(tEnv, "whoosh");
  const days = (t) => 14 * lin(t, t0 + 0.3, tDays);
  sceneDef(
    "s4",
    "branch",
    camKeys([
      [t0, [0, 0, 1]],
      [tSo, [0, -30, 1.1]],
      [tHop, [0, -60, 1.12]],
      [tEnv + 1.2, [0, 20, 1]],
    ]),
    (t, st) => {
      const q = st / FPS;
      let s =
        leaf(1620, 130, 420, 120, 165, { fill: "#6ab651" }) +
        leaf(260, 140, 380, 110, 15) +
        branch("M-40 210Q960 170 1960 220", 44);
      const ripe = lin(t, t0, tDays),
        crack = lin(t, tFe, tFe + 0.7),
        outU = lin(t, tSo, tSo + 0.8),
        empty = outU > 0;
      const shake = q > tFe - 0.5 && !empty ? [5, -5][st % 2] : Math.sin(q * 2) * 2.5;
      s += chrys(
        AX,
        BY + 18,
        1.5,
        empty
          ? { col: "#eef0d6", hi: "#fbfbf0", rid: "#c9cda8", crack: 1, sway: shake, alpha: 0.8 }
          : { col: ripe > 0.6 ? "#7fb27a" : "#8fd06a", wing: ripe * 0.9, crack, sway: shake },
      );
      s += sparks(t, tFe, AX, BY + 250, 150, 7, 0.6);
      if (empty) {
        const fly = lin(t, tEnv, tEnv + 1.6),
          ant = q > tHop && q < tEnv ? 0.9 : 1;
        const crumple = 1 - 0.95 * ease(lin(t, tGo, tSe - 0.2)),
          pump = t > tGo && t < tSe ? 1 + 0.05 * Math.sin((t - tGo) * 12) : 1;
        const x = AX + 30 + fly * fly * 1100 + Math.sin(fly * 9) * 70 * fly,
          y =
            BY +
            540 +
            60 * (1 - ease(outU)) -
            (fly * 900 + Math.sin(fly * 7) * 40) +
            (ant < 1 ? 26 : 0);
        const flap =
          fly > 0
            ? Math.abs(Math.sin(t * 20))
            : t > tSe
              ? 0.72 + 0.28 * Math.sin((q - tSe) * 4)
              : 1;
        s += bfly(x, y, 1.05 * (0.4 + 0.6 * ease(outU)) * pump * (ant < 1 ? 0.94 : 1), {
          crumple,
          flap,
          rot: fly > 0 ? 30 * fly : Math.sin(q * 2.2) * 3,
        });
        if (t > tFr && t < tGo)
          s += LN(
            `M${AX - 190} ${BY + 330}l-30 -16M${AX - 196} ${BY + 540}l-34 6M${AX + 250} ${BY + 330}l30 -16M${AX + 256} ${BY + 540}l34 6`,
            INK,
            5,
            `opacity="${[1, 0.4][st % 2]}"`,
          );
        if (t > tGo && t < tSe)
          for (let i = 0; i < 2; i++)
            s += puff(
              AX + (i ? 300 : -260),
              BY + 360 + Math.sin(t * 12) * 10,
              22 + 8 * Math.sin(t * 12 + i),
              0.8,
            );
        if (t > tSe && fly === 0)
          for (let i = 0; i < 6; i++)
            s += `<path d="M${f1(AX - 260 + i * 110)} ${f1(BY + 560 - ((q * 70 + i * 40) % 160))}q8 -12 0 -24" stroke="#fff6dc" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>`;
        s +=
          sparks(t, tPp, AX + 30, BY + 540, 260, 9, 0.8) +
          sparks(t, tEnv, AX + 30, BY + 540, 200, 8, 0.7);
        if (fly > 0 && fly < 0.4) s += puff(AX + 30, BY + 470, 30 + 90 * fly, 1 - fly * 2.5);
      }
      // le soleil et la lune qui passent : les jours défilent
      if (t < tDays + 0.4) {
        const d = days(t),
          ph = d % 1,
          night = ph > 0.5,
          a = Math.PI * (night ? (ph - 0.5) * 2 : ph * 2);
        const sx = 960 - Math.cos(a) * 820,
          sy = 700 - Math.sin(a) * 560;
        s += night
          ? PA(
              "M0 -60A60 60 0 1 0 60 0A46 46 0 1 1 0 -60Z",
              "#fff6dc",
              5,
              `transform="translate(${f1(sx)} ${f1(sy)})"`,
            )
          : G(
              Array.from({ length: 10 }, (_, i) =>
                LN(`M0 -78V-104`, INK, 7, `transform="rotate(${i * 36})"`),
              ).join("") + EL(0, 0, 62, 62, "#ffd84a", 5),
              sx,
              sy,
              1,
              q * 30,
            );
      }
      return s;
    },
    {
      set2: "night",
      mix: (t) =>
        t < tDays + 0.3 ? (days(t) % 1 > 0.5 ? 1 : 0) * Math.min(1, lin(t, t0, t0 + 0.2)) : 0,
      over: (t) =>
        (t < tDays + 0.4 && t > t0 + 0.3
          ? cap("jour " + Math.max(1, Math.ceil(days(t))), 1500, 900, t, t0 + 0.3, { fs: 60 })
          : "") +
        cap("2 semaines", 1500, 900, t, tDays + 0.4, { t1: tSo, fs: 54 }) +
        cap("des ailes toutes fripées", 1460, 760, t, tFr, { t1: tGo, rot: 3 }) +
        cap("il gonfle ses ailes", 1460, 760, t, tGo, { t1: tSe, rot: 3 }) +
        cap("puis il les laisse sécher", 1460, 760, t, tSe, { t1: tHop, rot: 3 }) +
        logo(),
    },
  );
}

// ================= s5 : le nectar, les œufs, le cycle =================
{
  const t0 = T("s5"),
    FX = 980,
    FY = 600,
    tNe = cue("s5-1", "nectar"),
    tTr = cue("s5-1", "trompe"),
    tPl = cue("s5-1", "paille"),
    tFm = cue("s5-2"),
    tPo = cue("s5-2", "pond"),
    tRe = cue("s5-2", "recommence"),
    tW = cue("s5-3") - 0.4,
    W = [
      cue("s5-3", "Œuf"),
      cue("s5-3", "chenille"),
      cue("s5-3", "chrysalide"),
      cue("s5-3", "papillon"),
    ],
    tMe = cue("s5-4", "métamorphose");
  sfx(tTr, "pop");
  sfx(tPo, "pop");
  sfx(tW, "whoosh");
  W.forEach((w) => sfx(w, "pop"));
  sfx(tMe, "chime");
  sceneDef(
    "s5",
    "meadow",
    camKeys([
      [t0, [0, 0, 1]],
      [tNe, [0, 0, 1.04]],
      [tTr + 0.8, zoomTo(FX, FY - 60, 1.7)],
      [tFm - 0.3, zoomTo(FX, FY - 60, 1.78)],
      [tFm + 1, [-60, 0, 1.02]],
      [scn("s5").end, [-60, 0, 1.06]],
    ]),
    (t, st) => {
      const q = st / FPS;
      const gulp = t > tPl && t < tFm ? 1 + 0.06 * Math.sin((t - tPl) * 14) : 1;
      let s =
        flower(500, 1110, 430, "#f7a8b8", { sway: Math.sin(q * 1.4) * 10 }) +
        flower(FX, 1110, 510, "#fff6dc", { s: 1.25 * gulp }) +
        flower(1420, 1120, 380, "#f08a5d", { sway: Math.sin(q * 1.2 + 2) * 10 });
      s +=
        branch("M1960 330Q1700 380 1500 400", 26) +
        leaf(1560, 420, 520, 150, 172, { fill: "#6ab651" });
      // les œufs pondus sous la feuille
      for (let i = 0; i < 5; i++) {
        const p = pop(t, tPo + 0.3 + i * 0.22);
        if (p > 0)
          s +=
            egg(1440 + i * 52, 520 + Math.sin(i * 1.3) * 6, 0.8 * p, { flip: true }) +
            sparks(t, tPo + 0.3 + i * 0.22, 1440 + i * 52, 510, 40, 4, 0.5);
      }
      // le papillon : il arrive, se pose, boit, puis va pondre
      const arr = ease(lin(t, t0 + 0.2, tNe - 0.2)),
        go = ease(lin(t, tFm, tPo - 0.1));
      const perch = [FX, FY - 190],
        from = [200, 150],
        to = [1540, 330];
      let x = lerp(from[0], perch[0], arr) + Math.sin(arr * Math.PI) * 160,
        y = lerp(from[1], perch[1], arr) - Math.sin(arr * Math.PI * 2) * 90;
      x = lerp(x, to[0], go);
      y = lerp(y, to[1], go) - Math.sin(go * Math.PI) * 160;
      const flying = (arr > 0 && arr < 1) || (go > 0 && go < 1);
      const rot = go > 0 ? lerp(180, 20, go) : lerp(120, 180, arr);
      s += bfly(x, y, 0.72, {
        flap: flying ? Math.abs(Math.sin(t * 20)) : 0.6 + 0.4 * Math.sin(q * 3),
        rot,
        prob: go > 0 ? null : lin(t, tTr, tTr + 0.5) * (1 - lin(t, tFm - 0.3, tFm)) || 0.001,
      });
      if (t > tPl && t < tFm) s += sparks(tPl + ((t - tPl) % 0.8), tPl, FX, FY - 30, 60, 4, 0.8);
      s += sparks(t, tRe, 1560, 480, 170, 8, 0.8);
      return s;
    },
    {
      over: (t, st) => {
        const q = st / FPS;
        let s =
          cap("la trompe : une paille pour boire le nectar", 960, 960, t, tTr + 0.4, {
            t1: tFm,
            fs: 40,
          }) + cap("elle pond ses œufs", 1380, 720, t, tPo, { t1: tW, rot: 3 });
        // la grande roue de la vie du papillon
        const pw = pop(t, tW, 0.5);
        if (pw > 0) {
          let w = `<circle r="430" fill="#fff6dc" stroke="${INK}" stroke-width="9"/><circle r="408" fill="none" stroke="#f2c94c" stroke-width="7"/>`;
          const icon = [
            egg(0, 26, 2.2),
            G(cat(crawl(70, 10, 5, 26, q), 26, { walk: q, blink: blinkAt(q) }), 0, 0),
            chrys(0, -160, 0.95, { sway: Math.sin(q * 2) * 4 }),
            bfly(0, 10, 0.55, { flap: 0.6 + 0.4 * Math.sin(q * 5) }),
          ];
          const names = ["l'œuf", "la chenille", "la chrysalide", "le papillon"];
          for (let i = 0; i < 4; i++) {
            const a = -Math.PI / 2 + (i * Math.PI) / 2,
              p = pop(t, W[i]);
            if (p <= 0) continue;
            const ix = Math.cos(a) * 270,
              iy = Math.sin(a) * 250;
            w +=
              G(icon[i], ix, iy - 10, p) +
              G(txt(names[i], 0, 0, 34), ix, iy + (i === 2 ? 84 : i === 3 ? 136 : 120), p);
            const a1 = a + 0.5,
              a2 = a + 1.07;
            w +=
              LN(
                `M${f1(Math.cos(a1) * 300)} ${f1(Math.sin(a1) * 290)}A300 290 0 0 1 ${f1(Math.cos(a2) * 300)} ${f1(Math.sin(a2) * 290)}`,
                "#e2452f",
                9,
                `opacity="${f1(p)}"`,
              ) +
              G(
                PA("M-16 -14L14 0L-16 14Z", "#e2452f", 3),
                Math.cos(a2) * 300,
                Math.sin(a2) * 290,
                p,
                (a2 * 180) / Math.PI + 90,
              );
          }
          s +=
            G(w, 760, 540, pw, Math.sin(q) * 0.6) +
            G(
              cap("la métamorphose", 0, 0, t, tMe, {
                fs: 54,
                fill: "#2f5bd3",
                ink: "#fff6dc",
                rot: -3,
              }),
              760,
              540,
            ) +
            sparks(t, tMe, 760, 540, 330, 10, 0.9);
        }
        return s + logo();
      },
    },
  );
}

// ================= s6 : et moi ? =================
{
  const t0 = T("s6"),
    tC = cue("s6-1", "chrysalide"),
    tNon = cue("s6-2"),
    tLe = cue("s6-2", "légumes"),
    tAi = cue("s6-3", "ailes"),
    tEnd = lineEnd("s6-3") + 0.5;
  sfx(tC, "pop");
  sfx(tLe, "pop");
  sfx(tAi, "chime");
  sfx(tEnd, "pop");
  sceneDef(
    "s6",
    "dusk",
    (t) => [0, 0, 1 + 0.06 * lin(t, t0, scn("s6").end)],
    (t, st) => {
      const q = st / FPS,
        r = 44,
        hx = 900,
        hy = 716;
      let s =
        flower(1650, 1110, 400, "#f7a8b8", { sway: Math.sin(q * 1.3) * 10 }) +
        flower(250, 1120, 340, "#fff6dc", { sway: Math.sin(q * 1.5 + 1) * 10 });
      s += branch("M-40 900Q500 840 760 800", 30) + leaf(900, 790, 980, 250, -4);
      // de petites ailes rêvées
      const pa = pop(t, tAi);
      if (pa > 0)
        s +=
          G(
            PA(
              "M0 0C-30 -110 -160 -120 -170 -40C-174 10 -90 30 -10 10Z",
              "#fff6dc",
              5,
              `stroke-dasharray="14 12"`,
            ) +
              PA(
                "M0 0C30 -110 160 -120 170 -40C174 10 90 30 10 10Z",
                "#fff6dc",
                5,
                `stroke-dasharray="14 12"`,
              ),
            hx - 150,
            hy - 40,
            pa,
            Math.sin(t * 14) * 6,
          ) + sparks(t, tAi, hx - 150, hy - 120, 200, 8, 0.9);
      const sad = q > tNon + 0.2 && q < tAi;
      s += cat(crawl(hx, hy, 7, r, 0), r, {
        blink: blinkAt(q, 0.1) || q > tAi + 0.3,
        look: q < tNon ? [0.6, -1] : [0, 0],
        sad,
        face: Math.sin(q * 2) * 3,
      });
      // elle rêve de chrysalide…
      const pc = pop(t, tC - 0.2);
      if (pc > 0 && t < tNon + 0.4)
        s += G(
          halo(0, 0, 170, 190) +
            chrys(-40, -150, 1.1) +
            txt(
              "?",
              90,
              50,
              150,
              "#e2452f",
              `stroke="${INK}" stroke-width="6" paint-order="stroke"`,
            ),
          1250,
          400,
          pc * (1 - lin(t, tNon + 0.1, tNon + 0.4)),
        );
      // … mais ce sera des légumes
      const pl = pop(t, tLe);
      if (pl > 0 && t < tEnd) {
        let v = halo(0, 0, 230, 150);
        v += G(
          PA("M-30 -20L30 -20L4 110L-4 110Z", "#f08a24", 5) +
            LN("M-10 -20q-10 -40 -30 -50M0 -20v-56M10 -20q10 -40 30 -50", "#3f8a35", 9),
          -100,
          -20,
          1,
          -18,
        );
        v += G(
          LN("M0 0V70", "#74c056", 22) +
            LN("M0 0V70", INK, 3) +
            EL(-30, -10, 34, 30, "#3f9a45", 5) +
            EL(30, -10, 34, 30, "#3f9a45", 5) +
            EL(0, -36, 38, 32, "#4fae52", 5),
          80,
          0,
        );
        s += G(v, 1290, 420, pl);
      }
      const a = t * 0.9;
      s += bfly(960 + Math.cos(a) * 640, 250 + Math.sin(a * 2.1) * 90, 0.6, {
        flap: Math.abs(Math.sin(t * 18)),
        rot: 90 - Math.sin(a) * 90,
      });
      return s;
    },
    {
      over: (t, st) => {
        const p = pop(t, tEnd, 0.5),
          q = st / FPS;
        return (
          (p > 0
            ? G(
                `<rect x="-380" y="-84" width="760" height="168" rx="48" fill="#fff6dc" stroke="${INK}" stroke-width="7"/>` +
                  txt(
                    "Kidi-science",
                    0,
                    38,
                    110,
                    "#2f5bd3",
                    `stroke="${INK}" stroke-width="5" paint-order="stroke"`,
                  ),
                960,
                200,
                p,
                -3 + Math.sin(q * 2) * 0.8,
              )
            : "") +
          cap("À bientôt pour une nouvelle question !", 960, 370, t, tEnd + 0.6, {
            fs: 46,
            rot: 1.5,
          }) +
          (p > 0 ? "" : logo())
        );
      },
    },
  );
}
