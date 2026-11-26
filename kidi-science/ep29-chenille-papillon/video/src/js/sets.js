/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs */
// Décors peints : quatre ou cinq plans d'aquarelle et de gouache par décor, du plus lointain au plus proche.
{
  const bl = (cx, cy, rx, ry, n, seed, jag = 0.18) => {
    // tache arrondie irrégulière
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU,
        r = 1 + (rnd(seed + i) - 0.5) * 2 * jag;
      p.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
    }
    let d = `M${f1((p[0][0] + p[n - 1][0]) / 2)} ${f1((p[0][1] + p[n - 1][1]) / 2)}`;
    for (let i = 0; i < n; i++) {
      const q = p[(i + 1) % n];
      d += `Q${f1(p[i][0])} ${f1(p[i][1])} ${f1((p[i][0] + q[0]) / 2)} ${f1((p[i][1] + q[1]) / 2)}`;
    }
    return d + "Z";
  };
  const grad = (id, stops, x2 = 0.3, y2 = 1) =>
    `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient></defs>`;
  const many = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join("");
  const pick = (arr, i) => arr[Math.floor(rnd(i) * arr.length) % arr.length];

  // ----- La prairie (plan large) -----
  const meadow = (sd, P) => [
    [
      0.12,
      grad("g", P.sky) +
        `<g filter="url(#wc)"><rect x="-40" y="-40" width="${BW + 80}" height="${BH + 80}" fill="url(#g)"/></g>` +
        `<g filter="url(#wc)" opacity=".8">${many(5, (i) => `<path d="${bl(200 + i * 480 + rnd(sd + i) * 200, 170 + rnd(sd + i + 9) * 220, 260, 70, 9, sd + i * 7, 0.3)}" fill="${P.cloud}"/>`)}</g>`,
    ],
    [
      0.25,
      `<g filter="url(#wcfar)">${many(9, (i) => `<path d="${bl(i * 290 + rnd(sd + i) * 120, 640 + rnd(sd + i + 3) * 60, 230, 250, 9, sd + i * 5, 0.2)}" fill="${pick(P.far, sd + i)}"/>`)}<rect x="-40" y="760" width="${BW + 80}" height="600" fill="${P.far[0]}"/></g>`,
    ],
    [
      0.5,
      `<g filter="url(#wc)">${many(8, (i) => `<path d="${bl(i * 330 + rnd(sd + i + 20) * 160, 860 + rnd(sd + i + 23) * 50, 250, 190, 10, sd + i * 3 + 40, 0.22)}" fill="${pick(P.mid, sd + i + 5)}"/>`)}<rect x="-40" y="930" width="${BW + 80}" height="420" fill="${P.mid[0]}"/></g>` +
        `<g filter="url(#dry)">${many(260, (i) => {
          const x = rnd(sd + i * 2.1) * BW,
            y = 720 + rnd(sd + i * 3.3) * 330;
          return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(16 + rnd(i) * 22)}" ry="${f1(7 + rnd(i + 1) * 8)}" transform="rotate(${f1(rnd(i + 2) * 180)} ${f1(x)} ${f1(y)})" fill="${pick(P.dab, i)}" opacity=".7"/>`;
        })}</g>`,
    ],
    [
      0.8,
      grad("gr", P.grass, 0, 1) +
        `<g filter="url(#wc)"><path d="M-40 1010Q500 950 1150 1000T${BW + 40} 980V${BH + 60}H-40Z" fill="url(#gr)"/></g>` +
        `<g filter="url(#dry)">${many(240, (i) => {
          const x = rnd(sd + i * 1.7) * BW,
            y = 1000 + rnd(sd + i * 2.9) * 280,
            h = 50 + rnd(i) * 90,
            b = (rnd(i + 4) - 0.5) * 50;
          return `<path d="M${f1(x)} ${f1(y)}q${f1(b * 0.3)} ${f1(-h * 0.6)} ${f1(b)} ${f1(-h)}" stroke="${pick(P.blade, i)}" stroke-width="${f1(5 + rnd(i + 8) * 6)}" fill="none" stroke-linecap="round"/>`;
        })}</g>` +
        `<g filter="url(#wc)">${many(46, (i) => `<circle cx="${f1(rnd(sd + i * 5.1) * BW)}" cy="${f1(1000 + rnd(sd + i * 6.3) * 250)}" r="${f1(9 + rnd(i) * 9)}" fill="${pick(P.dot, i)}"/>`)}</g>`,
    ],
    [
      1.3,
      `<g filter="url(#soft)">${many(7, (i) => `<path d="${leafD(520, 120)}" transform="translate(${[60, 330, 2240, 2010, 150, 2180, 1900][i]} ${[90, 30, 110, 40, 1230, 1200, 1270][i]}) rotate(${[28, -12, 150, 190, -22, 200, 172][i]})" fill="${P.fg}" opacity=".92"/>`)}</g>`,
    ],
  ];

  // ----- Le gros plan : fond flou de verdure, comme vu de tout près -----
  const macro = (sd, P) => [
    [
      0.1,
      grad("g", P.wash, 0.6, 1) +
        `<g filter="url(#wc)"><rect x="-40" y="-40" width="${BW + 80}" height="${BH + 80}" fill="url(#g)"/></g>`,
    ],
    [
      0.22,
      `<g filter="url(#bokeh)">${many(54, (i) => `<circle cx="${f1(rnd(sd + i * 1.9) * BW)}" cy="${f1(rnd(sd + i * 2.7) * BH)}" r="${f1(50 + rnd(i + sd) * 130)}" fill="${pick(P.spots, sd + i)}" opacity="${f1(0.22 + rnd(i + 3) * 0.3)}"/>`)}</g>`,
    ],
    [
      0.45,
      `<g filter="url(#wcfar)">${many(9, (i) => `<path d="${leafD(620 + rnd(i + sd) * 300, 150 + rnd(i) * 60)}" transform="translate(${f1(rnd(sd + i * 4.1) * BW)} ${f1(rnd(sd + i * 5.3) * BH)}) rotate(${f1(rnd(sd + i) * 360)})" fill="${pick(P.leaves, sd + i)}" opacity=".7"/>`)}</g>` +
        `<g filter="url(#wc)" opacity=".5">${many(26, (i) => `<circle cx="${f1(rnd(sd + i * 7.9) * BW)}" cy="${f1(rnd(sd + i * 8.7) * BH)}" r="${f1(8 + rnd(i) * 14)}" fill="${P.light}"/>`)}</g>`,
    ],
    [
      1.3,
      `<g filter="url(#soft)">${many(5, (i) => `<path d="${leafD(640, 150)}" transform="translate(${[40, 2260, 2200, 90, 1150][i]} ${[70, 60, 1240, 1260, 1330][i]}) rotate(${[30, 150, 200, -25, 4][i]})" fill="${P.fg}" opacity=".9"/>`)}</g>`,
    ],
  ];

  const DAY = {
    sky: [
      [0, "#fde9b0"],
      [0.5, "#cfe8d2"],
      [1, "#a6d5d8"],
    ],
    cloud: "#fffaf0",
    far: ["#a9cfae", "#bcdcb4", "#96c4a8"],
    mid: ["#79b86a", "#8cc474", "#69aa62"],
    dab: ["#a6d67e", "#5c9c56", "#c4e392", "#4f8f50"],
    grass: [
      [0, "#8ccb62"],
      [1, "#4f9a4a"],
    ],
    blade: ["#3f8a40", "#6fba54", "#a9de7a"],
    dot: ["#f7a8b8", "#fff6dc", "#f4d03f", "#f08a5d"],
    fg: "#27543a",
  };
  const DUSK = {
    ...DAY,
    sky: [
      [0, "#f9c79a"],
      [0.5, "#f3b3a6"],
      [1, "#9fb7d8"],
    ],
    cloud: "#ffe9d6",
    far: ["#b3b7c9", "#c4bcc9", "#a3adc4"],
    mid: ["#6f9f7a", "#7fae7c", "#5f8f72"],
    fg: "#1f3d38",
  };
  const GREEN = {
    wash: [
      [0, "#e9f3b4"],
      [0.5, "#a9d68a"],
      [1, "#5fa97a"],
    ],
    spots: ["#fff6c4", "#d6f0a0", "#8fd08a", "#f9e79f"],
    leaves: ["#5fa55a", "#7fbf68", "#4a8f58"],
    light: "#fffbe0",
    fg: "#24503a",
  };
  const WARM = {
    wash: [
      [0, "#fdeeb8"],
      [0.5, "#cde3a0"],
      [1, "#7fbd8f"],
    ],
    spots: ["#fff6c4", "#ffe0a0", "#b9e08a", "#fbd3b0"],
    leaves: ["#6aae62", "#8fc873", "#559a5c"],
    light: "#fffbe0",
    fg: "#2a5a3c",
  };
  const NIGHT = {
    wash: [
      [0, "#2f3f78"],
      [0.5, "#2b4a7a"],
      [1, "#1f3558"],
    ],
    spots: ["#5f7fc0", "#44609f", "#8fb0e0", "#3a5590"],
    leaves: ["#27507a", "#2f6080", "#1f456a"],
    light: "#eef4ff",
    fg: "#101f3a",
  };

  mkSet("meadow", meadow(3, DAY));
  mkSet("dusk", meadow(3, DUSK));
  mkSet("macroA", macro(11, GREEN));
  mkSet("macroB", macro(47, WARM));
  mkSet("branch", macro(83, WARM));
  mkSet("night", macro(83, NIGHT));
}
