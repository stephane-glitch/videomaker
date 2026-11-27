# Kidi-science — bible de la série

Décisions confirmées par l'utilisateur (18/11/2026), sauf mention « proposé ».

## Format

- **Chaîne** : Kidi-science (YouTube).
- **Public** : enfants d'environ 10 ans.
- **Langue** : français.
- **Image** : 16:9, 1920×1080.
- **Durée** : 5 minutes maximum par épisode.
- **Sujets prévus** : la voiture (épisode 1), puis chimie, atomes, allergies,
  gravité, et beaucoup d'autres. Tout ce qui est « commun » doit donc rester
  indépendant du sujet.

## Narration : un dialogue en voix off

- Un **enfant** pose les questions, un **adulte bienveillant** répond.
- **Zoé** = l'enfant, **Max** = l'adulte. (Prénoms acceptés par l'utilisateur ;
  l'attribution enfant/adulte suit l'ordre où ils ont été proposés.)
- Voix générées avec **ElevenLabs** (voir `TECHNIQUE.md` pour les voix candidates).
- **On ne voit pas les personnages à l'écran. Pas de bulles de dialogue.**
  Tout l'effort visuel va à **l'animation des pièces**.
- L'enfant ouvre chaque scène par une question, et revient au milieu pour une
  réaction ou une question naïve (relance de l'attention sur 5 min).
- Débit visé : ~2,3 mots/s (plus lent qu'un explainer adulte) → ~650 mots pour 5 min.

## Style visuel (validé)

Référence : `ep01-voiture/style-test/style-test.jpg` (code : `build.mjs`).
Inspiré du dépôt `wheresryan22/anatomy` (« l'objet est l'explication » : on
montre la vraie machine en coupe, pas des boîtes et des flèches), rendu plus
chaleureux et plus simple pour des enfants.

- **Perspective** : isométrique / axonométrique en SVG, azimut −28°, élévation 24°.
- **Vues en coupe** : les faces coupées sont **beige hachuré** (`#F6E7C8`,
  hachures `#E6CF9F` à 45°), comme dans un livre d'école.
- **Trait** : contour bleu nuit `#1F2A44`, 3 px, joints arrondis. Pas de noir pur.
- **Fond** : papier crème `#FFF8EC` (dégradé radial léger vers `#FCEFD9`),
  trame de points très discrète.
- **Moins de pièces, plus grosses** : 20 à 40 pièces par mécanisme.
- **Couleurs par fonction — identiques dans toute la série** :

| Couleur         | Sens                           | Valeurs                                               |
| --------------- | ------------------------------ | ----------------------------------------------------- |
| Bleu foncé      | pièces qui bougent             | `#2F5BD3`, clair `#5F86F0`, ombre `#1E3F9E`           |
| Orange          | feu, carburant, chaleur        | `#FF8A1F`, chaud `#FFD23F`                            |
| Jaune           | électricité                    | `#FFE14D`                                             |
| Bleu clair      | air                            | `#8FD3FF`                                             |
| Gris            | fumées, déchets                | `#A7AFBA`                                             |
| Gris-bleu clair | structure fixe (carter, bloc…) | dessus `#F4F6FA`, côté `#D3DAE6`, intérieur `#B9C3D3` |

- **Typo** : Fredoka (OFL, fichiers dans `fonts/`). Étiquettes 38 px graisse 600,
  sous-titre 27 px graisse 500 `#55607A`. Mots d'enfant (« fait une étincelle »,
  « est poussé vers le bas »).
- **Étiquettes** : un point blanc cerclé sur la pièce + un trait fin vers le texte.
  En vidéo, elles **apparaissent une par une au fil de la voix**, jamais toutes d'un coup.
- **Habillage fixe** : pastille blanche « Kidi-science » en haut à gauche
  (« Kidi » bleu nuit, « - » orange, « science » bleu) ; pastille bleu nuit
  du chapitre en haut à droite.
- **Fil rouge par mécanisme** : une barre d'étapes en bas (ex. les 4 temps
  « 1 Aspire · 2 Serre · 3 Boum ! · 4 Recrache »), l'étape en cours remplie de sa couleur.
- **À éviter** : images générées par IA pour les pièces mobiles (incohérentes
  d'un plan à l'autre, impossibles à faire tourner juste).

## Règles d'animation propres à la série

- **La mécanique est calculée, pas mimée.** Exemple : la position du piston
  découle du vrai calcul bielle-manivelle à partir de l'angle du vilebrequin ;
  les engrenages tournent dans le rapport de leurs dents. Tout est fonction du
  temps (déterministe, seekable).
