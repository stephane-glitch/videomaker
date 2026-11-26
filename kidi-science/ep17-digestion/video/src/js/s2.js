// ---------- Scène 2 : l'estomac malaxe pendant des heures avec un jus acide ; la tartine devient une soupe ----------
(() => {
  const tMa = cue("s2-1", "malaxe") - 0.5,
    tH = cue("s2-1", "heures") - 0.8,
    tAc = cue("s2-1", "acide") - 0.6,
    tGl = cue("s2-3", "gluante") - 0.8,
    tSo = cue("s2-5", "soupe") - 0.8;
  const X = 1260,
    Y = 540;
  onDraw("s2", (t) => {
    const so = ramp(t, tMa, tSo + 0.5),
      w = 18 * Math.sin(t * 3) * ramp(t, tMa, tMa + 0.4),
      gl = ramp(t, tGl, tGl + 0.4);
    let s = tractSVG(360, 560, 0.75, 1, lerp(1 / 13, 3 / 13, 0.5 + 0.5 * Math.sin(t * 1.5)), t);
    // la poche, qui se tord en malaxant
    const d = `M${X - 60} ${Y - 300} C ${X + 60} ${Y - 300}, ${X + 300 + w} ${Y - 240}, ${X + 300 + w} ${Y - 20} C ${X + 300 - w} ${Y + 200}, ${X + 80} ${Y + 280 + w}, ${X - 120} ${Y + 250} C ${X - 300 - w} ${Y + 220}, ${X - 320} ${Y + 40 - w}, ${X - 200} ${Y - 60} C ${X - 120} ${Y - 130}, ${X - 140} ${Y - 220}, ${X - 60} ${Y - 300} Z`;
    s +=
      `<path d="${d}" fill="#F7A8B8" class="ink" stroke-width="7"/>` +
      (gl > 0
        ? `<path d="${d}" fill="none" stroke="#B7DB8A" stroke-width="22" opacity="${f2(gl)}" transform="translate(${X * 0.06} ${Y * 0.06}) scale(0.94)"/>`
        : "");
    s += `<clipPath id="s2-c"><path d="${d}" transform="translate(${X * 0.1} ${Y * 0.1}) scale(0.9)"/></clipPath><g clip-path="url(#s2-c)"><rect x="${X - 340}" y="${f2(Y + 20 - 60 * so + 10 * Math.sin(t * 2))}" width="700" height="400" fill="${mixHex("#FFF3C4", "#E6B45A", so)}"/>`;
    // les morceaux de tartine tournent et rétrécissent
    for (let i = 0; i < 6; i++) {
      const a = t * 1.4 + (i / 6) * TAU,
        r = 120 + 30 * Math.sin(t + i);
      s += `<rect x="${f2(X + r * Math.cos(a) - 30 * (1 - so))}" y="${f2(Y + 90 + 60 * Math.sin(a) - 20 * (1 - so))}" width="${f2(60 * (1 - so))}" height="${f2(40 * (1 - so))}" rx="8" fill="#EBC07E" class="ink" stroke-width="3" transform="rotate(${f2(a * 60)} ${f2(X + r * Math.cos(a))} ${f2(Y + 90 + 60 * Math.sin(a))})"/>`;
    }
    s += `</g>`;
    // les gouttes de jus acide
    const ac = ramp(t, tAc, tAc + 0.4);
    if (ac > 0)
      for (let i = 0; i < 7; i++) {
        const u = (t * 0.7 + i / 7) % 1,
          a = rad(-150 + i * 22);
        s += `<circle cx="${f2(X + 30 + (230 - u * 120) * Math.cos(a))}" cy="${f2(Y - 40 + (210 - u * 110) * Math.sin(a))}" r="11" fill="#D6E84A" class="ink" stroke-width="3" opacity="${f2(ac * (1 - u))}"/>`;
      }
    // l'horloge
    const h = ramp(t, tH, tH + 0.4);
    if (h > 0)
      s += `<g opacity="${f2(h)}" transform="translate(1700 320)"><circle r="76" fill="#fff" class="ink" stroke-width="6"/><path d="M0 0 V-50" class="ink" stroke-width="7" stroke-linecap="round" transform="rotate(${f2(t * 120)})"/><path d="M0 0 V-34" class="ink" stroke-width="9" stroke-linecap="round" transform="rotate(${f2(t * 10)})"/>${txt(0, 130, "2 à 3 h", 40, { w: 700 })}</g>`;
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tAc + 0.5);
})();
