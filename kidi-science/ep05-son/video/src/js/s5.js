// ---------- Scène 5 : l'écho (le son rebondit sur la paroi), puis la chauve-souris ----------
(() => {
  const tShout = cue("s5-1", "crie") - 0.3,
    tGo = cue("s5-2", "file") - 0.4,
    tBat = cue("s5-4", "chauves") - 0.7;
  const PX = 330,
    WX = 1560,
    Y = 600,
    V = 620; // la personne, la paroi, la vitesse du front d'onde à l'écran
  const arc = (x, r, dir, col, op) =>
    `<path d="M${f2(x + r * Math.cos(rad(dir - 30)))} ${f2(Y + r * Math.sin(rad(dir - 30)))} A${f2(r)} ${f2(r)} 0 0 1 ${f2(x + r * Math.cos(rad(dir + 30)))} ${f2(Y + r * Math.sin(rad(dir + 30)))}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" opacity="${f2(op)}"/>`;
  onDraw("s5", (t) => {
    const bat = ramp(t, tBat, tBat + 0.5);
    let s = "";
    if (bat < 1) {
      let g =
        `<path d="M100 860 H1820" class="ink" stroke-width="8"/><path d="M${WX} 860 V260 L${WX + 90} 220 L${WX + 200} 300 L1820 280 V860 Z" fill="#9AA6B8" class="ink" stroke-width="6"/>` +
        figSVG(PX, 856, 1.5, C.blue);
      // un cri part toutes les 4,4 s : aller (bleu), rebond, retour (orange)
      for (const t0 of [tShout, tGo + 0.2, tGo + 4.6]) {
        const u = t - t0,
          d = WX - PX - 60;
        if (u < 0 || u > (2 * d) / V + 0.4) continue;
        for (let i = 0; i < 3; i++) {
          const r = u * V - i * 50;
          if (r > 40 && r <= d) g += arc(PX + 50, r, 0, C.blueL, 1 - i * 0.3);
          const rb = r - d;
          if (rb > 0 && rb < d) g += arc(WX, rb, 180, C.fire, 1 - i * 0.3);
        }
      }
      s += `<g opacity="${f2(1 - bat)}">${g}</g>`;
    }
    if (bat > 0) {
      // la nuit : une chauve-souris envoie des cris, un papillon les renvoie
      const bx = 420 + 60 * Math.sin(t * 0.8),
        by = 520 + 40 * Math.sin(t * 1.3),
        mx = 1420,
        my = 500 + 30 * Math.sin(t * 1.7);
      let g = `<rect x="0" y="0" width="1920" height="1080" fill="${C.ink}"/>`;
      for (let i = 0; i < 30; i++)
        g += `<circle cx="${f2(rnd(i) * 1920)}" cy="${f2(rnd(i + 60) * 700)}" r="${1.5 + rnd(i + 9) * 2.5}" fill="#fff" opacity="0.8"/>`;
      const u = (t - tBat) % 2.6,
        d = mx - bx - 80,
        r = u * 760;
      for (let i = 0; i < 3; i++) {
        const rr = r - i * 44;
        if (rr > 30 && rr <= d)
          g += `<path d="M${f2(bx + 60 + rr * Math.cos(rad(-28)))} ${f2(by + rr * Math.sin(rad(-28)))} A${f2(rr)} ${f2(rr)} 0 0 1 ${f2(bx + 60 + rr * Math.cos(rad(28)))} ${f2(by + rr * Math.sin(rad(28)))}" fill="none" stroke="#8FD3FF" stroke-width="10" stroke-linecap="round" opacity="${f2(1 - i * 0.3)}"/>`;
        const rb = rr - d;
        if (rb > 0 && rb < d)
          g += `<path d="M${f2(mx - 40 + rb * Math.cos(rad(152)))} ${f2(my + rb * Math.sin(rad(152)))} A${f2(rb)} ${f2(rb)} 0 0 1 ${f2(mx - 40 + rb * Math.cos(rad(208)))} ${f2(my + rb * Math.sin(rad(208)))}" fill="none" stroke="${C.fire}" stroke-width="10" stroke-linecap="round" opacity="${f2(1 - i * 0.3)}"/>`;
      }
      const fl = 30 * Math.sin(t * 14);
      g += `<g transform="translate(${f2(bx)} ${f2(by)})"><path d="M0 0 C -60 ${f2(-80 - fl)}, -150 ${f2(-60 - fl)}, -190 ${f2(10 - fl)} C -150 0, -120 20, -100 40 C -70 10, -40 20, 0 30 Z M0 0 C 60 ${f2(-80 - fl)}, 150 ${f2(-60 - fl)}, 190 ${f2(10 - fl)} C 150 0, 120 20, 100 40 C 70 10, 40 20, 0 30 Z" fill="#6E7FA6" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><ellipse cx="0" cy="14" rx="30" ry="42" fill="#55607A" stroke="#fff" stroke-width="4"/><path d="M-20 -18 L-26 -50 L-6 -26 Z M20 -18 L26 -50 L6 -26 Z" fill="#55607A" stroke="#fff" stroke-width="4"/><circle cx="-10" cy="0" r="5" fill="#fff"/><circle cx="10" cy="0" r="5" fill="#fff"/></g>`;
      g += `<g transform="translate(${mx} ${f2(my)})"><path d="M0 0 C -50 -60, -90 -20, -40 20 Z M0 0 C 50 -60, 90 -20, 40 20 Z" fill="#F2D9A0" stroke="#fff" stroke-width="4"/><ellipse cx="0" cy="8" rx="9" ry="26" fill="#B9772E" stroke="#fff" stroke-width="3"/></g>`;
      s += `<g opacity="${f2(bat)}">${g}</g>`;
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", cue("s5-2", "rebondit") - 0.4);
  tl.to("#s5-n1", { opacity: 0, duration: 0.3 }, tBat - 0.1);
  show("#s5-n2", tBat + 0.6);
})();
