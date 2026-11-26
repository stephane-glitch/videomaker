// ---------- Scène 1 : la pupille (le trou) et l'iris (le muscle) ; sombre : elle s'ouvre, soleil : elle se referme ----------
(() => {
  const tP = cue("s1-1", "pupille") - 0.4,
    tI = cue("s1-1", "iris") - 0.4,
    tD = cue("s1-1", "sombre") - 0.5,
    tS = cue("s1-1", "soleil") - 0.6,
    tC = cue("s1-2", "chats") - 0.6;
  onDraw("s1", (t) => {
    const dark = ramp(t, tD, tD + 0.7) * (1 - ramp(t, tS, tS + 0.5)),
      sun = ramp(t, tS, tS + 0.6) * (1 - ramp(t, tC, tC + 0.4)),
      cat = ramp(t, tC, tC + 0.5);
    const p = 0.42 + 0.34 * dark - 0.24 * sun + 0.3 * cat;
    let s = "";
    // le décor : la nuit ou le plein soleil
    if (dark + cat > 0)
      s +=
        `<rect x="130" y="190" width="1660" height="660" rx="34" fill="#1B2445" opacity="${f2(Math.max(dark, cat) * 0.92)}"/>` +
        `<g opacity="${f2(Math.max(dark, cat))}"><circle cx="1500" cy="330" r="70" fill="#FFF6B0"/><circle cx="1530" cy="310" r="60" fill="#1B2445"/></g>`;
    if (sun > 0) s += `<g opacity="${f2(sun)}">${sunSVG(1500, 340, 90, t)}</g>`;
    // des rayons qui entrent dans la pupille
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.6 + i / 5) % 1;
      s += `<path d="M${f2(lerp(1300, 760, u))} ${f2(lerp(380 + i * 30, 540, u))} l-40 ${f2(10 - i * 4)}" stroke="${C.hot}" stroke-width="10" stroke-linecap="round" opacity="${f2((0.35 + 0.65 * sun) * Math.sin(u * Math.PI) * (1 - cat))}"/>`;
    }
    if (cat < 1) s += `<g opacity="${f2(1 - cat)}">${frontEyeSVG(620, 540, 190, p)}</g>`;
    // le chat aux grandes pupilles
    if (cat > 0)
      s += `<g opacity="${f2(cat)}" transform="translate(760 ${f2(560 + 6 * Math.sin(t * 2))})"><path d="M-260 -120 L-300 -330 L-120 -230 Z M260 -120 L300 -330 L120 -230 Z" fill="#FF8A1F" class="ink" stroke-width="6"/><ellipse rx="300" ry="250" fill="#FF8A1F" class="ink" stroke-width="6"/>${frontEyeSVG(-120, -30, 62, 0.86, "#B7DB8A")}${frontEyeSVG(120, -30, 62, 0.86, "#B7DB8A")}<path d="M-20 70 L20 70 L0 96 Z" fill="${C.ink}"/><path d="M0 96 Q-30 140 -70 120 M0 96 Q30 140 70 120" fill="none" class="ink" stroke-width="6" stroke-linecap="round"/><path d="M-170 90 h-150 M-170 120 l-140 30 M170 90 h150 M170 120 l140 30" class="ink" stroke-width="4"/></g>`;
    $("#s1-draw").innerHTML = s;
  });
  const l1 = label(
    "s1",
    "s1-l1",
    [620, 540],
    [1040, 520],
    "La pupille",
    "le trou par où entre la lumière",
  );
  const l2 = label("s1", "s1-l2", [760, 620], [1040, 700], "L’iris", "un muscle coloré");
  showLabel(l1, tP + 0.2);
  showLabel(l2, tI + 0.2);
  [l1, l2].forEach((l) => hideLabel(l, tD - 0.2));
  show("#s1-n1", tD + 0.8);
})();