- **La couleur suit l'énergie** : l'enfant doit pouvoir suivre l'orange (ou le
  jaune) du réservoir (ou de la batterie) jusqu'aux roues.
- **L'image arrive 4 à 8 images avant le mot** qui la nomme.
- **Quelque chose change à l'écran toutes les 1 à 3 s** (révélation, mouvement
  de caméra, pièce qui agit) — mais pas d'animation « qui respire » pour meubler.
- **Mouvement de caméra avec intention** : on part de la voiture entière, on
  plonge dans la pièce, on la fait fonctionner, on ressort.
- Voir aussi la doctrine maison `.claude/skills/motion-doctrine` (une direction
  dominante, pas de fondus enchaînés entre scènes, pause de 0,3–0,75 s avant un
  moment fort).

## Générique (validé) : « La boîte à questions », ~5 s

1. Fond crème, une boîte fermée dans le style isométrique de la série.
   Voix de Zoé : « Dis… comment ça marche ? »
2. La boîte s'ouvre ; des petits objets de tous les thèmes en jaillissent, chacun
   dans sa couleur de fonction : un engrenage, un atome, une goutte, une pomme
   qui tombe, un grain de pollen.
3. Ils retombent et s'assemblent en logo **Kidi-science**, sur un jingle de 4 notes.
4. Le **dernier objet** à sortir est toujours le sujet de l'épisode (ép. 1 : une
   petite voiture) et la caméra plonge dedans pour commencer l'épisode.

Musique et bruitages du générique : à générer avec ElevenLabs (musique / SFX).
Le générique doit être construit une fois comme composant réutilisable, avec
l'objet final en paramètre.

## Prochains sujets (proposés le 20/11/2026, à valider par l'utilisateur)

Demandés : **le feu**, **l'eau de mer (pourquoi elle est salée)**, et **une vidéo par sens** (l'ouïe est déjà couverte par l'épisode 5 « le son »).

| Série        | Sujet                           | La question de Zoé                       |
| ------------ | ------------------------------- | ---------------------------------------- |
| Demandé      | Le feu                          | C'est quoi, une flamme ?                 |
| Demandé      | L'eau de mer                    | Pourquoi la mer est salée ?              |
| Les sens     | La vue                          | Comment mes yeux voient ?                |
| Les sens     | L'odorat                        | Comment je sens les odeurs ?             |
| Les sens     | Le goût                         | Pourquoi le citron pique ?               |
| Les sens     | Le toucher                      | Comment je sens le chaud et le froid ?   |
| Le corps     | Le cœur et le sang              | Pourquoi mon cœur bat ?                  |
| Le corps     | La digestion                    | Où va ce que je mange ?                  |
| Le corps     | Le sommeil                      | Pourquoi on dort ?                       |
| La Terre     | Les volcans                     | Pourquoi les volcans crachent du feu ?   |
| La Terre     | La pluie et les nuages          | D'où vient la pluie ?                    |
| La Terre     | Les saisons                     | Pourquoi il fait froid en hiver ?        |
| L'espace     | La Lune                         | Pourquoi la Lune change de forme ?       |
| L'espace     | Le Soleil et les étoiles        | C'est quoi, une étoile ?                 |
| Les machines | L'avion                         | Comment un avion tient en l'air ?        |
| Les machines | Internet                        | Comment une vidéo arrive sur mon écran ? |
| Les machines | L'aimant                        | Pourquoi les aimants collent ?           |
| La vie       | Les dinosaures                  | Où sont passés les dinosaures ?          |
| La vie       | Les plantes                     | Comment une graine devient un arbre ?    |
| La vie       | Les abeilles                    | Comment les abeilles font le miel ?      |
| La Terre     | Sous nos pieds (papier découpé) | Qu'y a-t-il sous nos pieds ?             |
| La vie       | La chenille (dessin animé)      | Comment une chenille devient papillon ?  |
| Les machines | Le Wi-Fi (gouache hachurée)     | Comment marche le Wi-Fi ?                |
| Le corps     | Le hoquet (à faire)             | D'où vient le hoquet ?                   |

## Rythme : constat et règles pour les prochains épisodes

Mesure sur les épisodes 2, 4 et 7 : une trentaine de silences de plus de 0,7 s par épisode, environ 40 s au total (un cinquième de la durée), dont 13 ou 14 de plus de 1,2 s, le plus long dépassant 3 s. Ils viennent des pauses réglées dans `src/config.json` (`lead`, `tail`, `pre`) et de l'absence de fond sonore.

