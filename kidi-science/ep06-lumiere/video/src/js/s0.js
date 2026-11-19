// ---------- Scène 0 : la lumière file tout droit, et très vite (7 tours et demi de la Terre en une seconde) ----------
(() => {
  const S = scn("s0");
  const tPk = cue("s0-2", "paquets") - 0.4,
    tRun = cue("s0-4", "seconde") - 0.2,
    tSlow = tRun + 1.6;
  const EX = 1440,
    EY = 600,
    ER = 170,
    RO = 250;
  const tEl = document.getElementById("s0-turns");
  onDraw("s0", (t) => {
    let s = sunSVG(330, 500, 120, t);
    // des paquets de lumière partent du Soleil
    const pk = lin(t, tPk, tPk + 0.4);
    if (pk > 0)
      for (let i = 0; i < 5; i++) {
        const u = (t * 1.4 + i / 5) % 1,
          x = 500 + u * 640;
        s += `<rect x="${f2(x)}" y="${488 + (i % 2) * 24}" width="60" height="14" rx="7" fill="${C.spark}" stroke="${C.ink}" stroke-width="3" opacity="${f2(pk * Math.sin(u * Math.PI))}"/>`;
      }
    s += earthSVG(EX, EY, ER, t * 4);
    // 1) en vrai : 7,5 tours en une seconde (on ne voit qu'un anneau) ; 2) au ralenti
    let turns = 0;
    if (t >= tRun && t < tRun + 1) {
      turns = (t - tRun) * 7.5;
      s += `<circle cx="${EX}" cy="${EY}" r="${RO}" fill="none" stroke="${C.spark}" stroke-width="16" opacity="0.8"/>`;
    } else if (t >= tRun + 1) {
      turns = 7.5;
      if (t >= tSlow) {
        const a = (t - tSlow) * 2.4 - Math.PI / 2;
        s +=
          `<circle cx="${EX}" cy="${EY}" r="${RO}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-dasharray="6 16" opacity="0.5"/>` +
          ball(EX + RO * Math.cos(a), EY + RO * Math.sin(a), 20, C.spark, { w: 4 });
      }
    }
    $("#s0-draw").innerHTML = s;
    tEl.textContent =
      turns >= 7.5 ? "7 tours et demi" : `${Math.floor(turns)} tour${turns >= 2 ? "s" : ""}`;
  });
  show("#s0-logo", S.start + 0.5, { y: -20 });
  show("#s0-n1", tPk + 0.3);
  tl.fromTo("#s0-turns", { opacity: 0 }, { opacity: 1, duration: 0.3 }, tRun - 0.4);
  pop("#s0-n2", tRun + 1.1);
})();
