# Fabrique le kit de publication YouTube de chaque épisode : python3 -I kit.py
# → publication/epNN/meta.json (titre, description avec chapitres, mots-clés), sous-titres.srt, image.jpg (image tirée de la vidéo, pour la miniature)
import glob, html, json, os, re, subprocess

EPS = [
    ("ep01-voiture", "Comment roule une voiture ?", "Comment roule une voiture ?",
     "Zoé veut savoir ce qui se passe sous le capot. Max ouvre le moteur à essence, puis le moteur électrique, et montre comment les freins arrêtent la voiture.",
     ["voiture", "moteur", "moteur électrique", "freins"], ("s2", 0.5)),
    ("ep02-atomes", "C'est quoi, un atome ?", "C’est quoi, un atome ?",
     "Si on coupe une tartine en deux, encore et encore, où est-ce qu'on s'arrête ? Zoé et Max descendent jusqu'aux atomes, puis remontent aux molécules, à la glace, à l'eau et à la vapeur.",
     ["atome", "molécule", "matière", "états de l'eau"], ("s2", 0.45)),
    ("ep03-electricite", "Comment marche l'électricité ?", "L’électricité, comment ça marche ?",
     "Qu'est-ce qui circule dans les câbles quand on appuie sur l'interrupteur ? Zoé et Max suivent le courant, de la pile jusqu'à l'ampoule.",
     ["électricité", "courant électrique", "circuit", "pile", "ampoule"], ("s2", 0.7)),
    ("ep04-gravite", "Pourquoi ça tombe ? La gravité", "Pourquoi ça tombe ?",
     "Pourquoi la tartine tombe-t-elle toujours vers le bas ? Et pourquoi la Lune, elle, ne tombe pas ? Zoé et Max découvrent la gravité, sur la Terre, sur la Lune et dans l'espace.",
     ["gravité", "pesanteur", "Terre", "Lune", "espace"], ("s1", 0.7)),
    ("ep05-son", "C'est quoi, un son ?", "C’est quoi, un son ?",
     "Un son, c'est une vibration qui voyage. Zoé et Max la suivent dans l'air jusqu'au fond de l'oreille, et comprennent le grave, l'aigu, l'écho… et le silence de l'espace.",
     ["son", "vibration", "oreille", "écho", "onde sonore"], ("s3", 0.8)),
    ("ep06-lumiere", "D'où viennent les couleurs ? La lumière", "D’où viennent les couleurs ?",
     "La lumière blanche cache toutes les couleurs. Zoé et Max la font passer dans un prisme, expliquent l'arc-en-ciel, le ciel bleu, et comment l'œil voit le jaune.",
     ["lumière", "couleurs", "arc-en-ciel", "ciel bleu", "œil"], ("s2", 0.75)),
    ("ep07-allergies", "Pourquoi j'éternue au printemps ? Les allergies", "Pourquoi j’éternue ?",
     "Le pollen n'a rien fait : c'est le corps qui en fait trop. Zoé et Max rencontrent les globules blancs, leurs antennes, et l'histamine qui fait éternuer.",
     ["allergie", "pollen", "globules blancs", "histamine", "système immunitaire"], ("s3", 0.55)),
]
COMMON_TAGS = ["Kidi-science", "sciences pour enfants", "comment ça marche", "vulgarisation scientifique", "dessin animé éducatif", "école primaire"]
ts = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"

def srt_time(s):
    ms = int(round(s * 1000)); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"

def cues(lines):
    # une ligne de dialogue → un ou plusieurs sous-titres d'environ 70 caractères, coupés de préférence après une ponctuation
    out = []
    for l in lines.values():
        cur = []
        for w in l["words"]:
            cur.append(w)
            text = " ".join(x[0] for x in cur)
            if len(text) >= 70 or (len(text) >= 38 and re.search(r"[.,!?…:;]$", w[0])):
                out.append(cur); cur = []
        if cur:
            if out and out[-1][0] in sum([l["words"]], []) and len(" ".join(x[0] for x in cur)) < 12: out[-1] = out[-1] + cur
            else: out.append(cur)
    return [(c[0][1], c[-1][2], " ".join(x[0] for x in c)) for c in out]

for n, (d, title, thumb, summary, tags, (shot_scene, shot_frac)) in enumerate(EPS, 1):
    v = f"../{d}/video"
    sch = json.load(open(f"{v}/src/schedule.json"))
    chapters = [(0, "La question du jour")]
    for sid, sc in sch["scenes"].items():
        f = f"{v}/src/scenes/{sid}.html"
        m = re.search(r'class="chap">([^<]+)<', open(f).read()) if os.path.exists(f) else None
        if m and sc["start"] - chapters[-1][0] >= 10: chapters.append((sc["start"], html.unescape(m.group(1)).replace("’", "'")))
    desc = f"{summary}\n\nKidi-science : les sciences expliquées aux enfants, en moins de 5 minutes. Dans chaque épisode, Zoé pose une question et Max l'aide à trouver la réponse.\n\nAu programme :\n" + "\n".join(f"{ts(t)} {c}" for t, c in chapters)
    out = f"publication/ep{n:02d}"; os.makedirs(out, exist_ok=True)
    mp4 = glob.glob(f"{v}/renders/*-v1.mp4")
    meta = {"episode": n, "fichier": mp4[0] if mp4 else None, "titre": f"{title} | Kidi-science", "titre_miniature": thumb, "description": desc, "mots_cles": tags + COMMON_TAGS,
            "playlist": "Kidi-science : tous les épisodes", "langue": "fr", "categorie": "27", "pour_enfants": True}
    json.dump(meta, open(f"{out}/meta.json", "w"), ensure_ascii=False, indent=1)
    cs = cues(sch["lines"])
    open(f"{out}/sous-titres.srt", "w").write("\n".join(f"{i}\n{srt_time(a)} --> {srt_time(max(b, a + 0.8))}\n{t}\n" for i, (a, b, t) in enumerate(cs, 1)))
    if mp4:
        sc = sch["scenes"][shot_scene]; at = sc["start"] + (sc["end"] - sc["start"]) * shot_frac
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{at:.2f}", "-i", mp4[0], "-frames:v", "1", "-vf", "crop=1660:680:130:180", "-q:v", "2", f"{out}/image.jpg"], check=True)
    print(n, meta["titre"], "|", len(chapters), "chapitres |", len(cs), "sous-titres")
