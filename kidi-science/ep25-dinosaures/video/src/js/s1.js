// ---------- Scène 1 : 150 millions d'années de règne ; des géants (diplodocus, long comme trois bus) et des tout petits ; pas encore d'humains ----------
(() => {
  const S = scn("s1");
  const tRe = cue("s1-1", "régné") - 0.5,
    tDp = cue("s1-1", "diplodocus") - 0.6,
    tBu = cue("s1-1", "bus") - 0.8,
    tPo = cue("s1-1", "poule") - 1.2,
    tHu = cue("s1-2", "humains") - 0.5,
    tEx = cue("s1-3", "existait") - 0.6;
  const bus = (x, y) =>
    `<g transform="translate(${x} ${y})"><rect x="-120" y="-50" width="240" height="90" rx="16" fill="${C.hot}" class="ink" stroke-width="4"/><path d="M-100 -34 h44 v30 h-44 Z M-40 -34 h44 v30 h-44 Z M20 -34 h44 v30 h-44 Z" fill="#BFE6FF" class="ink" stroke-width="3"/><circle cx="-70" cy="42" r="18" fill="${C.ink}"/><circle cx="70" cy="42" r="18" fill="${C.ink}"/></g>`;
  onDraw("s1", (t) => {
    const hu = ramp(t, tHu, tHu + 0.5);
    let s = panelSVG(130, 190, 1660, 660, "#FFF3DC");
    // la frise du temps : le règne des dinosaures, immense, et nous, un trait tout au bout
    const re = ramp(t, tRe, tRe + 1.4);
    s +=
      `<rect x="230" y="720" width="1460" height="56" rx="14" fill="#fff" class="ink" stroke-width="4"/><rect x="230" y="720" width="${f2(1400 * re)}" height="56" rx="14" fill="#3DBE8B" class="ink" stroke-width="4"/>` +
      (re > 0.3
        ? txt(930, 760, "le règne des dinosaures : plus de 150 millions d’années", 36, {
            w: 700,
            fill: C.ink,
            op: ramp(re, 0.3, 0.6),
          })
        : "");
    if (hu > 0)
      s += `<rect x="1678" y="${f2(706 - 6 * Math.sin(t * 6))}" width="12" height="84" rx="4" fill="#E0455E" opacity="${f2(hu)}"/>${txt(1656, 696, ramp(t, tEx, tEx + 0.2) > 0.5 ? "nous : tout à la fin !" : "nous ?", 44, { w: 700, fill: "#B02A45", op: hu, anchor: "end" })}`;
    // le diplodocus et ses trois bus ; la poule et le mini-dinosaure
    const dp = ramp(t, S.start + 0.2, S.start + 0.7),
      nm = ramp(t, tDp, tDp + 0.3),
      bu = ramp(t, tBu, tBu + 0.4),
      po = ramp(t, tPo, tPo + 0.4);
    if (dp > 0)
      s += `<g opacity="${f2(dp * (1 - 0.6 * hu))}">${sauroSVG(620, 450 - 4 * Math.abs(Math.sin(t * 3)), 1.1, 8 * Math.sin(t * 1.7))}${txt(1000, 330, "le diplodocus", 44, { w: 700, fill: C.ink, op: nm })}</g>`;
    if (bu > 0)
      for (let i = 0; i < 3; i++) {
        const k = ramp(t, tBu + i * 0.18, tBu + 0.3 + i * 0.18);
        s += `<g opacity="${f2(k * (1 - 0.6 * hu))}" transform="translate(0 ${f2(20 * (1 - k))})">${bus(330 + i * 255, 610)}</g>`;
      }
    if (po > 0)
      s += `<g opacity="${f2(po * (1 - 0.6 * hu))}"><g transform="translate(1260 ${f2(560 - 10 * Math.abs(Math.sin(t * 6)))})"><ellipse rx="50" ry="40" fill="#fff" class="ink" stroke-width="4"/><circle cx="44" cy="-40" r="24" fill="#fff" class="ink" stroke-width="4"/><path d="M64 -40 l22 6 l-22 8 Z" fill="${C.fire}"/><path d="M36 -64 q8 -16 16 0 q8 -16 14 2" fill="#E0455E"/><circle cx="50" cy="-44" r="4" fill="${C.ink}"/><path d="M-10 40 v24 M14 40 v24" class="ink" stroke-width="5"/></g>${trexSVG(1500, 560 - 8 * Math.abs(Math.sin(t * 7 + 1)), 0.42, 6, "#C9A6FF")}${txt(1380, 420, "pas plus gros qu’une poule", 40, { w: 700, fill: C.ink })}</g>`;
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tRe + 1.4);
  show("#s1-n2", tEx + 0.4);
})();
