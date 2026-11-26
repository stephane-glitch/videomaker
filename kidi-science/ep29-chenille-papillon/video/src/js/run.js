// Une seule fonction dessine chaque image : décor (caméra multiplane), celluloïds, puis « prise de vue ».
{
  const celg = document.getElementById("celg"),
    stage = document.getElementById("stage"),
    grain = document.getElementById("grain"),
    dip = document.getElementById("dip"),
    boilT = document.getElementById("boilT");
  const place = (S, cam, op) => {
    S.el.style.visibility = "visible";
    S.el.style.opacity = op;
    for (const [img, k] of S.imgs)
      img.style.transform = `translate(${f1(cam[0] * k)}px,${f1(cam[1] * k)}px) scale(${(1 + (cam[2] - 1) * (0.55 + 0.45 * k)).toFixed(4)})`;
  };
  const draw = (time) => {
    const st = Math.floor(time * FPS + 1e-4),
      t = time;
    let sc = SC[SC.length - 1];
    for (const s of SC)
      if (time < s.b) {
        sc = s;
        break;
      }
    const cam = sc.cam(time);
    for (const n in SETS)
      if (SETS[n] !== SETS[sc.set] && (!sc.set2 || SETS[n] !== SETS[sc.set2]))
        SETS[n].el.style.visibility = "hidden";
    place(SETS[sc.set], cam, 1);
    if (sc.set2) place(SETS[sc.set2], cam, clamp(sc.mix(time)).toFixed(3));
    MID = 0;
    const inner = sc.draw(t, st, time - sc.a);
    celg.innerHTML =
      `<g transform="translate(${f1(960 + cam[0])} ${f1(540 + cam[1])}) scale(${cam[2].toFixed(4)}) translate(-960 -540)">${inner}</g>` +
      (sc.over ? sc.over(t, st) : "");
    // le trait d'encre est « redessiné » à chaque pose
    boilT.setAttribute("seed", String(1 + (Math.floor(st / 2) % 5)));
    // fondu par le papier entre deux scènes
    const d = Math.min(
      lin(time, sc.a, sc.a + 0.3),
      sc === SC[SC.length - 1] ? 1 : lin(sc.b - time, 0, 0.3),
    );
    dip.style.opacity = (
      sc === SC[0]
        ? Math.min(1, lin(sc.b - time, 0, 0.3)) < 1
          ? 1 - lin(sc.b - time, 0, 0.3)
          : 0
        : 1 - d
    ).toFixed(3);
    // tremblement de la caméra banc-titre et grain de pellicule
    stage.style.transform = `translate(${f1((rnd(st * 1.7) - 0.5) * 2.4)}px,${f1((rnd(st * 2.3 + 4) - 0.5) * 2.4)}px)`;
    grain.style.transform = `translate(${f1((rnd(st * 1.3) - 0.5) * 100)}px,${f1((rnd(st * 2.1 + 5) - 0.5) * 100)}px)`;
    grain.style.opacity = (0.14 + rnd(st * 3.1) * 0.05).toFixed(3);
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
