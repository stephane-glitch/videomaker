// ---------- Scène 3 : le jour, les étoiles sont toujours là, noyées dans la lumière du Soleil ; l'air les fait scintiller ----------
(() => {
  const tJo = cue("s3-1", "jour") - 0.5,
    tNu = cue("s3-2", "Nulle") - 0.3,
    tSo = cue("s3-2", "Soleil") - 0.6,
    tBo = cue("s3-3", "bougie") - 0.5,
    tSc = cue("s3-4", "scintillent") - 0.7,
    tAi = cue("s3-4", "air") - 0.5;
  onDraw("s3", (t) => {
    const sc = ramp(t, tSc, tSc + 0.5),
      day = ramp(t, tJo, tJo + 1.2) * (1 - sc),
      stars = 1 - 0.85 * ramp(t, tSo, tSo + 0.8) * (1 - sc);
    let s = `<rect x="130" y="190" width="1660" height="660" rx="34" fill="${mixHex("#1B2445", "#8FCBFF", day)}" class="ink" stroke-width="5"/>`;
    if (sc < 1) {
      let g = "";
      for (let i = 0; i < 16; i++)
        g += `<g opacity="${f2(stars)}">${starSVG(220 + rnd(i) * 1480, 260 + rnd(i + 20) * 420, 9 + 5 * rnd(i + 3), day > 0.5 ? "#fff" : "#FFF6B0", t, i)}</g>`;
      if (day > 0)
        g += `<g opacity="${f2(day)}">${sunSVG(lerp(300, 520, day), lerp(760, 400, day), 110, t)}</g>`;
      const nu = ramp(t, tNu, tNu + 0.3) * (1 - ramp(t, tBo - 0.3, tBo));
      if (nu > 0) g += txt(1180, 300, "Toujours là !", 60, { w: 700, fill: C.ink, op: nu });
      // la bougie en plein soleil
      const bo = ramp(t, tBo, tBo + 0.4);
      if (bo > 0)
        g += `<g opacity="${f2(bo)}">${candleSVG(1300, 640, 60, 180)}${flameSVG(1300, 630, 70, t)}${txt(1300, 790, "On ne voit plus sa flamme", 40, { w: 700, fill: C.ink })}</g>`;
      s += `<g opacity="${f2(1 - sc)}">${g}</g>`;
    }
    if (sc > 0) {
      // l'étoile, les couches d'air qui bougent, et la lumière qui tremble jusqu'à nous
      const ai = ramp(t, tAi, tAi + 0.4);
      let g = starSVG(960, 290, 20 + 8 * Math.sin(t * 9) * Math.sin(t * 5.3), "#FFF6B0", t);
      for (let j = 0; j < 3; j++) {
        let d = "";
        for (let i = 0; i <= 24; i++)
          d += `${i ? "L" : "M"}${f2(260 + i * 58)} ${f2(430 + j * 80 + 16 * Math.sin(i * 0.8 + t * (2 + j) + j))}`;
        g += `<path d="${d}" fill="none" stroke="#8FCBFF" stroke-width="10" stroke-linecap="round" opacity="${f2(0.5 * ai)}"/>`;
      }
      let d = "M960 330";
      for (let i = 1; i <= 10; i++)
        d += `L${f2(960 + (i > 2 ? 22 * ai * Math.sin(i * 1.7 + t * 9) : 0))} ${330 + i * 40}`;
      g +=
        `<path d="${d}" fill="none" stroke="#FFF6B0" stroke-width="8" stroke-linecap="round"/>` +
        frontEyeSVG(960, 780, 46) +
        (ai > 0 ? txt(1480, 520, "l’air qui bouge", 46, { w: 700, fill: "#BFE3FF", op: ai }) : "");
      s += `<g opacity="${f2(sc)}">${g}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tNu + 0.4);
  show("#s3-n2", tAi + 0.5);
})();
