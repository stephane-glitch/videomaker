// ---------- Scène 4 : boum-boum : les valves claquent, le sang ne repart pas en arrière ; le pouls au poignet ----------
(() => {
  const tAr = cue("s4-2", "arrière") - 1.0,
    tPo = cue("s4-4", "poignet") - 1.0;
  onDraw("s4", (t) => {
    const p = ramp(t, tPo, tPo + 0.6),
      ph = ((t * 80) / 60) % 1,
      open = ph < 0.3 ? Math.sin((ph / 0.3) * Math.PI) : 0,
      b = beatAt(t, 80);
    let g = "";
    // un tuyau du cœur en coupe, avec sa porte à deux battants
    g += `<rect x="330" y="400" width="900" height="280" rx="40" fill="#FFE9E6" class="ink" stroke-width="6"/>`;
    const ang = 70 * open;
    [
      [1, 400],
      [-1, 680],
    ].forEach(
      ([d, y0]) =>
        (g += `<path d="M780 ${y0} l${f2(130 * Math.sin(rad(ang)))} ${f2(d * 130 * Math.cos(rad(ang)))}" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/><path d="M780 ${y0} l${f2(130 * Math.sin(rad(ang)))} ${f2(d * 130 * Math.cos(rad(ang)))}" stroke="#F7A8B8" stroke-width="14" stroke-linecap="round"/>`),
    );
    // le sang passe quand la porte s'ouvre, et bute dessus s'il veut reculer
    for (let i = 0; i < 6; i++) {
      const u = (((t * 80) / 60) * 0.5 + i / 6) % 1,
        x = 380 + u * 800;
      g += rbcSVG(x, 540 + 40 * Math.sin(i * 2.1), 24, "", Math.sin(u * Math.PI));
    }
    const back = ramp(t, tAr, tAr + 0.4);
    if (back > 0)
      g +=
        arrowSVG(1100, 760, 860, 760, C.blue, 14, back) +
        `<g opacity="${f2(back)}" transform="translate(800 760)"><path d="M-26 -26 L26 26 M26 -26 L-26 26" stroke="#E0455E" stroke-width="16" stroke-linecap="round"/></g>`;
    // le boum-boum
    g += `<g transform="translate(1540 ${f2(520)}) rotate(-6) scale(${f2(1 + 0.2 * Math.min(1, b))})">${txt(0, 0, "Boum-boum", 84, { w: 700, fill: "#E0455E" })}</g>`;
    let s = `<g opacity="${f2(1 - p)}">${g}</g>`;
    // le pouls : deux doigts sur le poignet, et la petite vague de chaque battement
    if (p > 0) {
      let h =
        `<path d="M260 620 H1000" stroke="${C.ink}" stroke-width="170" stroke-linecap="round"/><path d="M260 620 H1000" stroke="#FFD9B8" stroke-width="158" stroke-linecap="round"/>` +
        handSVG(1140, 720, 0.8, 90);
      h += `<g transform="translate(620 ${f2(520 + 6 * b)})"><path d="M-30 -260 V0 Q-30 30 0 30 Q30 30 30 0 V-260 Z" fill="#FBD3C0" class="ink" stroke-width="6"/><path d="M40 -260 V-20 Q40 10 70 10 Q100 10 100 -20 V-260 Z" fill="#FBD3C0" class="ink" stroke-width="6"/></g>`;
      let d = "M1100 420";
      for (let i = 0; i <= 80; i++) {
        const tt = t - 2.6 + (i / 80) * 2.6;
        d += ` L${f2(1100 + i * 8)} ${f2(420 - 110 * beatAt(tt, 80))}`;
      }
      h += `<path d="${d}" fill="none" stroke="#E0455E" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
      s += `<g opacity="${f2(p)}">${h}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", cue("s4-2", "claquent") + 0.3);
  tl.to("#s4-n1", { opacity: 0, duration: 0.3 }, tPo);
  show("#s4-n2", cue("s4-4", "pouls") - 0.8);
})();
