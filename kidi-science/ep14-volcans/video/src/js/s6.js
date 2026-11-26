// ---------- Scène 6 : le résumé, puis le nuage qui pèse plus qu'un troupeau d'éléphants ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "nuages") - 0.8,
    tEl = cue("s6-4", "éléphants") - 0.8;
  const eleph = (x, y, k) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) scale(${k})"><ellipse rx="90" ry="64" fill="#A7AFBA" class="ink" stroke-width="5"/><circle cx="-90" cy="-30" r="50" fill="#A7AFBA" class="ink" stroke-width="5"/><path d="M-130 -20 Q-170 40 -140 80" fill="none" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/><path d="M-130 -20 Q-170 40 -140 80" fill="none" stroke="#A7AFBA" stroke-width="16" stroke-linecap="round"/><ellipse cx="-70" cy="-40" rx="26" ry="36" fill="#8E96A3" class="ink" stroke-width="4"/><circle cx="-106" cy="-40" r="6" fill="${C.ink}"/><rect x="-60" y="40" width="30" height="50" rx="8" fill="#A7AFBA" class="ink" stroke-width="5"/><rect x="30" y="40" width="30" height="50" rx="8" fill="#A7AFBA" class="ink" stroke-width="5"/></g>`;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // la balance : un nuage d'un côté, des éléphants de l'autre
    const el = ramp(t, tEl, tEl + 0.8),
      tilt = lerp(-8, 6, el) + 1.5 * Math.sin(t * 2);
    let s = `<path d="M560 850 L520 560 H600 Z" fill="#9AA6B8" class="ink" stroke-width="5"/><g transform="rotate(${f2(tilt)} 560 560)"><path d="M200 560 H920" class="ink" stroke-width="16" stroke-linecap="round"/><path d="M200 560 v60 M920 560 v60" class="ink" stroke-width="6"/><path d="M110 620 H290 M830 620 H1010" class="ink" stroke-width="12" stroke-linecap="round"/>${cloudSVG(200, 500, 0.9, 0.2)}`;
    if (el > 0)
      s += `<g opacity="${f2(el)}">${eleph(880, 520, 0.6)}${eleph(990, 540, 0.45)}${eleph(800, 548, 0.4)}</g>`;
    s += `</g>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "croûte") - 0.8, { y: 50 });
  show("#s6-k2", cue("s6-1", "gaz") - 0.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "lave") - 0.8, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "nuages") - 0.4,
  );
  pop("#s6-next", cue("s6-4", "prochaine") - 0.3);
  const tEnd = S.end - 3.2;
  tl.to("#s6-main", { y: -200, opacity: 0, duration: 0.45, ease: INN }, tEnd);
  tl.fromTo(
    "#s6-end",
    { opacity: 0, scale: 0.5, y: 80 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
    tEnd + 0.4,
  );
  show("#s6-bye", tEnd + 0.9);
})();
