// ---------- Scène 3 : la poussière cache le Soleil ; sans lumière, les plantes meurent, puis toute la chaîne s'écroule ----------
(() => {
  const tPo = cue("s3-1", "poussière") - 0.6,
    tCa = cue("s3-1", "caché") - 0.5,
    tSa = cue("s3-2", "sans") - 0.4,
    tPl = cue("s3-3", "plantes") - 0.5,
    tM1 = cue("s3-3", "mangent") - 0.6,
    tM2 = cue("s3-3", "mangent", 1) - 0.6,
    tDo = cue("s3-4", "dominos") - 0.6;
  onDraw("s3", (t) => {
    const dark = ramp(t, tPo, tCa + 1.0),
      ch = ramp(t, tSa, tSa + 0.5);
    let s =
      dinoLandSVG(t, dark * 0.9, "s3") +
      `<g opacity="${f2(1 - 0.9 * dark)}">${sunSVG(1500, 330, 90, t)}</g>`;
    // le nuage de poussière qui monte et s'étale
    s += `<clipPath id="s3-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s3-k)">`;
    for (let i = 0; i < 22; i++) {
      const k = ramp(t, tPo + i * 0.06, tPo + 1.2 + i * 0.06);
      if (k > 0)
        s += `<circle cx="${f2(200 + ((i * 83) % 1560) + 30 * Math.sin(t * 0.7 + i))}" cy="${f2(lerp(700, 250 + 120 * rnd(i), k))}" r="${f2(80 + 60 * rnd(i + 3))}" fill="#6B6470" opacity="${f2(0.55 * k * (1 - 0.5 * ch))}"/>`;
    }
    s += `</g>`;
    // la chaîne : la plante, le mangeur de plantes, le mangeur de viande ; ils tombent l'un après l'autre
    if (ch > 0) {
      const F = [tPl, tM1, tM2].map((x) => ramp(t, x, x + 0.6)),
        X = [520, 960, 1400];
      let g = `<rect x="280" y="330" width="1360" height="400" rx="30" fill="#FFF8EC" class="ink" stroke-width="5"/>`;
      g += arrowSVG(660, 530, 780, 530, C.ink, 12) + arrowSVG(1120, 530, 1240, 530, C.ink, 12);
      const fall = (i, inner) =>
        `<g transform="rotate(${f2(80 * F[i] * F[i])} ${X[i] + 60} 650)" opacity="${f2(1 - 0.55 * F[i])}">${inner}</g>`;
      g +=
        fall(
          0,
          `<g transform="translate(${X[0]} 640)"><path d="M0 0 V-120" stroke="#2E9E6B" stroke-width="14" stroke-linecap="round"/><path d="M0 -60 Q-70 -80 -80 -140 Q-20 -130 0 -70 M0 -90 Q70 -110 80 -170 Q20 -160 0 -100" fill="#5BE39A" class="ink" stroke-width="4" stroke-linejoin="round"/></g>`,
        ) +
        fall(1, sauroSVG(X[1], 580, 0.55, 4 * Math.sin(t * 2))) +
        fall(2, trexSVG(X[2] - 20, 590, 0.6, 8));
      ["les plantes", "ceux qui les mangent", "ceux qui mangent ceux-là"].forEach(
        (l, i) => (g += txt(X[i], 400, l, 36, { w: 700, fill: F[i] > 0.5 ? "#B02A45" : C.ink })),
      );
      if (t > tDo)
        for (let i = 0; i < 7; i++) {
          const k = ramp(t, tDo + i * 0.12, tDo + 0.3 + i * 0.12);
          g += `<rect x="${700 + i * 80}" y="640" width="22" height="70" rx="5" fill="${C.ink}" transform="rotate(${f2(62 * k)} ${722 + i * 80} 710)"/>`;
        }
      s += `<g opacity="${f2(ch)}">${g}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tCa + 0.6);
  pop("#s3-n2", tM2 + 0.8);
})();
