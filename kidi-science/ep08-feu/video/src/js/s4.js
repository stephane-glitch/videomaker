// ---------- Scène 4 : la bûche devient des gaz invisibles et un peu de cendre ; elle sort par la cheminée ----------
(() => {
  const S = scn("s4");
  const tV = cue("s4-2", "vapeur") - 0.4,
    tG = cue("s4-2", "carbonique") - 0.6,
    tA = cue("s4-2", "cendre") - 0.5,
    tH = cue("s4-3", "cheminée") - 0.8,
    tN = cue("s4-3", "Noël") - 0.5;
  const X = 560,
    Y = 760;
  const bubble = (x, y, r, col, lab, op) =>
    `<g opacity="${f2(op)}"><circle cx="${f2(x)}" cy="${f2(y)}" r="${r}" fill="${col}" fill-opacity="0.35" stroke="${C.ink}" stroke-width="3.5" stroke-dasharray="10 8"/>${txt(x, y + 10, lab, 28)}</g>`;
  onDraw("s4", (t) => {
    const burn = ramp(t, S.start + 0.3, tA + 1.5),
      hs = ramp(t, tH, tH + 0.6);
    let g = `<path d="M130 850 H1100" class="ink" stroke-width="6"/><path d="M${X - 260} 850 v-40 M${X + 260} 850 v-40" class="ink" stroke-width="12"/><path d="M${X - 300} 808 H${X + 300}" class="ink" stroke-width="10"/>`;
    // la bûche rétrécit, le tas de cendre grandit
    const L = lerp(460, 150, burn),
      e = lerp(120, 44, burn);
    g += `<path d="M${X - 200} 804 Q${X} ${f2(804 - 70 * burn)} ${X + 200} 804 Z" fill="#C8CDD6" class="ink" stroke-width="4"/>`;
    if (burn < 0.98)
      g +=
        logSVG(X, Y - 20 + 36 * burn, L, e) +
        flameSVG(X - L * 0.2, Y - 60 + 40 * burn, 250 * (1 - 0.7 * burn), t) +
        flameSVG(X + L * 0.18, Y - 60 + 40 * burn, 200 * (1 - 0.7 * burn), t + 1.3);
    // les gaz invisibles qui montent
    for (let i = 0; i < 6; i++) {
      const water = i % 2 === 0,
        t0 = water ? tV : tG;
      if (t < t0) continue;
      const u = ((t - t0) * 0.16 + i * 0.17) % 1,
        x = X - 160 + i * 64 + 26 * Math.sin(u * 6 + i),
        y = Y - 180 - u * 440;
      g += bubble(
        x,
        y,
        58,
        water ? C.air : C.smoke,
        water ? "eau" : "CO₂",
        Math.sin(u * Math.PI) * (1 - hs * 0.2),
      );
    }
    let s = `<g transform="translate(${f2(-150 * hs)} 0)">${g}</g>`;
    // la maison : tout sort par la cheminée… et le père Noël fait le chemin inverse
    if (hs > 0) {
      let h = `<path d="M1180 850 V560 L1450 380 L1720 560 V850 Z" fill="#fff" class="ink" stroke-width="5"/><path d="M1130 590 L1450 360 L1770 590" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/><path d="M1130 590 L1450 360 L1770 590" fill="none" stroke="#E0455E" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><rect x="1590" y="340" width="80" height="170" fill="#E0455E" class="ink" stroke-width="5"/><rect x="1390" y="660" width="120" height="190" rx="12" fill="${C.blue}" class="ink" stroke-width="5"/>`;
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.3 + i / 5) % 1;
        h += bubble(
          1630 + 30 * Math.sin(u * 6 + i),
          330 - u * 200,
          26 + u * 16,
          i % 2 ? C.smoke : C.air,
          "",
          1 - u,
        );
      }
      const n = ramp(t, tN, tN + 1.2);
      if (n > 0 && n < 1)
        h += `<g transform="translate(1630 ${f2(lerp(40, 330, n))}) rotate(${f2(-20 + 30 * Math.sin(n * 9))})"><path d="M-40 30 L0 -60 L40 30 Z" fill="#E0455E" class="ink" stroke-width="4"/><rect x="-48" y="22" width="96" height="22" rx="11" fill="#fff" class="ink" stroke-width="4"/><circle cx="0" cy="-64" r="14" fill="#fff" class="ink" stroke-width="4"/></g>`;
      s += `<g opacity="${f2(hs)}">${h}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  const lA = label(
    "s4",
    "s4-l-a",
    [X + 60, 790],
    [1000, 700],
    "La cendre",
    "ce qui ne peut pas brûler",
  );
  showLabel(lA, tA + 0.2);
  hideLabel(lA, tH - 0.2);
  const lV = label("s4", "s4-l-v", [X - 150, 470], [150, 600], "Vapeur d’eau", "invisible");
  const lG = label(
    "s4",
    "s4-l-g",
    [X + 170, 430],
    [1000, 480],
    "Gaz carbonique",
    "invisible lui aussi",
  );
  showLabel(lV, tV + 0.3);
  showLabel(lG, tG + 0.4);
  [lV, lG].forEach((l) => hideLabel(l, tH - 0.2));
  show("#s4-n1", tH + 0.4);
})();