Règles proposées : pauses entre répliques de 0,25 s au plus (0,5 s pour une chute), 0,4 s en début de scène et 0,6 s en fin ; un fond sonore discret en continu ; un bruitage sur chaque apparition ; aucune image immobile plus d'une demi-seconde (mouvement d'attente sur les éléments à l'écran).

## Ouverture des épisodes (décidé le 27/11/2026, à partir de l'épisode 31)

Constat sur l'épisode 10 (odorat) dans YouTube Studio, après 20 vues : 1 200 impressions, 1,7 % de clics,
26 s regardées en moyenne (14 %). Les spectateurs repartent pendant l'introduction, qui met 15 à 20 s
avant la première vraie explication.

Règles pour les prochains épisodes (décision de l'utilisateur) :

1. **Accroche d'abord** : l'épisode s'ouvre directement sur une image surprenante et en mouvement liée
   au sujet, avec la question de Zoé dès la première seconde. Pas d'écran de titre avant.
2. **Générique ensuite, et court** : 2 à 3 s au plus (logo Kidi-science et jingle), placé juste après
   l'accroche (vers 6 à 10 s), puis on enchaîne tout de suite sur la réponse.
3. **Première explication avant 15 s** : Max commence à répondre au plus tard 15 s après le début.
4. Les épisodes 1 à 30 ne sont pas modifiés.

Le style visuel peut changer d'un épisode à l'autre (papier découpé, dessin animé classique, gouache
hachurée testés sur les épisodes 28 à 30) ; d'autres styles pourront être essayés.

## Nouveaux sujets validés (27/11/2026) — production à partir du jeudi 3/12/2026

Écartés par l'utilisateur : l'arc-en-ciel (déjà dans l'épisode 6, la lumière) et « pourquoi le ciel est noir la nuit » (trop évident).

Chaque sujet vient avec son **accroche** (la première image, selon les règles d'ouverture ci-dessus).

| Série        | Question de Zoé                            | Accroche (première image)                                    |
| ------------ | ------------------------------------------ | ------------------------------------------------------------ |
| Le corps     | D'où vient le hoquet ? (annoncé ép. 27-28) | Un « HIC ! » qui fait sauter tout le décor                   |
| Le corps     | Pourquoi on bâille ?                       | Un bâillement qui contamine toute une classe                 |
| Le corps     | Pourquoi j'ai la chair de poule ?          | Un bras dont les poils se dressent d'un coup                 |
| Le corps     | Pourquoi mes doigts fripent dans le bain ? | Des doigts qui deviennent des pruneaux                       |
| Le corps     | Comment guérit une coupure ?               | Une armée minuscule qui répare un trou dans la peau          |
| La Terre     | Comment se forme un orage ?                | Un éclair qui coupe l'écran en deux, puis le « BOUM »        |
| La Terre     | Pourquoi il y a des vagues ?               | Une vague géante qui se dresse                               |
| L'espace     | Comment vivent les astronautes ?           | Une goutte d'eau qui flotte en boule devant un nez           |
| L'espace     | C'est quoi, un trou noir ?                 | Une étoile aspirée comme des spaghettis                      |
| Les machines | Comment marche un frigo ?                  | La porte s'ouvre : il fait froid, mais d'où vient le froid ? |
| Les machines | Comment un bateau flotte ?                 | Un énorme paquebot en acier… et un caillou qui coule         |
| Les machines | Comment marche un écran tactile ?          | Un doigt qui touche l'écran, plongée dans la vitre           |
| La vie       | Comment respirent les poissons ?           | Un poisson qui « boit » l'eau en continu                     |
| La vie       | Pourquoi les chats ronronnent ?            | Un ronron qui fait trembler l'image                          |
| La vie       | Comment les fourmis trouvent leur chemin ? | Une file de fourmis qui fait demi-tour pile au bon endroit   |
| La matière   | Pourquoi la glace flotte ?                 | Un glaçon qui remonte, alors que les cailloux coulent        |
| La matière   | Comment marche le savon ?                  | Une tache de gras qui s'enfuit devant une bulle              |
| La matière   | Pourquoi le pop-corn éclate ?              | Un grain de maïs qui explose au ralenti                      |

## Rythme de production (décidé le 27/11/2026)

Moins d'épisodes, mieux faits : la production se fait **le jeudi soir uniquement**, en mettant l'effort sur la
qualité visuelle et le rendu. Pas de demande de hausse du quota YouTube. Le reste (voix, ton, structure,
publication) ne change pas.
