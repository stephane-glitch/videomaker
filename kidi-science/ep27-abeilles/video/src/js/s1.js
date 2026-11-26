// ---------- Scène 1 : l'abeille aspire le nectar avec sa langue et le range dans un petit sac ; des centaines de fleurs par voyage ----------
(() => {
  const tLa = cue("s1-1", "langue") - 0.6,
    tSa = cue("s1-1", "sac") - 0.8,
    tCo = cue("s1-2", "combien") - 0.5,
    tCe = cue("s1-3", "centaines") - 0.5;
  onDraw("s1", (t) => {
    const co = ramp(t, tCo, tCo + 0.5);
    let s = daySkySVG(130, 190, 1660, 660, t, 12, "s1", 2);
    if (co < 1) {
      const la = ramp(t, tLa, tLa + 0.4),
        sa = ramp(t, tSa, tSa + 1.5);
      let g =
        `<path d="M700 640 V846" stroke="#2E9E6B" stroke-width="22" stroke-linecap="round"/>` +
        daisySVG(700, 580, 150, "#FF8FB0", t);
      // l'abeille posée, sa langue, les gouttes qui montent
      const bx = 980,
        by = 430 + 6 * Math.sin(t * 3);
      if (la > 0) {
        g += `<path d="M${bx - 86} ${f2(by + 10)} Q800 520 ${f2(lerp(bx - 86, 720, la))} ${f2(lerp(by + 10, 570, la))}" fill="none" stroke="#E0455E" stroke-width="9" stroke-linecap="round"/>`;
        for (let i = 0; i < 3; i++) {
          const u = (t * 0.9 + i / 3) % 1;
          g += `<circle cx="${f2(lerp(720, bx - 86, u))}" cy="${f2(lerp(570, by + 10, u) + 30 * Math.sin(u * Math.PI))}" r="8" fill="#FFE9A0" class="ink" stroke-width="2" opacity="${f2(la)}"/>`;
        }
        g += txt(440, 290, "comme une paille", 44, {
          w: 700,
          fill: C.ink,
          op: la * (1 - ramp(t, tSa - 0.3, tSa)),
        });
      }
      g += beeSVG(bx, by, 2.2, t, -1);
      if (sa > 0)
        g +=
          `<ellipse cx="${bx + 30}" cy="${f2(by + 6)}" rx="${f2(16 + 26 * sa)}" ry="${f2(12 + 16 * sa)}" fill="#FFE9A0" class="ink" stroke-width="4" opacity="0.95"/>` +
          arrowSVG(1330, 600, 1060, 470, C.ink, 10, ramp(sa, 0, 0.3)) +
          txt(1420, 650, "son petit sac", 50, { w: 700, fill: "#C25E00", op: ramp(sa, 0, 0.3) });
      s += `<g opacity="${f2(1 - co)}">${g}</g>`;
    }
    if (co > 0) {
      // un champ de fleurs et le trajet de l'abeille
      const ce = ramp(t, tCe, tCe + 0.3),
        COL = ["#FF8FB0", "#C9A6FF", "#FFB36B", "#8FD3FF"],
        F = [];
      let g = `<clipPath id="s1-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s1-k)"><rect x="130" y="700" width="1660" height="160" fill="#7CC47A"/>`;
      for (let i = 0; i < 18; i++) {
        const x = 230 + (i % 9) * 180 + 40 * rnd(i),
          y = 560 + Math.floor(i / 9) * 130 + 30 * rnd(i + 3);
        F.push([x, y - 20]);
        g +=
          `<path d="M${f2(x)} ${f2(y)} V${f2(y + 150)}" stroke="#2E9E6B" stroke-width="10"/>` +
          daisySVG(x, y, 34, COL[i % 4], t + i);
      }
      const u = ((t - tCo) * 0.09) % 1,
        [bx, by] = along(F, u);
      let d = "";
      for (let i = 0; i <= 60; i++) {
        const [x, y] = along(F, (i / 60) * u);
        d += `${i ? "L" : "M"}${f2(x)} ${f2(y - 40)}`;
      }
      g +=
        `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-dasharray="8 12" opacity="0.6"/>` +
        beeSVG(bx, by - 46 + 8 * Math.sin(t * 9), 0.8, t) +
        `</g>`;
      g += `<g transform="translate(960 330)"><rect x="-330" y="-64" width="660" height="110" rx="28" fill="#fff" class="ink" stroke-width="5"/>${txt(0, 12, ce > 0 ? `${Math.round(lerp(1, 100 + 250 * ramp(t, tCe, tCe + 4), ce))} fleurs…` : "combien de fleurs ?", 56, { w: 700, fill: C.ink })}</g>`;
      s += `<g opacity="${f2(co)}">${g}</g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tSa + 0.8);
  tl.to("#s1-n1", { opacity: 0, duration: 0.3 }, tCo);
  show("#s1-n2", tCe + 0.5);
})();
