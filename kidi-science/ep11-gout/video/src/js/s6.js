// ---------- Scène 6 : le résumé, puis la peau : le chaud et le froid, annonce du toucher ----------
(() => {
  const S = scn("s6");
  const tSp = cue("s6-3", "capteurs") - 0.8;
  onDraw("s6", (t) => {
    if (t < tSp - 0.3) return;
    // une main entre une tasse chaude et un glaçon
    let s = `<path d="M560 800 V520 Q560 480 590 480 Q620 480 620 520 V380 Q620 350 650 350 Q680 350 680 380 V340 Q680 310 710 310 Q740 310 740 340 V380 Q740 350 770 350 Q800 350 800 380 V560 L850 500 Q880 470 900 500 Q910 520 890 560 L800 720 V800 Z" fill="#FFD9B8" class="ink" stroke-width="6"/>`;
    s +=
      `<path d="M230 560 H430 V700 Q430 760 370 760 H290 Q230 760 230 700 Z" fill="#fff" class="ink" stroke-width="6"/><path d="M430 600 Q500 600 500 650 Q500 700 430 700" fill="none" class="ink" stroke-width="14"/>` +
      [0, 1, 2]
        .map(
          (i) =>
            `<path d="M${270 + i * 60} ${f2(530 - ((t * 40 + i * 24) % 70))} q14 -14 0 -28 q-14 -14 0 -28" fill="none" stroke="${C.fire}" stroke-width="8" stroke-linecap="round"/>`,
        )
        .join("");
    s += `<g transform="translate(1060 ${f2(680 + 6 * Math.sin(t * 2))}) rotate(8)"><rect x="-70" y="-70" width="140" height="140" rx="18" fill="#CFEFFF" class="ink" stroke-width="6"/><path d="M-40 -40 L-10 -10 M10 -44 L40 -14" stroke="#fff" stroke-width="10" stroke-linecap="round"/></g>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "cinq") - 0.8, { y: 50 });
  show("#s6-k2", cue("s6-1", "parfums") - 0.8, { y: 50 });
  show("#s6-k3", cue("s6-1", "tricheur") - 0.8, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tSp - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tSp);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "peau") - 0.6,
  );
  pop("#s6-next", cue("s6-4", "toucher") - 0.6);
  const tEnd = S.end - 3.2;
  tl.to("#s6-main", { y: -200, opacity: 0, duration: 0.45, ease: INN }, tEnd);
  tl.fromTo(
    "#s6-end",
    { opacity: 0, scale: 0.5, y: 80 },
    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" },
    tEnd + 0.4,
  );
  show("#s6-bye", tEnd + 0.9);
})();
