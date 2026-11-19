// ---------- Scène 6 : le résumé, puis le printemps qui fait éternuer (annonce des allergies) ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "printemps") - 0.7;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // une fleur, et des grains de pollen qui s'envolent
    let s = `<path d="M520 860 V560" stroke="#3DBE8B" stroke-width="20" stroke-linecap="round"/><path d="M520 720 q-90 -20 -110 -90 q90 0 110 90 Z" fill="#3DBE8B" class="ink"/>`;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU + 0.2;
      s += `<ellipse cx="${f2(520 + 96 * Math.cos(a))}" cy="${f2(500 + 96 * Math.sin(a))}" rx="62" ry="40" transform="rotate(${f2((a * 180) / Math.PI)} ${f2(520 + 96 * Math.cos(a))} ${f2(500 + 96 * Math.sin(a))})" fill="#F7A8B8" class="ink"/>`;
    }
    s += `<circle cx="520" cy="500" r="56" fill="${C.hot}" class="ink" stroke-width="5"/>`;
    for (let i = 0; i < 12; i++) {
      const u = ((t - tSp) * 0.22 + rnd(i)) % 1,
        x = 560 + u * 760,
        y = 470 - 120 * Math.sin(u * Math.PI) + rnd(i + 30) * 200 - 60;
      s += ball(x, y, 13, C.hot, { w: 3, op: Math.sin(u * Math.PI) });
    }
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "droit") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "rebondit") - 0.4, { y: 50 });
  show("#s6-k3", cue("s6-1", "blanc") - 0.4, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, scale: 0.3, rotation: -6 },
    { opacity: 1, scale: 1, rotation: -6, duration: 0.3, ease: "back.out(2.2)" },
    cue("s6-3", "coule") - 0.2,
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
