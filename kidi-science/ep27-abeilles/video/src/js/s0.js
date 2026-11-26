// ---------- Scène 0 : le miel ne vient pas d'une cuisine : tout commence dans une fleur, avec le nectar ----------
(() => {
  // l'icône du générique devient une abeille pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<ellipse cx="62" cy="48" rx="26" ry="16" fill="#fff" class="ink" stroke-width="4"/><ellipse cx="92" cy="50" rx="22" ry="13" fill="#fff" class="ink" stroke-width="4"/><ellipse cx="72" cy="88" rx="50" ry="34" fill="#FFD23F" class="ink" stroke-width="5"/><path d="M56 56 V120 M80 54 V122" stroke="#1F2A44" stroke-width="10"/><circle cx="118" cy="84" r="20" fill="#1F2A44"/>`;
  const tMi = cue("s0-1", "miel") - 0.5,
    tCu = cue("s0-1", "cuisine") - 0.6,
    tFl = cue("s0-2", "fleur") - 0.6,
    tNe = cue("s0-4", "nectar") - 0.8;
  onDraw("s0", (t) => {
    const fl = ramp(t, tFl, tFl + 0.5);
    let s = daySkySVG(130, 190, 1660, 660, t, 12, "s0", 2);
    if (fl < 1) {
      const cu = ramp(t, tCu, tCu + 0.3);
      let g =
        `<g transform="translate(640 620)" opacity="${f2(ramp(t, tMi, tMi + 0.3))}"><rect x="-120" y="-150" width="240" height="250" rx="36" fill="${C.hot}" class="ink" stroke-width="6"/><rect x="-136" y="-186" width="272" height="46" rx="14" fill="#fff" class="ink" stroke-width="6"/><text x="0" y="0" text-anchor="middle" font-size="64" font-weight="700" fill="${C.ink}">miel</text></g>` +
        beeSVG(1000 + 60 * Math.sin(t * 1.5), 470 + 30 * Math.sin(t * 2.3), 1.3, t);
      // la toque de cuisinier
      if (cu > 0)
        g +=
          `<g opacity="${f2(cu)}" transform="translate(${f2(1062 + 60 * Math.sin(t * 1.5))} ${f2(410 + 30 * Math.sin(t * 2.3))})"><rect x="-22" y="-10" width="44" height="22" fill="#fff" class="ink" stroke-width="3"/><circle cx="-16" cy="-22" r="16" fill="#fff" class="ink" stroke-width="3"/><circle cx="16" cy="-22" r="16" fill="#fff" class="ink" stroke-width="3"/><circle cx="0" cy="-30" r="18" fill="#fff" class="ink" stroke-width="3"/></g>` +
          txt(1300, 480, "?", 180, { w: 700, fill: "#C25E00", op: cu });
      s += `<g opacity="${f2(1 - fl)}">${g}</g>`;
    }
    if (fl > 0) {
      // la fleur, et la goutte de nectar au fond
      const ne = ramp(t, tNe, tNe + 0.4);
      let g =
        `<path d="M960 560 Q${f2(950 + 6 * Math.sin(t * 2))} 720 960 846" stroke="#2E9E6B" stroke-width="22" stroke-linecap="round" fill="none"/>` +
        leafSVG(958, 760, 150, -30) +
        daisySVG(960, 480 + 5 * Math.sin(t * 2), 150, "#FF8FB0", t);
      if (ne > 0)
        g +=
          `<circle cx="960" cy="${f2(480 + 5 * Math.sin(t * 2))}" r="${f2(30 + 5 * Math.sin(t * 5))}" fill="#FFE9A0" class="ink" stroke-width="4" opacity="${f2(ne)}"/>` +
          arrowSVG(1300, 420, 1020, 470, C.ink, 12, ne) +
          txt(1440, 410, "le nectar", 64, { w: 700, fill: "#C25E00", op: ne });
      s += `<g opacity="${f2(fl)}">${g}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tFl + 0.5);
  pop("#s0-n2", tNe + 0.5);
})();
