// ---------- Scène 1 : des milliards d'appareils reliés entre eux, et des serveurs qui gardent les vidéos ----------
(() => {
  const tMi = cue("s1-1", "milliards") - 0.5,
    tSe = cue("s1-1", "serveurs") - 0.6,
    tVi = cue("s1-2", "vidéo") - 0.5,
    tPl = cue("s1-3", "planète") - 0.8;
  const D = [
      [330, 330],
      [300, 560],
      [420, 740],
      [640, 420],
      [660, 660],
      [860, 300],
      [900, 560],
      [820, 760],
    ],
    HUB = [1100, 520],
    SV = [
      [1420, 400],
      [1600, 400],
      [1510, 650],
    ];
  onDraw("s1", (t) => {
    const pl = ramp(t, tPl, tPl + 0.5),
      se = ramp(t, tSe, tSe + 0.5),
      vi = ramp(t, tVi, tVi + 0.3);
    let g = panelSVG();
    D.forEach(([x, y], i) => {
      const k = ramp(t, tMi + i * 0.12, tMi + 0.3 + i * 0.12);
      if (k > 0) {
        g += `<path d="M${x} ${y} L${HUB[0]} ${HUB[1]}" stroke="${C.ink}" stroke-width="5" opacity="${f2(0.5 * k)}"/>`;
        const u = (t * 0.5 + rnd(i)) % 1;
        g += `<circle cx="${f2(lerp(x, HUB[0], u))}" cy="${f2(lerp(y, HUB[1], u))}" r="7" fill="${C.fire}" opacity="${f2(k)}"/>`;
      }
    });
    SV.forEach(
      ([x, y]) =>
        (g += `<path d="M${HUB[0]} ${HUB[1]} L${x} ${y}" stroke="${C.ink}" stroke-width="8" opacity="${f2(0.6 * se)}"/>`),
    );
    D.forEach(([x, y], i) => {
      const k = ramp(t, tMi + i * 0.12, tMi + 0.3 + i * 0.12);
      if (k > 0)
        g += `<g opacity="${f2(k)}">${i % 3 === 1 ? `<rect x="${x - 60}" y="${y - 40}" width="120" height="80" rx="12" fill="${C.ink}"/><rect x="${x - 50}" y="${y - 30}" width="100" height="60" rx="4" fill="#fff"/>` : i % 3 === 2 ? `<rect x="${x - 56}" y="${y - 28}" width="112" height="56" rx="26" fill="#5B6B88" class="ink" stroke-width="4"/><circle cx="${x - 28}" cy="${y}" r="9" fill="#fff"/><circle cx="${x + 28}" cy="${y}" r="9" fill="${C.hot}"/>` : phoneSVG(x, y, 0.5)}</g>`;
    });
    g += `<circle cx="${HUB[0]}" cy="${HUB[1]}" r="${f2(26 + 3 * Math.sin(t * 4))}" fill="${C.blueL}" class="ink" stroke-width="5"/>`;
    if (se > 0) {
      SV.forEach(
        ([x, y], i) =>
          (g += `<g opacity="${f2(se)}" transform="translate(0 ${f2(20 * (1 - se))})">${serverSVG(x, y, 0.8, t + i)}</g>`),
      );
      g += txt(1510, 270, "les serveurs", 50, { w: 700, fill: C.ink, op: se });
    }
    // une vidéo part d'un serveur vers un téléphone
    if (vi > 0) {
      const u = ((t - tVi) * 0.4) % 1,
        P = [SV[0], HUB, D[3]],
        [x, y] = along(P, u);
      g += `<g transform="translate(${f2(x)} ${f2(y)})" opacity="${f2(vi)}"><rect x="-34" y="-24" width="68" height="48" rx="10" fill="#E0455E" class="ink" stroke-width="4"/><path d="M-8 -12 L14 0 L-8 12 Z" fill="#fff"/></g>`;
    }
    let s = `<g opacity="${f2(1 - pl)}">${g}</g>`;
    if (pl > 0) {
      // de l'autre côté de la planète
      const u = ((t - tPl) * 0.45) % 1,
        a0 = rad(205),
        a1 = rad(-25),
        a = lerp(a0, a1, u),
        R = 250;
      let h =
        panelSVG() +
        earthSVG(960, 560, R, t * 8) +
        `<path d="M${f2(960 + R * Math.cos(a0))} ${f2(560 + R * Math.sin(a0))} A 330 330 0 0 1 ${f2(960 + R * Math.cos(a1))} ${f2(560 + R * Math.sin(a1))}" fill="none" stroke="${C.fire}" stroke-width="8" stroke-dasharray="14 14"/>`;
      h +=
        serverSVG(960 + (R + 70) * Math.cos(a1) + 50, 560 + (R + 70) * Math.sin(a1), 0.5, t) +
        phoneSVG(960 + (R + 60) * Math.cos(a0) - 40, 560 + (R + 60) * Math.sin(a0), 0.6);
      const px = 960 + (R + 80 * Math.sin(u * Math.PI) * 1.1) * Math.cos(a),
        py = 560 + (R + 80 * Math.sin(u * Math.PI) * 1.1) * Math.sin(a);
      h += `<g transform="translate(${f2(px)} ${f2(py)})"><rect x="-30" y="-22" width="60" height="44" rx="10" fill="#E0455E" class="ink" stroke-width="4"/><path d="M-7 -10 L12 0 L-7 10 Z" fill="#fff"/></g>`;
      s += `<g opacity="${f2(pl)}">${h}</g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tSe + 0.6);
})();
