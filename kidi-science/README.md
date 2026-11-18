# Kidi-science — à lire en premier

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
- Personnages, voix, générique : décidés (voir `SERIE.md`).
- **Production : pas commencée.** L'utilisateur lance lui-même la création
  (session suivante). Ne rien rendre ni générer de payant sans son signal.

## Prochaine étape prévue

1. Écrire le texte complet du dialogue (Zoé / Max) scène par scène, ~650 mots,
   et le faire relire **avant** de produire la voix.
2. Choisir les deux voix ElevenLabs (écoute de quelques échantillons courts).
3. Puis `/hyperframes` → workflow `/general-video` (5 min dépasse le plafond
   ~3 min des workflows spécialisés), avec storyboard relu avant le build.
   Le `BRIEF.md` à poser après `hyperframes init` est rédigé dans `EPISODE.md`.

## Branche

Ce travail vit sur la branche `claude/kind-bell-fnlopb`. Une nouvelle session
qui démarre sur `main` ne le verra pas : partir de cette branche (ou la fusionner).
