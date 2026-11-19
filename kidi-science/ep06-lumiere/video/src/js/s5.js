// ---------- Scène 5 : l'œil (la rétine et ses trois sortes de capteurs), le jaune fabriqué par le cerveau ----------
(() => {
  const tRet = cue("s5-2", "rétine") - 0.4,
    tCones = cue("s5-2", "Trois") - 0.3,
    tY = cue("s5-4", "Rouge") - 0.5,
    tTV = cue("s5-5", "écran") - 0.5;
  const EX = 620,
    EY = 560,
    ER = 300;
  const say = document.getElementById("s5-say");
  const CN = ["#E0455E", "#3DBE8B", "#2F5BD3"];
  onDraw("s5", (t) => {
    const yel = t >= tY,
      light = yel ? C.hot : "#E0455E";
    let s = "";
    // l'œil en coupe : la lumière entre à gauche, la rétine tapisse le fond à droite
    s += `<circle cx="${EX}" cy="${EY}" r="${ER}" fill="#fff" class="ink" stroke-width="6"/><ellipse cx="${EX - ER + 50}" cy="${EY}" rx="46" ry="110" fill="#CFEFFF" class="ink" stroke-width="5"/><path d="M${EX - ER - 14} ${EY - 80} Q${EX - ER - 70} ${EY} ${EX - ER - 14} ${EY + 80}" fill="none" class="ink" stroke-width="6"/>`;
    // le rayon qui entre
    s += beamSVG(120, EY, EX + ER - 60, EY, light, t, 1, 18);
    // les capteurs sur la rétine
    const cones = lin(t, tCones, tCones + 0.6);
    for (let i = 0; i < 15; i++) {
      const a = rad(-56 + i * 8),
        x = EX + (ER - 34) * Math.cos(a),
        y = EY + (ER - 34) * Math.sin(a),
        k = i % 3;
      const fires = yel ? k < 2 : k === 0,
        on = cones > 0 ? 1 : 0.15;
      const pulse = fires && cones > 0 ? 1 + 0.25 * Math.abs(Math.sin(t * 6 + i)) : 1;
      s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(17 * pulse)}" fill="${fires || cones === 0 ? CN[k] : "#fff"}" stroke="${CN[k]}" stroke-width="6" opacity="${f2(on)}"/>`;
    }
    // le nerf vers le cerveau
    s += `<path d="M${EX + ER} ${EY} C ${EX + ER + 120} ${EY}, 1100 400, 1200 330" fill="none" stroke="${C.ink}" stroke-width="18" stroke-linecap="round"/><path d="M${EX + ER} ${EY} C ${EX + ER + 120} ${EY}, 1100 400, 1200 330" fill="none" stroke="${C.spark}" stroke-width="9" stroke-dasharray="12 22" stroke-dashoffset="${f2(-t * 160)}" stroke-linecap="round"/>`;
    // l'écran de télé : chaque point est fait de trois petites lampes rouge, verte, bleue
    const tv = lin(t, tTV, tTV + 0.5);
    if (tv > 0) {
      let g = `<rect x="1180" y="440" width="560" height="380" rx="30" fill="${C.ink}"/>`;
      for (let j = 0; j < 4; j++)
        for (let i = 0; i < 5; i++)
          for (let k = 0; k < 3; k++) {
            const lit = yel ? k < 2 : k === 0;
            g += `<rect x="${1210 + i * 104 + k * 30}" y="${468 + j * 84}" width="24" height="64" rx="8" fill="${lit ? CN[k] : "#39425C"}"/>`;
          }
      s += `<g opacity="${f2(tv)}">${g}</g>`;
    }
    $("#s5-draw").innerHTML = s;
    say.textContent = yel ? "jaune !" : "rouge";
    say.style.color = yel ? "#B88A00" : "#E0455E";
  });
  const lab = {
    ret: label(
      "s5",
      "s5-l-ret",
      [EX + 250, EY + 130],
      [640, 920],
      "La rétine",
      "un écran couvert de capteurs",
    ),
  };
  showLabel(lab.ret, tRet);
  tl.fromTo(
    "#s5-brain",
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.4, ease: OUT },
    cue("s5-2", "rouge") - 0.2,
  );
  show("#s5-n1", tTV + 0.4);
})();
