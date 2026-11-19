// ---------- Scène 1 : la Terre attire tout vers son centre ; « le bas » n'est pas le même pour tout le monde ----------
(() => {
  const CX = 960,
    CY = 580,
    R = 250;
  const tArr = cue("s1-1", "centre") - 0.6,
    tAus = cue("s1-2", "Australie") - 0.6,
    tFlip = cue("s1-2", "notre") - 0.7,
    tBack = cue("s1-3", "Personne") - 0.2,
    tKang = cue("s1-4", "kangourous") - 0.5;
  // objets posés sur la Terre : [angle (0 = en haut), apparition, type]
  const items = [
    [0, cue("s1-1", "Toi") - 0.3, "fig", C.blue],
    [62, cue("s1-1", "moi") - 0.3, "fig", "#3DBE8B"],
    [-70, cue("s1-1", "tartine") - 0.3, "toast"],
    [180, tAus, "fig", C.fire],
  ];
  // un kangourou très simplifié, pieds en (0, 0)
  const kang = (col) =>
    `<path d="M-40 -6 Q-90 -10 -112 -50" fill="none" stroke="${C.ink}" stroke-width="20" stroke-linecap="round"/><path d="M-40 -6 Q-90 -10 -112 -50" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round"/><ellipse cx="0" cy="-58" rx="46" ry="62" fill="${col}" class="ink"/><circle cx="26" cy="-136" r="28" fill="${col}" class="ink"/><path d="M14 -158 L10 -196 L32 -166 Z M36 -160 L44 -198 L52 -160 Z" fill="${col}" class="ink"/><circle cx="36" cy="-140" r="5" fill="${C.ink}"/><path d="M-8 0 H40" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/>`;
  onDraw("s1", (t) => {
    // la Terre pivote d'un demi-tour pour montrer que l'Australien est bien debout chez lui
    const rot = 180 * (ramp(t, tFlip, tFlip + 1.4) - ramp(t, tBack, tBack + 1.4));
    let s = "";
    const arr = lin(t, tArr, tArr + 0.5);
    if (arr > 0)
      for (let i = 0; i < 8; i++) {
        const a = rad(i * 45 + 22 + rot),
          ph = (t * 0.7 + i / 8) % 1,
          r1 = R + 250 - ph * 90,
          r2 = r1 - 100;
        s += arrowSVG(
          CX + r1 * Math.sin(a),
          CY - r1 * Math.cos(a),
          CX + r2 * Math.sin(a),
          CY - r2 * Math.cos(a),
          C.fire,
          12,
          arr * Math.sin(ph * Math.PI) * 0.9,
        );
      }
    s += earthSVG(CX, CY, R, rot) + `<circle cx="${CX}" cy="${CY}" r="14" fill="${C.ink}"/>`;
    items.forEach(([ang, t0, kind, col]) => {
      const op = lin(t, t0, t0 + 0.4);
      if (op <= 0) return;
      const a = ang + rot,
        drop = kind === "toast" ? (1 - rampO(t, t0, t0 + 0.8)) * 160 : 0;
      const px = CX + (R + drop) * Math.sin(rad(a)),
        py = CY - (R + drop) * Math.cos(rad(a));
      const inner = kind === "fig" ? figSVG(0, 0, 0.85, col) : toastSVG(0, -18, 180, 0.42);
      const isK = kind === "fig" && ang === 180 && t > tKang && t < tKang + 3.2;
      s += `<g opacity="${f2(op)}" transform="translate(${f2(px)} ${f2(py)}) rotate(${f2(a)})">${isK ? `<g transform="scale(0.8)">${kang("#D98B4A")}</g>` : inner}</g>`;
    });
    $("#s1-draw").innerHTML = s;
  });
  const lab = {
    c: label("s1", "s1-l-c", [CX + 8, CY + 6], [1380, 760], "Le centre de la Terre", null),
  };
  showLabel(lab.c, tArr + 0.3);
  hideLabel(lab.c, tFlip - 0.2);
  show("#s1-n1", cue("s1-2", "bas") - 0.3);
  show("#s1-n2", cue("s1-3", "pieds") - 0.4);
})();
