// Chaque image : formes hachurées (redessinées une image sur trois), ondes, personnages, étiquettes.
{
  const lab = document.getElementById("lab"),
    grain = document.getElementById("grain"),
    dip = document.getElementById("dip");
  const draw = (time) => {
    const im = Math.floor(time * 30 + 1e-4),
      s3 = Math.floor(im / 3),
      tq = s3 / 10;
    let S = SC[SC.length - 1];
    for (const s of SC)
      if (time < s.b) {
        S = s;
        break;
      }
    const c = S.cam(time),
      srcs = S.waves(tq);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = RAMP[4];
    ctx.fillRect(0, 0, 1920, 1080);
    drawForms(S, c, tq, s3, srcs);
    setCam(c, 1);
    S.figs(time, im, tq, s3, srcs, c);
    lab.innerHTML = S.over(time);
    const d = Math.min(
      S.a > 0 ? lin(time, S.a, S.a + 0.25) : 1,
      S === SC[SC.length - 1] ? 1 : lin(S.b - time, 0, 0.25),
    );
    dip.style.opacity = (1 - d).toFixed(3);
    grain.style.transform = `translate(${f1((rnd(s3 * 1.3) - 0.5) * 100)}px,${f1((rnd(s3 * 2.1 + 5) - 0.5) * 100)}px)`;
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
