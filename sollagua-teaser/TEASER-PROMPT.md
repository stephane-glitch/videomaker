# Teaser Sollagua — 30 s · le prompt à coller

Ce fichier **est** le prompt. Il s'adresse à un agent qui a les skills
[HyperFrames](https://github.com/heygen-com/hyperframes) installés (`/hyperframes` doit répondre).

**Marche à suivre**

1. Ouvrir une session dans un dossier vide.
2. Y copier les cinq fichiers listés au § 2 (ils viennent de ce dépôt).
3. Coller tout ce qui se trouve entre les deux lignes `────` ci-dessous. Rien d'autre.

Le prompt est écrit pour être exécuté sans question : chaque champ que l'intent layer
d'HyperFrames demande d'habitude y est déjà répondu. L'agent ne devrait avoir à demander
que la validation du storyboard.

**Deux interrupteurs**, si besoin, à changer directement dans le texte collé :

| Pour…                                   | Changer                                |
| --------------------------------------- | -------------------------------------- |
| un rendu en un seul jet, sans relecture | `storyboard: yes` → `storyboard: no`   |
| construire plan par plan avec l'agent   | `flow: automation` → `flow: companion` |

---

────────────────────────────────────────────────────────────────────────────

Fais-moi un teaser vidéo de 30 secondes pour **Sollagua**, un jeu sérieux sur le partage de
l'eau. Il sera projeté **avant** la partie, en salle, devant cinq personnes qui vont jouer
juste après. Son travail : poser le territoire et la mission, en trente secondes, sans rien
expliquer des règles.

Tout est spécifié ci-dessous — concept, minutage, texte, voix, palette, sons. Ne me repose
pas les questions de cadrage : les réponses sont là. Le seul moment où j'attends ton avis,
c'est la relecture du storyboard.

## 0 · Le brief, déjà rempli

Écris exactement ce `BRIEF.md` à la racine du projet, juste après `hyperframes init` :

```markdown
---
workflow: general-video
flow: automation
storyboard: yes
message: "Quatre ans, cinq rôles, une seule rivière — et personne ne gagne seul."
destination: projection-salle
aspect: 1920x1080
language: fr
audience: "Joueurs adultes, non spécialistes, juste avant de jouer"
length: 30s
angle: narrative
---

## Intent

Teaser d'ouverture d'une séance de jeu sérieux sur la gestion collective de l'eau
(programme Interreg Sudoe). Projeté en salle, son juste avant la partie. Il doit faire
sentir deux choses : le territoire est beau et fini, et l'eau y recule d'année en année.
Ton : documentaire posé, chaleureux, un peu grave sur la fin — jamais publicitaire,
jamais anxiogène. On ne vend rien, on installe un monde.

L'univers graphique est **celui du jeu lui-même** : le plateau peint à l'aquarelle et à
l'encre que les joueurs auront sous les yeux dix secondes après la fin de la vidéo. C'est
la contrainte principale — tout ce qu'on ajoute doit avoir l'air posé sur cette peinture,
pas collé par-dessus.

## Assets

- public/board.webp — le plateau peint, 1672×941. C'est le décor unique des cinq plans.
- public/logos/\*.png — les cinq logos partenaires, pour le plan final uniquement.

## Customizations

- Voix off française générée en TTS, voix chaude et posée (§ 5).
- Nappe musicale sous la voix, avec carve pour que la voix reste au-dessus (§ 6).
- Compteurs chiffrés animés sur les quatre années de pluie (plan 2).

## Notes

- Aucun emoji dans le rendu : glyphes SVG dessinés à la main (§ 7).
- Les cinq chiffres cités sont des valeurs réelles du moteur du jeu : ne pas les arrondir,
  ne pas les inventer, ne pas en ajouter d'autres.
- Pas de sous-titres incrustés par défaut (§ 5, dernière ligne).
```

## 1 · Le format

|        |                                                          |
| ------ | -------------------------------------------------------- |
| Durée  | **30,0 s** exactement, dernière image tenue              |
| Format | 1920 × 1080, 30 fps, MP4 H.264                           |
| Son    | stéréo, 48 kHz, voix off française + nappe + 4 bruitages |
| Sortie | `out/sollagua-teaser.mp4`                                |

Le plateau fait 1672 × 941, soit **1,776** — pratiquement du 16/9 (1,778). Il remplit donc
le cadre à l'échelle 1,0 à deux pixels près. Conséquence directe : **tout mouvement de
caméra doit partir d'une échelle supérieure à 1**, sinon le bord crème de l'illustration
entre dans le champ. Aucun plan ne descend sous `scale(1.04)`.

## 2 · Les fichiers à copier avant de commencer

Ils viennent de `https://github.com/stephane-glitch/sollagua-demo` :

```
img/board.webp                              → public/board.webp
img/logos/interreg-sudoe-sollagua.png       → public/logos/interreg.png
img/logos/universite-toulouse.png           → public/logos/univ-toulouse.png
img/logos/imt-mines-ales.png                → public/logos/imt-mines-ales.png
img/logos/geode.png                         → public/logos/geode.png
img/logos/defis-cles-water-occitanie.png    → public/logos/defis-cles.png
```

**Ce que montre `board.webp`** — tu vas devoir t'y repérer au pixel, alors voici la carte :
vue aérienne aux trois quarts, aquarelle et encre, bordure crème aux bords déchirés. Une
rivière bleue tressée descend du haut au bas du cadre. Champs dorés et verts en damier,
rangées de peupliers, murets de pierre sèche, toits de tuile rouge. Deux villages, deux
stations d'épuration (bassins circulaires), deux grandes retenues rondes, un pont de
pierre en arc, une vigne en haut à droite, du tournesol et du maïs à gauche, des vaches en
haut à gauche, une mare à canards en bas à droite, une rose des vents gravée sur une
pierre en bas à gauche, deux nuages de pluie dans les coins hauts.

**Repères en pourcentage du cadre** (vérifie-les à l'œil sur un calque avant de t'en
servir — ils sont relevés à la main) :

| Élément                    | x    | y    |
| -------------------------- | ---- | ---- |
| Élevage bovin, bâtiments   | 16 % | 18 % |
| Vigne, maison de maître    | 77 % | 13 % |
| Damier de maïs, ferme      | 17 % | 50 % |
| Mare à canards, bâtiments  | 85 % | 79 % |
| Village principal, clocher | 70 % | 29 % |
| Second village             | 20 % | 70 % |
| STEP du village principal  | 67 % | 52 % |
| STEP du second village     | 22 % | 81 % |
| Retenue collective haute   | 53 % | 13 % |
| Retenue collective médiane | 51 % | 43 % |
| Pont de pierre             | 54 % | 61 % |
| Rose des vents             | 7 %  | 87 % |

**Axe de la rivière**, centre approximatif, en coordonnées image (viewBox `0 0 1672 941`) :

```
M 600,0  C 660,80 700,140 760,205
         C 820,270 865,300 872,340
         C 880,400 880,455 852,505
         C 900,545 900,560 900,578        ← le pont
         C 930,640 945,690 958,762
         C 972,830 982,880 988,941
```

Le tracé réel se tresse en deux bras vers le haut : ajuste. C'est de ce chemin que se
servent le miroitement du plan 1, le rétrécissement du plan 2 et la ligne amont‑aval du
plan 3 — définis-le **une seule fois** dans un `<defs>` et réutilise-le.

## 3 · Les cinq plans

Décor commun aux cinq : `board.webp` plein cadre. On ne coupe jamais ailleurs. Entre deux
plans, **fondu enchaîné de 0,5 s** — pas de cut franc, pas de volet, pas de glissement.

Au-dessus de tout, pour les trente secondes, deux couches fixes :

- **vignette** — dégradé radial, transparent au centre, `#3A3024` à 22 % dans les angles ;
- **grain** — bruit fin, opacité 5 %, animé image par image. Il recolle les éléments
  vectoriels sur la peinture : sans lui ils flottent au-dessus.

---

### Plan 1 — Le territoire · 0,0 → 6,0 s

**Caméra.** Lent avant sur la rivière haute. `scale 1.15 → 1.07`, origine `58 % 26 %`,
courbe `power1.out`, sur toute la durée du plan. Six secondes pour huit pour cent : on doit
sentir le mouvement sans pouvoir le suivre.

**Eau.** Le long du chemin de rivière, un dégradé blanc-bleu `#5BB5E8` de 180 px de long,
opacité 0,18, en masque sur le tracé, qui descend de l'amont vers l'aval en 5 s, une fois.
Pas de boucle : il part en haut, il sort en bas, c'est tout.

**Pluie.** Sur les deux nuages des coins hauts, deux nappes de pluie : traits de 3 px,
`#2C7FB8` à 35 %, inclinés de 8°, qui tombent sur 1,2 s en boucle, décalés l'un de l'autre
de 0,4 s pour ne pas battre ensemble.

**Titre**, apparition à 1,2 s, sortie à 5,4 s :

- Une plaque crème `#FBF4E2`, 22 px de rayon, 88 % d'opacité, ombre portée chaude
  `0 8px 28px rgba(80,60,30,.14)`, centrée, à 46 % de la hauteur.
- Dessus : **SOLLAGUA**, Fraunces 700, 92 px, interlettrage `0.18em`, `#3A3024`.
- À gauche du mot, la goutte SVG du § 7, 46 px, `#2C7FB8`.
- Entrée : opacité 0 → 1 et `translateY(14px) → 0` en 0,7 s, `power2.out`. Les lettres
  n'arrivent **pas** une par une — ce n'est pas un jeu vidéo.

**Sous-titre**, apparition à 2,6 s : « Armagnac · un tronçon de rivière », Nunito 600,
30 px, `#6B5D49`, sous la plaque, même entrée décalée.

---

### Plan 2 — L'eau recule · 6,0 → 12,4 s

Le plan le plus important : c'est lui qui installe la tension de toute la partie.

**Caméra.** Elle continue, sans à-coup : `scale 1.07 → 1.03`, même origine. La continuité
du mouvement par-dessus le fondu est ce qui fait croire que c'est le même territoire qui
se dégrade, et non une autre image.

**Étalonnage.** Sur 5 s, de 6,4 s à 11,4 s :

- une couche `multiply` passe de 0 à 0,32, dégradé de `#E0A82E` en haut vers `#B5705C`
  en bas ;
- `filter: saturate()` du plateau passe de 1,0 à 0,74 ;
- le vert des champs vire : une seconde couche, en `color` blend à 0,12, de `#B5705C`.

Objectif : **on doit pouvoir faire un arrêt sur image à 6,2 s et à 11,8 s et voir deux
saisons différentes**, sans que personne n'ait remarqué la transition en la regardant.

**La rivière maigrit.** Le tracé en `stroke` `#5BB5E8`, opacité 0,5, passe de 26 px à 9 px
de large sur les 5 mêmes secondes. En dessous, un masque révèle progressivement un
dégradé de galets gris-beige `#C9C0AC` qui remonte depuis le bas du cadre jusqu'au pont,
à 61 % de hauteur. Le lit à sec gagne du terrain vers l'amont.

**Les quatre années.** En bas à gauche, marge de 90 px, une pilule arrive toutes les
1,15 s à partir de 6,6 s. Les précédentes restent et remontent de 74 px à chaque fois.

| Arrivée | Texte           | Barre |
| ------- | --------------- | ----- |
| 6,60 s  | **An 1** · 70 u | 100 % |
| 7,75 s  | **An 2** · 55 u | 79 %  |
| 8,90 s  | **An 3** · 40 u | 57 %  |
| 10,05 s | **An 4** · 25 u | 36 %  |

Forme d'une pilule : plaque `#F5E9CD`, rayon 999 px, 20 px de haut de padding, l'intitulé
en Nunito 700 24 px `#6B5D49`, le nombre en Fraunces 700 40 px `#2C7FB8`. Sous chaque
pilule, une barre de 4 px de haut, `#2C7FB8`, largeur selon le tableau, qui se remplit de
gauche à droite en 0,5 s à l'arrivée.

Le nombre **compte** de 0 à sa valeur en 0,6 s (`power2.out`) — c'est la seule animation
chiffrée de la vidéo, elle doit rester discrète : pas de rebond, pas d'élastique.

> Ces quatre nombres sont la pluie totale de chaque année dans le moteur du jeu (hiver +
> été). Ils sont justes. Ne les change pas, n'en ajoute pas un cinquième, ne les mets pas
> en pourcentage.

---

### Plan 3 — Les cinq rôles · 12,4 → 18,6 s

**Caméra.** Recul franc : `scale 1.03 → 1.14` en 1,4 s, `power2.inOut`, puis immobile. On
reprend de la hauteur pour voir tout le monde. L'étalonnage du plan 2 **reste** — on ne
revient pas à la saison humide.

**Les médaillons.** Cinq, aux positions du § 2, qui éclosent dans l'ordre amont → aval,
0,3 s d'écart, à partir de 13,0 s :

| Ordre | Position    | Libellé                | Couleur de l'anneau |
| ----- | ----------- | ---------------------- | ------------------- |
| 1     | 16 % / 18 % | Élevage & céréales     | `#B5705C`           |
| 2     | 77 % / 13 % | Viticulture            | `#7B4B6B`           |
| 3     | 70 % / 29 % | La commune             | `#C77B6B`           |
| 4     | 17 % / 50 % | Grande culture de maïs | `#E0A82E`           |
| 5     | 85 % / 79 % | Granivore & volaille   | `#D98A3D`           |

Chaque médaillon : disque crème `#FBF4E2` de 104 px, anneau de 3 px à la couleur du rôle,
ombre `0 3px 12px rgba(80,60,30,.12)`, le glyphe SVG du § 7 au centre en 46 px à la
couleur de l'anneau. Dessous, sur une plaque crème à 92 % et 10 px de rayon, le libellé en
Nunito 700 22 px `#3A3024`.

Éclosion : `scale 0.5 → 1.06 → 1.0` et opacité 0 → 1 en 0,45 s. Un seul dépassement,
léger. Le libellé suit 0,12 s plus tard.

**La commune, servie en premier.** À 15,6 s, le médaillon de la commune pulse une fois
(`scale 1.0 → 1.05 → 1.0`, 0,5 s) et une étiquette apparaît à sa droite : « servie en
premier », Nunito 600 20 px, `#6B5D49`, sur plaque crème. C'est une vraie règle du jeu :
les villes prennent l'eau avant les exploitations. Elle disparaît avec le plan.

**Amont ▸ aval.** À 14,2 s, sur le chemin de rivière, un trait pointillé 2 px `#3A3024` à
40 %, `stroke-dasharray: 12 14`, dont le `stroke-dashoffset` défile vers l'aval, 26 px/s,
jusqu'à la fin du plan. À l'amont, le mot « amont » ; à l'aval, « aval » ; Nunito 600
19 px, `#6B5D49`. C'est l'ordre dans lequel les joueurs jouent.

---

### Plan 4 — Ce qui coûte · 18,6 → 24,8 s

**Fond.** Le plateau passe à 55 % d'opacité sur fond `#FBF4E2` et prend 2 px de flou, en
0,6 s. Les médaillons du plan 3 s'en vont en fondu sur 0,4 s. La caméra ne bouge plus :
après trois plans de mouvement, l'arrêt se remarque, et c'est l'effet voulu.

**Trois cartes** montent du bas, 0,28 s d'écart, à partir de 19,2 s. Chacune : 400 × 190,
crème `#FBF4E2`, rayon 18 px, ombre chaude, alignées horizontalement, 48 px entre elles,
centrées à 52 % de hauteur. Entrée `translateY(40px) → 0` + opacité, 0,55 s, `power3.out`.

| Carte | Ligne haute (Fraunces 700 46 px `#2C7FB8`) | Ligne basse (Nunito 600 22 px `#6B5D49`) |
| ----- | ------------------------------------------ | ---------------------------------------- |
| 1     | 50 €                                       | l'unité d'eau                            |
| 2     | 60 000 €                                   | recycler — à l'unanimité des cinq        |
| 3     | 7 / 10                                     | la biodiversité, au départ               |

Pour la carte 2, `60 000` compte de 0 à 60 000 en 0,8 s à partir de 20,0 s, séparateur
d'espace fine insécable, puis le `€`.

> Ces trois nombres aussi sont ceux du moteur : l'eau collective est à 50 € l'unité, la
> REUT coûte 60 000 € et exige l'accord des cinq joueurs, la biodiversité démarre à 7 sur
> une échelle de 10. « REUT » ne doit **pas** apparaître à l'écran : le mot n'a aucun sens
> pour quelqu'un qui n'a pas encore joué. « Recycler » suffit.

---

### Plan 5 — La mission · 24,8 → 30,0 s

**Le plateau se pose.** En 0,9 s à partir de 24,8 s, il reprend sa pleine opacité, perd son
flou, et passe de `scale 1.14` à `scale 0.80` en se centrant, avec l'apparition d'une
bordure crème de 28 px et d'une ombre portée large `0 24px 70px rgba(80,60,30,.22)`.
L'image devient un objet posé sur la table. `power3.inOut`, pas de rotation 3D, pas de
perspective — une carte qu'on pose à plat.

**La mission**, de 25,9 s à la fin, par-dessus, dans le tiers bas :

> **Traverser quatre années sans qu'aucune ferme ne tombe.**

Fraunces 600, 56 px, `#3A3024`, centré, sur plaque crème à 94 %, rayon 18 px, padding
28 × 44. Entrée en opacité + `translateY(16px)` sur 0,6 s.

**Le logotype**, à 27,4 s, au-dessus de la mission : la goutte + **SOLLAGUA** (Fraunces 700
64 px, interlettrage `0.18em`) et dessous, en Nunito 600 26 px `#6B5D49` :

> Le jeu sérieux de l'eau partagée

**Les partenaires**, à 28,5 s, en pied de cadre, marge basse 56 px : les cinq PNG alignés,
hauteur 52 px, 44 px d'écart, opacité 0 → 0,92 en 0,5 s. Ordre imposé :
`interreg` · `univ-toulouse` · `imt-mines-ales` · `geode` · `defis-cles`.

**Dernière image tenue** de 29,4 s à 30,0 s, immobile et complète.

## 4 · Le texte dit

Voix off française, cinq phrases. **Les fenêtres sont fermes** : la vidéo ne s'allonge pas
pour loger la voix, c'est la voix qui tient dedans. Soixante-quatre mots, environ
150 mots/minute.

| #   | Fenêtre       | Texte                                                                                 | Mots |
| --- | ------------- | ------------------------------------------------------------------------------------- | ---- |
| 1   | 0,6 → 5,6 s   | Un tronçon de rivière, en Armagnac. Deux villages, quatre fermes, une seule eau.      | 13   |
| 2   | 6,4 → 12,0 s  | Chaque hiver, la pluie en apporte moins. En quatre ans, il n'en reste qu'un tiers.    | 15   |
| 3   | 12,9 → 18,2 s | Vous êtes cinq à la partager. Quatre exploitations, et la commune, servie en premier. | 14   |
| 4   | 19,0 → 24,4 s | L'eau s'achète. La recycler se décide à cinq. Personne ne gagne seul.                 | 12   |
| 5   | 25,3 → 29,3 s | Votre mission : traverser quatre années sans qu'aucune ferme ne tombe.                | 10   |

Si une ligne déborde de sa fenêtre après génération : **ralentis ou accélère le TTS de 2 à
4 %**, ne réécris pas le texte et ne décale pas l'image. Si le débord passe 6 %, dis-le
moi, je raccourcirai la phrase moi-même.

Les silences entre les lignes sont voulus : 0,8 s, 0,9 s, 0,8 s, 0,9 s. C'est ce qui donne
le ton documentaire plutôt que le ton de la publicité.

## 5 · La voix

- **Français de France**, adulte, timbre chaud, grave médium, débit posé.
- Registre : documentaire animalier, conteur — **pas** voix de bande-annonce, pas de
  souffle dramatique, pas de montée finale. Le texte est déjà grave, la voix ne doit pas
  en rajouter.
- Articulation nette : la salle sera bruyante et l'enceinte moyenne.
- Phrase 5 un ton en dessous des autres, légèrement plus lente. C'est la seule inflexion
  de toute la bande.
- Niveau : −16 LUFS sur la voix.

Génère-la via `/media-use`. Choisis la voix toi-même, mais **fais-moi écouter deux
candidates** sur la phrase 2 avant de produire les cinq.

_Sous-titres_ : aucun incrusté par défaut. Produis en plus `out/sollagua-teaser.fr.vtt`
calé sur les fenêtres ci-dessus, que je puisse les activer si la salle est bruyante.

## 6 · Le son

**Nappe musicale**, sur les 30 s, −23 LUFS, avec carve sur les bandes de la voix
(`/hyperframes-audio`) :

- cordes tenues et piano clairsemé, 70–76 bpm, tonalité majeure teintée de mélancolie ;
- 0 → 6 s : une seule nappe, presque rien ;
- 6 → 12,4 s : une note basse s'installe, la tension monte sans percussion ;
- 12,4 → 18,6 s : un motif de piano léger, le monde se peuple ;
- 18,6 → 24,8 s : tout se retire sauf la basse — c'est le creux de la bande ;
- 24,8 → 30 s : résolution, les cordes reviennent, dernier accord tenu sous la dernière
  image.

**Pas de batterie, pas de percussion, aucun temps marqué.** Pas de montée vers un
« drop ». Si la bibliothèque n'a rien de tel, génère la nappe.

**Quatre bruitages seulement**, discrets, −30 LUFS :

| À      | Quoi                                                          |
| ------ | ------------------------------------------------------------- |
| 0,4 s  | filet d'eau sur galets, 3 s, fondu sortant                    |
| 7,6 s  | vent sec dans l'herbe, 4 s                                    |
| 24,9 s | pose d'un carton épais sur une table — le plateau qui se pose |
| 28,6 s | une note de cloche douce, courte, sous le logotype            |

## 7 · Typographie, couleurs, glyphes

**Polices** — ce sont celles du jeu. **Embarque les fichiers** dans le projet et déclare-les
en `@font-face` : ne dépends pas d'un CDN au moment du rendu, sinon la fonte peut manquer
sur une image et pas sur la suivante.

- Titres : **Fraunces** (Google Fonts), graisses 600 et 700
- Textes : **Nunito** (Google Fonts), graisses 600 et 700

**Couleurs** — à déclarer en variables CSS, ce sont exactement celles de `css/style.css` :

```css
--cream: #fbf4e2;
--cream-2: #f5e9cd;
--ink: #3a3024;
--ink-soft: #6b5d49;
--water: #2c7fb8;
--water-light: #5bb5e8;
--green: #7e9a52;
--green-deep: #5e7a3a;
--gold: #e0a82e;
--clay: #b5705c;
--wine: #7b4b6b;
--duck: #d98a3d;
--town: #c77b6b;
--shadow: 0 8px 28px rgba(80, 60, 30, 0.14);
--shadow-sm: 0 3px 12px rgba(80, 60, 30, 0.12);
--radius: 18px;
```

**Glyphes — aucun emoji.** Le rendu passe par un Chromium sans fonte emoji garantie : un
caractère manquant donne un rectangle, et on ne s'en aperçoit qu'au montage. Dessine six
pictogrammes SVG, trait de 2 px, coins arrondis, dans une grille de 24 × 24, monochromes
(ils héritent de `currentColor`) :

| Pour                   | Dessin                                   |
| ---------------------- | ---------------------------------------- |
| la goutte du logotype  | goutte pleine, pointe en haut            |
| élevage & céréales     | tête de bovin de face, deux cornes       |
| viticulture            | grappe, cinq grains et une feuille       |
| grande culture de maïs | épi debout, deux feuilles                |
| granivore & volaille   | canard de profil, bec et œil             |
| la commune             | clocher à toit pointu, une horloge ronde |

Style commun : contour seul, pas d'aplat, pas de dégradé — ils doivent avoir l'air gravés,
comme la rose des vents du plateau.

## 8 · Ce que je ne veux pas

- **Aucun plan ailleurs que sur le plateau.** Pas d'illustration générée, pas de photo, pas
  de vidéo d'archive, pas de visage. Le décor est unique, c'est le parti pris.
- **Aucun mouvement rapide.** Pas de zoom brusque, pas de whip pan, pas de glitch, pas de
  secousse. La chose la plus vive de la vidéo est l'éclosion d'un médaillon, en 0,45 s.
- **Aucun vocabulaire du jeu** à l'écran ou dans la voix : ni REUT, ni STEP, ni eau bleue,
  ni eau rouge, ni unité, ni biodiversité comme score. On parle d'eau, de fermes, de
  villages, de pluie. Seule exception, les quatre pilules du plan 2 qui portent « u » après
  le nombre — et c'est assez pour que les joueurs reconnaissent l'unité une fois en jeu.
- **Aucune règle expliquée.** Le teaser pose une situation, pas une notice. Si tu te
  surprends à vouloir ajouter une explication, c'est qu'il manque un silence.
- **Pas de typographie animée lettre par lettre**, pas de compteur qui rebondit, pas
  d'ombre portée noire — toutes les ombres sont brunes et chaudes.
- **Pas de musique sous licence inconnue.** Nappe générée ou catalogue libre, dis-moi
  laquelle et d'où elle vient.

## 9 · La recette de fabrication

Dans cet ordre, c'est important :

1. `hyperframes init`, puis `BRIEF.md` du § 0 **avant toute autre chose**.
2. Copie des six fichiers du § 2. Vérifie que `board.webp` s'ouvre et fait bien 1672 × 941.
3. **Calque de repérage** : affiche le plateau avec une grille en pourcentages par-dessus
   et contrôle les douze repères du § 2 ainsi que le tracé de la rivière. Corrige-les dans
   ton storyboard avant d'animer quoi que ce soit — tout le plan 3 en dépend, et un
   médaillon posé dans un champ au lieu d'une ferme se voit immédiatement.
4. Storyboard : les cinq plans en vignettes statiques, avec les textes en place. **C'est
   là que je relis.**
5. Mise en page statique des cinq plans, sans animation. Vérifie les marges de sécurité :
   rien d'important à moins de 80 px d'un bord, la salle aura un vidéoprojecteur mal calé.
6. Animation, plan par plan, dans l'ordre. Chaque plan doit être seekable : contrôle en
   posant la tête de lecture au hasard, l'image doit être juste à l'arrêt comme en lecture.
7. Voix off : deux candidates sur la phrase 2, puis les cinq lignes.
8. Nappe et bruitages, carve de la voix, mesure des niveaux.
9. `hyperframes check`, puis `preview`. Montre-le-moi avant le rendu final.
10. Rendu, et donne-moi la durée exacte du fichier produit.

## 10 · La relecture, avant de me livrer

Passe cette liste et dis-moi pour chaque ligne si c'est oui ou non. Ne me livre pas avec
une case à non sans me l'avoir dit.

- [ ] La vidéo fait 30,0 s ± 0,2 s.
- [ ] Les cinq phrases tiennent dans leurs fenêtres sans chevaucher.
- [ ] À aucune image le bord crème de l'illustration n'entre dans le cadre.
- [ ] Les nombres à l'écran sont exactement : 70, 55, 40, 25, 50 €, 60 000 €, 7/10.
- [ ] Aucun caractère emoji dans le DOM rendu.
- [ ] Les cinq médaillons tombent sur le bon élément peint — vérifié à l'arrêt sur image.
- [ ] Les cinq logos sont nets, à la même hauteur, dans l'ordre imposé.
- [ ] Voix à −16 LUFS, nappe à −23, bruitages à −30 ; rien ne sature.
- [ ] Mis en pause à dix endroits au hasard, l'image est toujours correcte.
- [ ] Le fichier `.vtt` existe et est calé.

Et dis-moi, en une ligne chacune : la voix retenue, l'origine de la musique, et tout
endroit où tu as dû t'écarter de cette spécification.

────────────────────────────────────────────────────────────────────────────

---

## Pour mémoire — d'où viennent les chiffres

Tout ce que le teaser affiche est vérifié dans le moteur, pour qu'un joueur ne découvre pas
un démenti trente secondes plus tard :

| Affiché                              | Source                                                                                                |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| 70 · 55 · 40 · 25 u                  | `RAINFALL` dans `js/data.js` : hiver + été de chaque année (50+20, 40+15, 30+10, 20+5)                |
| « il n'en reste qu'un tiers »        | 25 / 70 = 36 %                                                                                        |
| quatre fermes, une commune           | `ROLES` : `agri1` à `agri4` + `town` ; le gestionnaire de l'eau est automatisé                        |
| « servie en premier »                | `beginCycle` : les villes sont servies sur l'eau collective avant toute irrigation                    |
| 50 € l'unité                         | `CFG.waterPrice`                                                                                      |
| 60 000 €, à l'unanimité des cinq     | `CFG.reutTotalCost` ; la REUT exige les 5 voix                                                        |
| 7 / 10                               | `CFG.bioStart`, échelle `CFG.bioMax`                                                                  |
| quatre années                        | `CFG.cycles`                                                                                          |
| « Le jeu sérieux de l'eau partagée » | `I18N.fr.tagline`                                                                                     |
| amont ▸ aval                         | `playOrder` : retenue 1 → agri1 → agri2 → Ville 1 → STEP → retenue 2 → agri3 → Ville 2 → STEP → agri4 |

Les couleurs des cinq rôles sont les `color` de `ROLES` dans `js/data.js`, et la palette
générale celle de `:root` dans `css/style.css` — le teaser et le jeu partagent la même.

## Les trois autres langues

Les images ne portent presque pas de texte : seuls le plan 2 (« An 1 »…), le plan 4 et le
plan 5 en ont. Une version espagnole, anglaise ou portugaise se fait donc en refaisant la
bande son et quatre cartons, sans retoucher l'animation. Les traductions existent déjà dans
`js/i18n.js` pour la signature (`tagline`) ; le reste du texte du teaser est propre à la
vidéo et resterait à écrire.
