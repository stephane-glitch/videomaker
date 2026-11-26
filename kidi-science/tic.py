# Petit « tic » de bois pour les apparitions à l'écran (synthèse) : python3 -I tic.py sortie.wav
import sys, wave
import numpy as np
SR = 44100; x = np.arange(int(0.16 * SR)) / SR
s = (np.sin(2 * np.pi * 1320 * x) + 0.5 * np.sin(2 * np.pi * 2640 * x)) * np.exp(-x * 55) * (1 - np.exp(-x * 2000))
s = (s / np.abs(s).max() * 0.7 * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes())
