// ---------- Scène 2 : la Lune tourne autour de la Terre ; selon sa place, on voit plus ou moins de sa moitié éclairée ----------
(() => {
  const tT = cue("s2-1", "tourne") - 0.4,
    tNw = cue("s2-2", "nouvelle") - 2.6,
    tAu = cue("s2-2", "autre") - 0.3,
    tFu = cue("s2-2", "pleine") - 1.2,
    tCr = cue("s2-3", "croissant") - 0.6,
    tQu = cue("s2-3", "quartier") - 0.5,
    tPh = cue("s2-4", "phases") - 0.6;
  const EX = 760,
    EY = 540,
    R = 240;
  // la position de la Lune sur son orbite (0 = entre le Soleil et nous, 0,5 = de l'autre côté)
  const pos = (t) => {
    if (t < tNw) return 0.1 + (t - tT) * 0.06;
    if (t < tAu) return lerp(0.1 + (tNw - tT) * 0.06, 1, ramp(t, tNw, tNw + 1.2)) % 1;
    if (t < tCr) return lerp(0, 0.5, ramp(t, tAu, tFu));
    if (t < tQu) return lerp(0.5, 1.12, ramp(t, tCr - 0.4, tCr + 0.6));
    if (t < tPh) return lerp(1.12, 1.25, ramp(t, tQu, tQu + 0.6));
    return 1.25 + (t - tPh) * 0.16;
  };
  const NAMES = [
    [0.03, "Nouvelle lune"],
    [0.22, "Croissant"],
    [0.28, "Premier quartier"],
    [0.47, "Lune gibbeuse"],
    [0.53, "Pleine lune"],
    [0.72, "Lune gibbeuse"],
    [0.78, "Dernier quartier"],
    [0.97, "Croissant"],
    [1.01, "Nouvelle lune"],
  ];
  onDraw("s2", (t) => {
    const p = ((Math.max(0, pos(t)) % 1) + 1) % 1,
      a = p * TAU,
      mx = EX - R * Math.cos(a),
      my = EY + R * Math.sin(a);
    let s = nightSkySVG(130, 190, 1660, 660, t, 24);
    // le Soleil, loin à gauche, et ses rayons
    for (let i = 0; i < 6; i++) {
      const u = (t * 0.5 + rnd(i + 3)) % 1;
      s += `<path d="M${f2(160 + u * 220)} ${300 + i * 96} h60" stroke="${C.hot}" stroke-width="10" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
    }
    s +=
      `<circle cx="${EX}" cy="${EY}" r="${R}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 14" opacity="0.5"/>` +
      earthSVG(EX, EY, 90, t * 30);
    s +=
      `<path d="M${f2(EX - 100 * Math.cos(a))} ${f2(EY + 100 * Math.sin(a))} L${f2(mx)} ${f2(my)}" stroke="${C.fire}" stroke-width="5" stroke-dasharray="10 10" opacity="0.8"/>` +
      rockMoonSVG(mx, my, 50);
    // ce que l'on voit depuis la Terre
    const name = NAMES.find(([lim]) => p <= lim)[1];
    s +=
      `<rect x="1240" y="250" width="500" height="540" rx="34" fill="#0F1630" class="ink" stroke-width="5"/>${txt(1490, 320, "Vue de la Terre", 40, { w: 700, fill: "#fff" })}` +
      phaseMoonSVG(1490, 520, 140, p, "#39425C") +
      txt(1490, 740, name, 46, { w: 700, fill: "#FFF6B0" });
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", cue("s2-1", "mois") - 0.6);
})();
