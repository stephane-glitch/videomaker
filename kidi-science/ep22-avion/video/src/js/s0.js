// ---------- Scène 0 : un avion lourd comme cent éléphants tient en l'air… grâce à l'air, qui pousse ----------
(() => {
  // l'icône du générique devient un avion pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<path d="M20 84 L62 70 L104 22 L120 26 L98 72 L132 78 L132 92 L98 92 L78 130 L64 128 L70 96 L30 100 Z" fill="#fff" class="ink" stroke-width="5" stroke-linejoin="round"/>`;
  const tEl = cue("s0-1", "éléphants") - 0.8,
    tTi = cue("s0-1", "tient") - 0.4,
    tAi = cue("s0-2", "air") - 0.4,
    tRi = cue("s0-3", "rien") - 0.4,
    tCo = cue("s0-4", "cours") - 0.6,
    tPo = cue("s0-4", "pousse") - 0.5;
  onDraw("s0", (t) => {
    const co = ramp(t, tCo, tCo + 0.5);
    let s = daySkySVG(130, 190, 1660, 660, t, 60, "s0");
    let g = planeSVG(960, 400 + 14 * Math.sin(t * 1.6), 1.7, -3 + 2 * Math.sin(t * 1.1));
    const el = ramp(t, tEl, tEl + 0.3) * (1 - ramp(t, tAi - 0.3, tAi));
    if (el > 0) {
      for (let i = 0; i < 5; i++) {
        const k = ramp(t, tEl + i * 0.1, tEl + 0.2 + i * 0.1);
        g += `<g opacity="${f2(k * el)}">${elephSVG(520 + i * 220, 740 + 4 * Math.sin(t * 3 + i), 0.5)}</g>`;
      }
      g += txt(960, 650, "= 100 éléphants", 54, { w: 700, fill: C.ink, op: el });
    }
    const q = ramp(t, tTi, tTi + 0.2) * (1 - ramp(t, tAi - 0.3, tAi));
    if (q > 0) g += txt(1420, 460, "?", 180, { w: 700, fill: "#C25E00", op: q });
    const ai = ramp(t, tAi, tAi + 0.3) * (1 - ramp(t, tRi + 1.2, tRi + 1.5));
    if (ai > 0) {
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.8 + rnd(i)) % 1;
        g += arrowSVG(
          700 + i * 100,
          720 - u * 60,
          700 + i * 100,
          640 - u * 60,
          C.blue,
          12,
          ai * Math.sin(u * Math.PI),
        );
      }
      g += txt(960, 790, "l’air", 60, { w: 700, fill: C.blueD, op: ai });
    }
    s += `<g opacity="${f2(1 - co)}">${g}</g>`;
    // quand on court, l'air pousse sur le visage
    if (co > 0) {
      let h =
        `<path d="M136 760 H1784" stroke="${C.ink}" stroke-width="5"/>` +
        figSVG(900 + 30 * Math.sin(t * 2), 760 - 6 * Math.abs(Math.sin(t * 9)), 2.2, C.blue);
      const po = ramp(t, tPo, tPo + 0.3);
      for (let i = 0; i < 7; i++) {
        const u = (t * 1.3 + rnd(i + 4)) % 1;
        h += `<path d="M${f2(1700 - u * 620)} ${f2(380 + i * 52)} h-110" stroke="${C.blue}" stroke-width="${f2(9 + 5 * po)}" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI) * 0.8)}"/>`;
      }
      s += `<g opacity="${f2(co)}">${h}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tEl + 0.6);
  tl.to("#s0-n1", { opacity: 0, duration: 0.3 }, tCo);
  pop("#s0-n2", tPo + 0.2);
})();
