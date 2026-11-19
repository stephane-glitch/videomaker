// ---------- Scène 3 : le moteur électrique ----------
(() => {
  const S = scn("s3");
  const RED = "#F0556A",
    SOUTH = "#DDE3EC";
  // --- Deux aimants : ils s'attirent, puis l'un se retourne et ils se repoussent ---
  const tAtt = cue("s3-2", "attirer") - 0.3,
    tRep = cue("s3-2", "repousser") - 0.4,
    tRig = SCHED.lines["s3-4"].start - 0.5;
  const magnet = (cx, cy, ang) => {
    const g = `transform="rotate(${f2(ang)} ${f2(cx)} ${cy})"`;
    return (
      `<g ${g}><rect x="${f2(cx - 150)}" y="${cy - 60}" width="300" height="120" rx="22" fill="${SOUTH}" class="ink" stroke-width="5"/>` +
      `<path d="M${f2(cx)} ${cy - 60} H${f2(cx + 128)} a22 22 0 0 1 22 22 V${cy + 38} a22 22 0 0 1 -22 22 H${f2(cx)} Z" fill="${RED}" class="ink" stroke-width="5"/>` +
      `<text x="${f2(cx + 75)}" y="${cy + 24}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="70" fill="#fff">N</text>` +
      `<text x="${f2(cx - 75)}" y="${cy + 24}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="70" fill="${C.ink}">S</text></g>`
    );
  };
  const magDraw = (t) => {
    // écart entre les aimants, puis retournement de celui de droite
    const close = ramp(t, tAtt, tAtt + 0.55),
      flip = ramp(t, tRep, tRep + 0.5),
      push = rampO(t, tRep + 0.45, tRep + 1.0);
    const gap = lerp(260, 0, close) + 300 * push;
    const jit =
      t > tRep + 0.45 && t < tRep + 1.6
        ? 5 * Math.sin((t - tRep) * 40) * (1 - lin(t, tRep + 0.45, tRep + 1.6))
        : 0;
    return magnet(960 - 150 - gap / 2, 560, 0) + magnet(960 + 150 + gap / 2 + jit, 560, 180 * flip);
  };

  // --- Le moteur : six bobines autour d'un rotor aimanté ---
  const tFlow = cue("s3-4", "batterie") - 0.2,
    tCoil = cue("s3-4", "allumés") - 0.3;
  const tFast = cue("s3-4", "court") - 0.2,
    tBrake = cue("s3-6", "freine") - 0.1,
    tRev = cue("s3-6", "envers") - 0.1,
    tChg = cue("s3-6", "recharge") - 0.1;
  // vitesse du champ tournant (degrés par seconde)
  const W = [
    [tCoil, 0],
    [tCoil + 0.3, 75],
    [tFast, 110],
    [tFast + 2.5, 460],
    [tBrake, 460],
    [tBrake + 1.6, 120],
  ];
  const MX = 1150,
    MY = 560;
  const wire = (d, off, on) =>
    `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${on ? C.spark : "#E6ECF4"}" stroke-width="13" stroke-linecap="round"/>` +
    (on
      ? `<path d="${d}" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="14 34" stroke-dashoffset="${f2(off)}" stroke-linecap="round"/>`
      : "");
  const rigDraw = (t) => {
    const Ac = integ(W, t),
      on = t >= tFlow,
      rev = t >= tRev;
    const lit = t >= tCoil && t < tBrake + 0.3 ? ((Math.round(Ac / 60) % 6) + 6) % 6 : -1;
    const phi = Ac - 38;
    const flow = (rev ? 1 : -1) * (t - tFlow) * 150;
    const lvl = t >= tChg ? 4 : 3;
    let s = "";
    // batterie
    s += `<rect x="150" y="430" width="360" height="250" rx="30" fill="${C.spark}" class="ink" stroke-width="5"/><rect x="230" y="404" width="60" height="30" rx="8" fill="${C.metal}" class="ink"/><rect x="370" y="404" width="60" height="30" rx="8" fill="${C.metal}" class="ink"/>`;
    for (let i = 0; i < 4; i++)
      s += `<rect x="${182 + i * 76}" y="480" width="56" height="150" rx="12" fill="${i < lvl ? "#3DBE8B" : "#fff"}" class="ink" stroke-width="3"/>`;
    // fils
    s +=
      wire("M510 490 C 640 490, 700 430, 868 430", flow, on) +
      wire("M510 620 C 640 620, 700 690, 868 690", -flow, on);
    // stator
    s += `<circle cx="${MX}" cy="${MY}" r="310" fill="${C.side}" class="ink" stroke-width="5"/><circle cx="${MX}" cy="${MY}" r="236" fill="#FFF8EC" class="ink"/>`;
    for (let i = 0; i < 6; i++) {
      const a = rad(i * 60),
        x = MX + 262 * Math.cos(a),
        y = MY + 262 * Math.sin(a);
      const is = lit >= 0 && (i === lit || i === (lit + 3) % 6);
      if (is) s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="110" fill="url(#s3-glow)"/>`;
      s += `<g transform="rotate(${i * 60} ${f2(x)} ${f2(y)})"><rect x="${f2(x - 34)}" y="${f2(y - 58)}" width="68" height="116" rx="16" fill="${is ? C.spark : "#EEF2F8"}" class="ink"/>`;
      for (let k = -2; k <= 2; k++)
        s += `<path d="M${f2(x - 34)} ${f2(y + k * 20)} H${f2(x + 34)}" stroke="${C.ink}" stroke-width="3" opacity="0.45"/>`;
      if (is)
        s += `<text x="${f2(x)}" y="${f2(y + 14)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="40" fill="${C.ink}" transform="rotate(${-i * 60} ${f2(x)} ${f2(y)})">${i === lit ? "S" : "N"}</text>`;
      s += `</g>`;
    }
    // rotor : un aimant qui tourne
    s +=
      `<g transform="rotate(${f2(phi)} ${MX} ${MY})"><circle cx="${MX}" cy="${MY}" r="150" fill="${C.blue}" class="ink" stroke-width="5"/>` +
      `<rect x="${MX - 190}" y="${MY - 54}" width="380" height="108" rx="24" fill="${SOUTH}" class="ink" stroke-width="5"/>` +
      `<path d="M${MX} ${MY - 54} H${MX + 166} a24 24 0 0 1 24 24 V${MY + 30} a24 24 0 0 1 -24 24 H${MX} Z" fill="${RED}" class="ink" stroke-width="5"/>` +
      `<text x="${MX + 118}" y="${MY + 22}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="62" fill="#fff">N</text>` +
      `<text x="${MX - 118}" y="${MY + 22}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="62" fill="${C.ink}">S</text></g>` +
      `<circle cx="${MX}" cy="${MY}" r="30" fill="${C.blueD}" class="ink"/><circle cx="${MX}" cy="${MY}" r="9" fill="#fff"/>`;
    return s;
  };
  onDraw("s3", (t) => {
    if (t < tRig + 0.6) $("#s3-mag").innerHTML = magDraw(t);
    if (t > tRig - 0.2) $("#s3-rig").innerHTML = rigDraw(t);
  });

  tl.fromTo(
    "#s3-mag",
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.5, ease: OUT },
    S.start + 0.6,
  );
  pop("#s3-n0", cue("s3-2", "feu") - 0.2);
  show("#s3-n1", tAtt + 0.3);
  show("#s3-n2", tRep + 0.6);
  tl.to(
    ["#s3-mag", "#s3-n0", "#s3-n1", "#s3-n2"],
    { opacity: 0, x: -200, duration: 0.35, ease: INN },
    tRig,
  );
  tl.fromTo(
    "#s3-rig",
    { opacity: 0, x: 200 },
    { opacity: 1, x: 0, duration: 0.5, ease: "power4.out" },
    tRig + 0.3,
  );
  const lab = {
    batt: label("s3", "s3-l-batt", [330, 404], [150, 250], "La batterie", "pleine d’électricité", {
      color: "#9A7400",
    }),
    coil: label(
      "s3",
      "s3-l-coil",
      [1300, 340],
      [1500, 200],
      "Les bobines",
      "deviennent des aimants",
    ),
    rot: label("s3", "s3-l-rot", [1250, 640], [1500, 760], "Le rotor", "il court après", {
      color: C.blue,
    }),
  };
  showLabel(lab.batt, tFlow);
  showLabel(lab.coil, cue("s3-4", "bobines") - 0.25);
  showLabel(lab.rot, cue("s3-4", "rotor") - 0.25);
  pop("#s3-n3", tChg);
})();
