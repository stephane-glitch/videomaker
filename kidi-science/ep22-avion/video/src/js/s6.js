// ---------- Scène 6 : le résumé, puis Internet au fond des océans : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tIn = cue("s6-3", "Internet") - 0.8;
  onDraw("s6", (t) => {
    if (t < tIn - 0.3) return;
    // un câble posé au fond de l'océan, et les messages qui filent dedans
    let s = `<rect x="200" y="330" width="760" height="460" rx="34" fill="#2F7FC4" class="ink" stroke-width="5"/><clipPath id="s6-c"><rect x="204" y="334" width="752" height="452" rx="30"/></clipPath><g clip-path="url(#s6-c)"><rect x="200" y="330" width="760" height="70" fill="#BFE6FF"/><path d="M200 400 q48 ${f2(-14 + 6 * Math.sin(t * 2))} 95 0 t95 0 t95 0 t95 0 t95 0 t95 0 t95 0 t95 0 V330 H200 Z" fill="#BFE6FF"/><path d="M200 720 Q400 680 580 730 T960 700 V800 H200 Z" fill="#E3C98B" class="ink" stroke-width="4"/>`;
    const P = (u) => [200 + u * 760, 706 + 18 * Math.sin(u * 7)];
    let d = "";
    for (let i = 0; i <= 30; i++) {
      const [x, y] = P(i / 30);
      d += `${i ? "L" : "M"}${f2(x)} ${f2(y)}`;
    }
    s += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/>`;
    for (let i = 0; i < 5; i++) {
      const [x, y] = P((t * 0.45 + i / 5) % 1);
      s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="9" fill="${C.hot}"/>`;
    }
    for (let i = 0; i < 6; i++) {
      const u = (t * 0.2 + rnd(i)) % 1;
      s += `<circle cx="${f2(300 + rnd(i + 5) * 560)}" cy="${f2(690 - u * 260)}" r="${f2(4 + 5 * rnd(i + 2))}" fill="none" stroke="#fff" stroke-width="3" opacity="${f2(0.7 * (1 - u))}"/>`;
    }
    $("#s6-draw").innerHTML = s + `</g>`;
  });
  show("#s6-k1", cue("s6-1", "moteurs") - 0.6, { y: 50 });
  show("#s6-k2", cue("s6-1", "bas") - 1.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "haut") - 1.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tIn - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tIn);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "Internet") - 0.2,
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
