// ---------- Scène 2 : la recette : l'eau par les racines, le gaz carbonique par les feuilles, l'énergie du soleil ; les feuilles fabriquent du sucre ----------
(() => {
  const tRa = cue("s2-1", "racines") - 0.5,
    tGa = cue("s2-1", "gaz") - 0.6,
    tSo = cue("s2-1", "soleil") - 0.5,
    tRe = cue("s2-2", "recette") - 0.5,
    tSu = cue("s2-3", "sucre") - 0.6,
    tPh = cue("s2-3", "photosynthèse") - 0.5;
  onDraw("s2", (t) => {
    const ra = ramp(t, tRa, tRa + 0.4),
      ga = ramp(t, tGa, tGa + 0.4),
      so = ramp(t, tSo, tSo + 0.4),
      su = ramp(t, tSu, tSu + 0.4);
    let s =
      panelSVG(130, 190, 1660, 660, "#BFE6FF") +
      `<clipPath id="s2-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s2-k)"><rect x="130" y="640" width="1660" height="220" fill="#8A5A2B"/><path d="M130 640 H1790" class="ink" stroke-width="5"/></g>`;
    const w = 5 * Math.sin(t * 1.6),
      px = 760;
    // la plante
    s +=
      `<path d="M${px} 640 q-30 60 -90 80 M${px} 640 q0 80 20 130 M${px} 640 q40 50 100 70" fill="none" stroke="#E7C99A" stroke-width="12" stroke-linecap="round"/><path d="M${px} 640 Q${f2(px + w)} 480 ${f2(px + w)} 330" fill="none" stroke="#2E9E6B" stroke-width="18" stroke-linecap="round"/>` +
      leafSVG(px + w, 500, 190, -160) +
      leafSVG(px + w, 440, 200, -20) +
      leafSVG(px + w, 340, 150, -120) +
      leafSVG(px + w, 340, 150, -50);
    // l'eau qui monte
    if (ra > 0) {
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.5 + i / 5) % 1;
        s += dropletSVG(px + 4 * Math.sin(u * 9), 800 - u * 300, 10, ra * Math.sin(u * Math.PI));
      }
      s +=
        txt(430, 760, "l’eau", 50, { w: 700, fill: "#BFE6FF", op: ra }) +
        arrowSVG(520, 745, 660, 720, "#BFE6FF", 10, ra);
    }
    // le gaz carbonique qui entre dans les feuilles
    if (ga > 0) {
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.4 + i / 4) % 1;
        s += gasSVG(
          lerp(1200, 900, u),
          lerp(370 + i * 16, 440, u),
          "CO₂",
          "#D3DAE6",
          30,
          ga * Math.sin(u * Math.PI),
        );
      }
      s +=
        txt(1420, 530, "le gaz carbonique", 44, { w: 700, fill: C.ink, op: ga }) +
        txt(1420, 580, "(dans l’air)", 36, { w: 600, fill: C.ink, op: ga });
    }
    // le soleil
    if (so > 0) {
      s += `<g opacity="${f2(so)}">${sunSVG(330, 320, 70, t)}</g>`;
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.8 + i / 4) % 1;
        s += `<path d="M${f2(lerp(420, 640, u))} ${f2(lerp(350, 430, u))} l34 12" stroke="${C.fire}" stroke-width="9" stroke-linecap="round" opacity="${f2(so * Math.sin(u * Math.PI))}"/>`;
      }
    }
    // la recette, puis le sucre
    const re = ramp(t, tRe, tRe + 0.3) * (1 - su);
    if (re > 0)
      s += `<g opacity="${f2(re)}" transform="translate(1340 290)"><rect x="-330" y="-56" width="660" height="100" rx="24" fill="#fff" class="ink" stroke-width="4"/>${txt(0, 10, "eau + air + soleil = ?", 50, { w: 700, fill: C.ink })}</g>`;
    if (su > 0) {
      for (let i = 0; i < 5; i++) {
        const k = ramp(t, tSu + i * 0.15, tSu + 0.3 + i * 0.15);
        s += sugarSVG(
          860 + i * 26 + 3 * Math.sin(t * 4 + i),
          440 - 10 * Math.sin(t * 3 + i),
          0.8 * k,
          k,
        );
      }
      const ph = ramp(t, tPh, tPh + 0.3);
      s += `<g opacity="${f2(su)}" transform="translate(1340 290)"><rect x="-330" y="-56" width="660" height="100" rx="24" fill="#fff" class="ink" stroke-width="4"/>${txt(0, 10, ph > 0.5 ? "la photosynthèse" : "= du sucre !", 54, { w: 700, fill: ph > 0.5 ? "#1F7A50" : C.ink })}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tRe + 0.5);
  pop("#s2-n2", tSu + 0.6);
})();
