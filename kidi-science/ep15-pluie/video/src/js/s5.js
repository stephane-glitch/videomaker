// ---------- Scène 5 : la vraie forme d'une goutte : pas une larme, mais une bille… ou un pain à hamburger ----------
(() => {
  const tL = cue("s5-1", "larme") - 0.6,
    tX = cue("s5-2", "légende") - 0.4,
    tB = cue("s5-2", "bille") - 0.6,
    tH = cue("s5-2", "hamburger") - 1.0,
    tR = cue("s5-3", "hamburgers") - 0.6;
  const card = (x, k, body, lab) =>
    k <= 0
      ? ""
      : `<g transform="translate(${x} ${f2(540 + 30 * (1 - k))})" opacity="${f2(k)}"><rect x="-220" y="-250" width="440" height="480" rx="34" fill="#fff" class="ink" stroke-width="4"/>${body}${txt(0, 190, lab, 38, { w: 700 })}</g>`;
  onDraw("s5", (t) => {
    const r = ramp(t, tR, tR + 0.5),
      wob = 6 * Math.sin(t * 5);
    let g = card(
      420,
      ramp(t, tL, tL + 0.35),
      `<path d="M0 -180 C 70 -80, 110 -30, 110 30 A 110 110 0 0 1 -110 30 C -110 -30, -70 -80, 0 -180 Z" fill="#5FB4F0" class="ink" stroke-width="6"/>` +
        (t > tX
          ? `<path d="M-130 -150 L130 110 M130 -150 L-130 110" stroke="#E0455E" stroke-width="28" stroke-linecap="round" opacity="${f2(ramp(t, tX, tX + 0.2))}"/>`
          : ""),
      "La larme : une légende",
    );
    g += card(
      960,
      ramp(t, tB, tB + 0.35),
      `<circle cy="${f2(-40 + wob)}" r="70" fill="#5FB4F0" class="ink" stroke-width="6"/><circle cx="-24" cy="${f2(-64 + wob)}" r="16" fill="#fff" opacity="0.8"/>`,
      "Petite : une bille",
    );
    g += card(
      1500,
      ramp(t, tH, tH + 0.35),
      `<path d="M-150 ${f2(-10 + wob)} Q-150 -130 0 ${f2(-130 + wob)} Q150 -130 150 ${f2(-10 + wob)} Q0 ${f2(20 + wob)} -150 ${f2(-10 + wob)} Z" fill="#5FB4F0" class="ink" stroke-width="6"/>` +
        [0, 1, 2]
          .map((i) =>
            arrowSVG(
              -90 + i * 90,
              110 - ((t * 60 + i * 20) % 50),
              -90 + i * 90,
              60 - ((t * 60 + i * 20) % 50),
              C.fire,
              10,
              0.9,
            ),
          )
          .join(""),
      "Grosse : aplatie par l’air",
    );
    let s = `<g opacity="${f2(1 - 0.85 * r)}">${g}</g>`;
    // il pleut des hamburgers
    if (r > 0)
      for (let i = 0; i < 9; i++) {
        const u = (t * 0.5 + rnd(i)) % 1,
          x = 220 + i * 180,
          y = 180 + u * 640;
        s += `<g opacity="${f2(r * (1 - u * 0.3))}" transform="translate(${x} ${f2(y)}) rotate(${f2(10 * Math.sin(t * 3 + i))}) scale(0.7)"><path d="M-70 0 Q-70 -70 0 -70 Q70 -70 70 0 Z" fill="#E2B56D" class="ink" stroke-width="5"/><rect x="-76" y="0" width="152" height="18" rx="8" fill="#3DBE8B" class="ink" stroke-width="4"/><rect x="-70" y="18" width="140" height="24" rx="10" fill="#8A5A22" class="ink" stroke-width="4"/><rect x="-70" y="42" width="140" height="26" rx="12" fill="#E2B56D" class="ink" stroke-width="5"/></g>`;
      }
    $("#s5-draw").innerHTML = s;
  });
  pop("#s5-n1", tH + 0.6);
})();
