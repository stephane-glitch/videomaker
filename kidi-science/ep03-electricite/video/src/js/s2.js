// ---------- Scène 2 : le circuit (une boucle complète), le fil coupé, l'interrupteur ----------
(() => {
  const S = scn("s2");
  const tCut = cue("s2-1", "coupe") - 0.2,
    tHeal = cue("s2-3", "boucle") - 0.5,
    tSw = cue("s2-3", "interrupteur") - 0.5;
  const tDown = cue("s2-3", "baissé") - 0.3,
    tUp = cue("s2-3", "Levé") - 0.3,
    tZ1 = cue("s2-4", "éteins") - 0.9,
    tZ2 = cue("s2-4", "lève") - 0.2;
  // ouverture du circuit : 0 = fermé (le courant passe), 1 = ouvert
  const open = (t) => {
    if (t < tHeal) return ramp(t, tCut, tCut + 0.4);
    if (t < tSw) return 1 - ramp(t, tHeal, tHeal + 0.5);
    if (t < tDown) return ramp(t, tSw, tSw + 0.5);
    if (t < tUp) return 1 - ramp(t, tDown, tDown + 0.4);
    if (t < tZ1) return ramp(t, tUp, tUp + 0.4);
    if (t < tZ2) return 1 - ramp(t, tZ1, tZ1 + 0.4);
    return ramp(t, tZ2, tZ2 + 0.4);
  };
  const X0 = 460,
    X1 = 1460,
    Y0 = 300,
    Y1 = 800;
  const loop = mkPath([
    [X0, Y1],
    [X0, Y0],
    [X1, Y0],
    [X1, Y1],
  ]);
  // vitesse des électrons : proportionnelle à « fermé »
  const steps = [];
  for (let t = S.start; t <= S.end + 0.2; t += 0.1) steps.push([t, 150 * (1 - open(t))]);
  onDraw("s2", (t) => {
    const o = open(t),
      on = 1 - o,
      sw = t >= tSw - 0.1;
    let s = wireSVG(loop.d);
    // la coupure (ou l'interrupteur) au milieu du fil du bas
    const gx = 960,
      gap = 150;
    s += `<rect x="${gx - gap / 2}" y="${Y1 - 22}" width="${gap}" height="44" fill="#FFF8EC"/>`;
    if (!sw) {
      // deux bouts de fil qui s'écartent
      const d = o * 46;
      s +=
        wireSVG(`M${gx - gap / 2 - 4} ${Y1} L${gx - 6} ${f2(Y1 + d)}`) +
        wireSVG(`M${gx + gap / 2 + 4} ${Y1} L${gx + 6} ${f2(Y1 - d)}`);
    } else {
      // le pont-levis : il pivote autour de son extrémité gauche
      const a = -38 * o;
      s += `<circle cx="${gx - gap / 2}" cy="${Y1}" r="20" fill="${C.metal}" class="ink"/><circle cx="${gx + gap / 2}" cy="${Y1}" r="20" fill="${C.metal}" class="ink"/>`;
      s += `<g transform="rotate(${f2(a)} ${gx - gap / 2} ${Y1})"><rect x="${gx - gap / 2 - 10}" y="${Y1 - 16}" width="${gap + 20}" height="32" rx="14" fill="${C.blue}" class="ink"/></g>`;
    }
    // les électrons circulent tant que la boucle est fermée
    const d = integ(steps, t);
    for (let i = 0; i < 22; i++) {
      const [x, y] = loop.at(d + (i * loop.L) / 22);
      if (Math.abs(x - gx) < gap / 2 + 10 && Math.abs(y - Y1) < 4) continue;
      s += ball(x, y, 13, C.spark, { w: 3 });
    }
    // la pile, à gauche
    s +=
      `<rect x="${X0 - 70}" y="440" width="140" height="240" rx="24" fill="${C.blue}" class="ink" stroke-width="5"/><rect x="${X0 - 70}" y="440" width="140" height="80" rx="24" fill="${C.fire}" class="ink" stroke-width="5"/><rect x="${X0 - 26}" y="410" width="52" height="34" rx="8" fill="${C.metal}" class="ink"/>` +
      txt(X0, 496, "+", 60, { fill: "#fff", w: 700 }) +
      txt(X0, 650, "−", 60, { fill: "#fff", w: 700 });
    // l'ampoule, à droite
    s += `<g transform="rotate(90 ${X1} 550)">${bulbSVG(X1, 480, on, 0.8)}</g>`;
    $("#s2-draw").innerHTML = s;
  });
  const lab = {
    pile: label("s2", "s2-l-pile", [X0 - 70, 600], [200, 520], "La pile", null, { align: "r" }),
    amp: label("s2", "s2-l-amp", [X1 + 150, 470], [1590, 300], "L’ampoule", null),
  };
  showLabel(lab.pile, cue("s2-1", "pile") - 0.2);
  showLabel(lab.amp, cue("s2-1", "ampoule") - 0.2);
  show("#s2-n1", tHeal + 0.3);
  show("#s2-n2", cue("s2-3", "pont") - 0.3);
})();
