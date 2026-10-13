---
workflow: general-video
flow: automation
storyboard: no
message: "Une seule lumière dessine l'évolution humaine, du premier pas au feu, jusqu'à nous."
aspect: 1920x1080
language: fr
length: 30s
angle: narrative
---

## Intent

Prompt de départ (fourni par l'utilisateur) : « Make a storyline about the evolution of humans
with a single point of light that draws the sequence. The trails hang in 3D and the camera
follows them, shot like long-exposure photography with haze, soft blur and a wet floor. »
Référence visuelle : silhouettes en contour lumineux chaud sur fond sombre (rideau), sol
mouillé qui reflète, une torche.

## Customizations

- Scène Three.js (bloom, brouillard, sol réfléchissant), silhouettes générées par
  `tools/figures.py` (poses en capsules → contour).
- Musique et bruitages générés avec ElevenLabs. Pas de voix, pas de texte.
