// ---------- Scène 5 : la direction (volant, pignon, crémaillère) ----------
(() => {
  const PX = 960,
    PY = 650,
    PR = 50,
    PN = 10; // le pignon
  const pitch = (TAU * PR) / PN;
  // Angle du volant (radians) : images clés lissées
  const k = [
    [cue("s5-2", "tourner") - 0.2, 0],
    [cue("s5-2", "tourner") + 0.6, 0.55],
    [cue("s5-2", "tige") + 0.6, 0],
    [cue("s5-2", "tournes") - 0.1, 0],
    [cue("s5-2", "tournes") + 1.0, 1.15],
    [cue("s5-2", "pousse") - 0.3, 1.15],
    [cue("s5-2", "pousse") + 1.2, -1.15],
    [lineEnd("s5-2") + 0.6, 0],
    [cue("s5-3", "rond") + 0.5, 0.9],
    [cue("s5-3", "barre") + 0.6, -0.9],
    [lineEnd("s5-3") + 0.7, 0],
  ];
  const alpha = (t) => {
    if (t <= k[0][0]) return 0;
    for (let i = 1; i < k.length; i++)
      if (t <= k[i][0]) return lerp(k[i - 1][1], k[i][1], easeIO(lin(t, k[i - 1][0], k[i][0])));
    return k[k.length - 1][1];
  };
  const wheelTop = (x, y, ang) =>
    `<g transform="rotate(${f2(ang)} ${x} ${y})"><rect x="${x - 62}" y="${y - 130}" width="124" height="260" rx="30" fill="${C.ink}"/>` +
    [-80, -40, 0, 40, 80]
      .map(
        (d) =>
          `<path d="M${x - 44} ${y + d} H${x + 44}" stroke="#7C8AA8" stroke-width="9" stroke-linecap="round"/>`,
      )
      .join("") +
    `</g>`;
  const draw = (t) => {
    const a = alpha(t),
      dx = -PR * a,
      del = -dx * 0.46; // la barre glisse, les roues pivotent
    let s = "";
    // roues avant et biellettes
    const LX = 330,
      RX = 1590,
      WY = 700,
      ry = PY + PR + 30;
    for (const [wx, side] of [
      [LX, 1],
      [RX, -1],
    ]) {
      const cs = Math.cos(rad(del)),
        sn = Math.sin(rad(del)),
        vx = side * 130,
        vy = 36;
      const tip = [wx + vx * cs - vy * sn, WY + vx * sn + vy * cs];
      const end = side === 1 ? 560 + dx : 1360 + dx;
      s += `<path d="M${f2(end)} ${ry} L${f2(tip[0])} ${f2(tip[1])}" stroke="${C.ink}" stroke-width="20" stroke-linecap="round"/><path d="M${f2(end)} ${ry} L${f2(tip[0])} ${f2(tip[1])}" stroke="${C.metal}" stroke-width="11" stroke-linecap="round"/>`;
      s +=
        wheelTop(wx, WY, del) +
        `<circle cx="${f2(tip[0])}" cy="${f2(tip[1])}" r="13" fill="#fff" class="ink"/>`;
    }
    // la crémaillère : une barre avec des dents sur le dessus
    let teeth = "";
    const y0 = PY + PR + 6;
    for (let i = -13; i <= 13; i++) {
      const x = PX + dx + (i + 0.5) * pitch;
      teeth += `M${f2(x - pitch * 0.27)} ${y0 + 14} L${f2(x - pitch * 0.13)} ${y0 - 8} L${f2(x + pitch * 0.13)} ${y0 - 8} L${f2(x + pitch * 0.27)} ${y0 + 14} Z`;
    }
    s += `<rect x="${f2(560 + dx)}" y="${y0 + 10}" width="800" height="46" rx="18" fill="${C.blueL}" class="ink"/><path d="${teeth}" fill="${C.blueL}" class="ink"/>`;
    // la colonne et le pignon
    s += `<path d="M${PX} 330 V${PY}" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M${PX} 330 V${PY}" stroke="${C.metal}" stroke-width="20" stroke-linecap="round"/>`;
    s += gearSVG(PX, PY, PR, PN, a + Math.PI / 2 + Math.PI / PN, C.blue, C.blueD);
    // le volant
    s +=
      `<g transform="rotate(${f2((a * 180) / Math.PI)} ${PX} 300)"><circle cx="${PX}" cy="300" r="130" fill="none" stroke="${C.ink}" stroke-width="40"/><circle cx="${PX}" cy="300" r="130" fill="none" stroke="${C.blue}" stroke-width="28"/>` +
      `<path d="M${PX - 118} 300 H${PX + 118} M${PX} 300 V418" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M${PX - 118} 300 H${PX + 118} M${PX} 300 V418" stroke="${C.blue}" stroke-width="20" stroke-linecap="round"/>` +
      `<circle cx="${PX}" cy="300" r="34" fill="${C.blueD}" class="ink"/><circle cx="${PX}" cy="184" r="9" fill="#fff"/></g>`;
    return s;
  };
  onDraw("s5", (t) => {
    $("#s5-rig").innerHTML = draw(t);
  });
  const lab = {
    wheel: label("s5", "s5-l-wheel", [1080, 250], [1250, 190], "Le volant", null),
    rod: label("s5", "s5-l-rod", [PX - 12, 500], [520, 430], "Une longue tige", null, {
      align: "r",
    }),
    pin: label(
      "s5",
      "s5-l-pin",
      [PX + 40, PY - 20],
      [1250, 500],
      "Le petit engrenage",
      "il est rond",
      { color: C.blue },
    ),
    rack: label(
      "s5",
      "s5-l-rack",
      [1200, PY + PR + 40],
      [1120, 880],
      "La crémaillère",
      "une barre pleine de dents",
      { color: C.blue },
    ),
    wh: label("s5", "s5-l-wh", [330, 840], [150, 930], "Les roues avant", "elles pivotent"),
  };
  showLabel(lab.wheel, cue("s5-2", "volant") - 0.25);
  showLabel(lab.rod, cue("s5-2", "tige") - 0.25);
  showLabel(lab.pin, cue("s5-2", "engrenage") - 0.25);
  showLabel(lab.rack, cue("s5-2", "crémaillère") - 0.25);
  showLabel(lab.wh, cue("s5-2", "roues") - 0.25);
})();
