// ---------- Scène 3 : bleu en bas, jaune en haut ; la flamme monte ; dans l'espace, une boule bleue ----------
(() => {
  const tB = cue("s3-2", "bleu") - 0.4,
    tS = cue("s3-2", "suie") - 0.6,
    tY = cue("s3-2", "brillent") - 0.5,
    tUp = cue("s3-4", "monte") - 1.6,
    tSp = cue("s3-5", "espace") - 0.5;
  const X = 620,
    Y = 800;
  onDraw("s3", (t) => {
    let s = `<path d="M${X} ${Y + 40} V${Y - 30}" stroke="${C.ink}" stroke-width="16" stroke-linecap="round"/><rect x="${X - 130}" y="${Y + 30}" width="260" height="40" rx="14" fill="#FBF1D8" class="ink" stroke-width="5"/>`;
    s += flameSVG(X, Y - 10, 560, t * 0.7);
    // le bas bleu mis en avant
    const hb = ramp(t, tB, tB + 0.4) * (1 - ramp(t, tS, tS + 0.4));
    if (hb > 0)
      s += `<ellipse cx="${X}" cy="${Y - 70}" rx="${f2(130 + 8 * Math.sin(t * 6))}" ry="90" fill="none" stroke="${C.blue}" stroke-width="8" stroke-dasharray="18 14" opacity="${f2(hb)}"/>`;
    // les grains de suie : noirs, puis brillants
    if (t > tS)
      for (let i = 0; i < 16; i++) {
        const u = (t * 0.35 + rnd(i)) % 1,
          glow = ramp(t, tY, tY + 0.6);
        const x = X + (rnd(i + 30) - 0.5) * 150 * (1 - u),
          y = Y - 170 - u * 300;
        s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(7 + 4 * glow)}" fill="${mixHex("#1F2A44", "#FFF6B0", glow)}" stroke="${glow > 0.5 ? C.fire : C.ink}" stroke-width="2.5" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
      }
    // l'air chaud monte
    const up = ramp(t, tUp, tUp + 0.5) * (1 - ramp(t, tSp - 0.3, tSp));
    if (up > 0)
      for (let i = 0; i < 4; i++) {
        const u = (t * 0.5 + i / 4) % 1,
          x = X + (i < 2 ? -250 - i * 70 : 250 + (i - 2) * 70);
        s += arrowSVG(
          x,
          Y - 80 - u * 300,
          x,
          Y - 220 - u * 300,
          C.fire,
          12,
          up * Math.sin(u * Math.PI),
        );
      }
    // dans la station spatiale
    const sp = ramp(t, tSp, tSp + 0.5);
    if (sp > 0) {
      let g = `<rect x="1160" y="280" width="600" height="520" rx="40" fill="#1B2445" class="ink" stroke-width="6"/>`;
      for (let i = 0; i < 26; i++)
        g += `<circle cx="${f2(1180 + rnd(i) * 560)}" cy="${f2(300 + rnd(i + 50) * 480)}" r="${f2(2 + rnd(i + 9) * 2.5)}" fill="#fff" opacity="${f2(0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i)))}"/>`;
      const fy = 560 + 10 * Math.sin(t * 1.4),
        r = 92 + 5 * Math.sin(t * 7);
      g += `<path d="M1460 ${fy + 130} V${fy + 30}" stroke="#D9DEE8" stroke-width="12" stroke-linecap="round"/><circle cx="1460" cy="${f2(fy)}" r="${f2(r + 26)}" fill="#5F86F0" opacity="0.3"/><circle cx="1460" cy="${f2(fy)}" r="${f2(r)}" fill="#5F86F0" stroke="#BFD4FF" stroke-width="5"/><circle cx="1460" cy="${f2(fy)}" r="${f2(r * 0.55)}" fill="#BFD4FF"/>`;
      s += `<g opacity="${f2(sp)}" transform="translate(0 ${f2(30 * (1 - sp))})">${g}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  const l1 = label(
    "s3",
    "s3-l1",
    [X + 70, Y - 60],
    [1010, 700],
    "Bleu",
    "le gaz brûle très bien : très chaud",
  );
  const l2 = label(
    "s3",
    "s3-l2",
    [X + 60, Y - 360],
    [1010, 420],
    "Jaune",
    "des grains de suie qui brillent",
  );
  showLabel(l1, tB + 0.1);
  showLabel(l2, tY + 0.2);
  [l1, l2].forEach((l) => hideLabel(l, tSp - 0.3));
  show("#s3-n1", tUp + 0.6);
  show("#s3-n2", cue("s3-6", "boule") - 0.4);
})();
