// ---------- Scène 0 : la purée sans goût ; le goût est un travail d'équipe : la langue et le nez ----------
(() => {
  const tC = cue("s0-1", "carton") - 0.4,
    tE = cue("s0-2", "équipe") - 0.5,
    tL = cue("s0-2", "langue") - 0.3,
    tN = cue("s0-2", "nez") - 0.3,
    tP = cue("s0-3", "partout") - 0.4;
  onDraw("s0", (t) => {
    const e = ramp(t, tE, tE + 0.5);
    // l'assiette de purée et la mine déçue
    let g = `<ellipse cx="520" cy="760" rx="300" ry="60" fill="#fff" class="ink" stroke-width="6"/><path d="M330 740 Q350 600 520 ${f2(600 + 6 * Math.sin(t * 2))} Q690 600 710 740 Q520 800 330 740 Z" fill="#FFE9A8" class="ink" stroke-width="5"/><circle cx="520" cy="400" r="90" fill="#FFD9B8" class="ink" stroke-width="5"/><circle cx="490" cy="390" r="8" fill="${C.ink}"/><circle cx="550" cy="390" r="8" fill="${C.ink}"/><path d="M490 440 q30 -20 60 0" fill="none" class="ink" stroke-width="6" stroke-linecap="round"/><ellipse cx="520" cy="${f2(418 + 2 * Math.sin(t * 6))}" rx="16" ry="12" fill="#E0455E" class="ink" stroke-width="4"/>`;
    const c = ramp(t, tC, tC + 0.35);
    if (c > 0)
      g += `<g transform="translate(1000 ${f2(560 + 8 * Math.sin(t * 3))}) scale(${f2(c)}) rotate(-6)"><path d="M-110 -60 H110 V90 H-110 Z" fill="#D9B48A" class="ink" stroke-width="5"/><path d="M-110 -60 L-70 -110 H150 L110 -60 M110 -60 L150 -110 V40 L110 90" fill="#C49A6C" class="ink" stroke-width="5"/>${txt(0, 36, "CARTON", 34, { w: 700 })}</g>`;
    let s = `<g opacity="${f2(1 - e)}">${g}</g>`;
    // l'équipe : la langue + le nez
    if (e > 0) {
      const kl = ramp(t, tL, tL + 0.35),
        kn = ramp(t, tN, tN + 0.35),
        b = t > tP ? 14 * Math.abs(Math.sin((t - tP) * 7)) * (1 - ramp(t, tP + 0.2, tP + 1.6)) : 0;
      let h = "";
      if (kl > 0)
        h += `<g transform="translate(620 ${f2(540 + 30 * (1 - kl))})" opacity="${f2(kl)}"><rect x="-220" y="-250" width="440" height="480" rx="34" fill="#fff" class="ink" stroke-width="4"/>${tongueSVG(0, -40, 0.62)}${txt(0, 190, "La langue", 46, { w: 700 })}</g>`;
      if (kn > 0)
        h +=
          `<g transform="translate(1300 ${f2(540 + 30 * (1 - kn) - b)})" opacity="${f2(kn)}"><rect x="-220" y="-250" width="440" height="480" rx="34" fill="#fff" class="ink" stroke-width="4"/><path d="M40 -190 C -60 -130, -130 -20, -110 40 C -100 70, -50 76, -20 60 C 0 100, 60 110, 110 96 V-190 Z" fill="#FFD9B8" class="ink" stroke-width="6"/><ellipse cx="-60" cy="46" rx="26" ry="12" fill="${C.ink}"/>${txt(0, 190, "Le nez", 46, { w: 700 })}</g>` +
          txt(960, 580, "+", 150, { w: 700, fill: C.fire, op: kn });
      s += `<g opacity="${f2(e)}">${h}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  pop("#s0-n1", tE + 0.3);
})();
