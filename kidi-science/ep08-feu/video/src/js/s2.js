// ---------- Scène 2 : dans la bougie, la cire fond, grimpe, devient un gaz ; la preuve par la fumée ----------
(() => {
  const tM = cue("s2-2", "fondre") - 0.4,
    tUp = cue("s2-2", "grimpe") - 0.4,
    tGz = cue("s2-2", "gaz") - 0.5,
    tBr = cue("s2-2", "brûle") - 0.3;
  const tBl = cue("s2-4", "souffle") + 0.3,
    tMa = cue("s2-4", "allumette") - 0.8,
    tJ = cue("s2-5", "sauté") - 0.7;
  const X = 700,
    TOP = 470;
  onDraw("s2", (t) => {
    const off = ramp(t, tBl, tBl + 0.3),
      on2 = ramp(t, tJ + 0.45, tJ + 0.7),
      k = 1 - off + on2;
    let s = `<path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
    // la bougie en coupe
    s += `<rect x="${X - 150}" y="${TOP}" width="300" height="380" rx="20" fill="#FBF1D8" class="ink" stroke-width="5"/>`;
    const melt = ramp(t, tM, tM + 0.8);
    s += `<path d="M${X - 130} ${TOP + 4} Q${X} ${TOP + 30 + 26 * melt} ${X + 130} ${TOP + 4} Z" fill="${mixHex("#FBF1D8", "#FFE9A8", melt)}" class="ink" stroke-width="4"/>`;
    s += `<path d="M${X} ${TOP + 150} V${TOP - 60}" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/>`;
    // les ondes de chaleur qui descendent vers la cire
    if (t > tM && k > 0.5)
      for (let i = 0; i < 3; i++) {
        const u = (t * 0.9 + i / 3) % 1;
        s += `<path d="M${X - 90 + i * 90} ${f2(TOP - 90 + u * 80)} q16 14 0 28 q-16 14 0 28" fill="none" stroke="${C.fire}" stroke-width="7" stroke-linecap="round" opacity="${f2((1 - u) * melt)}"/>`;
      }
    // les gouttes de cire qui grimpent dans la mèche
    if (t > tUp)
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.7 + i / 5) % 1;
        s += `<circle cx="${f2(X + 5 * Math.sin(u * 20))}" cy="${f2(TOP + 40 - u * 96)}" r="9" fill="#FFD23F" stroke="${C.ink}" stroke-width="3" opacity="${f2(k > 0.5 || off > 0 ? 1 : 0)}"/>`;
      }
    // le gaz de cire autour du haut de la mèche
    if (t > tGz)
      for (let i = 0; i < 10; i++) {
        const u = (t * 0.8 + rnd(i)) % 1,
          a = rnd(i + 9) * TAU;
        s += `<circle cx="${f2(X + (14 + u * 54) * Math.cos(a))}" cy="${f2(TOP - 74 - u * 60 + 20 * Math.sin(a))}" r="${f2(6 + u * 5)}" fill="#fff" stroke="${C.smoke}" stroke-width="2.5" opacity="${f2(1 - u)}"/>`;
      }
    s += flameSVG(
      X,
      TOP - 56,
      230 * (1 + 0.12 * ramp(t, tBr, tBr + 0.3) * (1 - ramp(t, tBr + 0.3, tBr + 0.9))),
      t,
      { k, lean: -80 * off * (1 - on2) },
    );
    // on souffle : la fumée blanche monte ; l'allumette s'approche, la flamme redescend le long de la fumée
    if (off > 0 && on2 < 1) {
      const b = (t - tBl + 0.3) / 0.7;
      if (b > 0 && b < 1)
        for (let i = 0; i < 4; i++)
          s += `<path d="M${f2(180 + b * 260)} ${f2(330 + i * 28)} h110" stroke="${C.air}" stroke-width="12" stroke-linecap="round" opacity="${f2(1 - b)}"/>`;
      s += smokeSVG(X, TOP - 64, t, Math.min(1, (t - tBl) * 0.7) * (1 - on2), "#fff", 16, 300);
      const m = ramp(t, tMa, tMa + 1.0),
        mx = lerp(1300, X + 70, m),
        my = lerp(120, TOP - 320, m);
      if (m > 0)
        s += `<g opacity="${f2(1 - on2)}"><path d="M${f2(mx)} ${f2(my)} l150 -70" stroke="#EBC07E" stroke-width="16" stroke-linecap="round"/><circle cx="${f2(mx)}" cy="${f2(my)}" r="13" fill="#E0455E" class="ink" stroke-width="3"/>${flameSVG(mx, my - 6, 70, t + 2)}</g>`;
      const j = ramp(t, tJ, tJ + 0.5);
      if (j > 0 && j < 1) s += flameSVG(X + 30 * (1 - j), lerp(TOP - 300, TOP - 60, j), 90, t * 2);
    }
    $("#s2-draw").innerHTML = s;
  });
  const l1 = label(
    "s2",
    "s2-l1",
    [X + 60, TOP + 18],
    [1080, 560],
    "1. La cire fond",
    "la chaleur de la flamme la rend liquide",
  );
  const l2 = label(
    "s2",
    "s2-l2",
    [X + 8, TOP - 20],
    [1080, 430],
    "2. Elle grimpe dans la mèche",
    "comme l’eau dans une éponge",
  );
  const l3 = label(
    "s2",
    "s2-l3",
    [X + 50, TOP - 110],
    [1080, 300],
    "3. Elle devient un gaz",
    "et c’est ce gaz qui brûle",
  );
  showLabel(l1, tM + 0.2);
  showLabel(l2, tUp + 0.2);
  showLabel(l3, tGz + 0.3);
  [l1, l2, l3].forEach((l) => hideLabel(l, tBl - 0.4));
  const l4 = label(
    "s2",
    "s2-l4",
    [X - 30, TOP - 240],
    [240, 240],
    "La fumée blanche",
    "de la cire en gaz",
  );
  showLabel(l4, cue("s2-4", "fumée") - 0.2);
  hideLabel(l4, tJ + 0.5);
  pop("#s2-n1", cue("s2-6", "chimie") - 0.3);
})();
