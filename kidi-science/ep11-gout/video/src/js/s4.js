// ---------- Scène 4 : l'amer est une alarme (les poisons) ; les enfants y sont plus sensibles ----------
(() => {
  const tA = cue("s4-2", "alarme") - 0.4,
    tP = cue("s4-2", "poisons") - 0.5,
    tE = cue("s4-2", "enfants") - 0.5,
    tG = cue("s4-3", "grimace") - 0.4,
    tOK = cue("s4-4", "poison") - 0.6;
  const endive = (x, y, k) =>
    `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 -180 Q110 -60 80 130 Q0 190 -80 130 Q-110 -60 0 -180 Z" fill="#F4F1C9" class="ink" stroke-width="6"/><path d="M0 -160 V150 M-40 -60 Q-20 60 -34 140 M40 -60 Q20 60 34 140" fill="none" stroke="#B7DB8A" stroke-width="10" stroke-linecap="round"/></g>`;
  onDraw("s4", (t) => {
    const ok = ramp(t, tOK, tOK + 0.4);
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` +
      endive(420, 640 + 6 * Math.sin(t * 2), 1.1);
    // la grimace
    const gr = t > tG ? 1 : 0.5;
    s +=
      `<circle cx="800" cy="560" r="110" fill="#FFD9B8" class="ink" stroke-width="5"/><path d="M760 ${f2(530 - 8 * gr)} l30 14 l-30 14 M840 ${f2(530 - 8 * gr)} l-30 14 l30 14" fill="none" class="ink" stroke-width="7" stroke-linecap="round"/><path d="M760 620 q20 ${f2(-24 * gr)} 40 0 t40 0" fill="none" class="ink" stroke-width="7" stroke-linecap="round"/>` +
      (gr > 0.6
        ? `<path d="M780 640 Q800 ${f2(700 + 6 * Math.sin(t * 8))} 820 640 Z" fill="#F08A9B" class="ink" stroke-width="4"/>`
        : "");
    s += bellSVG(1180, 330, ramp(t, tA, tA + 0.3) * (1 - 0.9 * ok), t);
    // la baie empoisonnée
    const p = ramp(t, tP, tP + 0.4);
    if (p > 0)
      s += `<g opacity="${f2(p * (1 - 0.7 * ok))}" transform="translate(1180 ${f2(640 + 20 * (1 - p))})"><path d="M0 -90 Q30 -120 70 -110" fill="none" class="ink" stroke-width="7"/><circle cx="-34" cy="-10" r="56" fill="#8E5BD6" class="ink" stroke-width="5"/><circle cx="44" cy="20" r="50" fill="#8E5BD6" class="ink" stroke-width="5"/><g transform="translate(110 -80)"><path d="M0 -44 L46 36 H-46 Z" fill="${C.hot}" class="ink" stroke-width="5" stroke-linejoin="round"/>${txt(0, 26, "!", 46, { w: 700 })}</g></g>`;
    // enfants et adultes : la sensibilité à l'amer
    const e = ramp(t, tE, tE + 0.6);
    if (e > 0)
      s += `<g opacity="${f2(e)}"><path d="M1440 760 H1760" class="ink" stroke-width="5"/><rect x="1470" y="${f2(760 - 300 * e)}" width="110" height="${f2(300 * e)}" rx="10" fill="${C.fire}" class="ink" stroke-width="4"/><rect x="1630" y="${f2(760 - 150 * e)}" width="110" height="${f2(150 * e)}" rx="10" fill="${C.blue}" class="ink" stroke-width="4"/>${txt(1525, 810, "Enfant", 34, { w: 700 })}${txt(1685, 810, "Adulte", 34, { w: 700 })}${txt(1600, 420, "Sensibilité à l’amer", 34)}</g>`;
    // l'endive n'est pas du poison
    if (ok > 0)
      s += `<g transform="translate(540 480) scale(${f2(ok)})"><circle r="60" fill="#3DBE8B" class="ink" stroke-width="5"/><path d="M-26 0 L-6 22 L30 -20" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tP + 0.4);
  pop("#s4-n2", cue("s4-4", "grandissant") - 0.8);
})();
