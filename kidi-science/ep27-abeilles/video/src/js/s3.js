// ---------- Scène 3 : le nectar est trop liquide : les abeilles battent des ailes pour le sécher, puis ferment l'alvéole d'un bouchon de cire ----------
(() => {
  const tLi = cue("s3-1", "liquide") - 0.6,
    tBa = cue("s3-1", "battent") - 0.6,
    tVe = cue("s3-2", "ventilateurs") - 0.5,
    tPr = cue("s3-3", "prêt") - 0.5,
    tBo = cue("s3-3", "bouchon") - 0.8;
  onDraw("s3", (t) => {
    const dry = ramp(t, tBa, tPr),
      ba = ramp(t, tBa, tBa + 0.4);
    let s = panelSVG(130, 190, 1660, 660, "#F3D58A");
    const R = 86;
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 9; c++) {
        const x = 330 + c * R * 1.74 + (r % 2 ? R * 0.87 : 0),
          y = 610 + r * R * 1.5,
          i = r * 9 + c;
        if (x > 1690) continue;
        const cap = ramp(t, tBo + i * 0.12, tBo + 0.3 + i * 0.12);
        s +=
          cellSVG(x, y, R, mixHex("#FFF0A8", "#E9A21A", dry), cap) +
          (cap < 0.5
            ? `<path d="M${f2(x - 30)} ${f2(y + 6 * Math.sin(t * 4 + i) * (1 - dry))} q15 ${f2(-10 * (1 - dry))} 30 0 t30 0" fill="none" stroke="#fff" stroke-width="5" opacity="${f2(0.7 * (1 - dry))}"/>`
            : "");
      }
    // les ventileuses et leur courant d'air
    for (let i = 0; i < 4; i++) {
      const x = 440 + i * 350;
      s += beeSVG(x, 380 + 8 * Math.sin(t * 5 + i), 1.3, t * (1 + 2 * ba) + i, i % 2 ? -1 : 1);
      if (ba > 0)
        for (let j = 0; j < 2; j++) {
          const u = (t * 1.2 + rnd(i * 3 + j)) % 1;
          s += `<path d="M${x - 40 + j * 80} ${f2(440 + u * 90)} q10 14 0 28" fill="none" stroke="${C.blue}" stroke-width="7" stroke-linecap="round" opacity="${f2(ba * Math.sin(u * Math.PI) * 0.8)}"/>`;
        }
    }
    const li = ramp(t, tLi, tLi + 0.3) * (1 - ramp(t, tVe - 0.3, tVe));
    if (li > 0) s += txt(960, 270, "trop liquide…", 54, { w: 700, fill: "#C25E00", op: li });
    const ve = ramp(t, tVe, tVe + 0.3) * (1 - ramp(t, tPr - 0.3, tPr));
    if (ve > 0)
      s += txt(960, 270, "Des ventilateurs vivants !", 54, { w: 700, fill: C.blueD, op: ve });
    const pr = ramp(t, tPr, tPr + 0.3);
    if (pr > 0) s += txt(960, 270, "Le miel est prêt !", 60, { w: 700, fill: "#8A5A00", op: pr });
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tBa + 0.6);
  pop("#s3-n2", tBo + 0.8);
})();
