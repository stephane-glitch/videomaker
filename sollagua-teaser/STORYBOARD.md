---
format: 1920x1080
duration: 30s
message: "Quatre ans, cinq rôles, une seule rivière — et personne ne gagne seul."
arc: Territoire → L'eau recule → Les cinq rôles → Ce qui coûte → La mission
audience: Joueurs adultes, non spécialistes, juste avant de jouer
---

Décor unique : `public/board.webp`, une seule caméra continue (monolithe `index.html`).
Fondu enchaîné de 0,5 s entre plans sur les couches posées ; vignette + grain sur 30 s.
Bord crème du plateau assumé (décision du 13/10) : les coins peints restent visibles.

## Frame 1 — Le territoire

- scene: Lent avant sur la rivière haute, miroitement, pluie sous les nuages, titre SOLLAGUA
- duration: 6s
- poster: 4
- transition_in: cut
- status: animated
- voiceover: "Un tronçon de rivière, en Armagnac. Deux villages, quatre fermes, une seule eau."
- src: index.html

Rules: camera push (scale 1.15 → 1.07, power1.out), path-shimmer, plaque fade-up (0.7 s, power2.out).

## Frame 2 — L'eau recule

- scene: Étalonnage qui sèche, la rivière maigrit, le lit de galets remonte jusqu'au pont, pilules An 1→4
- duration: 6.4s
- poster: 11.8
- transition_in: crossfade
- status: animated
- voiceover: "Chaque hiver, la pluie en apporte moins. En quatre ans, il n'en reste qu'un tiers."
- src: index.html

Rules: continued push (1.07 → 1.03), grade ramp 6.4→11.4, counting (0.6 s, power2.out, no bounce).

## Frame 3 — Les cinq rôles

- scene: Recul, cinq médaillons amont → aval, « servie en premier », pointillé amont ▸ aval
- duration: 6.2s
- poster: 17.5
- transition_in: crossfade
- status: animated
- voiceover: "Vous êtes cinq à la partager. Quatre exploitations, et la commune, servie en premier."
- src: index.html

Rules: pull-back (1.03 → 1.14, power2.inOut), staggered hatch (0.45 s, one overshoot 1.06).

## Frame 4 — Ce qui coûte

- scene: Plateau voilé (55 %, flou 2 px), trois cartes 50 € · 60 000 € · 7/10
- duration: 6.2s
- poster: 23.5
- transition_in: crossfade
- status: animated
- voiceover: "L'eau s'achète. La recycler se décide à cinq. Personne ne gagne seul."
- src: index.html

Rules: camera hold, card rise (40 px, 0.55 s, power3.out, 0.28 s stagger), count to 60 000.

## Frame 5 — La mission

- scene: Le plateau se pose à 0.80 avec bordure et ombre, mission, logotype, partenaires
- duration: 5.2s
- poster: 29.7
- transition_in: crossfade
- status: animated
- voiceover: "Votre mission : traverser quatre années sans qu'aucune ferme ne tombe."
- src: index.html

Rules: settle (0.9 s, power3.inOut, no 3D), fade-ups, logos 0 → 0.92, last frame held 29.4 → 30.0.
