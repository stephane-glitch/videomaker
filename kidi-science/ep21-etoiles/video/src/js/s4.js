// ---------- Scène 4 : la couleur dit la température : bleue très chaude, rouge moins chaude (le contraire des robinets) ----------
(() => {
  const tCo = cue("s4-1", "couleur") - 0.6,
    tBl = cue("s4-1", "bleues") - 0.5,
    tRo = cue("s4-1", "rouges") - 0.5,
    tRb = cue("s4-2", "robinets") - 0.6,
    tJa = cue("s4-3", "jaune") - 0.5;
  const tap = (x, y, col, lab) =>
    `<g transform="translate(${x} ${y})"><path d="M-50 0 H20 Q50 0 50 30 V50 H26 V34 Q26 24 16 24 H-50 Z" fill="#D3DAE6" class="ink" stroke-width="4"/><rect x="-22" y="-34" width="14" height="34" fill="#D3DAE6" class="ink" stroke-width="4"/><circle cx="-15" cy="-44" r="20" fill="${col}" class="ink" stroke-width="4"/>${txt(0, 100, lab, 34, { w: 700, fill: "#fff" })}</g>`;
  onDraw("s4", (t) => {
    const co = ramp(t, tCo, tCo + 0.5),
      bl = ramp(t, tBl, tBl + 0.3),
      ro = ramp(t, tRo, tRo + 0.3),
      rb = ramp(t, tRb, tRb + 0.4) * (1 - ramp(t, tJa - 0.3, tJa)),
      ja = ramp(t, tJa, tJa + 0.3);
    let s = nightSkySVG(130, 190, 1660, 660, t, 26);
    const X = [520, 960, 1400],
      COL = ["#8FB8FF", "#FFD23D", "#FF7A5C"],
      HOT = ["#C9DCFF", "#FF9A3D", "#D9452E"],
      R = [130, 110, 95];
    X.forEach((x, i) => {
      const k = i === 1 ? 0.5 + 0.5 * ja : co;
      s += `<g opacity="${f2(0.25 + 0.75 * k)}" transform="translate(${x} ${f2(470 + 8 * Math.sin(t * 1.5 + i))})">${gasBallSVG(0, 0, R[i], t + i * 3, COL[i], HOT[i])}</g>`;
    });
    if (bl > 0) s += txt(520, 700, "la plus chaude", 46, { w: 700, fill: "#C9DCFF", op: bl });
    if (ro > 0) s += txt(1400, 700, "la moins chaude", 46, { w: 700, fill: "#FFB8A0", op: ro });
    if (ja > 0) s += txt(960, 700, "notre Soleil", 46, { w: 700, fill: "#FFE28A", op: ja });
    // les robinets : rouge = chaud, bleu = froid… ici c'est l'inverse
    if (rb > 0)
      s += `<g opacity="${f2(rb)}" transform="translate(0 ${f2(20 * (1 - rb))})">${tap(880, 280, "#E0455E", "chaud")}${tap(1060, 280, "#3D7BFF", "froid")}<path d="M800 220 L1140 400 M1140 220 L800 400" stroke="#E0455E" stroke-width="14" stroke-linecap="round" opacity="0.9"/></g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tRo + 0.5);
})();
