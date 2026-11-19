# Kidi-science — à lire en premier

> **En pause depuis le 19/11/2026** à la demande de l'utilisateur (autre projet prioritaire : `mission-flow/`). Ne pas reprendre sans son accord.

Chaîne YouTube de sciences expliquées aux enfants (~10 ans), en français.
Ce dossier contient tout ce qui a été décidé avec l'utilisateur avant la
production. **Rien n'est à redemander** : les décisions ci-dessous sont
confirmées.

| Fichier                                                | Contenu                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [`SERIE.md`](SERIE.md)                                 | La « bible » de la série : format, voix, style visuel validé, générique, règles d'animation |
| [`ep01-voiture/EPISODE.md`](ep01-voiture/EPISODE.md)   | Épisode 1 « la voiture » : découpage scène par scène + brouillon de `BRIEF.md`              |
| [`TECHNIQUE.md`](TECHNIQUE.md)                         | Ce qu'on a appris des dépôts de référence, règles chiffrées, pièges de l'environnement      |
| [`ep01-voiture/style-test/`](ep01-voiture/style-test/) | Image de test **validée** (moteur à essence en coupe) et son code                           |
| [`fonts/`](fonts/)                                     | Police Fredoka (OFL), embarquée localement                                                  |

## État au 18/11/2026

- Recherche technique : faite (voir `TECHNIQUE.md`).
- Style visuel : **validé** par l'utilisateur sur `ep01-voiture/style-test/style-test.jpg`.
- Découpage de l'épisode 1 : validé dans ses grandes lignes (8 scènes, voir `EPISODE.md`).
- Dialogue de l'épisode 1 : écrit le 19/11 (`ep01-voiture/DIALOGUE.md`), avec repères visuels.
- Personnages, voix, générique : décidés (voir `SERIE.md`).
- **Production : pas commencée.** L'utilisateur lance lui-même la création
  (session suivante). Ne rien rendre ni générer de payant sans son signal.

## Prochaine étape prévue

1. Le dialogue complet est écrit : [`ep01-voiture/DIALOGUE.md`](ep01-voiture/DIALOGUE.md)
   (version 1, 664 mots, ≈ 4 min 50). La production de la vidéo est confiée à la
   session suivante ; signaler à l'utilisateur toute réplique modifiée.
2. Choisir les deux voix ElevenLabs (écoute de quelques échantillons courts).
3. Puis `/hyperframes` → workflow `/general-video` (5 min dépasse le plafond
   ~3 min des workflows spécialisés), avec storyboard relu avant le build.
   Le `BRIEF.md` à poser après `hyperframes init` est rédigé dans `EPISODE.md`.

## Branche

Ce travail est sur `main` (fusionné le 19/11 depuis `claude/kind-bell-fnlopb`).
