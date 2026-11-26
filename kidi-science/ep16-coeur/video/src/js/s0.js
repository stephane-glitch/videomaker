// ---------- Scène 0 : le cœur cogne quand on court : c'est une pompe, un muscle gros comme le poing ----------
(() => {
  // l'icône du générique devient un cœur pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML = heartSVG(75, 82, 0.5);
  const tP = cue("s0-2", "pompe") - 0.5,
    tF = cue("s0-2", "poing") - 0.8,
    tC = cue("s0-4", "Cent") - 0.3;
  onDraw("s0", (t) => {
    const calm = ramp(t, tP, tP + 1.0),
      bpm = lerp(150, 80, calm),
      b = beatAt(t, bpm);
    let s = `<path d="M130 850 H1790" class="ink" stroke-width="6"/>`;
    // la coureuse
    const run = 1 - calm,
      bob = 14 * Math.abs(Math.sin(t * 9)) * run;
    s += figSVG(420 + 60 * Math.sin(t * 0.8) * run, 848 - bob, 2.4, C.blue);
    for (let i = 0; i < 3; i++)
      s += `<path d="M${f2(200 - i * 30)} ${560 + i * 70} h${90 - i * 14}" stroke="${C.smoke}" stroke-width="10" stroke-linecap="round" opacity="${f2(run * (0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i))))}"/>`;
    // le cœur qui bat
    s +=
      heartSVG(960, 520, 1.5 * (1 + 0.12 * b)) +
      [-1, 1]
        .map(
          (d) =>
            `<path d="M${960 + d * 250} 440 q${d * 40} 80 0 160" fill="none" stroke="#E0455E" stroke-width="12" stroke-linecap="round" opacity="${f2(Math.min(1, b))}"/>`,
        )
        .join("");
    // le poing, de la même taille
    const f = ramp(t, tF, tF + 0.4);
    if (f > 0)
      s += `<g opacity="${f2(f)}" transform="translate(${f2(1440 + 40 * (1 - f))} 520)"><path d="M-110 -80 Q-110 -130 -60 -130 H60 Q120 -130 120 -70 V60 Q120 130 50 130 H-50 Q-110 130 -110 70 Z" fill="#FFD9B8" class="ink" stroke-width="6"/><path d="M-60 -130 V-40 M0 -130 V-40 M60 -130 V-40" class="ink" stroke-width="5"/><path d="M-110 10 Q-20 -20 60 30" fill="none" class="ink" stroke-width="6" stroke-linecap="round"/>${txt(-240, 30, "=", 130, { w: 700, fill: "#C25E00" })}</g>`;
    // le compteur de battements
    const c = ramp(t, tC, tC + 1.6);
    if (c > 0)
      s += `<g transform="translate(960 250) scale(${f2(0.9 + 0.1 * Math.min(1, c * 3) + 0.03 * b)})">${txt(0, 0, String(Math.round(100000 * c)).replace(/\B(?=(\d{3})+(?!\d))/g, " "), 110, { w: 700, fill: "#E0455E" })}</g>`;
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tF + 0.5);
  pop("#s0-n2", tC + 1.4);
})();
