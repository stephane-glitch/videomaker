/* eslint-disable no-unused-vars -- fragment assemblé par scripts/build.mjs : ces fonctions servent aux autres fragments */
// La voiture en coupe (vue de côté), utilisée par les scènes 0, 1 et 7.
// Repère « voiture » : 1200 × 520, avant à droite, roues centrées en (290, 372) et (930, 372).
const CAR = {
  body: "M70 360 L70 290 Q75 245 130 235 L250 215 Q330 115 430 110 L700 110 Q800 112 880 215 L1060 240 Q1128 252 1130 300 L1130 360 Z",
  win: "M292 212 Q350 142 438 138 L560 138 L560 212 Z M590 138 L690 138 Q775 142 838 212 L590 212 Z",
  wr: [290, 372],
  wf: [930, 372],
  R: 80,
  // points visés par les étiquettes
  at: {
    tank: [205, 290],
    batt: [600, 332],
    eng: [980, 290],
    gear: [855, 304],
    steer: [742, 208],
    brake: [930, 372],
  },
};
const wheelSVG = (p, k, [cx, cy]) => {
  let sp = "";
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU;
    sp += `<path d="M${cx} ${cy} L${f2(cx + 50 * Math.cos(a))} ${f2(cy + 50 * Math.sin(a))}" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>`;
  }
  return (
    `<circle cx="${cx}" cy="${cy}" r="${CAR.R}" fill="${C.ink}"/>` +
    `<circle cx="${cx}" cy="${cy}" r="56" fill="#EEF2F8" class="ink"/>` +
    `<g id="${p}-br${k}" class="part"><circle cx="${cx}" cy="${cy}" r="40" fill="${C.metal}" class="ink" stroke-width="3"/></g>` +
    `<g id="${p}-w${k}">${sp}<circle cx="${cx}" cy="${cy}" r="13" fill="#fff" class="ink"/></g>`
  );
};
const carSVG = (p) => `
        <path d="${CAR.body}" fill="#ffffff" opacity="0.72"/>
        <g id="${p}-parts">
          <path d="M120 356 L1090 356" stroke="${C.inner}" stroke-width="6" stroke-linecap="round"/>
          <path d="M470 312 L470 250 Q470 232 490 232 L512 232 L512 300 L560 300 L560 312 Z M640 312 L640 250 Q640 232 660 232 L682 232 L682 300 L730 300 L730 312 Z" fill="${C.side}" class="ink" stroke-width="3"/>
          <g id="${p}-tank" class="part">
            <rect x="130" y="258" width="150" height="66" rx="16" fill="${C.fire}" class="ink"/>
            <path d="M150 258 L150 240 L180 240 L180 258" fill="${C.fire}" class="ink"/>
            <path d="M150 300 Q205 284 262 300" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
          </g>
          <g id="${p}-batt" class="part">
            <rect x="400" y="312" width="400" height="40" rx="10" fill="${C.spark}" class="ink"/>
            <path d="M480 312 V352 M560 312 V352 M640 312 V352 M720 312 V352" stroke="${C.ink}" stroke-width="3"/>
          </g>
          <g id="${p}-gear" class="part">
            <path d="M855 330 L930 372" stroke="${C.blueD}" stroke-width="14" stroke-linecap="round"/>
            <rect x="812" y="272" width="86" height="64" rx="12" fill="${C.blueD}" class="ink"/>
            <circle cx="840" cy="304" r="15" fill="none" stroke="#fff" stroke-width="5"/>
            <circle cx="872" cy="304" r="9" fill="none" stroke="#fff" stroke-width="5"/>
          </g>
          <g id="${p}-eng" class="part">
            <rect x="905" y="244" width="150" height="92" rx="14" fill="${C.blue}" class="ink"/>
            <rect x="922" y="226" width="30" height="20" rx="5" fill="${C.blueL}" class="ink" stroke-width="3"/>
            <rect x="965" y="226" width="30" height="20" rx="5" fill="${C.blueL}" class="ink" stroke-width="3"/>
            <rect x="1008" y="226" width="30" height="20" rx="5" fill="${C.blueL}" class="ink" stroke-width="3"/>
            <path d="M925 290 H1035" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
          </g>
          <g id="${p}-steer" class="part">
            <path d="M752 226 L905 326" stroke="${C.metal}" stroke-width="9" stroke-linecap="round"/>
            <ellipse cx="742" cy="208" rx="15" ry="42" transform="rotate(-24 742 208)" fill="none" stroke="${C.ink}" stroke-width="11"/>
            <ellipse cx="742" cy="208" rx="15" ry="42" transform="rotate(-24 742 208)" fill="none" stroke="${C.blueL}" stroke-width="5"/>
          </g>
        </g>
        <g id="${p}-paint">
          <path d="${CAR.body}" fill="#3DBE8B"/>
          <path d="${CAR.win}" fill="#D6F1FF" class="ink" stroke-width="3"/>
          <path d="M575 214 V352" stroke="${C.ink}" stroke-width="3" opacity="0.5"/>
          <rect x="610" y="236" width="44" height="12" rx="6" fill="${C.ink}" opacity="0.6"/>
          <path d="M1092 262 Q1124 268 1126 296 L1096 296 Z" fill="${C.hot}" class="ink" stroke-width="3"/>
          <rect x="72" y="270" width="16" height="40" rx="6" fill="#F0556A" class="ink" stroke-width="3"/>
        </g>
        <path d="${CAR.body}" fill="none" class="ink" stroke-width="5"/>
        ${wheelSVG(p, "r", CAR.wr)}
        ${wheelSVG(p, "f", CAR.wf)}`;
// Fait tourner les roues (angle en radians).
const carWheels = (p, ang) => {
  const d = f2((ang * 180) / Math.PI);
  document
    .getElementById(`${p}-wr`)
    .setAttribute("transform", `rotate(${d} ${CAR.wr[0]} ${CAR.wr[1]})`);
  document
    .getElementById(`${p}-wf`)
    .setAttribute("transform", `rotate(${d} ${CAR.wf[0]} ${CAR.wf[1]})`);
};
// Place de la voiture dans l'image : coin haut-gauche (260, 300), échelle 7/6.
const CARPOS = { x: 260, y: 300, k: 1400 / 1200 };
const carPt = ([x, y]) => [
  Math.round(CARPOS.x + x * CARPOS.k),
  Math.round(CARPOS.y + y * CARPOS.k),
];

// « Pulsation » d'un organe quand on le nomme : grossit sur place puis revient.
// list = [[organe, instant, amplitude, durée], …] ; calculé à chaque image (pas de transformation GSAP sur le SVG).
const PARTC = {
  tank: [205, 290],
  batt: [600, 332],
  eng: [980, 285],
  gear: [855, 304],
  steer: [742, 208],
  brf: [930, 372],
  brr: [290, 372],
};
const carPulses = (p, list, t) => {
  const acc = {};
  for (const [k, t0, amp = 0.22, d = 0.5] of list) {
    const u = (t - t0) / d;
    if (u > 0 && u < 1) acc[k] = Math.max(acc[k] ?? 0, amp * Math.sin(Math.PI * u));
  }
  for (const k in PARTC) {
    const s = 1 + (acc[k] ?? 0),
      [cx, cy] = PARTC[k];
    document
      .getElementById(`${p}-${k}`)
      .setAttribute(
        "transform",
        s === 1 ? "" : `translate(${cx} ${cy}) scale(${f2(s)}) translate(${-cx} ${-cy})`,
      );
  }
};
