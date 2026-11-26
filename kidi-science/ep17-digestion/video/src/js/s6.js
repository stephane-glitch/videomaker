// ---------- Scène 6 : le résumé, puis le lit sous la lune : pourquoi on dort ? ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "dormir") - 1.4;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // la lune, le lit, et les « z » qui s'envolent
    let s = `<circle cx="330" cy="330" r="70" fill="#FFF6B0" class="ink" stroke-width="5"/><circle cx="364" cy="306" r="60" fill="#FDF2E0"/>`;
    s += `<rect x="330" y="640" width="560" height="120" rx="30" fill="${C.blue}" class="ink" stroke-width="6"/><rect x="300" y="740" width="620" height="34" rx="12" fill="#B9772E" class="ink" stroke-width="5"/><rect x="300" y="560" width="40" height="210" rx="12" fill="#B9772E" class="ink" stroke-width="5"/><ellipse cx="450" cy="630" rx="90" ry="40" fill="#fff" class="ink" stroke-width="5"/><circle cx="470" cy="${f2(596 + 3 * Math.sin(t * 2))}" r="52" fill="#FFD9B8" class="ink" stroke-width="5"/><path d="M448 600 h16 M482 600 h16" class="ink" stroke-width="5" stroke-linecap="round"/><path d="M420 590 Q470 520 520 590 Z" fill="${C.ink}"/>`;
    for (let i = 0; i < 3; i++) {
      const u = (t * 0.3 + i / 3) % 1;
      s += txt(560 + i * 50 + 30 * u, 520 - u * 140 - i * 24, "z", 50 + i * 18, {
        w: 700,
        fill: C.blue,
        op: 1 - u,
      });
    }
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "bouche") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "grêle") - 0.8, { y: 50 });
  show("#s6-k3", cue("s6-1", "gros") - 0.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "dormir") - 0.2,
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
