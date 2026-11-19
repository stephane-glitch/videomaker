// ---------- Générique : la boîte à questions ----------
(() => {
  const T0 = scn("g").start;
  const tOpen = lineEnd("g-1") + 0.25; // la boîte s'ouvre juste après la question de Zoé
  document.getElementById("gi-gear-g").innerHTML = gearSVG(75, 75, 52, 9, 0.2);
  // grain de pollen : boule à picots
  let pol = "";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    pol += `<path d="M${f2(75 + 40 * Math.cos(a))} ${f2(75 + 40 * Math.sin(a))} L${f2(75 + 62 * Math.cos(a))} ${f2(75 + 62 * Math.sin(a))}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`;
  }
  document.getElementById("gi-pollen-g").innerHTML =
    pol +
    `<circle cx="75" cy="75" r="42" fill="${C.hot}" class="ink" stroke-width="5"/><circle cx="62" cy="64" r="8" fill="#fff" opacity="0.8"/>`;

  // La boîte s'agite pendant la question, puis le couvercle saute.
  tl.fromTo(
    "#g-box",
    { opacity: 0, y: 120 },
    { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.4)" },
    T0 + 0.1,
  );
  tl.to(
    "#g-box",
    {
      keyframes: { rotation: [0, -4, 4, -3, 3, 0] },
      duration: 0.9,
      ease: "none",
      transformOrigin: "50% 100%",
    },
    cue("g-1", "comment") - 0.1,
  );
  tl.to(
    "#g-box",
    {
      keyframes: { scaleY: [1, 0.86, 1.06, 1], scaleX: [1, 1.08, 0.97, 1] },
      duration: 0.4,
      ease: "none",
      transformOrigin: "50% 100%",
    },
    tOpen - 0.3,
  );
  tl.to(
    "#g-lid",
    {
      y: -260,
      x: 240,
      rotation: 70,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      transformOrigin: "100% 100%",
    },
    tOpen,
  );

  // Les objets jaillissent en gerbe (départ : centre de la boîte), le sujet de l'épisode en dernier.
  const from = { x: 885, y: 560 };
  const items = [
    ["#gi-gear", 330, 250, -200],
    ["#gi-atom", 610, 130, 160],
    ["#gi-drop", 1160, 130, -120],
    ["#gi-apple", 1440, 250, 220],
    ["#gi-pollen", 250, 560, 140],
    ["#gi-car", 1520, 560, 0],
  ];
  items.forEach(([sel, x, y, rot], i) => {
    const t = tOpen + 0.08 + i * 0.11;
    gsap.set(sel, { x: from.x, y: from.y, opacity: 0, scale: 0.2 });
    tl.to(sel, { opacity: 1, duration: 0.12 }, t);
    tl.to(sel, { x, duration: 0.75, ease: "power2.out" }, t);
    tl.to(sel, { y, duration: 0.75, ease: "back.out(2.2)" }, t);
    tl.to(sel, { scale: 1, rotation: rot === 0 ? 0 : 360, duration: 0.75, ease: "power2.out" }, t);
  });
  // La boîte se retire, le logo se forme.
  tl.to("#g-box", { y: 420, opacity: 0, duration: 0.45, ease: INN }, tOpen + 0.95);
  tl.fromTo(
    "#g-logo",
    { opacity: 0, scale: 0.5, y: 60 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
    tOpen + 1.15,
  );
  tl.fromTo(
    "#g-tag",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.45, ease: OUT },
    tOpen + 1.6,
  );

  // La petite voiture vient au centre : on plonge dedans pour ouvrir l'épisode.
  const tDive = scn("g").end - 1.25;
  tl.to(
    ["#g-logo", "#g-tag", "#gi-gear", "#gi-atom", "#gi-drop", "#gi-apple", "#gi-pollen"],
    { opacity: 0, scale: 0.8, duration: 0.35, ease: INN },
    tDive,
  );
  tl.to("#gi-car", { x: 885, y: 465, scale: 2.2, duration: 0.6, ease: "power2.inOut" }, tDive);
  tl.to("#gi-car", { scale: 16, opacity: 0, duration: 0.6, ease: "power3.in" }, tDive + 0.62);
  tl.fromTo(
    "#s01-in",
    { scale: 0.72, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.7, ease: "power4.out", transformOrigin: "960px 600px" },
    scn("s01").start,
  );
})();
