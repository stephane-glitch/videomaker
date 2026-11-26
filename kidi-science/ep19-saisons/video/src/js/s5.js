// ---------- Scène 5 : quatre saisons pour un seul tour ; au printemps et à l'automne, jour et nuit s'équilibrent ----------
(() => {
  const S = scn("s5");
  const tPa = cue("s5-2", "pareil") - 1.4,
    t4 = cue("s5-3", "Quatre") - 0.3;
  const CX = 960,
    CY = 520,
    RX = 640,
    RY = 220,
    NAMES = ["Été", "Automne", "Hiver", "Printemps"];
  onDraw("s5", (t) => {
    const go = (t - S.start) * 0.5,
      th = Math.PI - go,
      ex = CX + RX * Math.cos(th),
      ey = CY + RY * Math.sin(th);
    let s = `<ellipse cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-dasharray="10 14"/>`;
    // les quatre positions et leurs noms (pour notre moitié de la Terre)
    for (let k = 0; k < 4; k++) {
      const a = Math.PI - (k * Math.PI) / 2,
        gx = CX + RX * Math.cos(a),
        gy = CY + RY * Math.sin(a),
        near = Math.cos(th - a) > 0.75,
        on = k % 2 === 1 || t > t4 - 2;
      s +=
        `<circle cx="${f2(gx)}" cy="${f2(gy)}" r="14" fill="${near ? C.fire : "#fff"}" class="ink" stroke-width="4"/>` +
        txt(gx + [-130, 0, 130, 0][k], gy + [10, -50, 10, -100][k], NAMES[k], near ? 54 : 44, {
          w: 700,
          fill: near ? "#C25E00" : C.ink,
          op: on ? 1 : 0.5,
        });
    }
    const sun = sunSVG(CX, CY, 84, t),
      earth = tiltEarthSVG(ex, ey, 74, 23, t * 60);
    s += Math.sin(th) < 0 ? earth + sun : sun + earth;
    // le jour et la nuit à égalité
    const p = ramp(t, tPa, tPa + 0.4);
    if (p > 0)
      s += `<g opacity="${f2(p)}"><rect x="700" y="800" width="520" height="34" rx="17" fill="#1B2445"/><rect x="700" y="800" width="260" height="34" rx="17" fill="${C.hot}"/>${txt(830, 790, "jour", 30, { w: 700 })}${txt(1090, 790, "nuit", 30, { w: 700 })}</g>`;
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tPa + 0.5);
})();
