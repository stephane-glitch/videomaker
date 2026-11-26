// ---------- Scène 1 : ce qui contient du fer colle (trombone, clou, porte de frigo) ; le bois, le plastique, le verre, l'aluminium : non ----------
(() => {
  const O = [
    ["trombone", "s1-1", "trombone", 1],
    ["clou", "s1-1", "clou", 1],
    ["frigo", "s1-1", "frigo", 1],
    ["bois", "s1-1", "bois", 0],
    ["plastique", "s1-1", "plastique", 0],
    ["verre", "s1-1", "verre", 0],
    ["aluminium", "s1-2", "canette", 0],
  ];
  const T = O.map((o) => cue(o[1], o[2]) - 0.5),
    tRi = cue("s1-3", "Rien") - 0.2;
  const draw = (i, x, y) => {
    if (i === 0) return clipSVG(x, y, 1.2, 20);
    if (i === 1) return nailSVG(x, y, 1.1, 0);
    if (i === 2)
      return `<rect x="${x - 50}" y="${y - 70}" width="100" height="140" rx="12" fill="#fff" class="ink" stroke-width="5"/><rect x="${x - 36}" y="${y - 40}" width="10" height="60" rx="5" fill="${C.ink}"/>`;
    if (i === 3)
      return `<rect x="${x - 70}" y="${y - 30}" width="140" height="60" rx="8" fill="#C98B4B" class="ink" stroke-width="5"/><path d="M${x - 50} ${y - 8} q30 -14 60 0 t50 0" fill="none" stroke="#8A5A2B" stroke-width="4"/>`;
    if (i === 4)
      return `<path d="M${x - 40} ${y - 60} H${x + 40} L${x + 30} ${y + 60} H${x - 30} Z" fill="#5BE39A" class="ink" stroke-width="5" stroke-linejoin="round"/>`;
    if (i === 5)
      return `<path d="M${x - 40} ${y - 60} H${x + 40} L${x + 32} ${y + 60} H${x - 32} Z" fill="#DDF3FF" class="ink" stroke-width="5" stroke-linejoin="round" opacity="0.9"/><path d="M${x - 34} ${y} H${x + 34} L${x + 30} ${y + 54} H${x - 30} Z" fill="#8FD3FF"/>`;
    return `<rect x="${x - 40}" y="${y - 66}" width="80" height="132" rx="14" fill="#D3DAE6" class="ink" stroke-width="5"/><rect x="${x - 40}" y="${y - 30}" width="80" height="50" fill="#E0455E"/><ellipse cx="${x}" cy="${y - 60}" rx="30" ry="8" fill="#AEB8C8" class="ink" stroke-width="3"/>`;
  };
  onDraw("s1", (t) => {
    let s =
      panelSVG() +
      `<g transform="translate(0 ${f2(4 * Math.sin(t * 2))})">${barMagnetSVG(960, 300, 1440, 90)}</g>` +
      `<path d="M190 770 H1730" class="ink" stroke-width="8" stroke-linecap="round"/>`;
    O.forEach((o, i) => {
      const x = 300 + i * 220,
        k = ramp(t, T[i], T[i] + 0.3);
      if (k <= 0) return;
      const up = o[3] ? ramp(t, T[i] + 0.35, T[i] + 0.6) : 0,
        y =
          lerp(690, 420, up * up) +
          (o[3]
            ? 0
            : -14 * Math.abs(Math.sin((t - T[i]) * 5)) * (1 - ramp(t, T[i] + 0.3, T[i] + 1.5)));
      s += `<g opacity="${f2(k)}">${draw(i, x, y)}${txt(x, 830, o[0], 36, { w: 700, fill: C.ink })}</g>`;
      const v = ramp(t, T[i] + 0.7, T[i] + 0.9);
      if (v > 0)
        s += o[3]
          ? `<g transform="translate(${x + 70} 520) scale(${f2(v)})"><circle r="28" fill="#2E9E6B"/><path d="M-12 0 L-3 10 L13 -9" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`
          : `<g transform="translate(${x + 70} 600) scale(${f2(v)})"><circle r="28" fill="#E0455E"/><path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>`;
    });
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", T[2] + 0.8);
  show("#s1-n2", tRi + 0.5);
})();
