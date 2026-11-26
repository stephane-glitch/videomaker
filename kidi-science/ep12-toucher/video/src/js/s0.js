// ---------- Scène 0 : impossible de se chatouiller soi-même ; la peau, un emballage rempli de capteurs ----------
(() => {
  const tR = cue("s0-1", "Rien") - 0.3,
    tP = cue("s0-2", "peau") - 0.6,
    tC = cue("s0-4", "capteurs") - 0.5,
    tM = cue("s0-4", "millions") - 0.4;
  onDraw("s0", (t) => {
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` + figSVG(520, 848, 3.0, C.blue);
    // la main qui essaie de chatouiller son propre ventre
    const w = 14 * Math.sin(t * 16);
    s += `<path d="M600 620 Q680 600 ${f2(560 + w * 0.4)} ${f2(690 + w * 0.3)}" fill="none" stroke="${C.ink}" stroke-width="34" stroke-linecap="round"/><path d="M600 620 Q680 600 ${f2(560 + w * 0.4)} ${f2(690 + w * 0.3)}" fill="none" stroke="${C.blue}" stroke-width="24" stroke-linecap="round"/><circle cx="${f2(556 + w * 0.4)}" cy="${f2(694 + w * 0.3)}" r="22" fill="#FFD9B8" class="ink" stroke-width="4"/>`;
    const r = ramp(t, tR, tR + 0.3) * (1 - ramp(t, tP, tP + 0.3));
    if (r > 0)
      s += `<g opacity="${f2(r)}" transform="translate(760 430) rotate(-6)">${txt(0, 0, "… rien.", 80, { w: 700, fill: C.smoke })}</g>`;
    // la loupe sur la peau : les capteurs apparaissent
    const z = ramp(t, tP, tP + 0.5);
    if (z > 0) {
      let g = `<circle cx="1300" cy="520" r="250" fill="#FFD9B8" class="ink" stroke-width="8"/><path d="M1480 700 L1620 840" class="ink" stroke-width="34" stroke-linecap="round"/><clipPath id="s0-z"><circle cx="1300" cy="520" r="244"/></clipPath><g clip-path="url(#s0-z)">`;
      const n = Math.round(70 * ramp(t, tC, tM + 0.8));
      for (let i = 0; i < n; i++)
        g += `<circle cx="${f2(1070 + rnd(i) * 460)}" cy="${f2(290 + rnd(i + 99) * 460)}" r="${f2(9 + 3 * Math.sin(t * 5 + i))}" fill="${[C.blue, C.fire, C.air, "#E0455E", "#8E5BD6"][i % 5]}" stroke="${C.ink}" stroke-width="2.5"/>`;
      g += `</g>`;
      s += `<g opacity="${f2(z)}" transform="translate(${f2(40 * (1 - z))} 0)">${g}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  pop("#s0-n1", tC + 0.4);
})();
