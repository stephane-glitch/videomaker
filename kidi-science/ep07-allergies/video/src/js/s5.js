// ---------- Scène 5 : bloquer l'histamine (médicament), puis l'école des globules blancs (désensibilisation) ----------
(() => {
  const tMed = cue("s5-2", "médicament") - 0.5,
    tTr = cue("s5-2", "entraîne") - 0.6;
  const t1 = cue("s5-2", "petit") - 0.3,
    t2 = cue("s5-2", "plus") - 0.3,
    t3 = cue("s5-2", "années") - 0.3,
    tOK = cue("s5-2", "comprendre");
  const tSch = cue("s5-3", "école") - 0.3;
  const MX = 640,
    MY = 520,
    MR = 150;
  onDraw("s5", (t) => {
    const b = ramp(t, tTr, tTr + 0.6);
    let s = "";
    if (b < 1) {
      // l'histamine sort de la cellule… jusqu'à ce que le médicament fasse barrage
      const med = ramp(t, tMed, tMed + 0.6);
      let g = mastSVG(MX, MY, MR, t, 0, 8);
      for (let i = 0; i < 22; i++) {
        const u = (t * 0.35 + rnd(i)) % 1,
          a = rnd(i + 50) * TAU,
          far = MR + 20 + u * 420,
          lim = MR + 130;
        const d = med > 0 ? Math.min(far, lerp(far, lim, med)) : far;
        g += `<circle cx="${f2(MX + d * Math.cos(a))}" cy="${f2(MY + d * Math.sin(a))}" r="12" fill="${C.fire}" stroke="${C.ink}" stroke-width="3" opacity="${f2((1 - u) * (far > lim ? 1 - 0.8 * med : 1))}"/>`;
      }
      if (med > 0) {
        g += `<circle cx="${MX}" cy="${MY}" r="${MR + 150}" fill="none" stroke="${C.blue}" stroke-width="16" stroke-dasharray="60 24" stroke-dashoffset="${f2(t * 40)}" opacity="${f2(med)}"/>`;
        g += `<g transform="translate(1320 ${MY}) rotate(-24) scale(${f2(med)})"><rect x="-130" y="-56" width="260" height="112" rx="56" fill="#fff" class="ink" stroke-width="6"/><path d="M0 -56 H74 A56 56 0 0 1 74 56 H0 Z" fill="${C.blue}" class="ink" stroke-width="6"/></g>`;
      }
      s += `<g opacity="${f2(1 - b)}">${g}</g>`;
    }
    if (b > 0) {
      // la classe : trois gardes regardent le tableau, où l'on montre de plus en plus de pollen
      const calm = ramp(t, t2, tOK),
        n = t < t1 ? 0 : t < t2 ? 1 : t < t3 ? 3 : 6;
      let g = `<rect x="1020" y="270" width="700" height="400" rx="18" fill="#2E6B4F" stroke="#B9772E" stroke-width="16"/>`;
      if (t > tSch) g += txt(1370, 340, "École des globules blancs", 40, { fill: "#fff" });
      for (let i = 0; i < n; i++) {
        const k = ramp(
          t,
          [t1, t2, t2, t3, t3, t3][i] + (i % 3) * 0.12,
          [t1, t2, t2, t3, t3, t3][i] + 0.4 + (i % 3) * 0.12,
        );
        g += `<g transform="translate(${1170 + (i % 3) * 200} ${440 + Math.floor(i / 3) * 140}) scale(${f2(k)})">${pollenSVG(0, 0, 36, 0.3 * i)}</g>`;
      }
      for (let i = 0; i < 3; i++)
        g += guardSVG(
          330 + i * 220,
          560 + 6 * Math.sin(t * 2 + i),
          84,
          t + i,
          calm < 0.4 + i * 0.25 ? 1 : 0,
          1,
        );
      g += `<path d="M150 660 H920" class="ink" stroke-width="6"/>`;
      // la frise des années
      const yr = ramp(t, t1, tOK);
      g += `<rect x="330" y="760" width="1260" height="26" rx="13" fill="#fff" class="ink" stroke-width="4"/><rect x="330" y="760" width="${f2(1260 * yr)}" height="26" rx="13" fill="${C.blue}"/>`;
      ["Année 1", "Année 2", "Année 3"].forEach(
        (l, i) => (g += txt(330 + 210 + i * 420, 830, l, 30, { op: yr > (i + 0.3) / 3 ? 1 : 0.3 })),
      );
      s += `<g opacity="${f2(b)}">${g}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tMed + 0.5);
  tl.to("#s5-n1", { opacity: 0, duration: 0.3 }, tTr - 0.3);
  show("#s5-n2", t1 + 0.2);
  pop("#s5-n3", cue("s5-4", "désensibilisation") - 0.4);
})();
