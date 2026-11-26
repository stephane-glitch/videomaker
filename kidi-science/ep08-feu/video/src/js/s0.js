// ---------- Scène 0 : le gâteau d'anniversaire ; on souffle, la flamme « disparaît » ----------
(() => {
  // l'icône du générique devient une flamme pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML = flameSVG(75, 132, 112, 0);
  const tB = cue("s0-1", "souffle") + 0.25,
    tR = cue("s0-2", "passer") - 0.6,
    tF = cue("s0-3", "foot") - 0.5,
    t3 = cue("s0-4", "trois") - 0.3;
  const CX = [560, 700, 840];
  onDraw("s0", (t) => {
    const out = ramp(t, tB, tB + 0.35),
      back = ramp(t, tR, tR + 0.5);
    let s = `<path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
    // le gâteau
    s += `<rect x="400" y="640" width="600" height="210" rx="34" fill="#F7A8B8" class="ink" stroke-width="5"/><path d="M400 700 q50 60 100 0 q50 60 100 0 q50 60 100 0 q50 60 100 0 q50 60 100 0 q50 60 100 0" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round"/><rect x="360" y="840" width="680" height="26" rx="13" fill="#fff" class="ink" stroke-width="4"/>`;
    CX.forEach((x, i) => {
      s += candleSVG(x, 644, 34, 130, ["#8FD3FF", "#FFE14D", "#3DBE8B"][i]);
      const k = 1 - out + back * (i === 1 ? 1 : 0);
      s += flameSVG(x, 494, 96, t + i, { k, lean: -60 * out * (1 - back) });
      if (out > 0 && k < 0.5)
        s += smokeSVG(
          x,
          490,
          t + i * 0.3,
          Math.min(1, (t - tB) * 0.8) * (1 - ramp(t, tB + 3.5, tB + 5)),
          "#fff",
          9,
          220,
        );
    });
    // le souffle
    const b = (t - tB + 0.25) / 0.7;
    if (b > 0 && b < 1)
      for (let i = 0; i < 5; i++)
        s += `<path d="M${f2(150 + b * 300)} ${f2(430 + i * 30)} h${f2(120 + i * 12)}" stroke="${C.air}" stroke-width="12" stroke-linecap="round" opacity="${f2(1 - b)}"/>`;
    // la partie de foot : un ballon qui rebondit
    const u = (t - tF) / 3.2;
    if (u > 0 && u < 1) {
      const bx = 1100 + u * 620,
        by = 820 - Math.abs(Math.sin(u * Math.PI * 3)) * 300 * (1 - u * 0.6);
      s += `<g transform="rotate(${f2(u * 720)} ${f2(bx)} ${f2(by)})"><circle cx="${f2(bx)}" cy="${f2(by)}" r="44" fill="#fff" class="ink" stroke-width="5"/><path d="M${f2(bx)} ${f2(by - 18)} l17 12 l-7 20 h-20 l-7 -20 Z" fill="${C.ink}"/><path d="M${f2(bx)} ${f2(by - 18)} v-24 M${f2(bx + 17)} ${f2(by - 6)} l22 -8 M${f2(bx + 10)} ${f2(by + 14)} l14 20 M${f2(bx - 10)} ${f2(by + 14)} l-14 20 M${f2(bx - 17)} ${f2(by - 6)} l-22 -8" stroke="${C.ink}" stroke-width="4"/></g>`;
    }
    // les trois joueurs : trois pastilles numérotées
    for (let i = 0; i < 3; i++) {
      const k = ramp(t, t3 + i * 0.18, t3 + 0.3 + i * 0.18);
      if (k > 0)
        s += `<g transform="translate(${1300 + i * 170} ${f2(520 + 10 * Math.sin(t * 3 + i))}) scale(${f2(k)})"><circle r="64" fill="${[C.fire, C.air, C.hot][i]}" class="ink" stroke-width="5"/>${txt(0, 24, String(i + 1), 72, { w: 700 })}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", cue("s0-2", "objet") - 0.3);
  pop("#s0-n2", t3 + 0.5);
})();
