// ---------- Scène 4 : l'équateur (chaud toute l'année) et les pôles (six mois de jour, six mois de nuit) ----------
(() => {
  const tCh = cue("s4-2", "chaud") - 0.5,
    tPo = cue("s4-2", "pôles") - 0.6,
    tJo = cue("s4-2", "jour") - 1.0,
    tNu = cue("s4-2", "nuit") - 1.0,
    tTr = cue("s4-4", "trente") - 0.5;
  onDraw("s4", (t) => {
    const po = ramp(t, tPo, tPo + 0.6);
    let g =
      sunSVG(300, 540, 100, t) + tiltEarthSVG(900, 540, 250, -23, t * 20) + nightSVG(900, 540, 250);
    const ch = ramp(t, tCh, tCh + 0.4);
    g +=
      `<g transform="rotate(-23 900 540)"><ellipse cx="900" cy="540" rx="250" ry="34" fill="${C.fire}" opacity="${f2(0.55 * (0.3 + 0.7 * ch))}"/></g>` +
      (ch > 0
        ? txt(1360, 560, "L’équateur", 54, { w: 700, fill: "#C25E00", op: ch }) +
          arrowSVG(1340, 540, 1170, 480, C.fire, 12, ch)
        : "");
    let s = `<g opacity="${f2(1 - po)}">${g}</g>`;
    if (po > 0) {
      // au pôle : le Soleil tourne au ras de l'horizon sans se coucher… puis la longue nuit
      const night = ramp(t, tNu, tNu + 1.0),
        a = t * 0.9;
      let h = `<rect x="130" y="190" width="1660" height="660" rx="34" fill="${mixHex("#BFE4FF", "#1B2445", night)}" class="ink" stroke-width="5"/><clipPath id="s4-c"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s4-c)">`;
      if (night < 1)
        h += `<g opacity="${f2(1 - night)}">${sunSVG(960 + 620 * Math.cos(a), 560 + 70 * Math.sin(a) + 300 * night, 70, t)}</g>`;
      if (night > 0)
        for (let i = 0; i < 40; i++)
          h += `<circle cx="${f2(160 + rnd(i) * 1600)}" cy="${f2(210 + rnd(i + 50) * 360)}" r="${f2(2 + 2.5 * rnd(i + 9))}" fill="#fff" opacity="${f2(night * (0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))))}"/>`;
      h += `<path d="M130 640 Q500 600 900 650 T1790 630 V860 H130 Z" fill="#fff" class="ink" stroke-width="5"/><path d="M700 650 Q700 520 830 520 Q960 520 960 650 Z" fill="#EAF6FF" class="ink" stroke-width="6"/><path d="M800 650 V600 Q800 580 830 580 Q860 580 860 600 V650 Z" fill="${C.ink}"/></g>`;
      h += txt(960, 300, night > 0.5 ? "Six mois de nuit" : "Six mois de jour", 70, {
        w: 700,
        fill: night > 0.5 ? "#fff" : "#C25E00",
        op: ramp(t, tJo, tJo + 0.4),
      });
      const tr = ramp(t, tTr, tTr + 0.3);
      if (tr > 0)
        h += `<g transform="translate(1440 720) rotate(-6) scale(${f2(tr * (1 + 0.04 * Math.sin(t * 6)))})">${txt(0, 0, "− 30 °C", 110, { w: 700, fill: C.blue })}</g>`;
      s += `<g opacity="${f2(po)}">${h}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tCh + 0.5);
  show("#s4-n2", tNu + 0.4);
})();
