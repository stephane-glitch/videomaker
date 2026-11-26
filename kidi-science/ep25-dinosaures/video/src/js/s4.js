// ---------- Scène 4 : les petits animaux survivent : de petits mammifères dans leurs terriers, nos lointains ancêtres ----------
(() => {
  const tPe = cue("s4-2", "petits") - 0.5,
    tTe = cue("s4-2", "terriers") - 0.8,
    tAn = cue("s4-2", "ancêtres") - 0.8,
    tFr = cue("s4-3", "fromage") - 0.8;
  onDraw("s4", (t) => {
    const an = ramp(t, tAn, tAn + 0.5);
    let s = dinoLandSVG(t, 0.8, "s4");
    // le terrier, en coupe
    const te = ramp(t, tTe, tTe + 0.5),
      pe = ramp(t, tPe, tPe + 0.4);
    s += `<clipPath id="s4-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s4-k)"><rect x="130" y="560" width="1660" height="300" fill="#5E4630" opacity="${f2(0.4 + 0.6 * te)}"/><path d="M130 560 H1790" class="ink" stroke-width="5"/><g opacity="${f2(te)}"><path d="M700 560 Q720 640 820 660 H1100 Q1220 660 1220 730 Q1220 800 1080 800 H860 Q760 800 760 730 Q760 690 700 690 Q640 640 660 560 Z" fill="#2B1F16" class="ink" stroke-width="5"/><ellipse cx="990" cy="786" rx="150" ry="16" fill="#C9A66B"/></g></g>`;
    if (pe < 1)
      s +=
        `<g opacity="${f2((1 - pe) * (0.6 + 0.2 * Math.sin(t * 4)))}">${sauroSVG(700, 470, 1, 0, "#C8CDD6", true)}</g>` +
        txt(1200, 460, "?", 200, { w: 700, fill: C.hot, op: 1 - pe });
    if (pe > 0)
      s += `<g opacity="${f2(pe)}">${te > 0.5 ? shrewSVG(960, 740 + 3 * Math.sin(t * 5), 0.9, t) + shrewSVG(1100, 752, 0.5, t + 1) : shrewSVG(lerp(1500, 760, ramp(t, tPe, tTe + 0.2)), 530 - 8 * Math.abs(Math.sin(t * 9)), 0.8, t)}</g>`;
    if (te > 0.5 && an < 1)
      s += txt(960, 620, "au chaud, bien cachés", 40, {
        w: 700,
        fill: "#FFE9B0",
        op: (1 - an) * ramp(t, tTe + 0.5, tTe + 0.8),
      });
    // du petit mammifère… jusqu'à nous
    if (an > 0) {
      let g =
        `<rect x="330" y="240" width="1260" height="270" rx="30" fill="#FFF8EC" class="ink" stroke-width="5"/>` +
        shrewSVG(500, 400, 0.8, t) +
        arrowSVG(640, 390, 760, 390, C.ink, 10);
      g +=
        `<g transform="translate(900 380)"><ellipse rx="70" ry="50" fill="#A77B5A" class="ink" stroke-width="4"/><circle cx="60" cy="-50" r="34" fill="#A77B5A" class="ink" stroke-width="4"/><circle cx="72" cy="-54" r="5" fill="${C.ink}"/><path d="M-66 10 Q-120 0 -110 ${f2(-60 + 8 * Math.sin(t * 3))}" fill="none" stroke="#A77B5A" stroke-width="10" stroke-linecap="round"/><path d="M-30 46 v36 M30 46 v36" stroke="#A77B5A" stroke-width="12" stroke-linecap="round"/></g>` +
        arrowSVG(1040, 390, 1160, 390, C.ink, 10) +
        figSVG(1330, 470 - 4 * Math.abs(Math.sin(t * 4)), 1.5, C.blue) +
        txt(1460, 300, "nous !", 46, { w: 700, fill: C.blueD });
      const fr = ramp(t, tFr, tFr + 0.3);
      if (fr > 0)
        g += `<g transform="translate(500 300) scale(${f2(fr)}) rotate(${f2(6 * Math.sin(t * 4))})"><path d="M-40 20 L30 -24 Q46 -6 46 20 Z" fill="${C.hot}" class="ink" stroke-width="4" stroke-linejoin="round"/><circle cx="6" cy="6" r="6" fill="#C9951A"/><circle cx="28" cy="10" r="4" fill="#C9951A"/></g>`;
      s += `<g opacity="${f2(an)}">${g}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tPe + 0.5);
  show("#s4-n2", tAn + 0.6);
})();
