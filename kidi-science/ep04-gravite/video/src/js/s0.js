// ---------- Scène 0 : la tartine tombe toujours par terre, jamais au plafond ----------
(() => {
  const S = scn("s0");
  const tFall = cue("s0-1", "tombe") - 0.5,
    tUp = cue("s0-1", "plafond") - 0.6,
    tG = cue("s0-2", "attire") - 0.5,
    tJam = cue("s0-3", "confiture") - 0.4;
  const G = 1500,
    Y0 = 470,
    FLOOR = 880; // pixels par seconde carrée : la chute suit y = ½ g t²
  const tLand = Math.sqrt((2 * (FLOOR - Y0)) / G);
  // deuxième chute, pour revoir l'effet quand Max explique
  const drops = [tFall, tG + 0.3, tJam - 1.2];
  onDraw("s0", (t) => {
    let s = `<path d="M120 906 H1800" class="ink" stroke-width="8"/>`;
    // la table
    s += `<rect x="160" y="500" width="520" height="40" rx="14" fill="#D9A66B" class="ink" stroke-width="5"/><path d="M220 540 V900 M620 540 V900" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/><path d="M220 540 V900 M620 540 V900" stroke="#D9A66B" stroke-width="16" stroke-linecap="round"/>`;
    // la tartine : elle glisse du bord, tombe en tournant, atterrit côté confiture
    let k = -1;
    drops.forEach((d, i) => {
      if (t >= d) k = i;
    });
    if (k < 0) s += toastSVG(560, 478, 0);
    else {
      const u = t - drops[k],
        slide = Math.min(1, u / 0.35);
      const tf = Math.max(0, u - 0.35),
        y = Math.min(FLOOR - 10, Y0 + 0.5 * G * tf * tf),
        land = tf >= tLand;
      const x = 560 + slide * 150 + Math.min(tf, tLand) * 90,
        rot = Math.min(180, (tf / tLand) * 180);
      s += toastSVG(x, land ? FLOOR - 4 : y, rot);
      if (land)
        s += `<path d="M${x - 150} ${FLOOR + 22} q30 -26 60 -4 q40 -30 80 2 q40 -28 80 0 q30 -20 60 6 Z" fill="#E0455E"/>`;
    }
    // la tartine fantôme qui monterait au plafond : barrée
    const up = lin(t, tUp, tUp + 0.5) * (1 - lin(t, tG - 0.3, tG));
    if (up > 0) {
      s +=
        `<g opacity="${f2(up * 0.6)}">${toastSVG(960, 330, 0, 0.8)}</g>` +
        arrowSVG(960, 470, 960, 400, C.smoke, 12, up) +
        `<path d="M900 270 L1020 390 M1020 270 L900 390" stroke="#E0455E" stroke-width="18" stroke-linecap="round" opacity="${f2(up)}"/>`;
    }
    // la Terre attire : de grandes flèches vers le bas
    const g = lin(t, tG, tG + 0.4);
    if (g > 0)
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.8 + i / 3) % 1;
        s += arrowSVG(
          880 + i * 90,
          300 + ph * 260,
          880 + i * 90,
          420 + ph * 260,
          C.fire,
          14,
          g * Math.sin(ph * Math.PI),
        );
      }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-logo", S.start + 0.5, { y: -20 });
  pop("#s0-n1", tUp + 0.3);
  tl.to("#s0-n1", { opacity: 0, duration: 0.25 }, tG - 0.2);
  pop("#s0-n2", cue("s0-2", "gravité") - 0.3);
  pop("#s0-n3", tJam);
})();
