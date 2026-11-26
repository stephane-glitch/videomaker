// ---------- Scène 4 : le miel n'est pas fait pour nos tartines : c'est la réserve des abeilles pour l'hiver ----------
(() => {
  const tTa = cue("s4-1", "tartines") - 0.6,
    tHi = cue("s4-2", "hiver") - 0.8,
    tGa = cue("s4-3", "garde") - 0.5,
    tAp = cue("s4-4", "apiculteur") - 0.6;
  onDraw("s4", (t) => {
    const hi = ramp(t, tHi, tHi + 0.6),
      ap = ramp(t, tAp, tAp + 0.5);
    let s = "";
    if (hi < 1) {
      let g =
        panelSVG(130, 190, 1660, 660, "#FFF3DC") +
        `<g transform="translate(960 ${f2(540 + 8 * Math.sin(t * 2))}) rotate(${f2(-6 + 2 * Math.sin(t * 1.5))})" opacity="${f2(ramp(t, tTa, tTa + 0.3))}"><path d="M-220 -120 Q-260 -200 -160 -200 H160 Q260 -200 220 -120 V160 H-220 Z" fill="#E7B36B" class="ink" stroke-width="7" stroke-linejoin="round"/><path d="M-170 -110 Q-100 -160 0 -120 T170 -110 V60 Q100 110 0 70 T-170 90 Z" fill="#F2B33D" class="ink" stroke-width="5" stroke-linejoin="round"/><path d="M170 60 q10 60 -6 ${f2(90 + 20 * Math.sin(t * 2))}" fill="none" stroke="#F2B33D" stroke-width="16" stroke-linecap="round"/></g>` +
        (t < tTa ? txt(960, 560, "?", 220, { w: 700, fill: "#C25E00" }) : "");
      s += `<g opacity="${f2(1 - hi)}">${g}</g>`;
    }
    if (hi > 0 && ap < 1) {
      // l'hiver : la neige dehors, les abeilles serrées autour de leur miel
      let g = `<rect x="130" y="190" width="1660" height="660" rx="34" fill="#DCEBFA" class="ink" stroke-width="5"/><clipPath id="s4-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s4-k)"><path d="M130 740 Q500 700 900 740 T1790 730 V860 H130 Z" fill="#fff" class="ink" stroke-width="4"/>`;
      for (let i = 0; i < 26; i++) {
        const u = (t * 0.12 + rnd(i)) % 1;
        g += `<circle cx="${f2(160 + rnd(i + 7) * 1600 + 20 * Math.sin(t + i))}" cy="${f2(200 + u * 640)}" r="${f2(4 + 4 * rnd(i + 2))}" fill="#fff"/>`;
      }
      g +=
        `</g>` +
        hiveSVG(620, 760, 1.5) +
        `<path d="M430 380 Q620 300 810 380" fill="none" stroke="#fff" stroke-width="40" stroke-linecap="round"/>`;
      g += `<g transform="translate(1300 520)"><circle r="210" fill="#F3D58A" class="ink" stroke-width="6"/>${cellSVG(0, 60, 70, "#E9A21A")}${cellSVG(-122, 60, 70, "#E9A21A")}${cellSVG(122, 60, 70, "#E9A21A")}</g>`;
      for (let i = 0; i < 5; i++)
        g += beeSVG(
          1300 + 110 * Math.cos(i * 1.26 + 3.4),
          470 + 50 * Math.sin(i * 1.26 + 3.4) + 4 * Math.sin(t * 6 + i),
          0.75,
          t * 0.3 + i,
          i % 2 ? 1 : -1,
        );
      g +=
        arrowSVG(800, 600, 1080, 560, C.ink, 10) +
        txt(1300, 270, "leur réserve pour l’hiver", 50, { w: 700, fill: C.ink });
      const ga = ramp(t, tGa, tGa + 0.3);
      if (ga > 0)
        g += `<g transform="translate(1300 790) scale(${f2(ga)})">${txt(0, 0, "leur garde-manger", 48, { w: 700, fill: "#B02A45" })}</g>`;
      s += `<g opacity="${f2(hi * (1 - ap))}">${g}</g>`;
    }
    if (ap > 0) {
      // l'apiculteur ne prend qu'une partie des rayons de miel
      let g =
        panelSVG(130, 190, 1660, 660, "#E9F7FF") +
        figSVG(520, 760, 2.2, "#fff") +
        `<g transform="translate(520 400)"><ellipse rx="110" ry="24" fill="#E7C99A" class="ink" stroke-width="5"/><path d="M-70 0 Q-70 -80 0 -80 Q70 -80 70 0" fill="#E7C99A" class="ink" stroke-width="5"/><path d="M-80 10 V150 H80 V10" fill="#fff" opacity="0.5" class="ink" stroke-width="3" stroke-dasharray="6 8"/></g>`;
      for (let i = 0; i < 5; i++) {
        const taken = i === 0,
          k = taken ? ramp(t, tAp + 0.8, tAp + 1.8) : 0;
        g += `<g transform="translate(${f2(lerp(1000 + i * 130, 760, k))} ${f2(520 - 120 * Math.sin(k * Math.PI))})"><rect x="-50" y="-150" width="100" height="300" rx="10" fill="#E9A21A" class="ink" stroke-width="5"/><path d="M-50 -100 H50 M-50 -50 H50 M-50 0 H50 M-50 50 H50 M-50 100 H50" stroke="#C98A1B" stroke-width="4"/></g>`;
      }
      g +=
        txt(1330, 300, "il en laisse assez", 54, { w: 700, fill: "#1F7A50" }) +
        beeSVG(1500 + 60 * Math.sin(t * 2), 760 + 16 * Math.sin(t * 3), 0.8, t);
      s += `<g opacity="${f2(ap)}">${g}</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  show("#s4-n1", tHi + 0.8);
  show("#s4-n2", tAp + 1.0);
})();
