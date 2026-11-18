# Kidi-science — notes techniques

Synthèse de la recherche du 18/11/2026 (dépôts lus en lecture seule, rien installé).
Les règles « maison » de HyperFrames restent prioritaires : `/hyperframes`,
`/hyperframes-core`, `.claude/skills/motion-doctrine`.

## 1. Environnement (pièges constatés)

- **APIs connectées sans clé** (le proxy injecte les identifiants) :
  `api.elevenlabs.io/v1/`, `api.openai.com/v1/`,
  `generativelanguage.googleapis.com/v1beta/`. Testées : 200.
- **HeyGen n'est pas configuré.** Les chemins voix / musique / SFX de
  `/media-use` passent par la CLI `heygen` → ils échoueront. Appeler
  ElevenLabs directement.
- **CLI** : `npx hyperframes` répond (v0.9.68 au 18/11). ffmpeg, Node 22, bun,
  Python 3 et Chromium + Playwright sont présents.
- **Playwright depuis un `.mjs`** : `import "playwright"` échoue ; utiliser
  `createRequire(import.meta.url)("playwright")` avec `NODE_PATH=$(npm root -g)`.
- **Polices** : Google Fonts CSS répond, mais `fonts.gstatic.com` non ;
  jsdelivr (`@fontsource/...`) fonctionne. Les polices de la série sont déjà dans `fonts/`.
- **Commits** : le hook pre-commit (lefthook) construit tout le monorepo →
  faire `bun install` une fois par session avant de committer ; ne pas committer
  le `bun.lock` modifié par `bunx`.
- **Fichiers > 500 Ko refusés hors LFS** par le hook. Ne pas committer les PNG
  haute définition ni les MP4 : les régénérer, ou committer un aperçu JPEG léger.
- **15 fichiers `packages/producer/tests/*/output/compiled.html` apparaissent
  modifiés** dès le clonage (pointeurs Git LFS). Ce ne sont pas nos fichiers et
  ils ne servent pas à nos vidéos : l'utilisateur a demandé de **les ignorer**.
  Ne pas les committer.

## 2. Voix ElevenLabs

- Modèles avec le français : `eleven_v4`, `eleven_v4_turbo`, `eleven_v3`,
  `eleven_v3_conversational`, `eleven_multilingual_v2`, `eleven_flash_v2_5`,
  `eleven_turbo_v2_5`.
