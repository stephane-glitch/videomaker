// ---------- Scène 6 : le résumé, un corps très fort (un peu trop zélé), puis l'appel aux questions ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "corps") - 0.7;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // le garde en super-héros : une cape, une médaille
    const x = 600,
      y = 560 + 10 * Math.sin(t * 2);
    let s = `<path d="M${x - 110} ${y - 60} Q${x - 300 - 20 * Math.sin(t * 3)} ${y + 120} ${x - 190} ${y + 250} L${x + 60} ${y + 120} Z" fill="#E0455E" class="ink" stroke-width="5"/>`;
    s += guardSVG(x, y, 160, t, 0, 1);
    s += `<g transform="translate(${x + 60} ${y + 110})"><circle r="34" fill="${C.hot}" class="ink" stroke-width="5"/>${txt(0, 14, "★", 38)}</g>`;
    s += pollenSVG(960, 780 + 8 * Math.sin(t * 1.5), 30, t * 0.3);
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "confondent") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "éclater") - 0.4, { y: 50 });
  show("#s6-k3", cue("s6-1", "éternue") - 0.4, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "fort") - 0.3,
  );
  pop("#s6-next", cue("s6-6", "Envoie") - 0.3);
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
