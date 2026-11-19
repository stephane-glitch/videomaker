// ---------- Scène 4 : la transmission (boîte de vitesses, puis différentiel) ----------
(() => {
  const S = scn("s4");
  // --- A. Deux engrenages : le rapport change, la roue va plus ou moins vite ---
  const tShift = cue("s4-2", "change") - 0.2,
    tB = SCHED.lines["s4-4"].start - 0.5;
  const WIN = 210; // vitesse de l'engrenage moteur, en degrés par seconde
  const AX = 600,
    BX = 840,
    GY = 560,
    WX = 1400;
  const meter = (x, y, name, v, col) =>
    `<text x="${x}" y="${y - 14}" font-family="Fredoka" font-weight="600" font-size="34" fill="${C.ink}">${name}</text>` +
    `<rect x="${x}" y="${y}" width="320" height="34" rx="17" fill="#fff" class="ink" stroke-width="3"/><rect x="${x + 4}" y="${y + 4}" width="${f2(312 * v)}" height="26" rx="13" fill="${col}"/>`;
  const gearsDraw = (t) => {
    const sh = ramp(t, tShift, tShift + 0.6);
    const a = rad(WIN * (t - S.start));
    // angle de la roue : intégrale de la vitesse d'entrée × rapport (½ puis 2)
    const wheel = rad(
      integ(
        [
          [S.start, WIN * 0.5],
          [tShift, WIN * 0.5],
          [tShift + 0.6, WIN * 2],
        ],
        t,
      ),
    );
    const pair = (nA, nB, op) => {
      const rA = nA * 8,
        rB = nB * 8;
      return `<g opacity="${f2(op)}">${gearSVG(BX, GY, rB, nB, meshRot(a, nA, nB, 0), C.blueL, C.blue)}${gearSVG(AX, GY, rA, nA, a, C.blue, C.blueD)}</g>`;
    };
    let s = `<rect x="130" y="470" width="200" height="180" rx="26" fill="${C.blueD}" class="ink" stroke-width="5"/><text x="230" y="575" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="38" fill="#fff">Moteur</text>`;
    s += `<path d="M330 ${GY} H${AX}" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M330 ${GY} H${AX}" stroke="${C.metal}" stroke-width="20" stroke-linecap="round"/>`;
    s += `<path d="M${BX} ${GY} H${WX}" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M${BX} ${GY} H${WX}" stroke="${C.metal}" stroke-width="20" stroke-linecap="round"/>`;
    if (sh < 1) s += pair(10, 20, 1 - sh);
    if (sh > 0) s += pair(20, 10, sh);
    // la roue
    let sp = "";
    for (let i = 0; i < 5; i++)
      sp += `<path d="M${WX} ${GY} L${f2(WX + 105 * Math.cos(wheel + (i / 5) * TAU))} ${f2(GY + 105 * Math.sin(wheel + (i / 5) * TAU))}" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>`;
    s += `<circle cx="${WX}" cy="${GY}" r="170" fill="${C.ink}"/><circle cx="${WX}" cy="${GY}" r="118" fill="#EEF2F8" class="ink"/>${sp}<circle cx="${WX}" cy="${GY}" r="24" fill="#fff" class="ink"/>`;
    s +=
      meter(1240, 800, "Force", lerp(0.92, 0.34, sh), C.fire) +
      meter(1240, 900, "Vitesse", lerp(0.28, 0.95, sh), C.blue);
    return s;
  };

  // --- B. Le différentiel : dans un virage, la roue extérieure fait plus de chemin ---
  const tTurn = cue("s4-5", "virage") - 0.3;
  const CX = 760,
    AXY = 700,
    OX = 1560; // centre de la voiture, essieu arrière, centre du virage
  const tread = (x, y, off, ang = 0) => {
    let st = "";
    for (let k = -3; k <= 3; k++) {
      const yy = y + k * 26 + (((off % 26) + 26) % 26) - 13;
      if (Math.abs(yy - y) < 62)
        st += `<path d="M${x - 26} ${f2(yy)} H${x + 26}" stroke="#7C8AA8" stroke-width="7" stroke-linecap="round"/>`;
    }
    return `<g transform="rotate(${f2(ang)} ${x} ${y})"><rect x="${x - 36}" y="${y - 72}" width="72" height="144" rx="18" fill="${C.ink}"/>${st}</g>`;
  };
  const diffDraw = (t) => {
    const turn = ramp(t, tTurn, tTurn + 1.0);
    const v = 190;
    const base = v * (t - tB);
    const extra = integ(
      [
        [tTurn, 0],
        [tTurn + 1, 1],
      ],
      t,
    ); // « quantité de virage » accumulée
    const dL = base + v * 0.3 * extra,
      dR = base - v * 0.26 * extra;
    const rL = OX - (CX - 170),
      rR = OX - (CX + 170);
    let s = "";
    // traces au sol : droites, puis deux arcs de rayons différents
    const arc = (r) => {
      const a0 = rad(180 - 46),
        a1 = rad(180 + 30);
      return `M${f2(OX + r * Math.cos(a0))} ${f2(AXY - r * Math.sin(a0))} A${r} ${r} 0 0 0 ${f2(OX + r * Math.cos(a1))} ${f2(AXY - r * Math.sin(a1))}`;
    };
    const lane = (d, col, off, op) =>
      `<path d="${d}" fill="none" stroke="${col}" stroke-width="14" stroke-dasharray="34 30" stroke-dashoffset="${f2(-off)}" stroke-linecap="round" opacity="${f2(op)}"/>`;
    s +=
      lane(`M${CX - 170} 180 V1000`, C.blueL, dL, 1 - turn) +
      lane(`M${CX + 170} 180 V1000`, C.blueL, dR, 1 - turn);
    s += lane(arc(rL), C.blue, dL, turn) + lane(arc(rR), C.fire, dR, turn);
    // la voiture vue de dessus
    const st = 14 * turn;
    s +=
      tread(CX - 170, 380, dL, st) +
      tread(CX + 170, 380, dR, st) +
      tread(CX - 170, AXY, dL) +
      tread(CX + 170, AXY, dR);
    s += `<path d="M${CX - 134} ${AXY} H${CX + 134}" stroke="${C.ink}" stroke-width="24" stroke-linecap="round"/><path d="M${CX - 134} ${AXY} H${CX + 134}" stroke="${C.metal}" stroke-width="14" stroke-linecap="round"/>`;
    s += `<rect x="${CX - 120}" y="290" width="240" height="500" rx="70" fill="#3DBE8B" fill-opacity="0.35" class="ink" stroke-width="5"/><path d="M${CX - 84} 420 Q${CX} 380 ${CX + 84} 420 L${CX + 70} 470 H${CX - 70} Z" fill="#D6F1FF" class="ink" stroke-width="3"/>`;
    // le différentiel : ses petits engrenages ne tournent que dans le virage
    const sp = rad((dL - dR) * 1.6);
    s +=
      `<rect x="${CX - 64}" y="${AXY - 52}" width="128" height="104" rx="22" fill="${C.blueD}" class="ink" stroke-width="5"/>` +
      gearSVG(CX - 26, AXY, 26, 8, sp, C.blueL, C.blue) +
      gearSVG(CX + 26, AXY, 26, 8, meshRot(sp, 8, 8, 0), C.blueL, C.blue);
    return s;
  };
  onDraw("s4", (t) => {
    if (t < tB + 0.6) $("#s4-gears").innerHTML = gearsDraw(t);
    if (t > tB - 0.2) $("#s4-diff").innerHTML = diffDraw(t);
  });

  const la = {
    small: label(
      "s4",
      "s4-l-small",
      [AX, GY - 96],
      [420, 250],
      "Petit engrenage",
      "il tourne vite",
      { color: C.blue },
    ),
    big: label(
      "s4",
      "s4-l-big",
      [BX + 60, GY - 150],
      [900, 300],
      "Grand engrenage",
      "il tourne lentement",
      { color: C.blue },
    ),
  };
  showLabel(la.small, cue("s4-2", "petit") - 0.25);
  showLabel(la.big, cue("s4-2", "grand") - 0.25);
  show("#s4-n1", cue("s4-2", "lentement") - 0.3);
  hideLabel(la.small.concat(la.big, ["#s4-n1"]), tShift - 0.15);
  show("#s4-n2", cue("s4-2", "vite") - 0.3);
  show("#s4-n3", cue("s4-3", "électriques") - 0.3, { x: 60, y: 0 });
  // passage au différentiel
  tl.to("#s4-a", { x: -260, opacity: 0, duration: 0.35, ease: INN }, tB);
  tl.fromTo(
    "#s4-b",
    { x: 260, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.5, ease: "power4.out" },
    tB + 0.3,
  );
  const lb = {
    out: label(
      "s4b",
      "s4-l-out",
      [CX - 300, 470],
      [80, 300],
      "Roue extérieure",
      "grand chemin : elle tourne plus vite",
      { color: C.blue },
    ),
    inn: label(
      "s4b",
      "s4-l-in",
      [CX + 250, 560],
      [1060, 380],
      "Roue intérieure",
      "petit chemin : elle tourne moins vite",
      { color: "#C25E00" },
    ),
    diff: label(
      "s4b",
      "s4-l-diff",
      [CX + 40, AXY + 30],
      [1060, 800],
      "Le différentiel",
      "il partage le mouvement",
      { color: C.blueD },
    ),
  };
  showLabel(lb.out, cue("s4-5", "extérieur") - 0.25);
  showLabel(lb.inn, cue("s4-5", "intérieur") - 0.25);
  showLabel(lb.diff, cue("s4-5", "différentiel") - 0.25);
})();
