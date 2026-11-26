// ---------- Scène 4 : la croûte est un puzzle de plaques ; les volcans poussent au bord des pièces ; l'Auvergne dort ----------
(() => {
  const tPl = cue("s4-2", "plaques") - 0.5,
    tBo = cue("s4-2", "bord") - 0.6,
    tMi = cue("s4-3", "milieu") - 0.5,
    tAu = cue("s4-4", "Auvergne") - 0.8,
    tCh = cue("s4-5", "Chut") - 0.2;
  const PL = [
    ["M150 240 L560 220 L640 430 L520 640 L150 620 Z", "#CFE8B8"],
    ["M560 220 L1080 240 L1010 470 L640 430 Z", "#FFE9A8"],
    ["M1080 240 L1770 230 L1770 560 L1180 600 L1010 470 Z", "#D9C9E8"],
    ["M640 430 L1010 470 L1180 600 L980 820 L520 640 Z", "#CFEFFF"],
    ["M150 620 L520 640 L980 820 L150 830 Z", "#FBD3C0"],
    ["M1180 600 L1770 560 L1770 830 L980 820 Z", "#DCE9C8"],
  ];
  const VOL = [
    [600, 330],
    [820, 448],
    [1045, 360],
    [1100, 540],
    [1260, 600],
    [580, 540],
    [760, 730],
    [1500, 580],
    [400, 632],
    [1080, 710],
  ];
  onDraw("s4", (t) => {
    const au = ramp(t, tAu, tAu + 0.6),
      pl = ramp(t, tPl, tPl + 0.5);
    let g = `<rect x="150" y="220" width="1620" height="610" rx="34" fill="#8FD3FF" class="ink" stroke-width="5"/>`;
    PL.forEach(([d, col], i) => {
      const dx = [-1, 0, 1, 0, -1, 1][i] * 14 * (1 - pl),
        dy = [-1, -1, -1, 1, 1, 1][i] * 14 * (1 - pl);
      g += `<path d="${d}" fill="${col}" class="ink" stroke-width="6" stroke-linejoin="round" transform="translate(${f2(dx + 3 * Math.sin(t * 0.8 + i))} ${f2(dy + 3 * Math.cos(t * 0.7 + i))})"/>`;
    });
    VOL.forEach(([x, y], i) => {
      const k = ramp(t, tBo + i * 0.12, tBo + 0.3 + i * 0.12);
      if (k > 0)
        g += `<g transform="translate(${x} ${y}) scale(${f2(k)})"><path d="M-26 20 L-8 -22 H8 L26 20 Z" fill="#6B5B4E" class="ink" stroke-width="3.5"/><circle cy="${f2(-34 - 6 * Math.abs(Math.sin(t * 5 + i)))}" r="9" fill="#E0455E" class="ink" stroke-width="2.5"/></g>`;
    });
    const mi = ramp(t, tMi, tMi + 0.35);
    if (mi > 0)
      g += `<g transform="translate(860 ${f2(310 - 60 * (1 - mi))})" opacity="${f2(mi)}"><path d="M-36 30 V-10 L0 -44 L36 -10 V30 Z" fill="#fff" class="ink" stroke-width="5"/><path d="M-48 -4 L0 -50 L48 -4" fill="none" stroke="#E0455E" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    let s = `<g opacity="${f2(1 - au)}">${g}</g>`;
    if (au > 0) {
      // les volcans d'Auvergne : des dômes verts, endormis
      let a = `<path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
      [
        [420, 300, 240],
        [820, 380, 330],
        [1240, 320, 260],
        [1560, 240, 200],
      ].forEach(([x, w, h], i) => {
        a += `<path d="M${x - w} 850 Q${x - w * 0.5} ${850 - h} ${x - 50} ${850 - h} H${x + 50} Q${x + w * 0.5} ${850 - h} ${x + w} 850 Z" fill="${["#9CCB7A", "#7FB85E", "#9CCB7A", "#B5D99A"][i]}" class="ink" stroke-width="6"/><path d="M${x - 50} ${850 - h} q50 30 100 0" fill="none" class="ink" stroke-width="5"/>`;
      });
      for (let i = 0; i < 3; i++) {
        const u = (t * 0.35 + i / 3) % 1;
        a += txt(880 + i * 46 + 20 * u, 420 - u * 120 - i * 30, "z", 50 + i * 16, {
          w: 700,
          fill: C.blue,
          op: 1 - u,
        });
      }
      a += `<path d="M770 640 q20 14 40 0 M840 640 q20 14 40 0" fill="none" class="ink" stroke-width="6" stroke-linecap="round"/><path d="M800 700 q26 ${f2(10 + 4 * Math.sin(t * 2))} 52 0" fill="none" class="ink" stroke-width="6" stroke-linecap="round"/>`;
      if (t > tCh)
        a += `<g transform="translate(1260 ${f2(430 + 6 * Math.sin(t * 3))}) rotate(-6)">${txt(0, 0, "Chut…", 90, { w: 700, fill: "#C25E00" })}</g>`;
      s += `<g opacity="${f2(au)}">${a}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tBo + 0.6);
  tl.to("#s4-n1", { opacity: 0, duration: 0.3 }, tAu);
  show("#s4-n2", tAu + 0.7);
})();
