// ---------- Scène 4 : grave ou aigu (la vitesse de vibration), fort ou faible (la hauteur de la vague) ----------
(() => {
  const tLow = cue("s4-1", "lentement") - 0.8,
    tHigh = cue("s4-1", "vite") - 0.6,
    tLoud = cue("s4-3", "haute") - 0.6,
    tTsu = cue("s4-5", "tsunami") - 0.3;
  onDraw("s4", (t) => {
    const loud = ramp(t, tLoud, tLoud + 0.8),
      tsu = ramp(t, tTsu, tTsu + 0.5);
    const amp = 46 * (1 + 0.8 * loud + 0.55 * tsu);
    let s = "";
    const row = (y, lam, speed, col, thick, on) => {
      if (on <= 0) return "";
      // la corde à gauche (grosse = lente, fine = rapide) et l'onde qu'elle envoie
      const ph = t * speed,
        a = amp;
      let r = `<rect x="150" y="${y - 12}" width="46" height="24" rx="8" fill="#D9A66B" class="ink"/><rect x="620" y="${y - 12}" width="46" height="24" rx="8" fill="#D9A66B" class="ink"/>`;
      let d = "";
      for (let x = 196; x <= 620; x += 8)
        d += `${x === 196 ? "M" : "L"}${x} ${f2(y + 20 * Math.sin(ph) * Math.sin(((x - 196) / 424) * Math.PI))}`;
      r += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${thick + 6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${thick}" stroke-linecap="round"/>`;
      const w = sineD(760, 1780, y, a, lam, ph);
      r += `<path d="${w}" fill="none" stroke="${C.ink}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="${w}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
      return `<g opacity="${f2(on)}">${r}</g>`;
    };
    s += row(430, 340, 7, C.blue, 14, lin(t, tLow, tLow + 0.4));
    s += row(740, 110, 22, C.fire, 5, lin(t, tHigh, tHigh + 0.4));
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-t1", tLow, { x: -40, y: 0 });
  show("#s4-t2", tHigh, { x: -40, y: 0 });
  show("#s4-n1", tLoud + 0.3);
})();
