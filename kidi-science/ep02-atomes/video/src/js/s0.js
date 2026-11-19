// ---------- Scène 0 : on coupe la tartine en deux, encore et encore… jusqu'aux atomes ----------
(() => {
  const S = scn("s0");
  const cuts = [
    cue("s0-1", "deux") - 0.15,
    cue("s0-1", "deux", 1) - 0.15,
    cue("s0-1", "encore", 1) + 0.25,
    cue("s0-3", "miette") - 0.15,
    cue("s0-3", "miette", 1) - 0.15,
    cue("s0-3", "miette", 2) - 0.15,
  ];
  const tAtom = cue("s0-4", "atomes") - 0.7;
  const CX = 960,
    CY = 540,
    W = 560,
    H = 380;
  const BREAD = "#EBC07E",
    CRUST = "#B9772E",
    JAM = "#E0455E";
  // un morceau de tartine : mie, croûte, confiture, et des alvéoles de plus en plus grosses à chaque zoom
  const piece = (x, y, w, h, n, op = 1) => {
    let s = `<g opacity="${f2(op)}"><rect x="${f2(x - w / 2)}" y="${f2(y - h / 2)}" width="${f2(w)}" height="${f2(h)}" rx="${f2(Math.max(8, 46 - n * 7))}" fill="${BREAD}" stroke="${CRUST}" stroke-width="12"/>`;
    s += `<rect x="${f2(x - w / 2 + 16)}" y="${f2(y - h / 2 + 16)}" width="${f2(w - 32)}" height="${f2(h * 0.36)}" rx="${f2(Math.max(6, 30 - n * 5))}" fill="${JAM}"/>`;
    const k = Math.max(4, 16 - n * 2),
      r = 7 * Math.pow(1.45, n);
    for (let i = 0; i < k; i++) {
      const px = x - w / 2 + 40 + rnd(i + n * 31) * (w - 80),
        py = y - h / 2 + h * 0.46 + rnd(i * 7 + n * 13 + 3) * (h * 0.44);
      s += `<circle cx="${f2(px)}" cy="${f2(py)}" r="${f2(Math.min(r, 46))}" fill="${CRUST}" opacity="0.3"/>`;
    }
    return (
      s +
      `<rect x="${f2(x - w / 2)}" y="${f2(y - h / 2)}" width="${f2(w)}" height="${f2(h)}" rx="${f2(Math.max(8, 46 - n * 7))}" fill="none" stroke="${C.ink}" stroke-width="4"/></g>`
    );
  };
  const COLS = ["#3A4256", "#E0455E", "#FFFFFF", "#5F86F0", "#FFD23F"];
  const zoomEl = document.getElementById("s0-zoom");
  onDraw("s0", (t) => {
    let n = 0;
    for (const c of cuts) if (t >= c + 1.0) n++;
    const k = cuts.findIndex((c) => t >= c && t < c + 1.0);
    let s = "";
    const out = ramp(t, tAtom, tAtom + 0.6);
    if (out < 1) {
      const sc = 1 + out * 5,
        op = 1 - out;
      if (k < 0)
        s += `<g transform="translate(${CX} ${CY}) scale(${f2(sc)}) translate(${-CX} ${-CY})">${piece(CX, CY, W, H, n, op)}</g>`;
      else {
        const u = t - cuts[k];
        const slide = rampO(u, 0.28, 0.6),
          grow = ramp(u, 0.58, 1.0);
        // moitié gauche : elle reste, puis « grossit » pour reprendre toute la place
        const lw = lerp(W / 2, W, grow),
          lx = lerp(CX - W / 4, CX, grow);
        s += piece(lx, CY, lw, H, n + (grow > 0.5 ? 1 : 0));
        // moitié droite : elle s'en va
        if (slide < 1)
          s += piece(CX + W / 4 + 14 + slide * 420, CY + slide * 60, W / 2, H, n, 1 - slide);
        // le couteau
        const kn = rampO(u, 0, 0.26),
          ky = lerp(CY - H / 2 - 220, CY + H / 2 + 30, kn);
        if (u < 0.5)
          s += `<g opacity="${f2(1 - lin(u, 0.3, 0.5))}"><path d="M${CX} ${f2(ky - 250)} L${CX + 34} ${f2(ky - 250)} L${CX + 34} ${f2(ky - 40)} L${CX} ${f2(ky)} Z" fill="#E3E8F0" class="ink"/><rect x="${CX - 6}" y="${f2(ky - 390)}" width="46" height="140" rx="14" fill="${C.blue}" class="ink"/></g>`;
      }
    }
    if (out > 0) {
      // les atomes : des boules serrées qui frémissent
      let g = "";
      for (let j = 0; j < 4; j++)
        for (let i = 0; i < 9; i++) {
          const id = j * 9 + i,
            x = 300 + i * 165 + (j % 2) * 82,
            y = 330 + j * 142;
          g += ball(
            x + 4 * Math.sin(t * 5 + id),
            y + 4 * Math.cos(t * 4.3 + id * 1.7),
            66,
            COLS[(i + j * 2) % 5],
          );
        }
      s += `<g opacity="${f2(out)}" transform="translate(${CX} ${CY}) scale(${f2(lerp(0.6, 1, out))}) translate(${-CX} ${-CY})">${g}</g>`;
    }
    $("#s0-draw").innerHTML = s;
    const pw = n + (k >= 0 && t - cuts[k] > 0.6 ? 1 : 0);
    zoomEl.textContent = out > 0.5 ? "Grossi × 1 milliard" : `Grossi ×${Math.pow(2, pw)}`;
  });
  show("#s0-logo", S.start + 0.5, { y: -20 });
  show("#s0-zoom", cuts[0] + 0.6);
  pop("#s0-name", tAtom + 0.6);
})();
