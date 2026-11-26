// ---------- Scène 0 : la maison en coupe ; l'odeur des crêpes monte l'escalier jusqu'au lit ----------
(() => {
  const tW = cue("s0-1", "nez") - 0.4,
    tS = cue("s0-3", "escalier") - 0.5;
  const P = [
    [520, 730],
    [700, 640],
    [930, 760],
    [1010, 700],
    [1090, 640],
    [1170, 560],
    [1260, 470],
    [1330, 440],
  ];
  onDraw("s0", (t) => {
    let s = `<path d="M260 300 L900 120 L1540 300" fill="none" stroke="${C.ink}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 300 L900 120 L1540 300" fill="none" stroke="#E0455E" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><rect x="330" y="300" width="1140" height="550" fill="#fff" class="ink" stroke-width="6"/><path d="M330 560 H1180 M1330 560 H1470" class="ink" stroke-width="8"/>`;
    // l'escalier
    for (let i = 0; i < 6; i++)
      s += `<rect x="${900 + i * 50}" y="${800 - i * 48}" width="50" height="${50 + i * 48}" fill="#EBC07E" class="ink" stroke-width="4"/>`;
    // la cuisine : la plaque, la poêle, la crêpe qui saute
    s += `<rect x="400" y="770" width="240" height="80" rx="10" fill="#9AA6B8" class="ink" stroke-width="5"/><path d="M430 750 H610 V766 H430 Z" fill="#39425C" class="ink" stroke-width="4"/><path d="M610 758 H700" class="ink" stroke-width="16" stroke-linecap="round"/><ellipse cx="520" cy="${f2(736 - 50 * Math.abs(Math.sin(t * 2.6)))}" rx="78" ry="${f2(12 + 6 * Math.abs(Math.cos(t * 2.6)))}" fill="#EBC07E" class="ink" stroke-width="4"/>`;
    // la chambre : le lit, et Zoé qui dort… puis se réveille
    const up = t > tW;
    s += `<rect x="1200" y="470" width="250" height="60" rx="16" fill="${C.blue}" class="ink" stroke-width="5"/><rect x="1190" y="520" width="270" height="20" fill="#B9772E" class="ink" stroke-width="4"/><circle cx="1380" cy="${f2(up ? 430 : 456)}" r="40" fill="#FFD9B8" class="ink" stroke-width="5"/><path d="M1342 ${f2(up ? 420 : 446)} Q1380 ${f2(up ? 366 : 392)} 1418 ${f2(up ? 420 : 446)} Z" fill="${C.ink}"/>`;
    s += up
      ? `<circle cx="1366" cy="434" r="6" fill="${C.ink}"/><circle cx="1394" cy="434" r="6" fill="${C.ink}"/><path d="M1368 450 q12 10 24 0" fill="none" class="ink" stroke-width="4"/>` +
        txt(1440, 380 + 6 * Math.sin(t * 8), "!", 70, { w: 700, fill: C.fire })
      : `<path d="M1360 458 h14 M1388 458 h14" class="ink" stroke-width="4"/>` +
        txt(1440 + 10 * Math.sin(t * 2), 400 - ((t * 20) % 40), "z", 44, {
          w: 700,
          fill: C.sub ?? C.ink,
          op: 0.7,
        });
    // les molécules d'odeur suivent le chemin
    const hi = ramp(t, tS, tS + 0.4);
    if (hi > 0) {
      let d = "";
      P.forEach((p, i) => (d += (i ? "L" : "M") + p[0] + " " + p[1]));
      s += `<path d="${d}" fill="none" stroke="${C.fire}" stroke-width="8" stroke-dasharray="4 22" stroke-linecap="round" stroke-dashoffset="${f2(-t * 60)}" opacity="${f2(hi)}"/>`;
    }
    for (let i = 0; i < 12; i++) {
      const u = (t * 0.14 + i / 12) % 1,
        [x, y] = along(P, u);
      s += molSVG(
        x + 14 * Math.sin(t * 3 + i * 2),
        y - 20 + 14 * Math.cos(t * 2.4 + i),
        8,
        C.fire,
        t * 60 + i * 40,
        Math.min(1, u * 8) * Math.min(1, (1 - u) * 8),
      );
    }
    $("#s0-draw").innerHTML = s;
  });
  pop("#s0-n1", cue("s0-4", "morceaux") - 0.4);
})();
