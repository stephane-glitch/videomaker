# Bande-son synthétisée (aucun fichier externe) : vent, percussions de bois, un coup de tambour, une flûte.
# Usage : python3 -I audio.py sortie.wav
import sys, wave
import numpy as np
SR, DUR = 48000, 10.0
N = int(SR * DUR); t = np.arange(N) / SR
rng = np.random.default_rng(7)
out = np.zeros(N)
def ss(a, b, x): u = np.clip((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u)
def lowpass(x, k):  # moyenne glissante répétée : filtre doux
    for _ in range(3): x = np.convolve(x, np.ones(k) / k, mode="same")
    return x
# le vent : bruit filtré dont la force suit la rafale (2,5 s → 5 s), avec un sifflement qui monte
gust = ss(2.2, 3.2, t) * (1 - 0.8 * ss(5.2, 7.8, t))
noise = rng.standard_normal(N)
low = lowpass(noise, 220); mid = lowpass(noise, 40) - lowpass(noise, 120)
out += low * 3.2 * (0.10 + 0.9 * gust) * (0.8 + 0.2 * np.sin(t * 5.1)) + mid * 1.3 * gust * (0.6 + 0.4 * np.sin(t * 3.3 + 1))
wh = np.sin(2 * np.pi * np.cumsum(520 + 260 * gust + 30 * np.sin(t * 6)) / SR)
out += wh * 0.035 * gust * (0.5 + 0.5 * np.sin(t * 2.3) ** 2)
def add(sig, at, g=1.0):
    i = int(at * SR); j = min(N, i + len(sig)); out[i:j] += sig[: j - i] * g
def wood(f, d=0.12):  # claquement de bois
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.5 * np.sin(2 * np.pi * f * 2.7 * x)) * np.exp(-x * 60)
def taiko(f=62, d=1.4):  # tambour grave
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * (f * x + 28 * (1 - np.exp(-x * 30)) / 30)) * np.exp(-x * 4.2) + 0.25 * rng.standard_normal(len(x)) * np.exp(-x * 90)
def flute(f, d, vib=5.2):  # flûte de bambou : sinus, un peu de souffle, vibrato qui s'installe
    x = np.arange(int(d * SR)) / SR
    v = 1 + 0.006 * np.sin(2 * np.pi * vib * x) * ss(0.2, 0.7, x)
    ph = 2 * np.pi * np.cumsum(f * v) / SR
    env = ss(0, 0.12, x) * (1 - ss(d - 0.35, d, x))
    breath = lowpass(rng.standard_normal(len(x)), 12) * 0.5
    return (np.sin(ph) + 0.28 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph) + breath * 0.35) * env
# percussions de bois, clairsemées, qui s'emballent avec la rafale
for at, f, g in [(0.4, 820, 0.5), (1.4, 620, 0.4), (2.1, 820, 0.45), (2.6, 980, 0.5), (2.95, 980, 0.45), (3.25, 820, 0.5), (3.5, 980, 0.5), (3.7, 1180, 0.5), (3.88, 1180, 0.55), (4.02, 1180, 0.6), (5.6, 620, 0.35), (6.6, 820, 0.35), (8.3, 620, 0.5), (8.9, 820, 0.3)]:
    add(wood(f), at, g * 0.5)
add(taiko(), 2.5, 0.55)
add(taiko(70, 1.8), 4.2, 0.9)   # la ficelle casse
add(taiko(56, 2.2), 8.3, 0.6)   # le cerf-volant se pose devant la lune
# la flûte : gamme pentatonique (ré, fa, sol, la, do), elle s'élève avec le cerf-volant
D4, F4, G4, A4, C5, D5 = 293.66, 349.23, 392.0, 440.0, 523.25, 587.33
for at, f, d, g in [(0.2, D4, 1.5, 0.5), (1.5, F4, 1.0, 0.45), (4.5, G4, 0.7, 0.5), (5.1, A4, 0.7, 0.5), (5.7, C5, 0.9, 0.55), (6.5, A4, 0.6, 0.5), (7.0, C5, 0.8, 0.55), (7.8, D5, 2.2, 0.6)]:
    add(flute(f, d), at, g * 0.32)
out *= ss(0, 0.15, t) * (1 - ss(DUR - 0.9, DUR, t))
out = np.tanh(out * 1.6) * 0.7
# un peu d'espace : deux échos courts, légèrement différents à gauche et à droite
def echo(x, ms, g): d = int(SR * ms / 1000); y = x.copy(); y[d:] += x[:-d] * g; return y
st = np.stack([echo(echo(out, 83, 0.22), 191, 0.14), echo(echo(out, 97, 0.22), 173, 0.14)], axis=1)
st /= max(1e-9, np.abs(st).max()) / 0.89
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype("<i2").tobytes())
