// ---------- Scène 2 : ruisseaux, rivières, fleuves : le sel voyage jusqu'à la mer (mais on ne le sent pas) ----------
(() => {
  const T = [
      cue("s2-2", "ruisseaux"),
      cue("s2-2", "rivières"),
      cue("s2-2", "fleuves"),
      cue("s2-2", "mer"),
    ].map((x) => x - 0.4),
    tB = cue("s2-4", "pincée") - 0.6;
  const P = [
    [330, 380],
    [520, 560],
    [760, 600],
    [980, 720],
    [1250, 740],
    [1420, 800],
  ];
  const at = (u) => {
    const f = u * (P.length - 1),
      i = Math.min(P.length - 2, Math.floor(f)),
      k = f - i;
    return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k)];
  };
  onDraw("s2", (t) => {
    const b = ramp(t, tB, tB + 0.5);
    let g =
      `<path d="M130 850 Q700 700 1400 800 V900 H130 Z" fill="#CFE8B8" class="ink" stroke-width="5"/>` +
      mountSVG(330, 230, 460, 800) +
      seaSVG(1400, 1790, 780, 900, t);
    // le cours d'eau s'élargit en descendant
    const reach = [0.25, 0.55, 0.85, 1].reduce(
      (a, lim, i) => Math.max(a, lim * ramp(t, T[i], T[i] + 0.6)),
      0.08,
    );
    let d = "";
    for (let i = 0; i <= 40; i++) {
      const u = (i / 40) * reach,
        [x, y] = at(u);
      d += (i ? "L" : "M") + f2(x) + " " + f2(y);
    }
    g += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#5FB4F0" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>`;
    for (let i = 0; i < 9; i++) {
      const u = ((t * 0.12 + i / 9) % 1) * reach,
        [x, y] = at(u);
      g += saltSVG(x + 6 * Math.sin(t * 3 + i), y, 7, t * 90 + i * 40);
    }
    let s = `<g opacity="${f2(1 - 0.75 * b)}">${g}</g>`;
    // la baignoire et sa pincée de sel
    if (b > 0) {
      let h = `<path d="M1090 420 H1710 V560 Q1710 660 1610 660 H1190 Q1090 660 1090 560 Z" fill="#fff" class="ink" stroke-width="6"/><path d="M1110 450 H1690 V560 Q1690 640 1610 640 H1190 Q1110 640 1110 560 Z" fill="#8FD3FF"/><path d="M1110 ${f2(452 + 4 * Math.sin(t * 3))} q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 q10 -4 20 0" fill="none" stroke="#fff" stroke-width="6"/><path d="M1190 660 v40 M1610 660 v40" class="ink" stroke-width="14"/>`;
      h += `<g transform="translate(1400 ${f2(250 + 8 * Math.sin(t * 4))})"><path d="M-40 -60 Q-10 -20 0 20 Q10 -20 40 -60" fill="#FFD9B8" class="ink" stroke-width="5"/></g>`;
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.9 + i / 4) % 1;
        h += saltSVG(1392 + i * 6, 280 + u * 160, 5, u * 300, 1 - u * 0.6);
      }
      s += `<g opacity="${f2(b)}" transform="translate(0 ${f2(30 * (1 - b))})">${h}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  const L = [
    label("s2", "s2-l0", [470, 510], [640, 330], "Les ruisseaux", ""),
    label("s2", "s2-l1", [800, 620], [900, 440], "Les rivières", ""),
    label("s2", "s2-l2", [1200, 738], [1180, 560], "Les fleuves", ""),
  ];
  L.forEach((l, i) => {
    showLabel(l, T[i] + 0.3);
    hideLabel(l, tB - 0.2);
  });
  show("#s2-n1", tB + 0.5);
})();
