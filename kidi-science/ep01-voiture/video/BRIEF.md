---
workflow: general-video
flow: companion
storyboard: yes
message: "Une voiture, c'est une chaîne qui transforme l'énergie en mouvement"
destination: youtube
aspect: 1920x1080
language: fr
audience: "enfants d'environ 10 ans"
length: "≤ 5 min"
voice: elevenlabs
---

## Intent

Premier épisode de Kidi-science : comment marche une voiture (moteur à essence et
électrique, transmission, direction, freins), expliqué par un dialogue en voix off
entre Zoé (enfant) et Max (adulte). On doit voir les pièces en mouvement.

## Notes

- Décisions de série : `../../SERIE.md`. Découpage : `../EPISODE.md`. Texte : `../DIALOGUE.md`.
- Personnages jamais visibles, pas de bulles.
- Sources dans `src/`, assemblées par `node scripts/build.mjs` ; ne pas éditer `index.html`.
