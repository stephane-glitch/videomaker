// ---------- Scène 5 : des dinosaures ont survécu : les oiseaux ; on le sait grâce aux fossiles ----------
(() => {
  const tSu = cue("s5-1", "survécu") - 0.5,
    tFe = cue("s5-3", "fenêtre") - 0.6,
    tDe = cue("s5-3", "descendants") - 0.6,
    tPi = cue("s5-4", "pigeon") - 0.5,
    tFo = cue("s5-5", "fossiles") - 0.6;
  const bird = (x, y, k, t, ph, col = "#5B6B88") => {
    const f = Math.sin(t * 8 + ph);
    return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${k})"><path d="M-10 0 Q-40 ${f2(-60 * f)} -90 ${f2(-30 * f)} Q-40 ${f2(-10 * f + 10)} -10 14 Z" fill="${col}" class="ink" stroke-width="4" stroke-linejoin="round"/><ellipse rx="50" ry="26" fill="${col}" class="ink" stroke-width="4"/><circle cx="50" cy="-14" r="20" fill="${col}" class="ink" stroke-width="4"/><path d="M68 -14 l22 4 l-22 8 Z" fill="${C.fire}"/><circle cx="56" cy="-18" r="4" fill="#fff"/><path d="M-48 0 l-36 -10 l4 24 Z" fill="${col}" class="ink" stroke-width="4" stroke-linejoin="round"/></g>`;
  };
  onDraw("s5", (t) => {
    const fe = ramp(t, tFe, tFe + 0.5),
      fo = ramp(t, tFo, tFo + 0.5);
    let s = panelSVG(130, 190, 1660, 660, "#FFF3DC");
    if (fe < 1)
      s += `<g opacity="${f2(1 - fe)}">${trexSVG(960, 560 - 4 * Math.abs(Math.sin(t * 3)), 1.3, 10 + 8 * Math.sin(t * 3))}${txt(1400, 420, "?", 200, { w: 700, fill: "#C25E00", op: ramp(t, tSu, tSu + 0.3) })}</g>`;
    if (fe > 0 && fo < 1) {
      const de = ramp(t, tDe, tDe + 0.5),
        pi = ramp(t, tPi, tPi + 0.4);
      // la fenêtre et les oiseaux ; puis le dinosaure à plumes et son descendant
      let g = `<g opacity="${f2(1 - 0.85 * de)}"><rect x="560" y="260" width="800" height="500" rx="16" fill="#BFE6FF" class="ink" stroke-width="10"/><path d="M960 260 V760 M560 510 H1360" class="ink" stroke-width="6"/>${bird(700 + ((t * 120) % 520), 380 + 20 * Math.sin(t * 2), 0.8, t, 0)}${bird(640 + ((t * 90 + 260) % 560), 620 + 14 * Math.cos(t * 2), 0.6, t, 2)}</g>`;
      if (de > 0)
        g += `<g opacity="${f2(de)}"><g opacity="${f2(1 - 0.6 * pi)}">${trexSVG(520, 560 - 5 * Math.abs(Math.sin(t * 4)), 0.9, 8, "#C9A6FF")}</g>${arrowSVG(760, 520, 1040, 520, C.ink, 14)}${txt(900, 470, "descendants", 40, { w: 700, fill: C.ink })}${bird(1320, 520 + 10 * Math.sin(t * 3), 1.6 + 0.3 * pi, t, 1)}</g>`;
      if (pi > 0)
        g += txt(1320, 740, "un petit cousin du tyrannosaure", 40, {
          w: 700,
          fill: "#5A35B0",
          op: pi,
        });
      s += `<g opacity="${f2(fe * (1 - fo))}">${g}</g>`;
    }
    if (fo > 0) {
      // les couches de roche et le squelette fossile, dégagé au pinceau
      let g = `<clipPath id="s5-c"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s5-c)"><rect x="130" y="190" width="1660" height="220" fill="#E7C99A"/><rect x="130" y="410" width="1660" height="250" fill="#C9A66B"/><rect x="130" y="660" width="1660" height="200" fill="#A7825A"/><path d="M130 410 Q960 380 1790 420 M130 660 Q960 690 1790 650" fill="none" class="ink" stroke-width="4"/></g>`;
      const r = ramp(t, tFo + 0.3, tFo + 2.4);
      g += `<clipPath id="s5-r"><rect x="560" y="420" width="${f2(820 * r)}" height="240"/></clipPath><g clip-path="url(#s5-r)" fill="none" stroke="#FFF8EC" stroke-width="12" stroke-linecap="round"><path d="M640 540 Q800 480 1020 520 Q1150 540 1280 500"/><path d="M780 510 v70 M840 502 v80 M900 500 v84 M960 504 v80 M1020 516 v66"/><ellipse cx="1310" cy="490" rx="44" ry="30"/><path d="M820 580 l-20 60 M1000 580 l20 60"/></g>`;
      g +=
        `<g transform="translate(${f2(560 + 820 * r + 20 * Math.sin(t * 10))} ${f2(480 + 30 * Math.sin(t * 7))}) rotate(30)"><rect x="-8" y="-90" width="16" height="70" rx="6" fill="#C98B4B" class="ink" stroke-width="3"/><path d="M-14 -20 H14 L20 20 H-20 Z" fill="#FFE9B0" class="ink" stroke-width="3"/></g>` +
        txt(960, 310, "un fossile", 54, { w: 700, fill: C.ink });
      s += `<g opacity="${f2(fo)}">${g}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  pop("#s5-n1", tDe + 0.6);
  show("#s5-n2", tFo + 0.6);
})();
