// ---------- Scène 1 : sous la peau, des capteurs à chacun son métier ; le message file par un nerf jusqu'au cerveau ----------
(() => {
  const W = ["pression", "vibrations", "chaud", "froid", "douleur"],
    T = W.map((w) => cue("s1-1", w) - 0.4),
    tN = cue("s1-3", "nerf") - 0.5,
    tSp = cue("s1-3", "deux") - 0.4;
  const COL = [C.blue, "#8E5BD6", C.fire, C.air, "#E0455E"],
    NAMES = ["La pression", "Les vibrations", "Le chaud", "Le froid", "La douleur"];
  const X0 = 150,
    X1 = 1130,
    YT = 420;
  const SX = (i) => X0 + 110 + i * 190;
  const NERVE = [
    [SX(4) + 50, 600],
    [1250, 600],
    [1420, 560],
    [1560, 470],
  ];
  onDraw("s1", (t) => {
    // la peau en coupe : la surface, le derme, quelques poils
    let s = `<rect x="${X0}" y="${YT}" width="${X1 - X0}" height="400" rx="20" fill="#FBD3C0" class="ink" stroke-width="5"/><path d="M${X0} ${YT + 70} q60 -24 122 0 t122 0 t122 0 t122 0 t122 0 t122 0 t122 0 t126 0 V${YT} H${X0} Z" fill="#FFD9B8" class="ink" stroke-width="4"/>`;
    [260, 640, 1010].forEach(
      (x, i) =>
        (s += `<path d="M${x} ${YT + 120} Q${x - 10} ${YT - 20} ${f2(x + 30 + 6 * Math.sin(t * 2 + i))} ${YT - 90}" fill="none" class="ink" stroke-width="5" stroke-linecap="round"/>`),
    );
    // les cinq sortes de capteurs
    for (let i = 0; i < 5; i++) {
      const k = ramp(t, T[i], T[i] + 0.35);
      if (k <= 0) continue;
      const x = SX(i),
        y = 600,
        live = t > T[i] && t < T[i] + 1.4 ? 1 + 0.12 * Math.sin(t * 16) : 1;
      let ic = "";
      if (i === 0) ic = `<ellipse rx="44" ry="26" fill="${COL[0]}" class="ink" stroke-width="4"/>`;
      if (i === 1)
        ic = [44, 32, 20, 9]
          .map(
            (r, j) =>
              `<ellipse rx="${r}" ry="${r * 0.75}" fill="${j % 2 ? "#C9B1EE" : COL[1]}" class="ink" stroke-width="3"/>`,
          )
          .join("");
      if (i === 2 || i === 3)
        ic = `<path d="M0 -50 V20" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/><path d="M0 -50 V20" stroke="${COL[i]}" stroke-width="7" stroke-linecap="round"/><circle cy="30" r="26" fill="${COL[i]}" class="ink" stroke-width="4"/>`;
      if (i === 4)
        ic = `<path d="M0 40 V-10 M0 -10 L-30 -50 M0 -10 L0 -56 M0 -10 L30 -50 M-30 -50 l-12 -16 M30 -50 l12 -16" fill="none" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><path d="M0 40 V-10 M0 -10 L-30 -50 M0 -10 L0 -56 M0 -10 L30 -50 M-30 -50 l-12 -16 M30 -50 l12 -16" fill="none" stroke="${COL[4]}" stroke-width="6" stroke-linecap="round"/>`;
      s +=
        `<g transform="translate(${x} ${y}) scale(${f2(k * live)})">${ic}</g>` +
        txt(x, 730, NAMES[i], 30, { w: 700, op: k });
      // ce qui l'active, au-dessus de la peau
      const a = k * (1 - ramp(t, T[i] + 1.6, T[i] + 2.0));
      if (a > 0)
        s +=
          `<g opacity="${f2(a)}" transform="translate(${x} ${f2(YT - 70 + (i < 2 ? 14 * Math.abs(Math.sin(t * (i ? 26 : 5))) : 0))})">` +
          [
            `<path d="M-26 -90 V-10 Q-26 20 0 20 Q26 20 26 -10 V-90 Z" fill="#FFD9B8" class="ink" stroke-width="5"/>`,
            `<path d="M-40 -10 q20 -30 40 0 t40 0" fill="none" stroke="${COL[1]}" stroke-width="9" stroke-linecap="round"/>`,
            flameSVG(0, 20, 110, t),
            `<g stroke="${C.blue}" stroke-width="9" stroke-linecap="round" transform="rotate(${f2(t * 40)})"><path d="M-40 0 H40 M0 -40 V40 M-28 -28 L28 28 M28 -28 L-28 28"/></g>`,
            `<path d="M0 30 L-22 -60 H22 Z" fill="#9AA6B8" class="ink" stroke-width="4"/>`,
          ][i] +
          `</g>`;
    }
    // le nerf et le cerveau
    const n = ramp(t, tN, tN + 0.5);
    if (n > 0) {
      s += `<g opacity="${f2(n)}"><path d="${pathD(NERVE)}" fill="none" stroke="${C.ink}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path d="${pathD(NERVE)}" fill="none" stroke="${C.hot}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>${brainSVG(1600, 400, 1.2)}</g>`;
      for (let i = 0; i < 3; i++) s += sparkSVG(NERVE, ((t - tN) * 0.9 + i / 3) % 1, C.spark, 15);
      const sp = ramp(t, tSp, tSp + 0.3);
      if (sp > 0)
        s += `<g transform="translate(1480 760) scale(${f2(sp * (1 + 0.04 * Math.sin(t * 6)))})">${txt(0, 0, "200 km/h", 86, { w: 700, fill: "#C25E00" })}</g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tSp + 0.5);
})();
