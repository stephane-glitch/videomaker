// ---------- Scène 3 : des clés et des serrures ; une odeur ouvre plusieurs serrures, le cerveau lit la combinaison ----------
(() => {
  const tL = cue("s3-2", "serrure") - 0.4,
    tK = cue("s3-2", "clé") - 0.6,
    tP = cue("s3-2", "plusieurs") - 0.5,
    tB = cue("s3-2", "combinaison") - 0.5,
    tN = cue("s3-3", "trois") - 0.3,
    tMany = cue("s3-4", "milliers") - 0.5;
  const NUM = [3, 7, 12, 25, 40, 58],
    COL = ["#E0455E", "#3DBE8B", "#2F5BD3", "#FF8A1F", "#8E5BD6", "#FFD23F"];
  const ODORS = [
    ["Crêpe", [0, 2, 4]],
    ["Fraise", [0, 3, 5]],
    ["Herbe coupée", [1, 3, 4]],
    ["Chaussette", [1, 2, 5]],
    ["Pluie", [0, 1, 4]],
    ["Chocolat", [2, 3, 5]],
  ];
  const shape = (i, r) =>
    [
      `<circle r="${r}"/>`,
      `<rect x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}" rx="4"/>`,
      `<path d="M0 ${-r * 1.15} L${r * 1.1} ${r * 0.8} H${-r * 1.1} Z"/>`,
      `<path d="M0 ${-r * 1.2} L${r * 1.1} 0 L0 ${r * 1.2} L${-r * 1.1} 0 Z"/>`,
      `<path d="M${-r} ${-r * 0.5} L0 ${-r * 1.15} L${r} ${-r * 0.5} V${r} H${-r} Z"/>`,
      `<ellipse rx="${r * 1.25}" ry="${r * 0.75}"/>`,
    ][i];
  onDraw("s3", (t) => {
    const many = t > tMany,
      idx = many ? 1 + (Math.floor((t - tMany) / 0.75) % 5) : 0,
      [name, on] = ODORS[idx];
    const lit = (i) =>
      on.includes(i)
        ? ramp(
            t,
            (many ? tMany : tP) + 0.15 * on.indexOf(i),
            (many ? tMany : tP) + 0.4 + 0.15 * on.indexOf(i),
          )
        : 0;
    let s = "";
    // la question de Zoé : une crêpe ou une chaussette ?
    const q = 1 - ramp(t, tL - 0.3, tL);
    if (q > 0)
      s += `<g opacity="${f2(q)}"><ellipse cx="600" cy="${f2(560 + 10 * Math.sin(t * 3))}" rx="190" ry="34" fill="#EBC07E" class="ink" stroke-width="5"/><g transform="translate(1300 ${f2(560 + 10 * Math.cos(t * 3))}) rotate(-10)"><path d="M-30 -110 H40 V0 Q40 40 80 50 Q130 60 120 100 H0 Q-40 100 -36 50 Z" fill="#8FD3FF" class="ink" stroke-width="5"/><path d="M-30 -80 H40" stroke="#fff" stroke-width="12"/></g>${txt(960, 620 + 8 * Math.sin(t * 5), "?", 220, { w: 700, fill: C.fire })}</g>`;
    for (let i = 0; i < 6; i++) {
      const x = 280 + i * 200,
        a = ramp(t, tL + i * 0.08, tL + 0.3 + i * 0.08),
        g = lit(i);
      if (a <= 0) continue;
      // la serrure : un socle avec une empreinte
      s += `<g transform="translate(${x} ${f2(660 + 30 * (1 - a))})" opacity="${f2(a)}"><rect x="-76" y="-70" width="152" height="170" rx="26" fill="${mixHex("#FFFFFF", "#FFE14D", g)}" class="ink" stroke-width="5"/><g fill="${C.ink}" opacity="0.85" transform="translate(0 -6)">${shape(i, 30)}</g>${txt(0, 86, "n° " + NUM[i], 30, { w: 700 })}</g>`;
      // la clé : une molécule de la bonne forme, qui descend et s'emboîte
      if (on.includes(i) && t > tK) {
        const d = ramp(
          t,
          (many ? tMany - 0.2 : tK) + 0.12 * on.indexOf(i),
          (many ? tMany + 0.2 : tP) + 0.12 * on.indexOf(i),
        );
        s += `<g transform="translate(${f2(x + 40 * Math.sin(t * 3 + i) * (1 - d))} ${f2(lerp(300, 654, d))}) rotate(${f2(200 * (1 - d))})" fill="${COL[i]}" stroke="${C.ink}" stroke-width="4">${shape(i, 28)}</g>`;
      }
    }
    // le cerveau lit la combinaison
    const b = ramp(t, tB, tB + 0.4);
    if (b > 0) {
      s += `<g opacity="${f2(b)}" transform="translate(1580 ${f2(520 + 8 * Math.sin(t * 2))})"><path d="M-110 20 C -150 -40, -110 -110, -40 -100 C -10 -150, 80 -140, 96 -84 C 150 -70, 160 10, 110 40 C 100 90, 20 100, -10 70 C -60 100, -120 70, -110 20 Z" fill="#F7A8B8" class="ink" stroke-width="5"/><path d="M-40 -100 C -20 -60, -50 -30, -20 0 M96 -84 C 60 -60, 80 -20, 40 0" fill="none" class="ink" stroke-width="4"/></g>`;
      s += txt(1580, 720, name + " !", 60, { w: 700, fill: C.blue, op: b });
      if (t > tN)
        s += txt(1580, 790, "code : " + on.map((i) => NUM[i]).join(" · "), 38, {
          w: 600,
          op: ramp(t, tN, tN + 0.3),
        });
    }
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", cue("s3-2", "quatre") - 0.3);
  pop("#s3-n2", tB + 0.5);
})();
