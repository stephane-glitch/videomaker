// ---------- Scène 1 : le soleil chauffe l'eau, elle s'évapore en vapeur invisible et monte ; la casserole ----------
(() => {
  const tEv = cue("s1-1", "évapore") - 0.5,
    tIn = cue("s1-1", "invisible") - 0.5,
    tMo = cue("s1-1", "monte") - 0.8,
    tCa = cue("s1-2", "casserole") - 0.8,
    tGo = cue("s1-3", "gouttelettes") - 0.6;
  onDraw("s1", (t) => {
    const ca = ramp(t, tCa, tCa + 0.5);
    let g = sunSVG(330, 290, 84 + 6 * Math.sin(t * 3), t) + seaSVG(130, 1790, 640, 850, t);
    // les rayons du soleil sur la mer
    for (let i = 0; i < 4; i++) {
      const u = (t * 0.5 + i / 4) % 1;
      g += `<path d="M${f2(410 + u * 300 + i * 40)} ${f2(360 + u * 240)} l30 24" stroke="${C.hot}" stroke-width="10" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
    }
    // la vapeur : des bulles en pointillés qui montent
    const ev = ramp(t, tEv, tEv + 0.5),
      up = 0.5 + 0.5 * ramp(t, tMo, tMo + 0.5);
    if (ev > 0)
      for (let i = 0; i < 12; i++) {
        const u = (t * 0.18 * up + rnd(i * 7)) % 1;
        g += vaporSVG(
          700 + i * 84 + 20 * Math.sin(t * 1.5 + i),
          620 - u * 420,
          20 + 6 * rnd(i),
          ev * Math.sin(u * Math.PI),
        );
      }
    let s = `<g opacity="${f2(1 - 0.85 * ca)}">${g}</g>`;
    // la casserole : au-dessus du bec, on ne voit rien ; plus haut, la vapeur refroidit en gouttelettes visibles
    if (ca > 0) {
      let c =
        `<rect x="560" y="610" width="460" height="60" rx="14" fill="#9AA6B8" class="ink" stroke-width="5"/><path d="M620 480 H960 V580 Q960 610 930 610 H650 Q620 610 620 580 Z" fill="#39425C" class="ink" stroke-width="6"/><path d="M960 520 H1100" class="ink" stroke-width="22" stroke-linecap="round"/><path d="M640 500 H940" stroke="#8FD3FF" stroke-width="14" stroke-linecap="round"/>` +
        flameSVG(700, 610, 50, t, { blue: true }) +
        flameSVG(790, 610, 50, t + 1, { blue: true }) +
        flameSVG(880, 610, 50, t + 2, { blue: true });
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.5 + i / 5) % 1;
        c += vaporSVG(700 + i * 50, 470 - u * 110, 16, Math.sin(u * Math.PI));
      }
      for (let i = 0; i < 40; i++) {
        const u = (t * 0.25 + rnd(i)) % 1;
        c += dropletSVG(
          660 + rnd(i + 40) * 280 + 30 * Math.sin(t + i),
          340 - u * 150,
          5,
          Math.sin(u * Math.PI),
        );
      }
      s += `<g opacity="${f2(ca)}">${c}</g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  const l = label("s1", "s1-l", [1040, 420], [1260, 300], "La vapeur d’eau", "un gaz invisible");
  showLabel(l, tIn + 0.2);
  hideLabel(l, tCa - 0.2);
  const l2 = label("s1", "s1-l2", [800, 250], [1180, 240], "Des gouttelettes", "ça, on le voit");
  const l3 = label(
    "s1",
    "s1-l3",
    [860, 430],
    [1180, 440],
    "La vraie vapeur",
    "invisible, juste au-dessus de l’eau",
  );
  showLabel(l2, tGo + 0.2);
  showLabel(l3, tGo + 1.4);
  show("#s1-n1", tGo + 0.6);
})();
