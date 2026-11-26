// ---------- Scène 2 : une météorite large comme une ville s'écrase vers l'actuel Mexique ; un cratère de près de 200 km ----------
(() => {
  const tMe = cue("s2-1", "météorite") - 0.6,
    tVi = cue("s2-1", "ville") - 0.6,
    tEc = cue("s2-1", "écrasée") - 0.3,
    tMx = cue("s2-1", "Mexique") - 0.6,
    tTr = cue("s2-2", "trou") - 0.8,
    tDe = cue("s2-3", "deux") - 0.6;
  onDraw("s2", (t) => {
    const tr = ramp(t, tTr, tTr + 0.5);
    let s = nightSkySVG(130, 190, 1660, 660, t, 26);
    if (tr < 1) {
      const u = clamp(lin(t, tMe, tEc, 0, 1), 0, 1),
        mx = lerp(1560, 760, u * u),
        my = lerp(290, 520, u * u),
        hit = t > tEc;
      let g =
        `<clipPath id="s2-e"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s2-e)">` +
        earthSVG(600, 620, 220, 20 + t * 2);
      if (!hit) {
        g += meteorSVG(mx, my, 44, -0.29, 300);
        const vi = ramp(t, tVi, tVi + 0.3);
        if (vi > 0)
          g += `<g opacity="${f2(vi)}" transform="translate(${f2(mx - 30)} ${f2(my + 130)})"><path d="M-40 0 V-30 H-20 V-50 H0 V-20 H18 V-40 H38 V0 Z" fill="#fff" class="ink" stroke-width="3"/>${txt(0, 50, "large comme une ville", 38, { w: 700, fill: "#fff" })}</g>`;
      } else {
        const e = t - tEc;
        g += `<circle cx="760" cy="520" r="${f2(40 + 420 * (1 - Math.exp(-e * 2.2)))}" fill="#FFF6B0" opacity="${f2(0.95 * Math.exp(-e * 1.6))}"/><circle cx="760" cy="520" r="${f2(30 + 16 * Math.sin(t * 9))}" fill="${C.fire}" class="ink" stroke-width="4"/>`;
        for (let i = 0; i < 12; i++) {
          const a = rnd(i) * TAU,
            d = 60 + ((e * 160 * (0.5 + rnd(i + 5))) % 300);
          g += `<circle cx="${f2(760 + d * Math.cos(a))}" cy="${f2(520 + d * Math.sin(a))}" r="${f2(5 + 6 * rnd(i + 2))}" fill="#8A5A2B" opacity="${f2(1 - d / 360)}"/>`;
        }
        const m = ramp(t, tMx, tMx + 0.3);
        if (m > 0)
          g +=
            arrowSVG(1080, 400, 830, 500, "#fff", 10, m) +
            txt(1240, 390, "le Mexique d’aujourd’hui", 44, { w: 700, fill: "#fff", op: m });
      }
      s += `<g opacity="${f2(1 - tr)}">${g}</g></g>`;
    }
    if (tr > 0) {
      // le cratère, vu en coupe
      const de = ramp(t, tDe, tDe + 0.5);
      let g = `<clipPath id="s2-c"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s2-c)"><path d="M130 560 H520 Q560 520 600 560 Q960 800 1320 560 Q1360 520 1400 560 H1790 V860 H130 Z" fill="#B58A5A" class="ink" stroke-width="5"/><path d="M640 590 Q960 770 1280 590" fill="none" stroke="#8A5A2B" stroke-width="8" opacity="0.6"/>`;
      for (let i = 0; i < 6; i++) {
        const y = (t * 40 + i * 50) % 300;
        g += `<circle cx="${f2(760 + i * 80 + 20 * Math.sin(t + i))}" cy="${f2(600 - y)}" r="${f2(20 + y * 0.1)}" fill="#A7AFBA" opacity="${f2(0.5 * (1 - y / 300))}"/>`;
      }
      g += `</g>`;
      if (de > 0)
        g +=
          arrowSVG(960, 470, lerp(960, 560, de), 470, C.hot, 14, de) +
          arrowSVG(960, 470, lerp(960, 1360, de), 470, C.hot, 14, de) +
          txt(960, 430, "près de 200 km", 64, { w: 700, fill: C.hot, op: de });
      s += `<g opacity="${f2(tr)}">${g}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tVi + 0.5);
  show("#s2-n2", tDe + 0.5);
})();
