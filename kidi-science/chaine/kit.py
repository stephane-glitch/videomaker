# Fabrique le kit de publication YouTube de chaque épisode : python3 -I kit.py
# → publication/epNN/meta.json (titre, description avec chapitres, mots-clés), sous-titres.srt, image.jpg (image tirée de la vidéo, pour la miniature)
import glob, html, json, os, re, subprocess

EPS = [
    ("ep01-voiture", "Comment fonctionne une voiture ?", "Comment fonctionne une voiture ?",
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
    ("ep08-feu", "C'est quoi, une flamme ? Le feu", "C’est quoi, une flamme ?",
     "Quand on souffle une bougie, où va la flamme ? Zoé et Max découvrent le triangle du feu, ce qui brûle vraiment dans une bougie, pourquoi la flamme est bleue et jaune, et comment on éteint un feu.",
     ["feu", "flamme", "combustion", "bougie", "triangle du feu"], ("s3", 0.55)),
    ("ep09-mer", "Pourquoi la mer est salée ?", "Pourquoi la mer est salée ?",
     "Le sel de la mer vient… des montagnes. Zoé et Max suivent son voyage : la pluie qui grignote les rochers, les rivières, puis la mer, où l'eau s'évapore et où le sel reste.",
     ["mer", "sel", "eau de mer", "cycle de l'eau", "mer Morte"], ("s3", 0.6)),
    ("ep10-odorat", "Comment je sens les odeurs ? L'odorat", "Comment je sens les odeurs ?",
     "Une odeur, ce sont des molécules qui volent jusqu'au nez. Zoé et Max montent tout en haut du nez, là où des millions de capteurs fonctionnent comme des serrures, et comparent notre nez à celui du chien.",
     ["odorat", "odeur", "nez", "molécules", "les cinq sens"], ("s2", 0.7)),
    ("ep11-gout", "Pourquoi ça a du goût ? Le goût", "Pourquoi ça a du goût ?",
     "Le goût, c'est un travail d'équipe entre la langue et le nez. Zoé et Max découvrent les papilles, les cinq goûts, la fausse carte de la langue, pourquoi l'amer fait grimacer et comment le piment triche.",
     ["goût", "langue", "papilles", "umami", "les cinq sens"], ("s2", 0.3)),
    ("ep12-toucher", "Pourquoi ça chatouille ? Le toucher", "Pourquoi ça chatouille ?",
     "La peau est un emballage rempli de millions de capteurs. Zoé et Max les passent en revue, testent les doigts et le dos, expliquent le réflexe de la main qui se retire, et percent le secret des chatouilles.",
     ["toucher", "peau", "réflexe", "chatouilles", "les cinq sens"], ("s1", 0.8)),
    ("ep13-vue", "Pourquoi on a deux yeux ? La vue", "Pourquoi on a deux yeux ?",
     "Un œil, c'est presque un appareil photo. Zoé et Max suivent la lumière : la pupille, le cristallin, l'image à l'envers sur la rétine, le rôle des lunettes, et ce que deux yeux apportent de plus qu'un seul.",
     ["vue", "œil", "pupille", "lunettes", "les cinq sens"], ("s2", 0.5)),
    ("ep14-volcans", "Pourquoi les volcans crachent du feu ?", "Pourquoi les volcans crachent du feu ?",
     "Surprise : ce n'est pas du feu, c'est de la roche fondue. Zoé et Max descendent sous la croûte de la Terre, suivent le magma jusqu'à l'éruption, et découvrent que les volcans fabriquent des îles.",
     ["volcan", "magma", "lave", "éruption", "la Terre"], ("s2", 0.92)),
    ("ep15-pluie", "D'où vient la pluie ? Les nuages", "D’où vient la pluie ?",
     "Un nuage pèse aussi lourd qu'un troupeau d'éléphants, et pourtant il flotte. Zoé et Max suivent l'eau : elle s'évapore, monte, redevient gouttelettes, puis retombe en pluie… depuis le temps des dinosaures.",
     ["pluie", "nuages", "cycle de l'eau", "météo", "évaporation"], ("s3", 0.55)),
    ("ep16-coeur", "Pourquoi mon cœur bat ? Le cœur et le sang", "Pourquoi mon cœur bat ?",
     "Le cœur est une pompe grosse comme le poing, qui bat cent mille fois par jour. Zoé et Max suivent le sang, livreur d'oxygène : le grand circuit en huit, les artères et les veines, le boum-boum des valves.",
     ["cœur", "sang", "circulation", "pouls", "corps humain"], ("s2", 0.75)),
    ("ep17-digestion", "Où va ce que je mange ? La digestion", "Où va ce que je mange ?",
     "Une tartine part pour un voyage de sept mètres. Zoé et Max la suivent étape par étape : la bouche, l'œsophage, l'estomac, l'intestin grêle qui nourrit le sang, et le gros intestin avec ses milliards de bactéries.",
     ["digestion", "estomac", "intestin", "corps humain", "alimentation"], ("s3", 0.75)),
    ("ep18-sommeil", "Pourquoi on dort ? Le sommeil", "Pourquoi on dort ?",
     "Dormir, ce n'est pas ne rien faire. Zoé et Max découvrent les trois chantiers de la nuit : le cerveau range ce qu'on a appris, il fait le ménage, et le corps grandit. Avec les cycles du sommeil et le piège des écrans.",
     ["sommeil", "dormir", "rêves", "cerveau", "corps humain"], ("s4", 0.6)),
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
