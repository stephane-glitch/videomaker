// ---------- Scène 5 : le chien et ses 300 millions de capteurs ; notre nez, lui, donne l'alerte ----------
(() => {
  const tQ = cue("s5-2", "quelques") - 0.4,
    tD = cue("s5-2", "trois") - 0.5,
    tT = cue("s5-2", "trace") - 0.8,
    tA = cue("s5-4", "prévient") - 1.0,
    TA = [cue("s5-4", "fumée"), cue("s5-4", "lait"), cue("s5-4", "gaz")].map((x) => x - 0.4);
  onDraw("s5", (t) => {
    const a = ramp(t, tA, tA + 0.6);
    let s = "";
    if (a < 1) {
      let g =
        `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` +
        figSVG(300, 848, 2.0, C.blue) +
        dogSVG(760, 848, 1.15, t);
      // les deux barres : nos capteurs, ceux du chien
      const h = ramp(t, tQ, tQ + 0.4),
        d = ramp(t, tD, tD + 1.0);
      if (h > 0)
        g +=
          `<rect x="250" y="${f2(430 - 14 * h)}" width="100" height="${f2(14 * h)}" rx="6" fill="${C.blue}" class="ink" stroke-width="4"/>` +
          txt(300, 390, "quelques millions", 34, { w: 700, op: h });
      if (d > 0)
        g +=
          `<rect x="720" y="${f2(430 - 300 * d)}" width="100" height="${f2(300 * d)}" rx="10" fill="${C.fire}" class="ink" stroke-width="4"/>` +
          txt(770, 100, `${Math.round(300 * d)} millions`, 44, { w: 700, fill: "#C25E00", op: d });
      // la trace : des empreintes que le chien suit
      const tr = ramp(t, tT, tT + 1.6);
      for (let i = 0; i < 8; i++)
        if (tr > i / 8)
          g += `<g transform="translate(${1080 + i * 84} ${810 + (i % 2) * 22}) rotate(${i % 2 ? 14 : -14})" opacity="${f2(0.9 - i * 0.07)}"><ellipse rx="18" ry="22" fill="${C.ink}"/><circle cx="-18" cy="-28" r="7" fill="${C.ink}"/><circle cx="0" cy="-36" r="7" fill="${C.ink}"/><circle cx="18" cy="-28" r="7" fill="${C.ink}"/></g>`;
      s += `<g opacity="${f2(1 - a)}">${g}</g>`;
    }
    if (a > 0) {
      // les alertes du nez : fumée, lait tourné, gaz
      const icon = [
        () => smokeSVG(0, 60, t, 1, "#C8CDD6", 9, 150),
        () =>
          `<path d="M-44 -70 H44 V-40 L60 0 V80 H-60 V0 L-44 -40 Z" fill="#fff" class="ink" stroke-width="5"/><path d="M-60 20 H60" class="ink" stroke-width="4"/>${txt(0, 62, "LAIT", 28, { w: 700 })}` +
          [0, 1]
            .map(
              (i) =>
                `<path d="M${-20 + i * 40} ${f2(-90 - ((t * 30 + i * 20) % 40))} q12 -12 0 -24" fill="none" stroke="#B7DB8A" stroke-width="7" stroke-linecap="round"/>`,
            )
            .join(""),
        () =>
          `<ellipse cx="0" cy="60" rx="70" ry="16" fill="#39425C" class="ink" stroke-width="5"/>` +
          flameSVG(0, 50, 130, t, { blue: true }),
      ];
      ["La fumée", "Le lait tourné", "Le gaz"].forEach((n, i) => {
        const k = ramp(t, TA[i], TA[i] + 0.35);
        if (k > 0)
          s += `<g transform="translate(${420 + i * 440} ${f2(540 + 30 * (1 - k))})" opacity="${f2(a * k)}"><rect x="-180" y="-220" width="360" height="400" rx="34" fill="#fff" class="ink" stroke-width="4"/><g transform="translate(0 -50)">${icon[i]()}</g>${txt(0, 140, n, 38, { w: 700 })}</g>`;
      });
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tT + 0.6);
  tl.to("#s5-n1", { opacity: 0, duration: 0.3 }, tA - 0.1);
  pop("#s5-n2", cue("s5-4", "alarme") - 0.3);
})();
