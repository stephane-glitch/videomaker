// ---------- Scène 2 : les cinq goûts ; puis la fausse carte de la langue ----------
(() => {
  const T = ["sucré", "salé", "acide", "amer", "umami"].map((w) => cue("s2-2", w) - 0.35),
    tU = cue("s2-4", "bouillon") - 1.2,
    tM = cue("s2-5", "carte") - 0.6,
    tX = cue("s2-6", "fausse") - 0.3,
    tAll = cue("s2-6", "Toute") - 0.3;
  const COL = ["#F7A8B8", "#8FD3FF", "#FFE14D", "#8A9A5B", "#FF8A1F"],
    NAMES = ["Sucré", "Salé", "Acide", "Amer", "Umami"];
  const icon = (i, t) =>
    [
      `<rect x="-50" y="-34" width="100" height="68" rx="20" fill="#F7A8B8" class="ink" stroke-width="5"/><path d="M-50 0 L-90 -30 V30 Z M50 0 L90 -30 V30 Z" fill="#F7A8B8" class="ink" stroke-width="5"/>`,
      `<rect x="-40" y="-50" width="80" height="110" rx="18" fill="#fff" class="ink" stroke-width="5"/><rect x="-46" y="-76" width="92" height="36" rx="12" fill="#9AA6B8" class="ink" stroke-width="5"/>` +
        saltSVG(-10, 10, 6, 20) +
        saltSVG(14, 30, 6, 50),
      `<ellipse rx="76" ry="56" fill="#FFE14D" class="ink" stroke-width="5"/><path d="M-76 0 l-20 -6 M76 0 l20 6" class="ink" stroke-width="8" stroke-linecap="round"/>`,
      `<path d="M0 -80 Q50 -20 34 60 Q0 86 -34 60 Q-50 -20 0 -80 Z" fill="#F4F1C9" class="ink" stroke-width="5"/><path d="M0 -70 V70 M-20 -20 Q-10 30 -16 66 M20 -20 Q10 30 16 66" fill="none" stroke="#B7DB8A" stroke-width="6"/>`,
      `<path d="M-80 -10 H80 Q80 70 0 70 Q-80 70 -80 -10 Z" fill="#fff" class="ink" stroke-width="5"/><ellipse cy="-10" rx="80" ry="18" fill="#E6B45A" class="ink" stroke-width="5"/>` +
        [0, 1]
          .map(
            (k) =>
              `<path d="M${-24 + k * 48} ${f2(-40 - ((t * 30 + k * 20) % 40))} q12 -12 0 -24" fill="none" stroke="${C.smoke}" stroke-width="7" stroke-linecap="round"/>`,
          )
          .join(""),
    ][i];
  onDraw("s2", (t) => {
    const m = ramp(t, tM, tM + 0.5),
      hi = ramp(t, tU, tU + 0.4) * (1 - m);
    let s = "";
    // la question de Zoé : combien de goûts ?
    const q = 1 - ramp(t, T[0] - 0.2, T[0] + 0.1);
    if (q > 0)
      s += `<g opacity="${f2(q)}">${tongueSVG(760, 540 + 6 * Math.sin(t * 2), 0.8)}${txt(1160, 620 + 8 * Math.sin(t * 5), "?", 260, { w: 700, fill: C.fire })}</g>`;
    if (m < 1)
      for (let i = 0; i < 5; i++) {
        const k = ramp(t, T[i], T[i] + 0.35);
        if (k <= 0) continue;
        const h = i === 4 ? hi : 0;
        s += `<g transform="translate(${260 + i * 350} ${f2(520 + 30 * (1 - k) + 6 * Math.sin(t * 2.4 + i))}) scale(${f2(0.92 + 0.12 * h)})" opacity="${f2(k * (1 - m) * (i === 4 ? 1 : 1 - 0.5 * hi))}"><rect x="-150" y="-190" width="300" height="380" rx="34" fill="#fff" stroke="${h > 0.5 ? C.fire : C.ink}" stroke-width="${f2(4 + 4 * h)}"/><rect x="-150" y="96" width="300" height="94" rx="0" fill="${COL[i]}" opacity="0.5"/><g transform="translate(0 -50)">${icon(i, t)}</g>${txt(0, 160, NAMES[i], 44, { w: 700 })}</g>`;
      }
    if (m > 0) {
      // la vieille carte de la langue… barrée ; puis toute la langue s'allume
      const all = ramp(t, tAll, tAll + 0.6),
        x = ramp(t, tX, tX + 0.25);
      let g = tongueSVG(700, 540, 1.05, 0.5);
      const zones = [
        [0, 0, 220, "Sucré", 0],
        [-120, 60, 120, "Salé", 1],
        [120, 60, 120, "Salé", 1],
        [-125, -90, 110, "Acide", 2],
        [125, -90, 110, "Acide", 2],
        [0, -200, 60, "Amer", 3],
      ];
      g += `<clipPath id="s2-t"><path d="M${700 - 157} ${540 - 273} H${700 + 157} V${540 + 63} Q${700 + 157} ${540 + 273} 700 ${540 + 273} Q${700 - 157} ${540 + 273} ${700 - 157} ${540 + 63} Z"/></clipPath><g clip-path="url(#s2-t)" opacity="${f2(0.75 * (1 - all))}">`;
      zones.forEach(
        ([dx, dy, r, , ci]) =>
          (g += `<circle cx="${700 + dx}" cy="${540 + dy + (ci === 0 ? 200 : 0)}" r="${ci === 0 ? 90 : r * 0.7}" fill="${COL[ci]}"/>`),
      );
      g += `</g>`;
      if (all > 0)
        for (let i = 0; i < 40; i++) {
          const bx = 700 + (rnd(i) - 0.5) * 260,
            by = 300 + rnd(i + 40) * 440;
          if (Math.hypot((bx - 700) / 160, (by - 540) / 270) > 0.85) continue;
          g += `<circle cx="${f2(bx)}" cy="${f2(by)}" r="${f2(14 + 5 * Math.sin(t * 5 + i))}" fill="${COL[i % 5]}" stroke="${C.ink}" stroke-width="2.5" opacity="${f2(all)}"/>`;
        }
      if (x > 0 && all < 1)
        g +=
          `<g opacity="${f2(1 - all)}" transform="translate(700 540) scale(${f2(1.6 - 0.6 * x)})"><path d="M-170 -170 L170 170 M170 -170 L-170 170" stroke="#E0455E" stroke-width="34" stroke-linecap="round"/></g>` +
          `<g transform="translate(1260 520) rotate(-8) scale(${f2(x)})" opacity="${f2(1 - all)}"><rect x="-190" y="-80" width="380" height="160" rx="24" fill="none" stroke="#E0455E" stroke-width="12"/>${txt(0, 38, "FAUX !", 110, { w: 700, fill: "#E0455E" })}</g>`;
      if (all > 0)
        for (let i = 0; i < 5; i++)
          g += `<g opacity="${f2(all)}"><circle cx="1120" cy="${340 + i * 96}" r="26" fill="${COL[i]}" class="ink" stroke-width="4"/>${txt(1170, 356 + i * 96, NAMES[i] + " : partout", 44, { w: 700, anchor: "start" })}</g>`;
      s += `<g opacity="${f2(m)}">${g}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tU + 0.4);
  tl.to("#s2-n1", { opacity: 0, duration: 0.3 }, tM - 0.2);
  pop("#s2-n2", tAll + 0.5);
})();
