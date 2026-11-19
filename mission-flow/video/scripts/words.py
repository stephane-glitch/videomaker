# Convertit l'alignement par caractère d'ElevenLabs en mots horodatés (assets/vo/words.json).
import json, re
out = {}
for i in range(1, 8):
    d = json.load(open(f"assets/vo/s{i}.json"))
    a = d["alignment"]
    ch, st, en = a["characters"], a["character_start_times_seconds"], a["character_end_times_seconds"]
    s = "".join(ch)
    k = s.index("]") + 1 if s.startswith("[") else 0  # saute la balise de ton
    words, cur, t0, t1 = [], "", None, None
    for c, b, e in zip(ch[k:], st[k:], en[k:]):
        if c.isspace():
            if cur: words.append([cur, round(t0, 3), round(t1, 3)])
            cur, t0 = "", None
        else:
            if t0 is None: t0 = b
            cur += c; t1 = e
    if cur: words.append([cur, round(t0, 3), round(t1, 3)])
    out[f"s{i}"] = {"duration": round(en[-1], 3), "words": words}
json.dump(out, open("assets/vo/words.json", "w"), ensure_ascii=False)
for sid, v in out.items():
    print(sid, v["duration"], " ".join(f"{w}@{a}" for w, a, b in v["words"]))
