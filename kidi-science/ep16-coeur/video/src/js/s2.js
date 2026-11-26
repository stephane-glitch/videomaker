// ---------- Scène 2 : le grand circuit en huit : cœur → poumons → cœur → corps → cœur ----------
(() => {
  const tPm = cue("s2-1", "pompes") - 0.5,
    tLu = cue("s2-1", "poumons") - 0.8,
    tBo = cue("s2-2", "corps") - 0.8,
    tH = cue("s2-3", "huit") - 0.4;
  const HX = 960,
    HY = 520;
  const UP = [
    [HX - 50, HY - 60],
    [HX - 250, HY - 150],
    [HX - 250, HY - 290],
    [HX, HY - 330],
    [HX + 250, HY - 290],
    [HX + 250, HY - 150],
    [HX + 50, HY - 60],
  ];
  const DN = [
    [HX + 50, HY + 70],
    [HX + 330, HY + 150],
    [HX + 330, HY + 280],
    [HX, HY + 320],
    [HX - 330, HY + 280],
    [HX - 330, HY + 150],
    [HX - 50, HY + 70],
  ];
  onDraw("s2", (t) => {
    const lu = ramp(t, tLu, tLu + 0.8),
      bo = ramp(t, tBo, tBo + 0.8),
      glow = t > tH ? 0.5 + 0.5 * Math.sin((t - tH) * 6) : 0,
      b = beatAt(t, 80);
    let s = "";
    // les tuyaux
    const pipe = (P, k, c1, c2) => {
      if (k <= 0) return "";
      const n = P.length - 1,
        m = Math.max(1, Math.round(n * k));
      const A = P.slice(0, Math.min(P.length, m + 1));
      const half = Math.ceil(P.length / 2);
      return (
        `<path d="${pathD(A)}" fill="none" stroke="${C.ink}" stroke-width="${f2(40 + 10 * glow)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${pathD(A.slice(0, half))}" fill="none" stroke="${c1}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>` +
        (A.length > half
          ? `<path d="${pathD(A.slice(half - 1))}" fill="none" stroke="${c2}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>`
          : "")
      );
    };
    s += pipe(UP, lu, "#7C9BE8", "#F08A9B") + pipe(DN, bo, "#F08A9B", "#7C9BE8");
    // les poumons et le corps
    if (lu > 0.5)
      s += `<g opacity="${f2(ramp(lu, 0.5, 1))}" transform="translate(${HX} ${HY - 340}) scale(${f2(1 + 0.04 * Math.sin(t * 2))})"><path d="M-20 -60 Q-140 -80 -150 30 Q-150 80 -90 70 Q-30 60 -20 0 Z M20 -60 Q140 -80 150 30 Q150 80 90 70 Q30 60 20 0 Z" fill="#F7A8B8" class="ink" stroke-width="6"/><path d="M0 -110 V-40" class="ink" stroke-width="12" stroke-linecap="round"/>${txt(190, -10, "Les poumons", 42, { w: 700, anchor: "start" })}</g>`;
    if (bo > 0.5)
      s += `<g opacity="${f2(ramp(bo, 0.5, 1))}">${figSVG(HX, HY + 400, 1.3, C.blue)}${txt(HX + 180, HY + 350, "Le corps", 38, { w: 700, anchor: "start" })}</g>`;
    // le sang qui circule : bleu vers les poumons, rouge après, bleu au retour du corps
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.22 + i / 5) % 1;
      if (lu >= 1) {
        const [x, y] = along(UP, u);
        s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="12" fill="${u < 0.5 ? "#2F5BD3" : "#E0455E"}" stroke="#fff" stroke-width="3"/>`;
      }
      if (bo >= 1) {
        const [x, y] = along(DN, u);
        s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="12" fill="${u < 0.5 ? "#E0455E" : "#2F5BD3"}" stroke="#fff" stroke-width="3"/>`;
      }
    }
    // le cœur, en deux moitiés : deux pompes collées
    const two = ramp(t, tPm, tPm + 0.4);
    s +=
      heartSVG(HX, HY + 10, 1.0 * (1 + 0.08 * b)) +
      `<g opacity="${f2(two)}"><path d="M${HX} ${HY - 70} V${HY + 100}" stroke="#fff" stroke-width="8" stroke-dasharray="14 10"/>${txt(HX - 60, HY + 10, "1", 54, { w: 700, fill: "#fff" })}${txt(HX + 60, HY + 10, "2", 54, { w: 700, fill: "#fff" })}</g>`;
    $("#s2-draw").innerHTML = `<g transform="translate(115 62) scale(0.88)">${s}</g>`;
  });
  pop("#s2-n1", tH + 0.3);
  show("#s2-n2", cue("s2-4", "minute") - 1.0);
})();
