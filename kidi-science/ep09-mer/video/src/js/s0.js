// ---------- Scène 0 : la tasse à la plage ; qui a renversé la salière ? Le sel vient des montagnes ----------
(() => {
  const tT = cue("s0-1", "tasse") - 0.3,
    tS = cue("s0-1", "salière") - 0.5,
    tM = cue("s0-2", "montagnes") - 0.5,
    tV = cue("s0-4", "voyage") - 1.2;
  onDraw("s0", (t) => {
    const m = ramp(t, tM, tM + 0.6),
      sh = ramp(t, tS, tS + 0.4) * (1 - ramp(t, tM - 0.4, tM));
    let s = sunSVG(300, 300, 70, t);
    if (m > 0)
      s += `<g opacity="${f2(m)}" transform="translate(0 ${f2(40 * (1 - m))})">${mountSVG(1500, 300, 520, 850)}</g>`;
    s +=
      seaSVG(130, 1090, 640, 850, t) + `<path d="M1090 850 H1790" class="ink" stroke-width="6"/>`;
    // la nageuse qui boit la tasse
    const by = 650 + 12 * Math.sin(t * 2.4),
      yuck = t > tT;
    s += `<circle cx="560" cy="${f2(by)}" r="48" fill="#FFD9B8" class="ink" stroke-width="4"/><path d="M516 ${f2(by - 18)} Q560 ${f2(by - 76)} 604 ${f2(by - 18)} Z" fill="${C.ink}"/>`;
    s += yuck
      ? `<path d="M540 ${f2(by - 4)} l14 8 l-14 8 M580 ${f2(by - 4)} l-14 8 l14 8" fill="none" class="ink" stroke-width="5"/><ellipse cx="560" cy="${f2(by + 24)}" rx="14" ry="${f2(10 + 4 * Math.sin(t * 9))}" fill="${C.ink}"/>`
      : `<circle cx="544" cy="${f2(by)}" r="6" fill="${C.ink}"/><circle cx="576" cy="${f2(by)}" r="6" fill="${C.ink}"/>`;
    if (yuck && t < tT + 1.6) {
      const u = (t - tT) / 1.6;
      for (let i = 0; i < 5; i++)
        s += `<path d="M${f2(600 + u * (60 + i * 20))} ${f2(by + 20 - u * (30 + i * 16) + u * u * 90)} l6 0" stroke="${C.blue}" stroke-width="10" stroke-linecap="round" opacity="${f2(1 - u)}"/>`;
    }
    // la salière géante
    if (sh > 0) {
      s += `<g opacity="${f2(sh)}" transform="translate(860 ${f2(330 + 14 * Math.sin(t * 6))}) rotate(${f2(130 + 8 * Math.sin(t * 12))})"><rect x="-50" y="-90" width="100" height="150" rx="22" fill="#fff" class="ink" stroke-width="5"/><rect x="-56" y="-120" width="112" height="44" rx="16" fill="#9AA6B8" class="ink" stroke-width="5"/>${txt(0, 14, "SEL", 34, { w: 700 })}</g>`;
      for (let i = 0; i < 9; i++) {
        const u = (t * 1.2 + i / 9) % 1;
        s += saltSVG(
          800 - i * 9 + 30 * rnd(i),
          400 + u * 230,
          6,
          u * 200 + i * 40,
          sh * (1 - u * 0.5),
        );
      }
    }
    // le long voyage : un pointillé de la montagne à la mer
    const v = ramp(t, tV, tV + 1.6);
    if (v > 0)
      s +=
        `<path d="M1500 320 C 1300 420, 1250 560, 900 640" fill="none" stroke="${C.fire}" stroke-width="10" stroke-linecap="round" stroke-dasharray="6 26" pathLength="1000" stroke-dashoffset="${f2(-t * 40)}" opacity="${f2(v)}"/>` +
        saltSVG(
          lerp(1500, 900, v) + 60 * Math.sin(v * 3),
          lerp(320, 640, v) - 60 * Math.sin(v * Math.PI),
          13,
          t * 200,
        );
    $("#s0-draw").innerHTML = s;
  });
  pop("#s0-n1", tM + 0.5);
})();
