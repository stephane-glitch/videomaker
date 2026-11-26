// ---------- Scène 4 : le cycle de l'eau : toujours la même, depuis les dinosaures ----------
(() => {
  const tMl = cue("s4-2", "milliards") - 1.0,
    tVe = cue("s4-3", "verre") - 0.6,
    tDi = cue("s4-4", "dinosaure") - 0.8;
  onDraw("s4", (t) => {
    let s =
      sunSVG(300, 280, 70, t) +
      mountSVG(1500, 300, 480, 760) +
      `<path d="M1040 850 Q1300 700 1790 760 V900 H1040 Z" fill="#CFE8B8" class="ink" stroke-width="5"/>`;
    s +=
      `<path d="M1500 560 Q1380 700 1080 780" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M1500 560 Q1380 700 1080 780" fill="none" stroke="#5FB4F0" stroke-width="22" stroke-linecap="round" stroke-dasharray="40 10" stroke-dashoffset="${f2(t * 70)}"/>` +
      seaSVG(130, 1090, 620, 850, t);
    // l'évaporation, le nuage qui voyage, la pluie sur la montagne : la boucle tourne sans fin
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.3 + i / 5) % 1;
      s += vaporSVG(430 + i * 110, 600 - u * 260, 18, Math.sin(u * Math.PI));
    }
    const go = (t * 0.12) % 1,
      cx = lerp(640, 1500, Math.min(1, go * 1.5));
    s +=
      cloudSVG(cx, 260, 1.2, go > 0.55 ? 0.5 : 0) +
      (go > 0.55 ? rainSVG(cx - 130, cx + 130, 300, 470, t, 10) : "");
    // la grande flèche du cycle et le compteur
    const k = ramp(t, tMl, tMl + 0.5);
    if (k > 0)
      s += `<g opacity="${f2(k)}" transform="translate(960 470) rotate(${f2(t * 30)})"><path d="M-90 0 A 90 90 0 1 1 0 90" fill="none" stroke="${C.fire}" stroke-width="16" stroke-linecap="round"/><path d="M0 60 L0 124 L-50 92 Z" fill="${C.fire}"/></g>`;
    // le verre d'eau… et le dinosaure qui a bu la même
    const v = ramp(t, tVe, tVe + 0.4);
    if (v > 0)
      s += `<g opacity="${f2(v)}" transform="translate(210 ${f2(500 + 6 * Math.sin(t * 2))})"><path d="M-60 -90 H60 L46 90 H-46 Z" fill="#fff" class="ink" stroke-width="6"/><path d="M-54 -30 H54 L44 82 H-44 Z" fill="#8FD3FF"/><g transform="translate(0 20) scale(0.3)">${cloudSVG(0, 0, 1)}</g></g>`;
    const d = ramp(t, tDi, tDi + 0.5);
    if (d > 0)
      s += `<g opacity="${f2(d)}" transform="translate(${f2(760 + 60 * (1 - d))} 520)"><path d="M120 60 Q200 40 250 100" fill="none" stroke="${C.ink}" stroke-width="40" stroke-linecap="round"/><path d="M120 60 Q200 40 250 100" fill="none" stroke="#3DBE8B" stroke-width="30" stroke-linecap="round"/><ellipse cx="40" cy="60" rx="130" ry="76" fill="#3DBE8B" class="ink" stroke-width="6"/><path d="M-50 20 Q-130 -60 -150 ${f2(40 + 20 * Math.sin(t * 2))}" fill="none" stroke="${C.ink}" stroke-width="50" stroke-linecap="round"/><path d="M-50 20 Q-130 -60 -150 ${f2(40 + 20 * Math.sin(t * 2))}" fill="none" stroke="#3DBE8B" stroke-width="40" stroke-linecap="round"/><ellipse cx="-160" cy="${f2(60 + 20 * Math.sin(t * 2))}" rx="44" ry="30" fill="#3DBE8B" class="ink" stroke-width="6"/><circle cx="-176" cy="${f2(50 + 20 * Math.sin(t * 2))}" r="6" fill="${C.ink}"/><rect x="-30" y="110" width="40" height="70" rx="12" fill="#3DBE8B" class="ink" stroke-width="6"/><rect x="80" y="110" width="40" height="70" rx="12" fill="#3DBE8B" class="ink" stroke-width="6"/></g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tMl + 0.6);
})();
