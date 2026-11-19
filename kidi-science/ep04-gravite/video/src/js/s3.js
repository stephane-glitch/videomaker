// ---------- Scène 3 : le marteau et la plume, sur la Terre (avec air) puis sur la Lune (sans air) ----------
(() => {
  const S = scn("s3");
  const tDrop = cue("s3-1", "lâche") - 0.2,
    tMoon = cue("s3-3", "sans") - 0.6,
    tMoonDrop = cue("s3-5", "marteau") - 1.0;
  const H = 400,
    GE = 1400,
    GM = GE / 6; // la gravité de la Lune est six fois plus faible
  const hammer = (x, y, rot = 0) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${rot})"><rect x="-10" y="-70" width="20" height="120" rx="8" fill="#D9A66B" class="ink"/><rect x="-46" y="-96" width="92" height="44" rx="10" fill="${C.metal}" class="ink"/></g>`;
  const feather = (x, y, rot = 0, light = false) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})"><path d="M0 60 C -44 20, -40 -50, 0 -90 C 40 -50, 44 20, 0 60 Z" fill="${light ? "#fff" : "#fff"}" class="ink"/><path d="M0 76 V-70 M0 20 L-22 0 M0 20 L22 0 M0 -16 L-22 -36 M0 -16 L22 -36" class="ink" stroke-width="3"/></g>`;
  // un cycle de chute qui se répète : [instant dans le cycle] → hauteur tombée
  const fallE = (u) => Math.min(H, 0.5 * GE * u * u),
    fallF = (u) => Math.min(H, 105 * u),
    fallM = (u) => Math.min(H, 0.5 * GM * u * u);
  onDraw("s3", (t) => {
    const y0 = 130,
      gy = 560;
    // --- Terre ---
    const u = t < tDrop ? 0 : (t - tDrop) % 5.6;
    let a = `<rect x="0" y="${gy}" width="760" height="80" fill="#6CC98A"/><path d="M0 ${gy} H760" class="ink" stroke-width="5"/>`;
    a +=
      hammer(250, y0 + fallE(u)) +
      feather(
        510 + 34 * Math.sin(u * 3.2) * (fallF(u) < H ? 1 : 0),
        y0 + 20 + fallF(u) * 0.99,
        18 * Math.sin(u * 3.2) * (fallF(u) < H ? 1 : 0),
      );
    $("#s3-s1").innerHTML = a;
    // --- Lune ---
    const um = t < tMoonDrop ? 0 : (t - tMoonDrop) % 4.6;
    let b = "";
    for (let i = 0; i < 26; i++)
      b += `<circle cx="${f2(rnd(i) * 760)}" cy="${f2(rnd(i + 60) * 470)}" r="${1.5 + rnd(i + 9) * 2.5}" fill="#fff" opacity="0.8"/>`;
    b +=
      earthSVG(610, 110, 52) +
      `<rect x="0" y="${gy}" width="760" height="80" fill="#C9D1DE"/><ellipse cx="150" cy="${gy + 40}" rx="70" ry="16" fill="#9AA6B8"/><ellipse cx="560" cy="${gy + 50}" rx="90" ry="18" fill="#9AA6B8"/><path d="M0 ${gy} H760" stroke="#EEF2F8" stroke-width="5"/>`;
    b += hammer(250, y0 + fallM(um)) + feather(510, y0 + 20 + fallM(um), 0);
    $("#s3-s2").innerHTML = b;
  });
  show("#s3-t1", S.start + 0.6, { y: -20 });
  tl.fromTo(
    "#s3-p1",
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: 0.5, ease: OUT },
    S.start + 0.5,
  );
  show("#s3-n1", cue("s3-2", "air") - 0.3);
  show("#s3-t2", tMoon, { y: -20 });
  tl.fromTo(
    "#s3-p2",
    { opacity: 0, x: 120 },
    { opacity: 1, x: 0, duration: 0.5, ease: OUT },
    tMoon,
  );
  show("#s3-n2", cue("s3-5", "exactement") - 0.4);
})();
