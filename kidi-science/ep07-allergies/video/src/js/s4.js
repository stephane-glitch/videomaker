// ---------- Scène 4 : les autres faux ennemis (acariens, poils de chat, cacahuètes, guêpes) ----------
(() => {
  const T = [
    cue("s4-2", "acariens"),
    cue("s4-2", "chat"),
    cue("s4-2", "cacahuètes"),
    cue("s4-2", "guêpe"),
  ].map((x) => x - 0.3);
  const tG = cue("s4-4", "graves") - 0.3;
  const NAMES = ["Les acariens", "Les poils de chat", "Les cacahuètes", "Les piqûres de guêpe"];
  const mite = () => {
    let s = "";
    for (let i = 0; i < 4; i++)
      s += `<path d="M${-50 + i * 14} ${-10 + i * 12} l-50 ${-20 + i * 22} M${50 - i * 14} ${-10 + i * 12} l50 ${-20 + i * 22}" class="ink" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    return (
      s +
      `<ellipse rx="70" ry="54" fill="#D9B48A" class="ink" stroke-width="5"/><circle cx="-20" cy="-22" r="7" fill="${C.ink}"/><circle cx="20" cy="-22" r="7" fill="${C.ink}"/>`
    );
  };
  const peanut = () =>
    `<path d="M-70 0 C -70 -56, -14 -56, 0 -24 C 14 -56, 70 -56, 70 0 C 70 56, 14 56, 0 24 C -14 56, -70 56, -70 0 Z" fill="#E2B56D" class="ink" stroke-width="5" transform="rotate(-24)"/><path d="M-44 -6 l14 14 M-30 -24 l14 14 M24 2 l14 14 M38 -16 l14 14" class="ink" stroke-width="5" stroke-linecap="round" transform="rotate(-24)"/>`;
  const wasp = (t) =>
    `<ellipse cx="-14" cy="-44" rx="40" ry="20" fill="#CFEFFF" class="ink" stroke-width="4" transform="rotate(${f2(-30 + 12 * Math.sin(t * 20))} -14 -30)"/><path d="M70 6 l34 8 l-34 8 Z" fill="${C.ink}"/><ellipse rx="74" ry="40" fill="${C.hot}" class="ink" stroke-width="5"/><path d="M-10 -39 V39 M26 -36 V36" stroke="${C.ink}" stroke-width="16"/><circle cx="-80" cy="-4" r="30" fill="${C.hot}" class="ink" stroke-width="5"/><circle cx="-90" cy="-10" r="7" fill="${C.ink}"/>`;
  onDraw("s4", (t) => {
    const g = ramp(t, tG, tG + 0.5);
    let s = "";
    for (let i = 0; i < 4; i++) {
      const k = ramp(t, T[i], T[i] + 0.4);
      if (k <= 0) continue;
      const x = 150 + i * 420 + 180,
        y = 520,
        hot = i === 2 ? g : 0,
        dim = i === 2 ? 1 : 1 - 0.6 * g;
      const icon = i === 0 ? mite() : i === 1 ? catSVG(0, 80, 0.7) : i === 2 ? peanut() : wasp(t);
      s += `<g transform="translate(${x} ${f2(y + 40 * (1 - k))}) scale(${f2(1 + 0.08 * hot)})" opacity="${f2(k * dim)}"><rect x="-180" y="-190" width="360" height="380" rx="34" fill="#fff" stroke="${hot > 0.5 ? C.fire : C.ink}" stroke-width="${f2(3.5 + 5 * hot)}"/><g transform="translate(0 -40)">${icon}</g>${txt(0, 140, NAMES[i], 34)}`;
      if (hot > 0)
        s += `<g transform="translate(150 -170) scale(${f2(hot)})"><path d="M0 -44 L46 36 H-46 Z" fill="${C.hot}" class="ink" stroke-width="5" stroke-linejoin="round"/>${txt(0, 26, "!", 46, { w: 700 })}</g>`;
      s += `</g>`;
    }
    $("#s4-draw").innerHTML = s;
  });
  pop("#s4-n1", cue("s4-4", "sérieux") - 0.5);
})();
