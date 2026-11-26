// ---------- Scène 1 : la langue, ses papilles, et les bourgeons du goût ; la salive amène les molécules ----------
(() => {
  const tPa = cue("s1-1", "papilles") - 0.4,
    tB = cue("s1-1", "bourgeons") - 0.9,
    tSa = cue("s1-3", "salive") - 0.5,
    tF = cue("s1-3", "fondre") - 0.5,
    tG = cue("s1-3", "glissent") - 0.5;
  const X0 = 1000,
    Y0 = 290,
    W = 760,
    H = 500;
  onDraw("s1", (t) => {
    // la bouche ouverte et la langue tirée
    let s =
      `<ellipse cx="520" cy="330" rx="300" ry="130" fill="#7A2231" class="ink" stroke-width="7"/><path d="M260 290 Q520 200 780 290" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round"/>` +
      tongueSVG(520, 560 + 6 * Math.sin(t * 2), 1, 0.35 + 0.65 * ramp(t, tPa, tPa + 0.4));
    const z = ramp(t, tB, tB + 0.5);
    if (z > 0) {
      // le gros plan : une papille en coupe, avec ses bourgeons en forme d'oignon
      let g = `<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" rx="34" fill="#fff" class="ink" stroke-width="6"/><clipPath id="s1-c"><rect x="${X0 + 6}" y="${Y0 + 6}" width="${W - 12}" height="${H - 12}" rx="30"/></clipPath><g clip-path="url(#s1-c)">`;
      const sal = ramp(t, tSa, tSa + 0.6);
      g += `<path d="M${X0} ${Y0 + 250} H${X0 + 150} Q${X0 + 170} ${Y0 + 130} ${X0 + 380} ${Y0 + 130} Q${X0 + 590} ${Y0 + 130} ${X0 + 610} ${Y0 + 250} H${X0 + W} V${Y0 + H} H${X0} Z" fill="#F08A9B" class="ink" stroke-width="5"/>`;
      if (sal > 0)
        g += `<path d="M${X0} ${Y0 + 236} H${X0 + 140} Q${X0 + 160} ${Y0 + 110} ${X0 + 380} ${Y0 + 110} Q${X0 + 600} ${Y0 + 110} ${X0 + 620} ${Y0 + 236} H${X0 + W}" fill="none" stroke="#8FD3FF" stroke-width="30" stroke-linecap="round" opacity="${f2(0.75 * sal)}" stroke-dasharray="60 6" stroke-dashoffset="${f2(-t * 50)}"/>`;
      [
        [200, 330],
        [560, 330],
        [380, 230],
      ].forEach(([bx, by], i) => {
        const x = X0 + bx,
          y = Y0 + by;
        g += `<path d="M${x} ${y - 70} Q${x + 70} ${y - 20} ${x + 50} ${y + 60} Q${x} ${y + 90} ${x - 50} ${y + 60} Q${x - 70} ${y - 20} ${x} ${y - 70} Z" fill="${C.hot}" class="ink" stroke-width="4"/><path d="M${x} ${y - 60} V${y + 70} M${x - 24} ${y - 30} Q${x - 30} ${y + 30} ${x - 16} ${y + 70} M${x + 24} ${y - 30} Q${x + 30} ${y + 30} ${x + 16} ${y + 70}" fill="none" class="ink" stroke-width="3"/><path d="M${x} ${y + 84} v${f2(40 + 6 * Math.sin(t * 5 + i))}" stroke="${C.ink}" stroke-width="6" stroke-dasharray="6 8"/>`;
      });
      // un bout de fraise fond dans la salive, ses molécules glissent vers un bourgeon
      const fd = ramp(t, tF, tF + 1.0),
        gl = ramp(t, tG, tG + 1.2);
      if (t > tSa + 0.3)
        g += berrySVG(X0 + 380, Y0 + 60 + 6 * Math.sin(t * 3), 0.9 * (1 - 0.6 * fd));
      if (fd > 0)
        for (let i = 0; i < 7; i++) {
          const u = (t * 0.3 + i / 7) % 1;
          g += molSVG(
            lerp(X0 + 380 + (i - 3) * 30 * fd, X0 + 380, gl * u),
            lerp(Y0 + 96, Y0 + 170, gl * u) + 6 * Math.sin(t * 4 + i),
            8,
            "#E0455E",
            t * 50 + i * 40,
            fd,
          );
        }
      g += `</g>`;
      s += `<g opacity="${f2(z)}" transform="translate(${f2(40 * (1 - z))} 0)">${g}</g><path d="M600 520 L${X0 - 4} 480" class="ink" stroke-width="4" stroke-dasharray="10 10" opacity="${f2(z)}"/>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  const l1 = label(
    "s1",
    "s1-l1",
    [440, 600],
    [110, 700],
    "Les papilles",
    "les petites bosses de la langue",
  );
  showLabel(l1, tPa + 0.2);
  const l2 = label(
    "s1",
    "s1-l2",
    [X0 + 580, Y0 + 300],
    [1400, 190],
    "Un bourgeon du goût",
    "tu en as des milliers",
  );
  showLabel(l2, tB + 0.6);
  show("#s1-n1", cue("s1-4", "sèche") - 0.4);
})();
