// Assemble index.html à partir de src/ : calcule le calendrier du film d'après la
// durée réelle de chaque réplique, puis injecte scènes, pistes audio et scripts.
// Usage : node scripts/build.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (p) => readFileSync(p, "utf8");
const lines = JSON.parse(read("src/dialogue.json"));

// Scènes : `lead` = temps avant la première réplique, `tail` = temps après la dernière.
// Les scènes 0 et 1 partagent le même décor (la voiture), d'où un seul conteneur « s01 ».
const SCENES = [
  { id: "g", parts: ["g"], lead: 0.7, tail: 5.0 },
  { id: "s01", parts: ["s0", "s1"], lead: 1.6, tail: 1.5 },
  { id: "s2", parts: ["s2"], lead: 1.0, tail: 2.2 },
  { id: "s3", parts: ["s3"], lead: 1.0, tail: 1.6 },
  { id: "s4", parts: ["s4"], lead: 1.0, tail: 1.8 },
  { id: "s5", parts: ["s5"], lead: 1.0, tail: 1.4 },
  { id: "s6", parts: ["s6"], lead: 1.0, tail: 1.2 },
  { id: "s7", parts: ["s7"], lead: 1.0, tail: 4.0 },
];
// Silence avant une réplique (0,35 s par défaut) : laisse à l'image le temps d'agir.
const PRE = {
  "s0-2": 0.6,
  "s1-1": 1.8,
  "s1-3": 0.6,
  "s2-2": 0.5,
  "s2-3": 0.8,
  "s2-4": 1.4,
  "s2-5": 1.4,
  "s2-6": 1.6,
  "s2-7": 1.6,
  "s2-8": 1.0,
  "s2-9": 0.6,
  "s2-10": 1.2,
  "s3-2": 0.5,
  "s3-4": 0.8,
  "s3-6": 0.6,
  "s4-2": 0.5,
  "s4-3": 1.4,
  "s4-4": 1.2,
  "s4-5": 0.5,
  "s5-2": 0.5,
  "s5-3": 0.8,
  "s6-2": 0.5,
  "s6-3": 1.0,
  "s6-4": 0.8,
  "s7-2": 0.8,
  "s7-3": 1.2,
};

const dur = (f) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const r2 = (n) => Math.round(n * 100) / 100;

// Mots horodatés d'une réplique (on saute la balise de ton entre crochets).
function words(id) {
  const a = JSON.parse(read(`assets/vo/${id}.json`));
  const ch = a.characters, st = a.character_start_times_seconds, en = a.character_end_times_seconds;
  const s = ch.join("");
  const k = s.startsWith("[") ? s.indexOf("]") + 1 : 0;
  const out = [];
  let cur = "", t0 = null, t1 = 0;
  for (let i = k; i < ch.length; i++) {
    if (/\s/.test(ch[i])) {
      if (cur) out.push([cur, r2(t0), r2(t1)]);
      cur = "";
      t0 = null;
    } else {
      if (t0 === null) t0 = st[i];
      cur += ch[i];
      t1 = en[i];
    }
  }
  if (cur) out.push([cur, r2(t0), r2(t1)]);
  return out;
}

const sched = { total: 0, scenes: {}, parts: {}, lines: {} };
let t = 0;
for (const sc of SCENES) {
  const start = t;
  t += sc.lead;
  let first = true;
  for (const part of sc.parts) {
    sched.parts[part] = { start: r2(first ? start : t) };
    for (const l of lines.filter((x) => x.scene === part)) {
      if (!first) t += PRE[l.id] ?? 0.35;
      first = false;
      const d = dur(`assets/vo/${l.id}.mp3`);
      sched.lines[l.id] = { start: r2(t), end: r2(t + d), who: l.who, words: words(l.id).map(([w, a, b]) => [w, r2(t + a), r2(t + b)]) };
      t += d;
    }
    sched.parts[part].end = r2(t);
  }
  t += sc.tail;
  t = Math.round(t * 10) / 10;
  sched.scenes[sc.id] = { start: r2(start), end: r2(t) };
}
sched.total = r2(t);

// --- Balises ---
const sceneTags = SCENES.map((sc) => {
  const s = sched.scenes[sc.id];
  const body = read(`src/scenes/${sc.id}.html`);
  return `      <section id="${sc.id}" class="clip" data-start="${s.start}" data-duration="${r2(s.end - s.start)}" data-track-index="1">
        <div id="${sc.id}-in" class="in">
${body.trimEnd()}
        </div>
      </section>`;
}).join("\n\n");

const voTags = lines
  .map((l) => {
    const s = sched.lines[l.id];
    return `      <audio id="vo-${l.id}" src="assets/vo/${l.id}.mp3" data-start="${s.start}" data-duration="${r2(s.end - s.start - 0.02)}" data-track-index="${l.who === "zoe" ? 3 : 4}" data-volume="1"></audio>`;
  })
  .join("\n");

// Bruitages : src/sfx.json = [{ id, file, at: nombre | ["réplique", "mot"], offset, volume }]
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
function cue(id, frag, nth = 0) {
  const l = sched.lines[id];
  if (!l) throw new Error(`réplique inconnue : ${id}`);
  if (!frag) return l.start;
  const hits = l.words.filter(([w]) => norm(w).includes(norm(frag)));
  if (!hits[nth]) throw new Error(`mot « ${frag} » introuvable dans ${id}`);
  return hits[nth][1];
}
let sfxTags = "";
if (existsSync("src/sfx.json")) {
  sfxTags = JSON.parse(read("src/sfx.json"))
    .map((s, i) => {
      let at = typeof s.at === "number" ? s.at : s.at[0].startsWith("@") ? sched.scenes[s.at[0].slice(1)][s.at[1] ?? "start"] : cue(s.at[0], s.at[1], s.at[2] ?? 0);
      at = Math.max(0, r2(at + (s.offset ?? 0)));
      const d = Math.min(dur(`assets/sfx/${s.file}.mp3`), s.dur ?? 99, sched.total - at) - 0.02;
      return `      <audio id="fx-${i}-${s.file}" src="assets/sfx/${s.file}.mp3" data-start="${at}" data-duration="${r2(d)}" data-track-index="${5 + (i % 3)}" data-volume="${s.volume ?? 0.4}"></audio>`;
    })
    .join("\n");
}

const js = ["kit", "car", "engine", "g", "s01", "s2", "s3", "s4", "s5", "s6", "s7", "main"]
  .filter((n) => existsSync(`src/js/${n}.js`))
  .map((n) => `      // ===== ${n}.js =====\n` + read(`src/js/${n}.js`).trimEnd())
  .join("\n\n");

let html = read("src/index.tpl.html");
const put = (k, v) => {
  if (!html.includes(k)) throw new Error(`jeton absent : ${k}`);
  html = html.split(k).join(v);
};
put("{{TOTAL}}", String(sched.total));
put("{{SCENES}}", sceneTags);
put("{{AUDIO}}", voTags + "\n" + sfxTags);
put("{{SCHED}}", JSON.stringify(sched));
put("{{JS}}", js);
writeFileSync("index.html", html);
writeFileSync("src/schedule.json", JSON.stringify(sched, null, 1));
const mm = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;
console.log("durée totale", mm(sched.total), "—", Object.entries(sched.scenes).map(([k, v]) => `${k} ${mm(v.start)}`).join(" · "));
