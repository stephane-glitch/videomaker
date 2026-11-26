// ---------- Scène 5 : 380 000 km : presque six mois en voiture ; les pas des astronautes sont toujours là ----------
(() => {
  const tD = cue("s5-2", "Trois") - 0.4,
    tV = cue("s5-2", "voiture") - 0.6,
    tP = cue("s5-3", "pas") - 0.6;
  onDraw("s5", (t) => {
    const p = ramp(t, tP, tP + 0.6);
    let g =
      nightSkySVG(130, 190, 1660, 660, t) +
      earthSVG(380, 520, 140, t * 20) +
      rockMoonSVG(1540, 520, 60);
    const d = ramp(t, tD, tD + 0.8);
    if (d > 0)
      g +=
        `<path d="M540 520 H${f2(lerp(540, 1470, d))}" stroke="#fff" stroke-width="5" stroke-dasharray="12 12"/>` +
        txt(1000, 440, "380 000 km", 90, { w: 700, fill: "#FFF6B0", op: d });
    // la voiture qui roule sans s'arrêter
    const v = ramp(t, tV, tV + 3.5);
    if (t > tV)
      g +=
        `<g transform="translate(${f2(lerp(560, 1440, v))} ${f2(590 + 3 * Math.sin(t * 20))})"><path d="M-70 10 H70 V-14 Q70 -24 56 -26 L30 -30 Q14 -58 -10 -58 H-30 Q-48 -58 -54 -30 L-64 -26 Q-70 -24 -70 -14 Z" fill="#3DBE8B" class="ink" stroke-width="4"/><circle cx="-38" cy="12" r="15" fill="${C.ink}"/><circle cx="38" cy="12" r="15" fill="${C.ink}"/></g>` +
        txt(1000, 720, `${Math.round(6 * v)} mois`, 60, { w: 700, fill: "#fff" });
    let s = `<g opacity="${f2(1 - p)}">${g}</g>`;
    if (p > 0) {
      // le sol de la Lune, les empreintes, et la Terre dans le ciel noir
      let h =
        nightSkySVG(130, 190, 1660, 660, t) +
        earthSVG(1480, 360, 80, t * 20) +
        `<clipPath id="s5-c"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s5-c)"><path d="M130 620 Q600 560 1000 610 T1790 590 V860 H130 Z" fill="#C8CDD6" class="ink" stroke-width="5"/><ellipse cx="500" cy="760" rx="120" ry="24" fill="#A7AFBA"/><ellipse cx="1300" cy="700" rx="80" ry="16" fill="#A7AFBA"/>`;
      for (let i = 0; i < 7; i++) {
        const k = ramp(t, tP + 0.5 + i * 0.22, tP + 0.7 + i * 0.22);
        if (k > 0)
          h += `<g opacity="${f2(k)}" transform="translate(${420 + i * 130} ${700 + (i % 2) * 44}) rotate(${i % 2 ? 8 : -8})"><rect x="-22" y="-44" width="44" height="60" rx="18" fill="#8E96A3" class="ink" stroke-width="3"/><rect x="-18" y="24" width="36" height="26" rx="10" fill="#8E96A3" class="ink" stroke-width="3"/><path d="M-14 -28 h28 M-14 -12 h28 M-14 4 h28" stroke="#C8CDD6" stroke-width="5"/></g>`;
      }
      h += `</g>`;
      s += `<g opacity="${f2(p)}">${h}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", cue("s5-2", "six") - 0.6);
  tl.to("#s5-n1", { opacity: 0, duration: 0.3 }, tP);
  show("#s5-n2", cue("s5-4", "vent") - 0.6);
})();
