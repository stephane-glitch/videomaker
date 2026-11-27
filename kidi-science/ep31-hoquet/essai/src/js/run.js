// Dessin pose par pose : on place chaque papier et son ombre selon le temps du film.
{
  const SHOTS = [
    { set: "A", b: T("g") },
    { set: "G", b: T("b") },
    { set: "B", b: Infinity },
  ];
  const WHIP = 0.16;
  const sets = document.getElementById("sets"),
    grain = document.getElementById("grain"),
    lamp = document.getElementById("lamp");
  const POP = [1, 0.42, -0.08, 0];
  const placePiece = (p, S, t, st) => {
    let x = 0,
      y = 0,
      r = p.rot,
      sx = 1,
      sy = 1,
      o = true,
      l = p.lift;
    if (p.tin != null) {
      const k = Math.floor((t - p.tin) * 15 + 1e-4);
      if (k < 0) o = false;
      else {
        const f = POP[k] ?? 0;
        x += p.from[0] * f;
        y += p.from[1] * f;
        r += p.from[2] * f;
        l += 36 * Math.max(0, f);
      }
    }
    if (o && p.tout != null && t >= p.tout) o = false;
    if (o && p.show && !p.show(t, st)) o = false;
    if (o && p.anim) {
      const a = p.anim(t, st);
      if (a) {
        x += a.x || 0;
        y += a.y || 0;
        r += a.r || 0;
        sx *= (a.s ?? 1) * (a.sx ?? 1);
        sy *= (a.s ?? 1) * (a.sy ?? 1);
        l += a.lift || 0;
        if (a.o === 0) o = false;
      }
    }
    if (!o) {
      if (p.last !== "h") p.el.style.visibility = "hidden";
      p.last = "h";
      return;
    }
    const j = S.jump ? S.jump(t) * p.jmp : 0;
    if (j) {
      y -= j * 26 * (0.6 + 0.8 * rnd(p.seed));
      l += j * 30;
      r += j * 7 * (rnd(p.seed + 3) - 0.5) * 2;
    }
    const b = Math.floor(st / 2);
    x += (rnd(p.seed + b * 3.1) - 0.5) * 2 * p.boil;
    y += (rnd(p.seed + b * 5.3 + 1) - 0.5) * 2 * p.boil;
    r += (rnd(p.seed + b * 7.7 + 2) - 0.5) * 2 * p.rb;
    const up = 1 + (l - p.lift) * 0.0016;
    const tr = `translate(${f1(x)}px,${f1(y)}px) rotate(${r.toFixed(2)}deg) scale(${(sx * up).toFixed(3)},${(sy * up).toFixed(3)})`;
    if (p.last === "h" || p.last === "") p.el.style.visibility = "inherit";
    if (p.last !== tr) p.el.style.transform = tr;
    p.last = tr;
    if (p.sh) {
      const st2 = `translate(${f1(LIGHT[0] * l * 0.8)}px,${f1(LIGHT[1] * l * 0.8)}px)`,
        op = clamp(0.6 - (l - 6) * 0.011, 0.2, 0.6).toFixed(2),
        bl = l > 14 ? `blur(${((l - 14) * 0.09).toFixed(1)}px)` : "none";
      if (p.shT !== st2) p.sh.style.transform = p.shT = st2;
      if (p.shO !== op) p.sh.style.opacity = p.shO = op;
      if (p.shB !== bl) p.sh.style.filter = p.shB = bl;
    }
  };
  const placeSet = (S, t, st, dx) => {
    S.root.style.visibility = "visible";
    S.root.style.transform = `translateX(${f1(dx)}px)`;
    const c = S.cam(t),
      [kx, ky] = S.shake ? S.shake(t, st) : [0, 0];
    for (const n in S.layers) {
      const { el, k } = S.layers[n],
        z = 1 + (c.z - 1) * k,
        fx = 960 + (c.x - 960) * k,
        fy = 540 + (c.y - 540) * k;
      el.style.transform = `translate(${f1(960 - z * fx + kx * k)}px,${f1(540 - z * fy + ky * k)}px) scale(${z.toFixed(4)})`;
    }
    for (const p of S.pieces) placePiece(p, S, t, st);
  };
  const draw = (time) => {
    const i = SHOTS.findIndex((s) => time < s.b);
    const S = SETS[SHOTS[i].set];
    const ones =
      (S.ones && S.ones(time)) ||
      (i > 0 && time < SHOTS[i - 1].b + WHIP) ||
      time > SHOTS[i].b - WHIP;
    const st = ones ? Math.floor(time * 30 + 1e-4) / 2 : Math.floor(time * 15 + 1e-4);
    const t = ones ? Math.floor(time * 30 + 1e-4) / 30 : st / 15;
    const sti = Math.floor(st);
    for (const n in SETS) SETS[n].root.style.visibility = "hidden";
    // passage d'un décor à l'autre : panoramique filé
    let blur = 0;
    if (i + 1 < SHOTS.length && t > SHOTS[i].b - WHIP) {
      const u = E(t, SHOTS[i].b - WHIP, SHOTS[i].b + WHIP);
      placeSet(S, t, sti, -1920 * u);
      placeSet(SETS[SHOTS[i + 1].set], t, sti, 1920 * (1 - u));
      blur = 10 * Math.sin(Math.PI * u);
    } else if (i > 0 && t < SHOTS[i - 1].b + WHIP) {
      const u = E(t, SHOTS[i - 1].b - WHIP, SHOTS[i - 1].b + WHIP);
      placeSet(SETS[SHOTS[i - 1].set], t, sti, -1920 * u);
      placeSet(S, t, sti, 1920 * (1 - u));
      blur = 10 * Math.sin(Math.PI * u);
    } else placeSet(S, t, sti, 0);
    sets.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : "none";
    for (const p of FIXED.pieces) placePiece(p, FIXED, t, sti);
    // la caméra banc-titre : léger flottement, lampe qui vacille, grain
    const b = Math.floor(sti / 2);
    sets.style.transform = `translate(${f1((rnd(b * 1.7) - 0.5) * 2.2)}px,${f1((rnd(b * 2.3 + 4) - 0.5) * 2.2)}px)`;
    grain.style.transform = `translate(${f1((rnd(sti * 1.3) - 0.5) * 100)}px,${f1((rnd(sti * 2.1 + 5) - 0.5) * 100)}px)`;
    lamp.style.opacity = (0.92 + rnd(b * 1.9) * 0.08).toFixed(3);
  };
  const tl = gsap.timeline({ paused: true });
  const tick = { v: 0 };
  tl.fromTo(
    tick,
    { v: 0 },
    { v: 1, duration: SCHED.total, ease: "none", onUpdate: () => draw(tl.time()) },
    0,
  );
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
  tl.seek(0);
  draw(0);
}
