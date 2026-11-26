// ---------- Scène 5 : la lumière baisse, le cerveau fabrique la mélatonine ; la lumière des écrans le trompe ----------
(() => {
  const tLu = cue("s5-2", "lumière") - 0.5,
    tMe = cue("s5-2", "mélatonine") - 1.0,
    tEc = cue("s5-2", "écrans") - 0.8,
    tTa = cue("s5-3", "tablette") - 0.6;
  onDraw("s5", (t) => {
    const dark = ramp(t, tLu, tLu + 2.0),
      ec = ramp(t, tEc, tEc + 0.5) * (1 - ramp(t, tTa + 0.6, tTa + 1.4)),
      mel = ramp(t, tMe, tMe + 0.6) * (1 - 0.9 * ec);
    // la fenêtre : le soleil se couche, la nuit tombe
    let s = `<rect x="200" y="260" width="460" height="460" rx="20" fill="${mixHex("#BFE4FF", "#1B2445", dark)}" class="ink" stroke-width="10"/><clipPath id="s5-c"><rect x="206" y="266" width="448" height="448"/></clipPath><g clip-path="url(#s5-c)"><circle cx="430" cy="${f2(lerp(420, 800, dark))}" r="70" fill="${C.hot}"/>${dark > 0.6 ? moonSVG(540, 380, 44, "#1B2445") : ""}</g><path d="M430 260 V720 M200 490 H660" class="ink" stroke-width="8"/>`;
    // le cerveau et sa mélatonine
    s += brainSVG(1060, 440 + 6 * Math.sin(t * 2), 1.5);
    for (let i = 0; i < 12; i++) {
      const u = (t * 0.3 + i / 12) % 1,
        a = rnd(i) * TAU;
      s += `<circle cx="${f2(1060 + (130 + u * 170) * Math.cos(a))}" cy="${f2(440 + (110 + u * 150) * Math.sin(a))}" r="12" fill="#8E5BD6" class="ink" stroke-width="3" opacity="${f2(mel * (1 - u))}"/>`;
    }
    if (mel > 0.3) s += txt(1060, 720, "mélatonine", 44, { w: 700, fill: "#6B3FB8", op: mel });
    // l'écran et sa lumière : le cerveau croit qu'il fait jour
    const tab = ramp(t, tEc, tEc + 0.5);
    if (tab > 0) {
      const sleep = ramp(t, tTa + 0.6, tTa + 1.4);
      s += `<g opacity="${f2(tab)}" transform="translate(1540 ${f2(520 + 30 * (1 - tab))}) rotate(${f2(-8 + 90 * sleep)})"><rect x="-120" y="-170" width="240" height="340" rx="26" fill="#39425C" class="ink" stroke-width="6"/><rect x="-100" y="-150" width="200" height="300" rx="10" fill="${mixHex("#BFE4FF", "#1F2A44", sleep)}"/></g>`;
      if (ec > 0) {
        for (let i = 0; i < 5; i++) {
          const u = (t * 0.9 + i / 5) % 1;
          s += `<path d="M${f2(1400 - u * 200)} ${f2(440 + i * 34)} h-40" stroke="#5F86F0" stroke-width="10" stroke-linecap="round" opacity="${f2(ec * (1 - u))}"/>`;
        }
        s += `<g opacity="${f2(ec)}">${sunSVG(1060, 250, 40, t)}</g>`;
      }
      if (sleep > 0.5) s += zzzSVG(1560, 480, t);
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tMe + 0.4);
  pop("#s5-n2", cue("s5-4", "neuf") - 0.3);
})();
