// ---------- Scène 4 : 35 grammes par litre (deux grosses cuillères) ; la mer Morte, où l'on flotte ----------
(() => {
  const tL = cue("s4-2", "litre") - 0.5,
    t35 = cue("s4-2", "trente") - 0.3,
    tSp = cue("s4-2", "cuillères") - 0.6,
    tM = cue("s4-4", "Morte") - 0.7,
    tF = cue("s4-4", "flotte") - 0.5,
    tJ = cue("s4-5", "journal") - 0.5;
  const spoon = (x, y, k) =>
    `<g transform="translate(${x} ${y}) scale(${f2(k)})"><path d="M90 10 H300" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/><path d="M90 10 H300" stroke="#9AA6B8" stroke-width="12" stroke-linecap="round"/><ellipse cx="0" cy="10" rx="100" ry="40" fill="#9AA6B8" class="ink" stroke-width="5"/><path d="M-80 0 Q0 -90 80 0 Z" fill="#fff" class="ink" stroke-width="4"/></g>`;
  onDraw("s4", (t) => {
    const b = ramp(t, tM, tM + 0.6);
    let s = "";
    if (b < 1) {
      let g = `<path d="M130 850 H1100" class="ink" stroke-width="6"/>`;
      const k = ramp(t, scn("s4").start + 0.2, scn("s4").start + 0.6),
        lv = 6 * Math.sin(t * 3);
      g += `<g transform="translate(0 ${f2(40 * (1 - k))})" opacity="${f2(k)}"><rect x="330" y="240" width="90" height="60" rx="10" fill="${C.blue}" class="ink" stroke-width="5"/><path d="M270 400 Q270 300 340 300 H410 Q480 300 480 400 V800 Q480 846 434 846 H316 Q270 846 270 800 Z" fill="#fff" class="ink" stroke-width="6"/><path d="M278 ${f2(430 + lv)} q50 -16 100 0 t96 0 V800 Q474 838 434 838 H316 Q278 838 278 800 Z" fill="#8FD3FF"/>${txt(375, 640, "1 litre", 44, { w: 700 })}</g>`;
      if (t < tL + 0.4) {
        const q = 1 - ramp(t, tL, tL + 0.4);
        g += `<g opacity="${f2(q * k)}" transform="translate(640 ${f2(330 + 12 * Math.sin(t * 9))}) rotate(${f2(150 + 10 * Math.sin(t * 13))})"><rect x="-44" y="-80" width="88" height="130" rx="20" fill="#fff" class="ink" stroke-width="5"/><rect x="-50" y="-106" width="100" height="40" rx="14" fill="#9AA6B8" class="ink" stroke-width="5"/></g>${txt(820, 560, "?", 200, { w: 700, fill: C.fire, op: q * k })}`;
        for (let i = 0; i < 6; i++) {
          const u = (t * 1.3 + i / 6) % 1;
          g += saltSVG(590 - i * 8, 400 + u * 200, 6, u * 300, q * k * (1 - u * 0.6));
        }
      }
      const p = ramp(t, t35, t35 + 0.35);
      if (p > 0)
        g += `<g transform="translate(790 440) scale(${f2(0.5 + 0.5 * p + 0.03 * Math.sin(t * 5))})" opacity="${f2(p)}">${txt(0, 0, "35 g", 170, { w: 700, fill: C.fire })}${txt(0, 120, "de sel", 54, { w: 600 })}</g>`;
      for (let i = 0; i < 2; i++) {
        const q = ramp(t, tSp + i * 0.25, tSp + 0.4 + i * 0.25);
        if (q > 0)
          g += `<g opacity="${f2(q)}" transform="translate(0 ${f2(-30 * (1 - q) + 5 * Math.sin(t * 3 + i))})">${spoon(640, 640 + i * 110, 1)}</g>`;
      }
      s += `<g opacity="${f2(1 - b)}">${g}</g>`;
    }
    if (b > 0) {
      // la mer Morte : on flotte comme un bouchon
      let g =
        sunSVG(1600, 280, 70, t) +
        mountSVG(400, 330, 420, 660, false) +
        seaSVG(130, 1790, 640, 850, t * 0.6);
      for (let i = 0; i < 46; i++)
        g += saltSVG(160 + rnd(i) * 1600, 700 + rnd(i + 60) * 130, 7, rnd(i) * 90 + t * 10);
      const f = ramp(t, tF, tF + 0.6),
        y = 628 + 8 * Math.sin(t * 2) - 40 * (1 - f);
      g += `<g opacity="${f2(f)}"><rect x="820" y="${f2(y - 26)}" width="300" height="56" rx="28" fill="${C.blue}" class="ink" stroke-width="5"/><circle cx="790" cy="${f2(y - 10)}" r="46" fill="#FFD9B8" class="ink" stroke-width="5"/><path d="M750 ${f2(y - 30)} Q790 ${f2(y - 80)} 830 ${f2(y - 30)} Z" fill="${C.ink}"/><path d="M1110 ${f2(y)} l70 -20 M1110 ${f2(y + 10)} l76 6" class="ink" stroke-width="14" stroke-linecap="round"/><path d="M776 ${f2(y - 4)} q14 10 28 0" fill="none" class="ink" stroke-width="5"/></g>`;
      const j = ramp(t, tJ, tJ + 0.4);
      if (j > 0)
        g += `<g opacity="${f2(j)}" transform="translate(900 ${f2(y - 150 + 30 * (1 - j))}) rotate(-6)"><rect x="-110" y="-70" width="220" height="140" rx="8" fill="#fff" class="ink" stroke-width="5"/><path d="M0 -70 V70 M-90 -40 h70 M-90 -14 h70 M-90 12 h70 M20 -40 h70 M20 -14 h70 M20 12 h70" class="ink" stroke-width="5"/><path d="M-50 70 L-60 130 M50 70 L60 130" stroke="#FFD9B8" stroke-width="20" stroke-linecap="round"/></g>`;
      g += `<g transform="translate(1420 470) rotate(-6) scale(${f2(1 + 0.04 * Math.sin(t * 4))})">${txt(0, 0, "× 10", 150, { w: 700, fill: C.fire })}</g>`;
      s += `<g opacity="${f2(b)}">${g}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", t35 + 0.4);
  tl.to("#s4-n1", { opacity: 0, duration: 0.3 }, tM - 0.2);
  show("#s4-n2", tM + 0.6);
})();
