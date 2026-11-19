// ---------- Scène 5 : la centrale (un aimant qui tourne au milieu de bobines, comme un moteur à l'envers) ----------
(() => {
  const tMot = cue("s5-2", "moteur") - 0.5,
    tRev = cue("s5-3", "envers") - 0.3,
    tWind = cue("s5-4", "vent") - 0.5,
    tHome = cue("s5-4", "jusque") - 0.6;
  const W = [
    [tRev, 0],
    [tRev + 0.8, 130],
    [tWind, 130],
    [tWind + 1.2, 250],
  ];
  const GX = 900,
    GY = 540,
    RED = "#F0556A",
    SOUTH = "#DDE3EC";
  onDraw("s5", (t) => {
    const a = integ(W, t),
      gen = rateAt(W, t) / 250,
      app = lin(t, tMot, tMot + 0.4);
    let s = "";
    // --- l'éolienne et son arbre, à gauche ---
    const wd = lin(t, tWind, tWind + 0.5);
    if (wd > 0) {
      const hx = 330,
        hy = 430;
      let bl = "";
      for (let i = 0; i < 3; i++)
        bl += `<path d="M0 0 C 30 -60, 26 -200, 0 -250 C -14 -200, -22 -60, 0 0 Z" transform="translate(${hx} ${hy}) rotate(${f2(a * 0.8 + i * 120)})" fill="#fff" class="ink" stroke-width="4"/>`;
      s +=
        `<g opacity="${f2(wd)}"><path d="M${hx - 22} 840 L${hx - 8} ${hy} H${hx + 8} L${hx + 22} 840 Z" fill="${C.side}" class="ink"/>` +
        `<path d="M${hx} ${hy} H${GX}" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/><path d="M${hx} ${hy} H${GX}" stroke="${C.metal}" stroke-width="16" stroke-linecap="round" stroke-dasharray="30 22" stroke-dashoffset="${f2(-a * 0.6)}"/>${bl}<circle cx="${hx}" cy="${hy}" r="24" fill="${C.blue}" class="ink"/></g>`;
      for (let i = 0; i < 3; i++) {
        const u = (t * 0.6 + i / 3) % 1;
        s += `<path d="M${f2(40 + u * 200)} ${250 + i * 150} q30 -18 60 0 t60 0" fill="none" stroke="${C.air}" stroke-width="8" stroke-linecap="round" opacity="${f2(wd * Math.sin(u * Math.PI))}"/>`;
      }
    }
    // --- les lignes électriques et la maison ---
    const hm = lin(t, tHome, tHome + 0.5);
    if (hm > 0) {
      const line = `M${GX + 250} ${GY - 60} C ${GX + 330} 330, 1300 330, 1360 330 Q 1470 380 1580 330 L 1700 560`;
      s +=
        `<g opacity="${f2(hm)}">` +
        wireSVG(line, C.spark, 18) +
        `<path d="${line}" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="14 30" stroke-dashoffset="${f2(-t * 170)}" stroke-linecap="round"/>`;
      for (const x of [1360, 1580])
        s += `<path d="M${x - 34} 840 L${x} 300 L${x + 34} 840 M${x - 60} 350 H${x + 60} M${x - 22} 660 L${x + 16} 520 M${x + 22} 660 L${x - 16} 520" fill="none" class="ink" stroke-width="6"/>`;
      s += `<path d="M1640 620 L1760 520 L1880 620 Z" fill="#E0455E" class="ink" stroke-width="5"/><rect x="1660" y="620" width="200" height="220" fill="#fff" class="ink" stroke-width="5"/><rect x="1720" y="670" width="80" height="80" rx="8" fill="${mixHex("#C9D1DE", "#FFE14D", ramp(t, tHome + 0.5, tHome + 0.9))}" class="ink"/></g>`;
    }
    // --- le générateur : quatre bobines, un aimant qui tourne ---
    if (app > 0) {
      let g = `<circle cx="${GX}" cy="${GY}" r="280" fill="${C.side}" class="ink" stroke-width="5"/><circle cx="${GX}" cy="${GY}" r="206" fill="#FFF8EC" class="ink"/>`;
      for (let i = 0; i < 4; i++) {
        const ca = i * 90,
          x = GX + 242 * Math.cos(rad(ca)),
          y = GY + 242 * Math.sin(rad(ca));
        // une bobine s'allume quand un pôle de l'aimant passe devant elle
        const lit = gen * Math.pow(Math.abs(Math.cos(rad(a - ca))), 6);
        if (lit > 0.05)
          g += `<circle cx="${f2(x)}" cy="${f2(y)}" r="120" fill="url(#s5-glow)" opacity="${f2(lit)}"/>`;
        g += `<g transform="rotate(${ca} ${f2(x)} ${f2(y)})"><rect x="${f2(x - 34)}" y="${f2(y - 64)}" width="68" height="128" rx="16" fill="${mixHex("#EEF2F8", "#FFE14D", lit)}" class="ink"/>`;
        for (let k = -2; k <= 2; k++)
          g += `<path d="M${f2(x - 34)} ${f2(y + k * 22)} H${f2(x + 34)}" stroke="${C.ink}" stroke-width="3" opacity="0.45"/>`;
        g += `</g>`;
      }
      g += `<g transform="rotate(${f2(a)} ${GX} ${GY})"><circle cx="${GX}" cy="${GY}" r="130" fill="${C.blue}" class="ink" stroke-width="5"/><rect x="${GX - 172}" y="${GY - 50}" width="344" height="100" rx="22" fill="${SOUTH}" class="ink" stroke-width="5"/><path d="M${GX} ${GY - 50} H${GX + 150} a22 22 0 0 1 22 22 V${GY + 28} a22 22 0 0 1 -22 22 H${GX} Z" fill="${RED}" class="ink" stroke-width="5"/>${txt(GX + 106, GY + 20, "N", 56, { fill: "#fff", w: 700 })}${txt(GX - 106, GY + 20, "S", 56, { w: 700 })}</g><circle cx="${GX}" cy="${GY}" r="28" fill="${C.blueD}" class="ink"/>`;
      s += `<g opacity="${f2(app)}">${g}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  const lab = {
    coil: label("s5", "s5-l-coil", [GX + 150, GY + 200], [1250, 800], "Des bobines de fil", null),
    mag: label("s5", "s5-l-mag", [GX - 110, GY + 60], [560, 860], "Un aimant", "qui tourne", {
      color: "#C2334C",
      align: "r",
    }),
  };
  showLabel(lab.mag, cue("s5-3", "aimants") - 0.2);
  showLabel(lab.coil, cue("s5-3", "bobines") - 0.2);
  pop("#s5-n1", cue("s5-3", "fabrique") - 0.3);
  hideLabel(lab.coil.concat(lab.mag), tWind - 0.2);
  show("#s5-c1", tWind + 0.3);
  show("#s5-c2", cue("s5-4", "eau") - 0.2);
  show("#s5-c3", cue("s5-4", "vapeur") - 0.2);
})();
