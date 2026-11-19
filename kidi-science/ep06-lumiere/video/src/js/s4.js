// ---------- Scène 4 : le ciel bleu (le bleu rebondit sur l'air), puis le coucher de soleil ----------
(() => {
  const tBlue = cue("s4-2", "bleue") - 0.5,
    tEve = cue("s4-3", "soir") - 0.5;
  onDraw("s4", (t) => {
    const blue = ramp(t, tBlue, tBlue + 1.6),
      eve = ramp(t, tEve, tEve + 2.0);
    // le ciel : blanc → bleu, puis orangé le soir
    const top = mixHex(mixHex("#FFFFFF", "#7CC4F5", blue), "#5B6FB8", eve),
      bot = mixHex(mixHex("#FFFFFF", "#CDE9FB", blue), "#FF9A4A", eve);
    let s = `<defs><linearGradient id="s4-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient><clipPath id="s4-clip"><rect x="130" y="190" width="1660" height="660" rx="34"/></clipPath></defs>`;
    s += `<g clip-path="url(#s4-clip)"><rect x="130" y="190" width="1660" height="660" fill="url(#s4-sky)"/>`;
    // le Soleil descend vers l'horizon
    const sx = lerp(520, 300, eve),
      sy = lerp(300, 720, eve);
    s += sunSVG(sx, sy, 80, t);
    // les grains d'air
    for (let i = 0; i < 70; i++)
      s += `<circle cx="${f2(150 + rnd(i) * 1620)}" cy="${f2(210 + rnd(i + 100) * 560)}" r="5" fill="#fff" opacity="0.5"/>`;
    // le faisceau : du Soleil jusqu'à l'observateur
    const ox = 1560,
      oy = 760;
    const n = 9;
    for (let k = 0; k < n; k++) {
      const u0 = k / n,
        u1 = (k + 1) / n,
        x0 = lerp(sx, ox, u0),
        y0 = lerp(sy, oy, u0),
        x1 = lerp(sx, ox, u1),
        y1 = lerp(sy, oy, u1);
      // le soir, le faisceau rougit à mesure qu'il traverse l'air
      const col = mixHex(
        "#FFFFFF",
        mixHex("#FFD23F", "#F0556A", u1),
        eve * u1 * 1.2 + (1 - eve) * 0.0,
      );
      s += `<path d="M${f2(x0)} ${f2(y0)} L${f2(x1)} ${f2(y1)}" stroke="${col}" stroke-width="22" stroke-linecap="round"/>`;
      // le bleu qui s'échappe du faisceau en zigzag
      if (blue > 0)
        for (let j = 0; j < 2; j++) {
          const id = k * 2 + j,
            ph = (t * 0.7 + rnd(id)) % 1,
            a = rnd(id + 40) * TAU,
            d = ph * 260 * (eve > 0.5 && u0 > 0.55 ? 0.15 : 1);
          s += `<path d="M${f2(x0 + d * Math.cos(a))} ${f2(y0 + d * Math.sin(a))} l${f2(26 * Math.cos(a))} ${f2(26 * Math.sin(a))}" stroke="${C.blue}" stroke-width="9" stroke-linecap="round" opacity="${f2(blue * (1 - ph) * (eve > 0.5 && u0 > 0.55 ? 0.2 : 1))}"/>`;
        }
    }
    s +=
      `</g><rect x="130" y="190" width="1660" height="660" rx="34" fill="none" class="ink" stroke-width="5"/><path d="M130 850 H1790" class="ink" stroke-width="6"/>` +
      figSVG(ox + 60, 848, 0.9, C.blue);
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tBlue + 0.8);
  tl.to("#s4-n1", { opacity: 0, duration: 0.3 }, tEve - 0.1);
  show("#s4-n2", cue("s4-4", "perdu") - 0.4);
})();
