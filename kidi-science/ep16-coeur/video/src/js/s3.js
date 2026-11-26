// ---------- Scène 3 : artères, veines, capillaires ; et le sang n'est jamais bleu ----------
(() => {
  const tA = cue("s3-2", "artères") - 0.5,
    tV = cue("s3-2", "veines") - 0.5,
    tC = cue("s3-2", "capillaires") - 1.6,
    tB = cue("s3-3", "bleues") - 0.6,
    tR = cue("s3-4", "rouge") - 0.6;
  const ART = [
      [380, 420],
      [700, 420],
      [980, 420],
      [1180, 420],
    ],
    VEI = [
      [1180, 680],
      [980, 680],
      [700, 680],
      [380, 680],
    ];
  onDraw("s3", (t) => {
    const a = ramp(t, tA, tA + 0.7),
      v = ramp(t, tV, tV + 0.7),
      c = ramp(t, tC, tC + 0.8),
      red = ramp(t, tR, tR + 0.6),
      b = beatAt(t, 80);
    let s = heartSVG(260, 550, 1.0 * (1 + 0.08 * b));
    // un muscle à nourrir, au bout
    s += `<g opacity="${f2(c)}"><rect x="1240" y="330" width="420" height="440" rx="60" fill="#F7B9B0" class="ink" stroke-width="6"/>${txt(1450, 300, "Un muscle", 38, { w: 700 })}</g>`;
    // l'artère (rouge), puis la veine (bleue sur le schéma)
    if (a > 0)
      s += `<path d="M380 420 H${f2(lerp(380, 1180, a))}" stroke="${C.ink}" stroke-width="64" stroke-linecap="round"/><path d="M380 420 H${f2(lerp(380, 1180, a))}" stroke="#F08A9B" stroke-width="48" stroke-linecap="round"/>`;
    if (v > 0)
      s += `<path d="M1180 680 H${f2(lerp(1180, 380, v))}" stroke="${C.ink}" stroke-width="64" stroke-linecap="round"/><path d="M1180 680 H${f2(lerp(1180, 380, v))}" stroke="${mixHex("#7C9BE8", "#F08A9B", red)}" stroke-width="48" stroke-linecap="round"/>`;
    // les capillaires : un réseau de tuyaux très fins dans le muscle
    if (c > 0)
      for (let i = 0; i < 6; i++) {
        const y0 = 420,
          y1 = 680,
          x = 1280 + i * 64;
        s += `<path d="M1180 ${y0} C ${x} ${y0}, ${x + 40} ${y0 + 80}, ${x} 550 C ${x - 40} ${y1 - 80}, ${x} ${y1}, 1180 ${y1}" fill="none" stroke="#C2334A" stroke-width="6" opacity="${f2(c)}"/>`;
      }
    // le sang qui passe
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.25 + i / 5) % 1;
      if (a >= 1) {
        const [x, y] = along(ART, u);
        s += rbcSVG(x, y, 18);
      }
      if (v >= 1) {
        const [x, y] = along(VEI, u);
        s += rbcSVG(x, y, 18);
      }
    }
    // « mon sang est bleu ? » : non
    const q = ramp(t, tB, tB + 0.3) * (1 - red);
    if (q > 0)
      s += `<g opacity="${f2(q)}" transform="translate(780 ${f2(820 - 30 + 6 * Math.sin(t * 5))})">${txt(0, 0, "bleu ?", 70, { w: 700, fill: C.blue })}</g>`;
    $("#s3-draw").innerHTML = s;
  });
  const l1 = label("s3", "s3-l1", [700, 396], [560, 230], "Les artères", "elles partent du cœur");
  const l2 = label("s3", "s3-l2", [700, 704], [560, 790], "Les veines", "elles y ramènent le sang");
  const l3 = label(
    "s3",
    "s3-l3",
    [1500, 550],
    [1500, 830],
    "Les capillaires",
    "si fins qu’on ne les voit pas",
  );
  showLabel(l1, tA + 0.3);
  showLabel(l2, tV + 0.3);
  showLabel(l3, tC + 0.8);
  [l1, l2, l3].forEach((l) => hideLabel(l, tB - 0.3));
  pop("#s3-n1", tR + 0.4);
})();
