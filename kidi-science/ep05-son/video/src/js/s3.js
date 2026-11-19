// ---------- Scène 3 : l'oreille (le tympan, les trois osselets, l'escargot, le cerveau) ----------
(() => {
  const tDrum = cue("s3-2", "tympan") - 0.4,
    tBones = cue("s3-2", "trois") - 0.4,
    tSnail = cue("s3-2", "escargot") - 0.4,
    tBrain = cue("s3-2", "cerveau") - 0.5;
  onDraw("s3", (t) => {
    const v = Math.sin(t * 22),
      on = t >= tDrum ? 1 : 0;
    let s = "";
    // le pavillon et le conduit
    s += `<path d="M330 330 C 180 330, 150 520, 230 640 C 280 720, 300 800, 380 800 C 440 800, 440 720, 400 680 C 340 620, 380 520, 430 520 H760 V600 H470 C 430 600, 430 660, 470 700" fill="#FFD9B8" class="ink" stroke-width="6"/>`;
    s += `<rect x="430" y="512" width="340" height="96" fill="#FBE7D3"/><path d="M430 512 H770 M430 608 H770" class="ink" stroke-width="5"/>`;
    // les ondes qui entrent
    s += waves(120, 560, 0, t * 1.4, { n: 5, gap: 70, r0: 40, half: 26, max: 560, w: 10 });
    // le tympan : une peau qui vibre
    const dx = on * 12 * v;
    s += `<path d="M770 500 Q${f2(770 + dx * 2)} 560 770 620" fill="none" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/><path d="M770 500 Q${f2(770 + dx * 2)} 560 770 620" fill="none" stroke="#E0455E" stroke-width="7" stroke-linecap="round"/>`;
    // les trois osselets, articulés, qui transmettent la vibration
    const b = t >= tBones ? 1 : 0.25,
      w = on * 7 * v;
    s +=
      `<g opacity="${f2(b)}"><path d="M${f2(780 + w)} 560 L${f2(860 + w)} 500 L${f2(900 + w * 0.8)} 560" fill="none" stroke="${C.ink}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/><path d="M${f2(780 + w)} 560 L${f2(860 + w)} 500 L${f2(900 + w * 0.8)} 560" fill="none" stroke="#FFF8EC" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M${f2(900 + w * 0.8)} 560 L${f2(960 + w * 0.6)} 520" stroke="${C.ink}" stroke-width="24" stroke-linecap="round"/><path d="M${f2(900 + w * 0.8)} 560 L${f2(960 + w * 0.6)} 520" stroke="#FFF8EC" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M${f2(960 + w * 0.6)} 520 L${f2(1010 + w * 0.5)} 560 M${f2(996 + w * 0.5)} 540 a22 26 0 1 0 28 40" fill="none" stroke="${C.ink}" stroke-width="20" stroke-linecap="round"/><path d="M${f2(960 + w * 0.6)} 520 L${f2(1010 + w * 0.5)} 560" stroke="#FFF8EC" stroke-width="10" stroke-linecap="round"/></g>`;
    // l'escargot (la cochlée) rempli de liquide, où la vibration devient un signal
    const c = t >= tSnail ? 1 : 0.25;
    let sp = "";
    for (let a = 0; a < 2.6 * TAU; a += 0.12) {
      const r = 26 + a * 13;
      sp += `${a === 0 ? "M" : "L"}${f2(1200 + r * Math.cos(a))} ${f2(580 + r * Math.sin(a))}`;
    }
    s +=
      `<g opacity="${f2(c)}"><path d="${sp}" fill="none" stroke="${C.ink}" stroke-width="44" stroke-linecap="round"/><path d="${sp}" fill="none" stroke="#8FD3FF" stroke-width="32" stroke-linecap="round"/>` +
      (t >= tSnail
        ? `<path d="${sp}" fill="none" stroke="#fff" stroke-width="10" stroke-dasharray="14 40" stroke-dashoffset="${f2(-t * 120)}" stroke-linecap="round"/>`
        : "") +
      `</g>`;
    // le nerf et le cerveau
    const br = lin(t, tBrain, tBrain + 0.4);
    if (br > 0)
      s += `<g opacity="${f2(br)}"><path d="M1330 560 C 1420 520, 1460 460, 1520 420" fill="none" stroke="${C.ink}" stroke-width="18" stroke-linecap="round"/><path d="M1330 560 C 1420 520, 1460 460, 1520 420" fill="none" stroke="${C.spark}" stroke-width="9" stroke-dasharray="12 22" stroke-dashoffset="${f2(-t * 160)}" stroke-linecap="round"/><path d="M1500 420 C 1470 330, 1560 250, 1650 290 C 1740 240, 1830 320, 1790 400 C 1830 470, 1760 540, 1680 510 C 1600 550, 1510 500, 1500 420 Z" fill="#F7A8B8" class="ink" stroke-width="6"/><path d="M1580 330 q30 40 0 80 M1680 320 q-30 60 20 110 M1620 440 q50 20 90 -10" fill="none" class="ink" stroke-width="4"/></g>`;
    $("#s3-draw").innerHTML = s;
  });
  const lab = {
    drum: label("s3", "s3-l-drum", [772, 510], [560, 330], "Le tympan", "une peau qui vibre", {
      color: "#C2334C",
    }),
    bones: label("s3", "s3-l-bones", [900, 580], [760, 780], "Trois petits os", "ils transmettent"),
    snail: label("s3", "s3-l-snail", [1230, 690], [1130, 860], "L’escargot", "rempli de liquide", {
      color: "#1A7FC4",
    }),
    brain: label("s3", "s3-l-brain", [1700, 500], [1500, 640], "Le cerveau", "il comprend le son", {
      color: "#C2334C",
    }),
  };
  showLabel(lab.drum, tDrum);
  showLabel(lab.bones, tBones);
  showLabel(lab.snail, tSnail);
  showLabel(lab.brain, tBrain + 0.2);
})();
