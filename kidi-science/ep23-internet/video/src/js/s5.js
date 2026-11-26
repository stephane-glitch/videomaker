// ---------- Scène 5 : tout ça en moins d'une seconde ; si ça rame, c'est un embouteillage de paquets ----------
(() => {
  const tSe = cue("s5-2", "seconde") - 0.8,
    tTo = cue("s5-2", "tour") - 0.8,
    tRa = cue("s5-3", "rame") - 0.6,
    tEm = cue("s5-4", "embouteillage") - 0.7;
  onDraw("s5", (t) => {
    const ra = ramp(t, tRa, tRa + 0.5),
      em = ramp(t, tEm, tEm + 0.5);
    let g = panelSVG();
    // le chronomètre
    const se = ramp(t, tSe, tSe + 0.3),
      a = (t * 3) % TAU;
    g +=
      `<g transform="translate(520 520)"><rect x="-22" y="-240" width="44" height="50" rx="8" fill="${C.ink}"/><circle r="190" fill="#fff" class="ink" stroke-width="8"/><path d="M0 0 L${f2(150 * Math.sin(a))} ${f2(-150 * Math.cos(a))}" stroke="#E0455E" stroke-width="12" stroke-linecap="round"/><circle r="14" fill="${C.ink}"/></g>` +
      (se > 0
        ? txt(520, 800, "moins d’une seconde", 50, { w: 700, fill: C.ink, op: se })
        : txt(520, 800, "?", 80, { w: 700, fill: "#C25E00" }));
    // la lumière fait le tour de la Terre
    const to = ramp(t, tTo, tTo + 0.4);
    if (to > 0) {
      const b = (t - tTo) * 5;
      g += `<g opacity="${f2(to)}">${earthSVG(1320, 500, 150, t * 10)}<ellipse cx="1320" cy="500" rx="230" ry="70" fill="none" stroke="${C.fire}" stroke-width="5" stroke-dasharray="10 12" transform="rotate(-18 1320 500)"/><g transform="rotate(-18 1320 500)"><circle cx="${f2(1320 + 230 * Math.cos(b))}" cy="${f2(500 + 70 * Math.sin(b))}" r="18" fill="${C.hot}" class="ink" stroke-width="3"/></g>${txt(1320, 800, `${Math.min(7, 1 + Math.floor(b / TAU))} tour${b > TAU ? "s" : ""}…`, 50, { w: 700, fill: "#C25E00" })}</g>`;
    }
    let s = `<g opacity="${f2(1 - ra)}">${g}</g>`;
    if (ra > 0) {
      // l'écran qui charge, puis l'embouteillage devant le routeur
      let h = panelSVG();
      h += `<g opacity="${f2(1 - em)}"><rect x="660" y="330" width="600" height="380" rx="24" fill="${C.ink}"/><rect x="684" y="354" width="552" height="332" rx="8" fill="#39425C"/><g transform="translate(960 520) rotate(${f2(t * 220)})"><path d="M0 -70 A70 70 0 1 1 -70 0" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round"/></g></g>`;
      if (em > 0) {
        let q = `<path d="M240 520 H1680" stroke="${C.ink}" stroke-width="10" opacity="0.5"/><g transform="translate(1180 520)"><circle r="70" fill="#FFE28A" class="ink" stroke-width="5"/><path d="M-36 0 H36 M20 -16 L36 0 L20 16" fill="none" stroke="${C.blue}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>`;
        const COL = ["#FFD23F", "#FF9A3D", "#5BE39A", "#8FD3FF", "#C9A6FF", "#FF8FA3"];
        for (let i = 0; i < 13; i++)
          q += packetSVG(
            1080 - i * 62 + 5 * Math.sin(t * 6 + i),
            520 + (i % 2 ? -34 : 34) * (i > 2 ? 1 : 0.3) + 4 * Math.sin(t * 9 + i * 2),
            0.95,
            COL[i % 6],
          );
        const u = (t * 0.35) % 1;
        q +=
          packetSVG(1270 + u * 400, 520, 0.95, "#5BE39A") +
          txt(700, 380, "Embouteillage !", 60, { w: 700, fill: "#B02A45" });
        h += `<g opacity="${f2(em)}">${q}</g>`;
      }
      s += `<g opacity="${f2(ra)}">${h}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tTo + 0.5);
  show("#s5-n2", tEm + 0.6);
})();
