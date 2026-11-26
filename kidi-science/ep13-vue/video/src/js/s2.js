// ---------- Scène 2 : le cristallin projette l'image sur la rétine… à l'envers ; le cerveau la retourne ----------
(() => {
  const tC = cue("s2-1", "cristallin") - 0.5,
    tPr = cue("s2-1", "projette") - 0.5,
    tR = cue("s2-1", "rétine") - 0.5,
    tE = cue("s2-3", "envers") - 0.5,
    tB = cue("s2-5", "cerveau") - 0.5;
  const EX = 1040,
    EY = 540,
    R = 300,
    LX = EX - R * 0.62,
    RX = EX + R * 0.96;
  onDraw("s2", (t) => {
    // l'objet regardé : un sapin
    let s =
      `<path d="M130 850 H700" class="ink" stroke-width="6"/>` +
      treeSVG(330, 760, 440 + 6 * Math.sin(t * 2)) +
      eyeCutSVG(EX, EY, R);
    // deux rayons : du haut et du bas du sapin, ils se croisent dans le cristallin
    const pr = ramp(t, tPr, tPr + 1.0);
    [
      [330, 330, C.fire],
      [330, 750, C.blue],
    ].forEach(([x0, y0, col], i) => {
      const y1 = EY + (i ? -1 : 1) * 110,
        mid = Math.min(1, pr * 2),
        end = Math.max(0, pr * 2 - 1);
      s += `<path d="M${x0} ${y0} L${f2(lerp(x0, LX, mid))} ${f2(lerp(y0, EY, mid))}" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="26 12" stroke-dashoffset="${f2(-t * 90)}"/>`;
      if (end > 0)
        s += `<path d="M${LX} ${EY} L${f2(lerp(LX, RX, end))} ${f2(lerp(EY, y1, end))}" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="26 12" stroke-dashoffset="${f2(-t * 90)}"/>`;
    });
    // l'image sur la rétine : petite, et la tête en bas
    const im = ramp(t, tR, tR + 0.4),
      pulse = t > tE && t < tE + 2 ? 1 + 0.12 * Math.abs(Math.sin((t - tE) * 6)) : 1;
    if (im > 0)
      s += `<g opacity="${f2(im)}" transform="translate(${RX - 60} ${EY}) rotate(180) scale(${f2(0.5 * pulse)})">${treeSVG(0, 220, 440)}</g>`;
    // le cerveau la remet à l'endroit
    const b = ramp(t, tB, tB + 0.5);
    if (b > 0) {
      const flip = ramp(t, tB + 0.6, tB + 1.4);
      s += `<g opacity="${f2(b)}">${brainSVG(1620, 300, 0.95)}<rect x="1500" y="440" width="240" height="280" rx="24" fill="#fff" class="ink" stroke-width="5"/><g transform="translate(1620 580) rotate(${f2(180 * (1 - flip))}) scale(0.5)">${treeSVG(0, 220, 440)}</g><path d="M${RX + 10} ${EY} Q1440 ${EY} 1500 560" fill="none" stroke="${C.hot}" stroke-width="9" stroke-dasharray="12 16" stroke-dashoffset="${f2(-t * 80)}" stroke-linecap="round"/></g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  const l1 = label(
    "s2",
    "s2-l1",
    [LX, EY - 100],
    [470, 170],
    "Le cristallin",
    "une petite loupe transparente",
  );
  const l2 = label(
    "s2",
    "s2-l2",
    [EX + R * 0.7, EY + 220],
    [1400, 790],
    "La rétine",
    "l’écran, au fond de l’œil",
  );
  showLabel(l1, tC + 0.2);
  showLabel(l2, tR + 0.3);
  pop("#s2-n1", tE + 0.5);
})();
