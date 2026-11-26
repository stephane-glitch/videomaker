// ---------- Scène 6 : le résumé, puis l'aimant sur le frigo : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tAi = cue("s6-3", "aimant") - 0.8;
  onDraw("s6", (t) => {
    if (t < tAi - 0.3) return;
    // un aimant en fer à cheval attire des trombones vers la porte du frigo
    let s = `<rect x="200" y="330" width="760" height="460" rx="34" fill="#EEF4FF" class="ink" stroke-width="5"/><rect x="640" y="350" width="290" height="420" rx="24" fill="#fff" class="ink" stroke-width="5"/><path d="M640 500 H930" class="ink" stroke-width="5"/><rect x="662" y="400" width="14" height="70" rx="7" fill="${C.ink}"/><rect x="662" y="530" width="14" height="110" rx="7" fill="${C.ink}"/>`;
    const b = 6 * Math.sin(t * 3);
    s += `<g transform="translate(${f2(420 + b)} 560) rotate(90)"><path d="M-80 -90 V10 A80 80 0 0 0 80 10 V-90 H36 V10 A36 36 0 0 1 -36 10 V-90 Z" fill="#E0455E" class="ink" stroke-width="5" stroke-linejoin="round"/><rect x="-80" y="-90" width="44" height="40" fill="#D3DAE6" class="ink" stroke-width="5"/><rect x="36" y="-90" width="44" height="40" fill="#D3DAE6" class="ink" stroke-width="5"/></g>`;
    for (let i = 0; i < 3; i++) {
      const u = (t * 0.5 + i / 3) % 1;
      s += `<g transform="translate(${f2(620 - u * u * 100)} ${f2(480 + i * 80)}) rotate(${f2(30 * (1 - u) * (i - 1))})" opacity="${f2(Math.min(1, 3 - 3 * u))}"><rect x="-22" y="-8" width="44" height="16" rx="8" fill="none" stroke="#8E96A3" stroke-width="5"/></g>`;
    }
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "câbles") - 1.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "paquets") - 1.4, { y: 50 });
  show("#s6-k3", cue("s6-1", "routeurs") - 0.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tAi - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tAi);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "aimant") - 0.2,
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
