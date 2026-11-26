// Voix du dialogue (ElevenLabs, eleven_v3), une réplique par fichier, avec horodatage par caractère.
// Usage : NODE_USE_ENV_PROXY=1 node scripts/vo.mjs [id…]     (sans argument : tout ce qui manque)
// L'identifiant ElevenLabs est injecté par le proxy de l'environnement : aucune clé ici.
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";

const VOICES = {
  zoe: {
    id: "ZYOBieLaunTiQrTrvNQq",
    tag: "[petite fille de dix ans, vive et maligne, enjouée, voix claire] ",
  },
  max: {
    id: "nbiTBaMRdSobTQJDzIWm",
    tag: "[adulte bienveillant et chaleureux, complice, un peu taquin, rythme posé] ",
    tempo: 0.92,
  },
};
const lines = JSON.parse(readFileSync("src/dialogue.json", "utf8"));
const want = process.argv.slice(2);
mkdirSync("assets/vo", { recursive: true });
for (const l of lines) {
  const mp3 = `assets/vo/${l.id}.mp3`;
  if (want.length ? !want.includes(l.id) : existsSync(mp3)) continue;
  const v = VOICES[l.who];
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${v.id}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: v.tag + l.text,
        model_id: "eleven_v3",
        language_code: "fr",
        voice_settings: { stability: 0.5 },
      }),
    },
  );
  if (!r.ok) {
    console.error(l.id, r.status, (await r.text()).slice(0, 300));
    process.exitCode = 1;
    continue;
  }
  const j = await r.json();
  const al = j.alignment;
  if (v.tempo) {
    // ralentit la voix sans changer sa hauteur, et décale l'horodatage d'autant
    writeFileSync(mp3 + ".raw.mp3", Buffer.from(j.audio_base64, "base64"));
    execFileSync("ffmpeg", [
      "-loglevel",
      "error",
      "-y",
      "-i",
      mp3 + ".raw.mp3",
      "-af",
      `atempo=${v.tempo}`,
      "-b:a",
      "128k",
      mp3,
    ]);
    unlinkSync(mp3 + ".raw.mp3");
    al.character_start_times_seconds = al.character_start_times_seconds.map((x) => x / v.tempo);
    al.character_end_times_seconds = al.character_end_times_seconds.map((x) => x / v.tempo);
  } else writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
  writeFileSync(`assets/vo/${l.id}.json`, JSON.stringify(al));
  const e = al.character_end_times_seconds;
  console.log(l.id, l.who, e[e.length - 1].toFixed(2) + "s");
}
