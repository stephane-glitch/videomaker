// ---------- Scène 6 : le résumé, puis les crêpes qu'on sent de loin : l'odorat ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "crêpes") - 1.2;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // la poêle et ses crêpes, l'odeur qui voyage, et un nez qui la reçoit
    let s = `<path d="M200 760 H520 V790 Q520 820 490 820 H230 Q200 820 200 790 Z" fill="#39425C" class="ink" stroke-width="5"/><path d="M520 780 H660" class="ink" stroke-width="24" stroke-linecap="round"/><ellipse cx="360" cy="${f2(740 - 60 * Math.abs(Math.sin(t * 2.4)))}" rx="130" ry="${f2(22 + 10 * Math.abs(Math.cos(t * 2.4)))}" fill="#EBC07E" class="ink" stroke-width="5"/>`;
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.25 + i / 5) % 1,
        x = 380 + u * 520,
        y = 640 - 120 * Math.sin(u * Math.PI) + i * 16;
      s += `<path d="M${f2(x)} ${f2(y)} q20 -18 40 0 t40 0" fill="none" stroke="${C.fire}" stroke-width="9" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
    }
    s += `<path d="M900 520 C 990 560, 1040 650, 1000 700 C 980 730, 930 730, 900 710" fill="#FFD9B8" class="ink" stroke-width="6"/><path d="M930 706 q14 -16 30 -6" fill="none" class="ink" stroke-width="5"/>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "pluie") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "rivières") - 0.4, { y: 50 });
  show("#s6-k3", cue("s6-1", "évapore") - 0.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-4", "nez") - 0.6,
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
