// ---------- Scène 5 : le ventre qui gargouille : les muscles brassent de l'air et du liquide ----------
(() => {
  const tG = cue("s5-1", "gargouille") - 0.6,
    tM = cue("s5-2", "muscles") - 0.6;
  onDraw("s5", (t) => {
    const g = ramp(t, tG, tG + 0.3),
      m = ramp(t, tM, tM + 0.5);
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` + figSVG(460, 848, 3.2, C.blue);
    // les ondes du gargouillis
    for (let i = 0; i < 3; i++) {
      const u = (t * 1.2 + i / 3) % 1;
      s += `<path d="M${f2(560 + u * 160)} ${f2(600 - 40 - i * 10)} q30 40 0 80" fill="none" stroke="${C.fire}" stroke-width="10" stroke-linecap="round" opacity="${f2(g * (1 - u))}"/>`;
    }
    s += `<g transform="translate(820 ${f2(470 + 8 * Math.sin(t * 9))}) rotate(-8)" opacity="${f2(g)}">${txt(0, 0, "Grrrr…", 90, { w: 700, fill: "#C25E00" })}</g>`;
    // dans le tuyau : des bulles d'air et du liquide, poussés par les muscles
    if (m > 0) {
      let h = `<path d="M1000 620 H1720" stroke="${C.ink}" stroke-width="210" stroke-linecap="round"/><path d="M1000 620 H1720" stroke="#F7B9B0" stroke-width="194" stroke-linecap="round"/><clipPath id="s5-c"><rect x="910" y="530" width="900" height="180" rx="90"/></clipPath><g clip-path="url(#s5-c)"><path d="M900 ${f2(640 + 12 * Math.sin(t * 4))} q100 ${f2(-40 * Math.sin(t * 5))} 200 0 t200 0 t200 0 t200 0 t200 0 V720 H900 Z" fill="#E6B45A"/>`;
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.3 + i / 6) % 1;
        h += `<circle cx="${f2(940 + u * 820)}" cy="${f2(590 + 20 * Math.sin(t * 6 + i))}" r="${f2(18 + 8 * Math.sin(t * 4 + i))}" fill="#fff" fill-opacity="0.85" class="ink" stroke-width="3"/>`;
      }
      h += `</g>`;
      const sq = 1000 + (((t - tM) * 160) % 720);
      h += `<path d="M${f2(sq)} 520 q30 40 0 80 M${f2(sq)} 720 q30 -40 0 -80" fill="none" stroke="#C2334A" stroke-width="16" stroke-linecap="round"/>`;
      s += `<g opacity="${f2(m)}">${h}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tM + 0.6);
})();
