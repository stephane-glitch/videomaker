// ---------- Scène 2 : serrés au bout des doigts, espacés dans le dos ; le test des deux pointes ; le braille ----------
(() => {
  const tD = cue("s2-2", "doigts") - 0.6,
    tDo = cue("s2-2", "dos") - 0.6,
    tT = cue("s2-3", "test") - 0.3,
    t2 = cue("s2-3", "deux") - 0.3,
    tB = cue("s2-3", "dos") - 0.3,
    tL = cue("s2-4", "lunettes") - 0.5,
    tBr = cue("s2-5", "braille") - 0.6;
  const panel = (x, k, title, dots, t, tips, lit) => {
    if (k <= 0) return "";
    let g = `<rect x="${x}" y="300" width="640" height="440" rx="34" fill="#FFD9B8" class="ink" stroke-width="5"/>${txt(x + 320, 270, title, 44, { w: 700 })}`;
    dots.forEach(
      ([dx, dy], i) =>
        (g += `<circle cx="${x + dx}" cy="${300 + dy}" r="${f2(15 + (lit.includes(i) ? 6 * Math.abs(Math.sin(t * 10)) : 0))}" fill="${lit.includes(i) ? C.spark : C.blue}" stroke="${C.ink}" stroke-width="3"/>`),
    );
    if (tips > 0)
      [-34, 34].forEach(
        (dx) =>
          (g += `<g transform="translate(${x + 320 + dx} ${f2(lerp(120, 500, tips))})"><path d="M-14 -200 H14 V-30 L0 0 L-14 -30 Z" fill="${C.hot}" class="ink" stroke-width="4"/><path d="M-6 -14 L0 0 L6 -14 Z" fill="${C.ink}"/></g>`),
      );
    return `<g opacity="${f2(k)}" transform="translate(0 ${f2(30 * (1 - k))})">${g}</g>`;
  };
  const DENSE = [],
    SPARSE = [
      [120, 110],
      [520, 150],
      [320, 250],
      [150, 350],
      [540, 370],
    ];
  for (let j = 0; j < 5; j++)
    for (let i = 0; i < 9; i++) DENSE.push([56 + i * 66 + (j % 2) * 30, 60 + j * 80]);
  onDraw("s2", (t) => {
    const br = ramp(t, tBr, tBr + 0.5);
    const tipsF = ramp(t, t2, t2 + 0.5),
      tipsB = ramp(t, tB, tB + 0.5);
    let g = panel(
      180,
      ramp(t, tD, tD + 0.4),
      "Au bout du doigt",
      DENSE,
      t,
      t > tT ? tipsF : 0,
      tipsF >= 1 ? [21, 22] : [],
    );
    g += panel(
      1100,
      ramp(t, tDo, tDo + 0.4),
      "Dans le dos",
      SPARSE,
      t,
      tipsB,
      tipsB >= 1 ? [2] : [],
    );
    if (tipsF >= 1) g += txt(500, 820, "2 points", 60, { w: 700, fill: "#C25E00" });
    if (tipsB >= 1) g += txt(1420, 820, "1 seul point", 60, { w: 700, fill: C.blue });
    // les lunettes sur le doigt
    const lu = ramp(t, tL, tL + 0.35);
    if (lu > 0)
      g += `<g opacity="${f2(lu * (1 - br))}" transform="translate(500 ${f2(520 - 60 * (1 - lu))}) rotate(-4)"><circle cx="-80" cy="0" r="60" fill="#fff" fill-opacity="0.5" class="ink" stroke-width="9"/><circle cx="80" cy="0" r="60" fill="#fff" fill-opacity="0.5" class="ink" stroke-width="9"/><path d="M-20 0 H20 M-140 0 L-200 -30 M140 0 L200 -30" class="ink" stroke-width="9" stroke-linecap="round"/></g>`;
    let s = `<g opacity="${f2(1 - br)}">${g}</g>`;
    // le braille : un doigt glisse sur des points en relief
    if (br > 0) {
      let b = `<rect x="330" y="420" width="1260" height="260" rx="24" fill="#fff" class="ink" stroke-width="5"/>`;
      const PAT = [
        [1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0],
        [1, 0, 0, 1, 0, 0],
        [1, 0, 0, 1, 1, 0],
        [1, 0, 0, 0, 1, 0],
        [1, 1, 0, 1, 0, 0],
        [1, 1, 0, 1, 1, 0],
        [1, 1, 0, 0, 1, 0],
      ];
      const fx = 420 + (((t - tBr) * 190) % 1100);
      PAT.forEach((p, c) =>
        p.forEach((on, j) => {
          const x = 420 + c * 150 + Math.floor(j / 3) * 44,
            y = 490 + (j % 3) * 50;
          b += `<circle cx="${x}" cy="${y}" r="${on ? 15 : 6}" fill="${on ? (Math.abs(x - fx) < 60 ? C.spark : C.ink) : "#D3DAE6"}"/>`;
        }),
      );
      b += `<g transform="translate(${f2(fx)} 560)"><path d="M-44 300 V40 Q-44 -30 0 -30 Q44 -30 44 40 V300 Z" fill="#FFD9B8" class="ink" stroke-width="5"/><path d="M-26 6 Q0 -18 26 6" fill="none" stroke="#F3B48E" stroke-width="6"/></g>`;
      s += `<g opacity="${f2(br)}">${b}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", t2 + 0.6);
  show("#s2-n2", tB + 0.6);
  tl.to(["#s2-n1", "#s2-n2"], { opacity: 0, duration: 0.3 }, tBr - 0.1);
})();
