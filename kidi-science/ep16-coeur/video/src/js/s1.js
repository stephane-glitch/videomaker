// ---------- Scène 1 : le sang, livreur (oxygène, nourriture) et éboueur (déchets) ----------
(() => {
  const tS = cue("s1-1", "sang") - 0.5,
    tO = cue("s1-1", "oxygène") - 0.8,
    tN = cue("s1-1", "nourriture") - 0.6,
    tD = cue("s1-3", "déchets") - 0.8,
    tE = cue("s1-4", "éboueur") - 0.5;
  onDraw("s1", (t) => {
    // deux voies : l'aller en haut, le retour en bas ; au bout, une cellule à livrer
    let s = `<rect x="130" y="300" width="1240" height="190" rx="40" fill="#FFE9E6" class="ink" stroke-width="5"/><rect x="130" y="560" width="1240" height="190" rx="40" fill="#E8ECF6" class="ink" stroke-width="5"/>`;
    s +=
      arrowSVG(300, 270, 520, 270, "#E0455E", 12, 0.9) +
      arrowSVG(520, 790, 300, 790, C.blue, 12, ramp(t, tD, tD + 0.4));
    // la cellule cliente
    s += `<g transform="translate(1560 ${f2(530 + 6 * Math.sin(t * 2))})"><ellipse rx="170" ry="200" fill="#EBDDFB" class="ink" stroke-width="6"/><circle cx="10" cy="10" r="56" fill="#C9B1EE" class="ink" stroke-width="5"/>${txt(0, -230, "Une cellule", 38, { w: 700 })}</g>`;
    const o2 = t > tO,
      food = t > tN;
    for (let i = 0; i < 6; i++) {
      const u = (t * 0.14 + i / 6) % 1,
        x = 170 + u * 1160;
      s += rbcSVG(
        x,
        395 + 14 * Math.sin(t * 2 + i),
        40,
        o2 && u < 0.92 ? "o2" : "",
        ramp(t, tS, tS + 0.4),
      );
      if (food && i % 2 === 0)
        s += `<circle cx="${f2(x + 70)}" cy="${f2(430 + 10 * Math.cos(t * 2 + i))}" r="14" fill="${C.hot}" class="ink" stroke-width="3"/>`;
      // le colis sauté dans la cellule
      if (o2 && u > 0.92) {
        const k = (u - 0.92) / 0.08;
        s += `<rect x="${f2(lerp(x - 16, 1480, k))}" y="${f2(lerp(335, 480, k))}" width="32" height="28" rx="6" fill="#8FD3FF" class="ink" stroke-width="3"/>`;
      }
    }
    // le retour : les sacs de déchets
    const d = ramp(t, tD, tD + 0.4);
    if (d > 0)
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.14 + i / 6) % 1;
        s += rbcSVG(1330 - u * 1160, 655 + 14 * Math.sin(t * 2 + i), 40, "co2", d);
      }
    // la casquette de livreur… et le gilet d'éboueur
    const e = ramp(t, tE, tE + 0.35);
    if (e > 0)
      s += `<g transform="translate(700 ${f2(200 + 6 * Math.sin(t * 3))}) scale(${f2(e)})"><rect x="-200" y="-56" width="400" height="112" rx="30" fill="#fff" class="ink" stroke-width="4"/>${txt(0, 16, "Livreur + éboueur", 42, { w: 700 })}</g>`;
    $("#s1-draw").innerHTML = s;
  });
  const l = label(
    "s1",
    "s1-l",
    [560, 380],
    [520, 190],
    "Un globule rouge",
    "il transporte l’oxygène",
  );
  showLabel(l, tO - 0.2);
  hideLabel(l, tE - 0.2);
  show("#s1-n1", tN + 0.4);
  show("#s1-n2", tD + 0.5);
})();
