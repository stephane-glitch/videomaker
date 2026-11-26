// ---------- Scène 4 : des milliards de mini-aimants : en désordre dans un clou (ils s'annulent), alignés dans un aimant (ils s'additionnent) ----------
(() => {
  const tMi = cue("s4-2", "milliards") - 0.5,
    tCl = cue("s4-2", "clou") - 0.6,
    tAn = cue("s4-2", "annulent") - 0.6,
    tAl = cue("s4-2", "alignés") - 0.8,
    tAd = cue("s4-2", "additionnent") - 0.7,
    tAr = cue("s4-3", "armée") - 0.5;
  const mini = (x, y, a, k = 1) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(a)}) scale(${k})"><rect x="-26" y="-9" width="26" height="18" fill="#E0455E"/><rect x="0" y="-9" width="26" height="18" fill="#3D7BFF"/><rect x="-26" y="-9" width="52" height="18" rx="3" fill="none" class="ink" stroke-width="3"/></g>`;
  const grid = (cx, cy, t, al, on) => {
    let s = "";
    for (let i = 0; i < 24; i++) {
      const x = cx - 175 + (i % 6) * 70,
        y = cy - 105 + Math.floor(i / 6) * 70,
        k = ramp(t, on + i * 0.03, on + 0.2 + i * 0.03);
      if (k > 0)
        s += `<g opacity="${f2(k)}">${mini(x, y, lerp(rnd(i + 11) * 360 + 25 * Math.sin(t * 1.5 + i), 3 * Math.sin(t * 3 + i), al))}</g>`;
    }
    return s;
  };
  onDraw("s4", (t) => {
    let s = panelSVG();
    const cl = ramp(t, tCl, tCl + 0.4),
      al = ramp(t, tAl, tAl + 0.4);
    // à gauche, le clou ; à droite, l'aimant
    const q = ramp(t, tMi - 0.3, tMi);
    if (q < 1)
      s += `<g opacity="${f2(1 - q)}">${barMagnetSVG(960, 520 + 6 * Math.sin(t * 2), 620, 140)}${txt(960, 350, "?", 150, { w: 700, fill: "#C25E00" })}</g>`;
    s += `<g opacity="${f2(q * (0.35 + 0.65 * Math.max(cl, 1 - al)))}"><rect x="250" y="340" width="560" height="360" rx="30" fill="#D3DAE6" class="ink" stroke-width="5"/>${grid(530, 520, t, 0, tMi)}${txt(530, 300, "dans un clou", 46, { w: 700, fill: C.ink, op: cl })}</g>`;
    const an = ramp(t, tAn, tAn + 0.3);
    if (an > 0) s += txt(530, 780, "ils s’annulent", 46, { w: 700, fill: "#B02A45", op: an });
    if (al > 0) {
      const sweep = ramp(t, tAl + 0.2, tAl + 1.2);
      s += `<g opacity="${f2(al)}"><rect x="1110" y="340" width="560" height="360" rx="30" fill="#FFE9B0" class="ink" stroke-width="5"/>${grid(1390, 520, t, sweep, tAl)}${txt(1390, 300, "dans un aimant", 46, { w: 700, fill: C.ink })}</g>`;
      const ad = ramp(t, tAd, tAd + 0.4);
      if (ad > 0)
        s += arrowSVG(1200, 770, 1200 + 380 * ad + 10 * Math.sin(t * 5), 770, "#2E9E6B", 30, ad);
    }
    const ar = ramp(t, tAr, tAr + 0.3);
    if (ar > 0)
      s += `<g transform="translate(960 236) scale(${f2(ar)})">${txt(0, 0, "Une armée bien rangée", 44, { w: 700, fill: C.blueD })}</g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tAn + 0.5);
  pop("#s4-n2", tAd + 0.6);
})();
