// ---------- Scène 2 : tout attire tout ; plus il y a de matière, plus ça attire ----------
(() => {
  const tA = cue("s2-2", "matière") - 0.5,
    tMore = cue("s2-2", "Plus") - 0.4,
    tBig = cue("s2-2", "gigantesque") - 0.8;
  const tB = cue("s2-3", "moi") - 0.7,
    tNum = cue("s2-4", "six") - 0.3,
    tWin = cue("s2-4", "gagne") - 0.6;
  const numEl = document.getElementById("s2-num");
  const N = ["6", "6 000", "6 000 milliards", "6 000 milliards de milliards"];
  // lignes d'attraction autour d'un objet : d'autant plus nombreuses et longues qu'il est massif
  const pull = (x, y, r, n, len, t, op) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU,
        ph = (t * 0.8 + i * 0.37) % 1,
        r1 = r + len - ph * len * 0.5,
        r2 = r1 - len * 0.4;
      s += arrowSVG(
        x + r1 * Math.cos(a),
        y + r1 * Math.sin(a),
        x + r2 * Math.cos(a),
        y + r2 * Math.sin(a),
        C.fire,
        8,
        op * Math.sin(ph * Math.PI),
      );
    }
    return s;
  };
  onDraw("s2", (t) => {
    let s = "";
    const a = lin(t, tA, tA + 0.4) * (1 - ramp(t, tB - 0.3, tB + 0.1)),
      b = ramp(t, tB, tB + 0.5);
    if (a > 0) {
      // trois objets de plus en plus massifs
      const m = lin(t, tMore, tMore + 0.4),
        big = lin(t, tBig, tBig + 0.5);
      let g =
        pull(380, 540, 40, 6, 60, t, 1) +
        ball(380, 540, 40, "#B9772E") +
        txt(380, 680, "un caillou", 36);
      if (m > 0)
        g += `<g opacity="${f2(m)}">${pull(840, 540, 96, 10, 100, t, 1)}${ball(840, 540, 96, "#9AA6B8")}${txt(840, 740, "un rocher", 36)}</g>`;
      if (big > 0)
        g += `<g opacity="${f2(big)}">${pull(1440, 540, 210, 16, 170, t, 1)}${earthSVG(1440, 540, 210)}${txt(1440, 880, "la Terre", 40)}</g>`;
      s += `<g opacity="${f2(a)}">${g}</g>`;
    }
    if (b > 0) {
      // Zoé et la Terre s'attirent avec la même force : c'est Zoé qui fait presque tout le chemin
      const go = ramp(t, tWin, tWin + 1.6),
        zx = lerp(420, 1010, go),
        ex = 1430 - 2 * go,
        ey = 640;
      let g = earthSVG(ex, ey, 230) + figSVG(zx, ey + 60, 1.1, C.blue);
      if (go < 0.9)
        g +=
          arrowSVG(zx + 60, ey - 40, zx + 250, ey - 40, C.fire, 14, 1 - go) +
          arrowSVG(ex - 250, ey + 40, ex - 440, ey + 40, C.fire, 14, 1 - go);
      s += `<g opacity="${f2(b)}">${g}</g>`;
    }
    $("#s2-draw").innerHTML = s;
    numEl.textContent = N[Math.min(N.length - 1, Math.floor(lin(t, tNum, tNum + 2.4) * N.length))];
  });
  show("#s2-n1", tMore + 0.4);
  tl.to("#s2-n1", { opacity: 0, duration: 0.25 }, tB - 0.3);
  show("#s2-n2", cue("s2-4", "trente") - 0.3);
  show("#s2-mass", tNum - 0.1);
  show("#s2-n3", tWin + 0.3);
})();
