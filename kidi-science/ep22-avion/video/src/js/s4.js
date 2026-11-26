// ---------- Scène 4 : le décollage : il faut de la vitesse pour que la portance dépasse le poids ----------
(() => {
  const tRo = cue("s4-1", "roule") - 0.5,
    tVi = cue("s4-2", "vitesse") - 0.5,
    tDe = cue("s4-2", "deux") - 0.5,
    tPt = cue("s4-2", "portent") - 0.5,
    tHo = cue("s4-3", "hop") - 0.2;
  onDraw("s4", (t) => {
    const v = clamp(lin(t, tRo, tPt, 0, 1), 0, 1),
      up = ramp(t, tPt, tHo + 2.5),
      sp = Math.round(250 * v + 40 * up);
    let s = daySkySVG(130, 190, 1660, 660, t, 20 + 500 * v, "s4");
    // la piste qui défile
    s += `<clipPath id="s4-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s4-k)"><rect x="130" y="700" width="1660" height="160" fill="#7C8798"/><path d="M130 700 H1790" class="ink" stroke-width="5"/><path d="M0 775 H1920" stroke="#fff" stroke-width="10" stroke-dasharray="90 70" stroke-dashoffset="${f2(t * (60 + 1400 * v))}"/></g>`;
    const px = 760 + 120 * v,
      py = 640 - 330 * up * up - (up > 0 ? 0 : 2 * Math.sin(t * 30) * v),
      rot = -14 * Math.sin(Math.min(1, up * 1.6) * Math.PI * 0.5);
    s +=
      `<ellipse cx="${f2(px)}" cy="716" rx="${f2(200 - 90 * up)}" ry="12" fill="#000" opacity="${f2(0.22 - 0.12 * up)}"/>` +
      planeSVG(px, py, 1.5, rot);
    // le poids ne change pas ; la portance grandit avec la vitesse
    const pt = v * v;
    s +=
      arrowSVG(px, py + 50, px, py + 50 + 100, "#E0455E", 18) +
      (pt > 0.03 ? arrowSVG(px, py - 50, px, py - 50 - 110 * pt - 30 * up, "#2E9E6B", 18) : "");
    const vi = ramp(t, tVi, tVi + 0.3);
    s += `<g transform="translate(1480 310)" opacity="${f2(0.4 + 0.6 * Math.max(vi, ramp(t, tRo, tRo + 0.3)))}"><rect x="-220" y="-60" width="440" height="110" rx="28" fill="#fff" class="ink" stroke-width="4"/>${txt(0, 14, `${sp} km/h`, 62, { w: 700, fill: t > tDe && v >= 1 ? "#1F7A50" : C.ink })}</g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tVi + 0.5);
})();
