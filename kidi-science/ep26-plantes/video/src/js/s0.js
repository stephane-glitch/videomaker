// ---------- Scène 0 : d'une graine minuscule à un arbre énorme ; il ne mange pas la terre : il se fabrique surtout avec de l'air ----------
(() => {
  // l'icône du générique devient une jeune pousse pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<path d="M75 136 V66" stroke="#2E9E6B" stroke-width="12" stroke-linecap="round"/><path d="M75 70 Q30 66 22 22 Q66 22 75 70 Z M75 86 Q118 80 130 40 Q88 40 75 86 Z" fill="#5BE39A" class="ink" stroke-width="5" stroke-linejoin="round"/>`;
  const tGr = cue("s0-1", "graine") - 0.5,
    tAr = cue("s0-1", "arbre") - 0.6,
    tTe = cue("s0-3", "terre") - 0.5,
    tNo = cue("s0-4", "non") - 0.2,
    tAi = cue("s0-4", "air") - 0.6;
  onDraw("s0", (t) => {
    let s =
      daySkySVG(130, 190, 1660, 660, t, 14, "s0", 2) +
      `<clipPath id="s0-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s0-k)"><rect x="130" y="700" width="1660" height="160" fill="#8A5A2B"/><path d="M130 700 H1790" class="ink" stroke-width="5"/></g>`;
    const gr = ramp(t, tGr, tGr + 0.3),
      ar = ramp(t, tAr, tAr + 0.8);
    s += `<g opacity="${f2(gr)}"><ellipse cx="430" cy="${f2(660 - 8 * Math.abs(Math.sin(t * 3)))}" rx="26" ry="18" fill="#C98B4B" class="ink" stroke-width="4"/>${txt(430, 600, "une graine", 40, { w: 700, fill: C.ink })}</g>`;
    if (ar > 0)
      s +=
        arrowSVG(560, 640, 560 + 300 * ar, 640, C.ink, 14, ar) +
        `<g transform="translate(1300 700) scale(${f2(ar)})">${leafTreeSVG(0, 0, 470, "#3DBE8B", 0, t)}</g>`;
    // l'idée de Zoé : il mange la terre
    const te = ramp(t, tTe, tTe + 0.3) * (1 - ramp(t, tAi - 0.3, tAi));
    if (te > 0) {
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.8 + i / 5) % 1;
        s += `<circle cx="${f2(1200 + i * 50)}" cy="${f2(800 - u * 110)}" r="12" fill="#5E4630" opacity="${f2(te * (1 - u))}"/>`;
      }
      const x = ramp(t, tNo, tNo + 0.2);
      if (x > 0)
        s += `<g transform="translate(1300 770) scale(${f2(1.3 - 0.3 * x)})" opacity="${f2(x)}"><path d="M-70 -50 L70 50 M70 -50 L-70 50" stroke="#E0455E" stroke-width="24" stroke-linecap="round"/></g>`;
    }
    // l'air qui entre dans le feuillage
    const ai = ramp(t, tAi, tAi + 0.4);
    if (ai > 0) {
      for (let i = 0; i < 8; i++) {
        const a = rnd(i) * TAU,
          u = (t * 0.6 + rnd(i + 4)) % 1,
          d = 330 - u * 200;
        s += `<path d="M${f2(1300 + d * Math.cos(a))} ${f2(410 + d * 0.7 * Math.sin(a))} q14 -14 28 0 t28 0" fill="none" stroke="${C.blue}" stroke-width="7" stroke-linecap="round" opacity="${f2(ai * Math.sin(u * Math.PI))}"/>`;
      }
      s += txt(900, 330, "de l’air !", 70, { w: 700, fill: C.blueD, op: ai });
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tNo + 0.3);
  pop("#s0-n2", tAi + 0.5);
})();
