// ---------- Scène 4 : la nuit avance par cycles : léger, profond, paradoxal (les rêves) ----------
(() => {
  const S = scn("s4");
  const tCy = cue("s4-2", "cycles") - 0.5,
    TL = [cue("s4-2", "léger"), cue("s4-2", "profond"), cue("s4-2", "paradoxal")].map(
      (x) => x - 0.5,
    ),
    tRe = cue("s4-2", "rêves") - 0.6,
    tYe = cue("s4-2", "yeux") - 0.5,
    tOff = cue("s4-4", "débranché") - 0.6;
  const X0 = 330,
    X1 = 1700,
    Y = [330, 450, 610, 380]; // éveil, léger, profond, paradoxal
  const NAMES = ["Éveil", "Léger", "Profond", "Paradoxal"],
    COLS = [C.smoke, C.air, C.blue, C.fire];
  // le niveau de sommeil en fonction de l'avancée de la nuit (0…1) : cinq cycles
  const level = (u) => {
    const c = (u * 5) % 1;
    return c < 0.12 ? 1 : c < 0.3 ? 2 : c < 0.55 ? 2 : c < 0.72 ? 1 : 3;
  };
  onDraw("s4", (t) => {
    const prog = lin(t, S.start + 0.3, S.end - 2.5);
    let s = "";
    for (let i = 0; i < 4; i++) {
      const on = i === 0 || t > (TL[i - 1] ?? 0);
      s +=
        `<path d="M${X0} ${Y[i]} H${X1}" stroke="${COLS[i]}" stroke-width="3" stroke-dasharray="6 12" opacity="${on ? 0.7 : 0.15}"/>` +
        txt(X0 - 30, Y[i] + 12, NAMES[i], 34, {
          w: 700,
          anchor: "end",
          fill: i === 3 ? "#C25E00" : C.ink,
          op: on ? 1 : 0.2,
        });
    }
    // la courbe de la nuit, qui se dessine au fil du temps
    let d = `M${X0} ${Y[0]}`,
      last = 0;
    const n = Math.round(300 * prog);
    for (let k = 1; k <= n; k++) {
      const u = k / 300,
        lv = level(u),
        x = lerp(X0, X1, u);
      if (lv !== last) d += ` V${Y[lv]}`;
      d += ` H${f2(x)}`;
      last = lv;
    }
    s += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>`;
    // les passages de sommeil paradoxal, surlignés
    for (let k = 0; k < 5; k++) {
      const a = (k + 0.72) / 5,
        b = (k + 1) / 5;
      if (prog > a)
        s += `<path d="M${f2(lerp(X0, X1, a))} ${Y[3]} H${f2(lerp(X0, X1, Math.min(b, prog)))}" stroke="${C.fire}" stroke-width="16" stroke-linecap="round"/>`;
    }
    s +=
      `<path d="M${X0} 720 H${X1}" class="ink" stroke-width="5"/>` +
      ["22 h", "minuit", "2 h", "4 h", "6 h"]
        .map((l, i) => txt(lerp(X0, X1, i / 4.5), 770, l, 32, { w: 700 }))
        .join("");
    // le rêve, les yeux qui bougent, les muscles débranchés
    const re = ramp(t, tRe, tRe + 0.4);
    if (re > 0)
      s += `<g opacity="${f2(re)}" transform="translate(1440 ${f2(250 + 6 * Math.sin(t * 2))})">${cloudSVG(0, 0, 0.9)}<path d="M-40 -6 q20 -24 40 0 t40 0" fill="none" stroke="${C.blue}" stroke-width="8" stroke-linecap="round"/>${txt(0, 90, "les rêves", 34, { w: 700, fill: "#C25E00" })}</g>`;
    const ye = ramp(t, tYe, tYe + 0.4);
    if (ye > 0) {
      const ex = 12 * Math.sin(t * 9);
      s += `<g opacity="${f2(ye)}" transform="translate(760 250)"><path d="M-110 0 q50 40 100 0 M10 0 q50 40 100 0" fill="none" class="ink" stroke-width="8" stroke-linecap="round"/><circle cx="${f2(-60 + ex)}" cy="4" r="14" fill="${C.ink}" opacity="0.35"/><circle cx="${f2(60 + ex)}" cy="4" r="14" fill="${C.ink}" opacity="0.35"/></g>`;
    }
    const off = ramp(t, tOff, tOff + 0.35);
    if (off > 0)
      s += `<g transform="translate(1080 250) scale(${f2(off)})"><rect x="-130" y="-50" width="260" height="100" rx="50" fill="#D3DAE6" class="ink" stroke-width="6"/><circle cx="-76" cy="0" r="38" fill="#fff" class="ink" stroke-width="5"/>${txt(40, 14, "OFF", 44, { w: 700 })}${txt(0, 100, "muscles", 32, { w: 700 })}</g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tCy + 0.6);
  show("#s4-n2", cue("s4-2", "immobile") - 0.6);
})();
