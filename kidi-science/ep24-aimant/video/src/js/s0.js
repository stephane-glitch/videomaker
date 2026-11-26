// ---------- Scène 0 : l'aimant colle au frigo, pas à la fenêtre : il n'attire pas tout, il aime le fer ----------
(() => {
  // l'icône du générique devient un aimant en fer à cheval pour cet épisode
  document.getElementById("gi-pollen-g").innerHTML =
    `<path d="M22 20 V80 A53 53 0 0 0 128 80 V20 H96 V80 A21 21 0 0 1 54 80 V20 Z" fill="#E0455E" class="ink" stroke-width="5" stroke-linejoin="round"/><rect x="22" y="20" width="32" height="26" fill="#D3DAE6" class="ink" stroke-width="5"/><rect x="96" y="20" width="32" height="26" fill="#D3DAE6" class="ink" stroke-width="5"/>`;
  const tFr = cue("s0-1", "frigo") - 0.6,
    tFe = cue("s0-1", "fenêtre") - 0.6,
    tTo = cue("s0-2", "tout") - 0.5,
    tFer = cue("s0-4", "fer") - 0.5;
  const mag = (x, y, r = 0) =>
    `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(r)})"><circle r="34" fill="#E0455E" class="ink" stroke-width="5"/><circle r="12" fill="#fff" opacity="0.6"/></g>`;
  onDraw("s0", (t) => {
    let s = panelSVG();
    // le frigo, avec un dessin tenu par l'aimant
    s += `<rect x="330" y="230" width="420" height="590" rx="30" fill="#fff" class="ink" stroke-width="6"/><path d="M330 440 H750" class="ink" stroke-width="6"/><rect x="366" y="300" width="18" height="100" rx="9" fill="${C.ink}"/><rect x="366" y="480" width="18" height="160" rx="9" fill="${C.ink}"/>`;
    const fr = ramp(t, tFr, tFr + 0.3),
      w = 3 * Math.sin(t * 2.4);
    s +=
      `<g transform="rotate(${f2(w)} 580 520)"><rect x="490" y="520" width="180" height="210" fill="#FFF6B0" class="ink" stroke-width="4"/><circle cx="580" cy="600" r="34" fill="${C.fire}"/><path d="M520 700 Q580 650 640 700" fill="none" stroke="#3DBE8B" stroke-width="10"/></g>` +
      `<g transform="translate(0 ${f2(-60 * (1 - fr))})" opacity="${f2(fr)}">${mag(580, 530)}</g>`;
    // la fenêtre : l'aimant glisse et tombe
    s += `<rect x="1090" y="250" width="500" height="460" rx="14" fill="#BFE6FF" class="ink" stroke-width="8"/><path d="M1340 250 V710 M1090 480 H1590" class="ink" stroke-width="6"/><path d="M1060 716 H1620" class="ink" stroke-width="12" stroke-linecap="round"/>`;
    if (t > tFe) {
      const u = ((t - tFe) % 2.6) / 2.6,
        y = u < 0.25 ? 380 : 380 + Math.min(1, ((u - 0.25) / 0.35) ** 2) * 390,
        b = u > 0.6 ? 24 * Math.abs(Math.sin((u - 0.6) * 18)) * (1 - u) * 2.5 : 0;
      s += mag(1460, y - b, u > 0.25 ? (u - 0.25) * 500 : 0);
    }
    const to = ramp(t, tTo, tTo + 0.3) * (1 - ramp(t, tFer - 0.3, tFer));
    if (to > 0) s += txt(920, 300, "?", 180, { w: 700, fill: "#C25E00", op: to });
    const fe = ramp(t, tFer, tFer + 0.3);
    if (fe > 0)
      s += `<g transform="translate(920 330) scale(${f2(0.7 + 0.3 * fe)})" opacity="${f2(fe)}"><rect x="-130" y="-70" width="260" height="130" rx="26" fill="#5B6B88" class="ink" stroke-width="5"/>${txt(0, 20, "le fer", 60, { w: 700, fill: "#fff" })}</g>`;
    $("#s0-draw").innerHTML = s;
  });
  show("#s0-n1", tTo + 0.4);
  pop("#s0-n2", tFer + 0.3);
})();
