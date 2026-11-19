// ---------- Scène 4 : conducteurs et isolants (on teste une cuillère, une gomme, une mine de crayon) ----------
(() => {
  const S = scn("s4");
  // [arrivée de l'objet, verdict, départ]
  const T = [
    [cue("s4-2", "cuillère") - 0.5, cue("s4-3", "Gagné") - 0.1, cue("s4-3", "gomme") - 0.7],
    [cue("s4-3", "gomme") - 0.4, cue("s4-4", "Non") + 0.1, cue("s4-5", "mine") - 0.7],
    [cue("s4-5", "mine") - 0.4, cue("s4-7", "si") - 0.1, S.end + 5],
  ];
  const PASS = [1, 0, 0.75];
  const X0 = 460,
    X1 = 1460,
    Y0 = 320,
    Y1 = 760,
    gx = 960,
    gap = 380;
  const loop = mkPath([
    [X0, Y1],
    [X0, Y0],
    [X1, Y0],
    [X1, Y1],
  ]);
  const cur = (t) => {
    let c = 0;
    T.forEach(
      ([, v, out], i) =>
        (c = Math.max(c, PASS[i] * ramp(t, v, v + 0.3) * (1 - ramp(t, out, out + 0.3)))),
    );
    return c;
  };
  const steps = [];
  for (let t = S.start; t <= S.end + 0.2; t += 0.1) steps.push([t, 150 * cur(t)]);
  const obj = [
    // cuillère en métal
    (x, y) =>
      `<ellipse cx="${x - 110}" cy="${y}" rx="78" ry="50" fill="#D5DCE8" class="ink" stroke-width="5"/><ellipse cx="${x - 118}" cy="${y - 8}" rx="44" ry="24" fill="#fff" opacity="0.7"/><rect x="${x - 40}" y="${y - 15}" width="230" height="30" rx="15" fill="#D5DCE8" class="ink" stroke-width="5"/>`,
    // gomme
    (x, y) =>
      `<rect x="${x - 170}" y="${y - 56}" width="340" height="112" rx="22" fill="#F7A8B8" class="ink" stroke-width="5"/><rect x="${x - 170}" y="${y - 56}" width="140" height="112" rx="22" fill="#5F86F0" class="ink" stroke-width="5"/>`,
    // crayon vu en coupe : la mine de graphite traverse tout le crayon
    (x, y) =>
      `<path d="M${x - 190} ${y - 44} H${x + 110} L${x + 190} ${y} L${x + 110} ${y + 44} H${x - 190} Z" fill="${C.hot}" class="ink" stroke-width="5"/><path d="M${x + 110} ${y - 44} L${x + 190} ${y} L${x + 110} ${y + 44} Z" fill="#F2D9A0" class="ink" stroke-width="5"/><rect x="${x - 190}" y="${y - 11}" width="380" height="22" rx="6" fill="#3A4256"/>`,
  ];
  onDraw("s4", (t) => {
    const c = cur(t);
    let s =
      wireSVG(loop.d) +
      `<rect x="${gx - gap / 2}" y="${Y1 - 22}" width="${gap}" height="44" fill="#FFF8EC"/>`;
    // deux pinces de chaque côté du trou
    for (const sx of [-1, 1])
      s += `<rect x="${gx + sx * (gap / 2) - 26}" y="${Y1 - 46}" width="52" height="92" rx="14" fill="${C.metal}" class="ink"/>`;
    T.forEach(([a, , out], i) => {
      const inn = rampO(t, a, a + 0.5),
        go = ramp(t, out, out + 0.4);
      if (inn <= 0 || go >= 1) return;
      const y = Y1 + (1 - inn) * 360 - go * 0,
        x = gx + go * 900;
      s += `<g opacity="${f2(Math.min(1, inn * 2) * (1 - go))}">${obj[i](x, y)}</g>`;
    });
    const d = integ(steps, t);
    for (let i = 0; i < 20; i++) {
      const [x, y] = loop.at(d + (i * loop.L) / 20);
      if (Math.abs(x - gx) < gap / 2 + 20 && Math.abs(y - Y1) < 4) continue;
      s += ball(x, y, 13, C.spark, { w: 3 });
    }
    s +=
      `<rect x="${X0 - 70}" y="420" width="140" height="240" rx="24" fill="${C.blue}" class="ink" stroke-width="5"/><rect x="${X0 - 70}" y="420" width="140" height="80" rx="24" fill="${C.fire}" class="ink" stroke-width="5"/>` +
      txt(X0, 476, "+", 60, { fill: "#fff", w: 700 }) +
      txt(X0, 630, "−", 60, { fill: "#fff", w: 700 });
    s += `<g transform="rotate(90 ${X1} 540)">${bulbSVG(X1, 470, c, 0.8)}</g>`;
    $("#s4-draw").innerHTML = s;
  });
  T.forEach(([, v, out], i) => {
    pop(`#s4-r${i + 1}`, v + 0.2);
    if (i < 2) tl.to(`#s4-r${i + 1}`, { opacity: 0, duration: 0.25 }, out);
  });
  pop("#s4-score", cue("s4-8", "partout") - 0.2);
})();
