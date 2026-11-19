// Génère la voix off scène par scène avec ElevenLabs (horodatage par caractère).
// Usage : node scripts/vo.mjs [ids…]   (sans argument : toutes les scènes)
// L'authentification est injectée par le proxy de l'environnement : aucune clé ici.
import { writeFileSync, mkdirSync } from "node:fs";

const VOICE = "WQKwBV2Uzw1gSGr69N8I";
const MODEL = process.env.VO_MODEL ?? "eleven_v3";
// Ton : dirigeante d'entreprise engagée, qui accueille ses nouvelles recrues.
const TAG = "[ton assuré et chaleureux de dirigeante d'entreprise, engagée, rythme posé] ";
export const SCENES = [
  [
    "s1",
    "Bonjour, et bienvenue chez Aéronova. Vous ne le savez pas encore… mais si vous êtes ici, c'est que vous venez d'être recrutés.",
  ],
  [
    "s2",
    "Nous sommes en deux mille quarante. Aéronova est la fine fleur de l'aéronautique. Ses avions nouvelle génération, les Folding Planes, volent grâce au vent et au soleil : des avions enfin respectueux de la planète.",
  ],
  [
    "s3",
    "Mais chez Aéronova, le voyage compte autant que l'avion. Alors l'entreprise invente des applications pour les passagers. Un nuage à la demande, qui prend la forme de vos envies. Un applaudimètre, qui acclame le pilote à l'atterrissage… même quand c'est un peu secoué. Un hublot augmenté, pour survoler la savane ou l'Australie. Et des dizaines d'autres idées.",
  ],
  ["s4", "Ces applications, c'est vous… oui, vous ! qui allez les faire décoller."],
  [
    "s5",
    "Vous rejoignez l'un des cinq pôles d'Aéronova. Le Business choisit les applications à lancer, et engage le budget. Le Développement construit la solution. Le Test vérifie qu'elle tient ses promesses. La Release prépare la livraison. Et la Mise en production fait entrer l'application en service, à bord. À chaque étape, un défi vous attend. Vous le résolvez, vous validez sur la tablette… puis vous portez la fiche au pôle suivant.",
  ],
  [
    "s6",
    "Sur le grand écran, toute l'entreprise suit en direct le voyage de chaque application. Vous jouerez trois manches de quinze minutes, avec un temps pour prendre du recul entre chacune. Les échanges et les déplacements sont autorisés.",
  ],
  [
    "s7",
    "Votre mission : mettre en service un maximum d'applications. Installez-vous, ouvrez grand les yeux… et préparez-vous au décollage !",
  ],
];

const want = process.argv.slice(2);
mkdirSync("assets/vo", { recursive: true });
for (const [id, text] of SCENES) {
  if (want.length && !want.includes(id)) continue;
  const body = {
    text: (MODEL === "eleven_v3" ? TAG : "") + text,
    model_id: MODEL,
    language_code: "fr",
    voice_settings:
      MODEL === "eleven_v3"
        ? { stability: 0.5 }
        : { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
  };
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!r.ok) {
    console.error(id, r.status, (await r.text()).slice(0, 400));
    process.exitCode = 1;
    continue;
  }
  const j = await r.json();
  writeFileSync(`assets/vo/${id}.mp3`, Buffer.from(j.audio_base64, "base64"));
  writeFileSync(`assets/vo/${id}.json`, JSON.stringify({ text, alignment: j.alignment }));
  const ends = j.alignment.character_end_times_seconds;
  console.log(id, "ok", ends[ends.length - 1].toFixed(2) + "s");
}
