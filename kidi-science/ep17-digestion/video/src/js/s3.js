// ---------- Scène 3 : l'intestin grêle, six mètres ; ses villosités donnent le bon au sang, le livreur ----------
(() => {
  const tSi = cue("s3-1", "Six") - 0.4,
    tDo = cue("s3-3", "doigts") - 1.0,
    tNu = cue("s3-3", "nutriments") - 0.6,
    tLi = cue("s3-3", "livre") - 0.8;
  const X0 = 760,
    W = 1000,
    YW = 560;
  onDraw("s3", (t) => {
    let s = tractSVG(
      360,
      560,
      0.75,
      2,
      lerp(3 / 13, 9 / 13, ((t - scn("s3").start) * 0.06) % 1),
      t,
    );
    const six = ramp(t, tSi, tSi + 0.3) * (1 - ramp(t, tDo - 0.3, tDo));
    if (six > 0)
      s += `<g transform="translate(1260 520) scale(${f2(six * (1 + 0.04 * Math.sin(t * 6)))})">${txt(0, 0, "6 mètres", 150, { w: 700, fill: "#C25E00" })}</g>`;
    // le gros plan : la paroi et ses petits doigts, la soupe au-dessus, le sang en dessous
    const z = ramp(t, tDo, tDo + 0.5);
    if (z > 0) {
      let g = `<rect x="${X0}" y="260" width="${W}" height="560" rx="34" fill="#FFF3C4" class="ink" stroke-width="6"/><clipPath id="s3-c"><rect x="${X0 + 6}" y="266" width="${W - 12}" height="548" rx="30"/></clipPath><g clip-path="url(#s3-c)">`;
      let d = `M${X0} ${YW}`;
      for (let i = 0; i < 8; i++) {
        const x = X0 + i * 125;
        d += ` L${x + 20} ${YW} Q${x + 20} ${f2(YW - 190 + 8 * Math.sin(t * 2 + i))} ${x + 62} ${f2(YW - 190 + 8 * Math.sin(t * 2 + i))} Q${x + 105} ${f2(YW - 190 + 8 * Math.sin(t * 2 + i))} ${x + 105} ${YW}`;
      }
      g += `<path d="${d} L${X0 + W} ${YW} V830 H${X0} Z" fill="#F7B9B0" class="ink" stroke-width="5"/>`;
      g += `<rect x="${X0}" y="690" width="${W}" height="90" fill="#FFE9E6" class="ink" stroke-width="4"/>`;
      // les nutriments descendent dans les doigts, puis partent avec le sang
      const nu = ramp(t, tNu, tNu + 0.4),
        li = ramp(t, tLi, tLi + 0.4);
      for (let i = 0; i < 12; i++) {
        const u = (t * 0.25 + rnd(i)) % 1,
          x = X0 + 62 + (i % 8) * 125;
        g += `<circle cx="${f2(x + 10 * Math.sin(t * 3 + i))}" cy="${f2(lerp(300, 300 + 380 * nu, u))}" r="11" fill="${C.hot}" class="ink" stroke-width="3" opacity="${f2(Math.sin(u * Math.PI))}"/>`;
      }
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.2 + i / 5) % 1;
        g +=
          rbcSVG(X0 + u * W, 735, 26) +
          (li > 0
            ? `<circle cx="${f2(X0 + u * W)}" cy="700" r="10" fill="${C.hot}" class="ink" stroke-width="3" opacity="${f2(li)}"/>`
            : "");
      }
      g += `</g>`;
      s += `<g opacity="${f2(z)}" transform="translate(${f2(40 * (1 - z))} 0)">${g}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  const l1 = label(
    "s3",
    "s3-l1",
    [X0 + 310, 420],
    [X0 + 120, 150],
    "Les villosités",
    "des millions de petits doigts",
  );
  const l2 = label(
    "s3",
    "s3-l2",
    [X0 + 700, 735],
    [X0 + 620, 150],
    "Le sang",
    "il emporte les nutriments",
  );
  showLabel(l1, tDo + 0.6);
  showLabel(l2, tLi + 0.3);
  pop("#s3-n1", cue("s3-4", "livreur") - 0.3);
})();
