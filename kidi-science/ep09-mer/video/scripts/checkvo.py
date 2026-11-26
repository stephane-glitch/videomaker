# Retranscrit chaque réplique (ElevenLabs Scribe) et liste celles dont les mots diffèrent du texte.
import json, re, subprocess, sys, unicodedata, difflib
def norm(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]", " ", s).split()
bad = 0
for l in json.load(open("src/dialogue.json")):
    if len(sys.argv) > 1 and l["id"] not in sys.argv[1:]: continue
    out = subprocess.run(["curl", "-s", "-X", "POST", "https://api.elevenlabs.io/v1/speech-to-text", "-F", "model_id=scribe_v1", "-F", "language_code=fr", "-F", f"file=@assets/vo/{l['id']}.mp3"], capture_output=True, text=True).stdout
    try: t = json.loads(out).get("text", "")
    except Exception: t = "?? " + out[:80]
    t = re.sub(r"\[[^\]]*\]|\([^)]*\)", " ", t)
    a, b = norm(l["text"]), norm(t)
    r = difflib.SequenceMatcher(None, a, b).ratio()
    if r < 0.999:
        bad += 1
        d = [f"{' '.join(a[i1:i2])}→{' '.join(b[j1:j2])}" for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes() if tag != "equal"]
        print(l["id"], f"{r:.2f}", " | ".join(d))
print("répliques à vérifier :", bad)
