// ---------- Scène 2 : le pollen pris pour un ennemi ; les gardes fabriquent des antennes (anticorps) ----------
(() => {
  const tP = cue("s2-1", "pollen") - 0.4,
    tE = cue("s2-2", "ennemi") - 0.4,
    tA = cue("s2-2", "antennes") - 0.4,
    tS = cue("s2-4", "accrochées") - 0.8;
  const GX = 1000,
    GY = 530,
    MX = 1500,
    MY = 530,
    MR = 150;
  onDraw("s2", (t) => {
    let s = vesselSVG(t, "s2-clip");
    // le grain de pollen arrive tranquillement
    const u = ramp(t, tP, tP + 2.4);
    if (t >= tP) s += pollenSVG(lerp(150, 560, u), 520 + 26 * Math.sin(t * 1.4), 46, t * 0.4);
    // la cellule pleine de sacs
    const mIn = ramp(t, tS, tS + 0.6),
      stick = ramp(t, tS + 0.5, tS + 1.8);
    if (mIn > 0) s += `<g opacity="${f2(mIn)}">${mastSVG(MX, MY, MR, t, 0, 0)}</g>`;
    // les antennes sortent du garde, puis vont se planter sur la cellule
    const out = ramp(t, tA, tA + 1.0);
    if (out > 0)
      for (let i = 0; i < 8; i++) {
        const a0 = (i / 8) * TAU + t * 0.5,
          a1 = (i / 8) * TAU + 0.4;
        const x0 = GX + (70 + 90 * out) * Math.cos(a0),
          y0 = GY + (70 + 90 * out) * Math.sin(a0);
        const x1 = MX + (MR - 6) * Math.cos(a1),
          y1 = MY + (MR - 6) * Math.sin(a1);
        const r0 = (a0 * 180) / Math.PI + 90,
          r1 = (a1 * 180) / Math.PI + 90;
        s += antibodySVG(
          lerp(x0, x1, stick),
          lerp(y0, y1, stick),
          lerp(r0 % 360, r1, stick),
          1,
          out,
        );
      }
    s += guardSVG(GX, GY, 84, t, t > tE ? 1 : 0, -1);
    $("#s2-draw").innerHTML = s;
  });
  const lA = label(
    "s2",
    "s2-l-a",
    [GX + 120, GY - 130],
    [860, 150],
    "Les anticorps",
    "des antennes réglées sur le pollen",
  );
  showLabel(lA, cue("s2-2", "anticorps") - 0.3);
  hideLabel(lA, tS);
  const lM = label(
    "s2",
    "s2-l-m",
    [MX + 40, MY + 100],
    [1380, 900],
    "Une cellule pleine de sacs",
    "avec les antennes plantées dessus",
  );
  showLabel(lM, cue("s2-4", "sacs") - 0.5);
  pop("#s2-n1", cue("s2-3", "alerte") - 0.3);
})();
