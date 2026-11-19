// ---------- Scène 3 : la pomme avale toutes les couleurs sauf le rouge ; le noir avale tout, le blanc renvoie tout ----------
(() => {
  const tIn = cue("s3-2", "reçoit") - 0.4,
    tOut = cue("s3-2", "renvoie") - 0.5,
    tTee = cue("s3-5", "noir") - 0.7;
  const tee = (x, y, col, ink) =>
    `<path d="M${x - 150} ${y - 150} L${x - 60} ${y - 190} Q${x} ${y - 150} ${x + 60} ${y - 190} L${x + 150} ${y - 150} L${x + 200} ${y - 60} L${x + 130} ${y - 20} L${x + 110} ${y - 60} V${y + 190} H${x - 110} V${y - 60} L${x - 130} ${y - 20} L${x - 200} ${y - 60} Z" fill="${col}" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>`;
  onDraw("s3", (t) => {
    const b = ramp(t, tTee, tTee + 0.6);
    let s = "";
    if (b < 1) {
      // six rayons de couleur arrivent sur la pomme ; un seul repart
      const ax = 960,
        ay = 620;
      let g = "";
      RAINBOW.forEach((c, i) => {
        g += beamSVG(
          180,
          250 + i * 40,
          ax - 150,
          ay - 110 + i * 34,
          c,
          t + i * 0.1,
          (t - tIn - i * 0.08) * 1.6,
          12,
        );
      });
      g += `<path d="M${ax} ${ay - 150} C ${ax - 110} ${ay - 230}, ${ax - 250} ${ay - 150}, ${ax - 240} ${ay + 10} C ${ax - 230} ${ay + 160}, ${ax - 110} ${ay + 250}, ${ax} ${ay + 200} C ${ax + 110} ${ay + 250}, ${ax + 230} ${ay + 160}, ${ax + 240} ${ay + 10} C ${ax + 250} ${ay - 150}, ${ax + 110} ${ay - 230}, ${ax} ${ay - 150} Z" fill="#E0455E" class="ink" stroke-width="6"/><path d="M${ax} ${ay - 150} C ${ax - 4} ${ay - 210}, ${ax + 20} ${ay - 250}, ${ax + 50} ${ay - 270}" fill="none" class="ink" stroke-width="10"/><ellipse cx="${ax - 110}" cy="${ay - 60}" rx="40" ry="64" fill="#fff" opacity="0.3" transform="rotate(24 ${ax - 110} ${ay - 60})"/>`;
      if (t >= tOut) {
        g +=
          beamSVG(ax + 200, ay - 120, 1560, 380, "#E0455E", t, (t - tOut) * 1.5, 16) +
          eyeSVG(1660, 340, 1.2);
      }
      s += `<g opacity="${f2(1 - b)}">${g}</g>`;
    }
    if (b > 0) {
      // deux tee-shirts au soleil
      let g =
        sunSVG(960, 250, 90, t) +
        tee(520, 600, "#2A3350", "#000") +
        tee(1400, 600, "#FFFFFF", C.ink);
      // la lumière blanche du Soleil : le noir la garde, le blanc la renvoie
      const u = (t - tTee) * 1.4;
      g +=
        beamSVG(880, 300, 600, 520, "#FFFFFF", t, u, 20) +
        beamSVG(1040, 300, 1320, 520, "#FFFFFF", t, u, 20) +
        beamSVG(1320, 520, 1700, 330, "#FFFFFF", t, u - 1, 20);
      // la chaleur monte du tee-shirt noir
      for (let i = 0; i < 3; i++) {
        const u = (t * 0.6 + i / 3) % 1;
        g += `<path d="M${440 + i * 80} ${f2(400 - u * 90)} q18 -20 0 -40 q-18 -20 0 -40" fill="none" stroke="${C.fire}" stroke-width="9" stroke-linecap="round" opacity="${f2(1 - u)}"/>`;
      }
      s += `<g opacity="${f2(b)}">${g}</g>`;
    }
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tOut + 0.3);
  tl.to("#s3-n1", { opacity: 0, duration: 0.3 }, tTee - 0.2);
  show("#s3-n2", tTee + 0.5);
  show("#s3-n3", cue("s3-5", "blanc") - 0.3);
})();
