// ---------- Scène 2 : à la ruche, le nectar passe de bouche en bouche et se transforme ; il est déposé dans une alvéole ----------
(() => {
  const tRu = cue("s2-1", "ruche") - 0.6,
    tBo = cue("s2-1", "bouche") - 0.8,
    tTr = cue("s2-3", "transforme") - 0.8,
    tAl = cue("s2-3", "alvéole") - 2.2;
  onDraw("s2", (t) => {
    const bo = ramp(t, tBo, tBo + 0.5),
      al = ramp(t, tAl, tAl + 0.5);
    let s = "";
    if (bo < 1) {
      let g =
        daySkySVG(130, 190, 1660, 660, t, 12, "s2", 2) +
        `<clipPath id="s2-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s2-k)"><rect x="130" y="760" width="1660" height="100" fill="#7CC47A"/></g>` +
        hiveSVG(1100, 760, 1.5);
      for (let i = 0; i < 4; i++) {
        const u = ((t - tRu) * 0.25 + i / 4) % 1;
        g += beeSVG(
          lerp(260, 1090, u),
          lerp(360 + i * 60, 700, u) + 14 * Math.sin(t * 6 + i),
          0.7 * (1 - 0.5 * ramp(u, 0.85, 1)),
          t + i,
        );
      }
      s += `<g opacity="${f2(1 - bo)}">${g}</g>`;
    }
    if (bo > 0 && al < 1) {
      // trois abeilles se passent la goutte ; elle fonce à chaque passage
      let g = panelSVG(130, 190, 1660, 660, "#FFE9B0");
      const X = [460, 960, 1460],
        tr = ramp(t, tTr, tTr + 0.3),
        u = ((t - tBo) * 0.35) % 1,
        seg = u < 0.5 ? 0 : 1,
        v = (u < 0.5 ? u : u - 0.5) * 2,
        dx = lerp(X[seg] + 130, X[seg + 1] - 130, v),
        shade = mixHex("#FFF6C8", "#E9A21A", (seg + v) / 2);
      X.forEach(
        (x, i) => (g += beeSVG(x, 520 + 6 * Math.sin(t * 3 + i), 1.9, t + i, i === 2 ? -1 : 1)),
      );
      g += `<circle cx="${f2(dx)}" cy="${f2(520 - 40 * Math.sin(v * Math.PI))}" r="26" fill="${shade}" class="ink" stroke-width="4"/>`;
      if (tr > 0)
        g += `<g opacity="${f2(tr)}"><rect x="560" y="700" width="800" height="50" rx="25" fill="url(#s2-g)" class="ink" stroke-width="4"/><defs><linearGradient id="s2-g"><stop offset="0" stop-color="#FFF6C8"/><stop offset="1" stop-color="#E9A21A"/></linearGradient></defs>${txt(520, 736, "nectar", 40, { w: 700, fill: C.ink, anchor: "end" })}${txt(1400, 736, "miel", 40, { w: 700, fill: C.ink, anchor: "start" })}</g>`;
      g += txt(960, 310, "de bouche en bouche", 54, { w: 700, fill: "#C25E00" });
      s += `<g opacity="${f2(bo * (1 - al))}">${g}</g>`;
    }
    if (al > 0) {
      // les alvéoles : une goutte est déposée dans la case du milieu
      let g = panelSVG(130, 190, 1660, 660, "#F3D58A");
      const R = 80,
        dep = ramp(t, tAl + 1.4, tAl + 2.0);
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 10; c++) {
          const x = 300 + c * R * 1.74 + (r % 2 ? R * 0.87 : 0),
            y = 330 + r * R * 1.5;
          if (x > 1700) continue;
          const mid = r === 1 && c === 4;
          g += cellSVG(
            x,
            y,
            R,
            mid
              ? mixHex("#FFF3C4", "#F2B33D", dep)
              : (r * 10 + c) % 3 === 0
                ? "#F2B33D"
                : "#FFF3C4",
          );
        }
      const cx = 300 + 4 * R * 1.74 + R * 0.87,
        cy = 330 + R * 1.5,
        k = ramp(t, tAl + 0.5, tAl + 1.4);
      g +=
        beeSVG(
          lerp(cx + 400, cx + 40, k),
          lerp(240, cy - 110, k) + 5 * Math.sin(t * 8),
          1.2,
          t,
          -1,
        ) +
        (k >= 1 && dep < 1
          ? `<circle cx="${f2(cx)}" cy="${f2(lerp(cy - 80, cy, dep))}" r="18" fill="#F2B33D" class="ink" stroke-width="3"/>`
          : "") +
        txt(960, 770, "une alvéole de cire", 54, { w: 700, fill: C.ink });
      s += `<g opacity="${f2(al)}">${g}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tTr + 0.5);
  show("#s2-n2", tAl + 2.0);
})();
