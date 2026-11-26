// ---------- Scène 6 : le résumé, puis la purée sans goût : annonce du goût ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "enrhumée") - 0.8;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // l'assiette de purée, la cuillère, et une mine déçue
    let s = `<ellipse cx="520" cy="760" rx="300" ry="60" fill="#fff" class="ink" stroke-width="6"/><path d="M330 740 Q350 600 520 ${f2(600 + 6 * Math.sin(t * 2))} Q690 600 710 740 Q520 800 330 740 Z" fill="#FFE9A8" class="ink" stroke-width="5"/><path d="M430 680 q40 -30 80 0 M540 650 q30 -24 70 0" fill="none" stroke="#E6C36A" stroke-width="7" stroke-linecap="round"/>`;
    s += `<g transform="translate(${f2(840 + 10 * Math.sin(t * 2.2))} ${f2(560 + 8 * Math.cos(t * 2.2))}) rotate(-30)"><ellipse rx="50" ry="34" fill="#9AA6B8" class="ink" stroke-width="5"/><path d="M48 0 H220" class="ink" stroke-width="16" stroke-linecap="round"/></g>`;
    s += `<circle cx="520" cy="400" r="90" fill="#FFD9B8" class="ink" stroke-width="5"/><circle cx="490" cy="390" r="8" fill="${C.ink}"/><circle cx="550" cy="390" r="8" fill="${C.ink}"/><path d="M490 440 q30 -20 60 0" fill="none" class="ink" stroke-width="6" stroke-linecap="round"/><ellipse cx="520" cy="${f2(418 + 2 * Math.sin(t * 6))}" rx="16" ry="12" fill="#E0455E" class="ink" stroke-width="4"/>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "molécules") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "serrures") - 0.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "code") - 0.8, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "purée") - 0.4,
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
