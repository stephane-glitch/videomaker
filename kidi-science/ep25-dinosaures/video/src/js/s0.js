// ---------- Scène 0 : les dinosaures ne se cachent pas : ils ont disparu il y a 66 millions d'années, et le coupable est tombé du ciel ----------
(() => {
  // l'icône du générique devient un dinosaure pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<path d="M18 104 Q30 84 52 86 Q54 60 84 60 Q100 60 104 44 Q108 20 128 22 Q140 24 138 38 Q128 44 122 48 Q118 80 100 96 L100 124 H86 L84 104 H64 L62 124 H48 L48 100 Q32 100 18 104 Z" fill="#3DBE8B" class="ink" stroke-width="5" stroke-linejoin="round"/><circle cx="126" cy="32" r="4" fill="#1F2A44"/>`;
  const S = scn("s0");
  const tCa = cue("s0-1", "cachent") - 0.6,
    tDi = cue("s0-2", "disparu") - 0.5,
    tSo = cue("s0-2", "soixante") - 0.5,
    tCi = cue("s0-4", "ciel") - 0.9;
  onDraw("s0", (t) => {
    const di = ramp(t, tDi, tDi + 0.8),
      w = (t - S.start) * 14;
    let s = dinoLandSVG(t, 0, "s0");
    const n = 8 * Math.sin(t * 1.8),
      bob = 4 * Math.abs(Math.sin(t * 4));
    // vivants, puis seulement leur silhouette en pointillés
    s += `<g opacity="${f2(1 - di)}">${sauroSVG(560 + w, 600 - bob, 1.2, n)}${trexSVG(1340 - w * 0.6, 640 - bob, 1, 10 + 10 * Math.sin(t * 3))}</g>`;
    if (di > 0)
      s += `<g opacity="${f2(di * (0.5 + 0.2 * Math.sin(t * 4)))}">${sauroSVG(560 + (tDi - S.start) * 14, 600, 1.2, 0, "#5B6B88", true)}</g>`;
    const ca = ramp(t, tCa, tCa + 0.3) * (1 - di);
    if (ca > 0)
      s += `<g opacity="${f2(ca)}"><ellipse cx="1000" cy="700" rx="110" ry="70" fill="#2E9E6B" class="ink" stroke-width="5"/><circle cx="975" cy="${f2(640 - 8 * Math.sin(t * 3))}" r="12" fill="#fff" class="ink" stroke-width="3"/><circle cx="1025" cy="${f2(640 - 8 * Math.sin(t * 3))}" r="12" fill="#fff" class="ink" stroke-width="3"/><circle cx="${f2(977 + 3 * Math.sin(t * 2))}" cy="${f2(640 - 8 * Math.sin(t * 3))}" r="5" fill="${C.ink}"/><circle cx="${f2(1027 + 3 * Math.sin(t * 2))}" cy="${f2(640 - 8 * Math.sin(t * 3))}" r="5" fill="${C.ink}"/></g>`;
    const so = ramp(t, tSo, tSo + 1.2);
    if (so > 0)
      s += `<g transform="translate(960 330)"><rect x="-470" y="-70" width="940" height="120" rx="30" fill="#fff" class="ink" stroke-width="5"/>${txt(0, 16, `il y a ${Math.round(66 * so)} 000 000 d’années`, 60, { w: 700, fill: C.ink })}</g>`;
    if (t > tCi) {
      const u = clamp((t - tCi) / 3.5, 0, 1);
      s += `<clipPath id="s0-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s0-k)">${meteorSVG(lerp(1820, 1300, u), lerp(160, 470, u), 26 + 10 * u, -0.54, 260)}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tSo + 1.2);
  pop("#s0-n2", tCi + 0.8);
})();
