// ---------- Scène 0 : la tartine voyage dans un toboggan de sept mètres, plié dans le ventre ----------
(() => {
  const tT = cue("s0-2", "toboggan") - 0.5,
    tS = cue("s0-2", "sept") - 0.4,
    tC = cue("s0-3", "cinquante") - 1.2;
  onDraw("s0", (t) => {
    const u = ((t - scn("s0").start) * 0.07) % 1;
    let s = tractSVG(520, 560, 0.95, -1, ramp(t, tT, tT + 0.3) > 0 ? u : -1, t);
    if (t < tT)
      s +=
        toastSVG(900 + 10 * Math.sin(t * 3), 420 + 10 * Math.cos(t * 2), -8, 0.9) +
        txt(1100, 460, "?", 160, { w: 700, fill: "#C25E00" });
    // le tuyau déroulé : sept mètres, à côté d'une enfant d'un mètre quarante
    const r = ramp(t, tS, tS + 1.2);
    if (r > 0) {
      s += `<path d="M900 420 H${f2(900 + 860 * r)}" stroke="${C.ink}" stroke-width="44" stroke-linecap="round"/><path d="M900 420 H${f2(900 + 860 * r)}" stroke="#F7B9B0" stroke-width="32" stroke-linecap="round"/>`;
      for (let i = 1; i <= 7; i++)
        if (r > i / 7 - 0.02)
          s +=
            `<path d="M${900 + i * 122.8} 460 v24" class="ink" stroke-width="5"/>` +
            txt(900 + i * 122.8, 524, i + " m", 30, { w: 700 });
      const c = ramp(t, tC, tC + 0.4);
      if (c > 0)
        s += `<g opacity="${f2(c)}">${figSVG(986, 800, 1.5, C.blue)}<path d="M900 836 H1072" class="ink" stroke-width="6"/><path d="M900 600 v236 M1072 600 v236" class="ink" stroke-width="3" stroke-dasharray="8 8"/>${txt(1230, 720, "1,40 m", 46, { w: 700, fill: C.blue })}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  pop("#s0-n1", cue("s0-4", "rangé") - 0.6);
})();
