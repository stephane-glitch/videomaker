# Épisode 1 — Comment marche une voiture ?

Titre définitif : **pas encore choisi**.
Contenu validé par l'utilisateur : moteur à essence **et** moteur électrique,
transmission, direction, **freins gardés**. Il faut **voir les pièces en mouvement**.

## Découpage (~5 min, ~650 mots de dialogue)

Le générique « boîte à questions » (≈5 s, voir `../SERIE.md`) précède la scène 0 ;
son dernier objet est une petite voiture.

| #   | Temps     | Scène                  | Question de Zoé (proposée)                                         | Ce qu'on voit bouger                                                                                       | Idée à retenir                                                                                              |
| --- | --------- | ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 0   | 0:00–0:20 | Accroche               | « Quand on appuie sur la pédale, pourquoi la voiture avance ? »    | Une voiture roule, puis devient transparente                                                               | Il se passe plein de choses dedans                                                                          |
| 1   | 0:20–0:50 | La carte de la voiture | « Il y a quoi sous le capot ? »                                    | La voiture s'éclate en familles colorées : énergie, moteur, transmission, roues, direction, freins         | Une voiture est une chaîne qui transforme l'énergie en mouvement                                            |
| 2   | 0:50–1:50 | Moteur à essence       | « Ça brûle vraiment, dans le moteur ? »                            | Un cylindre en coupe fait ses 4 temps ; la bielle fait tourner le vilebrequin ; puis 4 cylindres en décalé | « Aspire, serre, boum, recrache ». Comme les jambes sur les pédales d'un vélo : le haut-bas devient un tour |
| 3   | 1:50–2:40 | Moteur électrique      | « Et les voitures électriques, elles n'ont pas de feu ? »          | La batterie envoie le courant (jaune), les aimants s'attirent et se repoussent, le rotor tourne            | Des aimants qui se courent après. Moins de pièces, silencieux ; au freinage il recharge un peu la batterie  |
| 4   | 2:40–3:30 | Transmission           | « Pourquoi on change de vitesse ? » puis « Et dans les virages ? » | Boîte de vitesses (petit / grand engrenage) ; puis le différentiel dans un virage                          | Comme les vitesses d'un vélo. Dans un virage, la roue extérieure fait plus de chemin, donc tourne plus vite |
| 5   | 3:30–4:05 | Direction              | « Comment le volant tourne les roues ? »                           | Volant → colonne → pignon sur crémaillère → les roues avant pivotent                                       | Un engrenage rond qui pousse une barre droite                                                               |
| 6   | 4:05–4:35 | Freins                 | « Et pour s'arrêter ? »                                            | Pédale → liquide → les plaquettes pincent le disque, chaleur (orange)                                      | Freiner, c'est transformer le mouvement en chaleur                                                          |
| 7   | 4:35–5:00 | Récap + teaser         | « Alors c'est comme une chaîne ! »                                 | Le trajet complet de l'énergie en couleurs, réservoir/batterie → roues ; annonce du prochain épisode       | La chaîne en une phrase                                                                                     |

Scène la plus lourde : la 2 (la plus spectaculaire et la plus dure à expliquer).
Son état « Boum » existe déjà en image fixe : `style-test/` (angle vilebrequin 60°
après le point mort haut, piston calculé par bielle-manivelle).

Le texte complet est dans [`DIALOGUE.md`](DIALOGUE.md). La question finale de
Zoé (« l'essence, elle vient d'où ? ») est une proposition de teaser : à adapter
au sujet réellement prévu pour l'épisode 2.

## Brouillon de `BRIEF.md`

À écrire dans le projet HyperFrames **juste après** `hyperframes init` (init refuse
un dossier non vide). Projet prévu : `kidi-science/ep01-voiture/video/`.

```markdown
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
angle: concept
voice: elevenlabs
---

## Intent

Premier épisode de la série Kidi-science : comment marche une voiture (moteur à
essence et électrique, transmission, direction, freins), expliqué à des enfants
de ~10 ans par un dialogue en voix off entre Zoé (enfant, pose les questions) et
Max (adulte bienveillant, répond). On doit voir les pièces de la voiture en mouvement.

## Assets

- kidi-science/ep01-voiture/style-test/ — image de style validée et son code (géométrie réutilisable).
- kidi-science/fonts/ — Fredoka 500/600/700.

## Customizations

- Générique « boîte à questions » (~5 s) en ouverture, dernier objet = une voiture.
- Barre des 4 temps en bas pendant la scène du moteur à essence.
- Étiquettes qui apparaissent une par une au fil de la voix.

## Notes

- Personnages jamais visibles, pas de bulles de dialogue : tout l'effort sur l'animation des pièces.
- Style et palette : `kidi-science/SERIE.md` (validé, ne pas réinventer).
- Découpage : `kidi-science/ep01-voiture/EPISODE.md`.
- Texte du dialogue : `kidi-science/ep01-voiture/DIALOGUE.md` (repères visuels entre crochets).
```
