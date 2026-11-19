# Kidi-science — à lire en premier

> **Reprise le 19/11/2026** à la demande de l'utilisateur : la vidéo de l'épisode 1 est produite dans `ep01-voiture/video/` (voir sa section ci-dessous).

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

## Vidéo de l'épisode 1 (19/11/2026)

Projet HyperFrames : `ep01-voiture/video/`. Durée 4 min 46, 1920×1080, 30 i/s.

- **Assemblage** : `node scripts/build.mjs` reconstruit `index.html` à partir de `src/`
  (scènes dans `src/scenes/`, scripts dans `src/js/`). Le calendrier du film est calculé
  d'après la durée réelle de chaque réplique ; les animations sont calées sur les mots
  (`cue("réplique", "mot")`). **Ne pas modifier `index.html` à la main.**
- **Voix** : ElevenLabs, modèle eleven_v3, une réplique par fichier (`scripts/vo.mjs`,
  à lancer avec `NODE_USE_ENV_PROXY=1`). Zoé = « Morgane » (`ZYOBieLaunTiQrTrvNQq`),
  Max = « Antoine » (`nbiTBaMRdSobTQJDzIWm`). Choisies sans écoute : à faire valider.
- **Bruitages et jingle** : ElevenLabs (`scripts/sfx.sh`), placés dans `src/sfx.json`.
  Pas de musique de fond.
- **Mécanismes** : dessinés image par image à partir du temps (fonctions pures), avec la
  vraie cinématique (bielle-manivelle, rapports d'engrenages, crémaillère).
  Seul le cylindre est en vue isométrique ; les autres mécanismes sont en coupe à plat.
- **Rendu** : `npx hyperframes render` depuis `ep01-voiture/video/` (le MP4 n'est pas dans le dépôt).

## Épisodes 2 à 7 (19/11/2026, produits en autonomie)

Consigne de l'utilisateur : un peu d'humour dans les échanges, et une Zoé plus maligne (elle devine, elle résume, elle a souvent le dernier mot).

| Épisode | Dossier                   | Durée | Annonce en fin d'épisode      |
| ------- | ------------------------- | ----- | ----------------------------- |
| 2       | `ep02-atomes/video/`      | 3:50  | l'électricité                 |
| 3       | `ep03-electricite/video/` | 3:56  | la gravité                    |
| 4       | `ep04-gravite/video/`     | 3:54  | le son                        |
| 5       | `ep05-son/video/`         | 3:23  | la lumière                    |
| 6       | `ep06-lumiere/video/`     | 3:37  | les allergies                 |
| 7       | `ep07-allergies/video/`   | 3:12  | « Envoie-nous ta question ! » |

Chaque épisode se fabrique de la même façon (détails dans `TECHNIQUE.md`) :

1. `src/dialogue.json` → `node scripts/vo.mjs` (voix) → `python3 -I scripts/checkvo.py` (vérifie ce qui est réellement prononcé).
2. `src/config.json` (rythme), `src/scenes/sN.html` + `src/js/sN.js` (une scène = un dessin calculé en fonction du temps), `src/sfx.json` (bruitages).
3. `node scripts/build.mjs` assemble `index.html` (ne jamais le modifier à la main), puis `npx hyperframes check`, `snapshot`, `render`.
4. `python3 -I ../../qa.py renders/x.mp4 <dossier>` : durée, niveau sonore, texte entendu, planche-contact.

Points laissés ouverts : les voix n'ont pas été écoutées par l'utilisateur avant production ; pas de musique de fond ; la fin de l'épisode 1 annonce « l'essence », pas « les atomes ».
