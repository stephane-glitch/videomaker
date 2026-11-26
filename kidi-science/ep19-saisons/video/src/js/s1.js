// ---------- Scène 1 : la Terre, une toupie penchée qui garde la même inclinaison tout autour du Soleil ----------
(() => {
  const tI = cue("s1-1", "inclinaison") - 0.8,
    tT = cue("s1-1", "tour", 1) - 0.6,
    tH = cue("s1-2", "haut") - 0.4,
    tB = cue("s1-2", "bas") - 0.4;
  const CX = 960,
    CY = 540,
    RX = 640,
    RY = 220;
  onDraw("s1", (t) => {
    const orb = ramp(t, tT, tT + 0.6),
      go = t > tT ? (t - tT) * 0.42 : 0,
      th = Math.PI - go;
    const ex = CX + RX * Math.cos(th),
      ey = CY + RY * Math.sin(th),
      big = 1 - orb;
    let s = "";
    // l'orbite
    if (orb > 0)
      s += `<ellipse cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-dasharray="10 14" opacity="${f2(orb)}"/>`;
    const sun = sunSVG(CX, CY, lerp(60, 90, orb), t),
      r = lerp(190, 80, orb),
      x = lerp(1100, ex, orb),
      y = lerp(540, ey, orb);
    let earth = tiltEarthSVG(x, y, r, 23, t * 60);
    // la flèche de rotation de la toupie
    if (big > 0.3)
      earth += `<g opacity="${f2(big)}" transform="rotate(23 ${x} ${y})"><path d="M${x - 120} ${y - 260} q120 -50 240 0" fill="none" stroke="${C.fire}" stroke-width="10" stroke-linecap="round"/><path d="M${x + 120} ${y - 260} l-34 -6 l14 30 Z" fill="${C.fire}"/></g>`;
    // devant ou derrière le Soleil, selon la position sur l'orbite
    s +=
      orb > 0 && Math.sin(th) < 0
        ? earth + sun
        : (orb > 0 ? sun : `<g opacity="0.0">${sun}</g>`) + earth;
    if (orb === 0) s += sunSVG(420, 540, 110, t);
    // l'axe pointe toujours du même côté
    const inc = ramp(t, tI, tI + 0.4);
    if (inc > 0 && orb > 0.9)
      for (let k = 0; k < 4; k++) {
        const a = Math.PI - (k * Math.PI) / 2,
          gx = CX + RX * Math.cos(a),
          gy = CY + RY * Math.sin(a);
        s += `<path d="M${f2(gx - 46)} ${f2(gy + 108)} L${f2(gx + 46)} ${f2(gy - 108)}" stroke="${C.fire}" stroke-width="6" stroke-dasharray="6 10" stroke-linecap="round" opacity="0.6"/>`;
      }
    // le haut, puis le bas, penchent vers le Soleil
    if (t > tH && t < tB + 2)
      s += txt(CX, 250, t < tB ? "Le haut penche vers le Soleil" : "… puis c’est le bas", 46, {
        w: 700,
        fill: "#C25E00",
      });
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tI + 0.5);
})();
