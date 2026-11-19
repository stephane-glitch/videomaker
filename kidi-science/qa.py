# Contrôle d'un rendu : durée, niveau sonore, texte réellement prononcé (comparé au dialogue), planche-contact.
# Usage (depuis le dossier video/ d'un épisode) : python3 -I ../../qa.py renders/fichier.mp4 dossier_de_sortie
import json, re, subprocess, sys, unicodedata, difflib
mp4, out = sys.argv[1], sys.argv[2]
run = lambda *a: subprocess.run(a, capture_output=True, text=True)
print("durée", run("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4).stdout.strip(), "s")
ln = run("ffmpeg", "-hide_banner", "-i", mp4, "-af", "loudnorm=print_format=summary", "-f", "null", "-").stderr
print(" | ".join(l.strip() for l in ln.splitlines() if "Input Integrated" in l or "Input True Peak" in l))
run("ffmpeg", "-loglevel", "error", "-y", "-i", mp4, "-vf", "fps=1/4.4,scale=320:-2,tile=9x6", "-frames:v", "1", "-q:v", "3", f"{out}/sheet.jpg")
run("ffmpeg", "-loglevel", "error", "-y", "-i", mp4, "-vn", "-ac", "1", "-b:a", "64k", f"{out}/mix.mp3")
r = run("curl", "-s", "-X", "POST", "https://api.elevenlabs.io/v1/speech-to-text", "-F", "model_id=scribe_v1", "-F", "language_code=fr", "-F", f"file=@{out}/mix.mp3").stdout
def norm(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]", " ", s).split()
heard = norm(re.sub(r"\[[^\]]*\]|\([^)]*\)", " ", json.loads(r).get("text", "")))
want = norm(" ".join(l["text"] for l in json.load(open("src/dialogue.json"))))
sm = difflib.SequenceMatcher(None, want, heard, autojunk=False)
print(f"texte : {len(want)} mots attendus, {len(heard)} entendus, ressemblance {sm.ratio():.3f}")
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag != "equal": print("  ", " ".join(want[max(0, i1 - 2):i1]), "[", " ".join(want[i1:i2]), "→", " ".join(heard[j1:j2]), "]")
