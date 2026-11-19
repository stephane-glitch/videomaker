// ---------- Scène 1 : dans le sang, les globules blancs attrapent les intrus… et s'en souviennent ----------
(() => {
  const tV = cue("s1-1", "virus") - 0.5,
    tC = cue("s1-1", "attrapent") - 0.1,
    tE = cue("s1-1", "éliminent") + 0.5;
  const tM = cue("s1-3", "mémoire") - 0.3,
    tV2 = cue("s1-3", "reconnu") - 1.0,
    tC2 = tV2 + 1.1;
  onDraw("s1", (t) => {
    let s = vesselSVG(t, "s1-clip");
    // deux autres gardes qui patrouillent
    s +=
      guardSVG(380 + 40 * Math.sin(t * 0.5), 640 + 20 * Math.sin(t * 0.8), 62, t) +
      guardSVG(1500 + 50 * Math.sin(t * 0.4 + 2), 400 + 24 * Math.sin(t * 0.7), 62, t + 1, 0, -1);
    // le garde principal va à la rencontre du virus
    const go = ramp(t, tV + 0.4, tC),
      back = ramp(t, tE, tE + 1),
      go2 = ramp(t, tV2 + 0.5, tC2);
    const px = 980 + 50 * Math.sin(t * 0.6),
      py = 540 + 26 * Math.sin(t * 0.9);
    const gx = lerp(lerp(px, 760, go * (1 - back)), 620, go2),
      gy = lerp(py, 520, Math.max(go * (1 - back), go2));
    // premier virus
    if (t >= tV && t < tE + 0.2) {
      const u = ramp(t, tV, tC),
        vx = lerp(150, 700, u),
        vy = 520 + 30 * Math.sin(t * 3);
      const eat = ramp(t, tC, tE);
      s += virusSVG(lerp(vx, gx, eat), lerp(vy, gy, eat), 40, t, 1 - eat);
    }
    // second virus : reconnu, attrapé aussitôt
    if (t >= tV2 && t < tC2 + 0.7) {
      const u = ramp(t, tV2, tC2),
        eat = ramp(t, tC2, tC2 + 0.6);
      s += virusSVG(lerp(lerp(150, 560, u), gx, eat), lerp(520, gy, eat), 40, t, 1 - eat);
    }
    const alert = (t > tV + 0.3 && t < tE) || (t > tV2 + 0.2 && t < tC2 + 0.6) ? 1 : 0;
    s += guardSVG(gx, gy, 84, t, alert, -1);
    // l'avis de recherche : la mémoire des gardes
    const m = ramp(t, tM, tM + 0.5);
    if (m > 0)
      s += `<g opacity="${f2(m)}" transform="translate(1440 ${f2(300 - 30 * (1 - m))}) rotate(4)"><rect x="0" y="0" width="290" height="250" rx="18" fill="#fff" class="ink" stroke-width="5"/>${txt(145, 50, "DÉJÀ VU", 38, { w: 700, fill: "#E0455E" })}${virusSVG(145, 150, 42, 0.3)}</g>`;
    $("#s1-draw").innerHTML = s;
  });
  const lab = label(
    "s1",
    "s1-l-g",
    [1040, 470],
    [1100, 150],
    "Un globule blanc",
    "un garde du corps",
  );
  showLabel(lab, cue("s1-1", "globules") - 0.3);
  hideLabel(lab, tV);
  show("#s1-n1", tC + 0.3);
  show("#s1-n2", cue("s1-3", "reconnu") + 0.2);
})();
