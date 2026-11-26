// ---------- Scène 4 : les routeurs lisent l'adresse et choisissent le chemin ; si une route est bouchée, ils en prennent une autre ----------
(() => {
  const tRo = cue("s4-2", "routeurs") - 0.5,
    tLi = cue("s4-2", "lisent") - 0.5,
    tBo = cue("s4-2", "bouchée") - 0.6,
    tAu = cue("s4-2", "autre") - 0.6,
    tGp = cue("s4-3", "GPS") - 0.5;
  const R = [
      [560, 360],
      [560, 700],
      [960, 520],
      [1340, 360],
      [1340, 700],
    ],
    A = [300, 520],
    B = [1620, 520];
  const E = [
    [A, R[0]],
    [A, R[1]],
    [R[0], R[2]],
    [R[1], R[2]],
    [R[0], R[3]],
    [R[1], R[4]],
    [R[2], R[3]],
    [R[2], R[4]],
    [R[3], B],
    [R[4], B],
  ];
  const P1 = [A, R[0], R[2], R[3], B],
    P2 = [A, R[0], R[2], R[4], B];
  onDraw("s4", (t) => {
    const ro = ramp(t, tRo, tRo + 0.4),
      bo = ramp(t, tBo, tBo + 0.3);
    let s = panelSVG();
    E.forEach(([p, q], i) => {
      const bad = i === 6 && bo > 0;
      s += `<path d="M${p[0]} ${p[1]} L${q[0]} ${q[1]}" stroke="${bad ? "#E0455E" : C.ink}" stroke-width="${bad ? 12 : 8}" opacity="${bad ? 1 : 0.55}"/>`;
    });
    if (bo > 0)
      s +=
        `<g transform="translate(1150 440) scale(${f2(bo)})"><path d="M-34 -34 L34 34 M34 -34 L-34 34" stroke="#E0455E" stroke-width="16" stroke-linecap="round"/></g>` +
        txt(1150, 380, "bouchée", 40, { w: 700, fill: "#B02A45", op: bo });
    R.forEach(([x, y], i) => {
      const act = Math.sin(t * 5 + i * 1.3) > 0.4;
      s += `<g transform="translate(${x} ${y}) scale(${f2(0.7 + 0.3 * ro)})"><circle r="56" fill="${act ? "#FFE28A" : "#fff"}" class="ink" stroke-width="5"/><g transform="rotate(${f2(t * 60 + i * 40)})"><path d="M-30 0 H30 M16 -14 L30 0 L16 14 M0 -30 V30 M-14 16 L0 30 L14 16" fill="none" stroke="${C.blue}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
    });
    s += serverSVG(A[0] - 60, A[1], 0.7, t) + phoneSVG(B[0] + 60, B[1], 0.9);
    // les paquets : avant la panne par le haut, après par le bas
    for (let i = 0; i < 3; i++) {
      const u = ((t - tRo) * 0.22 + i / 3) % 1,
        P = t > tAu ? P2 : P1,
        stuck = t > tBo && t <= tAu,
        [x, y] = along(P, stuck ? Math.min(u, 0.47) : u);
      if (t > tRo)
        s += packetSVG(
          x,
          y + (stuck && u > 0.47 ? 6 * Math.sin(t * 12 + i) : 0),
          0.9,
          ["#FFD23F", "#5BE39A", "#FF9A3D"][i],
          String(i + 1),
        );
    }
    const li = ramp(t, tLi, tLi + 0.3) * (1 - ramp(t, tBo - 0.3, tBo));
    if (li > 0)
      s += `<g opacity="${f2(li)}" transform="translate(960 300)"><rect x="-200" y="-44" width="400" height="80" rx="20" fill="#fff" class="ink" stroke-width="4"/>${txt(0, 12, "Pour : Zoé →", 42, { w: 700, fill: C.ink })}</g>`;
    if (t > tAu)
      s += txt(1150, 790, "par une autre route !", 44, {
        w: 700,
        fill: "#1F7A50",
        op: ramp(t, tAu, tAu + 0.3) * (1 - ramp(t, tGp, tGp + 0.3)),
      });
    if (t > tGp)
      s += `<g transform="translate(960 790) scale(${f2(ramp(t, tGp, tGp + 0.3))})">${txt(0, 0, "Des GPS pour paquets", 50, { w: 700, fill: C.blueD })}</g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tLi + 0.6);
})();
