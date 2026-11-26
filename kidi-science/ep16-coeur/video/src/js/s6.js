// ---------- Scène 6 : le résumé, puis la tartine dans son long tuyau : annonce de la digestion ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "tartine") - 0.8;
  const TUBE = [
    [300, 380],
    [520, 380],
    [520, 520],
    [300, 520],
    [300, 660],
    [520, 660],
    [520, 800],
    [760, 800],
  ];
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // un long tuyau en zigzag, et la tartine qui y voyage
    let s = `<path d="${pathD(TUBE)}" fill="none" stroke="${C.ink}" stroke-width="86" stroke-linecap="round" stroke-linejoin="round"/><path d="${pathD(TUBE)}" fill="none" stroke="#F7B9B0" stroke-width="72" stroke-linecap="round" stroke-linejoin="round"/>`;
    const u = ((t - tSp) * 0.16) % 1,
      [x, y] = along(TUBE, u);
    s +=
      toastSVG(x, y, t * 40, 0.3 * (1 - 0.5 * u)) +
      txt(900, 620, "?", 160, { w: 700, fill: "#C25E00" });
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "pompe") - 1.0, { y: 50 });
  show("#s6-k2", cue("s6-1", "poumons") - 1.2, { y: 50 });
  show("#s6-k3", cue("s6-1", "revient") - 1.0, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "tartine") - 0.2,
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
