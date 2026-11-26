// ---------- Scène 1 : une odeur, ce sont des molécules qui s'envolent ; (et la poubelle, n'en parlons pas) ----------
(() => {
  const tM = cue("s1-1", "molécules") - 0.4,
    tH = cue("s1-1", "chauffe") - 0.4,
    tN = cue("s1-2", "nez") - 2.0,
    tP = cue("s1-4", "poubelle") - 0.6,
    tX = cue("s1-5", "crêpes") - 0.6;
  onDraw("s1", (t) => {
    let s = `<path d="M130 850 H1790" class="ink" stroke-width="6"/><rect x="240" y="770" width="420" height="80" rx="10" fill="#9AA6B8" class="ink" stroke-width="5"/><path d="M280 736 H620 V760 Q620 770 610 770 H290 Q280 770 280 760 Z" fill="#39425C" class="ink" stroke-width="5"/><path d="M620 750 H770" class="ink" stroke-width="22" stroke-linecap="round"/><ellipse cx="450" cy="726" rx="150" ry="20" fill="#EBC07E" class="ink" stroke-width="5"/>`;
    const heat = ramp(t, tH, tH + 0.5);
    for (let i = 0; i < 3; i++) {
      const u = (t * 0.8 + i / 3) % 1;
      s += `<path d="M${330 + i * 120} ${f2(700 - u * 70)} q14 -14 0 -28 q-14 -14 0 -28" fill="none" stroke="${C.fire}" stroke-width="8" stroke-linecap="round" opacity="${f2((0.3 + 0.7 * heat) * (1 - u))}"/>`;
    }
    // les molécules s'envolent ; plus tard, elles filent vers le nez
    const nose = ramp(t, tN, tN + 0.6),
      n = Math.round(6 + 16 * heat);
    for (let i = 0; i < n; i++) {
      const u = (t * 0.2 + rnd(i)) % 1,
        x0 = 330 + rnd(i + 20) * 240,
        fx = x0 + (rnd(i + 5) - 0.3) * 500 * u,
        fy = 700 - u * 460;
      const x = lerp(fx, lerp(x0, 1290, u), nose),
        y = lerp(fy, lerp(700, 560, u) - 140 * Math.sin(u * Math.PI), nose);
      s += molSVG(x, y, 9, C.fire, t * 50 + i * 30, Math.min(1, u * 6) * Math.min(1, (1 - u) * 5));
    }
    // la loupe : une molécule vue de très près
    const z = ramp(t, tM, tM + 0.4) * (1 - ramp(t, tN - 0.3, tN));
    if (z > 0)
      s += `<g opacity="${f2(z)}" transform="translate(${f2(30 * (1 - z))} 0)"><circle cx="1180" cy="420" r="170" fill="#fff" class="ink" stroke-width="8"/><path d="M1300 540 L1400 640" class="ink" stroke-width="30" stroke-linecap="round"/>${molSVG(1180, 440, 60, C.fire, 12 * Math.sin(t * 2))}</g>`;
    // le nez qui reçoit l'odeur
    if (nose > 0)
      s += `<g opacity="${f2(nose)}"><path d="M1560 300 C 1400 380, 1260 520, 1300 600 C 1320 640, 1400 640, 1440 620 C 1470 680, 1560 700, 1640 680 V300 Z" fill="#FFD9B8" class="ink" stroke-width="6"/><ellipse cx="1370" cy="596" rx="34" ry="16" fill="${C.ink}"/></g>`;
    // la poubelle
    const p = ramp(t, tP, tP + 0.4) * (1 - ramp(t, tX, tX + 0.5));
    if (p > 0) {
      let g = `<path d="M-90 -160 H90 L70 0 H-70 Z" fill="#3DBE8B" class="ink" stroke-width="5"/><rect x="-104" y="-190" width="208" height="34" rx="12" fill="#2E9A6E" class="ink" stroke-width="5"/><path d="M-30 -130 V-30 M30 -130 V-30" class="ink" stroke-width="5"/>`;
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.5 + i / 5) % 1;
        g += molSVG(
          -60 + i * 30 + 16 * Math.sin(t * 3 + i),
          -200 - u * 170,
          9,
          "#B7DB8A",
          t * 40 + i * 50,
          1 - u,
        );
      }
      s += `<g transform="translate(980 ${f2(848 + 260 * (1 - p))})">${g}</g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  const l = label(
    "s1",
    "s1-l",
    [1230, 410],
    [1380, 250],
    "Une molécule",
    "bien trop petite pour être vue",
  );
  showLabel(l, tM + 0.3);
  hideLabel(l, tN - 0.4);
  show("#s1-n1", cue("s1-2", "nez") - 0.8);
})();
