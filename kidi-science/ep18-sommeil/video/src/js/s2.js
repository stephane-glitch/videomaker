// ---------- Scène 2 : le ménage : un liquide circule entre les cellules du cerveau et rince les déchets ----------
(() => {
  const tD = cue("s2-1", "déchets") - 0.6,
    tL = cue("s2-1", "liquide") - 0.5,
    tMa = cue("s2-2", "machine") - 0.5;
  const CELLS = [];
  for (let j = 0; j < 3; j++)
    for (let i = 0; i < 5; i++) CELLS.push([330 + i * 260 + (j % 2) * 130, 330 + j * 190]);
  onDraw("s2", (t) => {
    const w = ramp(t, tL, tL + 2.6),
      ma = ramp(t, tMa, tMa + 0.4);
    let g = `<rect x="150" y="210" width="1380" height="620" rx="40" fill="#FBE4EA" class="ink" stroke-width="6"/><clipPath id="s2-c"><rect x="156" y="216" width="1368" height="608" rx="36"/></clipPath><g clip-path="url(#s2-c)">`;
    // la vague de liquide qui traverse
    if (w > 0)
      g += `<path d="M${f2(lerp(-300, 1700, w))} 200 q-80 160 0 320 t0 320 H${f2(lerp(-900, 1100, w))} q-80 -160 0 -320 t0 -320 Z" fill="#8FD3FF" opacity="0.7"/>`;
    // les déchets entre les cellules : emportés quand la vague passe
    const d = ramp(t, tD, tD + 0.6);
    for (let i = 0; i < 26; i++) {
      const x0 = 200 + rnd(i) * 1280,
        y0 = 250 + rnd(i + 40) * 540,
        front = lerp(-300, 1700, w),
        taken = w > 0 && front > x0 ? 1 : 0,
        x = taken ? x0 + (front - x0) : x0;
      g += `<circle cx="${f2(x + 5 * Math.sin(t * 3 + i))}" cy="${f2(y0 + 5 * Math.cos(t * 2.4 + i))}" r="12" fill="#8E96A3" class="ink" stroke-width="3" opacity="${f2(d * (i / 26 < d ? 1 : 0))}"/>`;
    }
    CELLS.forEach(
      ([x, y], i) =>
        (g += `<circle cx="${x}" cy="${f2(y + 5 * Math.sin(t * 1.6 + i))}" r="70" fill="#F7A8B8" class="ink" stroke-width="5"/><circle cx="${x + 10}" cy="${f2(y + 6 + 5 * Math.sin(t * 1.6 + i))}" r="24" fill="#D76A7E"/>`),
    );
    g += `</g>`;
    let s = `<g opacity="${f2(1 - 0.8 * ma)}">${g}</g>` + bedSVG(1540, 850, 0.45, t);
    // la machine à laver dans la tête
    if (ma > 0)
      s += `<g opacity="${f2(ma)}" transform="translate(840 ${f2(520 + 20 * (1 - ma))})"><rect x="-200" y="-240" width="400" height="480" rx="34" fill="#fff" class="ink" stroke-width="6"/><circle r="130" fill="#D3DAE6" class="ink" stroke-width="6"/><circle r="104" fill="#8FD3FF" class="ink" stroke-width="5"/><g transform="rotate(${f2(t * 220)})"><path d="M-80 0 q40 -50 80 0 t80 0" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="-40" cy="40" r="12" fill="#8E96A3"/><circle cx="46" cy="-30" r="12" fill="#8E96A3"/></g><circle cx="-140" cy="-190" r="16" fill="${C.fire}" class="ink" stroke-width="4"/><rect x="60" y="-204" width="100" height="28" rx="10" fill="#D3DAE6" class="ink" stroke-width="4"/></g>`;
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tL + 0.8);
})();
