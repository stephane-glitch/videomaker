// ---------- Scène 5 : la boire donne encore plus soif ; mais ce sel, on le récolte (marais salants) ----------
(() => {
  const tC = cue("s5-2", "corps") - 0.5,
    tS = cue("s5-2", "soif") - 0.5,
    tR = cue("s5-4", "récolte") - 0.6,
    tD = cue("s5-4", "sécher") - 0.5,
    tK = cue("s5-4", "reste") - 0.5,
    tF = cue("s5-5", "frites") - 0.5;
  onDraw("s5", (t) => {
    const b = ramp(t, tR, tR + 0.6);
    let s = "";
    if (b < 1) {
      // le verre d'eau de mer, et la réserve d'eau du corps qui baisse
      let g =
        `<path d="M130 850 H1100" class="ink" stroke-width="6"/>` + figSVG(420, 848, 2.6, C.blue);
      g += `<g transform="translate(560 ${f2(560 + 6 * Math.sin(t * 3))}) rotate(${f2(-20 * ramp(t, tC - 1.2, tC - 0.6))})"><path d="M-40 -60 H40 L30 60 H-30 Z" fill="#fff" class="ink" stroke-width="5"/><path d="M-36 -20 H36 L30 54 H-30 Z" fill="#8FD3FF"/>${saltSVG(-8, 20, 5, 20)}${saltSVG(12, 36, 5, 50)}</g>`;
      const lvl = 1 - 0.55 * ramp(t, tC, tS + 0.6);
      g += `<rect x="760" y="330" width="120" height="460" rx="26" fill="#fff" class="ink" stroke-width="6"/><rect x="772" y="${f2(342 + 436 * (1 - lvl))}" width="96" height="${f2(436 * lvl)}" rx="16" fill="#5FB4F0"/>${txt(820, 300, "L’eau de ton corps", 34, { w: 700 })}`;
      if (t > tC)
        for (let i = 0; i < 5; i++) {
          const u = (t * 0.8 + i / 5) % 1;
          g +=
            `<path d="M${f2(900 + u * 120)} ${f2(520 + i * 30 + u * 60)} q-8 14 0 20 q8 -6 0 -20 Z" fill="${C.air}" class="ink" stroke-width="2.5" opacity="${f2(1 - u)}"/>` +
            saltSVG(910 + u * 130, 540 + i * 30 + u * 60, 5, u * 200, 1 - u);
        }
      const th = ramp(t, tS, tS + 0.4);
      if (th > 0)
        g += `<g transform="translate(1020 420) rotate(8) scale(${f2(th * (1 + 0.05 * Math.sin(t * 6)))})">${txt(0, 0, "Encore plus soif !", 54, { w: 700, fill: C.fire, anchor: "start" })}</g>`;
      s += `<g opacity="${f2(1 - b)}">${g}</g>`;
    }
    if (b > 0) {
      // les marais salants : l'eau sèche au soleil, le sel reste en petits tas
      const dry = ramp(t, tD, tK + 1.2),
        salt = ramp(t, tK, tK + 1.4);
      let g = sunSVG(330, 280, 84 + 6 * Math.sin(t * 3), t);
      for (let i = 0; i < 3; i++) {
        const x = 260 + i * 440;
        g += `<path d="M${x} 600 H${x + 380} L${x + 420} 800 H${x - 40} Z" fill="#E6CF9F" class="ink" stroke-width="5"/><path d="M${x + 14} ${f2(612 + 20 * dry)} H${x + 366} L${f2(x + 396)} ${f2(786 - 60 * dry)} H${f2(x - 16)} Z" fill="#8FD3FF" opacity="${f2(1 - 0.85 * dry)}"/>`;
        if (salt > 0)
          g += `<path d="M${x + 110} 780 Q${x + 190} ${f2(780 - 150 * salt)} ${x + 270} 780 Z" fill="#fff" class="ink" stroke-width="4"/>`;
        if (dry > 0 && dry < 1)
          for (let k = 0; k < 2; k++) {
            const u = (t * 0.5 + k / 2 + i * 0.2) % 1;
            g += `<path d="M${x + 120 + k * 140} ${f2(590 - u * 160)} q14 -16 0 -32 q-14 -16 0 -32" fill="none" stroke="#5FB4F0" stroke-width="7" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
          }
      }
      // le cornet de frites
      const f = ramp(t, tF, tF + 0.4);
      if (f > 0) {
        let fr = "";
        for (let i = 0; i < 6; i++)
          fr += `<rect x="${-70 + i * 24}" y="${-150 - (i % 3) * 22}" width="20" height="150" rx="6" fill="${C.hot}" class="ink" stroke-width="4" transform="rotate(${-10 + i * 4})"/>`;
        fr += `<path d="M-90 -40 H90 L60 120 H-60 Z" fill="#E0455E" class="ink" stroke-width="5"/>`;
        for (let i = 0; i < 6; i++) {
          const u = (t * 1.1 + i / 6) % 1;
          fr += saltSVG(-60 + i * 24, -300 + u * 120, 5, u * 300, 1 - u);
        }
        g += `<g transform="translate(1560 ${f2(400 + 6 * Math.sin(t * 3))}) scale(${f2(f)})">${fr}</g>`;
      }
      s += `<g opacity="${f2(b)}">${g}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tS + 0.4);
  tl.to("#s5-n1", { opacity: 0, duration: 0.3 }, tR - 0.2);
  show("#s5-n2", tD + 0.5);
})();
