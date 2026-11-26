// ---------- Scène 3 : le plat brûlant ; le message fait demi-tour dans la moelle épinière : le réflexe ----------
(() => {
  const tH = cue("s3-2", "brûlant") - 0.5,
    tR = cue("s3-2", "retire") - 0.3,
    tD = cue("s3-2", "demi") - 0.5,
    tA = cue("s3-4", "aïe") - 0.3;
  const UP = [
      [620, 560],
      [1000, 600],
      [1380, 640],
    ],
    DOWN = [
      [1380, 640],
      [1000, 660],
      [700, 640],
    ],
    TOBRAIN = [
      [1380, 640],
      [1380, 430],
      [1380, 330],
    ];
  onDraw("s3", (t) => {
    const back = ramp(t, tR, tR + 0.25),
      touch = ramp(t, tH, tH + 0.4) * (1 - back);
    // le plat brûlant
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/><rect x="230" y="700" width="330" height="60" rx="20" fill="#E0455E" class="ink" stroke-width="5"/><path d="M200 700 H590" class="ink" stroke-width="14" stroke-linecap="round"/>` +
      [0, 1, 2]
        .map(
          (i) =>
            `<path d="M${290 + i * 100} ${f2(670 - ((t * 50 + i * 26) % 80))} q16 -16 0 -32 q-16 -16 0 -32" fill="none" stroke="${C.fire}" stroke-width="9" stroke-linecap="round"/>`,
        )
        .join("");
    // le bras et la main
    const hx = lerp(lerp(700, 470, touch), 780, back),
      hy = lerp(lerp(520, 640, touch), 430, back);
    s +=
      `<path d="M1100 560 Q900 520 ${f2(hx + 60)} ${f2(hy)}" fill="none" stroke="${C.ink}" stroke-width="80" stroke-linecap="round"/><path d="M1100 560 Q900 520 ${f2(hx + 60)} ${f2(hy)}" fill="none" stroke="#FFD9B8" stroke-width="68" stroke-linecap="round"/>` +
      handSVG(hx + 30, hy + 10, 0.42, -100);
    // la moelle épinière et le cerveau
    s +=
      `<rect x="1350" y="330" width="60" height="460" rx="30" fill="#F4F1C9" class="ink" stroke-width="5"/>` +
      [0, 1, 2, 3, 4, 5]
        .map((i) => `<path d="M1350 ${390 + i * 66} H1410" class="ink" stroke-width="3"/>`)
        .join("") +
      brainSVG(1380, 250, 1.1);
    s += `<path d="${pathD(UP)}" fill="none" stroke="${C.hot}" stroke-width="9" stroke-dasharray="4 16" stroke-linecap="round"/><path d="${pathD(DOWN)}" fill="none" stroke="${C.fire}" stroke-width="9" stroke-dasharray="4 16" stroke-linecap="round"/>`;
    // le message : il monte, fait demi-tour vers le muscle… et, plus lentement, continue vers le cerveau
    const t0 = tH + 0.3;
    s +=
      sparkSVG(UP, (t - t0) / 0.25, C.spark) +
      sparkSVG(DOWN, (t - t0 - 0.25) / 0.25, C.fire) +
      sparkSVG(TOBRAIN, (t - t0 - 0.25) / 1.1, C.spark);
    // en rappel, pendant l'explication : le trajet rejoué en boucle
    if (t > tD) {
      const u = ((t - tD) * 0.7) % 1.6;
      s +=
        sparkSVG(UP, u / 0.5, C.spark) +
        sparkSVG(DOWN, (u - 0.5) / 0.5, C.fire) +
        sparkSVG(TOBRAIN, (u - 0.5) / 1.1, C.spark, 12);
    }
    const a = ramp(t, tA, tA + 0.25);
    if (a > 0)
      s += `<g transform="translate(1640 330) rotate(8) scale(${f2(a * (1 + 0.06 * Math.sin(t * 9)))})">${txt(0, 0, "Aïe !", 110, { w: 700, fill: "#E0455E" })}</g>`;
    $("#s3-draw").innerHTML = s;
  });
  const l = label(
    "s3",
    "s3-l",
    [1410, 700],
    [1450, 770],
    "La moelle épinière",
    "le message y fait demi-tour",
  );
  showLabel(l, tD + 0.2);
  pop("#s3-n1", cue("s3-2", "réflexe") - 0.4);
})();
