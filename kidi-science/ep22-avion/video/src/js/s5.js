// ---------- Scène 5 : pour tourner, de petits volets dévient l'air et l'avion se penche ; les oiseaux font pareil ----------
(() => {
  const tVo = cue("s5-2", "volets") - 0.5,
    tDe = cue("s5-2", "dévient") - 0.5,
    tPe = cue("s5-2", "penche") - 0.6,
    tOi = cue("s5-3", "oiseaux") - 0.5;
  const bird = (x, y, k, t, ph) => {
    const f = Math.sin(t * 7 + ph);
    return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${k})"><path d="M0 0 Q-60 ${f2(-70 * f)} -130 ${f2(-30 * f)} Q-70 ${f2(-20 * f + 14)} 0 20 Q70 ${f2(-20 * f + 14)} 130 ${f2(-30 * f)} Q60 ${f2(-70 * f)} 0 0 Z" fill="#5B6B88" class="ink" stroke-width="4" stroke-linejoin="round"/><ellipse cx="0" cy="12" rx="22" ry="30" fill="#5B6B88" class="ink" stroke-width="4"/><path d="M-6 -16 L0 -34 L6 -16 Z" fill="${C.fire}"/></g>`;
  };
  onDraw("s5", (t) => {
    const oi = ramp(t, tOi, tOi + 0.5),
      pe = ramp(t, tPe, tPe + 0.8),
      vo = ramp(t, tVo, tVo + 0.3),
      de = ramp(t, tDe, tDe + 0.3);
    let s = daySkySVG(130, 190, 1660, 660, t, 40, "s5");
    // l'avion vu de derrière : il se penche et glisse sur le côté
    const roll = 24 * pe * Math.sin(Math.min(1, pe) * Math.PI * 0.5) + 2 * Math.sin(t * 1.4),
      x = 960 + 220 * pe * Math.sin((t - tPe) * 0.6),
      y = 520 + 8 * Math.sin(t * 1.8),
      fl = vo * 12 * (0.6 + 0.4 * Math.sin(t * 4));
    let g = `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(roll)})"><path d="M-520 -6 L-70 -30 H70 L520 -6 V10 L70 24 H-70 L-520 10 Z" fill="#fff" class="ink" stroke-width="5" stroke-linejoin="round"/><rect x="-500" y="${f2(8 - fl)}" width="170" height="18" rx="6" fill="#E0455E" class="ink" stroke-width="3" opacity="${f2(vo)}"/><rect x="330" y="${f2(8 + fl)}" width="170" height="18" rx="6" fill="#E0455E" class="ink" stroke-width="3" opacity="${f2(vo)}"/><path d="M-170 -190 H170 V-174 H-170 Z" fill="#fff" class="ink" stroke-width="5"/><path d="M-12 -30 L-8 -250 H8 L12 -30 Z" fill="#E0455E" class="ink" stroke-width="5"/><circle r="86" fill="#fff" class="ink" stroke-width="5"/><circle cx="-250" cy="40" r="40" fill="#D3DAE6" class="ink" stroke-width="5"/><circle cx="250" cy="40" r="40" fill="#D3DAE6" class="ink" stroke-width="5"/><circle cx="-250" cy="40" r="14" fill="${C.ink}"/><circle cx="250" cy="40" r="14" fill="${C.ink}"/></g>`;
    if (vo > 0 && pe < 0.3)
      g +=
        txt(500, 420, "volet", 44, { w: 700, fill: "#B02A45", op: vo }) +
        txt(1420, 420, "volet", 44, { w: 700, fill: "#B02A45", op: vo });
    if (de > 0 && pe < 1) {
      const u = (t * 1.2) % 1;
      g +=
        arrowSVG(540, 570, 540, 570 + 90 * u + 30, C.blue, 14, de * (1 - pe)) +
        arrowSVG(1380, 480, 1380, 480 - 90 * u - 30, C.blue, 14, de * (1 - pe));
    }
    s += `<g opacity="${f2(1 - oi)}">${g}</g>`;
    if (oi > 0) {
      const bx = 960 + 300 * Math.sin((t - tOi) * 0.7);
      s += `<g opacity="${f2(oi)}"><g transform="rotate(${f2(16 * Math.cos((t - tOi) * 0.7))} ${f2(bx)} 480)">${bird(bx, 480, 2.2, t, 0)}</g>${bird(430, 330 + 20 * Math.sin(t), 0.8, t, 1)}${bird(1520, 680 + 20 * Math.cos(t), 0.9, t, 2)}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tDe + 0.4);
  show("#s5-n2", cue("s5-4", "inventé") - 0.5);
})();
