// ---------- Scène 0 : un nuage plus lourd qu'un troupeau d'éléphants… fait de milliards de gouttelettes éparpillées ----------
(() => {
  const tE = cue("s0-1", "éléphants") - 0.8,
    tB = cue("s0-2", "bloc") - 0.5,
    tG = cue("s0-2", "gouttelettes") - 0.8;
  onDraw("s0", (t) => {
    const g = ramp(t, tG, tG + 1.2),
      el = ramp(t, tE, tE + 0.5) * (1 - ramp(t, tB, tB + 0.5));
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` + figSVG(360, 848, 1.6, C.blue);
    // le nuage entier, puis ce qu'il est vraiment : une poussière de gouttelettes
    if (g < 1)
      s += `<g opacity="${f2(1 - g)}">${cloudSVG(900 + 16 * Math.sin(t * 0.6), 360, 2.2)}</g>`;
    if (g > 0)
      for (let i = 0; i < 260; i++) {
        const a = rnd(i) * TAU,
          d = Math.sqrt(rnd(i + 300)) * (300 + 120 * g);
        s += dropletSVG(
          900 + d * 1.4 * Math.cos(a) + 6 * Math.sin(t * 2 + i),
          360 + d * 0.5 * Math.sin(a) + 5 * Math.cos(t * 1.7 + i),
          4 + 3 * rnd(i + 9),
          g,
        );
      }
    // la balance imaginaire : autant qu'un troupeau d'éléphants
    if (el > 0)
      s += `<g opacity="${f2(el)}">${elephSVG(1380, 720, 0.8)}${elephSVG(1560, 750, 0.6)}${elephSVG(1240, 760, 0.55)}${txt(1400, 600, "aussi lourd !", 48, { w: 700, fill: "#C25E00" })}</g>`;
    $("#s0-draw").innerHTML = s;
  });
  pop("#s0-n1", tG + 0.9);
})();
