// ---------- Scène 1 : la pluie tombe sur la montagne et lui arrache des grains minuscules, dont des sels ----------
(() => {
  const tR = cue("s1-1", "pluie") - 0.4,
    tA = cue("s1-1", "arrache") - 0.5,
    tS = cue("s1-1", "sels") - 0.6;
  onDraw("s1", (t) => {
    let s =
      mountSVG(700, 250, 900, 850) + `<path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
    const r = ramp(t, tR, tR + 0.6);
    s +=
      cloudSVG(600 + 20 * Math.sin(t * 0.6), 190, 1.3, 0.5 * r) +
      cloudSVG(880 + 16 * Math.sin(t * 0.5 + 1), 230, 1.0, 0.5 * r);
    if (r > 0) s += rainSVG(430, 1000, 260, 560, t, 22, r);
    // les filets d'eau qui dévalent, avec leurs grains
    if (t > tA)
      for (let k = 0; k < 3; k++) {
        const x0 = [620, 780, 700][k],
          x1 = [380, 1050, 820][k];
        s += `<path d="M${x0} ${420 + k * 30} Q${(x0 + x1) / 2 + 40} 640 ${x1} 846" fill="none" stroke="${C.air}" stroke-width="10" stroke-linecap="round" stroke-dasharray="24 16" stroke-dashoffset="${f2(-t * 120)}"/>`;
        for (let i = 0; i < 4; i++) {
          const u = (t * 0.35 + i / 4 + k * 0.2) % 1,
            m = 1 - u;
          s += saltSVG(
            m * m * x0 + 2 * m * u * ((x0 + x1) / 2 + 40) + u * u * x1,
            m * m * (420 + k * 30) + 2 * m * u * 640 + u * u * 846,
            7,
            u * 300,
            Math.sin(u * Math.PI),
          );
        }
      }
    // la loupe : une goutte frappe le rocher, des grains se détachent
    const z = ramp(t, tA + 0.2, tA + 0.7);
    if (z > 0) {
      let g = `<circle cx="1420" cy="520" r="230" fill="#fff" class="ink" stroke-width="8"/><clipPath id="s1-z"><circle cx="1420" cy="520" r="224"/></clipPath><g clip-path="url(#s1-z)"><path d="M1160 760 L1700 500 V780 H1160 Z" fill="#9AA6B8" class="ink" stroke-width="5"/>`;
      for (let i = 0; i < 3; i++) {
        const u = (t * 0.9 + i / 3) % 1;
        g +=
          u < 0.6
            ? `<path d="M${1340 + i * 90} ${f2(320 + (u / 0.6) * (250 - i * 44))} q-14 22 0 34 q14 -12 0 -34 Z" fill="${C.air}" class="ink" stroke-width="3"/>`
            : [0, 1, 2]
                .map((j) =>
                  saltSVG(
                    1340 + i * 90 + (j - 1) * (u - 0.6) * 160,
                    590 - i * 44 - Math.sin(((u - 0.6) / 0.4) * Math.PI) * 60 + (u - 0.6) * 60,
                    9,
                    u * 400 + j * 50,
                    1 - (u - 0.6) / 0.4,
                  ),
                )
                .join("");
      }
      g += `</g>`;
      s += `<g opacity="${f2(z)}" transform="translate(${f2(40 * (1 - z))} 0)">${g}</g><path d="M1010 520 L1190 520" class="ink" stroke-width="5" stroke-dasharray="10 10" opacity="${f2(z)}"/>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  const l = label(
    "s1",
    "s1-l",
    [1440, 600],
    [1250, 230],
    "Des grains minuscules",
    "parmi eux : des sels",
  );
  showLabel(l, tS);
  show("#s1-n1", cue("s1-3", "milliards") - 0.8);
})();
