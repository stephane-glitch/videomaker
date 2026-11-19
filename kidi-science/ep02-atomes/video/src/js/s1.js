// ---------- Scène 1 : la taille des atomes (un grain de sable contre une plage) ----------
(() => {
  const tG = cue("s1-1", "grain") - 0.3,
    tA = cue("s1-2", "atomes") - 0.3,
    tP = cue("s1-2", "plage") - 0.6,
    tEnd = lineEnd("s1-2");
  const tT = cue("s1-3", "tartine") - 0.5;
  const N1 = [
    "50",
    "50 mille",
    "50 millions",
    "50 milliards",
    "50 mille milliards",
    "50 millions de milliards",
    "50 milliards de milliards",
  ];
  const N2 = ["1 000", "1 million", "1 milliard", "1 000 milliards", "1 million de milliards"];
  const n1 = document.getElementById("s1-n1"),
    n2 = document.getElementById("s1-n2");
  onDraw("s1", (t) => {
    let s = "";
    // le grain de sable, de plus en plus rempli de points
    const gx = 480,
      gy = 470,
      fill = lin(t, tA, tA + 2.4);
    s += `<path d="M${gx - 190} ${gy + 20} C ${gx - 200} ${gy - 130}, ${gx - 60} ${gy - 200}, ${gx + 70} ${gy - 170} C ${gx + 200} ${gy - 140}, ${gx + 230} ${gy + 10}, ${gx + 170} ${gy + 120} C ${gx + 90} ${gy + 210}, ${gx - 170} ${gy + 190}, ${gx - 190} ${gy + 20} Z" fill="#F2D9A0" class="ink" stroke-width="5"/>`;
    const k = Math.floor(fill * 260);
    for (let i = 0; i < k; i++) {
      const a = rnd(i) * TAU,
        r = Math.sqrt(rnd(i + 500)) * 150;
      s += `<circle cx="${f2(gx + 10 + r * Math.cos(a) * 1.15)}" cy="${f2(gy + r * Math.sin(a))}" r="5" fill="${[C.blue, "#E0455E", "#3A4256"][i % 3]}"/>`;
    }
    // la plage
    const pa = lin(t, tP, tP + 0.5);
    if (pa > 0) {
      const bx = 1440,
        by = 470;
      s +=
        `<g opacity="${f2(pa)}"><clipPath id="s1-clip"><rect x="${bx - 300}" y="${by - 200}" width="600" height="400" rx="36"/></clipPath><g clip-path="url(#s1-clip)">` +
        `<rect x="${bx - 300}" y="${by - 200}" width="600" height="400" fill="#CFEFFF"/><circle cx="${bx + 190}" cy="${by - 110}" r="52" fill="${C.hot}"/>` +
        `<path d="M${bx - 300} ${by - 20} q75 -34 150 0 t150 0 t150 0 t150 0 V${by + 200} H${bx - 300} Z" fill="#5FB7E8"/>` +
        `<path d="M${bx - 300} ${by + 60} q150 -50 300 0 t300 0 V${by + 200} H${bx - 300} Z" fill="#F2D9A0"/>`;
      const kk = Math.floor(lin(t, tP + 0.3, tP + 2.2) * 150);
      for (let i = 0; i < kk; i++)
        s += `<circle cx="${f2(bx - 290 + rnd(i + 900) * 580)}" cy="${f2(by + 90 + rnd(i + 1200) * 100)}" r="4" fill="#B9772E"/>`;
      s += `</g><rect x="${bx - 300}" y="${by - 200}" width="600" height="400" rx="36" fill="none" class="ink" stroke-width="5"/></g>`;
    }
    $("#s1-draw").innerHTML = s;
    n1.textContent = N1[Math.min(N1.length - 1, Math.floor(lin(t, tA, tA + 2.4) * N1.length))];
    n2.textContent =
      N2[Math.min(N2.length - 1, Math.floor(lin(t, tP + 0.3, tP + 2.2) * N2.length))];
    // la tartine redessinée en petits points
    if (t > tT - 0.2) {
      let d = "";
      const grow = lin(t, tT, tT + 1.6);
      for (let j = 0; j < 17; j++)
        for (let i = 0; i < 26; i++) {
          const id = j * 26 + i;
          if (rnd(id + 77) > grow) continue;
          const x = 610 + i * 28,
            y = 330 + j * 28;
          const edge = i === 0 || i === 25 || j === 0 || j === 16;
          d += `<circle cx="${x}" cy="${y}" r="11" fill="${edge ? "#B9772E" : j < 7 && i > 0 && i < 25 ? "#E0455E" : "#EBC07E"}"/>`;
        }
      $("#s1-dots").innerHTML = d;
    }
  });
  tl.fromTo("#s1-a", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tG);
  show("#s1-c1, #s1-n1", tA, { st: 0.1 });
  show("#s1-c2, #s1-n2", tP + 0.2, { st: 0.1 });
  pop("#s1-gt", tEnd - 0.6);
  tl.to(
    "#s1-n1",
    { keyframes: { scale: [1, 1.18, 1] }, duration: 0.5, ease: "power2.out" },
    tEnd - 0.5,
  );
  tl.to("#s1-a", { opacity: 0, x: -200, duration: 0.35, ease: INN }, tT - 0.4);
  tl.fromTo("#s1-b", { opacity: 0 }, { opacity: 1, duration: 0.3 }, tT - 0.1);
  show("#s1-n3", cue("s1-3", "milliards") - 0.3);
})();
