// ---------- Scène 5 : quand on court, les muscles réclament plus d'oxygène : tout accélère, puis tout se calme ----------
(() => {
  const tM = cue("s5-2", "muscles") - 0.5,
    tVi = cue("s5-2", "vite") - 0.8,
    tRe = cue("s5-2", "respires") - 0.6,
    tCa = cue("s5-4", "calme") - 1.2;
  onDraw("s5", (t) => {
    const eff = ramp(t, scn("s5").start, tVi + 0.6) * (1 - ramp(t, tCa, tCa + 2.0)),
      bpm = lerp(80, 160, eff),
      b = beatAt(t, bpm);
    let s = `<path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
    const bob = 16 * Math.abs(Math.sin(t * (4 + 6 * eff))) * (0.2 + 0.8 * eff);
    s += figSVG(400, 848 - bob, 2.6, C.blue);
    for (let i = 0; i < 3; i++)
      s += `<path d="M${f2(190 - i * 30)} ${560 + i * 70} h${90 - i * 14}" stroke="${C.smoke}" stroke-width="10" stroke-linecap="round" opacity="${f2(eff * (0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i))))}"/>`;
    // le cœur et son rythme
    s +=
      heartSVG(900, 480, 1.1 * (1 + 0.14 * b)) +
      txt(900, 700, Math.round(bpm) + " battements par minute", 44, { w: 700, fill: "#E0455E" });
    // la jauge des muscles
    const m = ramp(t, tM, tM + 0.4);
    if (m > 0)
      s += `<g opacity="${f2(m)}"><rect x="1260" y="300" width="90" height="420" rx="24" fill="#fff" class="ink" stroke-width="5"/><rect x="1270" y="${f2(710 - 400 * (0.3 + 0.7 * eff))}" width="70" height="${f2(400 * (0.3 + 0.7 * eff))}" rx="16" fill="#8FD3FF"/>${txt(1305, 270, "Oxygène demandé", 34, { w: 700 })}</g>`;
    // les poumons qui respirent plus fort
    const r = ramp(t, tRe, tRe + 0.4);
    if (r > 0)
      s += `<g opacity="${f2(r)}" transform="translate(1600 520) scale(${f2(1 + (0.05 + 0.12 * eff) * Math.sin(t * (2 + 5 * eff)))})"><path d="M-20 -60 Q-140 -80 -150 30 Q-150 80 -90 70 Q-30 60 -20 0 Z M20 -60 Q140 -80 150 30 Q150 80 90 70 Q30 60 20 0 Z" fill="#F7A8B8" class="ink" stroke-width="6"/><path d="M0 -110 V-40" class="ink" stroke-width="12" stroke-linecap="round"/></g>`;
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tVi + 0.5);
})();
