// ---------- Scène 0 : « la Terre s'éloigne du Soleil » ? Non : en janvier elle est au plus près. Le secret : elle est penchée ----------
(() => {
  // l'icône du générique devient un flocon pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<g stroke="${C.blue}" stroke-width="10" stroke-linecap="round" fill="none"><path d="M75 15 V135 M23 45 L127 105 M127 45 L23 105"/><path d="M60 28 L75 42 L90 28 M60 122 L75 108 L90 122"/></g>`;
  const tE = cue("s0-1", "éloigne") - 0.5,
    tN = cue("s0-2", "non") - 0.2,
    tJ = cue("s0-2", "janvier") - 0.4,
    tP = cue("s0-4", "penchée") - 0.6;
  onDraw("s0", (t) => {
    const far = ramp(t, tE, tE + 0.8) * (1 - ramp(t, tJ, tJ + 0.8)),
      near = ramp(t, tJ, tJ + 0.8),
      tilt = 23 * ramp(t, tP, tP + 0.6);
    const ex = 1100 + 380 * far - 240 * near,
      r = 130;
    let s = sunSVG(400, 520, 120, t);
    for (let i = 0; i < 4; i++) {
      const u = (t * 0.5 + i / 4) % 1;
      s += `<path d="M${f2(560 + u * 200)} ${460 + i * 40} h50" stroke="${C.hot}" stroke-width="10" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
    }
    s += tiltEarthSVG(ex, 520, r, tilt, t * 30);
    // l'idée de Zoé : plus loin = plus froid ?
    if (far > 0.2)
      s += `<g opacity="${f2(far)}"><g transform="translate(${f2(ex)} 300) rotate(${f2(t * 30)})" stroke="${C.blue}" stroke-width="10" stroke-linecap="round"><path d="M-40 0 H40 M-20 -35 L20 35 M20 -35 L-20 35"/></g>${txt(ex, 740, "plus loin ?", 50, { w: 700, fill: C.blue })}</g>`;
    const x = ramp(t, tN, tN + 0.2) * (1 - near);
    if (x > 0)
      s += `<g opacity="${f2(x)}" transform="translate(${f2(ex)} 520) scale(${f2(1.4 - 0.4 * x)})"><path d="M-150 -150 L150 150 M150 -150 L-150 150" stroke="#E0455E" stroke-width="30" stroke-linecap="round"/></g>`;
    if (near > 0.5)
      s += txt(ex, 740, "Janvier : au plus près", 46, {
        w: 700,
        fill: "#C25E00",
        op: ramp(near, 0.5, 1) * (1 - ramp(t, tP - 0.3, tP)),
      });
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tJ + 0.8);
  pop("#s0-n2", tP + 0.4);
})();
