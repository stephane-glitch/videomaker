// ---------- Scène 0 : huit heures « à ne rien faire » ? Non : la nuit, le cerveau a trois gros chantiers ----------
(() => {
  const tH = cue("s0-1", "Huit") - 0.4,
    tC = cue("s0-2", "cerveau") - 0.5,
    t3 = cue("s0-4", "Trois") - 0.3;
  onDraw("s0", (t) => {
    let s =
      `<rect x="130" y="190" width="1660" height="660" rx="34" fill="#1B2445" opacity="0.9"/>` +
      moonSVG(1560, 320, 70, "#27304f");
    for (let i = 0; i < 30; i++)
      s += `<circle cx="${f2(160 + rnd(i) * 1600)}" cy="${f2(210 + rnd(i + 50) * 360)}" r="${f2(2 + 2.5 * rnd(i + 9))}" fill="#fff" opacity="${f2(0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i)))}"/>`;
    s += bedSVG(260, 800, 1.1, t) + zzzSVG(520, 560, t, "#BFD4FF");
    // l'horloge des huit heures
    const h = ramp(t, tH, tH + 0.4) * (1 - ramp(t, tC, tC + 0.4));
    if (h > 0)
      s += `<g opacity="${f2(h)}" transform="translate(1180 520)"><circle r="110" fill="#fff" class="ink" stroke-width="6"/><path d="M0 0 V-74" class="ink" stroke-width="8" stroke-linecap="round" transform="rotate(${f2(t * 200)})"/><path d="M0 0 V-50" class="ink" stroke-width="10" stroke-linecap="round" transform="rotate(${f2(t * 17)})"/>${txt(0, 180, "8 heures", 50, { w: 700, fill: "#fff" })}</g>`;
    // le cerveau au travail
    const c = ramp(t, tC, tC + 0.5);
    if (c > 0)
      s += `<g opacity="${f2(c)}">${brainSVG(1180, 480, 1.5)}${gearSVG(1120, 470, 44, 8, t * 1.4, C.hot, "#B88A00")}${gearSVG(1228, 500, 34, 7, -t * 1.8 + 0.3, C.fire, "#B85E00")}</g>`;
    for (let i = 0; i < 3; i++) {
      const k = ramp(t, t3 + i * 0.16, t3 + 0.3 + i * 0.16);
      if (k > 0)
        s += `<g transform="translate(${1000 + i * 180} ${f2(740 + 8 * Math.sin(t * 3 + i))}) scale(${f2(k)})"><circle r="58" fill="${[C.hot, C.air, "#3DBE8B"][i]}" class="ink" stroke-width="5"/>${txt(0, 22, String(i + 1), 64, { w: 700 })}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  pop("#s0-n1", t3 + 0.6);
})();
