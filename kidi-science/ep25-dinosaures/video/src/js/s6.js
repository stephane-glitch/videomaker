// ---------- Scène 6 : le résumé, puis la graine qui pousse : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tCi = cue("s6-3", "graine") - 0.8;
  onDraw("s6", (t) => {
    if (t < tCi - 0.3) return;
    // une graine sous la terre, et la pousse qui grandit
    const g = ramp(t, tCi + 0.6, tCi + 5),
      h = 220 * g,
      w = 5 * Math.sin(t * 2);
    let s = `<rect x="200" y="330" width="760" height="460" rx="34" fill="#BFE6FF" class="ink" stroke-width="5"/><clipPath id="s6-c"><rect x="204" y="334" width="752" height="452" rx="30"/></clipPath><g clip-path="url(#s6-c)">${sunSVG(340, 440, 50, t)}<rect x="200" y="640" width="760" height="160" fill="#8A5A2B"/><path d="M200 640 H960" class="ink" stroke-width="5"/><ellipse cx="580" cy="700" rx="26" ry="18" fill="#C98B4B" class="ink" stroke-width="4"/><path d="M580 716 q-14 30 -30 ${f2(40 * g)} M580 716 q12 26 26 ${f2(46 * g)}" fill="none" stroke="#E7C99A" stroke-width="5" stroke-linecap="round"/>`;
    if (h > 4)
      s += `<path d="M580 690 Q${f2(580 + w)} ${f2(690 - h / 2)} ${f2(580 + w)} ${f2(690 - h)}" fill="none" stroke="#2E9E6B" stroke-width="12" stroke-linecap="round"/><path d="M${f2(580 + w)} ${f2(690 - h)} q-${f2(60 * g)} -${f2(20 * g)} -${f2(70 * g)} -${f2(60 * g)} q${f2(50 * g)} 0 ${f2(70 * g)} ${f2(60 * g)} q${f2(60 * g)} -${f2(20 * g)} ${f2(70 * g)} -${f2(60 * g)} q-${f2(50 * g)} 0 -${f2(70 * g)} ${f2(60 * g)} Z" fill="#5BE39A" class="ink" stroke-width="4" stroke-linejoin="round"/>`;
    $("#s6-draw").innerHTML = s + `</g>`;
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
    cue("s6-3", "graine") - 0.2,
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
