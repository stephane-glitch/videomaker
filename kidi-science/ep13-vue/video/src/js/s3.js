// ---------- Scène 3 : l'image doit tomber pile sur la rétine ; trop tôt ou trop tard, c'est flou ; les lunettes corrigent ----------
(() => {
  const tN = cue("s3-2", "nette") - 0.5,
    tA = cue("s3-2", "avant") - 0.5,
    tAp = cue("s3-2", "après") - 0.5,
    tF = cue("s3-2", "flou") - 0.5,
    tL = cue("s3-3", "lunettes") - 0.6,
    tFix = cue("s3-4", "deuxième") - 0.2;
  const EX = 760,
    EY = 540,
    R = 300,
    LX = EX - R * 0.62,
    RX = EX + R * 0.98;
  onDraw("s3", (t) => {
    // où les rayons se rejoignent : sur la rétine, avant, ou après
    const gl = ramp(t, tL, tL + 0.5),
      fix = ramp(t, tFix, tFix + 0.8);
    let off =
      -130 * ramp(t, tA, tA + 0.5) + 240 * ramp(t, tAp, tAp + 0.5) - 240 * ramp(t, tF + 1.2, tL);
    off = lerp(off, 0, fix);
    const fx = RX + off,
      blur = Math.min(1, Math.abs(off) / 110);
    let s = eyeCutSVG(EX, EY, R);
    // les rayons
    [-1, 1].forEach((d) => {
      const y0 = EY + d * 90;
      s += `<path d="M150 ${y0} H${LX}" stroke="${C.fire}" stroke-width="9" stroke-linecap="round"/><path d="M${LX} ${y0} L${f2(fx)} ${EY}" stroke="${C.fire}" stroke-width="9" stroke-linecap="round"/>`;
      if (off < 0)
        s += `<path d="M${f2(fx)} ${EY} L${RX} ${f2(EY - d * 90 * (-off / (fx - LX)))}" stroke="${C.fire}" stroke-width="9" stroke-linecap="round" opacity="0.6"/>`;
    });
    s += `<circle cx="${f2(Math.min(fx, RX + 150))}" cy="${EY}" r="${f2(16 + 4 * Math.sin(t * 6))}" fill="${blur < 0.15 ? "#3DBE8B" : "#E0455E"}" class="ink" stroke-width="4"/>`;
    // le verre de lunettes
    if (gl > 0)
      s += `<g opacity="${f2(gl)}" transform="translate(${f2(300 - 60 * (1 - gl))} ${EY})"><path d="M-22 -190 Q24 0 -22 190 Q-70 0 -22 -190 Z" fill="#CFEFFF" fill-opacity="0.8" class="ink" stroke-width="6"/></g>`;
    // ce que l'on voit : net ou flou
    let v = `<rect x="1320" y="320" width="440" height="440" rx="34" fill="#fff" class="ink" stroke-width="5"/>`;
    const n = blur > 0.1 ? 5 : 1;
    for (let i = 0; i < n; i++)
      v += `<g opacity="${f2(n === 1 ? 1 : 0.28)}" transform="translate(${f2(1540 + (n === 1 ? 0 : (i - 2) * 18 * blur))} ${f2(540 + (n === 1 ? 0 : (((i * 7) % 5) - 2) * 8 * blur))})">${treeSVG(0, 170, 320)}</g>`;
    v += txt(1540, 300, blur > 0.1 ? "Flou" : "Net", 54, {
      w: 700,
      fill: blur > 0.1 ? "#E0455E" : "#2E9A6E",
    });
    s += v;
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tN + 0.5);
  pop("#s3-n2", tFix + 0.4);
})();
