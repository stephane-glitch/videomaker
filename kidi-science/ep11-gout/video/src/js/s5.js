// ---------- Scène 5 : le piment triche (capteurs de chaleur), la menthe aussi (capteurs de froid) ----------
(() => {
  const tT = cue("s5-2", "triche") - 0.4,
    tC = cue("s5-2", "capteurs") - 0.5,
    tB = cue("s5-2", "brûle") - 0.5,
    tM = cue("s5-3", "menthe") - 0.5;
  const sensor = (x, y, on, col, t) =>
    `<g transform="translate(${x} ${y})"><circle r="${f2(40 + 6 * on * Math.sin(t * 12))}" fill="${mixHex("#FFFFFF", col, on)}" class="ink" stroke-width="5"/><rect x="-8" y="-24" width="16" height="36" rx="8" fill="${C.ink}"/><circle cy="16" r="12" fill="${C.ink}"/></g>`;
  onDraw("s5", (t) => {
    const m = ramp(t, tM, tM + 0.5);
    // la langue, le piment qui arrive, les capteurs de chaleur qui s'affolent
    let s = tongueSVG(560, 560, 0.95, 0.6);
    const hot = ramp(t, tC, tC + 0.4) * (1 - m),
      cold = ramp(t, tM + 0.5, tM + 0.9);
    s +=
      sensor(480, 500, hot, C.fire, t) +
      sensor(640, 620, hot, C.fire, t) +
      sensor(600, 420, cold, C.air, t) +
      sensor(480, 680, cold, C.air, t);
    const arr = ramp(t, scn("s5").start + 0.2, scn("s5").start + 0.9);
    s += `<g transform="translate(${f2(lerp(-200, 380, arr) - 600 * m)} ${f2(330 + 8 * Math.sin(t * 3))}) rotate(${f2(20 + 6 * Math.sin(t * 5))})"><path d="M-120 0 Q-60 -60 60 -30 Q120 -10 130 30 Q40 20 -40 40 Q-100 50 -120 0 Z" fill="#E0455E" class="ink" stroke-width="5"/><path d="M-120 0 Q-150 -30 -140 -60" fill="none" stroke="#3DBE8B" stroke-width="14" stroke-linecap="round"/></g>`;
    if (hot > 0)
      s += flameSVG(480, 470, 150, t, { k: hot }) + flameSVG(640, 590, 130, t + 1, { k: hot });
    // le thermomètre : la température, elle, n'a pas bougé
    const th = ramp(t, tT, tT + 0.4);
    if (th > 0)
      s += `<g opacity="${f2(th)}" transform="translate(960 560)"><rect x="-24" y="-200" width="48" height="330" rx="24" fill="#fff" class="ink" stroke-width="5"/><circle cy="150" r="44" fill="#E0455E" class="ink" stroke-width="5"/><rect x="-10" y="20" width="20" height="110" fill="#E0455E"/>${txt(0, 240, "37 °C", 40, { w: 700 })}${txt(0, 280, "rien n’est chaud", 30)}</g>`;
    // le cerveau se fait avoir
    const br = ramp(t, tB, tB + 0.3);
    if (br > 0)
      s +=
        `<g opacity="${f2(br)}" transform="translate(1440 ${f2(440 + 8 * Math.sin(t * 2))})"><path d="M-110 20 C -150 -40, -110 -110, -40 -100 C -10 -150, 80 -140, 96 -84 C 150 -70, 160 10, 110 40 C 100 90, 20 100, -10 70 C -60 100, -120 70, -110 20 Z" fill="#F7A8B8" class="ink" stroke-width="5"/><path d="M-40 -100 C -20 -60, -50 -30, -20 0 M96 -84 C 60 -60, 80 -20, 40 0" fill="none" class="ink" stroke-width="4"/></g>` +
        txt(1440, 640, cold > 0.5 ? "« C’est froid ! »" : "« Ça brûle ! »", 60, {
          w: 700,
          fill: cold > 0.5 ? C.blue : "#C25E00",
          op: br,
        });
    // la menthe et son flocon
    if (m > 0)
      s +=
        `<g opacity="${f2(m)}" transform="translate(${f2(300 + 60 * m)} ${f2(330 + 8 * Math.sin(t * 3))}) rotate(-20)"><path d="M0 -90 Q80 -30 0 90 Q-80 -30 0 -90 Z" fill="#3DBE8B" class="ink" stroke-width="5"/><path d="M0 -80 V80 M0 -30 l30 -20 M0 10 l-30 -20 M0 40 l30 -20" fill="none" stroke="#2E9A6E" stroke-width="6" stroke-linecap="round"/></g>` +
        (cold > 0
          ? [0, 1]
              .map(
                (i) =>
                  `<g transform="translate(${[600, 480][i]} ${[340, 600][i]}) rotate(${f2(t * 30)}) scale(${f2(cold)})" stroke="${C.blue}" stroke-width="8" stroke-linecap="round"><path d="M-34 0 H34 M0 -34 V34 M-24 -24 L24 24 M24 -24 L-24 24"/></g>`,
              )
              .join("")
          : "");
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tC + 0.5);
  show("#s5-n2", tM + 0.9);
})();
