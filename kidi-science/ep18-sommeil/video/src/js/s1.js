// ---------- Scène 1 : le rangement : la journée s'entasse en vrac, la nuit le cerveau trie et range dans la mémoire ----------
(() => {
  const tV = cue("s1-1", "vrac") - 1.6,
    tT = cue("s1-1", "trie") - 0.5,
    tP = cue("s1-2", "poésie") - 0.6;
  const COL = [
    "#E0455E",
    "#2F5BD3",
    "#3DBE8B",
    "#FFD23F",
    "#8E5BD6",
    "#FF8A1F",
    "#8FD3FF",
    "#F7A8B8",
    "#A7AFBA",
    "#A7AFBA",
    "#A7AFBA",
    "#3DBE8B",
  ];
  const KEEP = [0, 1, 2, 3, 4, 5, 6, 7, 11];
  onDraw("s1", (t) => {
    // l'étagère de la mémoire, et la corbeille pour le reste
    let s = `<path d="M130 850 H1790" class="ink" stroke-width="6"/>${txt(1420, 250, "La mémoire", 44, { w: 700 })}`;
    for (let r = 0; r < 3; r++)
      s += `<rect x="1180" y="${400 + r * 150}" width="480" height="18" rx="6" fill="#B9772E" class="ink" stroke-width="4"/>`;
    s += `<path d="M1180 280 V850 M1660 280 V850" class="ink" stroke-width="10"/><path d="M880 850 L900 720 H1020 L1040 850 Z" fill="#9AA6B8" class="ink" stroke-width="5"/>`;
    // les souvenirs de la journée : en vrac, puis rangés un par un
    for (let i = 0; i < 12; i++) {
      const drop = ramp(t, tV + i * 0.12, tV + 0.4 + i * 0.12);
      if (drop <= 0) continue;
      const x0 = 300 + rnd(i) * 420,
        y0 = 800 - Math.floor(i / 4) * 70 - rnd(i + 9) * 30,
        rot0 = (rnd(i + 3) - 0.5) * 80;
      const keep = KEEP.indexOf(i),
        go = ramp(t, tT + i * 0.28, tT + 0.7 + i * 0.28);
      const x1 = keep >= 0 ? 1230 + (keep % 3) * 150 : 960,
        y1 = keep >= 0 ? 352 + Math.floor(keep / 3) * 150 : 790;
      const x = lerp(x0, x1, go),
        y = lerp(lerp(-80, y0, drop), y1, go) - 220 * Math.sin(go * Math.PI);
      s += `<rect x="${f2(x - 42)}" y="${f2(y - 42)}" width="84" height="84" rx="16" fill="${COL[i]}" class="ink" stroke-width="5" opacity="${f2(keep >= 0 ? 1 : 1 - 0.7 * go)}" transform="rotate(${f2(rot0 * (1 - go))} ${f2(x)} ${f2(y)})"/>`;
    }
    s += brainSVG(600, 400 + 8 * Math.sin(t * 2), 1.2) + (t > tT ? zzzSVG(700, 300, t) : "");
    // la poésie, mieux sue le lendemain
    const p = ramp(t, tP, tP + 0.4);
    if (p > 0)
      s += `<g opacity="${f2(p)}" transform="translate(900 ${f2(480 + 8 * Math.sin(t * 3))}) rotate(-6)"><rect x="-90" y="-120" width="180" height="240" rx="12" fill="#fff" class="ink" stroke-width="5"/><path d="M-60 -70 h120 M-60 -30 h100 M-60 10 h120 M-60 50 h80" class="ink" stroke-width="6" stroke-linecap="round"/><circle cx="70" cy="-110" r="36" fill="#3DBE8B" class="ink" stroke-width="5"/><path d="M52 -110 l12 14 l24 -28" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tT + 0.8);
  pop("#s1-n2", cue("s1-3", "apprendre") - 0.8);
})();
