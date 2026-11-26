// ---------- Scène 3 : la vidéo est découpée en petits paquets, qui prennent chacun leur chemin et sont remis dans l'ordre ----------
(() => {
  const tDe = cue("s3-1", "découpée") - 0.5,
    tAd = cue("s3-1", "adresse") - 0.6,
    tCh = cue("s3-1", "chemin") - 0.8,
    tAr = cue("s3-2", "arrivée") - 0.4,
    tOr = cue("s3-3", "ordre") - 1.0;
  const COL = ["#FFD23F", "#FF9A3D", "#5BE39A", "#8FD3FF", "#C9A6FF", "#FF8FA3"],
    N = 12;
  const src = (i, gap) => [
      360 + ((i % 4) - 1.5) * (70 + gap),
      520 + (Math.floor(i / 4) - 1) * (70 + gap),
    ],
    dst = (i) => [1560 + ((i % 4) - 1.5) * 70, 520 + (Math.floor(i / 4) - 1) * 70];
  onDraw("s3", (t) => {
    const de = ramp(t, tDe, tDe + 0.6);
    let s =
      panelSVG() +
      `<rect x="${f2(212 - 14 * de)}" y="${f2(407 - 14 * de)}" width="${f2(296 + 28 * de)}" height="${f2(226 + 28 * de)}" rx="16" fill="none" class="ink" stroke-width="4" stroke-dasharray="${de > 0 ? "10 10" : "0"}" opacity="0.5"/>` +
      phoneSVG(1560, 520, 2.3) +
      txt(360, 300, "la vidéo", 46, { w: 700, fill: C.ink }) +
      txt(1560, 810, "ton téléphone", 40, { w: 700, fill: C.ink });
    for (let i = 0; i < N; i++) {
      const t0 = tCh + i * 0.12 + 0.4 * rnd(i),
        tr = clamp(lin(t, t0, t0 + 1.4, 0, 1), 0, 1),
        [sx, sy] = src(i, 14 * de),
        mess = 1 - ramp(t, tOr, tOr + 0.8);
      // à l'arrivée : d'abord en désordre, puis rangés
      const [ox, oy] = dst(i),
        [mx, my] = dst((i * 5 + 3) % N),
        ex = lerp(ox, mx, mess),
        ey = lerp(oy, my, mess);
      const midY = 300 + 440 * rnd(i + 20),
        P = [
          [sx, sy],
          [700, midY],
          [1150, 300 + 440 * rnd(i + 40)],
          [ex, ey],
        ],
        [x, y] = tr <= 0 ? [sx, sy] : tr >= 1 ? [ex, ey] : along(P, tr);
      s += packetSVG(
        x,
        y,
        tr >= 1 ? 1.2 : 1.25 - 0.25 * Math.sin(tr * Math.PI),
        COL[i % 6],
        t > tAd + i * 0.05 ? String(i + 1) : "",
      );
    }
    if (de < 1)
      s += `<g opacity="${f2(1 - de)}"><rect x="212" y="407" width="296" height="226" rx="16" fill="#E0455E" class="ink" stroke-width="5"/><path d="M330 470 L420 520 L330 570 Z" fill="#fff"/></g>`;
    if (t > tAr && t < tOr)
      s += txt(1560, 244, "en désordre…", 44, {
        w: 700,
        fill: "#B02A45",
        op: ramp(t, tAr, tAr + 0.3),
      });
    if (t > tOr + 0.8)
      s += txt(1560, 244, "dans l’ordre !", 44, {
        w: 700,
        fill: "#1F7A50",
        op: ramp(t, tOr + 0.8, tOr + 1.1),
      });
    $("#s3-draw").innerHTML = s;
  });
  show("#s3-n1", tAd + 0.4);
  pop("#s3-n2", tOr + 0.9);
})();
