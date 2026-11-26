// ---------- Scène 1 : une étoile, énorme boule de gaz brûlant qui fabrique sa lumière ; le Soleil en est une ----------
(() => {
  const tBo = cue("s1-1", "boule") - 0.6,
    tMi = cue("s1-1", "millions") - 0.5,
    tFa = cue("s1-1", "fabrique") - 0.5,
    tLu = cue("s1-2", "Lune") - 0.5,
    tSo = cue("s1-3", "Soleil") - 0.6,
    tTe = cue("s1-3", "million") - 0.8,
    tMo = cue("s1-4", "moyenne") - 0.5;
  onDraw("s1", (t) => {
    const lu = ramp(t, tLu, tLu + 0.4) * (1 - ramp(t, tSo - 0.3, tSo)),
      te = ramp(t, tTe, tTe + 0.5);
    const cx = lerp(960, 700, Math.max(lu, te)),
      bo = ramp(t, tBo, tBo + 0.5);
    let s = nightSkySVG(130, 190, 1660, 660, t, 26);
    // la lumière qui part dans toutes les directions
    const fa = ramp(t, tFa, tFa + 0.4);
    if (fa > 0)
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU,
          u = (t * 0.6 + rnd(i)) % 1,
          d = 235 + u * 60;
        s += `<path d="M${f2(cx + d * Math.cos(a))} ${f2(520 + d * Math.sin(a))} l${f2(30 * Math.cos(a))} ${f2(30 * Math.sin(a))}" stroke="#FFF6B0" stroke-width="9" stroke-linecap="round" opacity="${f2(fa * Math.sin(u * Math.PI))}"/>`;
      }
    s += `<g transform="translate(${f2(cx)} 520) scale(${f2(0.6 + 0.4 * bo)})">${gasBallSVG(0, 0, 210, t)}</g>`;
    const mi = ramp(t, tMi, tMi + 0.3) * (1 - ramp(t, tLu - 0.3, tLu));
    if (mi > 0)
      s += `<g opacity="${f2(mi)}"><circle cx="${f2(cx)}" cy="520" r="${f2(46 + 6 * Math.sin(t * 6))}" fill="#fff" opacity="0.7"/>${txt(cx, 810, "des millions de degrés", 48, { w: 700, fill: "#FFE28A" })}</g>`;
    // la Lune, elle, emprunte la lumière
    if (lu > 0)
      s += `<g opacity="${f2(lu)}">${arrowSVG(960, 520, 1280, 520, "#FFF6B0", 12)}${rockMoonSVG(1420, 520, 90)}${txt(1420, 690, "elle emprunte", 44, { w: 700, fill: "#BFD4FF" })}</g>`;
    // un million de Terres dans le Soleil
    if (te > 0) {
      let g = "";
      for (let i = 0; i < 40; i++) {
        const k = ramp(t, tTe + 0.3 + i * 0.05, tTe + 0.5 + i * 0.05);
        if (k > 0)
          g += `<g opacity="${f2(k)}">${earthSVG(1180 + (i % 8) * 62, 330 + Math.floor(i / 8) * 62, 22, t * 30 + i * 40)}</g>`;
      }
      s += `<g opacity="${f2(te)}">${g}${txt(1400, 720, "1 000 000 de Terres", 54, { w: 700, fill: "#FFF6B0" })}</g>`;
    }
    const so = ramp(t, tSo, tSo + 0.3) * (1 - ramp(t, tMo + 1.5, tMo + 1.8));
    if (so > 0) s += txt(cx, 260, "Notre Soleil", 50, { w: 700, fill: "#fff", op: so });
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tFa + 0.4);
  show("#s1-n2", tSo + 0.6);
})();
