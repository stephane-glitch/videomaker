// ---------- Scène 2 : le moteur à essence ----------
(() => {
  const { H1, crankZ } = ENG.dims;
  $("#eng-a").innerHTML = ENG.back();
  $("#eng-b").innerHTML = ENG.cut();
  $("#eng-t").innerHTML = ENG.plug();

  // --- Angle du vilebrequin (en degrés cumulés) en fonction du temps ---
  // 0 = piston en haut, début de l'admission. Un cycle complet = 720°.
  const tDemo = cue("s2-2", "monter") - 0.3;
  const t1 = cue("s2-3", "descend") - 0.15;
  const t2 = cue("s2-4", "remonte") - 0.15;
  const tSpark = cue("s2-5", "étincelle") - 0.1;
  const tBoum = cue("s2-5", "Boum") - 0.05;
  const t4 = cue("s2-6", "remonte") - 0.15;
  const tRe = cue("s2-6", "recommence") - 0.1;
  const z1 = cue("s2-7", "Aspire"),
    z2 = cue("s2-7", "serre"),
    z3 = cue("s2-7", "boum"),
    z4 = cue("s2-7", "recrache");
  const tFour = cue("s2-10", "quatre") - 0.5;
  // [temps, angle, lissage ?]
  const KF = [
    [tDemo, -360, 1],
    [tDemo + 2.6, 0, 1],
    [t1, 0, 1],
    [t1 + 2.4, 180, 1],
    [t2, 180, 1],
    [t2 + 2.2, 360, 1],
    [tBoum, 360, 2],
    [tBoum + 0.9, 540, 1],
    [t4, 540, 1],
    [t4 + 2.4, 720, 1],
    [tRe, 720, 1],
    [z1, 1440, 0],
    [z2, 1620, 0],
    [z3, 1800, 0],
    [z4, 1980, 0],
    [z4 + 0.7, 2160, 0],
  ];
  const RATE = 330; // degrés par seconde une fois le moteur lancé
  const deg = (t) => {
    if (t <= KF[0][0]) return KF[0][1];
    for (let i = 1; i < KF.length; i++) {
      if (t <= KF[i][0]) {
        const [ta, a] = KF[i - 1],
          [tb, b, m] = KF[i];
        const u = lin(t, ta, tb);
        return lerp(a, b, m === 1 ? easeIO(u) : m === 2 ? easeO(u) : u);
      }
    }
    const [tl0, a0] = KF[KF.length - 1];
    return a0 + (t - tl0) * RATE;
  };
  // État des gaz et des soupapes à partir de l'angle.
  const bump = (m, a, b) => clamp(Math.min((m - a) / 22, (b - m) / 22));
  const state = (t) => {
    const D = deg(t);
    const st = { iv: 0, ev: 0, gas: null, dens: 0, flow: t, spark: 0, stroke: 0 };
    if (D < 0) return { D, st };
    const m = ((D % 720) + 720) % 720;
    if (m < 180) {
      st.stroke = 1;
      st.iv = bump(m, 0, 180);
      st.gas = "mix";
      st.dens = 0.05;
      if (D === 0 && t < t1) st.gas = null; // avant le premier temps : cylindre vide
    } else if (m < 360) {
      st.stroke = 2;
      st.gas = "mix";
      st.dens = (m - 180) / 180;
    } else if (m < 540) {
      st.stroke = 3;
      st.gas = "fire";
      st.dens = 1;
      st.spark = clamp(1 - (m - 360) / 40);
    } else {
      st.stroke = 4;
      st.ev = bump(m, 540, 720);
      st.gas = "smoke";
      st.dens = 1 - (m - 540) / 180;
    }
    // Au ralenti : on attend l'étincelle au point mort haut, mélange serré.
    if (D === 360 && t < tBoum) {
      st.stroke = t >= tSpark - 0.6 ? 3 : 2;
      st.gas = "mix";
      st.dens = 1;
      st.spark = t >= tSpark ? 0.6 + 0.4 * Math.abs(Math.sin((t - tSpark) * 14)) : 0;
    }
    // Entre deux temps du ralenti, on reste sur le temps qui vient de finir.
    if (D === 180 && t < t2) {
      st.stroke = 1;
      st.dens = 0.05;
    }
    if (D === 540 && t < t4) {
      st.stroke = 3;
      st.gas = "fire";
      st.ev = 0;
    }
    if (D === 720 && t < tRe) st.gas = null;
    return { D, st };
  };

  // --- Encart « comme sur un vélo » : la jambe pousse de haut en bas, la pédale tourne ---
  const bike = (D) => {
    const a = (D * Math.PI) / 180,
      cx = 300,
      cy = 395,
      r = 96;
    const px = cx + r * Math.sin(a),
      py = cy - r * Math.cos(a);
    // jambe : hanche fixe, genou calculé pour que le pied reste sur la pédale
    const hx = 150,
      hy = 150,
      l1 = 205,
      l2 = 215;
    const dx = px - hx,
      dy = py - 34 - hy,
      d = Math.min(Math.hypot(dx, dy), l1 + l2 - 1);
    const base = Math.atan2(dy, dx),
      k = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
    const kx = hx + l1 * Math.cos(base - k),
      ky = hy + l1 * Math.sin(base - k);
    const leg = `M${hx} ${hy} L${f2(kx)} ${f2(ky)} L${f2(px)} ${f2(py - 34)}`;
    return (
      `<text x="280" y="62" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="40" fill="${C.ink}">Comme sur un vélo !</text>` +
      `<path d="M40 545 H520" class="ink" stroke-width="5"/>` +
      `<path d="${gearPath(cx, cy, 64, 14, a, 16)}" fill="${C.blue}" class="ink"/>` +
      `<path d="M${cx} ${cy} L${f2(px)} ${f2(py)}" stroke="${C.ink}" stroke-width="20" stroke-linecap="round"/><path d="M${cx} ${cy} L${f2(px)} ${f2(py)}" stroke="${C.blueL}" stroke-width="11" stroke-linecap="round"/>` +
      `<circle cx="${cx}" cy="${cy}" r="14" fill="#fff" class="ink"/>` +
      `<rect x="${f2(px - 50)}" y="${f2(py - 8)}" width="100" height="18" rx="9" fill="${C.ink}"/>` +
      `<path d="${leg}" fill="none" stroke="${C.ink}" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/><path d="${leg}" fill="none" stroke="#6E7FA6" stroke-width="37" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M${f2(px - 44)} ${f2(py - 12)} h78 q22 0 22 -18 q0 -12 -26 -16 l-34 -6 q-40 0 -40 22 Z" fill="#F0556A" class="ink"/>` +
      `<path d="M470 250 V470 M452 272 L470 250 L488 272 M452 448 L470 470 L488 448" fill="none" stroke="${C.fire}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<text x="470" y="225" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="30" fill="${C.fire}">haut-bas</text>`
    );
  };

  // --- Vue « quatre cylindres » (de côté, le long du vilebrequin) ---
  const four = (D) => {
    const offs = [0, 540, 180, 360]; // ordre d'allumage 1-3-4-2
    const axis = 520,
      r = 46,
      L = 150,
      w = 200;
    let s = `<path d="M60 ${axis} H1270" stroke="${C.blueD}" stroke-width="26" stroke-linecap="round"/>`;
    let crank = "",
      cyl = "";
    for (let i = 0; i < 4; i++) {
      const x = 190 + i * 290,
        Di = D + offs[i],
        th = (Di * Math.PI) / 180,
        m = ((Di % 720) + 720) % 720;
      const pinY = axis - r * Math.cos(th),
        pz = axis - (r * Math.cos(th) + Math.sqrt(L * L - Math.pow(r * Math.sin(th), 2)));
      const top = pz - 46;
      const col =
        m < 180
          ? "#BFE6FF"
          : m < 360
            ? mixHex("#BFE6FF", "#3FA9F5", (m - 180) / 180)
            : m < 540
              ? mixHex(C.hot, C.fire, (m - 360) / 180)
              : mixHex("#8A93A0", "#D9DEE5", (m - 540) / 180);
      cyl +=
        `<rect x="${x - w / 2}" y="110" width="${w}" height="${f2(top - 110)}" fill="${col}"/>` +
        `<path d="M${x - w / 2 - 22} 96 H${x + w / 2 + 22} V110 H${x + w / 2} V330 H${x + w / 2 + 22} V96 M${x - w / 2 - 22} 96 V330 H${x - w / 2} V110" fill="url(#eng-hatch)" class="ink"/>` +
        `<rect x="${x - w / 2 - 22}" y="74" width="${w + 44}" height="36" rx="8" fill="${C.side}" class="ink"/>` +
        (m >= 355 && m < 400
          ? `<path d="M${x} 118 l10 22 24 4 -18 16 6 24 -22 -12 -22 12 6 -24 -18 -16 24 -4Z" fill="${C.spark}" class="ink" stroke-width="3"/>`
          : "") +
        `<path d="M${x} ${f2(pz)} L${x} ${f2(pinY)}" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/><path d="M${x} ${f2(pz)} L${x} ${f2(pinY)}" stroke="${C.blueL}" stroke-width="22" stroke-linecap="round"/>` +
        `<rect x="${x - w / 2 + 4}" y="${f2(top)}" width="${w - 8}" height="92" rx="12" fill="${C.blue}" class="ink"/>` +
        `<path d="M${x - w / 2 + 4} ${f2(top + 22)} H${x + w / 2 - 4} M${x - w / 2 + 4} ${f2(top + 36)} H${x + w / 2 - 4}" stroke="${C.blueD}" stroke-width="4"/>` +
        `<text x="${x}" y="52" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="44" fill="${m >= 360 && m < 540 ? C.fire : "#C9CFDA"}">Boum !</text>`;
      crank += `<path d="M${x - 60} ${axis} V${f2(pinY)} H${x + 60} V${axis}" fill="none" stroke="${C.ink}" stroke-width="34" stroke-linejoin="round"/><path d="M${x - 60} ${axis} V${f2(pinY)} H${x + 60} V${axis}" fill="none" stroke="${C.blue}" stroke-width="26" stroke-linejoin="round"/>`;
    }
    const a = (D * Math.PI) / 180;
    const fly = `<circle cx="1272" cy="${axis}" r="84" fill="${C.blue}" class="ink"/><path d="M1272 ${axis} L${f2(1272 + 60 * Math.sin(a))} ${f2(axis - 60 * Math.cos(a))}" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="1272" cy="${axis}" r="16" fill="${C.ink}"/>`;
    return s + cyl + crank + fly;
  };
  // le quatre-cylindres accélère : « des dizaines de fois par seconde »
  const tFast = cue("s2-10", "dizaines") - 0.2;
  const deg4 = (t) => {
    const u = Math.max(0, t - tFour);
    const v = Math.max(0, t - tFast);
    return u * 300 + v * v * 520;
  };

  const stepEl = [1, 2, 3, 4].map((i) => document.getElementById(`s2-st${i}`));
  const stepCol = [C.air, "#3FA9F5", C.fire, C.smoke];
  onDraw("s2", (t) => {
    if (t < tFour + 0.6) {
      const { D, st } = state(t);
      const th = (D * Math.PI) / 180;
      $("#eng-g").innerHTML = ENG.gas(th, st);
      $("#eng-f").innerHTML = ENG.front(th, st);
      $("#eng-x").innerHTML = ENG.spark(st.spark);
      stepEl.forEach((el, i) => {
        const on = st.stroke === i + 1;
        el.style.background = on ? stepCol[i] : "#ffffff";
        el.style.transform = on ? "scale(1.08)" : "scale(1)";
      });
      $("#s2-bikesvg").innerHTML = bike(D);
    }
    if (t > tFour - 0.6) $("#s2-foursvg").innerHTML = four(deg4(t));
  });

  // --- Étiquettes et révélations ---
  const pt = (p) => ENG.P(p).map(Math.round);
  const k0 = ENG.kin(0);
  const lab = {
    cyl: label(
      "s2",
      "s2-l-cyl",
      pt([122, 0, 280]),
      [1020, 520],
      "Le cylindre",
      "un tube bien solide",
    ),
    pis: label(
      "s2",
      "s2-l-pis",
      pt([60, -62, k0.top - 70]),
      [1020, 330],
      "Le piston",
      "il monte et il descend",
      { color: C.blue },
    ),
    in: label(
      "s2",
      "s2-l-in",
      pt([-150, 0, H1 - 40]),
      [400, 300],
      "L’air et l’essence",
      "entrent par ici",
      { color: "#1A7FC4", align: "r" },
    ),
    plug: label(
      "s2",
      "s2-l-plug",
      pt([0, 0, H1 + 60]),
      [400, 180],
      "La bougie",
      "fait une étincelle",
      { align: "r" },
    ),
    out: label("s2", "s2-l-out", pt([150, 0, H1 - 40]), [1020, 300], "La fumée", "sort par là", {
      color: "#6B7380",
    }),
    rod: label("s2", "s2-l-rod", pt([22, -16, 190]), [400, 600], "La bielle", "une tige", {
      color: C.blue,
      align: "r",
    }),
    crank: label(
      "s2",
      "s2-l-crank",
      pt([0, -100, crankZ]),
      [940, 800],
      "Le vilebrequin",
      "une manivelle",
      { color: C.blue },
    ),
  };
  showLabel(lab.cyl, cue("s2-2", "cylindre") - 0.25);
  showLabel(lab.pis, cue("s2-2", "piston") - 0.25);
  hideLabel(lab.cyl.concat(lab.pis), t1 - 0.5);
  pop("#s2-steps .stp", cue("s2-2", "quatre") - 0.2, { st: 0.09 });
  showLabel(lab.in, t1 + 0.2);
  hideLabel(lab.in, t2 - 0.3);
  showLabel(lab.plug, cue("s2-5", "bougie") - 0.25);
  tl.fromTo(
    "#s2-boum",
    { opacity: 0, scale: 0.3, rotation: -8 },
    { opacity: 1, scale: 1, rotation: -8, duration: 0.25, ease: "back.out(2.5)" },
    tBoum,
  );
  tl.to(
    "#s2-engwrap",
    {
      keyframes: { x: [0, -12, 10, -7, 4, 0], y: [0, 8, -6, 4, -2, 0] },
      duration: 0.45,
      ease: "none",
    },
    tBoum,
  );
  tl.to("#s2-boum", { opacity: 0, scale: 1.3, duration: 0.4, ease: INN }, tBoum + 1.3);
  hideLabel(lab.plug, t4 - 0.3);
  showLabel(lab.out, t4 + 0.2);
  hideLabel(lab.out, tRe);
  showLabel(lab.rod, cue("s2-9", "bielle") - 0.25);
  showLabel(lab.crank, cue("s2-9", "vilebrequin") - 0.25);
  tl.fromTo(
    "#s2-bike",
    { opacity: 0, x: 120 },
    { opacity: 1, x: 0, duration: 0.5, ease: OUT },
    cue("s2-9", "jambes") - 0.5,
  );
  // Passage aux quatre cylindres
  tl.to("#s2-engwrap", { x: -300, opacity: 0, duration: 0.4, ease: INN }, tFour - 0.1);
  tl.fromTo(
    "#s2-four",
    { opacity: 0, x: 300 },
    { opacity: 1, x: 0, duration: 0.55, ease: "power4.out" },
    tFour + 0.3,
  );
  show("#s2-fourcap", cue("s2-10", "chacun") - 0.2);
})();
