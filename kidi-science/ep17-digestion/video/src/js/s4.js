// ---------- Scène 4 : le gros intestin récupère l'eau et héberge des milliards de bactéries ; un à deux jours de voyage ----------
(() => {
  const tE = cue("s4-2", "eau") - 0.8,
    tB = cue("s4-2", "bactéries") - 0.8,
    tT = cue("s4-4", "toilettes") - 0.8,
    tJ = cue("s4-6", "jours") - 0.8;
  const bact = (x, y, rot, col, t, i) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})"><rect x="-34" y="-18" width="68" height="36" rx="18" fill="${col}" class="ink" stroke-width="4"/><circle cx="-10" cy="-3" r="4" fill="${C.ink}"/><circle cx="8" cy="-3" r="4" fill="${C.ink}"/><path d="M-8 7 q7 6 14 0" fill="none" class="ink" stroke-width="3"/><path d="M34 0 q${f2(14 + 6 * Math.sin(t * 9 + i))} -10 26 0" fill="none" class="ink" stroke-width="3"/></g>`;
  onDraw("s4", (t) => {
    const to = ramp(t, tT, tT + 0.5);
    let s = tractSVG(360, 560, 0.75, 3, lerp(9 / 13, 1, ((t - scn("s4").start) * 0.05) % 1), t);
    let g = `<path d="M820 600 H1720" stroke="${C.ink}" stroke-width="330" stroke-linecap="round"/><path d="M820 600 H1720" stroke="#D9A260" stroke-width="312" stroke-linecap="round"/><path d="M820 600 H1720" stroke="#E6B45A" stroke-width="220" stroke-linecap="round" opacity="0.6"/>`;
    // l'eau quitte la purée et rejoint la paroi
    const e = ramp(t, tE, tE + 0.4);
    if (e > 0)
      for (let i = 0; i < 10; i++) {
        const u = (t * 0.4 + i / 10) % 1,
          up = i % 2 ? -1 : 1;
        g += `<path d="M${860 + i * 90} ${f2(600 + up * u * 130)} q-10 16 0 24 q10 -8 0 -24 Z" fill="${C.air}" class="ink" stroke-width="2.5" opacity="${f2(e * (1 - u * 0.4))}"/>`;
      }
    // les bactéries, colocataires
    const b = ramp(t, tB, tB + 0.5);
    if (b > 0)
      for (let i = 0; i < 9; i++)
        g += `<g opacity="${f2(b)}">${bact(900 + (i % 5) * 180 + 20 * Math.sin(t * 1.5 + i), 550 + Math.floor(i / 5) * 100 + 14 * Math.cos(t * 2 + i), 20 * Math.sin(t + i), ["#3DBE8B", "#8E5BD6", "#5F86F0", "#F7A8B8"][i % 4], t, i)}</g>`;
    s += `<g opacity="${f2(1 - 0.85 * to)}">${g}</g>`;
    // la sortie
    if (to > 0)
      s += `<g opacity="${f2(to)}" transform="translate(1280 ${f2(620 + 20 * (1 - to))})"><rect x="-150" y="-260" width="300" height="200" rx="24" fill="#fff" class="ink" stroke-width="6"/><path d="M-170 -60 H170 Q170 110 0 110 Q-170 110 -170 -60 Z" fill="#fff" class="ink" stroke-width="6"/><rect x="-60" y="110" width="120" height="120" rx="14" fill="#fff" class="ink" stroke-width="6"/><circle cx="110" cy="-200" r="16" fill="#9AA6B8" class="ink" stroke-width="4"/></g>`;
    const j = ramp(t, tJ, tJ + 0.3);
    if (j > 0)
      s += `<g transform="translate(1280 240) scale(${f2(j * (1 + 0.04 * Math.sin(t * 6)))})">${txt(0, 0, "1 à 2 jours", 110, { w: 700, fill: "#C25E00" })}</g>`;
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tB + 0.6);
  tl.to("#s4-n1", { opacity: 0, duration: 0.3 }, tT);
  pop("#s4-n2", tJ + 0.4);
})();
