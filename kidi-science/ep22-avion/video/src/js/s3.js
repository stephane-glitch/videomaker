// ---------- Scène 3 : quatre forces : le poids, la portance, la poussée des moteurs, le frein de l'air ; sans moteurs, l'avion plane ----------
(() => {
  const tPo = cue("s3-1", "poids") - 0.5,
    tPt = cue("s3-1", "portance") - 0.5,
    tMo = cue("s3-1", "moteurs") - 0.5,
    tFr = cue("s3-1", "freine") - 0.6,
    tPi = cue("s3-2", "pierre") - 0.6,
    tPl = cue("s3-3", "plane") - 0.5;
  onDraw("s3", (t) => {
    const pl = ramp(t, tPl, tPl + 0.5),
      pi = ramp(t, tPi, tPi + 0.3) * (1 - pl);
    let s = daySkySVG(130, 190, 1660, 660, t, 120 * (1 - 0.6 * pl), "s3");
    const y = 520 + 10 * Math.sin(t * 1.6);
    let g = planeSVG(960, y, 1.5, -2);
    const A = [
      [tPo, 960, y + 60, 960, y + 250, "#E0455E", "le poids", 960, y + 300, "#B02A45"],
      [tPt, 960, y - 60, 960, y - 240, "#2E9E6B", "la portance", 960, y - 262, "#1F7A50"],
      [tMo, 1200, y, 1440, y, C.fire, "les moteurs", 1560, y - 30, "#C25E00"],
      [tFr, 720, y, 500, y, C.blue, "l’air freine", 380, y - 30, C.blueD],
    ];
    A.forEach(([t0, x1, y1, x2, y2, col, lab, lx, ly, lc], i) => {
      const k = ramp(t, t0, t0 + 0.3) * (1 - 0.75 * pi);
      if (k > 0) {
        const w = 1 + 0.06 * Math.sin(t * 5 + i);
        g +=
          arrowSVG(x1, y1, lerp(x1, x2, k * w), lerp(y1, y2, k * w), col, 22, k) +
          txt(lx, ly, lab, 46, { w: 700, fill: lc, op: k });
      }
    });
    if (pi > 0) g += txt(1380, 330, "?", 160, { w: 700, fill: "#C25E00", op: pi });
    s += `<g opacity="${f2(1 - pl)}">${g}</g>`;
    // moteurs coupés : l'avion plane, comme un avion en papier
    if (pl > 0) {
      const u = ((t - tPl) * 0.11) % 1,
        x = lerp(330, 1560, u),
        yy = lerp(330, 640, u) + 8 * Math.sin(t * 2);
      let h =
        `<path d="M330 330 L1560 640" stroke="${C.ink}" stroke-width="4" stroke-dasharray="10 16" opacity="0.4"/>` +
        planeSVG(x, yy, 1.1, 12);
      const v = ((t - tPl) * 0.11 + 0.35) % 1,
        px = lerp(330, 1560, v),
        py = lerp(430, 740, v) + 14 * Math.sin(t * 3);
      h += `<g transform="translate(${f2(px)} ${f2(py)}) rotate(14)"><path d="M70 0 L-60 -34 L-36 0 L-60 30 Z" fill="#fff" class="ink" stroke-width="4" stroke-linejoin="round"/><path d="M70 0 L-36 0" class="ink" stroke-width="3"/></g>`;
      s += `<g opacity="${f2(pl)}">${h}${txt(1360, 330, "Il plane !", 64, { w: 700, fill: C.ink })}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tPl + 0.6);
})();
