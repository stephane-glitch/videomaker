// ---------- Scène 6 : le résumé, puis la Lune et ses formes : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "Lune") - 0.8;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // la Lune qui passe par ses formes, sur un fond de nuit
    let s = `<rect x="200" y="330" width="760" height="460" rx="34" fill="#1B2445" class="ink" stroke-width="5"/>`;
    for (let i = 0; i < 16; i++)
      s += `<circle cx="${f2(230 + rnd(i) * 700)}" cy="${f2(350 + rnd(i + 30) * 420)}" r="3" fill="#fff" opacity="${f2(0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i)))}"/>`;
    const ph = ((t - tSp) * 0.25) % 1,
      k = Math.cos(ph * TAU);
    s += `<circle cx="580" cy="560" r="150" fill="#39425C"/><path d="M580 410 A 150 150 0 0 1 580 710 A ${f2(Math.abs(k) * 150)} 150 0 0 ${k > 0 ? 0 : 1} 580 410 Z" fill="#FFF6B0"/><circle cx="580" cy="560" r="150" fill="none" class="ink" stroke-width="5"/>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "penchée") - 0.8, { y: 50 });
  show("#s6-k2", cue("s6-1", "été") - 1.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "hiver") - 1.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "Lune") - 0.2,
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
