// ---------- Scène 6 : le résumé, puis la Terre penchée : annonce des saisons ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "hiver") - 1.8,
    tPe = cue("s6-4", "penchée") - 0.6;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // le Soleil, et la Terre qui penche sur son axe
    const tilt = -23 * ramp(t, tPe, tPe + 0.6);
    let s =
      sunSVG(330, 520, 90, t) +
      `<g transform="rotate(${f2(tilt)} 760 520)">${earthSVG(760, 520, 150, t * 20)}<path d="M760 320 V720" class="ink" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 12"/></g>`;
    for (let i = 0; i < 3; i++) {
      const u = (t * 0.6 + i / 3) % 1;
      s += `<path d="M${f2(450 + u * 130)} ${480 + i * 40} h40" stroke="${C.hot}" stroke-width="10" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
    }
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "range") - 0.8, { y: 50 });
  show("#s6-k2", cue("s6-1", "ménage") - 0.8, { y: 50 });
  show("#s6-k3", cue("s6-1", "grandit") - 1.0, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "hiver") - 0.4,
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
