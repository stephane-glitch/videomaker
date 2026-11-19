/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs : ces fonctions servent aux autres fragments */
// Le cylindre en coupe (vue isométrique), redessiné à chaque image à partir de l'angle du vilebrequin.
// Toute la cinématique vient de la vraie relation bielle-manivelle.
const ENG = (() => {
  const A = (-28 * Math.PI) / 180,
    E = (24 * Math.PI) / 180;
  const ca = Math.cos(A),
    sa = Math.sin(A),
    ce = Math.cos(E),
    se = Math.sin(E);
  const K = { S: 1.04, OX: 650, OY: 800 };
  const P = ([x, y, z]) => {
    const xr = x * ca - y * sa,
      yr = x * sa + y * ca;
    return [K.OX + K.S * xr, K.OY - K.S * (z * ce + yr * se)];
  };
  const pathOf = (pts, close = true) =>
    pts.map((p, i) => `${i ? "L" : "M"}${f2(p[0])} ${f2(p[1])}`).join("") + (close ? "Z" : "");
  const poly3 = (pts, close = true) => pathOf(pts.map(P), close);
  const circle = (c, u, v, r, n = 40, t0 = 0, t1 = TAU) => {
    const o = [];
    for (let i = 0; i <= n; i++) {
      const t = t0 + ((t1 - t0) * i) / n,
        cs = Math.cos(t),
        sn = Math.sin(t);
      o.push([
        c[0] + r * (cs * u[0] + sn * v[0]),
        c[1] + r * (cs * u[1] + sn * v[1]),
        c[2] + r * (cs * u[2] + sn * v[2]),
      ]);
    }
    return o;
  };
  const hull = (pts) => {
    const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [],
      up = [];
    for (const q of p) {
      while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
      lo.push(q);
    }
    for (const q of p.reverse()) {
      while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
      up.push(q);
    }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  };
  const circ2 = (cx, cz, r, n = 28) => {
    const o = [];
    for (let i = 0; i < n; i++)
      o.push([cx + r * Math.cos((i / n) * TAU), cz + r * Math.sin((i / n) * TAU)]);
    return o;
  };
  const xz = (pts) => pts.map(([x, z]) => [x, 0, z]);
  const stroke = (w = 3) =>
    `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const X = [1, 0, 0],
    Y = [0, 1, 0],
    Z = [0, 0, 1];

  // Un calque = une liste de fragments SVG + ses dégradés.
  const layer = (pre) => {
    const out = [],
      defs = [];
    let n = 0;
    const L = {
      add: (s) => out.push(s),
      lin: (x1, y1, x2, y2, stops) => {
        const id = `${pre}${n++}`;
        defs.push(
          `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f2(x1)}" y1="${f2(y1)}" x2="${f2(x2)}" y2="${f2(y2)}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`,
        );
        return `url(#${id})`;
      },
      rad: (cx, cy, r, stops) => {
        const id = `${pre}${n++}`;
        defs.push(
          `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${f2(cx)}" cy="${f2(cy)}" r="${f2(r)}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</radialGradient>`,
        );
        return `url(#${id})`;
      },
      html: () => `<defs>${defs.join("")}</defs>${out.join("")}`,
    };
    // cylindre plein entre c0 et c1 ; cap = extrémité visible
    L.cyl = ({ c0, c1, u, v, r, light, mid, dark, capFill, cap = 1, w = 3 }) => {
      const a = circle(c0, u, v, r, 28).map(P),
        b = circle(c1, u, v, r, 28).map(P);
      const h = hull([...a, ...b]);
      const p0 = P(c0),
        p1 = P(c1);
      const dx = p1[0] - p0[0],
        dy = p1[1] - p0[1],
        len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len,
        ny = dx / len;
      const pr = h.map((q) => q[0] * nx + q[1] * ny);
      const mn = Math.min(...pr),
        mx = Math.max(...pr);
      const cx = (p0[0] + p1[0]) / 2,
        cy = (p0[1] + p1[1]) / 2,
        base = cx * nx + cy * ny;
      const g = L.lin(
        cx + nx * (mn - base),
        cy + ny * (mn - base),
        cx + nx * (mx - base),
        cy + ny * (mx - base),
        [
          [0, dark],
          [0.35, mid],
          [0.62, light],
          [0.85, mid],
          [1, dark],
        ],
      );
      L.add(`<path d="${pathOf(h)}" fill="${g}" ${stroke(w)}/>`);
      const capPts = cap ? b : a;
      L.add(`<path d="${pathOf(capPts)}" fill="${capFill ?? light}" ${stroke(w)}/>`);
      return capPts;
    };
    // pièce plate extrudée le long de y (profil dans le plan x-z)
    L.slab = (prof, y0, y1, front, back) => {
      const fr = prof.map(([x, z]) => [x, y0, z]),
        bk = prof.map(([x, z]) => [x, y1, z]);
      L.add(`<path d="${pathOf(hull([...fr.map(P), ...bk.map(P)]))}" fill="${back}" ${stroke()}/>`);
      L.add(`<path d="${poly3(fr)}" fill="${front}" ${stroke()}/>`);
    };
    return L;
  };
  const frontArc = (r, z) => {
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const t = Math.PI + (Math.PI * i) / 30;
      pts.push([r * Math.cos(t), r * Math.sin(t), z]);
    }
    return poly3(pts, false);
  };
  const halfBand = (z0, z1) => {
    const pts = [];
    for (let i = 0; i <= 30; i++)
      pts.push([R * Math.cos((Math.PI * i) / 30), R * Math.sin((Math.PI * i) / 30), z0]);
    for (let i = 30; i >= 0; i--)
      pts.push([R * Math.cos((Math.PI * i) / 30), R * Math.sin((Math.PI * i) / 30), z1]);
    return pts;
  };

  // --- Dimensions ---
  const R = 90,
    crankZ = 20,
    crankR = 60,
    rodL = 290;
  const BW = 150,
    BD = 150,
    B0 = 120,
    B1 = 420,
    HW = 172,
    HD = 160,
    H1 = 500,
    KW = 192,
    KD = 150,
    K0 = -90,
    KT = 20;
  const dome = [
    [-R, B1],
    [-R + 10, B1 + 30],
    [-40, B1 + 46],
    [40, B1 + 46],
    [R - 10, B1 + 30],
    [R, B1],
  ];
  const intake = [
    [-HW, H1 - 58],
    [-HW, H1 - 22],
    [-70, H1 - 22],
    [-28, B1 + 46],
    [-66, B1 + 44],
    [-100, H1 - 58],
  ];
  const exhaust = [
    [HW, H1 - 58],
    [HW, H1 - 22],
    [70, H1 - 22],
    [28, B1 + 46],
    [66, B1 + 44],
    [100, H1 - 58],
  ];
  const kin = (th) => {
    const pinX = crankR * Math.sin(th),
      pinZ = crankZ + crankR * Math.cos(th);
    const pz = pinZ + Math.sqrt(rodL * rodL - pinX * pinX);
    return { pinX, pinZ, pz, top: pz + 42 };
  };

  // --- Calque fixe arrière : carter, bloc, culasse, fond du cylindre ---
  const back = () => {
    const L = layer("ea");
    const [sx, sy] = P([0, 60, K0]);
    L.add(
      `<ellipse cx="${f2(sx + 30)}" cy="${f2(sy + 18)}" rx="${f2(330 * K.S)}" ry="${f2(70 * K.S)}" fill="${C.ink}" opacity="0.08"/>`,
    );
    L.add(
      `<path d="${poly3([
        [-KW, 0, B0],
        [KW, 0, B0],
        [KW, KD, B0],
        [-KW, KD, B0],
      ])}" fill="${C.top}" ${stroke()}/>`,
    );
    L.add(
      `<path d="${poly3([
        [KW, 0, K0],
        [KW, KD, K0],
        [KW, KD, B0],
        [KW, 0, B0],
      ])}" fill="${C.side}" ${stroke()}/>`,
    );
    L.add(
      `<path d="${poly3([
        [-KW + KT, KD - KT, K0 + KT],
        [KW - KT, KD - KT, K0 + KT],
        [KW - KT, KD - KT, B0],
        [-KW + KT, KD - KT, B0],
      ])}" fill="#C4CCDA" ${stroke(2)}/>`,
    );
    L.add(
      `<path d="${poly3([
        [-KW + KT, 0, K0 + KT],
        [KW - KT, 0, K0 + KT],
        [KW - KT, KD - KT, K0 + KT],
        [-KW + KT, KD - KT, K0 + KT],
      ])}" fill="#C7CFDC" ${stroke(2)}/>`,
    );
    L.add(
      `<path d="${poly3([
        [-KW + KT, 0, K0 + KT],
        [-KW + KT, KD - KT, K0 + KT],
        [-KW + KT, KD - KT, B0],
        [-KW + KT, 0, B0],
      ])}" fill="#DCE2EC" ${stroke(2)}/>`,
    );
    L.add(
      `<path d="${poly3([
        [-KW + KT, 0, K0 + KT + 14],
        [KW - KT, 0, K0 + KT + 14],
        [KW - KT, KD - KT, K0 + KT + 14],
        [-KW + KT, KD - KT, K0 + KT + 14],
      ])}" fill="#F2C266" opacity="0.55"/>`,
    );
    L.add(
      `<path d="${poly3([
        [BW, 0, B0],
        [BW, BD, B0],
        [BW, BD, B1],
        [BW, 0, B1],
      ])}" fill="${C.side}" ${stroke()}/>`,
    );
    for (let z = B0 + 40; z < B1 - 10; z += 44)
      L.add(
        `<path d="${poly3(
          [
            [BW, 8, z],
            [BW, BD - 8, z],
          ],
          false,
        )}" fill="none" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="2"/>`,
      );
    L.add(
      `<path d="${poly3([
        [-HW, 0, H1],
        [HW, 0, H1],
        [HW, HD, H1],
        [-HW, HD, H1],
      ])}" fill="${C.top}" ${stroke()}/>`,
    );
    L.add(
      `<path d="${poly3([
        [HW, 0, B1],
        [HW, HD, B1],
        [HW, HD, H1],
        [HW, 0, H1],
      ])}" fill="${C.side}" ${stroke()}/>`,
    );
    for (const [x, y] of [
      [-140, 30],
      [-140, 130],
      [140, 130],
      [140, 30],
      [-70, 135],
      [70, 135],
    ])
      L.add(
        `<path d="${pathOf(circle([x, y, H1], X, Y, 9, 16).map(P))}" fill="${C.side}" ${stroke(2)}/>`,
      );
    const [lx] = P([-R, 0, 0]),
      [rx] = P([R, 0, 0]);
    L.add(
      `<path d="${poly3(halfBand(B0, B1))}" fill="${L.lin(lx, 0, rx, 0, [
        [0, "#A9B4C7"],
        [0.5, "#C9D1DE"],
        [1, "#9EAABF"],
      ])}" ${stroke(2)}/>`,
    );
    L.add(`<path d="${poly3(xz(dome))}" fill="#C9D1DE"/>`);
    L.add(
      `<path d="${poly3(xz(intake))}" fill="#E6ECF4"/><path d="${poly3(xz(exhaust))}" fill="#E6ECF4"/>`,
    );
    return L.html();
  };
  // --- Calque fixe milieu : les faces coupées (sable hachuré) ---
  const cut = () => {
    const face = (outer, holes = []) =>
      `<path d="${[outer, ...holes].map((h) => poly3(xz(h))).join("")}" fill="url(#eng-hatch)" fill-rule="evenodd" ${stroke()}/>`;
    return (
      `<defs><pattern id="eng-hatch" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)"><rect width="14" height="14" fill="${C.cut}"/><line x1="0" y1="0" x2="0" y2="14" stroke="${C.hatch}" stroke-width="5"/></pattern></defs>` +
      face(
        [
          [-KW, K0],
          [KW, K0],
          [KW, B0],
          [-KW, B0],
        ],
        [
          [
            [-KW + KT, K0 + KT],
            [KW - KT, K0 + KT],
            [KW - KT, B0],
            [-KW + KT, B0],
          ],
        ],
      ) +
      face([
        [-BW, B0],
        [-R, B0],
        [-R, B1],
        [-BW, B1],
      ]) +
      face([
        [R, B0],
        [BW, B0],
        [BW, B1],
        [R, B1],
      ]) +
      face(
        [
          [-HW, B1],
          [HW, B1],
          [HW, H1],
          [-HW, H1],
        ],
        [dome, intake, exhaust],
      ) +
      `<path d="${poly3(xz(intake))}" fill="none" ${stroke()}/><path d="${poly3(xz(exhaust))}" fill="none" ${stroke()}/>`
    );
  };
  // --- Calque fixe haut : la bougie et son câble ---
  const plug = () => {
    const L = layer("ep");
    const g = { light: "#E3E8F0", mid: C.metal, dark: "#6C7890" };
    L.cyl({ c0: [0, 0, B1 + 30], c1: [0, 0, B1 + 52], u: X, v: Y, r: 6, ...g, w: 2 });
    L.cyl({ c0: [0, 0, B1 + 46], c1: [0, 0, H1 + 6], u: X, v: Y, r: 12, ...g, w: 2.5 });
    const hex = (z) =>
      Array.from({ length: 6 }, (_, i) => [
        22 * Math.cos((i / 6) * TAU + 0.3),
        22 * Math.sin((i / 6) * TAU + 0.3),
        z,
      ]);
    const lo = hex(H1 + 6),
      hi = hex(H1 + 24);
    L.add(
      `<path d="${pathOf(hull([...lo.map(P), ...hi.map(P)]))}" fill="${C.metal}" ${stroke(2.5)}/><path d="${poly3(hi)}" fill="#E3E8F0" ${stroke(2.5)}/>`,
    );
    L.cyl({
      c0: [0, 0, H1 + 24],
      c1: [0, 0, H1 + 84],
      u: X,
      v: Y,
      r: 13,
      light: "#FFFFFF",
      mid: "#FBFBFD",
      dark: "#C9CFDA",
      w: 2.5,
    });
    for (const z of [H1 + 44, H1 + 56, H1 + 68])
      L.add(
        `<path d="${frontArc(13, z)}" fill="none" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="2"/>`,
      );
    L.cyl({ c0: [0, 0, H1 + 84], c1: [0, 0, H1 + 100], u: X, v: Y, r: 7, ...g, w: 2 });
    const c = [
      P([0, 0, H1 + 96]),
      P([40, 0, H1 + 150]),
      P([150, 0, H1 + 150]),
      P([230, 0, H1 + 172]),
    ];
    const d = `M${f2(c[0][0])} ${f2(c[0][1])} C${f2(c[1][0])} ${f2(c[1][1])} ${f2(c[2][0])} ${f2(c[2][1])} ${f2(c[3][0])} ${f2(c[3][1])}`;
    L.add(
      `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="13" stroke-linecap="round"/><path id="eng-wire" d="${d}" fill="none" stroke="${C.spark}" stroke-width="7" stroke-linecap="round"/>`,
    );
    return L.html();
  };

  // --- Calque mobile 1 : les gaz (derrière les faces coupées) ---
  // st = { iv, ev (levée des soupapes 0..1), gas: null | "mix" | "fire" | "smoke", dens 0..1, flow (temps, pour les bulles) }
  const gas = (th, st) => {
    const L = layer("eg");
    const k = kin(th);
    // conduits : l'air entre (bleu), la fumée sort (gris)
    if (st.iv > 0.02)
      L.add(`<path d="${poly3(xz(intake))}" fill="${C.air}" opacity="${f2(clamp(st.iv * 1.6))}"/>`);
    if (st.ev > 0.02)
      L.add(
        `<path d="${poly3(xz(exhaust))}" fill="${C.smoke}" opacity="${f2(clamp(st.ev * 1.6))}"/>`,
      );
    if (st.iv > 0.05)
      for (let i = 0; i < 5; i++) {
        const u = (st.flow * 0.9 + i / 5) % 1;
        const x = lerp(-165, -58, u),
          z = H1 - 40 - Math.max(0, u - 0.62) * 70;
        const [px, py] = P([x, 0, z]);
        L.add(
          `<circle cx="${f2(px)}" cy="${f2(py)}" r="${i % 2 ? 6 : 5}" fill="${i % 2 ? C.fire : "#fff"}" opacity="${f2(st.iv)}"/>`,
        );
      }
    if (st.ev > 0.05)
      for (let i = 0; i < 4; i++) {
        const u = (st.flow * 0.8 + i / 4) % 1;
        const x = lerp(58, 165, u),
          z = H1 - 40 - Math.max(0, 0.38 - u) * 70;
        const [px, py] = P([x, 0, z]);
        L.add(
          `<circle cx="${f2(px)}" cy="${f2(py)}" r="${7 - i}" fill="#7C8592" opacity="${f2(st.ev * 0.8)}"/>`,
        );
      }
    if (st.gas) {
      const [tx, ty] = P([0, 0, B1 + 40]);
      let fill,
        op = 1;
      if (st.gas === "fire")
        fill = L.rad(tx, ty, 200 * K.S, [
          [0, "#FFFBE0"],
          [0.25, C.hot],
          [0.6, C.fire],
          [1, "#F05A14"],
        ]);
      else if (st.gas === "mix") {
        fill = mixHex("#BFE6FF", "#3FA9F5", st.dens);
        op = 0.75 + 0.25 * st.dens;
      } else {
        fill = C.smoke;
        op = 0.35 + 0.55 * st.dens;
      }
      L.add(
        `<g opacity="${f2(op)}"><path d="${poly3(halfBand(k.top, B1))}" fill="${fill}"/><path d="${poly3(xz(dome))}" fill="${fill}"/></g>`,
      );
      if (st.gas === "mix") {
        // gouttelettes d'essence dans l'air : elles se resserrent quand le piston remonte
        const hgt = B1 + 30 - k.top;
        for (let i = 0; i < 7; i++) {
          const [px, py] = P([
            -62 + i * 21,
            40,
            k.top + 12 + ((i * 37) % 100) * 0.01 * Math.max(8, hgt - 24),
          ]);
          L.add(`<circle cx="${f2(px)}" cy="${f2(py)}" r="6" fill="${C.fire}"/>`);
        }
      }
    }
    return L.html();
  };

  // --- Calque mobile 2 : vilebrequin, bielle, piston, soupapes ---
  const front = (th, st) => {
    const L = layer("ef");
    const k = kin(th);
    const bl = { light: C.blueL, mid: C.blue, dark: C.blueD };
    L.cyl({
      c0: [0, KD + 10, crankZ],
      c1: [0, -110, crankZ],
      u: X,
      v: Z,
      r: 22,
      ...bl,
      capFill: C.blueL,
    });
    // bras de manivelle et contrepoids
    const ang = Math.atan2(k.pinZ - crankZ, k.pinX);
    const web = [...circ2(k.pinX, k.pinZ, 32, 16), ...circ2(0, crankZ, 38, 16)];
    for (let i = 0; i <= 14; i++) {
      const t = ang + Math.PI * 0.55 + (Math.PI * 0.9 * i) / 14;
      web.push([86 * Math.cos(t), crankZ + 86 * Math.sin(t)]);
    }
    L.slab(hull(web), 22, 48, C.blue, C.blueD);
    // bielle
    L.slab(
      hull([...circ2(k.pinX, k.pinZ, 38, 20), ...circ2(0, k.pz, 24, 16)]),
      -16,
      16,
      C.blueL,
      C.blueD,
    );
    const dx = -k.pinX,
      dz = k.pz - k.pinZ,
      len = Math.hypot(dx, dz),
      ux = dx / len,
      uz = dz / len;
    const rib = [
      [52, 9],
      [len - 40, 6],
      [len - 40, -6],
      [52, -9],
    ].map(([s, w]) => [k.pinX + ux * s - uz * w, -16, k.pinZ + uz * s + ux * w]);
    L.add(`<path d="${poly3(rib)}" fill="${C.blue}" ${stroke(2)}/>`);
    L.add(
      `<path d="${pathOf(circle([k.pinX, -16, k.pinZ], X, Z, 18, 20).map(P))}" fill="${C.blueD}" ${stroke(2)}/>`,
    );
    L.add(
      `<path d="${pathOf(circle([k.pinX, -16, k.pinZ], X, Z, 9, 14).map(P))}" fill="${C.blueL}"/>`,
    );
    // poulie avant, avec un repère qui montre la rotation
    L.cyl({
      c0: [0, -70, crankZ],
      c1: [0, -100, crankZ],
      u: X,
      v: Z,
      r: 46,
      ...bl,
      capFill: C.blueL,
    });
    L.add(
      `<path d="${pathOf(circle([0, -100, crankZ], X, Z, 30, 24).map(P))}" fill="none" stroke="${C.blueD}" stroke-width="3"/>`,
    );
    const [mx, my] = P([34 * Math.sin(th), -100, crankZ + 34 * Math.cos(th)]);
    const [hx, hy] = P([0, -100, crankZ]);
    L.add(
      `<path d="M${f2(hx)} ${f2(hy)} L${f2(mx)} ${f2(my)}" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="${f2(hx)}" cy="${f2(hy)}" r="9" fill="${C.ink}"/>`,
    );
    // piston
    const hot = st.gas === "fire";
    const cap = L.cyl({ c0: [0, 0, k.top - 118], c1: [0, 0, k.top], u: X, v: Y, r: R - 3, ...bl });
    for (const d of [14, 26, 38])
      L.add(
        `<path d="${frontArc(R - 3, k.top - d)}" fill="none" stroke="${C.blueD}" stroke-width="3"/>`,
      );
    if (hot) {
      const [cx, cy] = P([0, 0, k.top]);
      L.add(
        `<path d="${pathOf(cap)}" fill="${L.rad(cx, cy, 120 * K.S, [
          [0, "#FFE7A0"],
          [1, C.fire],
        ])}" ${stroke()}/>`,
      );
      // flammes devant la coupe
      const [bx, by] = P([0, -2, k.top]);
      const hgt = (B1 + 36 - k.top) * K.S * ce;
      let fl = "";
      for (let i = 0; i < 6; i++) {
        const x = bx + (-80 + i * 32) * K.S,
          w = 22 * K.S,
          h = hgt * (0.55 + 0.4 * Math.abs(Math.sin(st.flow * 9 + i * 1.7)));
        fl += `<path d="M${f2(x - w)} ${f2(by)} Q${f2(x - w * 0.6)} ${f2(by - h * 0.6)} ${f2(x)} ${f2(by - h)} Q${f2(x + w * 0.6)} ${f2(by - h * 0.6)} ${f2(x + w)} ${f2(by)}Z" fill="${C.hot}" opacity="0.85"/>`;
      }
      L.add(fl);
    }
    // soupapes (elles descendent quand elles s'ouvrent)
    for (const [x, lift] of [
      [-48, st.iv],
      [48, st.ev],
    ]) {
      const dz = -18 * lift;
      L.cyl({ c0: [x, 0, B1 + 46 + dz], c1: [x, 0, H1 + 52 + dz], u: X, v: Y, r: 6, ...bl, w: 2 });
      L.cyl({
        c0: [x, 0, B1 + 40 + dz],
        c1: [x, 0, B1 + 48 + dz],
        u: X,
        v: Y,
        r: 26,
        ...bl,
        w: 2.5,
      });
      const coil = [];
      const top = H1 + 44 + dz;
      for (let i = 0; i <= 80; i++) {
        const t = (i / 20) * TAU;
        coil.push([x + 16 * Math.cos(t), 16 * Math.sin(t), H1 + 4 + (i / 80) * (top - H1 - 4)]);
      }
      L.add(`<path d="${poly3(coil, false)}" fill="none" stroke="${C.ink}" stroke-width="3.5"/>`);
      L.cyl({
        c0: [x, 0, top],
        c1: [x, 0, top + 8],
        u: X,
        v: Y,
        r: 20,
        light: "#E3E8F0",
        mid: C.metal,
        dark: "#6C7890",
        w: 2.5,
      });
    }
    return L.html();
  };
  // --- Calque mobile 3 : l'étincelle ---
  const spark = (amt) => {
    if (amt <= 0.01) return "";
    const [sx, sy] = P([0, 0, B1 + 26]);
    let star = "";
    for (let i = 0; i < 20; i++) {
      const r = (i % 2 ? 10 : 34) * (0.6 + 0.4 * amt) * K.S,
        t = (i / 20) * TAU - Math.PI / 2;
      star += `${i ? "L" : "M"}${f2(sx + r * Math.cos(t))} ${f2(sy + r * Math.sin(t))}`;
    }
    return `<path d="${star}Z" fill="${C.spark}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round" opacity="${f2(amt)}"/><circle cx="${f2(sx)}" cy="${f2(sy)}" r="7" fill="#fff" opacity="${f2(amt)}"/>`;
  };
  return { K, P, kin, back, cut, plug, gas, front, spark, dims: { R, B0, B1, H1, HW, BW, crankZ } };
})();
