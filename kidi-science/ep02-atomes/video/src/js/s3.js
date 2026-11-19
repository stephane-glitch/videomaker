// ---------- Scène 3 : une centaine de sortes d'atomes, comme un jeu de construction ----------
(() => {
  const S = scn("s3");
  const EL = [
    ["H", "Hydrogène"],
    ["He", ""],
    ["Li", ""],
    ["C", "Carbone"],
    ["N", ""],
    ["O", "Oxygène"],
    ["F", ""],
    ["Ne", ""],
    ["Na", ""],
    ["Mg", ""],
    ["Al", ""],
    ["Si", ""],
    ["P", ""],
    ["S", ""],
    ["Cl", ""],
    ["K", ""],
    ["Ca", ""],
    ["Ti", ""],
    ["Fe", "Fer"],
    ["Ni", ""],
    ["Cu", ""],
    ["Zn", ""],
    ["Ag", ""],
    ["Sn", ""],
    ["Au", "Or"],
    ["Hg", ""],
    ["Pb", ""],
    ["U", ""],
  ];
  const grid = document.getElementById("s3-grid");
  grid.innerHTML = EL.map(
    ([s, n], i) => `<div class="el" id="s3-e${i}"><b>${s}</b><span>${n}</span></div>`,
  ).join("");
  tl.fromTo(
    "#s3-grid .el",
    { opacity: 0, scale: 0.4 },
    { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)", stagger: 0.035 },
    S.start + 0.5,
  );
  const hi = (i, t, col) => {
    tl.to(
      `#s3-e${i}`,
      { backgroundColor: col, scale: 1.14, duration: 0.3, ease: "back.out(1.7)" },
      t,
    );
    tl.fromTo(`#s3-e${i} span`, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t);
  };
  gsap.set("#s3-grid .el span", { opacity: 0 });
  hi(0, cue("s3-2", "Hydrogène") - 0.2, "#DDF1FF");
  hi(5, cue("s3-2", "oxygène") - 0.2, "#FFD5DC");
  hi(3, cue("s3-2", "carbone") - 0.2, "#DDE1EA");
  hi(18, cue("s3-2", "fer") - 0.2, "#E6ECF4");
  hi(24, cue("s3-2", "or") - 0.2, "#FFE9A0");
  show("#s3-n1", cue("s3-2", "cent") - 0.3);
  // « C'est comme un jeu de construction » : le tableau se range à gauche, des briques s'empilent
  const tB = cue("s3-3", "jeu") - 0.5;
  tl.to("#s3-grid", { scale: 0.56, x: -300, y: 110, duration: 0.6, ease: "power3.inOut" }, tB);
  tl.to("#s3-n1", { opacity: 0, duration: 0.3 }, tB);
  const cols = ["#E0455E", "#5F86F0", "#FFD23F", "#3DBE8B", "#FF8A1F"];
  // une petite fusée en briques : [colonne, rangée (depuis le bas), largeur]
  const B = [
    [1, 0, 1],
    [2, 0, 2],
    [4, 0, 1],
    [2, 1, 2],
    [2, 2, 2],
    [2, 3, 2],
    [2, 4, 2],
    [2.5, 5, 1],
    [0.5, 1, 1.5],
    [4, 1, 1.5],
  ];
  document.getElementById("s3-bricks").innerHTML = B.map(
    ([c, r, w], i) =>
      `<div class="brick" id="s3-b${i}" style="left:${c * 100}px; top:${500 - r * 76}px; width:${w * 100 - 8}px; background:${cols[i % 5]}"></div>`,
  ).join("");
  tl.fromTo(
    "#s3-bricks .brick",
    { opacity: 0, y: -420 },
    { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.3)", stagger: 0.16 },
    tB + 0.5,
  );
  show("#s3-n2", cue("s3-3", "briques") - 0.3);
})();
