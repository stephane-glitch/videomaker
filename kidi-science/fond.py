# Fond sonore discret de la série (synthèse, aucun fichier externe) : python3 -I fond.py sortie.wav [durée en secondes]
# Petite ritournelle de marimba sur une nappe douce, pensée pour rester sous les voix.
import sys, wave
import numpy as np
SR = 44100; DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 330.0
N = int(SR * DUR); out = np.zeros(N); rng = np.random.default_rng(3)
BPM = 92; beat = 60 / BPM
note = lambda n: 440 * 2 ** ((n - 69) / 12)
def pluck(f, d=0.9):
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) * np.exp(-x * 7) + 0.35 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 22)) * (1 - np.exp(-x * 900))
def add(sig, at, g):
    i = max(0, int(at * SR))
    if i >= N: return
    j = min(N, i + len(sig)); out[i:j] += sig[: j - i] * g
# quatre mesures qui tournent : do, la mineur, fa, sol (gamme pentatonique de do)
CH = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]]
PAT = [0, 2, 1, 3, 2, 1, 3, 2]
bar = 0; t = 0.0
while t < DUR:
    ch = CH[bar % 4]
    for k, idx in enumerate(PAT):
        if (bar // 4) % 4 == 3 and k % 2: continue  # une respiration toutes les 16 mesures
        add(pluck(note(ch[idx] + (12 if (bar % 8 >= 4 and k == 4) else 0))), t + k * beat / 2 + rng.uniform(-0.006, 0.006), 0.22 + 0.06 * (k % 4 == 0))
    add(pluck(note(ch[0] - 12), 1.6), t, 0.3)
    x = np.arange(int(4 * beat * SR)) / SR  # la nappe
    pad = sum(np.sin(2 * np.pi * note(n) * x + i) for i, n in enumerate(ch[:3])) * np.sin(np.pi * x / (4 * beat)) ** 0.7
    add(pad, t, 0.035)
    t += 4 * beat; bar += 1
env = np.minimum(1, np.arange(N) / (SR * 1.5)) * np.minimum(1, (N - np.arange(N)) / (SR * 3))
out = np.tanh(out * env * 1.2)
d1, d2 = int(SR * 0.19), int(SR * 0.27)
L = out.copy(); L[d1:] += out[:-d1] * 0.25; R = out.copy(); R[d2:] += out[:-d2] * 0.25
st = np.stack([L, R], axis=1); st /= np.abs(st).max() / 0.8
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype("<i2").tobytes())
