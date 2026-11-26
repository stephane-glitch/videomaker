// ---------- Scène 0 : Internet n'est pas dans les nuages : ce sont surtout des câbles ----------
(() => {
  // l'icône du générique devient un globe en réseau pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<circle cx="75" cy="75" r="56" fill="#8FD3FF" class="ink" stroke-width="5"/><ellipse cx="75" cy="75" rx="24" ry="56" fill="none" class="ink" stroke-width="4"/><path d="M19 75 H131 M28 46 H122 M28 104 H122" class="ink" stroke-width="4"/>`;
  const tNu = cue("s0-1", "nuages") - 0.6,
    tPa = cue("s0-2", "Pas") - 0.1,
    tCa = cue("s0-2", "câbles") - 0.6,
    tTe = cue("s0-3", "téléphone") - 0.6,
    tBo = cue("s0-4", "box") - 0.5,
    tFi = cue("s0-4", "fils") - 0.6;
  onDraw("s0", (t) => {
    const ca = ramp(t, tCa, tCa + 0.5),
      te = ramp(t, tTe, tTe + 0.5);
    let s = "";
    if (ca < 1) {
      let g =
        daySkySVG(130, 190, 1660, 660, t, 20, "s0", 2) +
        `<g transform="translate(960 ${f2(500 + 12 * Math.sin(t * 1.5))})">${cloudSVG(-33, 88, 2.2)}${txt(0, 40, "Internet ?", 64, { w: 700, fill: C.blueD, op: ramp(t, tNu, tNu + 0.3) })}</g>`;
      const x = ramp(t, tPa, tPa + 0.2);
      if (x > 0)
        g += `<g transform="translate(960 520) scale(${f2(1.4 - 0.4 * x)})" opacity="${f2(x)}"><path d="M-190 -190 L190 190 M190 -190 L-190 190" stroke="#E0455E" stroke-width="36" stroke-linecap="round"/></g>`;
      s += `<g opacity="${f2(1 - ca)}">${g}</g>`;
    }
    if (ca > 0 && te < 1) {
      // des câbles partout, entre les villes
      let g = panelSVG();
      const N = [
          [330, 380],
          [640, 660],
          [900, 360],
          [1180, 620],
          [1500, 400],
          [1640, 700],
          [420, 720],
        ],
        E = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [1, 6],
          [0, 2],
          [3, 5],
        ];
      E.forEach(([a, b], i) => {
        const k = ramp(t, tCa + i * 0.12, tCa + 0.4 + i * 0.12),
          A = N[a],
          B = N[b];
        g += `<path d="M${A[0]} ${A[1]} L${f2(lerp(A[0], B[0], k))} ${f2(lerp(A[1], B[1], k))}" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>`;
        if (k >= 1) {
          const u = (t * 0.7 + rnd(i)) % 1;
          g += `<circle cx="${f2(lerp(A[0], B[0], u))}" cy="${f2(lerp(A[1], B[1], u))}" r="10" fill="${C.hot}"/>`;
        }
      });
      N.forEach(
        ([x, y]) =>
          (g += `<circle cx="${x}" cy="${y}" r="28" fill="${C.blueL}" class="ink" stroke-width="5"/>`),
      );
      s += `<g opacity="${f2(ca * (1 - te))}">${g}</g>`;
    }
    if (te > 0) {
      // le téléphone parle à la box par ondes ; après la box, tout passe par un fil
      const bo = ramp(t, tBo, tBo + 0.4),
        fi = ramp(t, tFi, tFi + 0.8);
      let g =
        panelSVG() +
        phoneSVG(480, 520 + 6 * Math.sin(t * 2), 1.5) +
        wavesSVG(600, 520, t, 1) +
        `<g opacity="${f2(0.35 + 0.65 * bo)}">${boxSVG(1060, 540, 1.6, t)}</g>` +
        txt(480, 770, "sans fil", 46, { w: 700, fill: C.blueD });
      if (fi > 0) {
        const P = [
          [1204, 540],
          [1400, 540],
          [1500, 640],
          [1784, 640],
        ];
        let d = "";
        for (let i = 0; i <= 30; i++) {
          const [x, y] = along(P, (i / 30) * fi);
          d += `${i ? "L" : "M"}${f2(x)} ${f2(y)}`;
        }
        const [dx, dy] = along(P, (t * 0.6) % 1);
        g +=
          `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>` +
          (fi >= 1 ? `<circle cx="${f2(dx)}" cy="${f2(dy)}" r="10" fill="${C.hot}"/>` : "") +
          txt(1500, 770, "un fil !", 46, { w: 700, fill: "#C25E00", op: fi });
      }
      s += `<g opacity="${f2(te)}">${g}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tPa + 0.3);
  pop("#s0-n2", tCa + 0.6);
})();
