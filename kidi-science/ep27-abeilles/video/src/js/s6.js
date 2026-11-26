// ---------- Scène 6 : le résumé, puis le hoquet : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tHo = cue("s6-3", "hoquet") - 0.8;
  onDraw("s6", (t) => {
    if (t < tHo - 0.3) return;
    // un personnage qui sursaute à chaque « hic ! »
    const u = ((t - tHo) % 1.3) / 1.3,
      j = u < 0.2 ? Math.sin((u / 0.2) * Math.PI) : 0;
    let s =
      `<rect x="200" y="330" width="760" height="460" rx="34" fill="#FFF3DC" class="ink" stroke-width="5"/><path d="M260 740 H900" class="ink" stroke-width="5"/>` +
      figSVG(520, 740 - 40 * j, 1.9, C.blue);
    if (u < 0.5)
      s += `<g transform="translate(730 ${f2(470 - 60 * u)}) rotate(-8) scale(${f2(0.7 + 0.6 * Math.min(1, u * 5))})" opacity="${f2(1 - u * 2)}">${txt(0, 0, "HIC !", 80, { w: 700, fill: "#C25E00" })}</g>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "nectar") - 1.2, { y: 50 });
  show("#s6-k2", cue("s6-1", "miel") - 1.4, { y: 50 });
  show("#s6-k3", cue("s6-1", "fruits") - 1.4, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tHo - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tHo);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "hoquet") - 0.2,
  );
  pop("#s6-next", cue("s6-4", "prochaine") - 0.3);
  const tEnd = S.end - 3.2;
  tl.to("#s6-main", { y: -200, opacity: 0, duration: 0.45, ease: INN }, tEnd);
  tl.fromTo(
    "#s6-end",
    { opacity: 0, scale: 0.5, y: 80 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
    tEnd + 0.4,
  );
  show("#s6-bye", tEnd + 0.9);
})();