- **Aucune voix d'enfant** dans la bibliothèque du compte. Pistes, à écouter
  avant de choisir :
  - **Zoé (enfant)** : voix jeunes et expressives — `Morgane – Gentle + intensely
expressive` (`ZYOBieLaunTiQrTrvNQq`, faite pour l'animation), `Solene -
Energetic, Joyful` (`1A1lOhlOFIlPyxQ8NgiG`), `Emi` (`Crnn8UaAugljbB6XhAKo`).
    Autre option : créer une voix d'enfant avec le Voice Design d'ElevenLabs
    (endpoint à vérifier), ou chercher dans la bibliothèque partagée
    (`/v1/shared-voices?language=fr&age=young`, répond 200).
  - **Max (adulte bienveillant)** : `Antoine - E-learning Instructor`
    (`nbiTBaMRdSobTQJDzIWm`), `Nicolas - Informative Presenter`
    (`iCKVfVbyCo5AAswzTkkX`), `Adrien Clairon` (`c365oriviHmAhyLhpuN6`).
- À vérifier avant usage : l'endpoint TTS « with timestamps » (alignement par
  caractère, utile pour caler les animations sur les mots) et l'endpoint de
  dialogue multi-voix du modèle v3.
- Coût mesuré par creator-generalist : SFX ≈ 11 crédits/s, musique ≈ 14 crédits/s.

## 3. Règles chiffrées retenues

**Écriture et rythme** (creator-generalist, `2d-generalist`)

- Accroche dans les 3 premières secondes.
- Débit : 2,6–3 mots/s pour un explainer adulte → on vise ~2,3 pour des enfants.
- L'image arrive 4 à 8 images avant le mot qu'elle illustre.
- Quelque chose change à l'écran toutes les 1–3 s ; coupes franches, jamais
  d'image fixe vers image fixe ; les éléments surgissent quelques images
  **après** une coupe, pas dessus.

**Lisibilité**

- Hauteur de capitale ≥ 5 % de la hauteur d'image.
- Un texte reste ≥ 0,5 s + 0,3 s par mot.
- 60–75 % d'espace vide, ≤ 7 éléments, un seul point focal (look « Vox » mesuré).

**Son** (creator-generalist, `design-sound/references/mix.md`)

- Master −14 LUFS intégré, plafond −1,5 dBTP ; vérifier après encodage AAC.
- Voix ≥ 10 LU au-dessus de la musique ; musique baissée de 8 dB sous la voix
  (attaque 10 ms, démarrage 30 ms en avance, maintien 150 ms, relâche 300 ms) ;
  creux supplémentaire de −3 dB à 1–4 kHz sur la musique pendant la voix.
- 1 à 2 bruitages discrets par 10 s ; sons doux (air, papier) plutôt que clics
  ou cloches pour les éléments d'interface ; une apparition n'a pas besoin de son.
- Laisser 1–2 s de silence avant le grand moment.
- `ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:v copy out.mp4`

**Mouvement** (line-art-animation, anatomy, doctrine maison)

- Calculer la mécanique (bielle-manivelle, rapports d'engrenages, roue qui
  roule sans glisser : angle = distance / rayon) plutôt qu'animer « à l'œil ».
- Ressorts et pendules pour ce qui pend ou traîne (câbles, ressorts de soupape).
- Entrée d'un élément ≤ ~0,8 s ; décalage total d'une cascade ≤ 0,5 s ;
  pas de `bounce` / `elastic` ; `back.out(1.4–1.7)` toléré.
- Pause de 0,3–0,75 s entre l'action et son résultat (« la virgule dramatique »).

## 4. Contrôle qualité avant livraison

- `npx hyperframes lint` puis `npx hyperframes check` (obligatoires).
- Planche-contact horodatée :
  `ffmpeg -i v.mp4 -vf "fps=2,scale=400:-2,pad=iw:ih+24:0:0:color=black,drawtext=text='%{pts\:hms}':x=6:y=h-21:fontsize=20:fontcolor=white,tile=5x4" -q:v 4 sheet_%02d.jpg`
- Détection automatique (seuils Videohub, sur images 160×90 en luminance) :
  image blanche si moyenne > 228, noire si < 6 ; image figée si différence
  < 0,35 pendant ≥ 1,6 s ; « pop » d'une image isolée ; scintillement.
- Pas de plan immobile > 1,5 s ; pas de silence > 0,4 s à −45 dB.
- Fondus enchaînés accidentels : script `check_blended_cuts.py` de creator-generalist.

## 5. Dépôts de référence

**Lus en détail**

- `JDhruv14/line-art-animation` (MIT) — dessin au trait animé en SVG, marche
  calculée, ressorts, capture déterministe image par image.
- `codepawl/creator-generalist` (MIT) — règles mesurées d'écriture, montage, son,
  contrôle qualité ; scripts Python + ffmpeg portables (`watch-video/scripts/perceive.py`,
  `2d-generalist/scripts/check_render.py`, `design-sound/scripts/mix.py`).
- `TensaikunYT/Videohub` (MIT) — boucle de relecture (notes épinglées sur une
  image), détection automatique d'images ratées, re-rendu partiel par morceaux,
  méthode de miniatures (image sans texte + titre de 2–4 mots posé en code,
  12–16 % de la hauteur).
- `wheresryan22/anatomy` (MIT) — référence de style : objets techniques
  isométriques en coupe, vues éclatées, mécanique pilotée par un petit modèle.

**À adopter en priorité** (vérifiés sur GitHub, non testés)

1. `greensock/gsap-skills` — règles officielles GSAP (core, timeline, plugins).
2. `bradautomates/claude-video` — faire « regarder » le MP4 rendu (Gemini juge le mouvement).
3. `browser-use/video-use` — auto-vérification de chaque coupe.
4. `wyzowl/sfx-kit` — 320 bruitages CC0 avec guide moment → son.
5. `m-bain/whisperX` — horodatage mot par mot (lent sans GPU).

Autres : `iart-ai/motion-design-skills`, `gl-transitions/gl-transitions`,
`rough-stuff/rough-notation`, `Breakthrough/PySceneDetect`,
`slhck/ffmpeg-normalize`, `CPJKU/beat_this`, `WyattBlue/auto-editor`
(et `OpenMontage`, licence AGPL : à lire seulement).
