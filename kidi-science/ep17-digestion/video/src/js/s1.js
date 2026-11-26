// ---------- Scène 1 : la bouche (les dents, la salive), puis l'œsophage qui pousse comme un tube de dentifrice ----------
(() => {
  const tD = cue("s1-1", "dents") - 0.4,
    tSa = cue("s1-1", "salive") - 0.5,
    tAv = cue("s1-3", "avales") - 0.4,
    tDe = cue("s1-3", "dentifrice") - 1.6,
    tUp = cue("s1-4", "tête") - 0.6,
    tNo = cue("s1-5", "mange") - 0.6;
  onDraw("s1", (t) => {
    const oe = ramp(t, tAv, tAv + 0.6),
      mapU = lerp(0, 1 / 13, oe);
    let s = tractSVG(360, 560, 0.75, 0, mapU, t);
    if (oe < 1) {
      // la bouche en gros plan : les dents montent et descendent sur la tartine
      const ch = 34 * Math.abs(Math.sin(t * 7)) * ramp(t, tD, tD + 0.3);
      let g = `<rect x="900" y="330" width="760" height="420" rx="120" fill="#7A2231" class="ink" stroke-width="8"/>`;
      g += toastSVG(1280, 540, 0, 1.2 * (1 - 0.3 * ramp(t, tD, tAv)));
      for (let i = 0; i < 7; i++)
        g += `<rect x="${950 + i * 96}" y="${f2(330 + ch - 6)}" width="84" height="110" rx="20" fill="#fff" class="ink" stroke-width="5"/><rect x="${950 + i * 96}" y="${f2(640 - ch + 6)}" width="84" height="110" rx="20" fill="#fff" class="ink" stroke-width="5"/>`;
      const sa = ramp(t, tSa, tSa + 0.4);
      if (sa > 0)
        for (let i = 0; i < 6; i++) {
          const u = (t * 0.8 + i / 6) % 1;
          g += `<path d="M${1000 + i * 110} ${f2(460 + u * 80)} q-10 16 0 24 q10 -8 0 -24 Z" fill="${C.air}" class="ink" stroke-width="2.5" opacity="${f2(sa * (1 - u))}"/>`;
        }
      s += `<g opacity="${f2(1 - oe)}">${g}</g>`;
    }
    if (oe > 0) {
      // l'œsophage : un anneau de muscles se resserre derrière la bouchée et la pousse
      const up = ramp(t, tUp, tUp + 0.5) * (1 - ramp(t, tNo, tNo + 0.5)),
        u = ((t - tAv) * 0.22) % 1,
        by = lerp(350, 720, u);
      let g = `<path d="M1200 330 V740" stroke="${C.ink}" stroke-width="150" stroke-linecap="round"/><path d="M1200 330 V740" stroke="#F08A9B" stroke-width="134" stroke-linecap="round"/>`;
      g += `<ellipse cx="1200" cy="${f2(by)}" rx="52" ry="60" fill="${C.hot}" class="ink" stroke-width="5"/>`;
      g +=
        `<path d="M1125 ${f2(by - 86)} q40 30 0 60 M1275 ${f2(by - 86)} q-40 30 0 60" fill="none" stroke="#C2334A" stroke-width="16" stroke-linecap="round"/>` +
        arrowSVG(1340, by - 70, 1340, by + 10, C.fire, 14, 0.9);
      const de = ramp(t, tDe, tDe + 0.4) * (1 - up);
      if (de > 0)
        g += `<g opacity="${f2(de)}" transform="translate(1560 520) rotate(20)"><path d="M-60 -160 H60 L40 120 H-40 Z" fill="#8FD3FF" class="ink" stroke-width="6"/><rect x="-26" y="120" width="52" height="40" fill="#fff" class="ink" stroke-width="5"/><path d="M0 164 q${f2(10 * Math.sin(t * 6))} 40 0 ${f2(60 + 20 * Math.sin(t * 3))}" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round"/><path d="M-70 -60 q20 -20 0 -50 M70 -60 q-20 -20 0 -50" fill="none" stroke="${C.fire}" stroke-width="9" stroke-linecap="round"/></g>`;
      s += `<g opacity="${f2(oe)}" transform="rotate(${f2(180 * up)} 1200 530)">${g}</g>`;
    }
    $("#s1-draw").innerHTML = s;
  });
  show("#s1-n1", tD + 0.4);
  tl.to("#s1-n1", { opacity: 0, duration: 0.3 }, tAv);
  show("#s1-n2", tDe + 0.4);
})();
