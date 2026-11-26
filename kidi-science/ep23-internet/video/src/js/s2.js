// ---------- Scène 2 : le voyage : ondes jusqu'à la box, câbles sous les rues puis sous les océans ; dans le câble, de la lumière ----------
(() => {
  const tOn = cue("s2-2", "ondes") - 0.6,
    tBo = cue("s2-2", "box") - 0.4,
    tRu = cue("s2-2", "rues") - 0.6,
    tOc = cue("s2-2", "océans") - 0.6,
    tTu = cue("s2-4", "tuyau") - 1.2,
    tVe = cue("s2-4", "verre") - 0.6,
    tLu = cue("s2-4", "lumière") - 0.6;
  const P = [
    [620, 560],
    [760, 560],
    [760, 760],
    [1080, 760],
    [1180, 800],
    [1420, 800],
    [1520, 760],
    [1560, 560],
    [1640, 560],
  ];
  onDraw("s2", (t) => {
    const tu = ramp(t, tTu, tTu + 0.5);
    let g = panelSVG(130, 190, 1660, 660, "#BFE6FF");
    // le sol, la mer, et le câble dessous
    g += `<clipPath id="s2-c"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s2-c)"><path d="M130 640 H1090 Q1120 640 1130 700 Q1300 860 1470 700 Q1480 640 1510 640 H1790 V860 H130 Z" fill="#C9A66B"/><path d="M1094 660 Q1300 ${f2(650 + 6 * Math.sin(t * 2))} 1506 660 L1470 700 Q1300 860 1130 700 Z" fill="#2F7FC4"/><path d="M130 640 H1090 M1510 640 H1790" class="ink" stroke-width="5"/>`;
    for (let i = 0; i < 3; i++)
      g += `<rect x="${820 + i * 80}" y="${560 - i * 20}" width="60" height="${80 + i * 20}" fill="#fff" class="ink" stroke-width="4"/>`;
    const ru = ramp(t, tRu - 0.6, tOc + 0.8);
    if (ru > 0) {
      let d = "";
      for (let i = 0; i <= 50; i++) {
        const [x, y] = along(P, (i / 50) * ru);
        d += `${i ? "L" : "M"}${f2(x)} ${f2(y)}`;
      }
      g += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (ru >= 1)
        for (let i = 0; i < 3; i++) {
          const [x, y] = along(P, (t * 0.3 + i / 3) % 1);
          g += `<circle cx="${f2(x)}" cy="${f2(y)}" r="10" fill="${C.hot}"/>`;
        }
    }
    g +=
      `</g>` +
      phoneSVG(300, 500 + 5 * Math.sin(t * 2), 0.9) +
      (t > tOn ? wavesSVG(370, 500, t, 1) : "") +
      `<g opacity="${f2(0.4 + 0.6 * ramp(t, tBo, tBo + 0.3))}">${boxSVG(600, 600, 0.8, t)}</g>` +
      serverSVG(1690, 540, 0.7, t);
    if (t > tRu && t < tTu)
      g +=
        txt(920, 712, "sous les rues", 40, { w: 700, fill: C.ink, op: ramp(t, tRu, tRu + 0.3) }) +
        txt(1300, 620, "sous les océans", 40, {
          w: 700,
          fill: C.blueD,
          op: ramp(t, tOc, tOc + 0.3),
        });
    let s = `<g opacity="${f2(1 - tu)}">${g}</g>`;
    if (tu > 0) {
      // le câble vu en coupe : au cœur, des fils de verre où court la lumière
      const ve = ramp(t, tVe, tVe + 0.4),
        lu = ramp(t, tLu, tLu + 0.4);
      let h =
        panelSVG(130, 190, 1660, 660, "#1F4E86") +
        `<g transform="translate(560 520)"><circle r="230" fill="${C.ink}"/><circle r="190" fill="#8E96A3"/><circle r="150" fill="#C98B4B"/><circle r="110" fill="#fff" class="ink" stroke-width="4"/>`;
      for (let i = 0; i < 7; i++) {
        const a = (i / 6) * TAU,
          d = i === 6 ? 0 : 62;
        h += `<circle cx="${f2(d * Math.cos(a))}" cy="${f2(d * Math.sin(a))}" r="20" fill="${lu > 0 && Math.sin(t * 9 + i * 2) > 0 ? C.hot : "#BFE6FF"}" class="ink" stroke-width="3" opacity="${f2(0.3 + 0.7 * ve)}"/>`;
      }
      h += `</g>` + txt(560, 810, "gros comme un tuyau d’arrosage", 40, { w: 700, fill: "#fff" });
      // un fil de verre, vu de côté, avec les éclairs de lumière
      if (ve > 0) {
        h += `<g opacity="${f2(ve)}"><rect x="960" y="480" width="760" height="80" rx="40" fill="#BFE6FF" class="ink" stroke-width="5"/>${txt(1340, 430, "un fil de verre", 46, { w: 700, fill: "#fff" })}`;
        if (lu > 0) {
          for (let i = 0; i < 6; i++) {
            const u = (t * 1.1 + i / 6) % 1;
            h += `<rect x="${f2(980 + u * 680)}" y="498" width="${i % 2 ? 26 : 50}" height="44" rx="12" fill="${C.hot}" opacity="${f2(lu * Math.sin(u * Math.PI))}"/>`;
          }
          h += txt(1340, 640, "des éclairs de lumière", 46, { w: 700, fill: C.hot, op: lu });
        }
        h += `</g>`;
      }
      s += `<g opacity="${f2(tu)}">${h}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tBo + 0.4);
  show("#s2-n2", tVe + 0.5);
})();
