// Coutures entre scènes (g → s01 et s01 → s2 sont des zooms, gérés dans leurs scènes).
seam("s2", "s3");
seam("s3", "s4");
seam("s4", "s5");
seam("s5", "s6");
seam("s6", "s7");

// Un seul « tic » sur toute la durée : redessine les mécanismes à chaque image.
const tick = { v: 0 };
tl.fromTo(tick, { v: 0 }, { v: 1, duration: SCHED.total, ease: "none", onUpdate: drawAll }, 0);

window.__timelines["main"] = tl;
tl.seek(0);
drawAll();
