// ---------- Scène 0 : crier dans l'espace (silence) ou à la maison (ça traverse trois étages) ----------
(() => {
  const S = scn("s0");
  const tSp = cue("s0-1", "espace") - 0.5,
    tHome = cue("s0-2", "voix") - 0.5,
    tAir = cue("s0-4", "air") - 0.5;
  onDraw("s0", (t) => {
    let s = "";
    // --- l'espace : un panneau sombre, un cri qui ne part pas ---
    const sp = lin(t, tSp, tSp + 0.4);
    if (sp > 0) {
      let g = `<rect x="130" y="280" width="760" height="560" rx="34" fill="${C.ink}" class="ink" stroke-width="5"/>`;
      for (let i = 0; i < 26; i++)
        g += `<circle cx="${f2(150 + rnd(i) * 720)}" cy="${f2(300 + rnd(i + 60) * 520)}" r="${1.5 + rnd(i + 9) * 2.5}" fill="#fff" opacity="0.8"/>`;
      g +=
        figSVG(400, 700 + 10 * Math.sin(t * 1.2), 1.6, "#fff") +
        `<circle cx="400" cy="${f2(486 + 10 * Math.sin(t * 1.2))}" r="66" fill="none" stroke="#fff" stroke-width="8" opacity="0.8"/>`;
      // les ondes essaient de partir… et s'éteignent tout de suite
      g += waves(480, 490, 0, t * 1.2, { n: 2, gap: 34, r0: 30, col: "#8FD3FF", max: 110, w: 7 });
      g += `<path d="M640 430 L740 530 M740 430 L640 530" stroke="#E0455E" stroke-width="18" stroke-linecap="round"/>`;
      s += `<g opacity="${f2(sp)}">${g}</g>`;
    }
    // --- la maison : trois étages, le cri les traverse tous ---
    const hm = lin(t, tHome, tHome + 0.4);
    if (hm > 0) {
      let g = `<path d="M1010 420 L1410 250 L1810 420 Z" fill="#E0455E" class="ink" stroke-width="5"/><rect x="1050" y="420" width="720" height="420" fill="#fff" class="ink" stroke-width="5"/><path d="M1050 560 H1770 M1050 700 H1770" class="ink" stroke-width="5"/>`;
      g += figSVG(1190, 836, 0.75, C.blue);
      g += `<clipPath id="s0-house"><path d="M1010 420 L1410 250 L1810 420 V840 H1050 V420 Z"/></clipPath><g clip-path="url(#s0-house)">${waves(1230, 760, -52, t * 1.1, { n: 7, gap: 80, r0: 50, half: 44, col: C.fire, max: 640, w: 11 })}</g>`;
      s += `<g opacity="${f2(hm)}">${g}</g>`;
    }
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-logo", S.start + 0.5, { y: -20 });
  show("#s0-n1", cue("s0-1", "crier") - 0.2);
  show("#s0-n2", cue("s0-3", "trois") - 0.4);
  pop("#s0-n3", tAir);
})();
