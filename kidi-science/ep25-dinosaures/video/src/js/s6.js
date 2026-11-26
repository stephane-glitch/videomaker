// ---------- Scène 6 : le résumé, puis le ciel bleu : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tCi = cue("s6-3", "ciel") - 0.8;
  onDraw("s6", (t) => {
    if (t < tCi - 0.3) return;
    // un grand ciel bleu, le Soleil, et un point d'interrogation
    let s = `<rect x="200" y="330" width="760" height="460" rx="34" fill="#2F7FD6" class="ink" stroke-width="5"/><clipPath id="s6-c"><rect x="204" y="334" width="752" height="452" rx="30"/></clipPath><g clip-path="url(#s6-c)">${sunSVG(360, 470, 60, t)}${cloudSVG(600 - ((t * 16) % 80), 520, 1)}<path d="M200 740 Q400 700 580 740 T960 720 V800 H200 Z" fill="#7CC47A" class="ink" stroke-width="4"/></g>`;
    s += `<g transform="translate(760 ${f2(470 + 8 * Math.sin(t * 3))}) rotate(${f2(6 * Math.sin(t * 2))})">${txt(0, 40, "?", 150, { w: 700, fill: "#fff" })}</g>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "régné") - 1.4, { y: 50 });
  show("#s6-k2", cue("s6-1", "météorite") - 0.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "descendants") - 0.8, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tCi - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tCi);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "ciel") - 0.2,
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
