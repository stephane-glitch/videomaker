// Dessin pose par pose : une seule fonction place chaque papier selon le temps du film.
{
  const S1 = SCENES.S1,
    S2 = SCENES.S2,
    T5 = scn("s5").start,
    k5 = Math.round(T5 * FPS);
  const grain = document.getElementById("grain"),
    lamp = document.getElementById("lamp");
  const POP = [1, 0.4, -0.08, 0];
  const SLIDE = [1920, 1100, 420, 60, -24, 0];
  const draw = (time) => {
    const step = Math.floor(time * FPS + 1e-4);
    const t = step / FPS;
    const cy = S1.cam(t);
    const in2 = step - k5;
    const on1 = in2 < SLIDE.length - 1,
      on2 = in2 >= 0;
    S1.root.style.visibility = on1 ? "visible" : "hidden";
    S2.root.style.visibility = on2 ? "visible" : "hidden";
    if (on1)
      for (const n in S1.layers)
        S1.layers[n].el.style.transform =
          `translateY(${f1(-(cy < 0 ? cy : cy * S1.layers[n].k))}px)`;
    if (on2) S2.root.style.transform = `translateX(${SLIDE[in2] ?? 0}px)`;
    const b = Math.floor(step / 2);
    for (const p of pieces) {
      let o = p.sc === S1 ? on1 : p.sc === S2 ? on2 : true;
      if (o && p.sc === S1) {
        const c = cy < 0 ? cy : cy * p.k;
        if (p.y1 < c || p.y0 > c + 1080) o = false;
      }
      let x = 0,
        y = 0,
        r = p.rot,
        sx = 1,
        sy = 1;
      if (o && p.tin != null) {
        const k = step - Math.round(p.tin * FPS);
        if (k < 0) o = false;
        else {
          const f = POP[k] ?? 0;
          x += p.from[0] * f;
          y += p.from[1] * f;
          r += p.from[2] * f;
        }
      }
      if (o && p.tout != null && t >= p.tout) o = false;
      if (o && p.alt && Math.floor(step / p.alt[0]) % p.alt[2] !== p.alt[1]) o = false;
      if (o && p.anim) {
        const a = p.anim(t, step);
        if (a) {
          x += a.x || 0;
          y += a.y || 0;
          r += a.r || 0;
          sx *= (a.s ?? 1) * (a.sx ?? 1);
          sy *= (a.s ?? 1) * (a.sy ?? 1);
          if (a.o === 0) o = false;
        }
      }
      if (!o) {
        if (p.vis !== 0) p.el.style.visibility = "hidden";
        p.vis = 0;
        continue;
      }
      if (p.press && t >= p.press.t0 && Math.floor(step / p.press.per) % 2) {
        x += p.press.d[0];
        y += p.press.d[1];
      }
      x += (rnd(p.seed + b * 3.1) - 0.5) * 2 * p.boil;
      y += (rnd(p.seed + b * 5.3 + 1) - 0.5) * 2 * p.boil;
      r += (rnd(p.seed + b * 7.7 + 2) - 0.5) * 2 * p.rb;
      if (p.vis !== 1) p.el.style.visibility = "inherit";
      p.vis = 1;
      p.el.style.transform = `translate(${f1(x)}px,${f1(y)}px) rotate(${r.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
    }
    grain.style.transform = `translate(${f1((rnd(step * 1.3) - 0.5) * 100)}px,${f1((rnd(step * 2.1 + 5) - 0.5) * 100)}px)`;
    lamp.style.opacity = (0.93 + rnd(b * 1.9) * 0.07).toFixed(3);
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
