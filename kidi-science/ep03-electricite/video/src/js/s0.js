// ---------- Scène 0 : l'interrupteur, la lampe, et ce qui court dans le fil ----------
(() => {
  const S = scn("s0");
  const tOn = cue("s0-1", "paf") - 0.1,
    tLens = cue("s0-1", "fil") - 0.9,
    tAnts = cue("s0-3", "fourmis") - 0.5,
    tEl = cue("s0-4", "électrons") - 0.5;
  const WIRE = "M330 640 V250 H1380 V330";
  onDraw("s0", (t) => {
    const on = ramp(t, tOn, tOn + 0.25);
    let s = "";
    // le mur : interrupteur à gauche, fil apparent, lampe au plafond
    s += wireSVG(WIRE, "#F2C9A0", 22);
    s +=
      `<path d="M1300 330 H1460 L1520 470 H1240 Z" fill="${C.blue}" class="ink" stroke-width="5"/>` +
      bulbSVG(1380, 590, on, 0.85).replace(/<rect[^>]*\/>$/, "");
    s += `<rect x="1338" y="452" width="84" height="40" rx="8" fill="${C.metal}" class="ink"/>`;
    s += `<rect x="240" y="560" width="180" height="230" rx="26" fill="#fff" class="ink" stroke-width="5"/><g transform="rotate(${f2(lerp(-9, 9, on))} 330 675)"><rect x="290" y="605" width="80" height="140" rx="16" fill="${on > 0.5 ? C.blueL : C.side}" class="ink"/></g>`;
    // la loupe : ce qu'on verrait dans le fil
    const lens = ramp(t, tLens, tLens + 0.5);
    if (lens > 0) {
      const ants = ramp(t, tAnts, tAnts + 0.4) * (1 - ramp(t, tEl, tEl + 0.4)),
        el = ramp(t, tEl, tEl + 0.4);
      let inner = `<rect x="640" y="560" width="520" height="160" fill="#F2C9A0"/><path d="M640 560 H1160 M640 720 H1160" stroke="${C.ink}" stroke-width="6"/>`;
      for (let i = 0; i < 6; i++) {
        const x = 660 + ((((t * 70 + i * 96) % 576) + 576) % 576),
          y = 640 + (i % 2 ? 26 : -26);
        if (ants > 0) {
          const lg = 6 * Math.sin(t * 16 + i);
          inner += `<g opacity="${f2(ants)}"><path d="M${f2(x - 16)} ${y + 8} l${f2(-6 + lg)} 14 M${f2(x)} ${y + 8} l${f2(lg)} 14 M${f2(x + 16)} ${y + 8} l${f2(6 - lg)} 14" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><circle cx="${f2(x - 18)}" cy="${y}" r="11" fill="${C.ink}"/><circle cx="${f2(x)}" cy="${y}" r="9" fill="${C.ink}"/><circle cx="${f2(x + 20)}" cy="${y}" r="13" fill="${C.spark}" stroke="${C.ink}" stroke-width="3"/></g>`;
        }
        if (el > 0) inner += ball(x, y, 20, C.spark, { op: el, w: 3 });
      }
      s +=
        `<g opacity="${f2(lens)}"><path d="M860 440 L700 262" stroke="${C.ink}" stroke-width="4" stroke-dasharray="6 12"/><circle cx="700" cy="250" r="26" fill="none" stroke="${C.ink}" stroke-width="5"/>` +
        `<circle cx="900" cy="640" r="210" fill="#FFFDF7"/><g clip-path="url(#s0-lens)">${inner}</g><circle cx="900" cy="640" r="210" fill="none" stroke="${C.ink}" stroke-width="12"/><path d="M1050 790 L1150 900" stroke="${C.ink}" stroke-width="34" stroke-linecap="round"/></g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-logo", S.start + 0.5, { y: -20 });
  pop("#s0-n1", tAnts + 0.3);
  tl.to("#s0-n1", { opacity: 0, duration: 0.25 }, tEl);
  pop("#s0-n2", tEl + 0.3);
})();
