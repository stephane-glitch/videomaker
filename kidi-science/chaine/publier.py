# Publication sur YouTube par l'API officielle (YouTube Data API v3).
# Le jeton d'accès n'est jamais dans ce fichier : il est ajouté aux requêtes par le proxy de la session.
#   python3 -I publier.py verifier   → montre la chaîne reconnue par le jeton
#   python3 -I publier.py envoyer    → envoie les vidéos EN PRIVÉ (celles déjà en ligne sont seulement mises à jour, visibilité inchangée), avec titre, description, « conçue pour les enfants », miniature, sous-titres, playlist
#   python3 -I publier.py publier    → passe en public les vidéos déjà envoyées
#   python3 -I publier.py chaine     → installe la description et la bannière de la chaîne
# L'avancement est noté dans publication/etat.json : relancer une commande reprend là où elle s'était arrêtée.
import glob, json, os, re, subprocess, sys, tempfile

API, UP = "https://www.googleapis.com/youtube/v3", "https://www.googleapis.com/upload/youtube/v3"
ETAT = "publication/etat.json"
etat = json.load(open(ETAT)) if os.path.exists(ETAT) else {"videos": {}}
def save(): json.dump(etat, open(ETAT, "w"), ensure_ascii=False, indent=1)

def call(method, url, body=None, headers=(), data_file=None, want_headers=False):
    with tempfile.NamedTemporaryFile(suffix=".hdr") as h:
        cmd = ["curl", "-sS", "-X", method, url, "-D", h.name, "--max-time", "1800"]
        for k in headers: cmd += ["-H", k]
        if body is not None: cmd += ["-H", "Content-Type: application/json; charset=UTF-8", "--data-binary", json.dumps(body, ensure_ascii=False)]
        if data_file: cmd += ["--data-binary", "@" + data_file]
        out = subprocess.run(cmd, capture_output=True, text=True).stdout
        hdr = open(h.name).read()
    code = int(re.findall(r"HTTP/\S+ (\d+)", hdr)[-1]) if hdr else 0
    try: js = json.loads(out) if out.strip() else {}
    except ValueError: js = {"raw": out[:300]}
    if code >= 300:
        sys.exit(f"ÉCHEC {method} {url.split('?')[0]} → {code} : {js.get('error', {}).get('message', js)}")
    return (js, hdr) if want_headers else js

def metas(): return [json.load(open(f)) | {"dir": os.path.dirname(f)} for f in sorted(glob.glob("publication/ep*/meta.json"))]

def verifier():
    c = call("GET", f"{API}/channels?part=snippet,status&mine=true")["items"][0]
    print("Chaîne :", c["snippet"]["title"], "|", c["snippet"].get("customUrl"), "|", c["id"])
    return c

