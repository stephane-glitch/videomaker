---
workflow: general-video
flow: companion
storyboard: yes
message: "Bienvenue chez Aéronova : voici ce qui va se passer pendant Mission Flow"
destination: projection en salle
aspect: 1920x1080
language: fr
audience: "joueurs de Mission Flow, au lancement de la séance"
length: "≈ 2 min"
voice: elevenlabs
---

## Intent

Vidéo de briefing diffusée à l'ouverture du serious game Mission Flow. Elle
accueille les joueurs chez Aéronova (2040, Folding Planes éoliens et solaires),
montre trois applications, présente les cinq pôles et la circulation d'une fiche,
le suivi sur grand écran, le format (3 manches de 15 min) et l'objectif :
mettre en service un maximum d'applications. Ton : dirigeante d'entreprise engagée.

## Assets

- assets/img/ — visuels extraits du brief PowerPoint (logo, nuages, avion, cabine, 3 applications).
- assets/vo/ — voix ElevenLabs, voix `WQKwBV2Uzw1gSGr69N8I`, modèle eleven_v3 (scripts/vo.mjs).
- assets/sfx/ — bruitages ElevenLabs (scripts/sfx.sh).
- assets/fonts/ — Inter (OFL), sous-ensemble latin.

## Customizations

- Fil rouge : l'avion en papier (ouvre, traverse l'écran scène 4, devient la fiche, décolle).
- Compteurs animés (année, applications en service), jauge de l'applaudimètre.

## Notes

- Clé API autorisée uniquement pour la voix et les bruitages (ElevenLabs). Pas d'image ni de musique générée.
- Ne pas révéler : aides croisées, stratégie, limites de travail en cours, écart lancer / livrer, montant du budget.
- Découpage validé : ../DECOUPAGE.md. Le ton de l'applaudimètre reste à valider par Martin.
- Régénérer la voix : `NODE_USE_ENV_PROXY=1 node scripts/vo.mjs`, puis `python3 scripts/words.py` et recaler les repères dans index.html.
