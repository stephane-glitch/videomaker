// ---------- Scène 6 : le résumé, les oiseaux sur le câble, puis la tartine qui tombe (annonce de la gravité) ----------
(() => {
  const S = scn("s6");
  const tBird = cue("s6-3", "oiseaux") - 0.7,
    tWhy = cue("s6-4", "seul") - 0.4,
    tFall = cue("s6-5", "tartine") - 0.6,
    tG = cue("s6-6", "gravité") - 0.3;
  const bird = (x, y, flip, hop) =>
    `<g transform="translate(${f2(x)} ${f2(y - hop)}) scale(${flip ? -1 : 1} 1)"><path d="M-14 46 V78 M14 46 V78" class="ink"/><path d="M-70 10 L-130 -10 L-80 34 Z" fill="#5F86F0" class="ink"/><ellipse cx="0" cy="0" rx="78" ry="56" fill="#7C97E8" class="ink" stroke-width="5"/><circle cx="62" cy="-48" r="40" fill="#7C97E8" class="ink" stroke-width="5"/><path d="M96 -52 L132 -40 L96 -28 Z" fill="${C.fire}" class="ink"/><circle cx="72" cy="-56" r="8" fill="${C.ink}"/><path d="M-30 -4 Q10 30 44 0" fill="none" stroke="${C.blueD}" stroke-width="5" stroke-linecap="round"/></g>`;
  onDraw("s6", (t) => {
    let s = "";
    const fall = lin(t, tFall, tFall + 1.1);
    if (t > tBird - 0.3 && fall < 1.4) {
      // deux câbles entre deux poteaux ; les électrons filent dans celui du haut
      for (const x of [170, 1750])
        s += `<path d="M${x} 300 V900 M${x - 90} 380 H${x + 90} M${x - 90} 560 H${x + 90}" fill="none" class="ink" stroke-width="12"/>`;
      s +=
        wireSVG("M170 380 Q960 470 1750 380", "#F2C9A0", 20) +
        wireSVG("M170 560 Q960 650 1750 560", "#F2C9A0", 20);
      for (let i = 0; i < 14; i++) {
        const u = (((t * 0.12 + i / 14) % 1) + 1) % 1,
          x = 170 + u * 1580,
          y = 380 + 180 * u * (1 - u) * 2 * 0.99;
        s += ball(x, y, 11, C.spark, { w: 3 });
      }
      const yw = (x) => 380 + 180 * ((x - 170) / 1580) * (1 - (x - 170) / 1580) * 2 * 0.99;
      s +=
        bird(700, yw(700) - 78, false, 8 * Math.max(0, Math.sin(t * 5))) +
        bird(1150, yw(1150) - 78, true, 0);
    }
    // la tartine qui tombe, côté confiture
    if (t > tFall) {
      const u = Math.min(1, fall),
        y = -160 + 1020 * u * u,
        rot = 180 * Math.min(1, u * 1.05);
      s += `<rect x="0" y="0" width="1920" height="1080" fill="#FFF8EC" opacity="${f2(Math.min(1, lin(t, tFall, tFall + 0.3)))}"/><path d="M200 900 H1720" class="ink" stroke-width="8"/>`;
      s += `<g transform="translate(960 ${f2(Math.min(y, 860))}) rotate(${f2(rot)})"><rect x="-150" y="-26" width="300" height="52" rx="20" fill="#EBC07E" stroke="#B9772E" stroke-width="8"/><rect x="-140" y="-40" width="280" height="24" rx="12" fill="#E0455E"/></g>`;
      if (u >= 1)
        s += `<path d="M830 896 q20 -30 50 -6 q40 -34 80 0 q40 -30 80 2 q30 -22 60 6 Z" fill="#E0455E"/>`;
      const g = ramp(t, tG, tG + 0.4);
      if (g > 0)
        s += `<g opacity="${f2(g)}"><path d="M1360 330 V700 M1300 640 L1360 720 L1420 640" fill="none" stroke="${C.fire}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    }
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "électrons") - 0.4, { y: 50 });
  show("#s6-k2", cue("s6-1", "boucle") - 0.4, { y: 50 });
  show("#s6-k3", cue("s6-1", "pousse") - 0.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tBird - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tBird);
  show("#s6-n1", tWhy + 0.2);
  tl.to("#s6-n1", { opacity: 0, duration: 0.25 }, tFall - 0.1);
  pop("#s6-next", tG + 0.5);
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
