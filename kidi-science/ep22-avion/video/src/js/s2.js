// ---------- Scène 2 : l'aile, penchée et bombée, renvoie l'air vers le bas ; l'air la pousse vers le haut : la portance ----------
(() => {
  const tPe = cue("s2-1", "penchée") - 0.5,
    tBo = cue("s2-1", "bombée") - 0.5,
    tBa = cue("s2-1", "bas") - 1.2,
    tHa = cue("s2-3", "haut") - 0.8,
    tPo = cue("s2-3", "portance") - 0.5,
    tMa = cue("s2-4", "main") - 0.6;
  // une ligne d'air : elle arrive de gauche, contourne l'aile et repart vers le bas
  const stream = (y0, k, t, n = 26) => {
    let d = "";
    for (let i = 0; i <= n; i++) {
      const x = 300 + (i / n) * 1320,
        u = (x - 960) / 420,
        bump = Math.exp(-u * u * 1.6),
        dy =
          (y0 < 520 ? -1 : 0.35) * 70 * bump * (1 - Math.abs(y0 - 520) / 260) +
          k * 125 * ramp(x, 900, 1500);
      d += `${i ? "L" : "M"}${f2(x)} ${f2(y0 + dy)}`;
    }
    return d;
  };
  onDraw("s2", (t) => {
    const ma = ramp(t, tMa, tMa + 0.5),
      pe = ramp(t, tPe, tPe + 0.6),
      ba = ramp(t, tBa, tBa + 0.8);
    let s = daySkySVG(130, 190, 1660, 660, t, 0, "s2", 0);
    let g = "";
    [320, 390, 460, 570, 630, 690].forEach((y, i) => {
      g += `<path d="${stream(y, pe * (0.4 + 0.6 * ba), t)}" fill="none" stroke="${C.blue}" stroke-width="7" stroke-linecap="round" stroke-dasharray="46 34" stroke-dashoffset="${f2(-t * 260 + i * 17)}" opacity="0.75"/>`;
    });
    g += airfoilSVG(960, 520 + 6 * Math.sin(t * 2), 620, 9 * pe);
    const bo = ramp(t, tBo, tBo + 0.3) * (1 - ramp(t, tBa, tBa + 0.3));
    if (bo > 0)
      g +=
        `<path d="M700 470 Q900 360 1240 520" fill="none" stroke="${C.fire}" stroke-width="12" stroke-linecap="round" opacity="${f2(bo)}" transform="rotate(9 960 520)"/>` +
        txt(960, 330, "bombée", 50, { w: 700, fill: "#C25E00", op: bo });
    if (ba > 0)
      g +=
        arrowSVG(1500, 560, 1560, 760, C.blueD, 18, ba) +
        txt(620, 808, "l’air est renvoyé vers le bas", 44, { w: 700, fill: C.blueD, op: ba });
    const ha = ramp(t, tHa, tHa + 0.4),
      po = ramp(t, tPo, tPo + 0.3);
    if (ha > 0)
      g +=
        arrowSVG(960, 470, 960, 470 - 190 * ha - 10 * Math.sin(t * 5), "#2E9E6B", 26, ha) +
        (po > 0 ? txt(1180, 300, "la portance", 60, { w: 700, fill: "#1F7A50", op: po }) : "");
    s += `<g opacity="${f2(1 - ma)}">${g}</g>`;
    // la main à plat devant le ventilateur : elle monte toute seule
    if (ma > 0) {
      let h = `<g transform="translate(420 540)"><circle r="150" fill="#fff" class="ink" stroke-width="6"/><g transform="rotate(${f2(t * 700)})"><path d="M0 0 Q50 -110 0 -130 Q-30 -70 0 0 Z M0 0 Q110 50 130 0 Q70 -30 0 0 Z M0 0 Q-50 110 0 130 Q30 70 0 0 Z M0 0 Q-110 -50 -130 0 Q-70 30 0 0 Z" fill="${C.blueL}"/></g><circle r="20" fill="${C.ink}"/><rect x="-16" y="150" width="32" height="110" fill="#AEB8C8" class="ink" stroke-width="5"/><rect x="-90" y="250" width="180" height="30" rx="12" fill="#AEB8C8" class="ink" stroke-width="5"/></g>`;
      for (let i = 0; i < 6; i++) {
        const u = (t * 1.4 + rnd(i)) % 1;
        h += `<path d="M${f2(620 + u * 500)} ${430 + i * 44} h90" stroke="${C.blue}" stroke-width="8" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI) * 0.8)}"/>`;
      }
      const up = 40 * Math.sin(t * 2.2);
      h +=
        `<g transform="translate(1320 ${f2(520 - 40 - up)}) rotate(-12)"><rect x="-150" y="-26" width="300" height="52" rx="26" fill="#FFD9B8" class="ink" stroke-width="5"/><rect x="150" y="-34" width="200" height="68" rx="10" fill="${C.blue}" class="ink" stroke-width="5"/></g>` +
        arrowSVG(1320, 420 - up, 1320, 320 - up, "#2E9E6B", 20);
      s += `<g opacity="${f2(ma)}">${h}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tBa + 0.8);
  pop("#s2-n2", tPo + 0.3);
})();
