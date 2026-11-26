// ---------- Scène 3 : quand le haut a l'été, le bas a l'hiver ; en Australie, Noël en plein été ----------
(() => {
  const tB = cue("s3-1", "bas") - 0.5,
    tAu = cue("s3-2", "Australie") - 0.8,
    tSh = cue("s3-3", "short") - 0.6,
    tSu = cue("s3-4", "surf") - 0.6;
  onDraw("s3", (t) => {
    const au = ramp(t, tAu, tAu + 0.6);
    // la Terre penchée : été en haut, hiver en bas
    let g =
      sunSVG(330, 540, 100, t) + tiltEarthSVG(960, 540, 240, -23, t * 20) + nightSVG(960, 540, 240);
    g +=
      txt(1300, 380, "Été", 70, { w: 700, fill: "#C25E00" }) +
      arrowSVG(1280, 360, 1120, 400, C.fire, 12, 0.9);
    const b = ramp(t, tB, tB + 0.4);
    if (b > 0)
      g += `<g opacity="${f2(b)}">${txt(1300, 760, "Hiver", 70, { w: 700, fill: C.blue })}${arrowSVG(1280, 740, 1120, 700, C.blue, 12, 0.9)}</g>`;
    let s = `<g opacity="${f2(1 - au)}">${g}</g>`;
    if (au > 0) {
      // la plage australienne à Noël
      const sh = ramp(t, tSh, tSh + 0.4),
        su = ramp(t, tSu, tSu + 0.6),
        bob = 14 * Math.sin(t * 3);
      let h =
        sunSVG(1500, 300, 90, t) +
        `<path d="M130 760 Q700 700 1100 850 H130 Z" fill="#F4E2B0" class="ink" stroke-width="5"/>` +
        seaSVG(900, 1790, 700, 850, t);
      const fx = lerp(520, 1300, su),
        fy = lerp(790, 690 + bob, su);
      if (su > 0)
        h += `<path d="M${f2(fx - 170)} ${f2(fy + 10)} Q${f2(fx)} ${f2(fy + 50)} ${f2(fx + 170)} ${f2(fy + 10)} Q${f2(fx)} ${f2(fy - 16)} ${f2(fx - 170)} ${f2(fy + 10)} Z" fill="${C.hot}" class="ink" stroke-width="5"/>`;
      h += figSVG(fx, fy, 2.2, "#E0455E");
      if (sh > 0)
        h += `<g opacity="${f2(sh)}"><path d="M${f2(fx - 62)} ${f2(fy - 340)} L${f2(fx)} ${f2(fy - 460)} L${f2(fx + 62)} ${f2(fy - 340)} Z" fill="#E0455E" class="ink" stroke-width="5"/><rect x="${f2(fx - 74)}" y="${f2(fy - 350)}" width="148" height="30" rx="14" fill="#fff" class="ink" stroke-width="4"/><circle cx="${f2(fx)}" cy="${f2(fy - 466)}" r="18" fill="#fff" class="ink" stroke-width="4"/><rect x="${f2(fx - 50)}" y="${f2(fy - 314)}" width="44" height="28" rx="10" fill="${C.ink}"/><rect x="${f2(fx + 6)}" y="${f2(fy - 314)}" width="44" height="28" rx="10" fill="${C.ink}"/><path d="M${f2(fx - 40)} ${f2(fy - 270)} Q${f2(fx)} ${f2(fy - 200)} ${f2(fx + 40)} ${f2(fy - 270)} Z" fill="#fff" class="ink" stroke-width="4"/></g>`;
      h += txt(520, 330, "25 décembre", 60, { w: 700, fill: "#C25E00" });
      s += `<g opacity="${f2(au)}">${h}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  pop("#s3-n1", tAu + 0.8);
})();
