// ---------- Scène 1 : les électrons dans le fil, puis le tuyau plein de billes ----------
(() => {
  const tEl = cue("s1-1", "électrons") - 0.4,
    tFlow = cue("s1-3", "sens") - 0.6,
    tSnail = cue("s1-5", "escargot") - 0.8;
  const tTube = cue("s1-6", "tuyau") - 0.7,
    pushes = [cue("s1-6", "pousse") - 0.1, cue("s1-6", "sort") - 0.4, lineEnd("s1-6") + 0.5];
  // dérive des électrons : vitesse en pixels par seconde (lente : « plus lentement qu'un escargot »)
  const V = [
    [tFlow, 0],
    [tFlow + 1.2, 46],
  ];
  onDraw("s1", (t) => {
    const up = ramp(t, tTube, tTube + 0.6),
      wy = lerp(540, 380, up),
      k = lerp(1, 0.72, up);
    let s = `<g transform="translate(960 ${f2(wy)}) scale(${f2(k)}) translate(-960 -540)">`;
    s += `<rect x="120" y="400" width="1680" height="280" rx="60" fill="#F2C9A0" class="ink" stroke-width="6"/>`;
    for (let j = 0; j < 2; j++)
      for (let i = 0; i < 9; i++) s += ball(220 + i * 185 + j * 92, 470 + j * 140, 50, "#D98B4A");
    const el = lin(t, tEl, tEl + 0.5),
      drift = integ(V, t),
      calm = ramp(t, tFlow, tFlow + 1.2);
    if (el > 0)
      for (let i = 0; i < 16; i++) {
        const bx = 160 + rnd(i) * 1600,
          by = 440 + rnd(i + 40) * 200;
        // agitation désordonnée, qui se calme quand tout le monde part dans le même sens
        const jx =
          (1 - calm * 0.75) *
          (70 * Math.sin(t * (1.1 + rnd(i + 3)) + i) + 40 * Math.sin(t * 2.3 + i * 2));
        const jy = (1 - calm * 0.6) * (40 * Math.cos(t * (1.3 + rnd(i + 5)) + i * 1.7));
        const x = 140 + ((((bx + jx + drift - 140) % 1640) + 1640) % 1640);
        s += ball(x, clamp(by + jy, 430, 650), 17, C.spark, { op: el, w: 3 });
      }
    // l'escargot double les électrons
    const sn = lin(t, tSnail, tSnail + 0.5) * (1 - up);
    if (sn > 0) {
      const sx = 420 + (t - tSnail) * 80;
      s += `<g opacity="${f2(sn)}"><path d="M${f2(sx - 90)} 330 H${f2(sx + 70)} Q${f2(sx + 110)} 330 ${f2(sx + 110)} 290 V270" fill="none" stroke="#C9A36A" stroke-width="34" stroke-linecap="round"/><circle cx="${f2(sx)}" cy="290" r="62" fill="#E0455E" class="ink" stroke-width="5"/><path d="M${f2(sx)} 290 m-30 0 a30 30 0 1 1 30 30 a16 16 0 1 1 -14 -22" fill="none" class="ink"/><path d="M${f2(sx + 104)} 262 l-10 -40 M${f2(sx + 118)} 262 l10 -40" class="ink"/></g>`;
    }
    s += `</g>`;
    // le tuyau plein de billes : on en pousse une, une autre sort tout de suite à l'autre bout
    if (up > 0) {
      const y = 740,
        r = 44,
        n = 14,
        x0 = 330;
      let shift = 0;
      for (const p of pushes) shift += ramp(t, p, p + 0.45);
      let tube = `<rect x="${x0 - r - 8}" y="${y - r - 14}" width="${n * 2 * r + 16}" height="${2 * r + 28}" rx="30" fill="#EAF6FF" class="ink" stroke-width="5"/>`;
      for (let i = -3; i < n + 3; i++) {
        const x = x0 + (i + shift) * 2 * r;
        const out = x > x0 + n * 2 * r - r,
          fall = out ? Math.pow((x - (x0 + n * 2 * r - r)) / (2 * r), 2) * 70 : 0;
        if (x > x0 - 2 * r * 3.2) tube += ball(x, y + fall, r - 3, i < 0 ? C.spark : C.blueL);
      }
      s += `<g opacity="${f2(up)}">${tube}<path d="M150 ${y} H240 M214 ${y - 22} L242 ${y} L214 ${y + 22}" fill="none" stroke="${C.fire}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  const lab = {
    at: label(
      "s1",
      "s1-l-at",
      [405, 470],
      [180, 250],
      "Les atomes du métal",
      "ils ne bougent pas",
      { color: "#B5642A" },
    ),
    el: label("s1", "s1-l-el", [1420, 600], [1300, 790], "Les électrons", "des grains minuscules", {
      color: "#9A7400",
    }),
  };
  showLabel(lab.at, cue("s1-1", "métal") - 0.2);
  showLabel(lab.el, tEl + 0.2);
  show("#s1-n1", cue("s1-1", "sens") - 0.6, { y: -20 });
  tl.to("#s1-n1", { opacity: 0, duration: 0.25 }, tFlow);
  show("#s1-n2", tFlow + 0.5, { y: -20 });
  hideLabel(lab.at, tSnail - 0.3);
  hideLabel(lab.el.concat(["#s1-n2"]), tTube - 0.2);
  show("#s1-n3", cue("s1-6", "sort") - 0.2);
})();
