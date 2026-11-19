// ---------- Scène 4 : le canon de Newton ; la Lune tombe sans arrêt autour de la Terre ----------
(() => {
  const CX = 960,
    CY = 640,
    R = 210,
    H = 60; // Terre, et hauteur de la montagne
  const GMc = 4.0e6; // constante de gravitation de la simulation (pixels³ / s²)
  const r0 = R + H,
    vOrb = Math.sqrt(GMc / r0); // vitesse exacte de l'orbite circulaire
  // Simulation : on tire horizontalement depuis le sommet, la gravité varie en 1/d² (vraie loi)
  const shoot = (v) => {
    const pts = [];
    let x = 0,
      y = -r0,
      vx = v,
      vy = 0;
    const dt = 0.004;
    for (let i = 0; i < 6000; i++) {
      const d = Math.hypot(x, y);
      if (d < R - 1 && i > 3) break;
      if (i % 5 === 0) pts.push([CX + x, CY + y]);
      const ax = (-GMc * x) / (d * d * d),
        ay = (-GMc * y) / (d * d * d);
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
    }
    return pts; // un point toutes les 0,02 s
  };
  const shots = [
    { t: cue("s4-2", "petit") - 0.2, pts: shoot(vOrb * 0.45), col: C.blueL },
    { t: cue("s4-2", "fort") - 0.2, pts: shoot(vOrb * 0.72), col: C.blue },
    { t: cue("s4-2", "fort", 1) + 0.1, pts: null, col: C.fire }, // orbite : mouvement circulaire exact
  ];
  const wOrb = vOrb / r0; // vitesse angulaire
  const tWhy = cue("s4-4", "dérobe") - 1.6,
    tMoon = cue("s4-4", "Lune") - 0.8;
  const pathD = (pts, n) =>
    pts
      .slice(0, n)
      .map((p, i) => `${i ? "L" : "M"}${f2(p[0])} ${f2(p[1])}`)
      .join("");
  onDraw("s4", (t) => {
    const far = ramp(t, tMoon, tMoon + 1.0); // on recule pour voir la Lune
    const k = lerp(1, 0.3, far);
    let s = `<g transform="translate(${CX} ${f2(lerp(CY, 560, far))}) scale(${f2(k)}) translate(${-CX} ${-CY})">`;
    s += earthSVG(CX, CY, R);
    // la montagne et le canon
    s += `<path d="M${CX - 46} ${CY - R + 6} L${CX} ${CY - r0 + 12} L${CX + 46} ${CY - R + 6} Z" fill="#9AA6B8" class="ink"/><rect x="${CX - 10}" y="${CY - r0 - 6}" width="56" height="20" rx="8" fill="${C.ink}"/>`;
    shots.forEach((sh) => {
      if (t < sh.t) return;
      const u = t - sh.t;
      if (sh.pts) {
        const n = Math.min(sh.pts.length, Math.floor(u / 0.02) + 1),
          p = sh.pts[n - 1];
        s +=
          `<path d="${pathD(sh.pts, n)}" fill="none" stroke="${sh.col}" stroke-width="7" stroke-dasharray="4 14" stroke-linecap="round"/>` +
          ball(p[0], p[1], 15, sh.col, { w: 3 });
      } else {
        const a = -Math.PI / 2 + wOrb * u,
          done = Math.min(TAU, wOrb * u);
        const x = CX + r0 * Math.cos(a),
          y = CY + r0 * Math.sin(a);
        s += `<path d="M${CX} ${CY - r0} A${r0} ${r0} 0 ${done > Math.PI ? 1 : 0} 1 ${f2(CX + r0 * Math.cos(-Math.PI / 2 + done * 0.999))} ${f2(CY + r0 * Math.sin(-Math.PI / 2 + done * 0.999))}" fill="none" stroke="${sh.col}" stroke-width="7" stroke-dasharray="4 14" stroke-linecap="round"/>`;
        // « il tombe, mais le sol se dérobe » : sa vitesse (tout droit) et sa chute (vers le centre)
        const why = lin(t, tWhy, tWhy + 0.4) * (1 - far);
        if (why > 0)
          s +=
            arrowSVG(x, y, x - 120 * Math.sin(a), y + 120 * Math.cos(a), C.blue, 10, why) +
            arrowSVG(x, y, x - 80 * Math.cos(a), y - 80 * Math.sin(a), "#E0455E", 10, why);
        s += ball(x, y, 16, sh.col, { w: 3 });
      }
    });
    // la Lune, beaucoup plus loin, qui fait la même chose
    if (far > 0) {
      const rm = 1500,
        am = (t - tMoon) * 0.5 - 0.6;
      s += `<circle cx="${CX}" cy="${CY}" r="${rm}" fill="none" stroke="${C.ink}" stroke-width="12" stroke-dasharray="14 40" opacity="${f2(far * 0.5)}"/><g opacity="${f2(far)}">${ball(CX + rm * Math.cos(am), CY + rm * Math.sin(am), 120, "#C9D1DE", { w: 12 })}</g>`;
    }
    $("#s4-draw").innerHTML = s + `</g>`;
  });
  show("#s4-n1", shots[0].t + 0.2, { x: -40, y: 0 });
  show("#s4-n2", shots[1].t + 0.2, { x: -40, y: 0 });
  show("#s4-n3", cue("s4-3", "tour") - 0.5, { x: -40, y: 0 });
  show("#s4-n4", tWhy + 0.2);
  tl.to(["#s4-n1", "#s4-n2", "#s4-n3", "#s4-n4"], { opacity: 0, duration: 0.3 }, tMoon - 0.2);
  show("#s4-n5", cue("s4-5", "boulet") - 0.4);
})();
