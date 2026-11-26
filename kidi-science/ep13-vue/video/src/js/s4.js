// ---------- Scène 4 : le pouce qui saute d'un œil à l'autre ; le cerveau compare les deux images : le relief ----------
(() => {
  const tP = cue("s4-2", "pouce") - 0.5,
    tF = cue("s4-2", "Ferme") - 0.2,
    tO = cue("s4-2", "autre") - 0.2,
    tCmp = cue("s4-4", "compare") - 0.8,
    tNear = cue("s4-4", "près") - 1.4,
    tCy = cue("s4-5", "cyclope") - 0.5;
  onDraw("s4", (t) => {
    const b = ramp(t, tCmp, tCmp + 0.6);
    let s = "";
    if (b < 1) {
      // ce que l'on voit : un décor lointain, et le pouce tout près
      const closed = t < tF ? 0 : t < tO ? 1 : 1 + (Math.floor((t - tO) / 0.8) % 2 ? 0 : 1) * 1; // 0 : les deux ouverts, 1 : gauche fermé, 2 : droit fermé
      const side = closed === 0 ? 0 : closed === 1 ? 1 : -1;
      let g = `<rect x="330" y="230" width="1260" height="600" rx="34" fill="#DFF3FF" class="ink" stroke-width="6"/><clipPath id="s4-c"><rect x="336" y="236" width="1248" height="588" rx="30"/></clipPath><g clip-path="url(#s4-c)"><path d="M330 700 Q960 620 1590 700 V830 H330 Z" fill="#CFE8B8" class="ink" stroke-width="4"/>${treeSVG(700, 700, 260)}<path d="M1050 700 V520 L1170 430 L1290 520 V700 Z" fill="#fff" class="ink" stroke-width="5"/><path d="M1020 540 L1170 420 L1320 540" fill="none" stroke="#E0455E" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>`;
      const th = ramp(t, tP, tP + 0.5);
      g += `<g transform="translate(${f2(960 + side * 170)} ${f2(1000 - 300 * th)})"><path d="M-70 400 V60 Q-70 -60 0 -60 Q70 -60 70 60 V400 Z" fill="#FFD9B8" class="ink" stroke-width="7"/><path d="M-40 0 Q0 -40 40 0 V40 Q0 20 -40 40 Z" fill="#FBEDE2" class="ink" stroke-width="4"/></g></g>`;
      g +=
        frontEyeSVG(820, 160, 30, 0.45, "#3DBE8B", closed === 1 ? 1 : 0) +
        frontEyeSVG(1100, 160, 30, 0.45, "#3DBE8B", closed === 2 ? 1 : 0);
      s += `<g opacity="${f2(1 - b)}">${g}</g>`;
    }
    if (b > 0) {
      // vu de dessus : les deux yeux visent l'objet ; plus il est près, plus les regards se croisent
      const near = ramp(t, tNear, tNear + 0.8),
        oy = lerp(250, 520, near),
        cy = ramp(t, tCy, tCy + 0.4);
      let g = `<circle cx="760" cy="800" r="52" fill="#fff" class="ink" stroke-width="5"/><circle cx="1000" cy="800" r="52" fill="#fff" class="ink" stroke-width="5"/>`;
      [760, 1000].forEach((x) => {
        const a = Math.atan2(oy - 800, 880 - x);
        g += `<circle cx="${f2(x + 26 * Math.cos(a))}" cy="${f2(800 + 26 * Math.sin(a))}" r="22" fill="${C.ink}"/><path d="M${x} 800 L880 ${f2(oy)}" stroke="${C.fire}" stroke-width="8" stroke-dasharray="18 12" stroke-dashoffset="${f2(-t * 70)}" stroke-linecap="round"/>`;
      });
      g +=
        `<circle cx="880" cy="${f2(oy)}" r="40" fill="#E0455E" class="ink" stroke-width="5"/>` +
        txt(
          1180,
          oy + 16,
          near > 0.5 ? "Près : les regards se croisent beaucoup" : "Loin : presque parallèles",
          40,
          { w: 700, anchor: "start" },
        );
      if (cy > 0)
        g += `<g opacity="${f2(cy)}" transform="translate(360 ${f2(520 + 6 * Math.sin(t * 2))})"><circle r="130" fill="#B7DB8A" class="ink" stroke-width="6"/><circle cy="-30" r="54" fill="#fff" class="ink" stroke-width="5"/><circle cx="${f2(10 * Math.sin(t * 2))}" cy="-30" r="24" fill="${C.ink}"/><path d="M-40 70 q40 -24 80 0" fill="none" class="ink" stroke-width="6" stroke-linecap="round"/>${txt(0, 200, "à quelle distance ?", 34, { w: 700 })}</g>`;
      s += `<g opacity="${f2(b)}">${g}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", cue("s4-3", "différente") - 1.2);
  tl.to("#s4-n1", { opacity: 0, duration: 0.3 }, tCmp);
  pop("#s4-n2", cue("s4-4", "relief") - 0.6);
})();
