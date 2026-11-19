// ---------- Scène 4 : les molécules (l'eau, puis le gaz des bulles et le poison) ----------
(() => {
  const tH = cue("s4-1", "hydrogène") - 0.4,
    tO = cue("s4-1", "oxygène") - 0.4,
    tJoin = cue("s4-1", "devine") - 0.5;
  const tC = cue("s4-3", "carbone") - 0.4,
    tO2 = cue("s4-3", "deux") - 0.4,
    tLose = cue("s4-3", "seul", 1) - 0.5;
  const at = (k, x, y, op = 1, sc = 1) =>
    ball(x, y, ATOM[k][1] * sc, ATOM[k][0], { op }) +
    txt(x, y + 14 * sc, k, 40 * sc, { fill: k === "H" ? C.ink : "#fff", w: 700, op });
  const bond = (x1, y1, x2, y2, op = 1) =>
    `<path d="M${f2(x1)} ${f2(y1)} L${f2(x2)} ${f2(y2)}" stroke="${C.ink}" stroke-width="16" stroke-linecap="round" opacity="${f2(op)}"/>`;
  onDraw("s4", (t) => {
    let s = "";
    // --- l'eau : deux H et un O qui s'accrochent ---
    const j = ramp(t, tJoin, tJoin + 0.6),
      wig = 6 * Math.sin(t * 3);
    const small = ramp(t, tC - 0.9, tC - 0.3); // l'eau se range à gauche avant le carbone
    const ox = lerp(960, 500, small),
      oy = lerp(520, 540, small),
      k = lerp(1.25, 1, small);
    const hp = (sg) => {
      const far = [ox + sg * 420, oy + 120 + wig * sg];
      const bx = ox + sg * Math.sin(rad(52)) * 96 * k,
        by = oy + Math.cos(rad(52)) * 96 * k;
      return [lerp(far[0], bx, j), lerp(far[1], by, j)];
    };
    const h1 = hp(-1),
      h2 = hp(1);
    const oIn = lin(t, tO, tO + 0.4),
      hIn = lin(t, tH, tH + 0.4);
    if (j > 0.6)
      s +=
        bond(ox, oy, h1[0], h1[1], (j - 0.6) / 0.4) + bond(ox, oy, h2[0], h2[1], (j - 0.6) / 0.4);
    if (hIn > 0) s += at("H", h1[0], h1[1], hIn, k) + at("H", h2[0], h2[1], hIn, k);
    if (oIn > 0) s += at("O", ox, oy - (1 - j) * 60, oIn, k);
    // --- le carbone et ses oxygènes ---
    const cIn = lin(t, tC, tC + 0.4),
      o2 = ramp(t, tO2, tO2 + 0.6),
      lose = ramp(t, tLose, tLose + 0.8);
    if (cIn > 0) {
      const cx = 1400,
        cy = 540;
      const lx = lerp(cx - 420, cx - 150, o2),
        rx = lerp(cx + 420, cx + 150, o2) + lose * 420,
        ry = cy - lose * 260;
      if (o2 > 0.6)
        s +=
          bond(cx, cy - 12, lx, cy - 12, (o2 - 0.6) / 0.4) +
          bond(cx, cy + 12, lx, cy + 12, (o2 - 0.6) / 0.4);
      if (o2 > 0.6 && lose < 0.2)
        s +=
          bond(cx, cy - 12, rx, cy - 12, ((o2 - 0.6) / 0.4) * (1 - lose * 5)) +
          bond(cx, cy + 12, rx, cy + 12, ((o2 - 0.6) / 0.4) * (1 - lose * 5));
      if (o2 > 0) s += at("O", lx, cy, o2) + at("O", rx, ry, o2 * (1 - lose));
      s += at("C", cx, cy, cIn);
      // des bulles montent tant que c'est du CO₂
      if (o2 > 0.9 && lose < 0.5)
        for (let i = 0; i < 7; i++) {
          const u = (t * 0.5 + i / 7) % 1;
          s += `<circle cx="${f2(cx - 190 + i * 64 + 10 * Math.sin(t * 3 + i))}" cy="${f2(380 - u * 190)}" r="${10 + (i % 3) * 5}" fill="#fff" stroke="${C.ink}" stroke-width="3" opacity="${f2((1 - u) * (1 - lose * 2))}"/>`;
        }
      // panneau « danger » quand il ne reste qu'un oxygène
      if (lose > 0.6) {
        const op = (lose - 0.6) / 0.4;
        s += `<g opacity="${f2(op)}"><path d="M${cx} 250 L${cx + 86} 400 H${cx - 86} Z" fill="${C.hot}" class="ink" stroke-width="6"/>${txt(cx, 388, "!", 90, { w: 700 })}</g>`;
      }
    }
    $("#s4-draw").innerHTML = s;
  });
  pop("#s4-n1", cue("s4-2", "eau") - 0.2);
  pop("#s4-n2", cue("s4-3", "bulles") - 0.3);
  tl.to("#s4-n2", { opacity: 0, duration: 0.25 }, tLose + 0.4);
  pop("#s4-n3", cue("s4-3", "poison") - 0.3);
})();
