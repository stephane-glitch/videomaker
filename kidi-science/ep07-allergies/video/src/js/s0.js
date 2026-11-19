// ---------- Scène 0 : le printemps, un peu de pollen… et Zoé qui éternue ----------
(() => {
  const tA = cue("s0-1", "éternuer") - 0.2,
    tZ = cue("s0-4", "armée") - 0.6;
  onDraw("s0", (t) => {
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` +
      flowerSVG(420, 848, 1) +
      flowerSVG(660, 848, 0.7);
    // quelques grains de pollen dérivent vers le personnage
    for (let i = 0; i < 6; i++) {
      const u = (t * 0.16 + rnd(i)) % 1,
        x = 460 + u * 900,
        y = 470 - 110 * Math.sin(u * Math.PI) + rnd(i + 30) * 160;
      s += pollenSVG(x, y, 15, t + i, Math.sin(u * Math.PI));
    }
    // le personnage sursaute à chaque éternuement
    const k = t - tA,
      sn = k > 0 ? Math.exp(-((k % 2.6) * 4)) : 0;
    s += figSVG(1420 + sn * 26, 848, 2.4, C.blue);
    if (k > 0 && k % 2.6 < 1.4) {
      const u = (k % 2.6) / 1.4;
      for (let i = 0; i < 5; i++) {
        const a = rad(180 - 30 + i * 15);
        s += `<path d="M${f2(1330 + (40 + u * 60) * Math.cos(a))} ${f2(520 + (40 + u * 60) * Math.sin(a))} l${f2(46 * Math.cos(a))} ${f2(46 * Math.sin(a))}" stroke="${C.air}" stroke-width="10" stroke-linecap="round" opacity="${f2(1 - u)}"/>`;
      }
      s += txt(1150, 420, "Atchoum !", 84, { fill: C.fire, w: 700, op: 1 - u ** 4 });
    }
    // la loupe : on va regarder à l'intérieur
    const z = ramp(t, tZ, tZ + 0.6);
    if (z > 0)
      s += `<g opacity="${f2(z)}"><circle cx="1420" cy="650" r="${f2(60 + 50 * z)}" fill="#FFE9E6" class="ink" stroke-width="8"/>${guardSVG(1420, 650, 44 * z + 10, t)}</g>`;
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", cue("s0-2", "corps") - 0.3);
})();
