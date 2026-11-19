// ---------- Scène 3 : le pollen touche les antennes, les sacs éclatent : l'histamine ----------
(() => {
  const tT = cue("s3-1", "touche") - 0.1,
    tB = cue("s3-1", "éclatent") - 0.2,
    tF = cue("s3-2", "histamine") - 0.4;
  const tN = cue("s3-3", "nez") - 0.3,
    tY = cue("s3-3", "yeux") - 0.3,
    tS = cue("s3-3", "éternuer") - 0.3;
  const MX = 560,
    MY = 540,
    MR = 190,
    FX = 1260,
    FY = 500;
  onDraw("s3", (t) => {
    const burst = ramp(t, tB, tB + 1.4);
    let s = mastSVG(MX, MY, MR, t, burst, 10, 1.3);
    // trois grains de pollen viennent toucher les antennes
    [150, 185, 222].forEach((deg, i) => {
      const a = rad(deg),
        u = ramp(t, tT - 2.0 + i * 0.15, tT + i * 0.1);
      const x1 = MX + (MR + 104) * Math.cos(a),
        y1 = MY + (MR + 104) * Math.sin(a);
      s += pollenSVG(lerp(-80, x1, u), lerp(y1 - 80 + i * 60, y1, u), 34, t * 0.3 + i);
    });
    // l'éclair au moment où ça éclate
    const fl = t - tB;
    if (fl > 0 && fl < 0.4)
      s += `<circle cx="${MX}" cy="${MY}" r="${f2(MR + fl * 500)}" fill="none" stroke="${C.fire}" stroke-width="14" opacity="${f2(1 - fl / 0.4)}"/>`;
    // le visage : nez qui coule, yeux qui grattent, éternuement
    const f = ramp(t, tF, tF + 0.5);
    if (f > 0) {
      const red = ramp(t, tY, tY + 0.5),
        sn = t > tS ? Math.exp(-(((t - tS) % 1.8) * 4)) : 0;
      let g = `<circle cx="${FX}" cy="${f2(FY + sn * 14)}" r="170" fill="#FFD9B8" class="ink" stroke-width="6"/>`;
      g += `<circle cx="${FX - 62}" cy="${FY - 30}" r="30" fill="${mixHex("#FFFFFF", "#F7A8B8", red)}" class="ink" stroke-width="4"/><circle cx="${FX + 62}" cy="${FY - 30}" r="30" fill="${mixHex("#FFFFFF", "#F7A8B8", red)}" class="ink" stroke-width="4"/><circle cx="${FX - 62}" cy="${FY - 26}" r="11" fill="${C.ink}"/><circle cx="${FX + 62}" cy="${FY - 26}" r="11" fill="${C.ink}"/>`;
      g += `<path d="M${FX - 14} ${FY + 34} Q${FX} ${FY + 60} ${FX + 14} ${FY + 34}" fill="#F3B48E" class="ink" stroke-width="5"/>`;
      g +=
        sn > 0.2
          ? `<ellipse cx="${FX}" cy="${FY + 104}" rx="34" ry="${f2(14 + sn * 24)}" fill="${C.ink}"/>`
          : `<path d="M${FX - 40} ${FY + 100} Q${FX} ${FY + 84} ${FX + 40} ${FY + 100}" fill="none" class="ink" stroke-width="7" stroke-linecap="round"/>`;
      if (t > tN) {
        const d = ((t - tN) * 0.7) % 1;
        g += `<path d="M${FX + 6} ${f2(FY + 64 + d * 60)} q-12 18 0 26 q12 -8 0 -26 Z" fill="${C.air}" class="ink" stroke-width="3" opacity="${f2(1 - d * 0.6)}"/>`;
      }
      if (sn > 0.05)
        for (let i = 0; i < 5; i++) {
          const a = rad(60 + i * 15);
          g += `<path d="M${f2(FX + (60 + (1 - sn) * 90) * Math.cos(a))} ${f2(FY + 110 + (60 + (1 - sn) * 90) * Math.sin(a))} l${f2(36 * Math.cos(a))} ${f2(36 * Math.sin(a))}" stroke="${C.air}" stroke-width="9" stroke-linecap="round" opacity="${f2(sn)}"/>`;
        }
      s += `<g opacity="${f2(f)}">${g}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  const lH = label(
    "s3",
    "s3-l-h",
    [MX + 250, MY - 170],
    [900, 200],
    "L’histamine",
    "le produit qui donne l’alerte",
  );
  showLabel(lH, cue("s3-1", "histamine") - 0.3);
  show("#s3-c1", tN + 0.2, { x: 30, y: 0 });
  show("#s3-c2", tY + 0.2, { x: 30, y: 0 });
  show("#s3-c3", tS + 0.2, { x: 30, y: 0 });
  show("#s3-n1", cue("s3-5", "innocent") - 0.6);
})();
