// ---------- Scène 6 : le résumé, puis le saut sur la Lune (six fois plus haut) ----------
(() => {
  const S = scn("s6");
  const tJ = cue("s6-2", "Lune") - 0.8;
  // même élan sur la Terre et sur la Lune : la hauteur et la durée du saut sont multipliées par 6
  const V0 = 520,
    GE = 3000,
    GM = GE / 6,
    TE = (2 * V0) / GE,
    TM = (2 * V0) / GM;
  const hop = (u, g, T) => (u < T ? V0 * u - 0.5 * g * u * u : 0);
  onDraw("s6", (t) => {
    if (t < tJ - 0.3) return;
    const u = Math.max(0, t - tJ - 0.6),
      gy = 560;
    const ue = u % (TE + 1.0),
      um = u % (TM + 1.0);
    $("#s6-s1").innerHTML =
      `<rect x="0" y="${gy}" width="760" height="80" fill="#6CC98A"/><path d="M0 ${gy} H760" class="ink" stroke-width="5"/>` +
      figSVG(380, gy - hop(ue, GE, TE), 1.3, C.blue) +
      `<path d="M560 ${gy} V${gy - 45} M540 ${gy - 45} H580" class="ink" stroke-width="5"/>` +
      txt(660, gy - 34, "45 cm", 34);
    let b = "";
    for (let i = 0; i < 22; i++)
      b += `<circle cx="${f2(rnd(i) * 760)}" cy="${f2(rnd(i + 60) * 300)}" r="${1.5 + rnd(i + 9) * 2.5}" fill="#fff" opacity="0.8"/>`;
    b += `<rect x="0" y="${gy}" width="760" height="80" fill="#C9D1DE"/><path d="M0 ${gy} H760" stroke="#EEF2F8" stroke-width="5"/>`;
    // un panier de basket, tout là-haut
    b += `<path d="M640 ${gy} V${gy - 330}" stroke="#EEF2F8" stroke-width="12"/><rect x="560" y="${gy - 400}" width="100" height="80" rx="8" fill="#fff" stroke="#EEF2F8" stroke-width="4"/><ellipse cx="540" cy="${gy - 320}" rx="50" ry="12" fill="none" stroke="${C.fire}" stroke-width="8"/>`;
    b +=
      figSVG(380, gy - hop(um, GM, TM), 1.3, C.fire) +
      `<path d="M180 ${gy} V${gy - 270} M160 ${gy - 270} H200" stroke="#EEF2F8" stroke-width="5"/>` +
      txt(110, gy - 280, "2,70 m", 34, { fill: "#fff" });
    $("#s6-s2").innerHTML = b;
  });
  show("#s6-k1", cue("s6-1", "attire") - 0.5, { y: 50 });
  show("#s6-k2", cue("s6-1", "gros") - 0.5, { y: 50 });
  show("#s6-k3", cue("s6-1", "Lune") - 0.5, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tJ - 0.3);
  tl.fromTo("#s6-j", { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.5, ease: OUT }, tJ);
  pop("#s6-next", cue("s6-6", "son") - 0.3);
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
