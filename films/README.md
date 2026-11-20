# Films courts « tout en code »

Petits films d'animation (5 à 10 s) fabriqués uniquement avec du code : aucun modèle d'image ou de vidéo, aucune clé d'API. Ils ne passent pas par HyperFrames.

- [`PROMPTS.md`](PROMPTS.md) : la bibliothèque de référence (méthode + 105 prompts, par style). Pour un nouveau film, partir du gabarit « même style, votre idée » du style voulu.
- Un dossier par film. Premier film : [`estampe-cerf-volant/`](estampe-cerf-volant/) (style « Animated woodblock print »).

## Comment un film est fait

Il n'y a pas de moteur commun à installer : chaque film tient en trois petits fichiers.

| Fichier      | Rôle                                                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `film.html`  | Le dessin. `renderFrame(n)` calcule l'image numéro `n` (fonction pure du numéro d'image). S'ouvre aussi tel quel dans un navigateur pour un aperçu. |
| `render.cjs` | Ouvre `film.html` dans Chromium (Playwright) et enregistre chaque image en PNG.                                                                     |
| `audio.py`   | Fabrique la bande-son (WAV) par synthèse, avec numpy.                                                                                               |

```bash
python3 -I audio.py /chemin/son.wav
```

```bash
node render.cjs /chemin/images
```

```bash
ffmpeg -framerate 15 -i /chemin/images/f%04d.png -i /chemin/son.wav -r 30 -c:v libx264 -pix_fmt yuv420p -crf 16 -c:a aac -shortest renders/film.mp4
```

Pour des images test avant le rendu complet : `node render.cjs /chemin/test 0,90,150,290` (numéros d'image).

## Recette du style estampe (`estampe-cerf-volant/film.html`)

- Trois planches dessinées à plat sur trois canvas : couleur claire, couleur foncée, trait noir. Une forme efface d'abord ce qu'elle recouvre sur les trois planches, puis s'encre sur la sienne.
- Palette : bleu de Prusse, indigo, gris-bleu pâle, crème (le papier laissé nu) et un seul rouge.
- Un shader « imprime » les planches : léger décalage entre planches, veinure du bois dans les aplats, fibres du papier, encrage inégal, feuille aux bords déchiquetés avec sa marge.
- Animation « par deux » : un nouveau dessin toutes les deux images (15 dessins par seconde), avec un léger tremblement du trait d'un dessin à l'autre.
- Un seul événement, un mouvement de caméra prévu, une image finale qui conclut, pas de texte.
