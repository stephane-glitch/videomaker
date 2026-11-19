// ---------- Scène 7 : le récapitulatif ----------
(() => {
  const S = scn("s7");
  const flows =
    `<g id="s7-f1"><path d="M280 286 C 480 190, 780 190, 930 262" fill="none" stroke="${C.ink}" stroke-width="20" stroke-linecap="round"/><path class="fl" d="M280 286 C 480 190, 780 190, 930 262" fill="none" stroke="${C.fire}" stroke-width="12" stroke-dasharray="26 22" stroke-linecap="round"/></g>` +
    `<g id="s7-f2"><path d="M800 318 C 850 300, 880 296, 908 292" fill="none" stroke="${C.ink}" stroke-width="20" stroke-linecap="round"/><path class="fl" d="M800 318 C 850 300, 880 296, 908 292" fill="none" stroke="${C.spark}" stroke-width="12" stroke-dasharray="26 22" stroke-linecap="round"/></g>` +
    `<g id="s7-f3"><path class="fl" d="M905 300 L855 304 L930 372" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="14 18" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  document.getElementById("s7-car").innerHTML = carSVG("c2") + flows;
  document.getElementById("c2-paint").setAttribute("opacity", "0.06");
  let dash = "";
  for (let i = -1; i < 14; i++)
    dash += `<rect x="${i * 160}" y="864" width="90" height="12" rx="6" fill="#fff"/>`;
  document.getElementById("s7-dash").innerHTML = dash;

  const tE = cue("s7-1", "énergie") - 0.2,
    tM = cue("s7-1", "tourner") - 0.5,
    tT = cue("s7-1", "transmission") - 0.2,
    tF = cue("s7-1", "freins") - 0.1;
  // vitesse de la voiture (pixels par seconde) : elle démarre avec la transmission, les freins l'arrêtent
  const V = [
    [tT, 0],
    [tT + 0.9, 520],
    [tF + 0.3, 520],
    [tF + 1.5, 0],
  ];
  const fl = [...document.querySelectorAll("#s7-car .fl")];
  onDraw("s7", (t) => {
    const d = integ(V, t);
    carWheels("c2", d / (CAR.R * CARPOS.k));
    document.getElementById("s7-dash").setAttribute("transform", `translate(${f2(-(d % 160))} 0)`);
    fl.forEach((p) => p.setAttribute("stroke-dashoffset", f2(-(t - S.start) * 90)));
    carPulses("c2", PUL, t);
  });
  const PUL = [];
  const pulse = (keys, t) => keys.forEach((k) => PUL.push([k, t, 0.25, 0.55]));
  tl.fromTo("#s7-f1, #s7-f2", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tE);
  pulse(["tank", "batt"], tE);
  pulse(["eng"], tM);
  tl.fromTo("#s7-f3", { opacity: 0 }, { opacity: 1, duration: 0.3 }, tT);
  pulse(["gear"], tT);
  tl.to("#c2-brf circle, #c2-brr circle", { fill: C.fire, duration: 0.3 }, tF + 0.3);
  pulse(["brf", "brr"], tF + 0.3);
  tl.to("#s7-f1, #s7-f2, #s7-f3", { opacity: 0, duration: 0.4 }, tF + 1.4);
  show("#s7-head", cue("s7-2", "chaîne") - 0.4, { y: -30 });
  tl.fromTo(
    "#s7-chain .c",
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.35, ease: OUT, stagger: 0.16 },
    cue("s7-2", "transforme") - 0.3,
  );
  // « et l'essence, elle vient d'où ? »
  pop("#s7-q", cue("s7-3", "essence") - 0.2);
  pulse(["tank"], cue("s7-3", "essence") - 0.1);
  tl.to("#s7-head", { opacity: 0, duration: 0.3 }, cue("s7-4", "prochaine") - 0.5);
  pop("#s7-next", cue("s7-4", "prochaine") - 0.3);
  // fin : tout s'élève, le logo revient
  const tEnd = S.end - 3.2;
  tl.to("#s7-main", { y: -200, opacity: 0, duration: 0.45, ease: INN }, tEnd);
  tl.fromTo(
    "#s7-end",
    { opacity: 0, scale: 0.5, y: 80 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
    tEnd + 0.4,
  );
  show("#s7-bye", tEnd + 0.9);
})();
