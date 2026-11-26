// ---------- Scène 3 : le champ magnétique, invisible ; la limaille de fer dessine ses lignes, d'un pôle à l'autre ----------
(() => {
  const tIn = cue("s3-1", "invisible") - 0.5,
    tLi = cue("s3-1", "limaille") - 0.6,
    tLg = cue("s3-2", "lignes") - 0.5,
    tPo = cue("s3-3", "pôle") - 0.6;
  const N = [800, 520],
    S = [1120, 520];
  onDraw("s3", (t) => {
    let s = panelSVG();
    const inv = ramp(t, tIn, tIn + 0.4) * (1 - ramp(t, tLi, tLi + 0.5));
    if (inv > 0)
      for (let i = 0; i < 4; i++)
        s += `<ellipse cx="960" cy="520" rx="${f2(300 + i * 110 + 14 * Math.sin(t * 3 + i))}" ry="${f2(130 + i * 60 + 8 * Math.sin(t * 3 + i))}" fill="none" stroke="#7A4FD0" stroke-width="5" stroke-dasharray="6 16" opacity="${f2(inv * (0.7 - i * 0.14))}"/>`;
    // la limaille : chaque grain s'aligne sur le champ
    const li = ramp(t, tLi, tLi + 1.6),
      lg = ramp(t, tLg, tLg + 0.4);
    if (li > 0)
      for (let i = 0; i < 420; i++) {
        const x = 190 + rnd(i) * 1540,
          y = 230 + rnd(i + 500) * 580;
        if (Math.abs(x - 960) < 260 && Math.abs(y - 520) < 60) continue;
        const k = ramp(li, rnd(i + 900) * 0.7, rnd(i + 900) * 0.7 + 0.3);
        if (k <= 0) continue;
        const a = lerp(rnd(i + 77) * 6, fieldAng(x, y, N, S), k) + 0.06 * Math.sin(t * 5 + i),
          L = 11,
          fy = y - 40 * (1 - k);
        s += `<path d="M${f2(x - L * Math.cos(a))} ${f2(fy - L * Math.sin(a))} L${f2(x + L * Math.cos(a))} ${f2(fy + L * Math.sin(a))}" stroke="${lg > 0 ? mixHex("#5B6B88", "#1F2A44", lg) : "#5B6B88"}" stroke-width="5" stroke-linecap="round"/>`;
      }
    // les lignes du champ, d'un pôle à l'autre
    const po = ramp(t, tPo, tPo + 0.5);
    if (po > 0)
      for (let j = 0; j < 3; j++)
        for (const sg of [-1, 1]) {
          const h = 90 + j * 60;
          s += `<path d="M800 ${520 + sg * 44} C ${700 - j * 120} ${520 + sg * h * 1.5}, ${1220 + j * 120} ${520 + sg * h * 1.5}, 1120 ${520 + sg * 44}" fill="none" stroke="${C.fire}" stroke-width="6" stroke-dasharray="26 18" stroke-dashoffset="${f2(-t * 90)}" opacity="${f2(po * 0.9)}"/>`;
        }
    s += barMagnetSVG(960, 520, 480, 100);
    if (inv > 0)
      s += txt(960, 300, "le champ magnétique", 54, { w: 700, fill: "#5A35B0", op: inv });
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tIn + 0.5);
  show("#s3-n2", tLi + 1.2);
})();
