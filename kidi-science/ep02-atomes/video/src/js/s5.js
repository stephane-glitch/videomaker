// ---------- Scène 5 : la même molécule d'eau, rangée (glace), en vrac (eau), ou éparpillée (vapeur) ----------
(() => {
  // une molécule d'eau : un O et deux H, tournée d'un angle a
  const mol = (x, y, a) => {
    const h = (sg) => [x + 30 * Math.cos(a + sg * 0.91), y + 30 * Math.sin(a + sg * 0.91)];
    const [h1x, h1y] = h(-1),
      [h2x, h2y] = h(1);
    return `<circle cx="${f2(h1x)}" cy="${f2(h1y)}" r="13" fill="#fff" stroke="${C.ink}" stroke-width="3"/><circle cx="${f2(h2x)}" cy="${f2(h2y)}" r="13" fill="#fff" stroke="${C.ink}" stroke-width="3"/><circle cx="${f2(x)}" cy="${f2(y)}" r="23" fill="#E0455E" stroke="${C.ink}" stroke-width="3"/>`;
  };
  onDraw("s5", (t) => {
    let a = "",
      b = "",
      c = "";
    for (let j = 0; j < 4; j++)
      for (let i = 0; i < 4; i++) {
        const id = j * 4 + i,
          bx = 85 + i * 110 + (j % 2) * 20,
          by = 90 + j * 115;
        // glace : chacune à sa place, elle frémit à peine
        a += mol(
          bx + 2.5 * Math.sin(t * 9 + id),
          by + 2.5 * Math.cos(t * 8 + id * 2),
          (j % 2 ? 1 : -1) * 1.2 + 0.05 * Math.sin(t * 7 + id),
        );
        // eau : elles glissent les unes sur les autres
        b += mol(
          bx + 34 * Math.sin(t * 0.9 + id * 1.3) + 16 * Math.sin(t * 1.7 + id),
          by + 30 * Math.cos(t * 0.8 + id * 2.1) + 14 * Math.sin(t * 1.3 + id * 0.7),
          t * 0.8 + id,
        );
      }
    // vapeur : peu nombreuses, rapides, elles rebondissent partout
    for (let i = 0; i < 6; i++) {
      const x = 50 + tri(rnd(i) + t * (0.35 + rnd(i + 9) * 0.3)) * 400,
        y = 50 + tri(rnd(i + 20) + t * (0.3 + rnd(i + 33) * 0.35)) * 420;
      c += mol(x, y, t * (3 + i) + i);
    }
    $("#s5-s1").innerHTML = a;
    $("#s5-s2").innerHTML = b;
    $("#s5-s3").innerHTML = c;
  });
  [
    ["glace", 1],
    ["eau", 2],
    ["vapeur", 3],
  ].forEach(([w, i]) => {
    const t = cue("s5-1", w) - 0.3;
    show(`#s5-t${i}`, t, { y: -20 });
    tl.fromTo(
      `#s5-p${i}`,
      { opacity: 0, y: 60, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: OUT },
      t,
    );
  });
  [
    ["glace", 1],
    ["eau", 2],
    ["vapeur", 3],
  ].forEach(([w, i]) =>
    tl.to(
      `#s5-p${i}`,
      { keyframes: { scale: [1, 1.05, 1] }, duration: 0.5, ease: "power2.out" },
      cue("s5-2", w) - 0.2,
    ),
  );
  show("#s5-c1", cue("s5-3", "Rangées") - 0.2);
  show("#s5-c2", cue("s5-3", "vrac") - 0.2);
  show("#s5-c3", cue("s5-3", "récré") - 0.3);
})();
