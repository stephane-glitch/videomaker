// ---------- Scène 6 : le résumé, puis le volcan : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "volcans") - 1.2;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // le volcan et sa fontaine de lave
    let s = `<path d="M130 850 H1000" class="ink" stroke-width="6"/><path d="M200 850 L470 420 H610 L880 850 Z" fill="#6B5B4E" class="ink" stroke-width="6"/><path d="M470 420 H610 L640 470 Q600 520 580 470 Q540 540 510 470 Q480 500 440 468 Z" fill="#E0455E" class="ink" stroke-width="5"/>`;
    for (let i = 0; i < 14; i++) {
      const u = (t * 0.7 + i / 14) % 1,
        a = rad(-90 + (rnd(i) - 0.5) * 70),
        v = 420 + rnd(i + 9) * 200;
      s += `<circle cx="${f2(540 + Math.cos(a) * v * u)}" cy="${f2(420 + Math.sin(a) * v * u + 520 * u * u)}" r="${f2(16 - 8 * u)}" fill="${i % 2 ? C.fire : "#E0455E"}" class="ink" stroke-width="3"/>`;
    }
    s += smokeSVG(540, 380, t, 1, "#C8CDD6", 10, 240);
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "pupille") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "cristallin") - 0.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "relief") - 1.2, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "volcans") - 0.4,
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
