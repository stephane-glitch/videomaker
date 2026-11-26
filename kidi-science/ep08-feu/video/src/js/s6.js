// ---------- Scène 6 : le résumé, puis la plage : pourquoi la mer est salée ? ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "plage") - 0.6;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // la mer, les vagues, et quelqu'un qui boit la tasse
    let s = `<circle cx="330" cy="330" r="70" fill="${C.hot}" class="ink" stroke-width="5"/>`;
    for (let r = 0; r < 3; r++) {
      let d = `M130 ${640 + r * 70}`;
      for (let i = 0; i <= 12; i++) d += ` q30 ${f2(-26 * Math.sin(t * 2 + r))} 60 0 t60 0`;
      s += `<path d="${d} V900 H130 Z" fill="${["#8FD3FF", "#5FB4F0", "#2F7BD3"][r]}" class="ink" stroke-width="4"/>`;
    }
    const by = 650 + 12 * Math.sin(t * 2.4);
    s += `<circle cx="640" cy="${f2(by)}" r="44" fill="#FFD9B8" class="ink" stroke-width="4"/><circle cx="626" cy="${f2(by - 6)}" r="6" fill="${C.ink}"/><circle cx="654" cy="${f2(by - 6)}" r="6" fill="${C.ink}"/><ellipse cx="640" cy="${f2(by + 16)}" rx="10" ry="${f2(7 + 4 * Math.sin(t * 5))}" fill="${C.ink}"/>`;
    for (let i = 0; i < 6; i++) {
      const u = (t * 0.5 + i / 6) % 1;
      s += `<rect x="${f2(250 + i * 130 + 10 * Math.sin(t + i))}" y="${f2(760 + 40 * Math.sin(u * TAU))}" width="14" height="14" fill="#fff" class="ink" stroke-width="2.5" transform="rotate(${f2(t * 40 + i * 30)} ${f2(257 + i * 130)} ${f2(767)})"/>`;
    }
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "transformation") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "combustible") - 0.4, { y: 50 });
  show("#s6-k3", cue("s6-1", "éteint") - 0.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "mer") - 0.5,
  );
  pop("#s6-next", cue("s6-4", "prochaine") - 0.3);
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
