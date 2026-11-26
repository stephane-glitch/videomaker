// ---------- Scène 2 : la roche fond, le magma monte, s'accumule ; le gaz fait grimper la pression : l'éruption ----------
(() => {
  const tFo = cue("s2-1", "fond") - 0.4,
    tMg = cue("s2-1", "magma") - 0.4,
    tMo = cue("s2-1", "monte") - 0.5,
    tPo = cue("s2-1", "poche") - 1.0,
    tGz = cue("s2-3", "gaz") - 0.4,
    tSo = cue("s2-3", "soda") - 0.6,
    tPr = cue("s2-3", "pression") - 0.6,
    tSh = cue("s2-4", "secoue") - 0.4,
    tEr = cue("s2-5", "saute") - 0.3;
  const VX = 620;
  onDraw("s2", (t) => {
    const er = ramp(t, tEr, tEr + 0.4),
      fill = ramp(t, tPo, tPo + 1.6),
      shake = t > tSh && t < tEr ? 6 * Math.sin(t * 40) : 0;
    // la coupe : le sol, le cône, la cheminée, la poche, le manteau tout en bas
    let s =
      `<rect x="130" y="560" width="1000" height="290" fill="#C9B28E" class="ink" stroke-width="5"/><path d="M130 780 q125 -30 250 0 t250 0 t250 0 t250 0 V850 H130 Z" fill="${mixHex("#E0652B", "#F08A3C", 0.5 + 0.5 * Math.sin(t * 2))}" class="ink" stroke-width="4"/>` +
      coneSVG(VX - 330, VX + 330, 560, 300, 110) +
      `<rect x="${VX - 22}" y="300" width="44" height="330" fill="#3A2E28"/>`;
    // la poche de magma
    s += `<ellipse cx="${f2(VX + shake)}" cy="670" rx="210" ry="80" fill="#3A2E28" class="ink" stroke-width="5"/><clipPath id="s2-p"><ellipse cx="${VX}" cy="670" rx="204" ry="74"/></clipPath><g clip-path="url(#s2-p)"><rect x="${VX - 210}" y="${f2(750 - 160 * fill)}" width="420" height="170" fill="#E0652B"/>`;
    // les bulles de gaz
    const gz = ramp(t, tGz, tPr + 1.0);
    for (let i = 0; i < Math.round(18 * gz); i++)
      s += `<circle cx="${f2(VX - 180 + rnd(i) * 360 + 6 * Math.sin(t * 5 + i))}" cy="${f2(620 + rnd(i + 30) * 100 - ((t * 20 + i * 9) % 30))}" r="${f2(7 + 5 * rnd(i + 5))}" fill="#fff" fill-opacity="0.8" stroke="${C.ink}" stroke-width="2"/>`;
    s += `</g>`;
    // les gouttes de roche fondue qui montent du manteau
    if (t > tFo && er < 1)
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.3 + i / 6) % 1,
          go = ramp(t, tMo, tMo + 0.6);
        s += `<circle cx="${f2(VX - 150 + i * 60 + 10 * Math.sin(t * 3 + i))}" cy="${f2(lerp(790, 790 - 50 * u, 1 - go) - go * u * 60)}" r="${f2(13 - 5 * u)}" fill="#F08A3C" class="ink" stroke-width="3" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
      }
    // l'éruption : la lave remplit la cheminée et jaillit
    if (er > 0)
      s +=
        `<rect x="${VX - 18}" y="${f2(630 - 330 * er)}" width="36" height="${f2(330 * er)}" fill="#F08A3C"/>` +
        lavaSVG(VX, 300, t, er, 18, 80) +
        smokeSVG(VX, 270, t, er, "#C8CDD6", 10, 200);
    // la jauge de pression
    const pr = ramp(t, tPr, tEr) * (1 - 0.7 * ramp(t, tEr + 0.3, tEr + 1.2));
    if (t > tPr - 0.2)
      s += `<g opacity="${f2(ramp(t, tPr - 0.2, tPr + 0.2))}" transform="translate(1010 350)"><circle r="92" fill="#fff" class="ink" stroke-width="6"/><path d="M-60 34 A 70 70 0 1 1 60 34" fill="none" stroke="#D3DAE6" stroke-width="14" stroke-linecap="round"/><path d="M40 -56 A 70 70 0 0 1 60 34" fill="none" stroke="#E0455E" stroke-width="14" stroke-linecap="round"/><path d="M0 0 L${f2(62 * Math.cos(rad(150 + 240 * pr + 3 * Math.sin(t * 20))))} ${f2(62 * Math.sin(rad(150 + 240 * pr + 3 * Math.sin(t * 20))))}" class="ink" stroke-width="8" stroke-linecap="round"/><circle r="10" fill="${C.ink}"/>${txt(0, 140, "Pression", 34, { w: 700 })}</g>`;
    // la bouteille de soda
    const so = ramp(t, tSo, tSo + 0.4);
    if (so > 0) {
      const sh = t > tSh ? 14 * Math.sin(t * 30) * (1 - er) : 0,
        popd = ramp(t, tEr, tEr + 0.3);
      s +=
        `<g opacity="${f2(so)}" transform="translate(${f2(1500 + sh)} ${f2(620 + 30 * (1 - so))}) rotate(${f2(sh * 0.6)})"><path d="M-40 -150 H40 V-110 Q80 -80 80 -20 V150 Q80 180 50 180 H-50 Q-80 180 -80 150 V-20 Q-80 -80 -40 -110 Z" fill="#fff" class="ink" stroke-width="6"/><path d="M-72 -10 H72 V150 Q72 172 50 172 H-50 Q-72 172 -72 150 Z" fill="#8A5A22" opacity="0.8"/><rect x="-46" y="${f2(-186 - 260 * popd)}" width="92" height="40" rx="10" fill="#E0455E" class="ink" stroke-width="5"/>` +
        [0, 1, 2, 3, 4, 5]
          .map(
            (i) =>
              `<circle cx="${-50 + i * 20}" cy="${f2(150 - ((t * 60 + i * 37) % 150))}" r="7" fill="#fff" opacity="0.9"/>`,
          )
          .join("") +
        (popd > 0
          ? [0, 1, 2, 3, 4]
              .map(
                (i) =>
                  `<circle cx="${-30 + i * 15}" cy="${f2(-170 - ((t * 300 + i * 50) % 260))}" r="10" fill="#8A5A22" class="ink" stroke-width="2"/>`,
              )
              .join("")
          : "") +
        `</g>`;
    }
    $("#s2-draw").innerHTML = s;
  });
  const l1 = label("s2", "s2-l1", [VX + 150, 780], [1180, 760], "Le magma", "de la roche fondue");
  const l2 = label(
    "s2",
    "s2-l2",
    [VX + 190, 660],
    [1180, 620],
    "La poche de magma",
    "il s’y accumule",
  );
  showLabel(l1, tMg + 0.2);
  showLabel(l2, tPo + 0.4);
  [l1, l2].forEach((l) => hideLabel(l, tGz - 0.3));
  show("#s2-n1", tSo + 0.5);
  pop("#s2-n2", cue("s2-5", "lave") - 0.5);
})();
