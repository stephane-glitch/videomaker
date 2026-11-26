// ---------- Scène 6 : le résumé, puis les dinosaures et la météorite : annonce du prochain épisode ----------
(() => {
  const S = scn("s6");
  const tDi = cue("s6-3", "dinosaures") - 0.8,
    tMe = cue("s6-4", "météorite") - 0.6;
  onDraw("s6", (t) => {
    if (t < tDi - 0.3) return;
    // un dinosaure broute, sans voir ce qui arrive dans le ciel
    let s = `<rect x="200" y="330" width="760" height="460" rx="34" fill="#FFD9A8" class="ink" stroke-width="5"/><clipPath id="s6-c"><rect x="204" y="334" width="752" height="452" rx="30"/></clipPath><g clip-path="url(#s6-c)"><path d="M200 700 Q400 660 600 700 T960 690 V800 H200 Z" fill="#7CC47A" class="ink" stroke-width="4"/>`;
    const n = 6 * Math.sin(t * 2);
    s += `<g transform="translate(520 640)"><path d="M-150 -10 Q-230 0 -260 40 Q-200 20 -140 30 Z" fill="#3DBE8B" class="ink" stroke-width="4" stroke-linejoin="round"/><ellipse cx="-40" cy="0" rx="130" ry="70" fill="#3DBE8B" class="ink" stroke-width="5"/><rect x="-110" y="40" width="40" height="70" rx="12" fill="#3DBE8B" class="ink" stroke-width="5"/><rect x="10" y="40" width="40" height="70" rx="12" fill="#3DBE8B" class="ink" stroke-width="5"/><path d="M50 -30 Q110 -130 ${f2(150 + n)} ${f2(-190 + n)} L${f2(190 + n)} ${f2(-170 + n)} Q140 -90 100 0 Z" fill="#3DBE8B" class="ink" stroke-width="5" stroke-linejoin="round"/><ellipse cx="${f2(182 + n)}" cy="${f2(-186 + n)}" rx="40" ry="24" fill="#3DBE8B" class="ink" stroke-width="5"/><circle cx="${f2(192 + n)}" cy="${f2(-192 + n)}" r="6" fill="${C.ink}"/></g>`;
    const me = ramp(t, tMe, tMe + 0.4);
    if (me > 0) {
      const u = ((t - tMe) * 0.35) % 1,
        x = lerp(940, 760, u),
        y = lerp(340, 470, u);
      s += `<g opacity="${f2(me)}"><path d="M${f2(x)} ${f2(y)} L${f2(x + 150)} ${f2(y - 108)}" stroke="${C.hot}" stroke-width="22" stroke-linecap="round" opacity="0.7"/><path d="M${f2(x)} ${f2(y)} L${f2(x + 90)} ${f2(y - 65)}" stroke="${C.fire}" stroke-width="14" stroke-linecap="round"/><circle cx="${f2(x)}" cy="${f2(y)}" r="20" fill="#8A5A2B" class="ink" stroke-width="4"/></g>`;
    }
    $("#s6-draw").innerHTML = s + `</g>`;
  });
  show("#s6-k1", cue("s6-1", "fer") - 1.4, { y: 50 });
  show("#s6-k2", cue("s6-1", "contraires") - 0.6, { y: 50 });
  show("#s6-k3", cue("s6-1", "géant") - 1.6, { y: 50 });
  tl.to("#s6-cards", { y: -160, opacity: 0, duration: 0.4, ease: INN }, tDi - 0.3);
  tl.fromTo("#s6-b", { opacity: 0 }, { opacity: 1, duration: 0.4 }, tDi);
  tl.fromTo(
    "#s6-atch",
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.4, ease: OUT },
    cue("s6-3", "dinosaures") - 0.2,
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
