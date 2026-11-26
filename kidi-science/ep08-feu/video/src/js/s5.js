// ---------- Scène 5 : éteindre, c'est casser le triangle : l'eau, le couvercle, la coupure dans la forêt ----------
(() => {
  const tW = cue("s5-2", "eau") - 0.4,
    tL = cue("s5-2", "couvercle") - 0.5,
    tT = cue("s5-2", "arbres") - 0.8,
    tK = cue("s5-4", "éloignes") - 0.4;
  const card = (x, k, body) =>
    k <= 0
      ? ""
      : `<g transform="translate(0 ${f2(40 * (1 - k))})" opacity="${f2(k)}"><rect x="${x}" y="250" width="500" height="460" rx="34" fill="#fff" class="ink" stroke-width="4"/>${body}</g>`;
  onDraw("s5", (t) => {
    let s = "";
    // 1. l'eau refroidit
    const w = ramp(t, tW + 0.5, tW + 2.2);
    let b = logSVG(400, 640, 260, 60) + flameSVG(400, 612, 230, t, { k: 1 - w });
    for (let i = 0; i < 7; i++) {
      const u = (t * 1.3 + i / 7) % 1;
      if (t > tW)
        b += `<path d="M${f2(300 + i * 34)} ${f2(290 + u * 260)} q-10 16 0 24 q10 -8 0 -24 Z" fill="${C.air}" class="ink" stroke-width="2.5" opacity="${f2(1 - u * 0.5)}"/>`;
    }
    if (w > 0.3) b += smokeSVG(400, 600, t, w, "#fff", 8, 200);
    s += card(150, ramp(t, tW - 0.3, tW + 0.1), b);
    // 2. le couvercle étouffe
    const l = ramp(t, tL + 0.3, tL + 1.1),
      out = ramp(t, tL + 1.1, tL + 1.9);
    b =
      `<path d="M760 620 H1080 V650 Q1080 680 1050 680 H790 Q760 680 760 650 Z" fill="#39425C" class="ink" stroke-width="4"/><path d="M1080 640 H1180" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/>` +
      flameSVG(870, 622, 190, t, { k: 1 - out }) +
      flameSVG(980, 622, 150, t + 1, { k: 1 - out });
    b += `<g transform="translate(0 ${f2(lerp(-260, 0, l))})"><path d="M750 620 Q920 540 1090 620 Z" fill="#9AA6B8" class="ink" stroke-width="4"/><circle cx="920" cy="566" r="18" fill="#39425C" class="ink" stroke-width="4"/></g>`;
    s += card(710, ramp(t, tL - 0.3, tL + 0.1), b);
    // 3. la coupure : plus rien à brûler
    const cut = ramp(t, tT + 0.4, tT + 1.2),
      adv = ramp(t, tT - 0.5, tT + 3);
    b = `<path d="M1300 690 H1740" class="ink" stroke-width="5"/>`;
    for (let i = 0; i < 7; i++) {
      const x = 1340 + i * 60,
        gap = i === 3 || i === 4;
      if (gap)
        b +=
          cut < 1
            ? `<g opacity="${f2(1 - cut)}" transform="translate(0 ${f2(-60 * cut)})">${treeSVG(x, 688, 170)}</g>` +
              (cut > 0
                ? `<rect x="${x - 12}" y="664" width="24" height="24" fill="#B9772E" class="ink" stroke-width="3" opacity="${f2(cut)}"/>`
                : "")
            : `<rect x="${x - 12}" y="664" width="24" height="24" fill="#B9772E" class="ink" stroke-width="3"/>`;
      else {
        const burning = i < 3 && adv > (i + 0.5) / 4;
        b +=
          treeSVG(x, 688, 170, burning ? "#5A4A3A" : "#3DBE8B") +
          (burning ? flameSVG(x, 580, 130, t + i, { k: 1 - ramp(t, tT + 3.2, tT + 4.5) }) : "");
      }
    }
    s += card(1270, ramp(t, tT - 0.5, tT - 0.1), b);
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-c1", tW + 0.5);
  show("#s5-c2", tL + 0.5);
  show("#s5-c3", tT + 0.6);
  show("#s5-n1", tK);
  pop("#s5-n2", cue("s5-4", "dix") - 0.3);
})();
