// ---------- Scène 1 : dans la graine, une plante miniature et un stock de nourriture ; avec de l'eau, une racine descend, une tige monte ----------
(() => {
  const tMi = cue("s1-1", "miniature") - 0.6,
    tSt = cue("s1-1", "stock") - 0.6,
    tEa = cue("s1-3", "eau") - 0.5,
    tRa = cue("s1-3", "racine") - 0.5,
    tTi = cue("s1-3", "tige") - 0.5;
  onDraw("s1", (t) => {
    const ea = ramp(t, tEa, tEa + 0.5),
      ra = ramp(t, tRa, tRa + 1.2),
      ti = ramp(t, tTi, tTi + 1.6),
      cx = 960,
      cy = lerp(520, 560, ea);
    let s = panelSVG(130, 190, 1660, 660, lerp(0, 1, ea) > 0.5 ? "#BFE6FF" : "#FFF3DC");
    if (ea > 0)
      s += `<g opacity="${f2(ea)}"><clipPath id="s1-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s1-k)"><rect x="130" y="440" width="1660" height="420" fill="#8A5A2B"/><path d="M130 440 H1790" class="ink" stroke-width="5"/></g></g>`;
    // la racine et la tige
    if (ra > 0)
      s +=
        `<path d="M${cx} ${f2(cy + 60)} q-20 ${f2(80 * ra)} 10 ${f2(190 * ra)}" fill="none" stroke="#E7C99A" stroke-width="14" stroke-linecap="round"/><path d="M${cx - 6} ${f2(cy + 60 + 90 * ra)} q-50 20 -70 ${f2(60 * ra)} M${cx + 4} ${f2(cy + 60 + 120 * ra)} q50 10 70 ${f2(50 * ra)}" fill="none" stroke="#E7C99A" stroke-width="8" stroke-linecap="round"/>` +
        txt(cx + 220, cy + 190, "la racine", 44, {
          w: 700,
          fill: "#FFE9B0",
          op: ramp(ra, 0.3, 0.6),
        });
    if (ti > 0) {
      const h = 220 * ti,
        w = 6 * Math.sin(t * 2);
      s +=
        `<path d="M${cx} ${f2(cy - 70)} Q${f2(cx + w)} ${f2(cy - 70 - h / 2)} ${f2(cx + w)} ${f2(cy - 70 - h)}" fill="none" stroke="#2E9E6B" stroke-width="16" stroke-linecap="round"/>` +
        leafSVG(cx + w, cy - 70 - h, 90 * ti, -150) +
        leafSVG(cx + w, cy - 70 - h, 90 * ti, -30) +
        txt(cx + 240, cy - 200, "la tige", 44, { w: 700, fill: C.ink, op: ramp(ti, 0.3, 0.6) });
    }
    // la graine, en coupe
    const k = lerp(1, 0.55, ea);
    s += `<g transform="translate(${cx} ${f2(cy)}) scale(${f2(k)})"><ellipse rx="230" ry="150" fill="#C98B4B" class="ink" stroke-width="7"/><ellipse rx="196" ry="118" fill="#FFE9B0"/>`;
    const mi = ramp(t, tMi, tMi + 0.3),
      st = ramp(t, tSt, tSt + 0.3);
    s += `<g opacity="${f2(0.4 + 0.6 * mi)}"><path d="M-150 0 Q-110 -10 -80 ${f2(-30 + 4 * Math.sin(t * 3))}" fill="none" stroke="#2E9E6B" stroke-width="12" stroke-linecap="round"/>${leafSVG(-84, -30, 50, -70)}${leafSVG(-84, -30, 50, -10)}</g>`;
    for (let i = 0; i < 9; i++)
      s += `<circle cx="${f2(-10 + (i % 3) * 60 + 3 * Math.sin(t * 3 + i))}" cy="${f2(-50 + Math.floor(i / 3) * 50)}" r="18" fill="${C.hot}" class="ink" stroke-width="3" opacity="${f2((0.3 + 0.7 * st) * (1 - 0.7 * ti * (i % 2)))}"/>`;
    s += `</g>`;
    if (ea < 1)
      s += `<g opacity="${f2(1 - ea)}">${mi > 0 ? txt(560, 330, "une plante miniature", 44, { w: 700, fill: "#1F7A50", op: mi }) + arrowSVG(640, 350, 800, 470, "#1F7A50", 10, mi) : ""}${st > 0 ? txt(1380, 330, "son stock de nourriture", 44, { w: 700, fill: "#C25E00", op: st }) + arrowSVG(1300, 350, 1090, 470, "#C25E00", 10, st) : ""}</g>`;
    // les gouttes d'eau
    if (ea > 0 && ti < 0.5)
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.9 + i / 6) % 1;
        s += dropletSVG(760 + i * 80, 240 + u * 220, 12, ea * (1 - u));
      }
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tSt + 0.5);
  show("#s1-n2", tEa + 0.5);
})();
