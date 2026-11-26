// ---------- Scène 2 : là-haut il fait froid : la vapeur redevient liquide autour de poussières : le nuage ; la buée ----------
(() => {
  const tF = cue("s2-1", "froid") - 0.5,
    tLq = cue("s2-1", "liquide") - 0.8,
    tPo = cue("s2-1", "poussières") - 0.8,
    tNu = cue("s2-1", "nuage") - 0.8,
    tBu = cue("s2-2", "buée") - 0.6,
    tFl = cue("s2-4", "flottent") - 1.2;
  onDraw("s2", (t) => {
    const bu = ramp(t, tBu, tBu + 0.5) * (1 - ramp(t, tFl, tFl + 0.5));
    // le ciel : chaud en bas, froid en haut
    let g = `<path d="M130 850 H1790" class="ink" stroke-width="6"/><rect x="1640" y="240" width="40" height="560" rx="20" fill="#fff" class="ink" stroke-width="5"/><rect x="1648" y="248" width="24" height="270" rx="12" fill="${C.air}"/><rect x="1648" y="518" width="24" height="274" rx="12" fill="${C.fire}"/>${txt(1720, 290, "froid", 34, { w: 700, fill: C.blue, anchor: "start", op: ramp(t, tF, tF + 0.3) })}${txt(1720, 780, "chaud", 34, { w: 700, fill: "#C25E00", anchor: "start" })}`;
    // la vapeur monte ; au-dessus de la ligne de froid, elle devient gouttelettes
    const lq = ramp(t, tLq, tLq + 0.6),
      nu = ramp(t, tNu, tNu + 1.0);
    for (let i = 0; i < 14; i++) {
      const u = (t * 0.16 + rnd(i * 5)) % 1,
        x = 320 + i * 62 + 16 * Math.sin(t * 1.5 + i),
        y = 820 - u * 520;
      g += y > 430 || lq === 0 ? vaporSVG(x, y, 18, Math.sin(u * Math.PI)) : "";
    }
    if (lq > 0)
      for (let i = 0; i < 120; i++) {
        const a = rnd(i) * TAU,
          d = Math.sqrt(rnd(i + 200)) * 230 * (0.5 + 0.5 * nu);
        if (i / 120 < 0.25 + 0.75 * nu)
          g += dropletSVG(
            740 + d * 1.5 * Math.cos(a) + 6 * Math.sin(t * 2 + i),
            330 + d * 0.45 * Math.sin(a) + 4 * Math.cos(t * 1.6 + i),
            5 + 2 * rnd(i + 3),
            lq,
          );
      }
    // la loupe : une poussière, et l'eau qui s'accroche autour
    const z = ramp(t, tPo, tPo + 0.4) * (1 - ramp(t, tBu - 0.2, tBu + 0.2));
    if (z > 0)
      g += `<g opacity="${f2(z)}" transform="translate(${f2(1320 + 20 * (1 - z))} 560)"><circle r="170" fill="#fff" class="ink" stroke-width="8"/><circle r="${f2(40 + 80 * ramp(t, tPo, tNu))}" fill="#8FD3FF" class="ink" stroke-width="5"/><path d="M-24 -10 L0 -30 L26 -8 L16 24 L-18 22 Z" fill="#8A5A22" class="ink" stroke-width="4"/>${txt(0, 230, "une poussière au centre", 32, { w: 700 })}</g>`;
    // les courants qui portent le nuage
    const fl = ramp(t, tFl, tFl + 0.5);
    if (fl > 0)
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.6 + i / 5) % 1;
        g += arrowSVG(
          460 + i * 140,
          760 - u * 180,
          460 + i * 140,
          690 - u * 180,
          C.fire,
          12,
          fl * Math.sin(u * Math.PI),
        );
      }
    let s = `<g opacity="${f2(1 - 0.9 * bu)}">${g}</g>`;
    // la buée sur la vitre en hiver
    if (bu > 0) {
      let b =
        `<rect x="820" y="280" width="520" height="520" rx="20" fill="#DFF3FF" class="ink" stroke-width="10"/><path d="M1080 280 V800 M820 540 H1340" class="ink" stroke-width="8"/>` +
        figSVG(560, 848, 2.6, C.blue);
      const k = ramp(t, tBu + 0.3, tBu + 1.6);
      b += `<ellipse cx="960" cy="470" rx="${f2(150 * k)}" ry="${f2(110 * k)}" fill="#fff" opacity="0.85"/>`;
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.9 + i / 4) % 1;
        b += `<path d="M${f2(650 + u * 180)} ${f2(540 - i * 14 - u * 30)} h40" stroke="${C.air}" stroke-width="10" stroke-linecap="round" opacity="${f2(1 - u)}"/>`;
      }
      for (let i = 0; i < 4; i++)
        b += `<g transform="translate(${1140 + (i % 2) * 120} ${340 + Math.floor(i / 2) * 260 + ((t * 30 + i * 40) % 160)}) rotate(${f2(t * 20)})" stroke="#fff" stroke-width="6" stroke-linecap="round"><path d="M-16 0 H16 M0 -16 V16 M-11 -11 L11 11 M11 -11 L-11 11"/></g>`;
      s += `<g opacity="${f2(bu)}">${b}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  pop("#s2-n1", cue("s2-3", "géante") - 0.6);
  show("#s2-n2", cue("s2-5", "porter") - 0.8);
})();
