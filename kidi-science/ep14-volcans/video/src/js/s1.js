// ---------- Scène 1 : la Terre en couches : la croûte (une peau de pomme), le manteau, le noyau ----------
(() => {
  const tCr = cue("s1-1", "croûte") - 0.4,
    tP = cue("s1-1", "pomme") - 0.8,
    tMa = cue("s1-1", "manteau") - 0.5,
    tN = cue("s1-1", "noyau") - 0.5,
    tF = cue("s1-2", "four") - 0.4;
  const X = 700,
    Y = 540,
    R = 320;
  onDraw("s1", (t) => {
    const open = ramp(t, scn("s1").start + 0.3, scn("s1").start + 1.2),
      hot = 0.5 + 0.5 * Math.sin(t * 2);
    // la Terre, dont on retire un quartier pour voir l'intérieur
    let s =
      earthSVG(X, Y, R, 10) +
      `<clipPath id="s1-q"><path d="M${X} ${Y} L${X + R + 20} ${Y} A ${R + 20} ${R + 20} 0 0 0 ${f2(X + (R + 20) * Math.cos(rad(-90 * open)))} ${f2(Y + (R + 20) * Math.sin(rad(-90 * open)))} Z"/></clipPath><g clip-path="url(#s1-q)"><circle cx="${X}" cy="${Y}" r="${R}" fill="#8A5A22"/><circle cx="${X}" cy="${Y}" r="${R - 14}" fill="${mixHex("#E0652B", "#F08A3C", hot)}"/><circle cx="${X}" cy="${Y}" r="${f2(R * 0.5)}" fill="${C.hot}"/><circle cx="${X}" cy="${Y}" r="${f2(R * 0.22)}" fill="#FFF6B0"/></g><path d="M${X} ${Y} H${X + R} M${X} ${Y} L${f2(X + R * Math.cos(rad(-90 * open)))} ${f2(Y + R * Math.sin(rad(-90 * open)))}" class="ink" stroke-width="5"/>`;
    // des bouffées de chaleur qui montent dans le manteau
    for (let i = 0; i < 4; i++) {
      const u = (t * 0.3 + i / 4) % 1,
        a = rad(-20 - i * 18);
      s += `<circle cx="${f2(X + (R * 0.55 + u * R * 0.36) * Math.cos(a))}" cy="${f2(Y + (R * 0.55 + u * R * 0.36) * Math.sin(a))}" r="9" fill="#FFE14D" opacity="${f2(open * Math.sin(u * Math.PI))}"/>`;
    }
    // la pomme et sa peau
    const p = ramp(t, tP, tP + 0.4) * (1 - ramp(t, tMa - 0.2, tMa + 0.2));
    if (p > 0)
      s += `<g opacity="${f2(p)}" transform="translate(1440 ${f2(520 + 6 * Math.sin(t * 2))}) scale(${f2(0.8 + 0.2 * p)})"><path d="M0 -120 C -90 -190, -210 -120, -200 20 C -190 150, -90 220, 0 180 C 90 220, 190 150, 200 20 C 210 -120, 90 -190, 0 -120 Z" fill="#FBF1D8" stroke="#E0455E" stroke-width="12"/><path d="M0 -120 C -4 -170, 16 -200, 40 -220" fill="none" class="ink" stroke-width="9"/>${txt(0, 290, "la peau : très fine", 38, { w: 700 })}</g>`;
    // le four
    const f = ramp(t, tF, tF + 0.35);
    if (f > 0)
      s += `<g transform="translate(1440 ${f2(540 + 6 * Math.sin(t * 2))}) scale(${f2(f)})"><rect x="-170" y="-150" width="340" height="320" rx="26" fill="#39425C" class="ink" stroke-width="6"/><rect x="-130" y="-70" width="260" height="200" rx="16" fill="${mixHex("#E0652B", "#FFD23F", hot)}" class="ink" stroke-width="5"/><circle cx="-90" cy="-112" r="14" fill="#fff"/><circle cx="-40" cy="-112" r="14" fill="#fff"/><path d="M-110 -40 H110" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.6"/></g>`;
    $("#s1-draw").innerHTML = s;
  });
  const l1 = label(
    "s1",
    "s1-l1",
    [X + R - 6, Y - 90],
    [1130, 250],
    "La croûte",
    "là où nous vivons",
  );
  const l2 = label(
    "s1",
    "s1-l2",
    [X + R * 0.7, Y - 110],
    [1130, 400],
    "Le manteau",
    "une roche brûlante",
  );
  const l3 = label(
    "s1",
    "s1-l3",
    [X + R * 0.16, Y - 30],
    [1130, 560],
    "Le noyau",
    "tout au centre",
  );
  showLabel(l1, tCr + 0.2);
  showLabel(l2, tMa + 0.2);
  showLabel(l3, tN + 0.2);
  hideLabel(l1, tP - 0.2);
  [l2, l3].forEach((l) => hideLabel(l, tF - 0.3));
  show("#s1-n1", tP + 0.6);
})();
