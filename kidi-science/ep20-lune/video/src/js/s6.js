// ---------- Scène 6 : le résumé, puis les étoiles : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "étoiles") - 0.8,
    tSo = cue("s6-4", "soleils") - 0.5;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // un ciel étoilé ; une étoile se révèle être un soleil lointain
    let s = nightSkySVG(200, 330, 760, 460, t, 40);
    const k = ramp(t, tSo, tSo + 0.8);
    s +=
      k > 0
        ? `<g transform="translate(580 560) scale(${f2(0.2 + 1.0 * k)})">${sunSVG(0, 0, 90, t)}</g>`
        : `<circle cx="580" cy="560" r="${f2(10 + 4 * Math.sin(t * 6))}" fill="#fff"/>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "moitié") - 1.2, { y: 50 });
  show("#s6-k2", cue("s6-1", "tournant") - 0.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "face") - 1.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "étoiles") - 0.2,
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
