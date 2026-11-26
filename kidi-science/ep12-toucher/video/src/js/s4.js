// ---------- Scène 4 : l'expérience des trois bols : la peau sent les changements, pas la température ----------
(() => {
  const tH = cue("s4-2", "chaude") - 0.6,
    tC = cue("s4-2", "froide") - 0.6,
    tT = cue("s4-2", "tiède") - 1.0,
    tF = cue("s4-3", "froid") - 0.4,
    tCh = cue("s4-3", "chaud") - 0.4;
  const bowl = (x, col, lab) =>
    `<path d="M${x - 190} 620 H${x + 190} Q${x + 180} 800 ${x} 800 Q${x - 180} 800 ${x - 190} 620 Z" fill="#fff" class="ink" stroke-width="6"/><path d="M${x - 172} 650 H${x + 172} Q${x + 160} 782 ${x} 782 Q${x - 160} 782 ${x - 172} 650 Z" fill="${col}"/>${txt(x, 850, lab, 36, { w: 700 })}`;
  onDraw("s4", (t) => {
    let s =
      bowl(380, "#F7A8A0", "Eau chaude") +
      bowl(960, "#D9C9E8", "Eau tiède") +
      bowl(1540, "#8FD3FF", "Eau froide");
    s +=
      [0, 1]
        .map(
          (i) =>
            `<path d="M${320 + i * 110} ${f2(600 - ((t * 40 + i * 30) % 70))} q14 -14 0 -28 q-14 -14 0 -28" fill="none" stroke="${C.fire}" stroke-width="8" stroke-linecap="round"/>`,
        )
        .join("") +
      `<rect x="1470" y="${f2(640 + 4 * Math.sin(t * 2))}" width="60" height="60" rx="10" fill="#fff" class="ink" stroke-width="4" transform="rotate(12 1500 670)"/>`;
    // les deux mains : d'abord chacune dans son bol, puis toutes les deux dans l'eau tiède
    const inH = ramp(t, tH, tH + 0.5),
      inC = ramp(t, tC, tC + 0.5),
      mid = ramp(t, tT, tT + 0.7);
    const x1 = lerp(380, 890, mid),
      x2 = lerp(1540, 1030, mid),
      hop = 150 * Math.sin(mid * Math.PI);
    s +=
      handSVG(x1 - 30, lerp(300, 470, inH) - hop, 0.75, 180) +
      handSVG(x2 - 30, lerp(300, 470, inC) - hop, 0.75, 180);
    // ce que dit chaque main
    const a = ramp(t, tF, tF + 0.3),
      b = ramp(t, tCh, tCh + 0.3);
    if (a > 0)
      s += `<g transform="translate(700 ${f2(330 + 8 * Math.sin(t * 5))}) rotate(-6) scale(${f2(a)})">${txt(0, 0, "C’est froid !", 70, { w: 700, fill: C.blue })}</g>`;
    if (b > 0)
      s += `<g transform="translate(1230 ${f2(330 + 8 * Math.cos(t * 5))}) rotate(6) scale(${f2(b)})">${txt(0, 0, "C’est chaud !", 70, { w: 700, fill: "#C25E00" })}</g>`;
    $("#s4-draw").innerHTML = s;
  });
  pop("#s4-n1", cue("s4-4", "compare") - 0.4);
})();
