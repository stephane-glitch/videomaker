// ---------- Scène 6 : le résumé, puis les abeilles et le miel : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tAb = cue("s6-3", "abeilles") - 0.8;
  onDraw("s6", (t) => {
    if (t < tAb - 0.3) return;
    // une abeille qui butine, et le pot de miel
    const bx = 520 + 120 * Math.sin(t * 1.3),
      by = 500 + 50 * Math.sin(t * 2.1);
    let s = `<rect x="200" y="330" width="760" height="460" rx="34" fill="#BFE6FF" class="ink" stroke-width="5"/><clipPath id="s6-c"><rect x="204" y="334" width="752" height="452" rx="30"/></clipPath><g clip-path="url(#s6-c)"><rect x="200" y="700" width="760" height="100" fill="#7CC47A"/><path d="M200 700 H960" class="ink" stroke-width="5"/><g transform="translate(340 700) scale(0.55)">${flowerSVG(0, 0, 1)}</g>`;
    s += `<g transform="translate(790 640)"><rect x="-70" y="-90" width="140" height="150" rx="24" fill="${C.hot}" class="ink" stroke-width="5"/><rect x="-80" y="-112" width="160" height="30" rx="10" fill="#fff" class="ink" stroke-width="5"/><text x="0" y="6" text-anchor="middle" font-size="38" font-weight="700" fill="${C.ink}">miel</text></g>`;
    s += `<g transform="translate(${f2(bx)} ${f2(by)})"><ellipse cx="-6" cy="-30" rx="26" ry="${f2(14 + 8 * Math.abs(Math.sin(t * 40)))}" fill="#fff" class="ink" stroke-width="3" opacity="0.85"/><ellipse rx="44" ry="30" fill="${C.hot}" class="ink" stroke-width="4"/><path d="M-12 -28 V28 M10 -28 V28" class="ink" stroke-width="9"/><circle cx="40" cy="-4" r="20" fill="${C.ink}"/><circle cx="48" cy="-8" r="5" fill="#fff"/></g></g>`;
    $("#s6-draw").innerHTML = s;
  });
  show("#s6-k1", cue("s6-1", "eau") - 1.2, { y: 50 });
  show("#s6-k2", cue("s6-1", "sucre") - 1.2, { y: 50 });
  show("#s6-k3", cue("s6-1", "oxygène") - 1.2, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tAb - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tAb);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "abeilles") - 0.2,
  );
  pop("#s6-next", cue("s6-4", "prochaine") - 0.3);
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
