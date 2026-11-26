// ---------- Scène 3 : avec le sucre, la plante construit le bois, les feuilles, les fruits : de l'air et de l'eau transformés ----------
(() => {
  const S = scn("s3");
  const tBo = cue("s3-2", "bois") - 0.5,
    tFe = cue("s3-2", "feuilles") - 0.4,
    tFr = cue("s3-2", "fruits") - 0.4,
    tTr = cue("s3-2", "transformés") - 1.6,
    tBu = cue("s3-3", "bureau") - 0.6;
  onDraw("s3", (t) => {
    const bu = ramp(t, tBu, tBu + 0.5),
      g = 0.35 + 0.65 * ramp(t, tBo, tFr + 1.5),
      fr = ramp(t, tFr, tFr + 0.5);
    let s =
      daySkySVG(130, 190, 1660, 660, t, 10, "s3", 0) +
      `<clipPath id="s3-k"><rect x="136" y="196" width="1648" height="648" rx="30"/></clipPath><g clip-path="url(#s3-k)"><rect x="130" y="760" width="1660" height="100" fill="#7CC47A"/><path d="M130 760 H1790" class="ink" stroke-width="5"/></g>`;
    let a = `<g transform="translate(700 760) scale(${f2(g)})">${leafTreeSVG(0, 0, 520, "#3DBE8B", fr > 0 ? Math.round(8 * fr) : 0, t)}</g>`;
    // le sucre qui circule dans l'arbre
    for (let i = 0; i < 5; i++) {
      const u = (t * 0.5 + i / 5) % 1;
      a += sugarSVG(700 + 10 * Math.sin(u * 8 + i), 760 - u * 380 * g, 0.6, Math.sin(u * Math.PI));
    }
    if (t < tBo)
      a += txt(1300, 480, "?", 200, {
        w: 700,
        fill: "#C25E00",
        op: ramp(t, S.start + 0.3, S.start + 0.6),
      });
    [
      ["le bois", tBo, 620],
      ["les feuilles", tFe, 520],
      ["les fruits", tFr, 420],
    ].forEach(([l, t0, y]) => {
      const k = ramp(t, t0, t0 + 0.3) * (1 - ramp(t, tTr, tTr + 0.3));
      if (k > 0) a += txt(1300, y, l, 60, { w: 700, fill: C.ink, op: k });
    });
    const tr = ramp(t, tTr, tTr + 0.4);
    if (tr > 0)
      a += `<g opacity="${f2(tr)}" transform="translate(1300 500)"><rect x="-300" y="-150" width="600" height="280" rx="30" fill="#fff" class="ink" stroke-width="5"/>${txt(0, -60, "de l’air + de l’eau", 50, { w: 700, fill: C.blueD })}${arrowSVG(0, -30, 0, 30, C.ink, 12)}${txt(0, 90, "du bois", 60, { w: 700, fill: "#8A5A2B" })}</g>`;
    s += `<g opacity="${f2(1 - bu)}">${a}</g>`;
    if (bu > 0) {
      // le bureau de Zoé : du bois, donc de l'air transformé
      let b = `<g transform="translate(960 560)"><rect x="-360" y="-40" width="720" height="50" rx="10" fill="#C98B4B" class="ink" stroke-width="5"/><rect x="-330" y="10" width="40" height="190" fill="#B9772E" class="ink" stroke-width="5"/><rect x="290" y="10" width="40" height="190" fill="#B9772E" class="ink" stroke-width="5"/><rect x="60" y="10" width="230" height="110" fill="#B9772E" class="ink" stroke-width="5"/><circle cx="175" cy="65" r="10" fill="${C.ink}"/><rect x="-220" y="-90" width="150" height="50" rx="6" fill="#fff" class="ink" stroke-width="4" transform="rotate(-6 -145 -65)"/></g>`;
      for (let i = 0; i < 7; i++) {
        const u = (t * 0.5 + rnd(i)) % 1;
        b += `<path d="M${f2(520 + i * 130)} ${f2(500 - u * 190)} q14 -14 28 0 t28 0" fill="none" stroke="${C.blue}" stroke-width="7" stroke-linecap="round" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
      }
      s += `<g opacity="${f2(bu)}">${b}${txt(960, 300, "un bureau… en air !", 60, { w: 700, fill: C.blueD })}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tFr + 0.6);
  show("#s3-n2", tTr + 0.8);
})();
