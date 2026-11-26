// ---------- Scène 0 : deux yeux ou un seul ? Le cyclope rate la balle ; un œil, c'est presque un appareil photo ----------
(() => {
  const tM = cue("s0-1", "milieu") - 0.6,
    tB = cue("s0-2", "balle") - 0.8,
    tA = cue("s0-3", "appareil") - 0.6;
  onDraw("s0", (t) => {
    const cam = ramp(t, tA, tA + 0.5),
      look = 10 * Math.sin(t * 1.6);
    let g = `<circle cx="520" cy="560" r="170" fill="#FFD9B8" class="ink" stroke-width="6"/><circle cx="460" cy="530" r="40" fill="#fff" class="ink" stroke-width="5"/><circle cx="580" cy="530" r="40" fill="#fff" class="ink" stroke-width="5"/><circle cx="${f2(460 + look)}" cy="530" r="18" fill="${C.ink}"/><circle cx="${f2(580 + look)}" cy="530" r="18" fill="${C.ink}"/><path d="M470 640 q50 36 100 0" fill="none" class="ink" stroke-width="7" stroke-linecap="round"/>`;
    const cy = ramp(t, tM, tM + 0.4);
    if (cy > 0) {
      g += `<g opacity="${f2(cy)}" transform="translate(${f2(40 * (1 - cy))} 0)"><circle cx="1240" cy="560" r="170" fill="#B7DB8A" class="ink" stroke-width="6"/><circle cx="1240" cy="520" r="70" fill="#fff" class="ink" stroke-width="5"/><circle cx="${f2(1240 + look * 1.6)}" cy="520" r="30" fill="${C.ink}"/><path d="M1190 650 q50 ${t > tB + 1.1 ? -24 : 30} 100 0" fill="none" class="ink" stroke-width="7" stroke-linecap="round"/></g>`;
      // la balle arrive ; la main du cyclope se referme trop tôt, à côté
      const u = (t - tB) / 1.4;
      if (u > 0 && u < 1.4) {
        const bx = lerp(1900, 1380, Math.min(1, u)) - (u > 1 ? (u - 1) * 500 : 0),
          by = 360 + 200 * u * u;
        g += `<circle cx="${f2(bx)}" cy="${f2(by)}" r="34" fill="#E0455E" class="ink" stroke-width="5"/>`;
      }
      if (u > 0)
        g += `<path d="M1400 640 Q1500 ${f2(600 - 120 * Math.min(1, u * 2))} ${f2(1560)} ${f2(lerp(640, 330, Math.min(1, u * 2)))}" fill="none" stroke="${C.ink}" stroke-width="40" stroke-linecap="round"/><path d="M1400 640 Q1500 ${f2(600 - 120 * Math.min(1, u * 2))} 1560 ${f2(lerp(640, 330, Math.min(1, u * 2)))}" fill="none" stroke="#B7DB8A" stroke-width="28" stroke-linecap="round"/>`;
    }
    let s = `<g opacity="${f2(1 - cam)}">${g}</g>`;
    if (cam > 0)
      s += `<g opacity="${f2(cam)}">${frontEyeSVG(560, 540, 120, 0.42 + 0.06 * Math.sin(t * 2))}${txt(960, 590, "≈", 170, { w: 700, fill: "#C25E00" })}<g transform="translate(1360 ${f2(540 + 6 * Math.sin(t * 2))})"><rect x="-220" y="-130" width="440" height="280" rx="40" fill="#39425C" class="ink" stroke-width="6"/><rect x="-90" y="-180" width="150" height="60" rx="14" fill="#39425C" class="ink" stroke-width="6"/><circle r="100" fill="#D3DAE6" class="ink" stroke-width="6"/><circle r="64" fill="${C.blue}" class="ink" stroke-width="5"/><circle r="26" fill="${C.ink}"/><circle cx="160" cy="-80" r="18" fill="${C.hot}" class="ink" stroke-width="4"/></g></g>`;
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tA + 0.6);
})();
