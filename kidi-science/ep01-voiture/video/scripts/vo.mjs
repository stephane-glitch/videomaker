// Voix du dialogue (ElevenLabs, eleven_v3), une réplique par fichier, avec horodatage par caractère.
// Usage : NODE_USE_ENV_PROXY=1 node scripts/vo.mjs [id…]     (sans argument : tout ce qui manque)
// L'identifiant ElevenLabs est injecté par le proxy de l'environnement : aucune clé ici.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const VOICES = {
  zoe: { id: "ZYOBieLaunTiQrTrvNQq", tag: "[petite fille de dix ans, curieuse et enjouée, voix claire] " },
  max: { id: "nbiTBaMRdSobTQJDzIWm", tag: "[adulte bienveillant et chaleureux, pédagogue, souriant, rythme posé] " },
};
const lines = JSON.parse(readFileSync("src/dialogue.json", "utf8"));
const want = process.argv.slice(2);
mkdirSync("assets/vo", { recursive: true });
for (const l of lines) {
  const mp3 = `assets/vo/${l.id}.mp3`;
  if (want.length ? !want.includes(l.id) : existsSync(mp3)) continue;
  const v = VOICES[l.who];
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.id}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: v.tag + l.text, model_id: "eleven_v3", language_code: "fr", voice_settings: { stability: 0.5 } }),
  });
  if (!r.ok) {
    console.error(l.id, r.status, (await r.text()).slice(0, 300));
    process.exitCode = 1;
    continue;
  }
  const j = await r.json();
  writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
  writeFileSync(`assets/vo/${l.id}.json`, JSON.stringify(j.alignment));
  const e = j.alignment.character_end_times_seconds;
  console.log(l.id, l.who, e[e.length - 1].toFixed(2) + "s");
}
