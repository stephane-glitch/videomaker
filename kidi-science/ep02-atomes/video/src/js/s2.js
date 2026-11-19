// ---------- Scène 2 : l'intérieur de l'atome (noyau, électrons, le vide, la chaise) ----------
(() => {
  const tNuc = cue("s2-1", "noyau") - 0.3,
    tEl = cue("s2-1", "électrons") - 0.3;
  const tCloud = cue("s2-3", "nuage") - 0.4;
  const tStad = cue("s2-5", "bille") - 0.8,
    tChair = cue("s2-8", "chaise") - 0.6,
    tPush = cue("s2-9", "repoussent") - 0.5;
  const CX = 960,
    CY = 550;
  const nucleus = (x, y, k) => {
    const P = [
      [0, 0],
      [26, -14],
      [-24, -18],
      [-6, 26],
      [24, 22],
      [-30, 12],
      [4, -32],
    ];
    return P.map(([a, b], i) =>
      ball(x + a * k, y + b * k, 22 * k, i % 2 ? "#C9D1DE" : "#E0455E", { w: 3 }),
    ).join("");
  };
  const atomView = (t) => {
    let s = "";
    const cl = ramp(t, tCloud, tCloud + 0.9),
      el = lin(t, tEl, tEl + 0.4);
    // le nuage : une brume bleue et des points qui scintillent
    if (cl > 0) {
      s += `<circle cx="${CX}" cy="${CY}" r="390" fill="url(#s2-cloud)" opacity="${f2(cl)}"/>`;
      for (let i = 0; i < 170; i++) {
        const a = rnd(i) * TAU,
          r = 70 + Math.pow(rnd(i + 300), 0.7) * 300;
        const op = cl * (0.25 + 0.75 * Math.max(0, Math.sin(t * (2 + rnd(i + 50) * 5) + i)));
        s += `<circle cx="${f2(CX + r * Math.cos(a))}" cy="${f2(CY + r * Math.sin(a) * 0.86)}" r="5" fill="${C.blue}" opacity="${f2(op)}"/>`;
      }
    }
    // les orbites dessinées « comme des planètes »
    if (el > 0 && cl < 1)
      for (let i = 0; i < 3; i++) {
        s += `<ellipse cx="${CX}" cy="${CY}" rx="350" ry="125" transform="rotate(${i * 60} ${CX} ${CY})" fill="none" stroke="${C.ink}" stroke-width="3" stroke-dasharray="4 12" opacity="${f2(el * (1 - cl) * 0.7)}"/>`;
        const a = t * (1.6 + i * 0.35) + i * 2.1,
          c = Math.cos(rad(i * 60)),
          sn = Math.sin(rad(i * 60));
        const ex = 350 * Math.cos(a),
          ey = 125 * Math.sin(a);
        s += ball(CX + ex * c - ey * sn, CY + ex * sn + ey * c, 20, C.blueL, { op: el * (1 - cl) });
      }
    // dans le nuage, les électrons « sautent » : on ne sait jamais où ils sont
    if (cl > 0.3)
      for (let i = 0; i < 3; i++) {
        const k = Math.floor(t * 7) * 3 + i,
          a = rnd(k + 7) * TAU,
          r = 110 + rnd(k + 91) * 250;
        s += ball(CX + r * Math.cos(a), CY + r * Math.sin(a) * 0.86, 20, C.blueL, { op: cl });
      }
    if (t >= tNuc) s += `<g opacity="${f2(lin(t, tNuc, tNuc + 0.3))}">${nucleus(CX, CY, 1)}</g>`;
    return s;
  };
  // le stade : le noyau est une bille au centre, les électrons sont dans les gradins
  const stadView = (t) => {
    let s = `<ellipse cx="${CX}" cy="${CY}" rx="700" ry="350" fill="${C.side}" class="ink" stroke-width="5"/>`;
    for (const k of [0.9, 0.8, 0.7])
      s += `<ellipse cx="${CX}" cy="${CY}" rx="${700 * k}" ry="${350 * k}" fill="none" stroke="${C.ink}" stroke-width="2" opacity="0.3"/>`;
    s += `<rect x="${CX - 400}" y="${CY - 190}" width="800" height="380" rx="40" fill="#8FD9A8" class="ink"/><path d="M${CX} ${CY - 190} V${CY + 190}" stroke="#fff" stroke-width="5"/><circle cx="${CX}" cy="${CY}" r="74" fill="none" stroke="#fff" stroke-width="5"/>`;
    s += `<circle cx="${CX}" cy="${CY}" r="9" fill="#E0455E" stroke="${C.ink}" stroke-width="3"/>`;
    for (let i = 0; i < 3; i++) {
      const a = t * (0.7 + i * 0.2) + i * 2.1;
      s += ball(CX + 590 * Math.cos(a), CY + 286 * Math.sin(a), 15, C.blueL, { w: 3 });
    }
    return s;
  };
  // la chaise et le pantalon : deux rangées d'atomes dont les nuages d'électrons se repoussent
  const chairView = (t) => {
    const near = ramp(t, tPush - 0.8, tPush + 0.1),
      bob = t > tPush + 0.1 ? 7 * Math.sin((t - tPush) * 3) : 0;
    const gap = lerp(260, 54, near) + bob,
      yS = 700,
      yP = yS - 150 - gap;
    let s = "";
    const row = (y, col, flip, name) => {
      let r = `<rect x="330" y="${f2(flip ? y - 150 : y)}" width="1260" height="150" rx="30" fill="${col}" class="ink" stroke-width="5"/>`;
      for (let i = 0; i < 8; i++) {
        const x = 420 + i * 154,
          yy = flip ? y - 62 : y + 62;
        r +=
          `<ellipse cx="${x}" cy="${f2(flip ? y + 6 : y - 6)}" rx="74" ry="46" fill="url(#s2-cloud)"/>` +
          ball(x, yy, 44, "#fff", { op: 0.9 }) +
          txt(x, (flip ? y + 6 : y - 6) + 12, "−", 44, { fill: C.blueD, w: 700 });
      }
      return r + txt(960, flip ? y - 170 : y + 205, name, 40);
    };
    s += row(yS, "#D9A66B", false, "La chaise") + row(yP + 150, "#7C97E8", true, "Ton pantalon");
    if (near > 0.9)
      for (const x of [574, 960, 1346]) {
        const m = (yP + 150 + yS) / 2;
        s += `<path d="M${x} ${f2(m - 6)} V${f2(m - 40)} M${x - 14} ${f2(m - 26)} L${x} ${f2(m - 42)} L${x + 14} ${f2(m - 26)} M${x} ${f2(m + 6)} V${f2(m + 40)} M${x - 14} ${f2(m + 26)} L${x} ${f2(m + 42)} L${x + 14} ${f2(m + 26)}" fill="none" stroke="${C.fire}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
    return s;
  };
  onDraw("s2", (t) => {
    const a = 1 - ramp(t, tStad - 0.1, tStad + 0.3),
      b = ramp(t, tStad + 0.2, tStad + 0.6) * (1 - ramp(t, tChair - 0.1, tChair + 0.3)),
      c = ramp(t, tChair + 0.2, tChair + 0.6);
    let s = "";
    if (a > 0) s += `<g opacity="${f2(a)}">${atomView(t)}</g>`;
    if (b > 0) s += `<g opacity="${f2(b)}">${stadView(t)}</g>`;
    if (c > 0) s += `<g opacity="${f2(c)}">${chairView(t)}</g>`;
    $("#s2-draw").innerHTML = s;
  });
  const la = {
    nuc: label(
      "s2",
      "s2-l-nuc",
      [CX + 30, CY - 20],
      [1420, 330],
      "Le noyau",
      "tout petit, très lourd",
      { color: "#C2334C" },
    ),
    el: label(
      "s2",
      "s2-l-el",
      [CX - 300, CY + 60],
      [470, 800],
      "Les électrons",
      "ils tournoient autour",
      { color: C.blue, align: "r" },
    ),
    cl: label(
      "s2",
      "s2-l-cl",
      [CX + 250, CY + 190],
      [1420, 780],
      "Un nuage",
      "ils sont un peu partout",
      { color: C.blue },
    ),
  };
  showLabel(la.nuc, tNuc);
  showLabel(la.el, tEl);
  showLabel(la.cl, tCloud + 0.4);
  hideLabel(la.nuc.concat(la.el, la.cl), tStad - 0.2);
  const lb = {
    bille: label(
      "s2",
      "s2-l-bille",
      [CX + 6, CY - 6],
      [1150, 250],
      "Le noyau",
      "une bille au milieu du stade",
      { color: "#C2334C" },
    ),
    grad: label(
      "s2",
      "s2-l-grad",
      [400, 700],
      [130, 880],
      "Les électrons",
      "tout là-bas, dans les gradins",
      { color: C.blue },
    ),
  };
  showLabel(lb.bille, tStad + 0.7);
  showLabel(lb.grad, cue("s2-5", "gradins") - 0.4);
  show("#s2-n1", cue("s2-6", "vides") - 0.4);
  hideLabel(lb.bille.concat(lb.grad, ["#s2-n1"]), tChair - 0.2);
  show("#s2-n2", tPush + 0.3);
})();
