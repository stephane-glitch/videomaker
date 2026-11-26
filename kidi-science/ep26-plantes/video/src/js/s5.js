// ---------- Scène 5 : les feuilles sont vertes à cause de la chlorophylle ; en automne, l'arbre la range et les autres couleurs apparaissent ----------
(() => {
  const tVe = cue("s5-1", "vertes") - 0.5,
    tCh = cue("s5-2", "chlorophylle") - 0.6,
    tLu = cue("s5-2", "lumière") - 0.6,
    tAu = cue("s5-3", "automne") - 0.6,
    tRa = cue("s5-4", "range") - 0.5,
    tCo = cue("s5-4", "couleurs") - 0.6;
  onDraw("s5", (t) => {
    const au = ramp(t, tAu, tAu + 1.2),
      ra = ramp(t, tRa, tRa + 1.5),
      ch = ramp(t, tCh, tCh + 0.4),
      col = mixHex("#4FCB7F", "#F2B33D", Math.max(au * 0.6, ra));
    let s = panelSVG(130, 190, 1660, 660, mixHex("#E9F7FF", "#FFEBD0", au));
    // une grande feuille
    s += `<g transform="translate(360 560) rotate(${f2(-8 + 2 * Math.sin(t * 1.5))})"><path d="M-80 0 H20" stroke="#8A5A2B" stroke-width="16" stroke-linecap="round"/><path d="M0 0 Q360 -330 820 0 Q360 330 0 0 Z" fill="${col}" class="ink" stroke-width="6" stroke-linejoin="round"/><path d="M0 0 H760 M200 0 l80 -110 M200 0 l80 110 M400 0 l80 -120 M400 0 l80 120 M580 0 l60 -80 M580 0 l60 80" class="ink" stroke-width="4" opacity="0.4" fill="none"/>`;
    // les grains de chlorophylle ; en automne ils repartent vers la branche
    if (ch > 0)
      for (let i = 0; i < 26; i++) {
        const bx = 140 + rnd(i) * 560,
          by = (rnd(i + 30) - 0.5) * 240 * (1 - Math.abs(bx - 410) / 520),
          k = ramp(ra, rnd(i + 60) * 0.6, rnd(i + 60) * 0.6 + 0.4),
          x = lerp(bx, -60, k),
          y = lerp(by, 0, k);
        s += `<circle cx="${f2(x)}" cy="${f2(y + 3 * Math.sin(t * 4 + i))}" r="13" fill="#1F7A50" class="ink" stroke-width="2" opacity="${f2(ch * (1 - 0.9 * k))}"/>`;
      }
    s += `</g>`;
    if (t < tCh)
      s += txt(1380, 420, "?", 200, { w: 700, fill: "#C25E00", op: ramp(t, tVe, tVe + 0.3) });
    if (ch > 0 && au < 1)
      s += txt(1380, 330, "la chlorophylle", 56, { w: 700, fill: "#1F7A50", op: ch * (1 - au) });
    // les rayons de lumière captés
    const lu = ramp(t, tLu, tLu + 0.3) * (1 - au);
    if (lu > 0) {
      s += `<g opacity="${f2(lu)}">${sunSVG(1500, 520, 70, t)}</g>`;
      for (let i = 0; i < 5; i++) {
        const u = (t * 0.7 + i / 5) % 1;
        s += `<path d="M${f2(lerp(1400, 900, u))} ${f2(lerp(520, 470 + i * 30, u))} l-44 0" stroke="${C.fire}" stroke-width="10" stroke-linecap="round" opacity="${f2(lu * Math.sin(u * Math.PI))}"/>`;
      }
    }
    if (au > 0) {
      s += `<g opacity="${f2(au)}">${leafTreeSVG(1460, 760, 360, mixHex("#3DBE8B", "#F29A3D", ramp(t, tAu, tCo + 1)), 0, t)}</g>`;
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.25 + rnd(i)) % 1;
        s += `<g opacity="${f2(au * (1 - u))}">${leafSVG(1340 + rnd(i + 4) * 240 + 30 * Math.sin(u * 9 + i), 520 + u * 240, 34, t * 90 + i * 60, i % 2 ? "#F2B33D" : "#E0703D")}</g>`;
      }
      s += txt(1460, 300, ramp(t, tRa, tRa + 0.2) > 0.5 ? "elle range son vert" : "l’automne", 50, {
        w: 700,
        fill: "#C25E00",
        op: au,
      });
    }
    $("#s5-draw").innerHTML = s;
  });
  show("#s5-n1", tLu + 0.5);
  show("#s5-n2", tRa + 0.8);
})();
