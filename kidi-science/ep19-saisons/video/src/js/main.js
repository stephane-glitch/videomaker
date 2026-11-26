// Coutures entre scènes (le générique → première scène est un zoom, géré dans g.js).
{
  const ids = Object.keys(SCHED.scenes);
  for (let i = 2; i < ids.length; i++) seam(ids[i - 1], ids[i]);
}

// Un seul « tic » sur toute la durée : redessine les animations à chaque image.
const tick = { v: 0 };
tl.fromTo(tick, { v: 0 }, { v: 1, duration: SCHED.total, ease: "none", onUpdate: drawAll }, 0);

window.__timelines["main"] = tl;
tl.seek(0);
drawAll();
