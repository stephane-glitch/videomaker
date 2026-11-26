// ---------- Scène 4 : toujours la même face tournée vers nous ; la face cachée, vue seulement par les sondes ----------
(() => {
  const S = scn("s4");
  const tF = cue("s4-2", "face") - 0.6,
    tCa = cue("s4-4", "cachée") - 1.0,
    tSo = cue("s4-4", "sondes") - 0.8;
  const EX = 860,
    EY = 540,
    R = 200;
  onDraw("s4", (t) => {
    const a = (t - S.start) * 0.55,
      mx = EX + R * Math.cos(a),
      my = EY + R * Math.sin(a);
    let s =
      nightSkySVG(130, 190, 1660, 660, t) +
      `<circle cx="${EX}" cy="${EY}" r="${R}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 14" opacity="0.5"/>` +
      earthSVG(EX, EY, 100, t * 30);
    // le repère rouge reste toujours tourné vers la Terre
    const f = ramp(t, tF, tF + 0.4);
    s += `<circle cx="${f2(mx)}" cy="${f2(my)}" r="54" fill="#D9DEE8" class="ink" stroke-width="5"/><circle cx="${f2(mx - 22)}" cy="${f2(my - 18)}" r="10" fill="#A7AFBA"/><circle cx="${f2(mx + 18)}" cy="${f2(my + 24)}" r="8" fill="#A7AFBA"/>`;
    s +=
      `<circle cx="${f2(mx - 32 * Math.cos(a))}" cy="${f2(my - 32 * Math.sin(a))}" r="16" fill="#E0455E" class="ink" stroke-width="4"/>` +
      (f > 0
        ? `<path d="M${f2(mx - 60 * Math.cos(a))} ${f2(my - 60 * Math.sin(a))} L${f2(EX + 120 * Math.cos(a))} ${f2(EY + 120 * Math.sin(a))}" stroke="#E0455E" stroke-width="6" stroke-dasharray="10 10" opacity="${f2(f)}"/>`
        : "");
    // la sonde qui passe derrière, et sa photo
    const so = ramp(t, tSo, tSo + 0.5);
    if (so > 0) {
      const b = a + 0.5 * Math.sin(t * 0.8),
        px = EX + (R + 100) * Math.cos(b),
        py = EY + (R + 100) * Math.sin(b);
      s += `<g opacity="${f2(so)}" transform="translate(${f2(px)} ${f2(py)}) rotate(${f2((b * 180) / Math.PI + 90)})"><rect x="-22" y="-16" width="44" height="32" rx="6" fill="#D3DAE6" class="ink" stroke-width="4"/><rect x="-70" y="-10" width="44" height="20" fill="${C.blue}" class="ink" stroke-width="3"/><rect x="26" y="-10" width="44" height="20" fill="${C.blue}" class="ink" stroke-width="3"/></g>`;
      if (Math.sin(t * 5) > 0.7)
        s += `<circle cx="${f2(mx + 60 * Math.cos(a))}" cy="${f2(my + 60 * Math.sin(a))}" r="26" fill="#fff" opacity="${f2(so * 0.8)}"/>`;
    }
    const ca = ramp(t, tCa, tCa + 0.4);
    if (ca > 0)
      s += `<g opacity="${f2(ca)}">${txt(1500, 330, "La face cachée", 46, { w: 700, fill: "#BFD4FF" })}</g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", cue("s4-2", "vitesse") - 0.6);
  show("#s4-n2", tSo + 0.5);
})();
