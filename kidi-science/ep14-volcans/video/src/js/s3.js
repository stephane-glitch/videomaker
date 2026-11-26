// ---------- Scène 3 : deux sortes d'éruptions : la lave liquide qui coule, la lave épaisse qui explose ----------
(() => {
  const tLi = cue("s3-2", "liquide") - 0.6,
    tCo = cue("s3-2", "coule") - 0.5,
    tEp = cue("s3-2", "épaisse") - 0.6,
    tEx = cue("s3-2", "explose") - 0.3,
    tCe = cue("s3-2", "cendres") - 1.0;
  onDraw("s3", (t) => {
    let s = `<path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
    // à gauche : le volcan plat, la lave coule en rivières
    const fl = ramp(t, tCo, tCo + 2.5);
    s +=
      coneSVG(160, 900, 850, 560, 120, "#7A6A5C") +
      `<path d="M470 560 H590 L600 590 H460 Z" fill="#E0455E" class="ink" stroke-width="4"/>`;
    [
      [-1, 0],
      [1, 0.2],
    ].forEach(([d, del]) => {
      const k = clamp(fl - del);
      if (k > 0)
        s += `<path d="M${530 + d * 50} 580 L${f2(530 + d * (50 + 260 * k))} ${f2(580 + 250 * k)}" stroke="${C.ink}" stroke-width="38" stroke-linecap="round"/><path d="M${530 + d * 50} 580 L${f2(530 + d * (50 + 260 * k))} ${f2(580 + 250 * k)}" stroke="#F08A3C" stroke-width="26" stroke-linecap="round" stroke-dasharray="40 8" stroke-dashoffset="${f2(-t * 50)}"/>`;
    });
    if (t > tLi) s += lavaSVG(530, 560, t, 0.35 * ramp(t, tLi, tLi + 0.4), 8, 50);
    // à droite : le cône raide ; le gaz coincé, puis l'explosion et le nuage de cendres
    const ex = ramp(t, tEx, tEx + 0.4),
      ce = ramp(t, tCe, tCe + 1.6),
      k2 = ramp(t, tEp, tEp + 0.4);
    const sh = t > tEp && t < tEx ? 5 * Math.sin(t * 44) * k2 : 0;
    s += `<g transform="translate(${f2(sh)} 0)">${coneSVG(1100, 1700, 850, 420, 90)}</g>`;
    if (k2 > 0 && ex < 1)
      for (let i = 0; i < 5; i++)
        s += `<circle cx="${f2(1340 + i * 30 + sh)}" cy="${f2(520 + 8 * Math.sin(t * 9 + i))}" r="12" fill="#fff" fill-opacity="0.8" stroke="${C.ink}" stroke-width="2.5" opacity="${f2(k2 * (1 - ex))}"/>`;
    if (ex > 0) {
      s += lavaSVG(1400, 420, t, ex, 16, 130);
      // le panache : des boules grises empilées qui grossissent
      for (let i = 0; i < 12; i++) {
        const yy = 390 - (i / 12) * 190 * ce,
          r = (40 + i * 6) * (0.4 + 0.6 * ce);
        s += `<circle cx="${f2(1400 + (rnd(i) - 0.5) * (50 + i * 18) * ce + 8 * Math.sin(t * 2 + i))}" cy="${f2(yy)}" r="${f2(r)}" fill="${i % 2 ? "#A7AFBA" : "#8E96A3"}" class="ink" stroke-width="4" opacity="${f2(ex)}"/>`;
      }
    }
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tCo + 0.3);
  show("#s3-n2", tEx + 0.4);
})();
