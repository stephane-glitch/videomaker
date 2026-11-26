// ---------- Scène 5 : le secret des chatouilles : son propre geste, le cerveau l'a prévu ; la surprise fait rire ----------
(() => {
  const tB = cue("s5-2", "bouges") - 0.5,
    tA = cue("s5-3", "attaquer") - 1.6,
    tRb = cue("s5-5", "robot") - 0.5;
  onDraw("s5", (t) => {
    const ext = ramp(t, tA, tA + 0.5),
      rb = ramp(t, tRb, tRb + 0.4);
    let s =
      `<path d="M130 850 H1790" class="ink" stroke-width="6"/>` +
      figSVG(520 + (ext > 0.5 ? 10 * Math.sin(t * 20) : 0), 848, 3.0, C.blue);
    // sa propre main (pas de rire), puis la plume venue d'ailleurs (surprise !)
    if (ext < 1) {
      const w = 14 * Math.sin(t * 16);
      s += `<g opacity="${f2(1 - ext)}"><path d="M600 620 Q680 600 ${f2(560 + w * 0.4)} ${f2(690 + w * 0.3)}" fill="none" stroke="${C.ink}" stroke-width="34" stroke-linecap="round"/><path d="M600 620 Q680 600 ${f2(560 + w * 0.4)} ${f2(690 + w * 0.3)}" fill="none" stroke="${C.blue}" stroke-width="24" stroke-linecap="round"/><circle cx="${f2(556 + w * 0.4)}" cy="${f2(694 + w * 0.3)}" r="22" fill="#FFD9B8" class="ink" stroke-width="4"/></g>`;
    }
    if (ext > 0) {
      const fx = lerp(1100, 640, ext) + 16 * Math.sin(t * 18),
        fy = 660 + 20 * Math.sin(t * 7);
      s += `<g opacity="${f2(ext)}" transform="translate(${f2(fx)} ${f2(fy)}) rotate(${f2(-20 + 10 * Math.sin(t * 18))})"><path d="M0 0 Q90 -70 240 -40 Q120 30 0 0 Z" fill="#fff" class="ink" stroke-width="5"/><path d="M0 0 L240 -40 M60 -24 l14 -30 M110 -32 l14 -30 M160 -38 l14 -26" class="ink" stroke-width="4" fill="none"/></g>`;
      for (let i = 0; i < 3; i++)
        s += txt(380 + i * 110, 380 - ((t * 60 + i * 40) % 120), "hi", 60 + i * 8, {
          w: 700,
          fill: "#C25E00",
          op: ext * (1 - ((t * 60 + i * 40) % 120) / 120),
        });
    }
    // le cerveau : « prévu », puis « surprise ! »
    const b = ramp(t, tB, tB + 0.4);
    if (b > 0) {
      s += `<g opacity="${f2(b)}">${brainSVG(1380, 380 + 8 * Math.sin(t * 2), 1.3)}</g>`;
      const sur = ext > 0.5;
      s += `<g opacity="${f2(b)}" transform="translate(1380 600)"><rect x="-230" y="-56" width="460" height="112" rx="30" fill="${sur ? "#FFE14D" : "#fff"}" class="ink" stroke-width="4"/>${txt(0, 18, sur ? "Surprise !" : "Prévu : rien à signaler", sur ? 56 : 38, { w: 700 })}</g>`;
      if (!sur)
        s += `<path d="M1200 420 Q900 300 640 600" fill="none" stroke="${C.blue}" stroke-width="7" stroke-dasharray="14 12" stroke-dashoffset="${f2(-t * 60)}" opacity="${f2(b)}"/>`;
    }
    // le robot chatouilleur
    if (rb > 0)
      s += `<g transform="translate(1660 ${f2(848 - 150 * rb)}) scale(${f2(-rb)} ${f2(rb)})"><rect x="-70" y="-110" width="140" height="130" rx="20" fill="#9AA6B8" class="ink" stroke-width="5"/><rect x="-50" y="-190" width="100" height="74" rx="16" fill="#D3DAE6" class="ink" stroke-width="5"/><circle cx="-20" cy="-154" r="10" fill="${C.blue}"/><circle cx="20" cy="-154" r="10" fill="${C.blue}"/><path d="M0 -190 v-30" class="ink" stroke-width="6"/><circle cy="-226" r="10" fill="#E0455E" class="ink" stroke-width="4"/><path d="M-70 -60 L${f2(-150 + 10 * Math.sin(t * 14))} -100" class="ink" stroke-width="12" stroke-linecap="round"/><path d="M${f2(-150 + 10 * Math.sin(t * 14))} -100 q-50 -50 -110 -20 q50 30 110 20 Z" fill="#fff" class="ink" stroke-width="4"/><path d="M-40 20 v50 M40 20 v50" class="ink" stroke-width="14" stroke-linecap="round"/></g>`;
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tB + 0.6);
  pop("#s5-n2", cue("s5-4", "surprise") - 0.4);
})();
