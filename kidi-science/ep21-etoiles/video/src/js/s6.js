// ---------- Scène 6 : le résumé, puis l'avion : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tAv = cue("s6-3", "avion") - 0.8;
  onDraw("s6", (t) => {
    if (t < tAv - 0.3) return;
    // un avion qui traverse le ciel
    const u = ((t - tAv) * 0.16) % 1,
      x = lerp(240, 900, u),
      y = 600 - 90 * Math.sin(u * Math.PI) + 6 * Math.sin(t * 5);
    let s = `<rect x="200" y="330" width="760" height="460" rx="34" fill="#8FCBFF" class="ink" stroke-width="5"/><clipPath id="s6-c"><rect x="204" y="334" width="752" height="452" rx="30"/></clipPath><g clip-path="url(#s6-c)">${cloudSVG(360 - ((t * 20) % 60), 430, 0.9)}${cloudSVG(760 - ((t * 14) % 60), 690, 1.1)}`;
    s += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(-14 * Math.cos(u * Math.PI))})"><path d="M-30 -8 L-70 -70 H-40 L20 -8 Z M-30 8 L-70 70 H-40 L20 8 Z" fill="#C8CDD6" class="ink" stroke-width="4"/><path d="M-130 -16 H70 Q120 -14 130 4 Q118 18 70 18 H-130 Q-146 2 -130 -16 Z" fill="#fff" class="ink" stroke-width="4"/><path d="M-128 -14 L-160 -60 H-136 L-96 -14 Z" fill="#E0455E" class="ink" stroke-width="4"/><path d="M-60 -4 h14 m12 0 h14 m12 0 h14 m12 0 h14" stroke="${C.blue}" stroke-width="8"/></g></g>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "soleil") - 1.0, { y: 50 });
  show("#s6-k2", cue("s6-1", "boule") - 0.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "années") - 1.4, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tAv - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tAv);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "avion") - 0.2,
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
