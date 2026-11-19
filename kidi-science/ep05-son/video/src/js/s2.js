// ---------- Scène 2 : la vitesse du son (l'éclair d'abord, le tonnerre trois secondes après pour un kilomètre) ----------
(() => {
  const tFlash = cue("s2-3", "éclair") - 0.4,
    tAgain = cue("s2-4", "Compte") - 0.3;
  const CX = 330,
    CY = 420,
    OX = 1560,
    D = OX - CX; // le nuage, l'observateur : 1 km à l'échelle
  const secEl = document.getElementById("s2-sec");
  onDraw("s2", (t) => {
    // deux orages successifs : le son met exactement 3 secondes pour parcourir la distance
    const t0 = t >= tAgain ? tAgain : tFlash,
      u = t - t0,
      r = (u / 3) * D;
    let s = `<path d="M120 840 H1800" class="ink" stroke-width="8"/>`;
    s +=
      `<path d="M${CX} 840 H${OX} M${CX} 820 V860 M${OX} 820 V860" class="ink" stroke-width="4"/>` +
      txt((CX + OX) / 2, 890, "1 kilomètre", 40);
    // les fronts d'onde du tonnerre
    if (u > 0 && u < 3.6)
      for (let i = 0; i < 3; i++) {
        const rr = r - i * 46;
        if (rr > 60 && rr < D + 40)
          s += `<path d="M${f2(CX + rr * Math.cos(rad(-34)))} ${f2(CY + 120 + rr * Math.sin(rad(-34)))} A${f2(rr)} ${f2(rr)} 0 0 1 ${f2(CX + rr * Math.cos(rad(22)))} ${f2(CY + 120 + rr * Math.sin(rad(22)))}" fill="none" stroke="${C.blueL}" stroke-width="12" stroke-linecap="round" opacity="${f2(1 - i * 0.3)}"/>`;
      }
    // l'éclair : sa lumière arrive tout de suite
    const fl = u >= 0 && u < 0.5 ? 1 - u / 0.5 : 0;
    if (fl > 0)
      s += `<rect x="0" y="0" width="1920" height="1080" fill="#FFF7C2" opacity="${f2(fl * 0.55)}"/><path d="M${CX + 30} ${CY + 60} L${CX - 30} ${CY + 220} H${CX + 20} L${CX - 40} ${CY + 400}" fill="none" stroke="${C.hot}" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"/><path d="M${CX + 80} ${CY + 40} L${OX - 40} ${640}" stroke="${C.hot}" stroke-width="8" stroke-dasharray="6 18" opacity="${f2(fl)}"/>`;
    s += `<path d="M${CX - 170} ${CY + 40} a80 80 0 0 1 60 -130 a110 110 0 0 1 200 -20 a90 90 0 0 1 100 150 Z" fill="#9AA6B8" class="ink" stroke-width="5"/>`;
    // l'observateur ; il sursaute quand le tonnerre arrive
    const hit = u >= 3 && u < 3.5 ? Math.sin(((u - 3) / 0.5) * Math.PI) : 0;
    s += figSVG(OX, 836 - hit * 26, 1.2, C.blue);
    $("#s2-draw").innerHTML = s;
    secEl.textContent = u < 0 ? "0 s" : `${Math.min(3, Math.floor(u))} s`;
  });
  show("#s2-n1", cue("s2-2", "quarante") - 0.5);
  tl.fromTo("#s2-sec", { opacity: 0 }, { opacity: 1, duration: 0.3 }, tFlash);
  tl.to("#s2-n1", { opacity: 0, duration: 0.3 }, tFlash - 0.2);
  show("#s2-n2", cue("s2-4", "divise") - 0.3);
})();
