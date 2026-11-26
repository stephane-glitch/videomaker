// ---------- Scène 1 : le triangle du feu ; on pose un verre sur la bougie, elle s'éteint ----------
(() => {
  const T = [cue("s1-1", "brûler") - 0.4, cue("s1-1", "air") - 0.4, cue("s1-1", "chaleur") - 0.4],
    tOn = cue("s1-1", "démarrer") - 0.2;
  const tQ = cue("s1-2", "enlève") - 0.2,
    tG = cue("s1-3", "verre") - 0.9,
    tOff0 = cue("s1-4", "oxygène") - 0.6,
    tOff = cue("s1-4", "éteint");
  const A = [960, 240],
    B = [600, 800],
    Cc = [1320, 800];
  const side = (p, q, col, k, lab, off) => {
    if (k <= 0) return "";
    const x2 = lerp(p[0], q[0], k),
      y2 = lerp(p[1], q[1], k),
      mx = (p[0] + q[0]) / 2 + off[0],
      my = (p[1] + q[1]) / 2 + off[1];
    return (
      `<path d="M${p[0]} ${p[1]} L${f2(x2)} ${f2(y2)}" stroke="${C.ink}" stroke-width="44" stroke-linecap="round"/><path d="M${p[0]} ${p[1]} L${f2(x2)} ${f2(y2)}" stroke="${col}" stroke-width="32" stroke-linecap="round"/>` +
      (k > 0.9
        ? txt(mx, my, lab, 40, { anchor: off[0] < 0 ? "end" : off[0] > 0 ? "start" : "middle" })
        : "")
    );
  };
  onDraw("s1", (t) => {
    const mv = ramp(t, tG - 0.6, tG),
      air = 1 - ramp(t, tOff0, tOff),
      wob = t > tQ && t < tG ? 10 * Math.sin((t - tQ) * 14) * (1 - ramp(t, tQ, tQ + 1.2)) : 0;
    let g = side(B, A, "#B9772E", ramp(t, T[0], T[0] + 0.5), "À brûler", [-60, 0]);
    g +=
      `<g transform="translate(${f2(wob + 80 * (1 - air))} 0)" opacity="${f2(0.25 + 0.75 * air)}">` +
      side(A, Cc, C.air, ramp(t, T[1], T[1] + 0.5), "L’air (oxygène)", [60, 0]) +
      `</g>`;
    g += side(Cc, B, C.fire, ramp(t, T[2], T[2] + 0.5), "La chaleur", [0, 84]);
    g += flameSVG(960, 720, 300, t, { k: ramp(t, tOn, tOn + 0.5) * air });
    let s = `<g transform="translate(${f2(-360 * mv)} ${f2(60 * mv)}) scale(${f2(1 - 0.22 * mv)})" transform-origin="960 540">${g}</g>`;
    // la bougie et son verre
    if (mv > 0) {
      const gx = 1380,
        down = ramp(t, tG, tG + 0.9),
        gy = lerp(-420, 0, down);
      let c =
        `<path d="M1100 800 H1660" class="ink" stroke-width="6"/>` +
        candleSVG(gx, 798, 60, 230) +
        flameSVG(gx, 544, 130, t, { k: air });
      if (air < 0.6) c += smokeSVG(gx, 540, t, 1 - air, "#fff", 8, 180);
      // les grains d'oxygène enfermés : ils s'épuisent
      for (let i = 0; i < 14; i++)
        if (down > 0.95)
          c += `<circle cx="${f2(gx - 150 + rnd(i) * 300 + 8 * Math.sin(t * 2 + i))}" cy="${f2(380 + rnd(i + 20) * 380 + 8 * Math.cos(t * 2.3 + i))}" r="12" fill="${C.air}" stroke="${C.ink}" stroke-width="3" opacity="${f2(i / 14 < air ? 1 : 0.12)}"/>`;
      c += `<g transform="translate(0 ${f2(gy)})"><path d="M${gx - 190} 800 V400 Q${gx - 190} 330 ${gx - 120} 330 H${gx + 120} Q${gx + 190} 330 ${gx + 190} 400 V800" fill="#CFEFFF" fill-opacity="0.35" class="ink" stroke-width="6"/><path d="M${gx - 150} 420 V640" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.8"/></g>`;
      s += `<g opacity="${f2(mv)}">${c}</g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tOff - 0.2);
  pop("#s1-n2", cue("s1-5", "respire") - 0.3);
})();
