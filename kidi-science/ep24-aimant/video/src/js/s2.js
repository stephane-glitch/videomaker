// ---------- Scène 2 : deux pôles, nord et sud ; les contraires s'attirent, les pareils se repoussent ----------
(() => {
  const tPo = cue("s2-1", "pôles") - 0.5,
    tNo = cue("s2-1", "nord") - 0.4,
    tSu = cue("s2-1", "sud") - 0.4,
    tTe = cue("s2-2", "Terre") - 0.5,
    tAt = cue("s2-3", "attirent") - 1.0,
    tRe = cue("s2-3", "repoussent") - 1.2,
    tCo = cue("s2-4", "coussin") - 0.6;
  onDraw("s2", (t) => {
    const at = ramp(t, tAt, tAt + 0.4);
    let s = panelSVG();
    if (at < 1) {
      let g = barMagnetSVG(960, 520 + 6 * Math.sin(t * 2), 700, 150);
      const no = ramp(t, tNo, tNo + 0.25),
        su = ramp(t, tSu, tSu + 0.25),
        po = ramp(t, tPo, tPo + 0.3);
      if (po > 0)
        g += `<circle cx="610" cy="520" r="${f2(110 + 8 * Math.sin(t * 5))}" fill="none" stroke="${C.fire}" stroke-width="8" stroke-dasharray="14 12" opacity="${f2(po)}"/><circle cx="1310" cy="520" r="${f2(110 + 8 * Math.cos(t * 5))}" fill="none" stroke="${C.fire}" stroke-width="8" stroke-dasharray="14 12" opacity="${f2(po)}"/>`;
      if (no > 0) g += txt(610, 350, "le nord", 54, { w: 700, fill: "#B02A45", op: no });
      if (su > 0) g += txt(1310, 350, "le sud", 54, { w: 700, fill: C.blueD, op: su });
      const te = ramp(t, tTe, tTe + 0.3);
      if (te > 0)
        g += `<g opacity="${f2(te)}" transform="translate(960 740)">${earthSVG(0, 0, 70, t * 30)}${txt(0, -84, "N", 36, { w: 700, fill: "#B02A45" })}${txt(110, 14, "comme la Terre", 40, { w: 700, fill: C.ink, anchor: "start" })}</g>`;
      s += `<g opacity="${f2(1 - at)}">${g}</g>`;
    }
    if (at > 0) {
      const re = t > tRe;
      let d,
        g = "";
      if (!re) {
        const u = clamp((t - tAt - 0.4) / 0.5, 0, 1);
        d =
          lerp(330, 200, u * u) +
          (u >= 1 ? 4 * Math.exp(-(t - tAt - 0.9) * 6) * Math.sin(t * 40) : 0);
        g +=
          barMagnetSVG(960 - d, 520, 400, 110) +
          barMagnetSVG(960 + d, 520, 400, 110) +
          (u < 1
            ? arrowSVG(960 - d + 210, 400, 960 - d + 290, 400, "#2E9E6B", 16) +
              arrowSVG(960 + d - 210, 400, 960 + d - 290, 400, "#2E9E6B", 16)
            : "") +
          txt(960, 720, "N et S : ils s’attirent", 54, { w: 700, fill: "#1F7A50" });
      } else {
        const u = t - tRe,
          d2 = 215 + 150 * (1 - Math.exp(-u * 3)) + 26 * Math.sin(u * 4) * Math.exp(-u * 0.25);
        g +=
          barMagnetSVG(960 - d2, 520, 400, 110, 0, true) +
          barMagnetSVG(960 + d2, 520, 400, 110) +
          arrowSVG(960 - 40, 400, 960 - 130, 400, "#E0455E", 16) +
          arrowSVG(960 + 40, 400, 960 + 130, 400, "#E0455E", 16);
        const co = ramp(t, tCo, tCo + 0.3);
        if (co > 0)
          g += `<ellipse cx="960" cy="520" rx="${f2(d2 - 205)}" ry="${f2(70 + 6 * Math.sin(t * 6))}" fill="#C9A6FF" opacity="${f2(0.5 * co)}" stroke="#7A4FD0" stroke-width="5" stroke-dasharray="10 10"/>`;
        g += txt(960, 720, "N et N : ils se repoussent", 54, { w: 700, fill: "#B02A45" });
      }
      s += `<g opacity="${f2(at)}">${g}</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  show("#s2-n1", tAt + 1.0);
  pop("#s2-n2", tRe + 1.0);
})();
