// ---------- Scène 4 : le nez bouché ; puis l'odeur de la maison que le cerveau n'annonce plus ----------
(() => {
  const S = scn("s4");
  const tBl = cue("s4-2", "bouché") - 0.5,
    tH = cue("s4-3", "maison") - 1.4,
    tLa = cue("s4-4", "lasse") - 0.5,
    tNew = cue("s4-4", "nouveautés") - 0.8,
    tSock = cue("s4-5", "chaussettes") - 0.6;
  const HX = 620,
    HY = 560;
  const P = [
    [HX - 420, HY + 30],
    [HX - 296, HY + 10],
    [HX - 240, HY - 20],
  ];
  const bell = (x, y, ring, t) =>
    `<g transform="translate(${x} ${y}) rotate(${f2(16 * ring * Math.sin(t * 22))})"><path d="M-60 40 Q-60 -70 0 -80 Q60 -70 60 40 Z" fill="${C.hot}" class="ink" stroke-width="5"/><rect x="-74" y="34" width="148" height="20" rx="10" fill="${C.hot}" class="ink" stroke-width="5"/><circle cy="66" r="14" fill="${C.ink}"/></g>` +
    (ring > 0.2
      ? [-1, 1]
          .map(
            (d) =>
              `<path d="M${x + d * 90} ${y - 50} q${d * 26} 40 0 80" fill="none" stroke="${C.fire}" stroke-width="8" stroke-linecap="round" opacity="${f2(ring)}"/>`,
          )
          .join("")
      : "");
  onDraw("s4", (t) => {
    const b = ramp(t, tH, tH + 0.6);
    let s = "";
    if (b < 1) {
      const bl = ramp(t, S.start + 0.4, tBl);
      let g = headCutSVG(HX, HY, 1, bl);
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.3 + i / 6) % 1,
          [x, y] = along(P, u < 0.6 ? u / 0.6 : 1 - (u - 0.6) / 0.4);
        g += molSVG(
          x,
          y + 8 * Math.sin(t * 4 + i) + (u > 0.6 ? 50 * (u - 0.6) : 0),
          8,
          C.fire,
          t * 60 + i * 40,
          Math.min(1, u * 6) * Math.min(1, (1 - u) * 6),
        );
      }
      g += txt(1280, 470, "Atchoum !", 90, {
        w: 700,
        fill: C.fire,
        op: 0.5 + 0.5 * Math.abs(Math.sin(t * 2.2)),
      });
      s += `<g opacity="${f2(1 - b)}">${g}</g>`;
    }
    if (b > 0) {
      // la maison et son odeur ; la cloche du cerveau sonne de moins en moins… jusqu'à l'odeur nouvelle
      const nw = ramp(t, tNew, tNew + 0.4),
        sig = Math.max(1 - ramp(t, tLa, tLa + 3.2), nw);
      let g = `<path d="M260 520 L520 320 L780 520" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 520 L520 320 L780 520" fill="none" stroke="#E0455E" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><rect x="310" y="520" width="420" height="330" fill="#fff" class="ink" stroke-width="5"/><rect x="460" y="640" width="120" height="210" rx="10" fill="${C.blue}" class="ink" stroke-width="5"/><path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
      for (let i = 0; i < 8; i++) {
        const u = (t * 0.18 + i / 8) % 1;
        g += molSVG(
          340 + rnd(i) * 360 + 14 * Math.sin(t * 2 + i),
          480 - u * 180,
          8,
          "#8E5BD6",
          t * 40 + i * 50,
          Math.sin(u * Math.PI),
        );
      }
      if (nw > 0)
        for (let i = 0; i < 5; i++) {
          const u = (t * 0.3 + i / 5) % 1;
          g += molSVG(
            860 + u * 300,
            700 - 120 * Math.sin(u * Math.PI) + i * 10,
            9,
            "#3DBE8B",
            t * 50 + i * 40,
            nw * Math.sin(u * Math.PI),
          );
        }
      g += bell(1320, 420, sig, t);
      // la courbe du signal
      let d = "";
      const T0 = tLa - 0.5,
        T1 = S.end - 0.4;
      for (let i = 0; i <= 60; i++) {
        const tt = lerp(T0, Math.min(t, T1), i / 60),
          v = Math.max(1 - ramp(tt, tLa, tLa + 3.2), ramp(tt, tNew, tNew + 0.4));
        d +=
          (i ? "L" : "M") + f2(lerp(1060, 1600, (tt - T0) / (T1 - T0))) + " " + f2(760 - v * 150);
      }
      g += `<path d="M1060 610 V760 H1600" fill="none" class="ink" stroke-width="5"/><path d="${d}" fill="none" stroke="${C.fire}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>${txt(1330, 810, "le signal envoyé par le cerveau", 30)}`;
      // la chaussette
      const so = ramp(t, tSock, tSock + 0.4);
      if (so > 0)
        g +=
          `<g transform="translate(900 ${f2(660 + 8 * Math.sin(t * 3))}) scale(${f2(so)}) rotate(-10)"><path d="M-30 -110 H40 V0 Q40 40 80 50 Q130 60 120 100 H0 Q-40 100 -36 50 Z" fill="#8FD3FF" class="ink" stroke-width="5"/><path d="M-30 -80 H40" stroke="#fff" stroke-width="12"/></g>` +
          [0, 1, 2]
            .map(
              (i) =>
                `<path d="M${900 + i * 40} ${f2(520 - ((t * 40 + i * 20) % 60))} q14 -14 0 -28 q-14 -14 0 -28" fill="none" stroke="#B7DB8A" stroke-width="8" stroke-linecap="round" opacity="${f2(so)}"/>`,
            )
            .join("");
      s += `<g opacity="${f2(b)}">${g}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tBl + 0.3);
  tl.to("#s4-n1", { opacity: 0, duration: 0.3 }, tH - 0.2);
  show("#s4-n2", tLa + 0.6);
})();
