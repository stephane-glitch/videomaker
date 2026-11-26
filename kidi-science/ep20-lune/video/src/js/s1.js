// ---------- Scène 1 : la Lune, un caillou gris qui renvoie la lumière du Soleil ; une moitié éclairée, l'autre dans le noir ----------
(() => {
  const tC = cue("s1-1", "caillou") - 0.5,
    tR = cue("s1-1", "renvoie") - 0.5,
    tM = cue("s1-3", "moitié") - 0.5,
    tNo = cue("s1-3", "noir") - 0.5;
  onDraw("s1", (t) => {
    let s = nightSkySVG(130, 190, 1660, 660, t) + sunSVG(330, 520, 100, t);
    // les rayons du Soleil, et ceux que la Lune renvoie vers nous
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.5 + rnd(i + 3)) % 1;
      s += `<path d="M${f2(470 + u * 380)} ${440 + i * 40} h60" stroke="${C.hot}" stroke-width="10" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
    }
    const re = ramp(t, tR, tR + 0.4);
    if (re > 0)
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.5 + rnd(i + 11)) % 1;
        s += `<path d="M${f2(1020 + u * 360)} ${f2(640 + u * 120 + i * 14)} l44 15" stroke="#FFF6B0" stroke-width="9" stroke-linecap="round" opacity="${f2(re * Math.sin(u * Math.PI))}"/>`;
      }
    s +=
      rockMoonSVG(1120, 500, 200 + 4 * Math.sin(t * 2)) +
      (re > 0 ? `<g opacity="${f2(re)}">${earthSVG(1560, 760, 70, t * 30)}</g>` : "");
    const c = ramp(t, tC, tC + 0.3) * (1 - ramp(t, tM - 0.3, tM));
    if (c > 0) s += txt(1120, 270, "Un gros caillou gris", 50, { w: 700, fill: "#fff", op: c });
    // les deux moitiés
    const m = ramp(t, tM, tM + 0.3),
      n = ramp(t, tNo, tNo + 0.3);
    if (m > 0)
      s +=
        txt(900, 270, "éclairée", 50, { w: 700, fill: "#FFF6B0", anchor: "end", op: m }) +
        arrowSVG(880, 300, 1000, 400, "#FFF6B0", 10, m);
    if (n > 0)
      s +=
        txt(1360, 270, "dans le noir", 50, { w: 700, fill: "#BFD4FF", anchor: "start", op: n }) +
        arrowSVG(1380, 300, 1250, 400, "#BFD4FF", 10, n);
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tR + 0.4);
  pop("#s1-n2", tNo + 0.4);
})();
