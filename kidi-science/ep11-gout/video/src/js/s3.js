// ---------- Scène 3 : le nez s'en mêle : en mâchant, les odeurs remontent par l'arrière de la bouche ----------
(() => {
  const tUp = cue("s3-2", "remontent") - 0.5,
    tSu = cue("s3-2", "sucré") - 0.5,
    tFr = cue("s3-2", "fraise") - 0.5,
    tPi = cue("s3-3", "bouche") - 0.4;
  const HX = 640,
    HY = 540;
  const P = [
    [HX - 150, HY + 150],
    [HX - 40, HY + 160],
    [HX + 50, HY + 110],
    [HX + 60, HY + 10],
    [HX + 10, HY - 90],
    [HX - 50, HY - 122],
  ];
  onDraw("s3", (t) => {
    const pinch = ramp(t, tPi, tPi + 0.4);
    let s = headCutSVG(HX, HY, 1, 0);
    // la bouche : la langue, et la fraise qu'on mâche
    const ch = 10 * Math.abs(Math.sin(t * 6));
    s +=
      `<path d="M${HX - 232} ${HY + 130} C ${HX - 150} ${HY + 90 - ch}, ${HX - 40} ${HY + 100}, ${HX + 40} ${HY + 130} C ${HX - 20} ${HY + 200 + ch}, ${HX - 150} ${HY + 200 + ch}, ${HX - 232} ${HY + 130} Z" fill="#7A2231" class="ink" stroke-width="5"/><path d="M${HX - 200} ${HY + 168 + ch * 0.6} Q${HX - 100} ${HY + 130 + ch * 0.6} ${HX + 10} ${HY + 160 + ch * 0.6} Q${HX - 100} ${HY + 196 + ch} ${HX - 200} ${HY + 168 + ch * 0.6} Z" fill="#F08A9B" class="ink" stroke-width="4"/>` +
      berrySVG(HX - 130, HY + 132, 0.34);
    // les odeurs remontent par l'arrière
    const up = ramp(t, tUp, tUp + 0.5);
    if (up > 0) {
      let d = "";
      P.forEach((p, i) => (d += (i ? "L" : "M") + p[0] + " " + p[1]));
      s += `<path d="${d}" fill="none" stroke="#E0455E" stroke-width="8" stroke-dasharray="4 18" stroke-linecap="round" stroke-dashoffset="${f2(-t * 60)}" opacity="${f2(0.7 * up)}"/>`;
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.3 + i / 6) % 1,
          [x, y] = along(P, u * (1 - 0.45 * pinch));
        s += molSVG(
          x,
          y,
          8,
          "#E0455E",
          t * 60 + i * 40,
          up * Math.min(1, u * 6) * Math.min(1, (1 - u) * 6) * (pinch > 0.5 && u > 0.8 ? 0.2 : 1),
        );
      }
    }
    // la pince à linge sur le nez
    if (pinch > 0)
      s += `<g transform="translate(${f2(HX - 380 + 60 * pinch)} ${HY + 20}) rotate(-8)" opacity="${f2(pinch)}"><rect x="-90" y="-30" width="170" height="24" rx="8" fill="#EBC07E" class="ink" stroke-width="4"/><rect x="-90" y="6" width="170" height="24" rx="8" fill="#EBC07E" class="ink" stroke-width="4"/><circle cx="-10" cy="0" r="14" fill="#9AA6B8" class="ink" stroke-width="4"/></g>`;
    // ce que disent la langue et le nez
    const a = ramp(t, tSu, tSu + 0.3),
      b = ramp(t, tFr, tFr + 0.3);
    if (a > 0)
      s += `<g opacity="${f2(a)}" transform="translate(1340 ${f2(430 + 20 * (1 - a))})"><rect x="-270" y="-70" width="540" height="140" rx="30" fill="#fff" class="ink" stroke-width="4"/>${txt(-240, 18, "La langue dit :", 40, { anchor: "start" })}${txt(240, 20, "sucré", 54, { w: 700, fill: "#C2185B", anchor: "end" })}</g>`;
    if (b > 0)
      s += `<g opacity="${f2(b)}" transform="translate(1340 ${f2(610 + 20 * (1 - b))})"><rect x="-270" y="-70" width="540" height="140" rx="30" fill="#fff" class="ink" stroke-width="4"/>${txt(-240, 18, "Le nez dit :", 40, { anchor: "start" })}${txt(240, 20, pinch > 0.5 ? "… ???" : "fraise", 54, { w: 700, fill: pinch > 0.5 ? C.smoke : "#C25E00", anchor: "end" })}</g>`;
    $("#s3-draw").innerHTML = s;
  });
  const l = label(
    "s3",
    "s3-l",
    [HX + 62, HY + 40],
    [1100, 250],
    "Par l’arrière de la bouche",
    "les odeurs remontent jusqu’au nez",
  );
  showLabel(l, tUp + 0.3);
  hideLabel(l, tPi);
  show("#s3-n1", cue("s3-4", "parfum") - 0.8);
})();
