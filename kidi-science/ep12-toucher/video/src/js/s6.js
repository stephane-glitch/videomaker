// ---------- Scène 6 : le résumé, puis le cyclope : pourquoi deux yeux ? ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "yeux") - 1.6;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // deux visages : deux yeux, ou un seul gros au milieu
    const look = 10 * Math.sin(t * 1.6);
    let s = `<circle cx="420" cy="560" r="170" fill="#FFD9B8" class="ink" stroke-width="6"/><circle cx="360" cy="530" r="40" fill="#fff" class="ink" stroke-width="5"/><circle cx="480" cy="530" r="40" fill="#fff" class="ink" stroke-width="5"/><circle cx="${f2(360 + look)}" cy="530" r="18" fill="${C.ink}"/><circle cx="${f2(480 + look)}" cy="530" r="18" fill="${C.ink}"/><path d="M370 640 q50 36 100 0" fill="none" class="ink" stroke-width="7" stroke-linecap="round"/>`;
    s +=
      `<circle cx="860" cy="560" r="170" fill="#B7DB8A" class="ink" stroke-width="6"/><circle cx="860" cy="520" r="70" fill="#fff" class="ink" stroke-width="5"/><circle cx="${f2(860 + look * 1.6)}" cy="520" r="30" fill="${C.ink}"/><path d="M810 650 q50 30 100 0" fill="none" class="ink" stroke-width="7" stroke-linecap="round"/>` +
      txt(640, 600, "?", 120, { w: 700, fill: "#C25E00" });
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "capteurs") - 0.8, { y: 50 });
  show("#s6-k2", cue("s6-1", "alarme") - 0.8, { y: 50 });
  show("#s6-k3", cue("s6-1", "chatouilles") - 1.0, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "yeux") - 0.4,
  );
  pop("#s6-next", cue("s6-4", "vue") - 0.8);
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
