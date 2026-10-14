# Sollagua « La goutte » : le prompt complet

À coller tel quel dans une session d'agent qui a les skills
[HyperFrames](https://github.com/heygen-com/hyperframes) installés (`/hyperframes` doit
répondre). Ressources à fournir : les cinq logos partenaires
(`stephane-glitch/sollagua-demo`, dossier `img/logos/`) et une clé ElevenLabs en variable
d'environnement `ELEVENLABS_API_KEY` (voix, musique, bruitages). Ne collez jamais la clé
dans le prompt.

────────────────────────────────────────────────────────────────────────────

Fais-moi un teaser vidéo **3D de 36 s** pour **Sollagua**, un jeu sérieux sur le partage
de l'eau entre cinq acteurs d'un même territoire (programme Interreg Sudoe). Il est projeté
en salle juste avant une partie, devant les joueurs. Son but : donner envie de jouer, pas
expliquer les règles. Aucun chiffre du jeu, aucun vocabulaire technique à l'écran.

Utilise une vraie scène 3D (Three.js via l'adaptateur `three` de HyperFrames), pas une
animation de badges ni de cartons. Le fil rouge est **une seule goutte d'eau** que la
caméra suit du début à la fin, comme une lumière qui dessinerait l'histoire.

## Format

- 1920 × 1080, 30 i/s, MP4 H.264, 36,0 s, dernière image tenue.
- Stéréo 48 kHz : voix off française + musique + bruitages.
- Livrer trois fichiers : le master, une copie haute qualité (≈ 20 Mb/s) pour la
  projection, et une copie de moins de 30 Mo pour le partage.

## Le décor : une vallée en maquette 3D

Une vallée low-poly façon maquette (volumes simples, ombres portées douces, lumière de
fin de matinée), dont le plan reprend celui du plateau du jeu :

- une rivière qui serpente du nord au sud, avec un pont de pierre aux deux tiers ;
- deux retenues rondes (une en haut près de la rivière, une au centre) ;
- cinq lieux, un par rôle du jeu :
  - **élevage** : ferme et vaches, en haut à gauche ;
  - **viticulture** : rangs de vigne et maison de maître, en haut à droite ;
  - **la commune** : village de toits de tuile et clocher, à droite du centre ;
  - **grande culture** : parcelles de maïs et de tournesols, à gauche ;
  - **volaille** : mare, grange et canards, en bas à droite ;
- un second village en bas à gauche, cyprès et chênes, champs en damier vert et doré, lit
  de rivière en galets.

Chaque lieu est relié à la rivière par un petit **canal d'irrigation**. Construis tout de
façon procédurale et déterministe (relief par fonctions, PRNG à graine fixe, pas de
`Math.random`, pas de chargement réseau au rendu).

## Le déroulé (minutage ferme)

| Temps     | Ce qu'on voit                                                                                                                                                                                                                                                                                                                                                                                                               | Voix off                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 0–3,5 s   | Ciel clair. Une goutte bleue lumineuse tombe d'un nuage. La caméra descend avec elle ; la vallée grandit dessous. Impact à la source de la rivière, petite couronne d'éclaboussure.                                                                                                                                                                                                                                         | —                                                                                                            |
| 3,5–11 s  | La goutte devient la rivière : l'eau (shader animé qui coule) se propage vers l'aval, la caméra suit la tête du courant. Sur chaque mot de la voix, le canal du lieu se remplit et le lieu **s'éveille** (couleurs ternes → vives) : la vigne pousse et verdit, les vaches se mettent à bouger, les toits du village reprennent leur couleur, le maïs et les tournesols poussent, la mare se remplit et les canards nagent. | 3,7 s « Une rivière. » · 4,9 s « Des vignes. Des troupeaux. Un village. Des champs. La même eau pour tous. » |
| 11–13 s   | Plan large : toute la vallée vivante, l'eau partout.                                                                                                                                                                                                                                                                                                                                                                        | —                                                                                                            |
| 13–19 s   | **Sécheresse.** Le soleil descend, la lumière vire à l'ocre, l'herbe jaunit, le lit de la rivière craquelle, la rivière rétrécit, les retenues baissent, les cultures s'affaissent.                                                                                                                                                                                                                                         | 13,4 s « Mais les étés s'allongent. Et la pluie se fait rare. »                                              |
| 19,5–24 s | **Le dilemme.** Les canaux des cinq rôles s'illuminent tous, puis s'éteignent un par un. La rivière se resserre de ses deux bouts vers la retenue centrale, jusqu'à ne laisser qu'**une seule goutte**.                                                                                                                                                                                                                     | 19,6 s « Partager ou garder ? S'entendre, ou laisser tomber le voisin ? »                                    |
| 25–27,2 s | La dernière goutte se forme, monte, hésite… puis tombe dans la retenue. La caméra passe à la verticale au-dessus.                                                                                                                                                                                                                                                                                                           | —                                                                                                            |
| 27,2–36 s | **L'onde.** Des anneaux concentriques s'étendent et l'eau remplit tout l'écran (bleu profond). De l'onde naît le logotype **SOLLAGUA** (goutte + mot), puis la question en deux temps : « Saurez-vous tenir le territoire… » / « quand **l'eau** vient à manquer ? » (« l'eau » en bleu clair), puis « À vous de jouer. » et les cinq logos partenaires sur un bandeau crème.                                               | 28,0 s « Saurez-vous tenir le territoire… quand l'eau vient à manquer ? »                                    |

Ordre des logos : Interreg Sudoe · Université de Toulouse · IMT Mines Alès · GEODE ·
Défis clés Water Occitanie.

## Script de la voix off

Cinq répliques, à dire exactement ainsi (ne pas réécrire). Chaque réplique est un fichier
séparé, posé à l'instant indiqué.

| #   | Début  | Durée env. | Texte                                                                     | Intention                                                                                                                      |
| --- | ------ | ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 3,7 s  | 1 s        | Une rivière.                                                              | Posé, presque murmuré, juste après l'impact de la goutte.                                                                      |
| 2   | 4,9 s  | 6,8 s      | Des vignes. Des troupeaux. Un village. Des champs. La même eau pour tous. | Chaleureux, un temps marqué après chaque point : chaque mot réveille un lieu. « La même eau pour tous » plus lent, en ouvrant. |
| 3   | 13,4 s | 3,5 s      | Mais les étés s'allongent. Et la pluie se fait rare.                      | Plus grave, sans dramatiser.                                                                                                   |
| 4   | 19,6 s | 4,5 s      | Partager ou garder ? S'entendre, ou laisser tomber le voisin ?            | Deux vraies questions, posées au spectateur. Légère tension.                                                                   |
| 5   | 28,0 s | 4 s        | Saurez-vous tenir le territoire… quand l'eau vient à manquer ?            | Un ton en dessous, plus lent, un silence sur les points de suspension. Pas de montée finale.                                   |

Repères mot à mot pour la réplique 2 (depuis le début du fichier) : « vignes » 0,29 s,
« troupeaux » 1,43 s, « village » 2,69 s, « champs » 3,97 s, « La même eau » 4,81 s.
Les éveils des lieux se calent sur ces mots. Si la voix générée diffère, recale les
éveils sur l'horodatage réel, pas l'inverse.

**Génération** (ElevenLabs) :

- Voix : française masculine, chaude, grave médium, registre conteur documentaire, pas
  de voix de bande-annonce. Celle retenue : « Guillaume – Narrator » de la bibliothèque
  partagée ElevenLabs (`voice_id` `tVu7uvtKsrCoOPPIUVR7`).
- Modèle `eleven_multilingual_v2`, `language_code` `fr`, endpoint `with-timestamps` pour
  récupérer l'horodatage.
- Réglages : stability 0,55, similarity_boost 0,8, style 0,15, speaker boost activé,
  speed 0,95 (0,9 pour la réplique 5).
- Passer la réplique précédente et la suivante en `previous_text` / `next_text` pour
  garder une intonation continue.
- Normaliser chaque fichier à −16 LUFS (crête −2 dB).

Sous-titres : produire aussi un `.vtt` calé sur ces cinq répliques, non incrusté.

## Son

- Musique générée (ElevenLabs Music, plan de composition en sections) : chute
  suspendue → piano et cordes qui coulent, chaleureux → tension sèche → pulsation de cœur
  qui s'amenuise → presque silence → accord chaud qui s'ouvre sur l'onde. Pas de voix,
  pas de batterie lourde. Environ −21 LUFS, creusée sous la voix.
- Bruitages : la goutte à l'impact, un ruisseau pendant la propagation, un vent sec, des
  craquements de terre, la dernière goutte dans un bassin profond avec écho, une cloche
  douce sous le logo.
- Mix final autour de −17 LUFS, crête sous −1,5 dB.

## Charte

- Couleurs du jeu : crème `#FBF4E2`, encre `#3A3024`, eau `#2C7FB8` / `#5BB5E8`,
  or `#E0A82E`, argile `#B5705C`, vin `#7B4B6B`, toits `#C77B6B`.
- Polices du jeu, embarquées en local (pas de CDN au rendu) : **Fraunces** 600/700 pour
  les titres, Nunito pour le reste.
- Aucun emoji ; la goutte du logo est un pictogramme SVG en trait.

## Exigences techniques

- Rendu piloté uniquement par le temps HyperFrames (`hf-seek`), une timeline GSAP vide
  de 36 s enregistrée sur `window.__timelines`, `data-duration="36"` sur la racine.
- Antialiasing multi-échantillons sur le rendu (cible MSAA ×4, demi-flottant) : la chaîne
  de post-traitement (bloom) contourne sinon l'antialiasing du canvas et l'image paraît
  pixélisée.
- Vérifier avec `npx hyperframes lint`, puis des instantanés aux moments clés
  (`npx hyperframes snapshot --at …`). Sur une machine sans GPU, `hyperframes check` peut
  dépasser son délai de 2 min et le rendu prendre 30 à 40 min : c'est normal.

## Avant de me livrer

Dis-moi pour chaque ligne si c'est oui ou non :

- [ ] La vidéo fait 36,0 s.
- [ ] La goutte est visible pendant toute la chute d'ouverture.
- [ ] Chaque lieu s'éveille sur son mot.
- [ ] Les cinq canaux s'éteignent un par un et il ne reste qu'une goutte.
- [ ] Aucune colline ni aucun objet ne perce l'onde finale.
- [ ] Le texte final est lisible et le mix ne sature pas.

────────────────────────────────────────────────────────────────────────────
