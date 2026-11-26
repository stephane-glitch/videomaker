// ---------- Scène 2 : été (rayons droits, journées longues), hiver (rayons de biais, journées courtes) ; la lampe de poche ----------
(() => {
  const tInv = cue("s2-2", "inverse") - 0.6,
    tLa = cue("s2-3", "lampe") - 0.6,
    tFa = cue("s2-3", "face") - 0.4,
    tTr = cue("s2-3", "travers") - 0.5;
  const EX = 760,
    EY = 540,
    R = 230;
  onDraw("s2", (t) => {
    const win = ramp(t, tInv, tInv + 1.0),
      lamp = ramp(t, tLa, tLa + 0.5),
      tilt = lerp(-23, 23, win);
    let g = "";
    // les rayons du Soleil, qui arrivent de la gauche
    for (let i = 0; i < 7; i++) {
      const y = EY - 210 + i * 70,
        u = (t * 0.6 + i / 7) % 1;
      g += `<path d="M150 ${y} H${f2(EX - Math.sqrt(Math.max(0, R * R - (y - EY) ** 2)) - 10)}" stroke="${C.hot}" stroke-width="7" opacity="0.5"/><path d="M${f2(150 + u * 300)} ${y} h50" stroke="${C.fire}" stroke-width="9" stroke-linecap="round"/>`;
    }
    g += tiltEarthSVG(EX, EY, R, tilt, t * 20) + nightSVG(EX, EY, R);
    // notre maison, dans la moitié nord
    const a = rad(-135 + tilt),
      hx = EX + R * Math.cos(a),
      hy = EY + R * Math.sin(a);
    g += `<g transform="translate(${f2(hx)} ${f2(hy)}) rotate(${f2(-135 + tilt + 90)})"><path d="M-22 0 V-30 L0 -52 L22 -30 V0 Z" fill="#fff" class="ink" stroke-width="4"/><path d="M-30 -26 L0 -56 L30 -26" fill="none" stroke="#E0455E" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    // l'encart : le Soleil dans notre ciel
    const hgt = lerp(0.9, 0.28, win),
      sx = 1500,
      gy = 700,
      sy = gy - 330 * hgt,
      sunX = sx - 190 * (1 - hgt);
    g += `<rect x="1230" y="250" width="540" height="520" rx="34" fill="#DFF3FF" class="ink" stroke-width="5"/><path d="M1230 ${gy} H1770" class="ink" stroke-width="6"/><path d="M1280 ${gy} A 220 ${f2(330 * hgt)} 0 0 1 1720 ${gy}" fill="none" stroke="${C.fire}" stroke-width="5" stroke-dasharray="8 10"/>${sunSVG(sunX, sy, 44, t)}<path d="M${f2(sunX)} ${f2(sy + 60)} L1500 ${gy - 6}" stroke="${C.hot}" stroke-width="${f2(lerp(16, 40, win))}" stroke-linecap="round" opacity="${f2(lerp(0.95, 0.4, win))}"/><path d="M1478 ${gy} V${gy - 30} L1500 ${gy - 52} L1522 ${gy - 30} V${gy} Z" fill="#fff" class="ink" stroke-width="4"/>${txt(1270, 316, win > 0.5 ? "Hiver" : "Été", 54, { w: 700, fill: win > 0.5 ? C.blue : "#C25E00", anchor: "start" })}`;
    // la longueur du jour
    const day = lerp(0.66, 0.34, win);
    g += `<rect x="1280" y="722" width="440" height="30" rx="15" fill="#1B2445"/><rect x="1280" y="722" width="${f2(440 * day)}" height="30" rx="15" fill="${C.hot}"/>`;
    let s = `<g opacity="${f2(1 - lamp)}">${g}</g>`;
    if (lamp > 0) {
      // deux lampes de poche : bien en face, puis de travers
      const torch = (x, rot, k) =>
        `<g transform="translate(${x} 330) rotate(${rot}) scale(${f2(k)})"><rect x="-40" y="-170" width="80" height="170" rx="16" fill="#39425C" class="ink" stroke-width="5"/><path d="M-60 0 H60 L44 50 H-44 Z" fill="#9AA6B8" class="ink" stroke-width="5"/></g>`;
      const k1 = ramp(t, tLa + 0.3, tLa + 0.7),
        k2 = ramp(t, tTr, tTr + 0.4);
      let h = `<path d="M130 800 H1790" class="ink" stroke-width="6"/>`;
      if (k1 > 0)
        h +=
          `<g opacity="${f2(k1)}"><path d="M506 380 L470 790 H650 L614 380 Z" fill="${C.hot}" opacity="0.5"/><ellipse cx="560" cy="800" rx="100" ry="24" fill="${C.hot}" class="ink" stroke-width="4"/>${torch(560, 0, 1)}</g>` +
          txt(700, 300, "Bien en face", 44, {
            w: 700,
            op: ramp(t, tFa, tFa + 0.3),
            anchor: "start",
          });
      if (k2 > 0)
        h +=
          `<g opacity="${f2(k2)}"><path d="M1170 400 L1140 790 H1700 L1260 370 Z" fill="${C.hot}" opacity="0.22"/><ellipse cx="1420" cy="800" rx="290" ry="28" fill="#FFF0B8" class="ink" stroke-width="4"/>${torch(1180, -40, 1)}</g>` +
          txt(1420, 260, "De travers", 44, { w: 700, op: k2, anchor: "start" });
      s += `<g opacity="${f2(lamp)}">${h}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", cue("s2-1", "droit") - 0.3);
  tl.to("#s2-n1", { opacity: 0, duration: 0.3 }, cue("s2-2", "inverse") - 0.3);
  show("#s2-n2", cue("s2-2", "biais") - 0.3);
  tl.to("#s2-n2", { opacity: 0, duration: 0.3 }, cue("s2-3", "lampe") - 0.5);
  pop("#s2-n3", cue("s2-4", "expérience") - 0.6);
})();
