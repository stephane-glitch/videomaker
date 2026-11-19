// ---------- Scène 6 : le résumé, puis les électrons qui se promènent (annonce de l'électricité) ----------
(() => {
  const S = scn("s6");
  // pictogrammes fixes des trois cartes
  let g = "";
  const COLS = ["#3A4256", "#E0455E", "#FFFFFF", "#5F86F0", "#FFD23F"];
  for (let j = 0; j < 3; j++)
    for (let i = 0; i < 4; i++)
      g += ball(45 + i * 70, 55 + j * 70, 30, COLS[(i + j * 2) % 5], { w: 3 });
  $("#s6-i1").innerHTML = g;
  $("#s6-i3").innerHTML =
    `<path d="M150 110 L84 190 M150 110 L216 190" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/>` +
    ball(84, 190, 34, "#fff") +
    ball(216, 190, 34, "#fff") +
    ball(150, 110, 58, "#E0455E");
  const tW = cue("s6-3", "électrons") - 0.6,
    tE = cue("s6-4", "sens") - 0.4,
    tBulb = cue("s6-4", "électricité") - 0.3;
  onDraw("s6", (t) => {
    // carte 2 : un petit atome dont les électrons tournent
    let a = `<ellipse cx="150" cy="130" rx="130" ry="46" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="4 10"/><ellipse cx="150" cy="130" rx="130" ry="46" transform="rotate(60 150 130)" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="4 10"/>`;
    for (let i = 0; i < 2; i++) {
      const an = t * 2 + i * 2,
        c = Math.cos(rad(i * 60)),
        sn = Math.sin(rad(i * 60)),
        ex = 130 * Math.cos(an),
        ey = 46 * Math.sin(an);
      a += ball(150 + ex * c - ey * sn, 130 + ex * sn + ey * c, 13, C.blueL, { w: 3 });
    }
    $("#s6-i2").innerHTML = a + ball(150, 130, 30, "#E0455E");
    // le fil : une rangée d'atomes ; les électrons sautent de l'un à l'autre, puis filent tous dans le même sens
    if (t > tW - 0.3) {
      let s = `<rect x="200" y="470" width="1300" height="180" rx="90" fill="#F2C9A0" class="ink" stroke-width="5"/>`;
      for (let i = 0; i < 7; i++) s += ball(300 + i * 184, 560, 58, "#D98B4A");
      const flow = ramp(t, tE, tE + 0.8);
      for (let i = 0; i < 7; i++) {
        // avant : un petit saut de temps en temps ; après : un défilement continu vers la droite
        const hop = (t - tW) * 0.6 + rnd(i) * 3,
          k = Math.floor(hop),
          u = easeIO(Math.min(1, (hop - k) * 2.2));
        const xa = 300 + ((i + k) % 7) * 184 + u * 184,
          ya = 480 - Math.sin(u * Math.PI) * 60;
        const xb = 220 + (((((t - tE) * 260 + i * 184) % 1288) + 1288) % 1288),
          yb = 478 + 8 * Math.sin(t * 6 + i);
        const x = lerp(xa, xb, flow),
          y = lerp(ya, yb, flow);
        if (x < 1500) s += ball(x, y, 17, C.spark, { w: 3 });
      }
      // l'ampoule au bout du fil
      const on = ramp(t, tBulb, tBulb + 0.4);
      s += `<path d="M1500 560 H1600" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/>`;
      if (on > 0)
        s += `<circle cx="1690" cy="540" r="${f2(150 * on)}" fill="${C.spark}" opacity="${f2(0.35 * on)}"/>`;
      s += `<path d="M1690 440 C 1770 440, 1800 520, 1750 580 C 1736 600, 1734 620, 1734 640 H1646 C 1646 620, 1644 600, 1630 580 C 1580 520, 1610 440, 1690 440 Z" fill="${mixHex("#FFFFFF", "#FFE14D", on)}" class="ink" stroke-width="5"/><rect x="1650" y="640" width="80" height="50" rx="10" fill="${C.metal}" class="ink"/>`;
      $("#s6-draw").innerHTML = s;
    }
  });
  show("#s6-k1", cue("s6-1", "atomes") - 0.4, { y: 50 });
  show("#s6-k2", cue("s6-1", "noyau") - 0.4, { y: 50 });
  show("#s6-k3", cue("s6-1", "molécules") - 0.4, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tW - 0.3);
  tl.fromTo("#s6-wire", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.5, ease: OUT }, tW);
  pop("#s6-next", tBulb + 0.4);
  const tEnd = S.end - 3.2;
  tl.to("#s6-main", { y: -200, opacity: 0, duration: 0.45, ease: INN }, tEnd);
  tl.fromTo(
    "#s6-end",
    { opacity: 0, scale: 0.5, y: 80 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
    tEnd + 0.4,
  );
  show("#s6-bye", tEnd + 0.9);
})();
