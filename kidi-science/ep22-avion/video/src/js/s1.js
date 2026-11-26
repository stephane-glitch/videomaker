// ---------- Scène 1 : les moteurs donnent la vitesse ; plus l'avion va vite, plus l'air pousse fort ----------
(() => {
  const S = scn("s1");
  const tMo = cue("s1-1", "moteurs") - 0.5,
    tFo = cue("s1-2", "fonce") - 0.6,
    tVi = cue("s1-3", "vite") - 0.6;
  onDraw("s1", (t) => {
    const mo = ramp(t, tMo, tMo + 0.4),
      fo = ramp(t, tFo, tFo + 0.4),
      vi = ramp(t, tVi, tVi + 2.5),
      sp = 30 + 200 * mo + 500 * vi;
    let s = daySkySVG(130, 190, 1660, 660, t, sp, "s1");
    const px = 860 + 40 * Math.sin((t - S.start) * 0.7),
      py = 500 + 10 * Math.sin(t * 1.7);
    // l'air qui fonce sur l'avion
    if (fo > 0)
      for (let i = 0; i < 8; i++) {
        const u = (t * (1 + 1.5 * vi) + rnd(i)) % 1,
          y = 300 + i * 58;
        s += `<path d="M${f2(1740 - u * 540)} ${y} h${f2(-(90 + 120 * vi))}" stroke="${C.blue}" stroke-width="${f2(8 + 8 * vi)}" stroke-linecap="round" opacity="${f2(fo * Math.sin(u * Math.PI) * 0.8)}"/>`;
      }
    // la poussée des moteurs
    if (mo > 0) {
      for (let i = 0; i < 5; i++) {
        const u = (t * 2 + rnd(i + 7)) % 1;
        s += `<circle cx="${f2(px - 110 - u * 260)}" cy="${f2(py + 64 + (rnd(i) - 0.5) * 30)}" r="${f2(10 + 22 * u)}" fill="#fff" opacity="${f2(mo * (1 - u) * 0.8)}"/>`;
      }
      s +=
        arrowSVG(px - 330, py - 120, px - 90, py - 120, C.fire, 16, mo) +
        txt(px - 210, py - 150, "moteurs", 44, { w: 700, fill: "#C25E00", op: mo });
    }
    s += planeSVG(px, py, 1.7, -2);
    if (vi > 0)
      s += `<g transform="translate(1420 760)"><rect x="-230" y="-56" width="460" height="100" rx="26" fill="#fff" class="ink" stroke-width="4"/>${txt(0, 12, `${Math.round(lerp(200, 900, vi))} km/h`, 56, { w: 700, fill: C.ink })}</g>`;
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tMo + 0.5);
  show("#s1-n2", tVi + 0.4);
})();
