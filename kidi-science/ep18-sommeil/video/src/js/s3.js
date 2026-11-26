// ---------- Scène 3 : le corps : pendant le sommeil profond, l'hormone de croissance ; on grandit en dormant ----------
(() => {
  const tCr = cue("s3-1", "croissance") - 0.8,
    tOs = cue("s3-1", "os") - 0.4,
    tMu = cue("s3-1", "muscles") - 0.5,
    tGr = cue("s3-2", "grandit") - 0.5,
    tBa = cue("s3-4", "basketteuse") - 0.6;
  onDraw("s3", (t) => {
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` +
      bedSVG(180, 848, 1.0, t) +
      zzzSVG(430, 600, t);
    // les gouttes d'hormone partent du cerveau
    const h = ramp(t, tCr, tCr + 0.5);
    s += brainSVG(360, 380 + 6 * Math.sin(t * 2), 0.9);
    if (h > 0)
      for (let i = 0; i < 8; i++) {
        const u = (t * 0.3 + i / 8) % 1;
        s += `<circle cx="${f2(460 + u * 620)}" cy="${f2(400 + 120 * Math.sin(u * Math.PI) * (i % 2 ? 1 : -1) + u * 60)}" r="13" fill="#3DBE8B" class="ink" stroke-width="3" opacity="${f2(h * Math.sin(u * Math.PI))}"/>`;
      }
    // l'os qui s'allonge
    const o = ramp(t, tOs, tOs + 0.4),
      len = 220 + 120 * ramp(t, tOs, tGr + 1.5);
    if (o > 0)
      s +=
        `<g opacity="${f2(o)}" transform="translate(1200 460)"><rect x="${f2(-len / 2)}" y="-26" width="${f2(len)}" height="52" rx="20" fill="#FBF1D8" class="ink" stroke-width="6"/>` +
        [-1, 1]
          .map(
            (d) =>
              `<circle cx="${f2((d * len) / 2)}" cy="-24" r="34" fill="#FBF1D8" class="ink" stroke-width="6"/><circle cx="${f2((d * len) / 2)}" cy="24" r="34" fill="#FBF1D8" class="ink" stroke-width="6"/>`,
          )
          .join("") +
        `<rect x="${f2(-len / 2 + 6)}" y="-20" width="${f2(len - 12)}" height="40" fill="#FBF1D8"/>${arrowSVG(len / 2 + 60, 0, len / 2 + 130, 0, C.fire, 12, 0.9)}${arrowSVG(-len / 2 - 60, 0, -len / 2 - 130, 0, C.fire, 12, 0.9)}${txt(0, -90, "Les os s’allongent", 38, { w: 700 })}</g>`;
    // le muscle qui se répare
    const m = ramp(t, tMu, tMu + 0.4);
    if (m > 0)
      s += `<g opacity="${f2(m)}" transform="translate(1200 700)"><path d="M-160 20 Q-80 ${f2(-80 - 14 * Math.sin(t * 3))} 0 -30 Q80 ${f2(-80 - 14 * Math.sin(t * 3))} 160 20 Q0 80 -160 20 Z" fill="#F08A9B" class="ink" stroke-width="6"/><path d="M-30 -20 l60 30 M-30 10 l60 -30" stroke="#fff" stroke-width="12" stroke-linecap="round"/>${txt(0, 110, "Les muscles se réparent", 38, { w: 700 })}</g>`;
    // la toise au mur, puis le panier de basket
    const g = ramp(t, tGr, tGr + 0.4);
    if (g > 0)
      s +=
        `<g opacity="${f2(g)}"><path d="M1640 850 V300" class="ink" stroke-width="10"/>` +
        [0, 1, 2, 3, 4, 5]
          .map((i) => `<path d="M1640 ${800 - i * 90} h40" class="ink" stroke-width="6"/>`)
          .join("") +
        `<path d="M1600 ${f2(560 - 60 * ramp(t, tGr, tGr + 2))} l34 16 l-34 16 Z" fill="${C.fire}" class="ink" stroke-width="4"/></g>`;
    const b = ramp(t, tBa, tBa + 0.35);
    if (b > 0)
      s += `<g transform="translate(820 ${f2(300 - 60 * (1 - b))})" opacity="${f2(b)}"><rect x="-70" y="-90" width="140" height="100" rx="8" fill="#fff" class="ink" stroke-width="5"/><ellipse cy="20" rx="50" ry="12" fill="none" stroke="${C.fire}" stroke-width="9"/><circle cx="${f2(120 - 120 * ((t * 0.8) % 1))}" cy="${f2(-180 + 200 * ((t * 0.8) % 1) ** 2)}" r="34" fill="${C.fire}" class="ink" stroke-width="5"/></g>`;
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tGr + 0.3);
})();
