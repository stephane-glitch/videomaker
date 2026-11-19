// ---------- Scène 1 : la corde vibre, l'air se pousse de proche en proche, comme une ola ----------
(() => {
  const tPl = cue("s1-1", "pince") - 0.1,
    tAir = cue("s1-2", "air") - 0.5,
    tWave = cue("s1-3", "pousse") - 0.3,
    tOla = cue("s1-4", "ola") - 0.7;
  const SX = 330; // position de la corde (verticale)
  onDraw("s1", (t) => {
    const ola = ramp(t, tOla, tOla + 0.6);
    const k = lerp(1, 0.7, ola),
      ty = lerp(0, -110, ola);
    let s = `<g transform="translate(960 ${f2(540 + ty)}) scale(${f2(k)}) translate(-960 -540)">`;
    // la corde : pincée, elle vibre en s'amortissant puis reste entretenue
    const u = t - tPl,
      amp = u < 0 ? 0 : 46 * Math.max(0.45, Math.exp(-u * 0.5)),
      ph = Math.sin(u * 26);
    let d = "";
    for (let y = 280; y <= 800; y += 10)
      d += `${y === 280 ? "M" : "L"}${f2(SX + amp * ph * Math.sin(((y - 280) / 520) * Math.PI))} ${y}`;
    s += `<rect x="${SX - 60}" y="250" width="120" height="34" rx="12" fill="#D9A66B" class="ink"/><rect x="${SX - 60}" y="796" width="120" height="34" rx="12" fill="#D9A66B" class="ink"/><path d="${d}" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.fire}" stroke-width="5" stroke-linecap="round"/>`;
    // l'air : des grains qui se serrent et s'écartent ; l'onde avance, les grains restent sur place
    const air = lin(t, tAir, tAir + 0.5),
      go = t >= tWave ? 1 : 0;
    if (air > 0)
      for (let j = 0; j < 9; j++)
        for (let i = 0; i < 26; i++) {
          const bx = 470 + i * 52 + (j % 2) * 26,
            by = 300 + j * 60;
          const front = (t - tWave) * 520 + 470; // l'onde part de la corde et avance
          const dx = go && bx < front ? 20 * Math.sin((bx / 190) * TAU - (t - tWave) * 17) : 0;
          const red = i === 12 && j === 4;
          s += `<circle cx="${f2(bx + dx)}" cy="${by}" r="${red ? 15 : 10}" fill="${red ? "#E0455E" : C.blueL}" opacity="${f2(air * (red ? 1 : 0.8))}"/>`;
        }
    s += `</g>`;
    // la ola : une rangée de spectateurs, la vague passe de l'un à l'autre
    if (ola > 0) {
      let g = `<rect x="150" y="900" width="1620" height="18" rx="9" fill="${C.side}" class="ink"/>`;
      for (let i = 0; i < 16; i++) {
        const up = Math.max(0, Math.sin((t - tOla) * 4.2 - i * 0.55)),
          x = 210 + i * 100;
        g +=
          figSVG(x, 900 - up * 34, 0.62, i === 8 ? "#E0455E" : C.blue) +
          `<path d="M${x - 16} ${f2(842 - up * 34)} L${x - 34} ${f2(836 - up * 80)} M${x + 16} ${f2(842 - up * 34)} L${x + 34} ${f2(836 - up * 80)}" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>`;
      }
      s += `<g opacity="${f2(ola)}">${g}</g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", cue("s1-1", "vibre") - 0.3);
  show("#s1-n2", cue("s1-3", "onde") - 0.5);
  tl.to(["#s1-n1", "#s1-n2"], { opacity: 0, duration: 0.3 }, tOla - 0.1);
  show("#s1-n3", cue("s1-4", "place") - 0.3);
})();
