// ---------- Scène 5 : la lave refroidit en roche neuve : un volcan sous-marin devient une île ----------
(() => {
  const tR = cue("s5-2", "refroidissant") - 0.5,
    tI = cue("s5-2", "îles") - 0.8,
    tFe = cue("s5-2", "fertile") - 1.0;
  onDraw("s5", (t) => {
    const grow = ramp(t, tR, tI + 2.2),
      fe = ramp(t, tFe, tFe + 1.0);
    const top = lerp(800, 380, grow),
      X = 960;
    let s =
      sunSVG(1560, 290, 70, t) + `<rect x="130" y="560" width="1660" height="290" fill="#5FB4F0"/>`;
    // le volcan grandit couche après couche, du fond de la mer jusqu'à l'air libre
    s += `<path d="M${f2(X - (850 - top) * 1.3)} 850 L${X - 50} ${f2(top)} H${X + 50} L${f2(X + (850 - top) * 1.3)} 850 Z" fill="#6B5B4E" class="ink" stroke-width="6"/>`;
    for (let i = 1; i < 6; i++) {
      const y = 850 - i * 78;
      if (y > top + 20)
        s += `<path d="M${f2(X - (y - top) * 1.3 - 10)} ${y} Q${X} ${y - 16} ${f2(X + (y - top) * 1.3 + 10)} ${y}" fill="none" stroke="#4E4138" stroke-width="4"/>`;
    }
    if (grow < 1)
      s +=
        lavaSVG(X, top, t, 0.3 + 0.2 * Math.sin(t * 3), 8, 60) +
        `<path d="M${X - 50} ${f2(top)} H${X + 50} L${X + 66} ${f2(top + 30)} H${X - 66} Z" fill="#E0455E" class="ink" stroke-width="4"/>`;
    // la mer devant la partie immergée
    s += `<g opacity="0.55">${seaSVG(130, 1790, 560, 850, t)}</g><path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
    // les plantes arrivent sur les pentes
    if (fe > 0 && top < 560)
      for (let i = 0; i < 6; i++) {
        const yy = 420 + i * 22,
          xx = X + (i % 2 ? 1 : -1) * (80 + i * 26),
          k = clamp(fe * 6 - i);
        if (k > 0)
          s += `<g transform="translate(${xx} ${yy}) scale(${f2(k)})"><path d="M0 0 V-46" stroke="#3DBE8B" stroke-width="8" stroke-linecap="round"/><path d="M0 -40 q-34 -10 -40 -40 q34 0 40 40 Z M0 -30 q34 -10 40 -40 q-34 0 -40 40 Z" fill="#3DBE8B" class="ink" stroke-width="3"/></g>`;
      }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tR + 0.4);
  pop("#s5-n2", cue("s5-2", "Réunion") - 0.3);
})();
