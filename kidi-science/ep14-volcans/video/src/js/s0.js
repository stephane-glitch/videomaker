// ---------- Scène 0 : le volcan ne crache pas du feu : c'est de la roche fondue, à mille degrés ----------
(() => {
  // l'icône du générique devient un petit volcan pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<path d="M10 132 L54 50 H96 L140 132 Z" fill="#6B5B4E" class="ink" stroke-width="5"/><path d="M54 50 H96 L104 66 Q88 84 80 64 Q66 90 46 64 Z" fill="#E0455E" class="ink" stroke-width="4"/><circle cx="60" cy="26" r="9" fill="#FF8A1F" class="ink" stroke-width="3"/><circle cx="92" cy="16" r="7" fill="#E0455E" class="ink" stroke-width="3"/>`;
  const tF = cue("s0-2", "feu") - 0.4,
    tR = cue("s0-2", "fondue") - 0.6,
    tC = cue("s0-3", "caramel") - 0.5,
    tM = cue("s0-4", "mille") - 0.3;
  onDraw("s0", (t) => {
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` +
      coneSVG(260, 1060, 850, 400, 150) +
      `<path d="M585 400 H735 L770 460 Q720 520 700 460 Q660 560 620 460 Q590 500 550 462 Z" fill="#E0455E" class="ink" stroke-width="5"/>` +
      lavaSVG(660, 400, t) +
      smokeSVG(660, 360, t, 1, "#C8CDD6", 10, 220);
    // « du feu » ? non : la flamme barrée
    const x = ramp(t, tF, tF + 0.3) * (1 - ramp(t, tC - 0.3, tC));
    if (x > 0)
      s += `<g opacity="${f2(x)}" transform="translate(1360 500) scale(${f2(0.7 + 0.3 * x)})">${flameSVG(0, 130, 260, t)}<path d="M-130 -150 L130 150 M130 -150 L-130 150" stroke="#E0455E" stroke-width="30" stroke-linecap="round"/></g>`;
    const r = ramp(t, tR, tR + 0.4) * (1 - ramp(t, tC - 0.3, tC));
    if (r > 0)
      s += `<g opacity="${f2(r)}">${txt(1360, 740, "Roche fondue", 56, { w: 700, fill: "#C25E00" })}</g>`;
    // le caramel… à mille degrés
    const c = ramp(t, tC, tC + 0.4);
    if (c > 0) {
      let g = `<path d="M-130 -60 H130 V40 Q130 80 90 80 H-90 Q-130 80 -130 40 Z" fill="#9AA6B8" class="ink" stroke-width="6"/><path d="M130 -30 H250" class="ink" stroke-width="22" stroke-linecap="round"/><path d="M-110 -44 H110 V-10 Q0 20 -110 -10 Z" fill="#D98A2B"/>`;
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.9 + i / 4) % 1;
        g += `<circle cx="${-60 + i * 40}" cy="${f2(-60 - u * 50)}" r="${f2(10 * (1 - u))}" fill="#D98A2B" class="ink" stroke-width="3"/>`;
      }
      s += `<g opacity="${f2(c)}" transform="translate(1320 ${f2(600 + 6 * Math.sin(t * 2))})">${g}</g>`;
      const m = ramp(t, tM, tM + 0.3);
      if (m > 0)
        s += `<g transform="translate(1360 380) rotate(-6) scale(${f2(m * (1 + 0.04 * Math.sin(t * 6)))})">${txt(0, 0, "1 000 °C", 130, { w: 700, fill: "#E0455E" })}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  pop("#s0-n1", cue("s0-2", "brille") - 0.4);
})();
