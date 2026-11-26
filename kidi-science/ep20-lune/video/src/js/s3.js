// ---------- Scène 3 : la Lune est une menteuse : en C elle décroît, en D elle croît ----------
(() => {
  const tMe = cue("s3-2", "menteuse") - 0.5,
    tC = cue("s3-2", "dessine") - 0.4,
    tD = cue("s3-2", "dessine", 1) - 0.4;
  onDraw("s3", (t) => {
    let s = nightSkySVG(130, 190, 1660, 660, t);
    const c = ramp(t, tC, tC + 0.4),
      d = ramp(t, tD, tD + 0.4),
      q = 1 - ramp(t, tC - 0.3, tC);
    // la question : elle grossit ou elle rétrécit ?
    if (q > 0)
      s += `<g opacity="${f2(q)}">${phaseMoonSVG(960, 520, 170, 0.5 + 0.35 * Math.sin(t * 0.9))}${txt(1240, 560, "?", 200, { w: 700, fill: C.hot })}</g>`;
    // le C : éclairée à gauche, elle Décroît
    if (c > 0)
      s += `<g opacity="${f2(c)}" transform="translate(0 ${f2(30 * (1 - c))})">${phaseMoonSVG(560, 480, 170, 0.86)}${txt(300, 570, "C", 260, { w: 700, fill: C.fire, op: 0.9 })}${txt(560, 760, "elle décroît", 60, { w: 700, fill: "#fff" })}</g>`;
    // le D : éclairée à droite, elle Croît
    if (d > 0)
      s += `<g opacity="${f2(d)}" transform="translate(0 ${f2(30 * (1 - d))})">${phaseMoonSVG(1360, 480, 170, 0.3)}${txt(1100, 570, "D", 260, { w: 700, fill: C.fire, op: 0.9 })}${txt(1360, 760, "elle croît", 60, { w: 700, fill: "#fff" })}</g>`;
    const m = ramp(t, tMe, tMe + 0.3) * (1 - ramp(t, tC - 0.3, tC));
    if (m > 0)
      s += `<g transform="translate(960 280) rotate(-4) scale(${f2(m)})">${txt(0, 0, "Menteuse !", 80, { w: 700, fill: C.hot })}</g>`;
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", cue("s3-4", "nord") - 0.8);
})();
