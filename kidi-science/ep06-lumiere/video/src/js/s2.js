// ---------- Scène 2 : le prisme sépare la lumière blanche ; l'arc-en-ciel ----------
(() => {
  const tBeam = cue("s2-2", "blanche") - 0.6,
    tPr = cue("s2-2", "prisme") - 0.5,
    tSplit = cue("s2-2", "séparent") - 1.0,
    tBow = cue("s2-3", "arc") - 0.6;
  onDraw("s2", (t) => {
    const bow = ramp(t, tBow, tBow + 0.7);
    let s = "";
    if (bow < 1) {
      // le faisceau blanc, le prisme, puis l'éventail de couleurs
      const spread = ramp(t, tSplit, tSplit + 1.2),
        pr = lin(t, tPr, tPr + 0.4),
        beam = lin(t, tBeam, tBeam + 0.6);
      let g = raySVG(140, 620, 760, 540, "#FFFFFF", beam, 26);
      if (pr > 0) {
        RAINBOW.forEach((c, i) => {
          // le rouge est le moins dévié, le violet le plus
          const ang = rad(6 + spread * (i * 7.5));
          g += raySVG(
            900,
            540,
            900 + 800 * Math.cos(ang),
            540 + 800 * Math.sin(ang),
            spread > 0.05 ? c : "#FFFFFF",
            lin(t, tPr + 0.3, tPr + 0.9),
            lerp(26, 16, spread),
          );
        });
        g += `<path d="M830 300 L1010 700 H650 Z" fill="#CFEFFF" fill-opacity="0.75" class="ink" stroke-width="6" opacity="${f2(pr)}"/><path d="M800 420 L740 640" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="${f2(pr * 0.8)}"/>`;
      }
      s += `<g opacity="${f2(1 - bow)}">${g}</g>`;
    }
    if (bow > 0) {
      // le Soleil derrière, la pluie devant, l'arc-en-ciel au milieu
      let g =
        sunSVG(260, 420, 100, t) +
        `<path d="M120 860 H1800" class="ink" stroke-width="8"/>` +
        figSVG(640, 856, 1.3, C.blue);
      const arc = lin(t, tBow + 0.4, tBow + 1.6);
      RAINBOW.forEach((c, i) => {
        const r = 520 - i * 26,
          a1 = Math.PI + arc * Math.PI;
        g += `<path d="M${1260 - r} 860 A${r} ${r} 0 0 1 ${f2(1260 + r * Math.cos(a1))} ${f2(860 + r * Math.sin(a1))}" fill="none" stroke="${c}" stroke-width="26"/>`;
      });
      for (let i = 0; i < 26; i++) {
        const u = (t * 0.9 + rnd(i)) % 1;
        g += `<path d="M${f2(900 + rnd(i + 30) * 860)} ${f2(260 + u * 560)} l-10 34" stroke="${C.air}" stroke-width="7" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
      }
      s += `<g opacity="${f2(bow)}">${g}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tBeam + 0.5);
  tl.to("#s2-n1", { opacity: 0, duration: 0.3 }, tBow - 0.1);
  ["Rouge", "orange", "jaune", "vert", "bleu", "violet"].forEach((w, i) =>
    pop(`#s2-cols .c:nth-child(${i + 1})`, cue("s2-3", w) - 0.1),
  );
  show("#s2-n2", cue("s2-4", "dos") - 0.6);
})();
