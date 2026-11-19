// ---------- Scène 6 : le résumé (la ola a besoin de monde), puis la question sur la lumière ----------
(() => {
  const S = scn("s6");
  const tOla = cue("s6-1", "ola") - 0.6,
    tSp = cue("s6-1", "espace") - 0.5,
    tBoom = cue("s6-3", "explosions") - 0.5,
    tLight = cue("s6-5", "lumière") - 0.5;
  onDraw("s6", (t) => {
    let s = "";
    // en haut : des grains d'air, la vague passe
    const o = lin(t, tOla, tOla + 0.4);
    if (o > 0) {
      let g = "";
      for (let j = 0; j < 3; j++)
        for (let i = 0; i < 30; i++) {
          const bx = 150 + i * 56,
            dx = 18 * Math.sin((bx / 200) * TAU - t * 12);
          g += `<circle cx="${f2(bx + dx)}" cy="${330 + j * 60}" r="11" fill="${C.blueL}"/>`;
        }
      s += `<g opacity="${f2(o)}">${g}</g>`;
    }
    // en bas : l'espace, vide ; la vague s'arrête net
    const sp = lin(t, tSp, tSp + 0.4);
    if (sp > 0) {
      let g = `<rect x="130" y="690" width="1660" height="220" rx="34" fill="${C.ink}" class="ink" stroke-width="5"/>`;
      for (let i = 0; i < 40; i++)
        g += `<circle cx="${f2(150 + rnd(i) * 1620)}" cy="${f2(705 + rnd(i + 60) * 190)}" r="${1.5 + rnd(i + 9) * 2.5}" fill="#fff" opacity="0.8"/>`;
      // une explosion muette
      const b = lin(t, tBoom, tBoom + 0.4);
      if (b > 0) {
        const k = 1 + 0.12 * Math.sin(t * 9);
        let st = "";
        for (let i = 0; i < 16; i++) {
          const r = (i % 2 ? 46 : 100) * k,
            a = (i / 16) * TAU;
          st += `${i ? "L" : "M"}${f2(1440 + r * Math.cos(a))} ${f2(800 + r * Math.sin(a))}`;
        }
        g += `<path d="${st}Z" fill="${C.fire}" stroke="${C.hot}" stroke-width="8" stroke-linejoin="round" opacity="${f2(b)}"/>`;
      }
      // les rayons de lumière, eux, traversent
      const l = lin(t, tLight, tLight + 0.5);
      if (l > 0)
        for (let i = 0; i < 3; i++)
          g += `<path d="M150 ${760 + i * 40} H1770" stroke="${C.spark}" stroke-width="8" stroke-dasharray="40 30" stroke-dashoffset="${f2(-t * 900)}" stroke-linecap="round" opacity="${f2(l)}"/>`;
      s += `<g opacity="${f2(sp)}">${g}</g>`;
    }
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-n1", tOla + 0.2, { x: -40, y: 0 });
  show("#s6-n2", cue("s6-1", "donc") - 0.3, { x: -40, y: 0 });
  pop("#s6-n3", cue("s6-4", "fausses") - 0.2);
  pop("#s6-next", cue("s6-6", "prochaine") - 0.3);
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
