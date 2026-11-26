// ---------- Scène 2 : la lumière de Proxima du Centaure met plus de quatre ans à arriver ; celle du Soleil, huit minutes ----------
(() => {
  const tPr = cue("s2-1", "proche") - 0.6,
    tPx = cue("s2-2", "Proxima") - 0.5,
    tQu = cue("s2-2", "quatre") - 0.6,
    tHu = cue("s2-2", "huit") - 0.8,
    tPa = cue("s2-3", "partie") - 0.6,
    tPs = cue("s2-4", "passé") - 0.6;
  onDraw("s2", (t) => {
    let s = nightSkySVG(130, 190, 1660, 660, t, 26);
    const px = ramp(t, tPx, tPx + 0.5),
      hu = ramp(t, tHu, tHu + 0.4);
    s += earthSVG(330, 620, 70, t * 30) + txt(330, 750, "Nous", 40, { w: 700, fill: "#fff" });
    // le Soleil, tout près ; Proxima, très loin
    s += `<g opacity="${f2(0.35 + 0.65 * Math.max(hu, 1 - px))}">${sunSVG(330, 330, 54, t)}</g>`;
    if (t < tPx)
      s += txt(1560, 440, "?", 150, { w: 700, fill: C.hot, op: ramp(t, tPr, tPr + 0.3) });
    if (px > 0)
      s += `<g opacity="${f2(px)}">${starSVG(1560, 400, 22, "#FF9A7A", t)}${txt(1560, 520, "Proxima", 44, { w: 700, fill: "#FFB8A0" })}<path d="M420 600 L1500 420" stroke="#fff" stroke-width="3" stroke-dasharray="8 14" opacity="0.5"/></g>`;
    // le grain de lumière qui voyage
    const qu = ramp(t, tQu, tQu + 0.3);
    if (qu > 0) {
      const u = ((t - tQu) * 0.22) % 1,
        lx = lerp(1500, 420, u),
        ly = lerp(420, 600, u);
      s += `<g opacity="${f2(qu)}"><circle cx="${f2(lx)}" cy="${f2(ly)}" r="26" fill="#FFF6B0" opacity="0.3"/><circle cx="${f2(lx)}" cy="${f2(ly)}" r="12" fill="#FFF6B0"/>${txt(960, 420, "plus de 4 ans", 70, { w: 700, fill: "#FFF6B0" })}</g>`;
    }
    if (hu > 0) {
      const u = ((t - tHu) * 0.9) % 1;
      s += `<g opacity="${f2(hu)}"><circle cx="330" cy="${f2(lerp(400, 540, u))}" r="10" fill="${C.hot}"/>${txt(560, 345, "8 minutes", 50, { w: 700, fill: C.hot })}</g>`;
    }
    // ce que l'on voit ce soir est parti il y a quatre ans
    const pa = ramp(t, tPa, tPa + 0.4);
    if (pa > 0)
      s += `<g opacity="${f2(pa)}" transform="translate(960 690)"><rect x="-330" y="-60" width="660" height="110" rx="26" fill="#0F1630" class="ink" stroke-width="4"/>${txt(0, 14, ramp(t, tPs, tPs + 0.2) > 0.5 ? "Tu regardes le passé" : "Lumière partie il y a 4 ans", 46, { w: 700, fill: "#fff" })}</g>`;
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tPx + 0.5);
  pop("#s2-n2", tPs + 0.4);
})();
