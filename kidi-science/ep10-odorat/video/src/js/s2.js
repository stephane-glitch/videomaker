// ---------- Scène 2 : tout en haut du nez, le tapis de capteurs, leurs cils et le mucus ----------
(() => {
  const tT = cue("s2-2", "tapis") - 0.4,
    tZ = cue("s2-2", "capteurs") - 0.8,
    tC = cue("s2-2", "cils") - 0.4,
    tMu = cue("s2-2", "mucus") - 0.5,
    tA = cue("s2-4", "attrape") - 0.4;
  const HX = 600,
    HY = 560;
  const P = [
    [HX - 296, HY + 10],
    [HX - 220, HY - 30],
    [HX - 170, HY - 80],
    [HX - 110, HY - 118],
    [HX - 40, HY - 124],
  ];
  onDraw("s2", (t) => {
    let s = headCutSVG(HX, HY, 1);
    // l'air entre par la narine et monte jusqu'au tapis
    for (let i = 0; i < 7; i++) {
      const u = (t * 0.25 + i / 7) % 1,
        [x, y] = along(P, u);
      s += molSVG(
        x - 120 * (1 - Math.min(1, u * 5)),
        y + 6 * Math.sin(t * 4 + i),
        7,
        C.fire,
        t * 60 + i * 50,
        Math.min(1, u * 6) * Math.min(1, (1 - u) * 6),
      );
    }
    const hl = ramp(t, tT, tT + 0.4) * (1 - ramp(t, tZ + 0.5, tZ + 0.9));
    if (hl > 0)
      s += `<ellipse cx="${HX - 62}" cy="${HY - 124}" rx="${f2(104 + 6 * Math.sin(t * 6))}" ry="44" fill="none" stroke="${C.blue}" stroke-width="7" stroke-dasharray="16 12" opacity="${f2(hl)}"/>`;
    // le gros plan : les capteurs, leurs cils, le mucus
    const z = ramp(t, tZ, tZ + 0.5);
    if (z > 0) {
      const X0 = 1080,
        W = 660,
        Y0 = 300;
      let g = `<rect x="${X0}" y="${Y0}" width="${W}" height="480" rx="34" fill="#fff" class="ink" stroke-width="6"/><clipPath id="s2-c"><rect x="${X0 + 6}" y="${Y0 + 6}" width="${W - 12}" height="468" rx="30"/></clipPath><g clip-path="url(#s2-c)"><rect x="${X0}" y="${Y0}" width="${W}" height="250" fill="#F7B9B0"/>`;
      const mu = ramp(t, tMu, tMu + 0.5);
      g += `<path d="M${X0} ${Y0 + 250} q55 ${f2(14 * Math.sin(t * 2))} 110 0 t110 0 t110 0 t110 0 t110 0 t110 0 V${Y0 + 480} H${X0} Z" fill="${mixHex("#EAF6FF", "#CDEFB4", mu)}"/>`;
      const cil = ramp(t, tC, tC + 0.5);
      for (let i = 0; i < 6; i++) {
        const x = X0 + 70 + i * 104;
        g += `<path d="M${x - 26} ${Y0 - 10} V${Y0 + 200} Q${x - 26} ${Y0 + 250} ${x} ${Y0 + 250} Q${x + 26} ${Y0 + 250} ${x + 26} ${Y0 + 200} V${Y0 - 10} Z" fill="${C.hot}" class="ink" stroke-width="4"/><circle cx="${x}" cy="${Y0 + 150}" r="14" fill="#B88A00"/>`;
        if (cil > 0)
          for (let j = -2; j <= 2; j++)
            g += `<path d="M${x + j * 8} ${Y0 + 250} q${f2(j * 6 + 10 * Math.sin(t * 3 + i + j))} ${f2(50 * cil)} ${f2(j * 12)} ${f2(100 * cil)}" fill="none" class="ink" stroke-width="4" stroke-linecap="round"/>`;
      }
      // les molécules prises dans le mucus dérivent vers les cils
      const cap = ramp(t, tA, tA + 0.5);
      for (let i = 0; i < 7; i++) {
        const u = (t * 0.2 + i / 7) % 1;
        g += molSVG(
          X0 + 40 + ((i * 97 + u * 200) % (W - 80)),
          lerp(Y0 + 450, Y0 + 330, u * (0.4 + 0.6 * cap)) + 8 * Math.sin(t * 3 + i),
          10,
          C.fire,
          t * 40 + i * 60,
        );
      }
      g += `</g>`;
      s += `<g opacity="${f2(z)}" transform="translate(${f2(40 * (1 - z))} 0)">${g}</g><path d="M${HX + 50} ${HY - 130} L1076 420" class="ink" stroke-width="4" stroke-dasharray="10 10" opacity="${f2(z)}"/>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  const l1 = label(
    "s2",
    "s2-l1",
    [HX - 60, HY - 128],
    [150, 190],
    "Le tapis de l’odorat",
    "grand comme un timbre",
  );
  showLabel(l1, cue("s2-2", "timbre") - 0.4);
  const l2 = label("s2", "s2-l2", [1150, 400], [1100, 190], "Les capteurs", "des millions");
  const l3 = label(
    "s2",
    "s2-l3",
    [1500, 600],
    [1500, 830],
    "Les cils",
    "ils trempent dans le mucus",
  );
  showLabel(l2, tZ + 0.5);
  showLabel(l3, tC + 0.4);
  show("#s2-n1", tA + 0.3);
})();
