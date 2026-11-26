// Essai « papier découpé » : tout est fabriqué en code (papiers, déchirures, ombres), animé image par image.
(() => {
  const TAU = Math.PI * 2;
  const FPS = 15; // « sur deux » : une pose tient deux images de la vidéo
  const TOTAL = 15.2;
  const rnd = (i) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ramp = (t, a, b) => clamp((t - a) / (b - a));
  const ease = (u) => u * u * (3 - 2 * u);
  const E = (t, a, b) => ease(ramp(t, a, b));
  const f1 = (v) => v.toFixed(1);

  const pieces = [];
  let uid = 0;

  // ---------- formes ----------
  const poly = (pts) => "M" + pts.map((p) => f1(p[0]) + " " + f1(p[1])).join("L") + "Z";
  function blob(cx, cy, rx, ry, n, seed, jag = 0.1) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const r = 1 + (rnd(seed + i) - 0.5) * 2 * jag;
      pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
    }
    return pts;
  }
  function band(x0, x1, y0, y1, seed, amp = 18, stepx = 95) {
    const pts = [];
    const n = Math.round((x1 - x0) / stepx);
    for (let i = 0; i <= n; i++)
      pts.push([
        x0 + ((x1 - x0) * i) / n + (i === 0 || i === n ? (rnd(seed + 60 + i) - 0.5) * 26 : 0),
        y0 + (rnd(seed + i) - 0.5) * 2 * amp,
      ]);
    for (let i = n; i >= 0; i--)
      pts.push([
        x0 + ((x1 - x0) * i) / n + (i === 0 || i === n ? (rnd(seed + 80 + i) - 0.5) * 26 : 0),
        y1 + (rnd(seed + 100 + i) - 0.5) * 2 * amp,
      ]);
    return pts;
  }
  function rect(x, y, w, h, seed = 0, j = 0) {
    const q = (k) => (rnd(seed + k) - 0.5) * 2 * j;
    return [
      [x + q(1), y + q(2)],
      [x + w + q(3), y + q(4)],
      [x + w + q(5), y + h + q(6)],
      [x + q(7), y + h + q(8)],
    ];
  }

  // ---------- un morceau de papier ----------
  function P(o) {
    const pts = o.pts;
    let x0 = 1e9,
      y0 = 1e9,
      x1 = -1e9,
      y1 = -1e9;
    for (const [x, y] of pts) {
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
    const pad = 36;
    const w = x1 - x0,
      h = y1 - y0;
    const d = poly(pts.map(([x, y]) => [x - x0, y - y0]));
    const id = "p" + uid++;
    const el = document.createElement("div");
    el.className = "pc";
    el.style.left = f1(x0 - pad) + "px";
    el.style.top = f1(y0 - pad) + "px";
    el.style.width = f1(w + 2 * pad) + "px";
    el.style.height = f1(h + 2 * pad) + "px";
    const piv = o.pivot
      ? [o.pivot[0] - x0 + pad, o.pivot[1] - y0 + pad]
      : [w / 2 + pad, h / 2 + pad];
    el.style.transformOrigin = `${f1(piv[0])}px ${f1(piv[1])}px`;
    const lift = o.lift ?? 5;
    if (lift)
      el.style.filter = `drop-shadow(${f1(lift * 0.6)}px ${f1(lift)}px ${f1(lift * 0.7)}px rgba(40,22,6,${o.shA ?? 0.45}))`;
    const tear = o.torn ? ` filter="url(#tear${o.torn})"` : "";
    const stock = ` filter="url(#st-${o.stock || "fine"})"`;
    const extra = o.extra ? `<g clip-path="url(#c${id})">${o.extra(w, h)}</g>` : "";
    const dk = o.dk || [-2, -6];
    const white =
      o.torn && o.deckle !== false
        ? `<path d="${d}" transform="translate(${dk[0]} ${dk[1]})" fill="#f6f0e2" stroke="#f6f0e2" stroke-width="${o.dw ?? 8}" stroke-linejoin="round" filter="url(#tearW)"/>`
        : "";
    el.innerHTML =
      `<svg width="${f1(w + 2 * pad)}" height="${f1(h + 2 * pad)}" viewBox="${-pad} ${-pad} ${f1(w + 2 * pad)} ${f1(h + 2 * pad)}"${o.alpha ? ` style="opacity:${o.alpha}"` : ""}>` +
      `<defs><clipPath id="c${id}"><path d="${d}"/></clipPath></defs>${white}<g${tear}><g${stock}><path d="${d}" fill="${o.fill}"/>${extra}${o.over ? o.over(w, h) : ""}</g></g></svg>`;
    document.getElementById("L-" + (o.layer || "world")).appendChild(el);
    const size = Math.max(w, h);
    const p = {
      el,
      seed: o.seed ?? uid * 7.3,
      rot: o.rot || 0,
      tin: o.tin,
      from: o.from || [0, -50, 10],
      anim: o.anim,
      boil: o.boil ?? (size > 900 ? 0.7 : 1.3),
      rb: o.rb ?? 0.35 * Math.min(1, 120 / size),
    };
    pieces.push(p);
    return p;
  }

  const INK = "#2a2320";
  function label(x, y, text, o = {}) {
    const fs = o.fs ?? 50;
    const w = o.w ?? text.length * fs * 0.54 + 80;
    const h = fs * 1.75;
    const base = { layer: o.layer, tin: o.tin, from: o.from || [70, -30, 9], rot: o.rot ?? -2 };
    P({
      ...base,
      pts: rect(x, y, w, h, x + y, 4),
      fill: o.fill || "#f7f0dc",
      lift: 7,
      seed: x * 1.7 + y,
      extra: (W, H) => `<rect width="${W}" height="${H}" fill="url(#p-grid)" opacity=".5"/>`,
      over: (W, H) =>
        `<text x="${W / 2}" y="${H / 2 + fs * 0.35}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${o.ink || INK}">${text}</text>`,
    });
    // ruban de masquage
    const tx = x + w * 0.5 - 55,
      ty = y - 20;
    P({
      ...base,
      pivot: [x + w / 2, y + h / 2],
      seed: x * 1.7 + y,
      pts: [
        [tx, ty + 4],
        [tx + 8, ty - 2],
        [tx + 102, ty],
        [tx + 110, ty + 6],
        [tx + 104, ty + 38],
        [tx + 112, ty + 44],
        [tx + 6, ty + 42],
        [tx - 2, ty + 36],
      ],
      fill: "#ead9a6",
      alpha: 0.82,
      lift: 2,
      shA: 0.3,
    });
  }

  // ---------- décor ----------
  // Carton du fond
  {
    const b = document.createElement("div");
    b.className = "pc";
    b.innerHTML = `<svg width="1920" height="3300"><rect width="1920" height="3300" fill="#c4ab88" filter="url(#st-board)"/></svg>`;
    document.getElementById("L-board").appendChild(b);
  }

  // Ciel
  P({
    layer: "sky",
    pts: rect(58, 34, 1804, 830, 5, 7),
    fill: "#a8d5ee",
    stock: "sugar",
    lift: 6,
    boil: 0.5,
  });
  for (const [x, y, r] of [
    [40, 22, -8],
    [1770, 26, 7],
  ])
    P({
      layer: "sky",
      pts: rect(x, y, 120, 40, x, 3),
      fill: "#ead9a6",
      alpha: 0.85,
      lift: 2,
      rot: r,
      boil: 0.3,
    });
  // Soleil
  {
    const cx = 1590,
      cy = 235,
      star = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU,
        r = i % 2 ? 108 : 168;
      star.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    P({
      layer: "sky",
      pts: star,
      fill: "#f6b93b",
      tin: 0.4,
      from: [60, -60, 30],
      anim: (t, s) => ({ r: Math.floor(s / 2) * 5 }),
      boil: 0.6,
    });
    P({
      layer: "sky",
      pts: blob(cx, cy, 96, 96, 20, 3, 0.03),
      fill: "#ffd84a",
      tin: 0.47,
      from: [60, -60, 0],
      extra: (w, h) => `<rect width="${w}" height="${h}" fill="url(#p-half2)" opacity=".55"/>`,
      lift: 7,
    });
  }
  // Nuages en papier de soie
  const cloud = (x, y, s, sd, tin) => {
    const drift = (t, st) => ({ x: Math.floor(st / 2) * 1.5 });
    P({
      layer: "far",
      pts: blob(x, y, 150 * s, 52 * s, 11, sd, 0.22),
      fill: "#fbf8f0",
      torn: 2,
      deckle: false,
      alpha: 0.93,
      lift: 8,
      shA: 0.25,
      tin,
      from: [-90, 0, 0],
      anim: drift,
    });
    P({
      layer: "far",
      pts: blob(x + 30 * s, y - 38 * s, 85 * s, 48 * s, 9, sd + 9, 0.2),
      fill: "#ffffff",
      torn: 1,
      deckle: false,
      alpha: 0.9,
      lift: 6,
      shA: 0.22,
      tin: tin + 0.07,
      from: [-90, 0, 0],
      anim: drift,
    });
  };
  cloud(1130, 150, 1, 11, 0.55);
  cloud(300, 470, 0.8, 31, 0.7);
  // Collines
  {
    const hill = (seed, base, amp, k, ph) => {
      const pts = [];
      for (let i = 0; i <= 24; i++) {
        const x = 66 + (1788 * i) / 24;
        pts.push([
          x,
          base - amp * Math.sin((i / 24) * Math.PI * k + ph) + (rnd(seed + i) - 0.5) * 14,
        ]);
      }
      pts.push([1854, 850], [66, 850]);
      return pts;
    };
    P({
      layer: "far",
      pts: hill(3, 640, 60, 2.2, 0.4),
      fill: "#9ccb7c",
      stock: "sugar",
      torn: 1,
      lift: 5,
      boil: 0.5,
    });
    P({
      layer: "far",
      pts: hill(47, 700, 42, 3.1, 2.2),
      fill: "#74b565",
      stock: "sugar",
      torn: 2,
      lift: 6,
      boil: 0.5,
    });
  }

  // Terre (posée en premier : les couches du dessous viennent se coller par-dessus)
  P({
    pts: band(26, 1894, 770, 1345, 7, 12),
    fill: "#6f4a2b",
    stock: "sugar",
    torn: 1,
    deckle: false,
    lift: 6,
    boil: 0.5,
  });
  // Racines
  for (const [dx, len, r] of [
    [-22, 170, 16],
    [4, 230, -3],
    [26, 150, -22],
  ])
    P({
      pts: [
        [415 + dx, 790],
        [433 + dx, 790],
        [428 + dx, 790 + len * 0.6],
        [424 + dx, 790 + len],
      ],
      fill: "#b98a55",
      stock: "kraft",
      lift: 2,
      rot: r,
      pivot: [424 + dx, 790],
      boil: 0.6,
    });
  // Cailloux
  for (let i = 0; i < 9; i++) {
    const x = 150 + rnd(i * 3 + 1) * 1620,
      y = 900 + rnd(i * 3 + 2) * 330,
      r = 16 + rnd(i * 3 + 3) * 22;
    if (Math.abs(x - 960) < 70 || (x > 1130 && x < 1560 && y > 950 && y < 1120)) continue;
    P({
      pts: blob(x, y, r, r * 0.75, 7, i * 11, 0.18),
      fill: ["#b9b4aa", "#8f8c86", "#d2ccbf"][i % 3],
      lift: 3,
      rot: rnd(i) * 90,
    });
  }
  // Os enterré
  {
    const x = 690,
      y = 1190;
    P({
      pts: [
        [x - 70, y - 20],
        [x - 52, y - 26],
        [x - 44, y - 10],
        [x + 44, y - 10],
        [x + 52, y - 26],
        [x + 70, y - 20],
        [x + 66, y],
        [x + 70, y + 20],
        [x + 52, y + 26],
        [x + 44, y + 10],
        [x - 44, y + 10],
        [x - 52, y + 26],
        [x - 70, y + 20],
        [x - 66, y],
      ],
      fill: "#f3ecda",
      lift: 3,
      rot: -18,
    });
  }
  // Ver de terre : deux formes de rechange qui alternent
  {
    const worm = (ph) => {
      const top = [],
        bot = [];
      for (let i = 0; i <= 10; i++) {
        const x = 250 + i * 17,
          y = 1010 + Math.sin(i * 0.9 + ph) * 14;
        top.push([x, y - 9]);
        bot.unshift([x, y + 9]);
      }
      return top.concat(bot);
    };
    [0, 1].forEach((k) =>
      P({
        pts: worm(k * 2.4),
        fill: "#e98fa6",
        lift: 3,
        boil: 0.4,
        anim: (t, s) => ({ o: Math.floor(s / 3) % 2 === k ? 1 : 0, x: Math.floor(s / 3) * 2.4 }),
      }),
    );
  }
  // Carotte du jardin
  P({
    pts: [
      [682, 792],
      [732, 792],
      [712, 925],
      [704, 930],
    ],
    fill: "#f08a24",
    lift: 3,
    rot: 4,
    tin: 1.15,
    from: [0, 60, 0],
  });

  // Roche : papier journal déchiré
  const newsprint = (w, h) => {
    let s = `<g transform="rotate(-5 ${w / 2} ${h / 2})" fill="#33302c" opacity=".36">`;
    let k = 0;
    for (let cx = -40; cx < w + 40; cx += 300)
      for (let y = -80; y < h + 80; y += 13) {
        if (rnd(cx + y * 0.37) < 0.035) {
          s += `<rect x="${cx}" y="${y}" width="${150 + rnd(k++) * 100}" height="18"/>`;
          y += 16;
          continue;
        }
        let x = cx;
        while (x < cx + 262) {
          const ww = 10 + rnd(k++) * 42;
          s += `<rect x="${f1(x)}" y="${y}" width="${f1(Math.min(ww, cx + 268 - x))}" height="5.5"/>`;
          x += ww + 7;
        }
      }
    return s + "</g>";
  };
  P({
    pts: band(22, 1898, 1295, 1960, 21, 20),
    fill: "#a5a59f",
    torn: 2,
    dw: 12,
    lift: 7,
    extra: newsprint,
    boil: 0.5,
  });
  for (let i = 0; i < 9; i++) {
    const x = 130 + ((i * 211) % 1700),
      y = 1400 + rnd(i * 5 + 2) * 440,
      r = 50 + rnd(i * 5 + 3) * 60;
    if (x > 1120 && x < 1560 && y > 1500 && y < 1700) continue;
    if (Math.abs(x - 960) < 110) continue;
    P({
      pts: blob(x, y, r, r * 0.62, 6, i * 13 + 5, 0.22),
      fill: ["#77797c", "#8d8a84", "#5f6367"][i % 3],
      lift: 4,
      rot: rnd(i + 40) * 60 - 30,
      extra: i % 2 ? newsprint : null,
    });
  }
  // Fossile
  P({
    pts: blob(560, 1700, 62, 62, 14, 77, 0.05),
    fill: "#ddd3bb",
    lift: 4,
    over: (w, h) => {
      let d = "";
      for (let i = 0; i <= 60; i++) {
        const a = i * 0.3,
          r = 4 + i * 0.8;
        d += (i ? "L" : "M") + f1(w / 2 + Math.cos(a) * r) + " " + f1(h / 2 + Math.sin(a) * r);
      }
      return `<path d="${d}" fill="none" stroke="#7a6a4c" stroke-width="5" stroke-linecap="round"/>`;
    },
  });

  // Manteau : papier marbré
  P({
    pts: band(26, 1894, 1900, 3260, 33, 24),
    fill: "#e56a2c",
    stock: "marble",
    torn: 1,
    dw: 12,
    lift: 8,
    boil: 0.5,
  });
  // Halo de chaleur en papier de soie
  const glow = (t, s) => (t >= 11.74 ? { s: [1, 1.03][Math.floor(s / 3) % 2] } : null);
  P({
    pts: blob(960, 3200, 800, 800, 72, 5, 0.01),
    fill: "#ffd23f",
    alpha: 0.42,
    torn: 2,
    deckle: false,
    lift: 0,
    anim: glow,
    boil: 0.4,
  });
  // Noyau : papier de magazine tramé
  P({
    pts: blob(960, 3200, 720, 720, 56, 9, 0.012),
    fill: "#f6a623",
    torn: 2,
    dw: 10,
    lift: 8,
    extra: (w, h) => `<rect width="${w}" height="${h}" fill="url(#p-half)" opacity=".6"/>`,
    boil: 0.5,
  });
  P({
    pts: blob(960, 3200, 420, 420, 40, 19, 0.014),
    fill: "#ffe066",
    torn: 1,
    dw: 9,
    lift: 9,
    extra: (w, h) => `<rect width="${w}" height="${h}" fill="url(#p-half2)" opacity=".7"/>`,
    anim: glow,
    boil: 0.5,
  });
  // Flammes de rechange sur « brûlante »
  [-52, -31, -10, 11, 32, 53].forEach((deg, i) => {
    const a = (deg * Math.PI) / 180,
      cx = 960 + Math.sin(a) * 455,
      cy = 3200 - Math.cos(a) * 455;
    [0, 1].forEach((k) => {
      const s = 1.15 + rnd(i) * 0.4,
        lean = k ? 16 : -10;
      const sh = (q, col, lift) =>
        P({
          pts: [
            [cx + lean * q, cy - 70 * s * q],
            [cx + 20 * s * q, cy - 26 * s * q],
            [cx + 27 * s * q, cy + 6 * s],
            [cx + 12 * s * q, cy + 26 * s],
            [cx - 12 * s * q, cy + 26 * s],
            [cx - 27 * s * q, cy + 6 * s],
            [cx - 15 * s * q, cy - 24 * s * q],
          ],
          fill: col,
          lift,
          rot: deg,
          pivot: [cx, cy + 26 * s],
          tin: 12.74 + i * 0.067,
          from: [0, 30, 0],
          boil: 0.5,
          anim: (t, st) => ({ o: (Math.floor(st / 2) + i) % 2 === k ? 1 : 0 }),
        });
      sh(1, "#e4472a", 4);
      sh(0.55, "#ffd23f", 1);
    });
  });

  // Herbe
  P({
    pts: band(18, 1902, 742, 806, 13, 9, 70),
    fill: "#5aa845",
    stock: "sugar",
    torn: 1,
    dk: [0, 5],
    lift: 6,
    boil: 0.5,
  });
  P({
    pts: [
      [690, 800],
      [700, 730],
      [708, 770],
      [716, 722],
      [722, 772],
      [734, 738],
      [730, 800],
    ],
    fill: "#2f8a3c",
    lift: 3,
    tin: 1.2,
    from: [0, 60, 0],
  });
  for (let i = 0; i < 14; i++) {
    const x = 90 + i * 132 + rnd(i) * 40;
    if (Math.abs(x - 960) < 130 || Math.abs(x - 712) < 60) continue;
    P({
      pts: [
        [x, 762],
        [x + 7, 722 - rnd(i + 5) * 14],
        [x + 14, 752],
        [x + 22, 716],
        [x + 30, 764],
      ],
      fill: i % 2 ? "#3f9440" : "#74c05a",
      lift: 2,
      anim: (t, s) => ({ r: [0, 3, 0, -3][(Math.floor(s / 3) + i) % 4] }),
      pivot: [x + 15, 764],
    });
  }

  // Maison
  {
    const tin = 0.6,
      fr = [0, -90, -8];
    P({
      pts: rect(1420, 520, 34, 80, 3, 2),
      fill: "#7c4a2d",
      stock: "kraft",
      tin,
      from: fr,
      lift: 3,
    });
    P({
      pts: rect(1270, 592, 210, 180, 9, 3),
      fill: "#d9482f",
      tin,
      from: fr,
      extra: (w, h) => `<rect width="${w}" height="${h}" fill="url(#p-ori)" opacity=".8"/>`,
    });
    P({
      pts: [
        [1236, 606],
        [1374, 478],
        [1512, 604],
      ],
      fill: "#a8703c",
      stock: "kraft",
      tin: tin + 0.13,
      from: fr,
      lift: 7,
    });
    P({
      pts: rect(1392, 672, 54, 100, 2, 2),
      fill: "#2c5d7c",
      tin: tin + 0.2,
      from: fr,
      lift: 3,
      extra: (w, h) => `<rect width="${w}" height="${h}" fill="url(#p-stripe)" opacity=".5"/>`,
    });
    P({
      pts: rect(1298, 630, 52, 52, 4, 2),
      fill: "#ffe9a8",
      tin: tin + 0.27,
      from: fr,
      lift: 3,
      over: (w, h) =>
        `<path d="M${w / 2} 2V${h - 2}M2 ${h / 2}H${w - 2}" stroke="#a8703c" stroke-width="5"/>`,
    });
  }
  // Arbre
  {
    const sway = (t, s) => ({ r: [0, 1.4, 0, -1.4][Math.floor(s / 4) % 4] });
    P({
      pts: [
        [404, 560],
        [446, 560],
        [452, 776],
        [398, 776],
      ],
      fill: "#8a5a33",
      stock: "kraft",
      tin: 0.8,
      from: [0, -90, 6],
    });
    const piv = [425, 600];
    P({
      pts: blob(345, 500, 92, 82, 9, 5, 0.14),
      fill: "#4fb07a",
      stock: "sugar",
      torn: 2,
      deckle: false,
      tin: 0.93,
      from: [-60, -60, -15],
      anim: sway,
      pivot: piv,
    });
    P({
      pts: blob(505, 490, 96, 86, 9, 15, 0.14),
      fill: "#2f8a5c",
      stock: "sugar",
      torn: 1,
      deckle: false,
      tin: 1.0,
      from: [60, -60, 15],
      anim: sway,
      pivot: piv,
    });
    P({
      pts: blob(425, 420, 128, 112, 10, 25, 0.12),
      fill: "#3a9d6e",
      stock: "sugar",
      torn: 1,
      tin: 1.07,
      from: [0, -80, 10],
      anim: sway,
      pivot: piv,
      lift: 8,
    });
  }

  // Pointillés « tout droit » : petits bouts de papier
  for (let k = 0; k < 25; k++) {
    const y = 850 + k * 68;
    if (y > 2480) break;
    P({
      pts: rect(952, y, 16, 40, k, 2.5),
      fill: "#fbf3dc",
      lift: 2,
      rot: (rnd(k) - 0.5) * 10,
      boil: 0.8,
      anim: (t) => ({ o: t >= 3.5 + k * 0.2 && (k < 4 || y < camY(t) + 640) ? 1 : 0 }),
    });
  }

  // Trou, pelle, tas de terre
  const T0 = 2.2,
    S0 = Math.round(T0 * FPS),
    T1 = T0 + 3.2;
  P({
    pts: blob(960, 778, 74, 17, 12, 4, 0.06),
    fill: "#33200f",
    lift: 0,
    tin: T0 + 0.33,
    from: [0, 0, 0],
  });
  {
    const POSE = [
      [-30, -10],
      [-70, -6],
      [-88, -4],
      [-88, -4],
      [10, -4],
      [24, -4],
      [24, 6],
      [18, 20],
      [4, 30],
      [-10, 22],
      [-20, 6],
      [-26, -6],
    ];
    const dig = (t, s) => {
      if (t < T0) return { r: -14 };
      if (t >= T1) return { y: 16, r: 9 };
      const [y, r] = POSE[(s - S0) % 12];
      return { y, r };
    };
    const base = {
      pivot: [960, 780],
      anim: dig,
      tin: 1.4,
      from: [120, -160, 40],
      seed: 500,
      boil: 0.8,
      rb: 0.3,
    };
    P({ ...base, pts: rect(951, 540, 18, 196, 1, 1.5), fill: "#b98a55", stock: "kraft", lift: 5 });
    P({ ...base, pts: rect(928, 528, 64, 20, 2, 2), fill: "#d9482f", lift: 5 });
    P({
      ...base,
      pts: [
        [926, 716],
        [994, 716],
        [990, 770],
        [960, 796],
        [930, 770],
      ],
      fill: "#9aa6b2",
      lift: 6,
      extra: (w, h) => `<path d="M${w / 2} 6V${h - 14}" stroke="#6d7884" stroke-width="5"/>`,
    });
  }
  // Mottes qui volent
  for (let i = 0; i < 3; i++)
    P({
      pts: blob(960, 760, 13 + i * 3, 11 + i * 2, 6, i * 9, 0.2),
      fill: ["#6f4a2b", "#5a3a20", "#845a36"][i],
      lift: 4,
      boil: 0,
      anim: (t, s) => {
        const c = (s - S0) % 12;
        if (t < T0 || t >= T1 || c < 7) return { o: 0 };
        const u = (c - 7) / 4;
        return {
          x: (120 + 45 * i) * u,
          y: -Math.sin(u * Math.PI) * (130 + 25 * i) + 26 * u,
          r: u * 220,
        };
      },
    });
  [0, 1, 2].forEach((i) =>
    P({
      pts: blob(1075 + i * 38, 772 - i * 3, 46 + i * 6, 22 + i * 3, 8, i * 21 + 3, 0.16),
      fill: ["#5a3a20", "#6f4a2b", "#845a36"][i],
      stock: "sugar",
      torn: 2,
      deckle: false,
      lift: 3,
      tin: T0 + 0.74 + i * 0.8,
      from: [0, -14, 0],
    }),
  );
  P({
    pts: blob(962, 800, 96, 22, 9, 8, 0.14),
    fill: "#5a3a20",
    stock: "sugar",
    torn: 1,
    deckle: false,
    lift: 3,
    tin: T0 + 0.33,
    from: [0, 10, 0],
  });

  // Titre en lettres découpées
  {
    const COL = [
      ["#e4572e", "#fff6e0"],
      ["#f2b134", INK],
      ["#2f6f8f", "#fff6e0"],
      ["#f7f0dc", INK],
      ["#3a9d6e", "#fff6e0"],
      ["#d9486e", "#fff6e0"],
      ["#2b2b2b", "#ffd84a"],
    ];
    let n = 0;
    ["Qu'y a-t-il", "sous nos pieds ?"].forEach((line, li) => {
      let x = 110 + li * 40;
      const y = 96 + li * 128;
      for (const ch of line) {
        if (ch === " ") {
          x += 44;
          continue;
        }
        const narrow = "'-il".includes(ch);
        const tw = narrow ? 50 : 76,
          th = 102 + (rnd(n) - 0.5) * 10;
        const [bg, fg] = COL[(n * 3 + li) % COL.length];
        const yy = y + (rnd(n + 9) - 0.5) * 14;
        P({
          layer: "sky",
          pts: rect(x, yy, tw, th, n * 5, 4),
          fill: bg,
          stock: n % 3 ? "fine" : "sugar",
          lift: 6,
          rot: (rnd(n + 3) - 0.5) * 11,
          tin: 0.2 + n * 0.067,
          from: [0, -46, 16 * (n % 2 ? 1 : -1)],
          over: (w, h) =>
            `<text x="${w / 2}" y="${h / 2 + 27}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="78" fill="${fg}">${ch}</text>`,
        });
        x += tw + 8;
        n++;
      }
    });
  }

  // Étiquettes
  label(1170, 985, "la terre", { tin: 6.95 });
  label(1170, 1555, "la roche", { tin: 8.75, rot: 2 });
  label(250, 2190, "le manteau", { tin: 10.7, rot: -3, from: [-70, -30, -9] });
  label(1230, 2520, "le noyau", { tin: 11.85, rot: 2 });
  label(1150, 2640, "du métal brûlant !", {
    tin: 12.74,
    rot: -2,
    fs: 44,
    fill: "#2b2b2b",
    ink: "#ffd84a",
  });
  label(1560, 975, "Kidi-science", {
    layer: "fixed",
    fs: 34,
    rot: -2,
    fill: "#2f5bd3",
    ink: "#fff6e0",
  });

  // ---------- caméra et dessin ----------
  function camY(t) {
    return (
      430 * E(t, 6.0, 6.9) +
      650 * E(t, 8.1, 8.85) +
      920 * E(t, 9.9, 11.7) +
      26 * ramp(t, 6.9, 8.1) +
      26 * ramp(t, 8.85, 9.9) +
      34 * ramp(t, 11.7, TOTAL)
    );
  }
  const LAY = [
    ["board", 1],
    ["sky", 0.82],
    ["far", 0.9],
    ["world", 1],
    ["front", 1],
  ].map(([id, k]) => [document.getElementById("L-" + id), k]);
  const grain = document.getElementById("grain"),
    lamp = document.getElementById("lamp");
  const POP = [1, 0.4, -0.08, 0];

  function draw(time) {
    const step = Math.floor(time * FPS + 1e-4);
    const t = step / FPS;
    const cy = camY(t);
    for (const [el, k] of LAY) el.style.transform = `translateY(${f1(-cy * k)}px)`;
    const b = Math.floor(step / 2);
    for (const p of pieces) {
      let x = 0,
        y = 0,
        r = p.rot,
        s = 1,
        o = 1;
      if (p.tin != null) {
        const k = step - Math.round(p.tin * FPS);
        if (k < 0) o = 0;
        else {
          const f = POP[k] ?? 0;
          x += p.from[0] * f;
          y += p.from[1] * f;
          r += p.from[2] * f;
        }
      }
      if (o && p.anim) {
        const a = p.anim(t, step);
        if (a) {
          x += a.x || 0;
          y += a.y || 0;
          r += a.r || 0;
          s *= a.s ?? 1;
          if (a.o != null) o *= a.o;
        }
      }
      if (!o) {
        p.el.style.visibility = "hidden";
        continue;
      }
      x += (rnd(p.seed + b * 3.1) - 0.5) * 2 * p.boil;
      y += (rnd(p.seed + b * 5.3 + 1) - 0.5) * 2 * p.boil;
      r += (rnd(p.seed + b * 7.7 + 2) - 0.5) * 2 * p.rb;
      p.el.style.visibility = "visible";
      p.el.style.transform = `translate(${f1(x)}px,${f1(y)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
    }
    grain.style.transform = `translate(${f1((rnd(step * 1.3) - 0.5) * 100)}px,${f1((rnd(step * 2.1 + 5) - 0.5) * 100)}px)`;
    lamp.style.opacity = (0.93 + rnd(b * 1.9) * 0.07).toFixed(3);
  }

  const tl = gsap.timeline({ paused: true });
  const tick = { v: 0 };
  tl.fromTo(
    tick,
    { v: 0 },
    { v: 1, duration: TOTAL, ease: "none", onUpdate: () => draw(tl.time()) },
    0,
  );
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
  tl.seek(0);
  draw(0);
})();
