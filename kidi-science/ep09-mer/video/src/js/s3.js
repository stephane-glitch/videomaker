// ---------- Scène 3 : la mer est un cul-de-sac ; l'eau s'évapore et repart, le sel reste et s'accumule ----------
(() => {
  const S = scn("s3");
  const tSun = cue("s3-2", "soleil") - 0.4,
    tEv = cue("s3-2", "évapore") - 0.4,
    tCl = cue("s3-2", "nuages") - 0.5,
    tSt = cue("s3-2", "reste") - 0.8,
    tLoop = cue("s3-3", "pluie") - 0.6,
    tY = cue("s3-4", "milliards") - 0.5;
  onDraw("s3", (t) => {
    let s =
      mountSVG(1520, 300, 480, 760) +
      `<path d="M1040 850 Q1300 700 1790 760 V900 H1040 Z" fill="#CFE8B8" class="ink" stroke-width="5"/>`;
    // le fleuve qui apporte un peu de sel
    s += `<path d="M1500 560 Q1380 700 1080 780" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M1500 560 Q1380 700 1080 780" fill="none" stroke="#5FB4F0" stroke-width="22" stroke-linecap="round"/>`;
    for (let i = 0; i < 4; i++) {
      const u = (t * 0.2 + i / 4) % 1,
        m = 1 - u;
      s += saltSVG(
        m * m * 1500 + 2 * m * u * 1380 + u * u * 1080,
        m * m * 560 + 2 * m * u * 700 + u * u * 780,
        6,
        u * 300,
      );
    }
    s += seaSVG(130, 1090, 620, 850, t);
    // le sel s'accumule dans la mer
    const fill = 0.12 + 0.25 * ramp(t, tSt, tLoop) + 0.63 * ramp(t, tLoop, S.end - 1),
      n = Math.round(70 * fill);
    for (let i = 0; i < n; i++)
      s += saltSVG(
        160 + rnd(i) * 900,
        690 + rnd(i + 100) * 140 + 6 * Math.sin(t * 2 + i),
        7,
        rnd(i + 7) * 90 + t * 12,
      );
    s += sunSVG(300, 280, 80 + 10 * ramp(t, tSun, tSun + 0.4), t);
    // l'évaporation : l'eau monte, sans le sel
    const ev = ramp(t, tEv, tEv + 0.5);
    if (ev > 0)
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.35 + i / 6) % 1,
          x = 420 + i * 100;
        s += `<path d="M${x} ${f2(610 - u * 240)} q14 -16 0 -32 q-14 -16 0 -32" fill="none" stroke="#5FB4F0" stroke-width="8" stroke-linecap="round" opacity="${f2(ev * Math.sin(u * Math.PI))}"/>`;
      }
    // le nuage se forme, part vers la montagne, et il pleut
    const cl = ramp(t, tCl, tCl + 0.6),
      go = t > tLoop ? ((t - tLoop) * 0.14) % 1 : 0;
    if (cl > 0) {
      const cx = lerp(720, 1500, t > tLoop ? Math.min(1, go * 1.6) : 0),
        g = t > tLoop && go > 0.5 ? 0.5 : 0;
      s += `<g opacity="${f2(cl)}">${cloudSVG(cx, 260, 1.2, g)}</g>`;
      if (g > 0) s += rainSVG(cx - 130, cx + 130, 300, 470, t, 10);
    }
    // les compteurs
    const yr = ramp(t, tY, S.end - 0.8);
    if (t > tSt) s += txt(610, 580, "Le sel reste", 44, { w: 700, op: ramp(t, tSt, tSt + 0.4) });
    if (yr > 0.01)
      s += txt(
        1440,
        850,
        `${f2(yr * 4)
          .toFixed(1)
          .replace(".", ",")} milliards d’années`,
        46,
        { w: 700 },
      );
    $("#s3-draw").innerHTML = s;
  });
  const l = label(
    "s3",
    "s3-l",
    [560, 480],
    [760, 420],
    "L’eau s’évapore",
    "le sel, lui, ne s’envole pas",
  );
  showLabel(l, tEv + 0.3);
  hideLabel(l, tLoop - 0.2);
  show("#s3-n1", cue("s3-5", "retours") - 0.6);
  pop("#s3-n2", cue("s3-5", "simple") - 0.4);
})();
