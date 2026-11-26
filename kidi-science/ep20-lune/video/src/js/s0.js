// ---------- Scène 0 : la Lune change de forme… ni grignotée, ni cachée par l'ombre de la Terre : une histoire d'éclairage ----------
(() => {
  // l'icône du générique devient un croissant de Lune pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<circle cx="75" cy="75" r="56" fill="#FFF6B0" class="ink" stroke-width="5"/><circle cx="100" cy="58" r="48" fill="#FDF2E0"/>`;
  const tO = cue("s0-3", "ombre") - 0.6,
    tN = cue("s0-4", "non") - 0.2,
    tE = cue("s0-4", "éclairage") - 0.6;
  onDraw("s0", (t) => {
    const om = ramp(t, tO, tO + 0.5) * (1 - ramp(t, tE, tE + 0.5)),
      ph = ((t - scn("s0").start) * 0.13) % 1;
    let s =
      nightSkySVG(130, 190, 1660, 660, t) +
      `<g opacity="${f2(1 - 0.85 * om)}">${phaseMoonSVG(960, 520, 200, ph)}</g>`;
    // l'idée de Zoé : l'ombre de la Terre (c'est une éclipse, pas les phases)
    if (om > 0) {
      let g =
        sunSVG(360, 520, 80, t) +
        `<path d="M880 420 L1700 470 V570 L880 620 Z" fill="#000" opacity="0.45"/>` +
        earthSVG(840, 520, 100, t * 20) +
        `<circle cx="1500" cy="520" r="50" fill="#8E96A3" class="ink" stroke-width="4"/>`;
      const x = ramp(t, tN, tN + 0.2);
      if (x > 0)
        g += `<g transform="translate(1160 520) scale(${f2(1.4 - 0.4 * x)})" opacity="${f2(x)}"><path d="M-180 -180 L180 180 M180 -180 L-180 180" stroke="#E0455E" stroke-width="34" stroke-linecap="round"/></g>`;
      s += `<g opacity="${f2(om)}">${g}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tN + 0.3);
  pop("#s0-n2", tE + 0.3);
})();
