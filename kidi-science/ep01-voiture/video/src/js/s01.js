// ---------- Scènes 0 et 1 : la voiture roule, devient transparente, puis on nomme ses organes ----------
(() => {
  const S = scn("s01");
  document.getElementById("s01-car").innerHTML = carSVG("c1");
  // collines et nuages qui défilent (motif répété tous les 1920 px)
  let hills = "";
  for (let k = 0; k < 3; k++) {
    const x = k * 1920;
    hills +=
      `<path d="M${x} 827 Q${x + 300} 640 ${x + 620} 827 Z" fill="#DDEBCB"/>` +
      `<path d="M${x + 520} 827 Q${x + 900} 560 ${x + 1320} 827 Z" fill="#CFE3BE"/>` +
      `<path d="M${x + 1200} 827 Q${x + 1560} 680 ${x + 1920} 827 Z" fill="#DDEBCB"/>` +
      `<g fill="#fff" opacity="0.9"><ellipse cx="${x + 380}" cy="330" rx="110" ry="34"/><ellipse cx="${x + 450}" cy="304" rx="70" ry="34"/><ellipse cx="${x + 1380}" cy="250" rx="130" ry="38"/><ellipse cx="${x + 1300}" cy="226" rx="74" ry="34"/></g>`;
  }
  document.getElementById("s01-hills").innerHTML = hills;
  let dash = "";
  for (let i = -1; i < 14; i++)
    dash += `<rect x="${i * 160}" y="864" width="90" height="12" rx="6" fill="#fff"/>`;
  document.getElementById("s01-dash").innerHTML = dash;

  // La voiture ralentit puis s'arrête quand Max dit « Viens, on va regarder dedans ».
  const V = 560,
    t1 = cue("s0-2", "Viens"),
    t2 = t1 + 1.8;
  const dist = (t) => {
    const a = Math.max(0, Math.min(t, t1) - S.start + 2);
    if (t <= t1) return V * a;
    const u = Math.min(t, t2) - t1;
    return V * a + V * (u - (u * u) / (2 * (t2 - t1)));
  };
  const PUL = [];
  const paintEl = () => document.getElementById("c1-paint");
  const tGhost = cue("s0-2", "Tout") - 0.2;
  onDraw("s01", (t) => {
    const d = dist(t);
    carWheels("c1", d / (CAR.R * CARPOS.k));
    document.getElementById("s01-dash").setAttribute("transform", `translate(${f2(-(d % 160))} 0)`);
    document
      .getElementById("s01-hills")
      .setAttribute("transform", `translate(${f2(-((d * 0.3) % 1920))} 0)`);
    paintEl().setAttribute("opacity", f2(1 - 0.94 * ramp(t, tGhost, tGhost + 1.1)));
    carPulses("c1", PUL, t);
  });

  // Scène 0
  show("#s01-logo", S.start + 0.5, { y: -20 });
  pop("#s01-q", cue("s0-1", "qui") - 0.15);
  tl.to(
    "#s01-q",
    { opacity: 0, scale: 0.4, duration: 0.25, ease: INN },
    SCHED.lines["s0-2"].start + 0.3,
  );
  tl.fromTo(
    "#s01-chap",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.45, ease: OUT },
    SCHED.parts.s1.start + 0.6,
  );

  // Scène 1 : chaque organe s'allume quand on le nomme
  const L = (key, id, t, title, sub, o) => label("s01", id, carPt(CAR.at[key]), t, title, sub, o);
  const labs = {
    tank: L("tank", "s01-l-tank", [150, 190], "Réservoir", "l’essence", { color: "#C25E00" }),
    batt: L("batt", "s01-l-batt", [760, 930], "Batterie", "l’électricité", { color: "#9A7400" }),
    eng: L("eng", "s01-l-eng", [1500, 190], "Moteur", "transforme l’énergie en mouvement", {
      color: C.blue,
      align: "r",
    }),
    gear: L("gear", "s01-l-gear", [1240, 930], "Transmission", "emmène le mouvement aux roues", {
      color: C.blueD,
    }),
    steer: L("steer", "s01-l-steer", [640, 170], "Direction", null),
    brake: L("brake", "s01-l-brake", [1690, 690], "Freins", null),
  };
  tl.fromTo(
    "#s01-chain",
    { opacity: 0 },
    { opacity: 0.55, duration: 0.5 },
    cue("s1-2", "chaîne") - 0.2,
  );
  const beats = [
    ["tank", ["tank"], cue("s1-2", "essence")],
    ["batt", ["batt"], cue("s1-2", "électricité")],
    ["eng", ["eng"], cue("s1-2", "moteur")],
    ["gear", ["gear"], cue("s1-2", "transmission")],
    ["steer", ["steer"], cue("s1-2", "direction")],
    ["brake", ["brf", "brr"], cue("s1-2", "freins")],
  ];
  beats.forEach(([k, parts, t]) => {
    showLabel(labs[k], t - 0.2);
    parts.forEach((q) => PUL.push([q, t - 0.15, 0.24, 0.55]));
  });
  tl.to(
    "#c1-brf circle, #c1-brr circle",
    { fill: C.fire, duration: 0.3 },
    cue("s1-2", "freins") - 0.15,
  );

  // « Par le cœur : le moteur » → tout s'efface sauf le moteur, puis on plonge dedans.
  const tHeart = cue("s1-4", "moteur") - 0.25;
  const all = Object.values(labs).flat();
  tl.to(
    all.concat(["#s01-chain", "#s01-chap", "#s01-logo"]),
    { opacity: 0, duration: 0.3, ease: INN },
    tHeart - 0.3,
  );
  tl.to("#c1-tank, #c1-batt, #c1-gear, #c1-steer", { opacity: 0.25, duration: 0.3 }, tHeart - 0.3);
  PUL.push(["eng", tHeart, 0.32, 0.45], ["eng", tHeart + 0.45, 0.32, 0.45]);
  const [ex, ey] = carPt(CAR.at.eng);
  const tZoom = S.end - 0.75;
  tl.to(
    "#s01-in",
    { scale: 7, opacity: 0, duration: 0.75, ease: "power3.in", transformOrigin: `${ex}px ${ey}px` },
    tZoom,
  );
  tl.fromTo(
    "#s2-in",
    { scale: 0.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.7, ease: "power4.out", transformOrigin: "760px 560px" },
    scn("s2").start,
  );
})();
