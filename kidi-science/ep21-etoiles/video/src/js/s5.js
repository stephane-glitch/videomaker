// ---------- Scène 5 : trois mille étoiles à l'œil nu, plus de cent milliards dans la Voie lactée, et des milliards de galaxies ----------
(() => {
  const tTr = cue("s5-2", "trois") - 0.5,
    tGa = cue("s5-2", "galaxie") - 0.7,
    tCe = cue("s5-2", "cent") - 0.5,
    tMi = cue("s5-4", "milliards") - 0.4,
    tVe = cue("s5-5", "vertige") - 0.5;
  onDraw("s5", (t) => {
    const ga = ramp(t, tGa, tGa + 0.6),
      mi = ramp(t, tMi, tMi + 0.6);
    let s = nightSkySVG(130, 190, 1660, 660, t, 30);
    if (ga < 1) {
      let g = "";
      for (let i = 0; i < 60; i++)
        g += starSVG(
          190 + rnd(i) * 1540,
          240 + rnd(i + 70) * 560,
          4 + 4 * rnd(i + 5),
          "#FFF6B0",
          t,
          i,
        );
      const tr = ramp(t, tTr, tTr + 0.8);
      g +=
        tr > 0
          ? txt(
              960,
              560,
              `${Math.floor((3000 * tr) / 1000) || ""} ${String(Math.round(3000 * tr) % 1000).padStart(tr > 0.34 ? 3 : 1, "0")} étoiles`,
              100,
              { w: 700, fill: "#fff", op: tr },
            )
          : txt(960, 580, "?", 200, { w: 700, fill: C.hot });
      s += `<g opacity="${f2(1 - ga)}">${g}</g>`;
    }
    if (ga > 0 && mi < 1) {
      const ce = ramp(t, tCe, tCe + 0.4);
      s += `<g opacity="${f2(ga * (1 - mi))}"><g transform="translate(960 500) scale(${f2(0.7 + 0.3 * ga)}) rotate(-12)">${galaxySVG(0, 0, 420, t, 150)}</g>${ce > 0 ? `<g transform="translate(960 790) scale(${f2(0.8 + 0.2 * ce)})" opacity="${f2(ce)}">${txt(0, 0, "100 000 000 000 d’étoiles", 64, { w: 700, fill: "#FFF6B0" })}</g>` : ""}</g>`;
    }
    // d'autres galaxies, partout
    if (mi > 0) {
      let g = "";
      const z = 1 + 0.25 * ramp(t, tVe, tVe + 3);
      for (let i = 0; i < 14; i++) {
        const k = ramp(t, tMi + i * 0.07, tMi + 0.3 + i * 0.07);
        if (k > 0)
          g += `<g opacity="${f2(k)}" transform="translate(${f2(960 + (rnd(i + 30) - 0.5) * 1400 * z)} ${f2(520 + (rnd(i + 60) - 0.5) * 520 * z)}) rotate(${f2(rnd(i) * 180)})">${galaxySVG(0, 0, 50 + 60 * rnd(i + 2), t + i, 22)}</g>`;
      }
      s += `<clipPath id="s5-c"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s5-c)" opacity="${f2(mi)}">${g}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tGa + 0.6);
  show("#s5-n2", tMi + 0.5);
})();
