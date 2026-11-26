// ---------- Scène 5 : la Terre est un aimant géant (son cœur de fer) ; l'aiguille de la boussole, un petit aimant, montre le nord ----------
(() => {
  const tMa = cue("s5-1", "marches") - 0.5,
    tTe = cue("s5-2", "Terre") - 0.3,
    tCo = cue("s5-3", "cœur") - 0.5,
    tBo = cue("s5-3", "boussole") - 0.8,
    tNo = cue("s5-3", "nord") - 0.5,
    tAi = cue("s5-4", "aiguille") - 0.4;
  onDraw("s5", (t) => {
    let s = nightSkySVG(130, 190, 1660, 660, t, 20);
    const te = ramp(t, tTe, tTe + 0.4),
      co = ramp(t, tCo, tCo + 0.4),
      bo = ramp(t, tBo, tBo + 0.5),
      ex = lerp(960, 620, bo);
    // la Terre et son champ
    if (co > 0)
      for (let j = 0; j < 3; j++)
        for (const sg of [-1, 1])
          s += `<path d="M${f2(ex)} 320 C ${f2(ex + sg * (220 + j * 110))} ${120 - j * 40}, ${f2(ex + sg * (220 + j * 110))} ${920 + j * 40}, ${f2(ex)} 720" fill="none" stroke="#C9A6FF" stroke-width="5" stroke-dasharray="20 16" stroke-dashoffset="${f2(t * 60)}" opacity="${f2(co * 0.8)}"/>`;
    s +=
      `<clipPath id="s5-c"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath>` +
      earthSVG(ex, 520, 200, t * 12);
    if (co > 0)
      s += `<g opacity="${f2(co)}"><circle cx="${f2(ex)}" cy="520" r="${f2(70 + 4 * Math.sin(t * 5))}" fill="#FF8A3D" class="ink" stroke-width="4"/>${barMagnetSVG(ex, 520, 110, 34, 90, true)}</g>`;
    if (t < tTe) s += txt(960, 800, "?", 90, { w: 700, fill: C.hot, op: ramp(t, tMa, tMa + 0.3) });
    if (te > 0 && bo < 1)
      s += txt(ex - 570, 300, "un aimant géant", 54, { w: 700, fill: "#fff", op: te * (1 - bo) });
    // la boussole : l'aiguille oscille puis se fixe vers le nord
    if (bo > 0) {
      const u = Math.max(0, t - tBo - 0.5),
        ang = 140 * Math.exp(-u * 1.3) * Math.cos(u * 5) + 2 * Math.sin(t * 3),
        ai = ramp(t, tAi, tAi + 0.3);
      s += `<g opacity="${f2(bo)}" transform="translate(1330 520)"><circle r="230" fill="#FFF8EC" class="ink" stroke-width="10"/><circle r="196" fill="none" class="ink" stroke-width="3" opacity="0.4"/>${txt(0, -140, "N", 60, { w: 700, fill: "#B02A45" })}${txt(0, 180, "S", 50, { w: 700, fill: C.ink })}${txt(-160, 18, "O", 50, { w: 700, fill: C.ink })}${txt(160, 18, "E", 50, { w: 700, fill: C.ink })}<g transform="rotate(${f2(ang)})"><path d="M0 -120 L26 0 H-26 Z" fill="#E0455E" class="ink" stroke-width="4" stroke-linejoin="round"/><path d="M0 120 L26 0 H-26 Z" fill="#3D7BFF" class="ink" stroke-width="4" stroke-linejoin="round"/></g><circle r="14" fill="${C.ink}"/></g>`;
      if (ai > 0)
        s += `<g opacity="${f2(ai)}">${txt(1330, 810, "un petit aimant !", 46, { w: 700, fill: C.hot })}</g>`;
      const no = ramp(t, tNo, tNo + 0.3) * (1 - ai);
      if (no > 0) s += txt(1330, 810, "toujours le nord", 46, { w: 700, fill: "#fff", op: no });
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tCo + 0.5);
  show("#s5-n2", tAi + 0.4);
})();
