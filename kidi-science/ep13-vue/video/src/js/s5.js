// ---------- Scène 5 : le lapin (yeux sur les côtés, voit tout autour) et le chat (yeux devant, vise bien) ----------
(() => {
  const tL = cue("s5-1", "lapins") - 0.5,
    tAu = cue("s5-2", "côtés") - 0.6,
    tCh = cue("s5-2", "chasseurs") - 0.6,
    tDv = cue("s5-2", "devant") - 0.5,
    tZ = cue("s5-3", "chasseuse") - 1.4,
    tT = cue("s5-4", "tartines") - 0.5;
  const wedge = (x, y, r, a0, a1, col, op) => {
    const p = (a) => `${f2(x + r * Math.cos(rad(a)))} ${f2(y + r * Math.sin(rad(a)))}`;
    return `<path d="M${x} ${y} L${p(a0)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)} Z" fill="${col}" opacity="${f2(op)}"/>`;
  };
  onDraw("s5", (t) => {
    const z = ramp(t, tZ, tZ + 0.5);
    let g = "";
    // le lapin vu de dessus : presque tout le tour
    const kl = ramp(t, tL, tL + 0.4),
      fa = ramp(t, tAu, tAu + 0.8);
    if (kl > 0) {
      let r =
        wedge(520, 540, 300, -90 - 170 * fa, -90 - 6, C.air, 0.55 * fa) +
        wedge(520, 540, 300, -90 + 6, -90 + 170 * fa, C.air, 0.55 * fa);
      r +=
        `<ellipse cx="480" cy="680" rx="26" ry="90" fill="#D9D2C5" class="ink" stroke-width="5" transform="rotate(-12 480 680)"/><ellipse cx="560" cy="680" rx="26" ry="90" fill="#D9D2C5" class="ink" stroke-width="5" transform="rotate(12 560 680)"/><ellipse cx="520" cy="540" rx="90" ry="110" fill="#EDE7DB" class="ink" stroke-width="6"/><circle cx="432" cy="520" r="20" fill="${C.ink}"/><circle cx="608" cy="520" r="20" fill="${C.ink}"/><ellipse cx="520" cy="${f2(440 + 3 * Math.sin(t * 10))}" rx="14" ry="10" fill="#F7A8B8" class="ink" stroke-width="4"/>` +
        txt(520, 250, "Le lapin", 46, { w: 700 });
      g += `<g opacity="${f2(kl)}">${r}</g>`;
    }
    // le chat vu de dessus : deux champs qui se recouvrent devant
    const kc = ramp(t, tCh, tCh + 0.4),
      fc = ramp(t, tDv, tDv + 0.6);
    if (kc > 0) {
      let c =
        wedge(1360, 540, 300, -90 - 80 * fc, -90 + 30 * fc, C.hot, 0.5 * fc) +
        wedge(1440, 540, 300, -90 - 30 * fc, -90 + 80 * fc, C.hot, 0.5 * fc);
      c +=
        `<path d="M1320 470 L1300 380 L1370 430 Z M1480 470 L1500 380 L1430 430 Z" fill="#FF8A1F" class="ink" stroke-width="5"/><ellipse cx="1400" cy="540" rx="100" ry="110" fill="#FF8A1F" class="ink" stroke-width="6"/><circle cx="1360" cy="450" r="20" fill="${C.ink}"/><circle cx="1440" cy="450" r="20" fill="${C.ink}"/>` +
        txt(1400, 250, "Le chat", 46, { w: 700 });
      g += `<g opacity="${f2(kc)}">${c}</g>`;
    }
    let s = `<g opacity="${f2(1 - z)}">${g}</g>`;
    // Zoé, les yeux devant… chasseuse de tartines
    if (z > 0) {
      const look = ramp(t, tT, tT + 0.3);
      let h = `<circle cx="700" cy="540" r="190" fill="#FFD9B8" class="ink" stroke-width="6"/><path d="M520 500 C 510 330, 660 300, 730 320 C 760 280, 840 290, 836 340 C 890 370, 896 440, 880 500 C 840 440, 760 420, 700 426 C 630 420, 570 440, 520 500 Z" fill="${C.ink}"/>${frontEyeSVG(640, 560, 32, 0.5)}${frontEyeSVG(770, 560, 32, 0.5)}<path d="M650 650 q50 ${f2(30 + 10 * look)} 100 0" fill="none" class="ink" stroke-width="7" stroke-linecap="round"/>`;
      if (look > 0)
        h += `<g transform="translate(${f2(1300 + 10 * Math.sin(t * 5))} ${f2(540 + 12 * Math.sin(t * 3))}) scale(${f2(look)})">${toastSVG(0, 0, -10, 1.4)}</g><path d="M900 560 H1090" stroke="${C.fire}" stroke-width="9" stroke-dasharray="16 14" stroke-dashoffset="${f2(-t * 80)}" stroke-linecap="round" opacity="${f2(look)}"/>`;
      s += `<g opacity="${f2(z)}">${h}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tAu + 0.6);
  show("#s5-n2", tDv + 0.5);
  tl.to(["#s5-n1", "#s5-n2"], { opacity: 0, duration: 0.3 }, tZ);
})();