def envoyer():
    verifier()
    for m in metas():
        key = f"ep{m['episode']:02d}"; v = etat["videos"].setdefault(key, {})
        if "id" not in v:
            size = os.path.getsize(m["fichier"])
            body = {"snippet": {"title": m["titre"], "description": m["description"], "tags": m["mots_cles"], "categoryId": m["categorie"], "defaultLanguage": "fr", "defaultAudioLanguage": "fr"},
                    "status": {"privacyStatus": "private", "selfDeclaredMadeForKids": m["pour_enfants"], "embeddable": True}}
            _, hdr = call("POST", f"{UP}/videos?uploadType=resumable&part=snippet,status", body, ["X-Upload-Content-Type: video/mp4", f"X-Upload-Content-Length: {size}"], want_headers=True)
            loc = re.search(r"(?im)^location:\s*(\S+)", hdr).group(1)
            v["id"] = call("PUT", loc, headers=["Content-Type: video/mp4"], data_file=m["fichier"])["id"]; save()
            print(key, "envoyée (privée) :", v["id"])
        if v.get("deja_en_ligne") and not v.get("fiche"):
            cur = call("GET", f"{API}/videos?part=status&id={v['id']}")["items"][0]["status"]
            call("PUT", f"{API}/videos?part=snippet,status", {"id": v["id"], "snippet": {"title": m["titre"], "description": m["description"], "tags": m["mots_cles"], "categoryId": m["categorie"], "defaultLanguage": "fr", "defaultAudioLanguage": "fr"},
                 "status": {"privacyStatus": cur["privacyStatus"], "selfDeclaredMadeForKids": m["pour_enfants"], "embeddable": True}})
            v["fiche"] = True; save(); print(key, "fiche mise à jour (visibilité inchangée :", cur["privacyStatus"] + ")")
        if not v.get("miniature"):
            call("POST", f"{UP}/thumbnails/set?videoId={v['id']}", headers=["Content-Type: image/jpeg"], data_file=f"{m['dir']}/miniature.jpg"); v["miniature"] = True; save()
            print(key, "miniature posée")
        if not v.get("sous_titres"):
            b = "kidiscience-frontiere"
            part = (f"--{b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + json.dumps({"snippet": {"videoId": v["id"], "language": "fr", "name": ""}}) +
                    f"\r\n--{b}\r\nContent-Type: application/octet-stream\r\n\r\n").encode() + open(f"{m['dir']}/sous-titres.srt", "rb").read() + f"\r\n--{b}--\r\n".encode()
            with tempfile.NamedTemporaryFile(suffix=".bin", delete=False) as f: f.write(part)
            call("POST", f"{UP}/captions?uploadType=multipart&part=snippet", headers=[f"Content-Type: multipart/related; boundary={b}"], data_file=f.name); os.remove(f.name)
            v["sous_titres"] = True; save(); print(key, "sous-titres posés")
    if "playlist" not in etat:
        etat["playlist"] = call("POST", f"{API}/playlists?part=snippet,status", {"snippet": {"title": metas()[0]["playlist"], "description": "Tous les épisodes de Kidi-science, dans l'ordre.", "defaultLanguage": "fr"}, "status": {"privacyStatus": "public"}})["id"]; save()
    for m in metas():
        v = etat["videos"][f"ep{m['episode']:02d}"]
        if not v.get("playlist"):
            call("POST", f"{API}/playlistItems?part=snippet", {"snippet": {"playlistId": etat["playlist"], "resourceId": {"kind": "youtube#video", "videoId": v["id"]}}}); v["playlist"] = True; save()
    print("Playlist :", etat["playlist"])

def fiches():
    # seulement les fiches (titre, description, mots-clés, « conçue pour les enfants ») des vidéos déjà en ligne
    for m in metas():
        key = f"ep{m['episode']:02d}"; v = etat["videos"][key]
        if v.get("fiche"): continue
        cur = call("GET", f"{API}/videos?part=status&id={v['id']}")["items"][0]["status"]
        call("PUT", f"{API}/videos?part=snippet,status", {"id": v["id"], "snippet": {"title": m["titre"], "description": m["description"], "tags": m["mots_cles"], "categoryId": m["categorie"], "defaultLanguage": "fr", "defaultAudioLanguage": "fr"},
             "status": {"privacyStatus": cur["privacyStatus"], "selfDeclaredMadeForKids": m["pour_enfants"], "embeddable": True}})
        v["fiche"] = True; save(); print(key, "fiche mise à jour (visibilité inchangée :", cur["privacyStatus"] + ")")

def publier():
    for key, v in sorted(etat["videos"].items()):
        if "id" in v and not v.get("publique"):
            call("PUT", f"{API}/videos?part=status", {"id": v["id"], "status": {"privacyStatus": "public", "selfDeclaredMadeForKids": True, "embeddable": True}}); v["publique"] = True; save()
            print(key, "publique : https://youtu.be/" + v["id"])

def chaine():
    c = call("GET", f"{API}/channels?part=brandingSettings&mine=true")["items"][0]
    txt = open("DESCRIPTION.md").read()
    desc = re.search(r"## Description de la chaîne.*?```text\n(.*?)```", txt, re.S).group(1).strip()
    keys = re.search(r"## Mots-clés de la chaîne.*?```text\n(.*?)```", txt, re.S).group(1).strip()
    bs = c.get("brandingSettings", {}); ch = bs.setdefault("channel", {})
    ch.update({"description": desc, "keywords": " ".join(f'"{k.strip()}"' for k in keys.split(",")), "defaultLanguage": "fr", "country": "FR"})
    url = call("POST", f"{UP}/channelBanners/insert", headers=["Content-Type: image/png"], data_file="renders/banniere-youtube.png")["url"]
    bs["image"] = {"bannerExternalUrl": url}
    call("PUT", f"{API}/channels?part=brandingSettings", {"id": c["id"], "brandingSettings": bs})
    print("Description et bannière installées")

{"verifier": verifier, "fiches": fiches, "envoyer": envoyer, "publier": publier, "chaine": chaine}[sys.argv[1]]()
