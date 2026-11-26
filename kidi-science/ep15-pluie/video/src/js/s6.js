// ---------- Scène 6 : le résumé, puis le cœur qui tape fort : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "cœur") - 1.6;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // un cœur qui bat : deux coups rapprochés, une pause
    const ph = (t * 1.6) % 1,
      beat = 1 + 0.16 * (Math.exp(-ph * 14) + 0.7 * Math.exp(-Math.abs(ph - 0.28) * 22));
    let s = `<g transform="translate(520 600) scale(${f2(beat * 1.7)})"><path d="M0 100 C -150 -10, -130 -130, -60 -130 C -20 -130, 0 -100, 0 -80 C 0 -100, 20 -130, 60 -130 C 130 -130, 150 -10, 0 100 Z" fill="#E0455E" class="ink" stroke-width="4"/><path d="M-70 -90 Q-90 -60 -76 -30" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.7"/></g>`;
    for (let i = 0; i < 2; i++)
      s += `<path d="M${800 + i * 60} ${f2(520 - 20 * i)} q30 60 0 120" fill="none" stroke="#E0455E" stroke-width="10" stroke-linecap="round" opacity="${f2(Math.exp(-ph * 6))}"/>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "évapore") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "gouttelettes") - 1.0, { y: 50 });
  show("#s6-k3", cue("s6-1", "pleut") - 0.8, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "cœur") - 0.4,
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
