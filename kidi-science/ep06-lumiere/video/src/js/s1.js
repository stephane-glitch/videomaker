// ---------- Scène 1 : la lumière part du Soleil, rebondit sur le chat, entre dans l'œil ; puis le noir ----------
(() => {
  const tA = cue("s1-1", "part") - 0.3,
    tB = cue("s1-1", "rebondit", 1) - 0.3,
    tC = cue("s1-1", "œil") - 0.5,
    tDark = cue("s1-4", "noir") - 0.5,
    tEyes = cue("s1-5", "voit") - 0.6;
  onDraw("s1", (t) => {
    const dark = ramp(t, tDark, tDark + 0.8);
    let s = "";
    s += `<g opacity="${f2(1 - dark)}">${sunSVG(300, 300, 110, t)}</g>`;
    // le rayon : Soleil → chat → œil (il se redessine en boucle pour montrer le trajet)
    const loop = (t - tA) % 3.2;
    const a = t < tB ? lin(t, tA, tA + 0.6) : lin(loop, 0, 0.6),
      b = t < tB ? 0 : t < tC ? lin(t, tB, tB + 0.6) : lin(loop, 0.6, 1.2);
    if (dark < 1 && t >= tA)
      s += `<g opacity="${f2(1 - dark)}">${raySVG(400, 370, 880, 590, C.spark, a)}${raySVG(900, 590, 1400, 470, C.spark, b)}</g>`;
    s += `<path d="M560 840 H1360" class="ink" stroke-width="8" opacity="${f2(1 - dark * 0.8)}"/>`;
    s += `<g opacity="${f2(1 - dark)}">${catSVG(960, 836, 1.1)}${eyeSVG(1540, 450, 1.4)}</g>`;
    if (dark > 0) {
      s += `<rect x="0" y="0" width="1920" height="1080" fill="${C.ink}" opacity="${f2(dark * 0.94)}"/>`;
      // le chat, lui, voit très bien : deux yeux qui brillent
      const e = lin(t, tEyes, tEyes + 0.3);
      if (e > 0) {
        const bl = Math.abs(Math.sin(t * 0.9)) < 0.06 ? 0.15 : 1;
        for (const dx of [-26, 26])
          s += `<ellipse cx="${960 + dx}" cy="598" rx="15" ry="${f2(19 * bl)}" fill="#B6F25C" opacity="${f2(e)}"/><ellipse cx="${960 + dx}" cy="598" rx="4" ry="${f2(15 * bl)}" fill="${C.ink}" opacity="${f2(e)}"/>`;
      }
    }
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", cue("s1-2", "lumière") - 0.4);
  tl.to("#s1-n1", { opacity: 0, duration: 0.3 }, tDark - 0.1);
  show("#s1-n2", tDark + 0.8);
})();
