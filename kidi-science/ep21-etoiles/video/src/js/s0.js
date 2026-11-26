// ---------- Scène 0 : les étoiles ne sont pas des lampes accrochées au ciel : ce sont des soleils, très loin ----------
(() => {
  // l'icône du générique devient une étoile pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<path d="M75 12 L92 56 L138 58 L102 88 L114 134 L75 108 L36 134 L48 88 L12 58 L58 56 Z" fill="#FFC83D" class="ink" stroke-width="5" stroke-linejoin="round"/>`;
  const tLa = cue("s0-1", "lampes") - 0.5,
    tPa = cue("s0-2", "Pas") - 0.1,
    tSo = cue("s0-2", "soleil") - 0.5,
    tMi = cue("s0-3", "minuscules") - 0.5,
    tPh = cue("s0-4", "phares") - 0.7;
  const ST = [
    [420, 380],
    [700, 300],
    [960, 430],
    [1240, 310],
    [1500, 400],
    [560, 600],
    [1340, 620],
  ];
  onDraw("s0", (t) => {
    const la = ramp(t, tLa, tLa + 0.4) * (1 - ramp(t, tSo - 0.3, tSo)),
      so = ramp(t, tSo, tSo + 0.7) * (1 - ramp(t, tMi, tMi + 0.5)),
      ph = ramp(t, tPh, tPh + 0.5);
    let s = nightSkySVG(130, 190, 1660, 660, t, 36);
    let g = "";
    ST.forEach(([x, y], i) => {
      // l'idée de Zoé : des petites lampes au bout d'un fil
      if (la > 0)
        g += `<g opacity="${f2(la)}"><path d="M${x} 196 V${y - 30}" stroke="#C8CDD6" stroke-width="4"/><rect x="${x - 12}" y="${y - 36}" width="24" height="18" rx="4" fill="#8E96A3"/></g>`;
      if (i !== 2 || so === 0) g += starSVG(x, y, 12 + 4 * rnd(i), "#FFF6B0", t, i);
    });
    // une étoile vue de près : un soleil
    if (so > 0)
      g += `<g transform="translate(960 430) scale(${f2(0.15 + 1.1 * so)})">${sunSVG(0, 80, 130, t)}</g>`;
    const x = ramp(t, tPa, tPa + 0.2) * (1 - ramp(t, tSo - 0.3, tSo));
    if (x > 0)
      g += `<g transform="translate(960 520) scale(${f2(1.4 - 0.4 * x)})" opacity="${f2(x)}"><path d="M-170 -170 L170 170 M170 -170 L-170 170" stroke="#E0455E" stroke-width="34" stroke-linecap="round"/></g>`;
    s += `<g opacity="${f2(1 - ph)}">${g}</g>`;
    // les phares d'une voiture : énormes de près, minuscules au bout de la route
    if (ph > 0) {
      const u = (t - tPh) * 0.22,
        k = clamp(0.12 + u * u * 3, 0.12, 1.5);
      let h = `<path d="M960 470 L1500 846 H420 Z" fill="#2A3350"/><path d="M960 480 V846" stroke="#fff" stroke-width="6" stroke-dasharray="30 30" stroke-dashoffset="${f2(-t * 120)}" opacity="0.6"/>`;
      h += `<g transform="translate(960 ${f2(480 + k * 190)}) scale(${f2(k)})"><circle cx="-90" cy="0" r="90" fill="#FFF6B0" opacity="0.3"/><circle cx="90" cy="0" r="90" fill="#FFF6B0" opacity="0.3"/><rect x="-140" y="-70" width="280" height="130" rx="40" fill="#3DBE8B" class="ink" stroke-width="5"/><circle cx="-90" cy="0" r="34" fill="#FFF6B0" class="ink" stroke-width="4"/><circle cx="90" cy="0" r="34" fill="#FFF6B0" class="ink" stroke-width="4"/></g>`;
      s += `<g opacity="${f2(ph)}">${h}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tSo + 0.5);
  pop("#s0-n2", cue("s0-4", "loin") - 0.2);
})();
