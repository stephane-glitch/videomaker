// ---------- Scène 4 : en fabriquant son sucre, la plante rejette de l'oxygène : celui que nous respirons ----------
(() => {
  const tDe = cue("s4-1", "déchet") - 0.5,
    tOx = cue("s4-1", "oxygène") - 0.5,
    tRe = cue("s4-2", "respire") - 0.6,
    tMe = cue("s4-4", "Merci") - 0.3;
  onDraw("s4", (t) => {
    const ox = ramp(t, tOx, tOx + 0.4),
      re = ramp(t, tRe, tRe + 0.5);
    let s =
      daySkySVG(130, 190, 1660, 660, t, 10, "s4", 0) +
      `<clipPath id="s4-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s4-k)"><rect x="130" y="740" width="1660" height="120" fill="#7CC47A"/><path d="M130 740 H1790" class="ink" stroke-width="5"/></g>`;
    s += leafTreeSVG(560, 740, 500, "#3DBE8B", 0, t);
    const de = ramp(t, tDe, tDe + 0.3) * (1 - ox);
    if (de > 0) s += txt(1250, 660, "un déchet ?", 60, { w: 700, fill: "#C25E00", op: de });
    // les bulles d'oxygène, de l'arbre vers l'enfant
    if (ox > 0)
      for (let i = 0; i < 7; i++) {
        const u = (t * 0.28 + i / 7) % 1,
          x = lerp(700, re > 0 ? 1330 : 1500, u),
          y = 430 + 60 * Math.sin(u * 5 + i) + 40 + (re > 0 ? u * 60 : 0);
        s += gasSVG(x, y, "O₂", "#BFF3D6", 30, ox * Math.sin(u * Math.PI));
      }
    if (ox > 0 && re < 1)
      s += txt(1200, 300, "de l’oxygène", 64, { w: 700, fill: "#1F7A50", op: ox * (1 - re) });
    if (re > 0) {
      const br = 1 + 0.05 * Math.sin(t * 2.2);
      s += `<g opacity="${f2(re)}"><g transform="translate(1400 740) scale(${f2(br)} ${f2(2 - br)})">${figSVG(0, 0, 2.1, C.blue)}</g>${txt(1400, 300, "on le respire !", 60, { w: 700, fill: C.blueD })}</g>`;
    }
    const me = ramp(t, tMe, tMe + 0.3);
    if (me > 0)
      s += `<g transform="translate(980 ${f2(600 - 30 * me + 8 * Math.sin(t * 4))}) scale(${f2(me * (1 + 0.1 * Math.sin(t * 6)))})"><path d="M0 30 C-70 -20 -40 -70 0 -36 C40 -70 70 -20 0 30 Z" fill="#E0455E" class="ink" stroke-width="5" stroke-linejoin="round"/></g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tOx + 0.5);
  pop("#s4-n2", tRe + 0.6);
})();
