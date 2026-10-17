"""Synthesise the whole soundtrack (music + effects) for the face voyage, 24 s, 48 kHz."""
import numpy as np, wave, sys
SR = 48000
DUR = 24.0
N = int(SR * DUR)
rng = np.random.default_rng(3)
mix = np.zeros((N, 2))
t_all = np.arange(N) / SR

def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR); j = min(N, i + len(sig)); s = sig[: j - i] * gain
    mix[i:j, 0] += s * (1 - max(0, pan)); mix[i:j, 1] += s * (1 + min(0, pan))

def env(n, a, r):
    e = np.ones(n); a = int(a * SR); r = int(r * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r)
    return e

def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); acc = 0.0
    for k in range(len(x)):
        acc = (1 - a) * x[k] + a * acc; y[k] = acc
    return y

def onepole_var(x, cuts):
    y = np.zeros_like(x); acc = 0.0
    for k in range(len(x)):
        a = np.exp(-2 * np.pi * cuts[k] / SR); acc = (1 - a) * x[k] + a * acc; y[k] = acc
    return y

def note(f): return 440 * 2 ** ((f - 69) / 12)

# ---- space pad: slow chords, detuned saws softened (0 - 17.2 s)
chords = [[57, 64, 69, 72], [53, 60, 65, 69], [48, 55, 64, 67], [55, 62, 67, 71]]
cl = 17.2 / 4
for ci, ch in enumerate(chords):
    n = int((cl + 1.2) * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for m in ch:
        for det in (-0.12, 0.0, 0.11):
            f = note(m) * 2 ** (det / 12)
            s += 2 * ((tt * f) % 1) - 1
    s = lowpass(s / 12, 900) * env(n, 0.9, 1.2)
    add(s, ci * cl, 0.22, pan=(-0.3 if ci % 2 else 0.3))
# sub pulse
n = int(17.2 * SR); tt = np.arange(n) / SR
add(np.sin(2 * np.pi * 55 * tt) * (0.5 + 0.5 * np.sin(2 * np.pi * 1.5 * tt)) ** 2 * env(n, 1.0, 1.0), 0, 0.10)
# twinkle arpeggio
for k in range(40):
    at = 0.4 + k * 0.42
    if at > 16.5: break
    m = [81, 84, 88, 86, 79, 83][k % 6]; n = int(0.5 * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt * 7), at, 0.05, pan=np.sin(k))

# ---- whooshes for each planet pass
def whoosh(d=1.6, f0=300, f1=3000):
    n = int(d * SR); x = rng.normal(0, 1, n); tt = np.linspace(0, 1, n)
    cuts = f0 + (f1 - f0) * np.sin(np.pi * tt) ** 2
    return onepole_var(x, cuts) * np.sin(np.pi * tt) ** 2
for at, pan in [(2.6, -0.7), (6.6, 0.7), (10.2, -0.7)]:
    add(whoosh(), at, 0.35, pan)

# ---- atmosphere entry: roar + crackle (15.3 - 17.1)
n = int(1.9 * SR); x = rng.normal(0, 1, n); tt = np.arange(n) / SR
roar = lowpass(x, 500) * env(n, 0.6, 0.15) * (1 + 0.3 * np.sin(2 * np.pi * 9 * tt))
crk = (rng.random(n) > 0.9985) * rng.normal(0, 1, n); crk = lowpass(crk, 3000) * 3
add(roar * 1.6 + crk * env(n, 0.3, 0.2), 15.25, 0.55)
# boom at the flash
n = int(1.6 * SR); tt = np.arange(n) / SR
boom = np.sin(2 * np.pi * (70 * tt - 15 * tt ** 2)) * np.exp(-tt * 3) + lowpass(rng.normal(0, 1, n), 250) * np.exp(-tt * 4) * 1.5
add(boom, 16.95, 0.6)

# ---- falling whistle (17.4 - 19.45)
n = int(2.05 * SR); tt = np.arange(n) / SR; f = 1800 - 1100 * (tt / tt[-1]) ** 1.3
ph = 2 * np.pi * np.cumsum(f) / SR
add(np.sin(ph) * env(n, 0.3, 0.05) * 0.8, 17.4, 0.18)

# ---- landing: thump + cartoon boing (19.5)
n = int(0.9 * SR); tt = np.arange(n) / SR
thump = np.sin(2 * np.pi * (90 * tt - 30 * tt ** 2)) * np.exp(-tt * 9) + lowpass(rng.normal(0, 1, n), 600) * np.exp(-tt * 14)
add(thump, 19.5, 0.9)
n = int(0.8 * SR); tt = np.arange(n) / SR
fb = 220 + 120 * np.sin(2 * np.pi * 7 * tt) * np.exp(-tt * 3)
add(np.sin(2 * np.pi * np.cumsum(fb) / SR) * np.exp(-tt * 4), 19.55, 0.35)

# ---- city: neon buzz (19.7 - 24) and a door chime (21.0)
n = int(4.3 * SR); tt = np.arange(n) / SR
buzz = (np.sign(np.sin(2 * np.pi * 100 * tt)) * 0.3 + np.sin(2 * np.pi * 200 * tt)) * env(n, 0.05, 0.3)
flick = np.ones(n); flick[: int(0.8 * SR)] *= (np.sin(2 * np.pi * 13 * tt[: int(0.8 * SR)]) > 0)
add(lowpass(buzz * flick, 1200), 19.7, 0.035)
for k, m in enumerate([88, 84, 79]):
    n = int(1.6 * SR); tt = np.arange(n) / SR
    add((np.sin(2 * np.pi * note(m) * tt) + 0.3 * np.sin(2 * np.pi * note(m) * 2.76 * tt)) * np.exp(-tt * 2.5), 21.0 + k * 0.12, 0.12)

# ---- city music: pentatonic plucks (guzheng-ish, Karplus-Strong) 19.9 - 24
def pluck(f, d=1.4):
    n = int(d * SR); L = int(SR / f); buf = rng.uniform(-1, 1, L); out = np.zeros(n)
    for k in range(n):
        out[k] = buf[k % L]; buf[k % L] = 0.996 * 0.5 * (buf[k % L] + buf[(k + 1) % L])
    return out
mel = [69, 72, 74, 76, 79, 76, 74, 72, 74, 69, 67, 69]
for k, m in enumerate(mel):
    at = 20.0 + k * 0.33
    if at > 23.4: break
    add(pluck(note(m)), at, 0.28, pan=0.25 * np.sin(k))
for k, m in enumerate([45, 52, 45, 52]):
    add(pluck(note(m), 2.0), 20.0 + k * 1.0, 0.25)

# master: soft clip, normalise, fade
mix *= 0.9 / max(1e-6, np.abs(mix).max())
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))[:, None]
pcm = (mix * 32000).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
