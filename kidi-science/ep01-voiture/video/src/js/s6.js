// ---------- Scène 6 : les freins ----------
(() => {
  const S = scn("s6");
  const tPed = cue("s6-2", "pédale") - 0.2,
    tPinch = cue("s6-2", "pincent") - 0.2;
  const tRel = SCHED.lines["s6-4"].start - 0.2,
    tAgain = cue("s6-4", "chaleur") - 1.3;
  const W0 = 520; // degrés par seconde
  // vitesse de la roue : elle ralentit quand les plaquettes pincent, repart, puis freine encore
  const W = [
    [S.start, W0],
    [tPinch, W0],
    [tPinch + 3.4, 0],
    [tRel, 0],
    [tRel + 1.0, W0],
    [tAgain, W0],
    [tAgain + 1.6, 0],
  ];
  const press = (t) =>
    Math.max(
      ramp(t, tPed, tPed + 0.5) * (1 - ramp(t, tRel - 0.3, tRel)),
      ramp(t, tAgain - 0.2, tAgain + 0.2),
    );
  const heat = (t) =>
    Math.max(
      ramp(t, tPinch + 0.2, tPinch + 2.6) * (1 - ramp(t, tRel - 0.2, tRel + 1.0)),
      ramp(t, tAgain + 0.1, tAgain + 1.4),
    );
  const CXW = 560,
    CYW = 570;
  const wheelDraw = (t) => {
    const a = integ(W, t),
      h = heat(t),
      p = press(t);
    const disc = mixHex("#B4BECC", "#FF8A1F", h);
    let holes = "";
    for (let i = 0; i < 10; i++) {
      const an = rad(a + i * 36);
      holes += `<circle cx="${f2(CXW + 150 * Math.cos(an))}" cy="${f2(CYW + 150 * Math.sin(an))}" r="13" fill="${C.ink}" opacity="0.55"/>`;
    }
    let bolts = "";
    for (let i = 0; i < 5; i++) {
      const an = rad(a + i * 72);
      bolts += `<circle cx="${f2(CXW + 44 * Math.cos(an))}" cy="${f2(CYW + 44 * Math.sin(an))}" r="9" fill="${C.ink}"/>`;
    }
    let s = `<circle cx="${CXW}" cy="${CYW}" r="282" fill="none" stroke="${C.ink}" stroke-width="72"/>`;
    if (h > 0.02)
      s += `<circle cx="${CXW}" cy="${CYW}" r="290" fill="url(#s6-heat)" opacity="${f2(h)}"/>`;
    s += `<circle cx="${CXW}" cy="${CYW}" r="200" fill="${disc}" class="ink" stroke-width="5"/>${holes}<circle cx="${CXW}" cy="${CYW}" r="74" fill="#EEF2F8" class="ink"/>${bolts}`;
    // l'étrier (fixe) : il se resserre légèrement quand on freine
    const sq = 10 * p;
    s += `<path d="M${CXW + 96} ${CYW - 150 + sq} Q${CXW + 250} ${CYW - 190} ${CXW + 250} ${CYW} Q${CXW + 250} ${CYW + 190} ${CXW + 96} ${CYW + 150 - sq} L${CXW + 120} ${CYW + 96 - sq} Q${CXW + 176} ${CYW} ${CXW + 120} ${CYW - 96 + sq} Z" fill="${C.blue}" class="ink" stroke-width="5"/>`;
    // ondes de chaleur
    if (h > 0.25)
      for (let i = 0; i < 3; i++) {
        const u = (t * 0.7 + i / 3) % 1,
          x = CXW - 120 + i * 120,
          y = CYW - 320 - u * 90;
        s += `<path d="M${x} ${f2(y)} q18 -20 0 -40 q-18 -20 0 -40" fill="none" stroke="${C.fire}" stroke-width="9" stroke-linecap="round" opacity="${f2(h * (1 - u))}"/>`;
      }
    return s;
  };
  // Encart : le frein vu de dessus (le disque est une tranche ; deux plaquettes le pincent)
  const cutDraw = (t) => {
    const a = integ(W, t),
      h = heat(t),
      p = press(t);
    const gap = lerp(34, 0, p),
      DX = 470,
      top = 110,
      bot = 470;
    let s = `<text x="380" y="64" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="40" fill="${C.ink}">Le frein, vu de dessus</text>`;
    // tranche du disque, avec des stries qui défilent quand il tourne
    s += `<rect x="${DX - 20}" y="${top}" width="40" height="${bot - top}" rx="8" fill="${mixHex("#B4BECC", "#FF8A1F", h)}" class="ink"/>`;
    for (let i = 0; i < 9; i++) {
      const y = top + ((((a * 0.9 + i * 40) % 360) + 360) % 360);
      if (y > top + 8 && y < bot - 8)
        s += `<path d="M${DX - 14} ${f2(y)} H${DX + 14}" stroke="${C.ink}" stroke-width="5" opacity="0.4" stroke-linecap="round"/>`;
    }
    // étrier en « C » et plaquettes
    s += `<path d="M${DX - 150} 190 H${DX - 96} V390 H${DX - 150} Z M${DX + 96} 190 H${DX + 190} V390 H${DX + 96} Z M${DX - 150} 150 H${DX + 190} V190 H${DX - 150} Z" fill="${C.side}" class="ink"/>`;
    s += `<rect x="${f2(DX - 20 - gap - 56)}" y="200" width="56" height="180" rx="10" fill="${C.blue}" class="ink"/><rect x="${f2(DX + 20 + gap)}" y="200" width="56" height="180" rx="10" fill="${C.blue}" class="ink"/>`;
    // le liquide pousse un petit piston derrière la plaquette de droite
    const TEAL = "#35C2B1";
    s += `<rect x="${f2(DX + 76 + gap)}" y="250" width="${f2(100 - gap)}" height="80" rx="8" fill="${TEAL}" class="ink" stroke-width="3"/>`;
    const pipe = `M${DX + 176} 290 H690 V540 H250`;
    s += `<path d="${pipe}" fill="none" stroke="${C.ink}" stroke-width="24" stroke-linejoin="round"/><path d="${pipe}" fill="none" stroke="${TEAL}" stroke-width="14" stroke-linejoin="round"/>`;
    if (p > 0.05 && p < 0.98)
      s += `<path d="${pipe}" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="12 30" stroke-dashoffset="${f2(t * 160)}" stroke-linejoin="round"/>`;
    // la pédale et son petit piston
    const pa = -34 + 22 * p;
    s += `<rect x="${f2(150 + 26 * p)}" y="510" width="110" height="60" rx="10" fill="${TEAL}" class="ink"/>`;
    s += `<g transform="rotate(${f2(pa)} 110 420)"><path d="M110 420 V560" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/><path d="M110 420 V560" stroke="${C.metal}" stroke-width="16" stroke-linecap="round"/><rect x="70" y="548" width="80" height="34" rx="12" fill="${C.ink}"/></g><circle cx="110" cy="420" r="13" fill="#fff" class="ink"/>`;
    return s;
  };
  onDraw("s6", (t) => {
    $("#s6-wheel").innerHTML = wheelDraw(t);
    $("#s6-cutsvg").innerHTML = cutDraw(t);
  });
  const lab = {
    disc: label(
      "s6",
      "s6-l-disc",
      [CXW - 110, CYW - 150],
      [130, 190],
      "Le disque",
      "il tourne avec la roue",
    ),
  };
  showLabel(lab.disc, cue("s6-2", "disque") - 0.25);
  tl.fromTo(
    "#s6-cut",
    { opacity: 0, x: 160 },
    { opacity: 1, x: 0, duration: 0.5, ease: OUT },
    cue("s6-2", "Quand") - 0.5,
  );
  const lc = {
    ped: label("s6", "s6-l-ped", [1130, 760], [1080, 890], "La pédale", null),
    liq: label("s6", "s6-l-liq", [1730, 700], [1560, 890], "Le liquide", "il pousse", {
      color: "#1E8F82",
    }),
    pad: label("s6", "s6-l-pad", [1450, 480], [1100, 380], "Les plaquettes", "elles pincent", {
      color: C.blue,
      align: "r",
    }),
  };
  showLabel(lc.ped, cue("s6-2", "pédale") - 0.25);
  showLabel(lc.liq, cue("s6-2", "liquide") - 0.25);
  showLabel(lc.pad, cue("s6-2", "plaquettes") - 0.25);
  hideLabel(lab.disc, tRel);
  pop("#s6-n1", cue("s6-4", "vitesse") - 0.2);
  pop("#s6-ar", cue("s6-4", "en") - 0.1);
  pop("#s6-n2", cue("s6-4", "chaleur") - 0.2);
})();
