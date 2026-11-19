// ---------- Scène 5 : la station spatiale tombe autour de la Terre, et tout flotte à l'intérieur ----------
(() => {
  const tIn = cue("s5-1", "flottent") - 0.6,
    tFall = cue("s5-2", "tombe") - 0.4;
  const EX = 620,
    EY = 1560,
    ER = 1000,
    RO = 1230; // la Terre (grande, en bas) et le rayon de l'orbite
  const station = (x, y, rot, k = 1) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${k})"><rect x="-150" y="-12" width="300" height="24" rx="8" fill="${C.metal}" class="ink"/><rect x="-160" y="-70" width="70" height="140" rx="8" fill="${C.blue}" class="ink"/><rect x="90" y="-70" width="70" height="140" rx="8" fill="${C.blue}" class="ink"/><path d="M-160 -24 H-90 M-160 24 H-90 M90 -24 H160 M90 24 H160" stroke="#fff" stroke-width="3"/><rect x="-44" y="-34" width="88" height="68" rx="22" fill="#fff" class="ink"/></g>`;
  // un astronaute qui flotte, centré en (x, y)
  const astro = (x, y, rot) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})"><path d="M-34 60 L-52 118 M34 60 L52 118 M-52 -10 L-104 -40 M52 -10 L104 -40" stroke="${C.ink}" stroke-width="40" stroke-linecap="round"/><path d="M-34 60 L-52 118 M34 60 L52 118 M-52 -10 L-104 -40 M52 -10 L104 -40" stroke="#fff" stroke-width="30" stroke-linecap="round"/><rect x="-58" y="-40" width="116" height="120" rx="40" fill="#fff" class="ink" stroke-width="5"/><circle cx="0" cy="-88" r="58" fill="#fff" class="ink" stroke-width="5"/><rect x="-38" y="-112" width="76" height="52" rx="24" fill="${C.ink}"/><path d="M-22 -100 q14 -10 30 0" fill="none" stroke="#8FD3FF" stroke-width="6" stroke-linecap="round"/></g>`;
  onDraw("s5", (t) => {
    let s = earthSVG(EX, EY, ER, t * 0.6);
    // la trajectoire et la station
    const a = -100 + ((t * 4.2) % 60),
      ar = rad(a),
      sx = EX + RO * Math.cos(ar),
      sy = EY + RO * Math.sin(ar);
    s +=
      `<circle cx="${EX}" cy="${EY}" r="${RO}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-dasharray="6 22" opacity="0.5"/>` +
      station(sx, sy, a + 90, 0.6);
    const f = lin(t, tFall, tFall + 0.4);
    if (f > 0)
      s +=
        arrowSVG(sx, sy, sx - 110 * Math.cos(ar), sy - 110 * Math.sin(ar), "#E0455E", 10, f) +
        arrowSVG(sx, sy, sx - 130 * Math.sin(ar), sy + 130 * Math.cos(ar), C.blue, 10, f);
    // la loupe : l'intérieur de la station
    const inn = ramp(t, tIn, tIn + 0.5);
    if (inn > 0) {
      const cx = 1400,
        cy = 520;
      let g = `<circle cx="${cx}" cy="${cy}" r="270" fill="#EAF6FF"/><g clip-path="url(#s5-clip)"><path d="M${cx - 270} ${cy + 180} H${cx + 270} M${cx - 270} ${cy - 180} H${cx + 270}" stroke="${C.side}" stroke-width="40"/>`;
      g += astro(
        cx - 40 + 40 * Math.sin(t * 0.7),
        cy + 10 + 30 * Math.cos(t * 0.9),
        20 * Math.sin(t * 0.5) - 10,
      );
      // une pomme et une goutte d'eau qui flottent avec lui
      g +=
        ball(cx + 150 + 20 * Math.sin(t * 0.8 + 1), cy - 110 + 24 * Math.cos(t * 0.6), 30, C.fire) +
        ball(cx - 170 + 16 * Math.cos(t * 0.7), cy + 130 + 20 * Math.sin(t * 0.9 + 2), 24, C.air);
      g += `</g><circle cx="${cx}" cy="${cy}" r="270" fill="none" stroke="${C.ink}" stroke-width="12"/>`;
      s += `<g opacity="${f2(inn)}"><path d="M${f2(sx)} ${f2(sy)} L${cx - 250} ${cy + 100}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="6 12"/>${g}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", cue("s5-2", "presque") - 0.4, { x: -40, y: 0 });
  show("#s5-n2", cue("s5-2", "ensemble") - 0.4, { x: -40, y: 0 });
  show("#s5-n3", cue("s5-3", "toboggan") - 0.4);
})();
