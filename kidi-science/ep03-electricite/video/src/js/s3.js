// ---------- Scène 3 : la pile est une pompe ; les volts mesurent la force de la poussée ----------
(() => {
  const tPump = cue("s3-2", "pompe") - 0.4,
    tV = cue("s3-3", "virgule") - 0.6,
    tPlug = cue("s3-3", "prise") - 0.6;
  const tBig = cue("s3-4", "trente") - 0.6,
    tX = cue("s3-4", "cinquante") - 0.6,
    tNo = cue("s3-4", "jamais") - 0.4;
  onDraw("s3", (t) => {
    let s = "";
    // --- la pile, vue en coupe : des flèches poussent les électrons de + vers − à l'intérieur ---
    const bx = 480,
      by = 600,
      pump = lin(t, tPump, tPump + 0.4);
    const loop = mkPath([
      [bx + 230, by],
      [bx + 330, by],
      [bx + 330, by + 180],
      [bx - 330, by + 180],
      [bx - 330, by],
      [bx - 230, by],
    ]);
    s += wireSVG(`M${bx + 230} ${by} H${bx + 330} V${by + 180} H${bx - 330} V${by} H${bx - 230}`);
    s += `<rect x="${bx - 230}" y="${by - 90}" width="460" height="180" rx="34" fill="${C.blueL}" class="ink" stroke-width="5"/><rect x="${bx + 120}" y="${by - 90}" width="110" height="180" rx="34" fill="${C.fire}" class="ink" stroke-width="5"/><rect x="${bx + 228}" y="${by - 34}" width="30" height="68" rx="8" fill="${C.metal}" class="ink"/>`;
    s +=
      txt(bx + 176, by + 22, "+", 70, { fill: "#fff", w: 700 }) +
      txt(bx - 180, by + 22, "−", 70, { fill: "#fff", w: 700 });
    if (pump > 0)
      for (let i = 0; i < 3; i++) {
        const u = (t * 0.9 + i / 3) % 1,
          x = bx + 80 - u * 230;
        s += `<path d="M${f2(x + 26)} ${by - 30} L${f2(x - 14)} ${by} L${f2(x + 26)} ${by + 30}" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity="${f2(pump * Math.sin(u * Math.PI))}"/>`;
      }
    for (let i = 0; i < 12; i++) {
      const [x, y] = loop.at(-(t * 70) + (i * loop.L) / 12);
      s += ball(x, y, 12, C.spark, { w: 3 });
    }
    // --- la prise du mur ---
    const pl = lin(t, tPlug, tPlug + 0.4);
    if (pl > 0) {
      const px = 1440,
        py = 600;
      s += `<g opacity="${f2(pl)}"><rect x="${px - 170}" y="${py - 170}" width="340" height="340" rx="46" fill="#fff" class="ink" stroke-width="5"/><circle cx="${px}" cy="${py}" r="118" fill="${C.side}" class="ink" stroke-width="5"/><circle cx="${px - 46}" cy="${py + 14}" r="17" fill="${C.ink}"/><circle cx="${px + 46}" cy="${py + 14}" r="17" fill="${C.ink}"/><circle cx="${px}" cy="${py - 58}" r="13" fill="${C.metal}" class="ink"/></g>`;
      const no = ramp(t, tNo, tNo + 0.4);
      if (no > 0)
        s += `<g opacity="${f2(no)}"><circle cx="${px}" cy="${py}" r="190" fill="none" stroke="#E0455E" stroke-width="26"/><path d="M${px - 134} ${py - 134} L${px + 134} ${py + 134}" stroke="#E0455E" stroke-width="26" stroke-linecap="round"/></g>`;
    }
    // --- les deux « forces de poussée », à l'échelle : 1,5 contre 230 ---
    const b1 = ramp(t, tV, tV + 0.5),
      b2 = ramp(t, tBig, tBig + 0.9);
    if (b1 > 0)
      s += `<rect x="130" y="380" width="${f2(4.6 * b1 + 6)}" height="40" rx="8" fill="${C.blue}" class="ink" stroke-width="3" opacity="${f2(b1)}"/>`;
    if (b2 > 0)
      s += `<rect x="1090" y="380" width="${f2(700 * b2)}" height="40" rx="14" fill="#E0455E" class="ink" stroke-width="3"/>`;
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n0", tPump + 0.3);
  show("#s3-v1", tV, { y: -20 });
  show("#s3-v2", tBig, { y: -20 });
  pop("#s3-x", tX);
  tl.to("#s3-n0", { opacity: 0, duration: 0.3 }, tNo - 0.2);
  pop("#s3-n2", tNo + 0.2);
})();
