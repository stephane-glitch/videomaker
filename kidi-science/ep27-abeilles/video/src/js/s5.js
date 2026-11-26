// ---------- Scène 5 : en butinant, l'abeille transporte le pollen de fleur en fleur ; grâce à elle, les fleurs deviennent des fruits ----------
(() => {
  const tPo = cue("s5-1", "pollen") - 0.6,
    tTr = cue("s5-1", "transporte") - 0.6,
    tFr = cue("s5-3", "fruits") - 0.8,
    tCe = cue("s5-3", "cerises") - 0.6;
  onDraw("s5", (t) => {
    const fr = ramp(t, tFr, tFr + 1.0);
    let s =
      daySkySVG(130, 190, 1660, 660, t, 12, "s5", 2) +
      `<clipPath id="s5-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s5-k)"><rect x="130" y="760" width="1660" height="100" fill="#7CC47A"/></g>`;
    const FX = [520, 1400],
      po = ramp(t, tPo, tPo + 0.5);
    FX.forEach((x, i) => {
      s +=
        `<path d="M${x} 600 V780" stroke="#2E9E6B" stroke-width="20" stroke-linecap="round"/>` +
        leafSVG(x, 700, 110, i ? -150 : -30);
      // la fleur de droite devient un fruit
      const k = i === 1 ? fr : 0;
      if (k < 1)
        s += `<g opacity="${f2(1 - k)}" transform="translate(${x} 540) scale(${f2(1 - 0.5 * k)}) translate(${-x} -540)">${daisySVG(x, 540, 110, i ? "#FFFFFF" : "#FF8FB0", t)}</g>`;
      if (k > 0)
        s += `<g opacity="${f2(k)}" transform="translate(${x} 540) scale(${f2(0.3 + 0.7 * k)})"><path d="M0 -70 q10 -40 40 -50" fill="none" stroke="#8A5A2B" stroke-width="10" stroke-linecap="round"/><path d="M0 -60 C-110 -100 -150 60 -60 110 Q0 130 60 110 C150 60 110 -100 0 -60 Z" fill="#E0455E" class="ink" stroke-width="6" stroke-linejoin="round"/><ellipse cx="-50" cy="0" rx="16" ry="34" fill="#fff" opacity="0.35"/></g>`;
    });
    // l'abeille : elle se charge de pollen à gauche, puis file à droite
    const u = clamp(lin(t, tTr, tTr + 2.6, 0, 1), 0, 1),
      bx = lerp(600, 1320, u),
      by = 420 - 120 * Math.sin(u * Math.PI) + 8 * Math.sin(t * 7);
    if (fr < 1)
      s += `<g opacity="${f2(1 - fr)}">${beeSVG(bx, by, 1.5, t, 1, Math.round(6 * po * (1 - 0.6 * ramp(u, 0.9, 1))))}</g>`;
    if (po > 0 && fr < 1) {
      for (let i = 0; i < 6; i++)
        s += `<circle cx="${f2(520 + (rnd(i) - 0.5) * 90)}" cy="${f2(540 + (rnd(i + 3) - 0.5) * 70 + 3 * Math.sin(t * 5 + i))}" r="8" fill="#FFB300" class="ink" stroke-width="2" opacity="${f2(po * (1 - fr))}"/>`;
      if (u >= 1)
        for (let i = 0; i < 4; i++)
          s += `<circle cx="${f2(1400 + (rnd(i + 8) - 0.5) * 80)}" cy="${f2(540 + (rnd(i + 12) - 0.5) * 60)}" r="8" fill="#FFB300" class="ink" stroke-width="2" opacity="${f2(1 - fr)}"/>`;
      s += txt(960, 300, u > 0 ? "de fleur en fleur" : "le pollen", 56, {
        w: 700,
        fill: "#7A5200",
        op: po * (1 - fr),
      });
    }
    if (fr > 0) {
      const ce = ramp(t, tCe, tCe + 0.3);
      s += txt(960, 300, "une fleur devient un fruit", 56, { w: 700, fill: "#B02A45", op: fr });
      if (ce > 0)
        s += `<g opacity="${f2(ce)}" transform="translate(960 ${f2(600 + 6 * Math.sin(t * 3))})"><path d="M0 -110 Q-40 -40 -50 20 M0 -110 Q40 -40 50 30" fill="none" stroke="#2E9E6B" stroke-width="8"/><circle cx="-50" cy="50" r="42" fill="#C2183D" class="ink" stroke-width="5"/><circle cx="50" cy="60" r="42" fill="#C2183D" class="ink" stroke-width="5"/></g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tTr + 1.0);
  pop("#s5-n2", tFr + 1.0);
})();
