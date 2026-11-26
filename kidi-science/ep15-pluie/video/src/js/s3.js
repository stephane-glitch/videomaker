// ---------- Scène 3 : les gouttelettes se collent et grossissent : la pluie ; s'il fait très froid : la neige ; le nuage gris ----------
(() => {
  const tCo = cue("s3-2", "cognent") - 0.5,
    tGr = cue("s3-2", "grossissent") - 0.5,
    tMi = cue("s3-2", "million") - 0.4,
    tTo = cue("s3-4", "tombe") - 0.4,
    tNe = cue("s3-4", "neige") - 1.6,
    tGy = cue("s3-5", "gris") - 0.6,
    tEp = cue("s3-6", "épais") - 0.4;
  const flake = (x, y, r, rot, op) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})" stroke="${C.blue}" stroke-width="${f2(r * 0.22)}" stroke-linecap="round" opacity="${f2(op)}"><path d="M${-r} 0 H${r} M${-r * 0.5} ${-r * 0.87} L${r * 0.5} ${r * 0.87} M${r * 0.5} ${-r * 0.87} L${-r * 0.5} ${r * 0.87}"/></g>`;
  onDraw("s3", (t) => {
    const gy = ramp(t, tGy, tGy + 0.6);
    let g = `<path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
    // l'intérieur du nuage : les gouttelettes se rejoignent en paquets de plus en plus gros
    const mg = ramp(t, tCo, tGr + 1.2),
      big = ramp(t, tGr, tMi + 0.6);
    g += `<g opacity="0.35">${cloudSVG(760, 380, 2.6)}</g>`;
    for (let c = 0; c < 9; c++) {
      const cx = 420 + (c % 3) * 330 + 30 * Math.sin(t * 0.8 + c),
        cy = 250 + Math.floor(c / 3) * 90 + 16 * Math.cos(t * 0.9 + c);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU + c,
          d = 70 * (1 - mg);
        g += dropletSVG(
          cx + d * Math.cos(a + t * 0.6),
          cy + d * 0.6 * Math.sin(a + t * 0.6),
          7 * (1 - 0.6 * mg),
          1 - 0.8 * mg,
        );
      }
      if (mg > 0.3) g += dropletSVG(cx, cy, 8 + 18 * mg * (0.5 + 0.5 * big), ramp(mg, 0.3, 0.7));
    }
    const mi = ramp(t, tMi, tMi + 0.3) * (1 - ramp(t, tNe, tNe + 0.4));
    if (mi > 0)
      g += `<g transform="translate(1380 420) rotate(-5) scale(${f2(mi * (1 + 0.04 * Math.sin(t * 6)))})">${txt(0, 0, "× 1 000 000", 96, { w: 700, fill: "#C25E00" })}</g>`;
    // la pluie
    const rn = ramp(t, tTo, tTo + 0.4);
    if (rn > 0)
      for (let i = 0; i < 14; i++) {
        const u = (t * 0.9 + rnd(i)) % 1,
          x = 330 + rnd(i + 20) * 520;
        g += `<path d="M${f2(x)} ${f2(500 + u * 330)} q-14 24 0 36 q14 -12 0 -36 Z" fill="#5FB4F0" class="ink" stroke-width="3" opacity="${f2(rn * (1 - u * 0.3))}"/>`;
      }
    // la neige, côté froid
    const ne = ramp(t, tNe, tNe + 0.5);
    if (ne > 0)
      for (let i = 0; i < 12; i++) {
        const u = (t * 0.3 + rnd(i + 60)) % 1;
        g += flake(
          980 + rnd(i + 80) * 400 + 26 * Math.sin(t * 2 + i),
          500 + u * 330,
          16 + 8 * rnd(i),
          t * 40 + i * 30,
          ne * (1 - u * 0.3),
        );
      }
    let s = `<g opacity="${f2(1 - gy)}">${g}</g>`;
    // le nuage gris : épais, la lumière ne le traverse plus
    if (gy > 0) {
      const ep = ramp(t, tEp, tEp + 0.6);
      let h =
        `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` +
        sunSVG(960, 210, 70, t) +
        figSVG(960, 848, 1.6, C.blue);
      h +=
        cloudSVG(960, 500, 2.8, 0.25 + 0.75 * ep) +
        `<g opacity="${f2(ep)}">${cloudSVG(960, 560, 2.4, 1)}</g>`;
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.7 + i / 5) % 1;
        h += `<path d="M${800 + i * 80} ${f2(280 + u * 90)} v40" stroke="${C.hot}" stroke-width="10" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
      }
      h += `<ellipse cx="960" cy="850" rx="520" ry="34" fill="#1F2A44" opacity="${f2(0.3 * ep)}"/>`;
      s += `<g opacity="${f2(gy)}">${h}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tMi + 0.5);
  tl.to("#s3-n1", { opacity: 0, duration: 0.3 }, tGy);
  show("#s3-n2", tEp + 0.5);
})();
