"""Build the five evolution silhouettes as outline strokes for the light to draw.

Each pose is a 2D skeleton of capsules (side view, facing +x, metres, feet at y=0).
The union is rasterised, its outer contour extracted, simplified, and written to
strokes.json together with the floor connectors and the timing of every stroke.
"""
import json, math
import numpy as np
from PIL import Image, ImageDraw
from skimage import measure

PX = 400  # pixels per metre for rasterising

def cap(d, a, b, r, ox, oy):
    (x1, y1), (x2, y2) = a, b
    P = lambda x, y: (ox + x * PX, oy - y * PX)
    d.line([P(x1, y1), P(x2, y2)], fill=255, width=int(2 * r * PX))
    for x, y in (a, b):
        cx, cy = P(x, y); rr = r * PX
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=255)

def ell(d, c, rx, ry, ox, oy, rot=0):
    pts = []
    for k in range(48):
        t = 2 * math.pi * k / 48
        x, y = rx * math.cos(t), ry * math.sin(t)
        xr = x * math.cos(rot) - y * math.sin(rot); yr = x * math.sin(rot) + y * math.cos(rot)
        pts.append((ox + (c[0] + xr) * PX, oy - (c[1] + yr) * PX))
    d.polygon(pts, fill=255)

def poly(d, pts, ox, oy):
    d.polygon([(ox + x * PX, oy - y * PX) for x, y in pts], fill=255)

# --- poses -----------------------------------------------------------------
def ape(d, ox, oy):  # knuckle-walking on all fours
    cap(d, (0.0, 0.62), (0.55, 0.78), 0.17, ox, oy)            # torso
    ell(d, (0.82, 0.80), 0.15, 0.13, ox, oy)                    # head
    cap(d, (0.62, 0.80), (0.74, 0.80), 0.09, ox, oy)            # neck
    ell(d, (0.95, 0.76), 0.07, 0.06, ox, oy)                    # muzzle
    cap(d, (0.0, 0.6), (0.12, 0.33), 0.09, ox, oy); cap(d, (0.12, 0.33), (0.02, 0.03), 0.07, ox, oy)
    cap(d, (-0.02, 0.6), (-0.14, 0.32), 0.09, ox, oy); cap(d, (-0.14, 0.32), (-0.22, 0.03), 0.07, ox, oy)
    poly(d, [(-0.06, 0.0), (0.12, 0.0), (0.06, 0.06), (-0.04, 0.06)], ox, oy)
    poly(d, [(-0.30, 0.0), (-0.12, 0.0), (-0.16, 0.06), (-0.26, 0.06)], ox, oy)
    cap(d, (0.55, 0.76), (0.66, 0.40), 0.08, ox, oy); cap(d, (0.66, 0.40), (0.70, 0.05), 0.065, ox, oy)
    cap(d, (0.48, 0.74), (0.44, 0.40), 0.08, ox, oy); cap(d, (0.44, 0.40), (0.50, 0.05), 0.065, ox, oy)
    ell(d, (0.71, 0.05), 0.07, 0.05, ox, oy); ell(d, (0.51, 0.05), 0.07, 0.05, ox, oy)

def australo(d, ox, oy):  # hunched, bent knees, long arms
    cap(d, (0.0, 0.66), (0.16, 1.02), 0.15, ox, oy)
    cap(d, (0.16, 1.02), (0.26, 1.12), 0.07, ox, oy)
    ell(d, (0.30, 1.18), 0.12, 0.11, ox, oy); ell(d, (0.40, 1.15), 0.06, 0.05, ox, oy)
    cap(d, (0.02, 0.64), (0.12, 0.34), 0.08, ox, oy); cap(d, (0.12, 0.34), (0.06, 0.04), 0.065, ox, oy)
    cap(d, (-0.02, 0.64), (-0.08, 0.34), 0.08, ox, oy); cap(d, (-0.08, 0.34), (-0.18, 0.05), 0.065, ox, oy)
    poly(d, [(0.0, 0.0), (0.20, 0.0), (0.12, 0.06), (0.02, 0.07)], ox, oy)
    poly(d, [(-0.26, 0.0), (-0.08, 0.0), (-0.12, 0.07), (-0.22, 0.07)], ox, oy)
    cap(d, (0.16, 0.98), (0.26, 0.72), 0.065, ox, oy); cap(d, (0.26, 0.72), (0.32, 0.46), 0.055, ox, oy)
    cap(d, (0.10, 0.98), (0.06, 0.72), 0.065, ox, oy); cap(d, (0.06, 0.72), (0.02, 0.48), 0.055, ox, oy)

def erectus(d, ox, oy):  # upright walker with a spear
    cap(d, (0.0, 0.92), (0.05, 1.38), 0.14, ox, oy)
    cap(d, (0.05, 1.38), (0.10, 1.50), 0.06, ox, oy)
    ell(d, (0.13, 1.58), 0.10, 0.11, ox, oy); ell(d, (0.21, 1.55), 0.04, 0.04, ox, oy)
    cap(d, (0.03, 0.9), (0.14, 0.48), 0.075, ox, oy); cap(d, (0.14, 0.48), (0.20, 0.05), 0.06, ox, oy)
    cap(d, (-0.03, 0.9), (-0.10, 0.48), 0.075, ox, oy); cap(d, (-0.10, 0.48), (-0.26, 0.07), 0.06, ox, oy)
    poly(d, [(0.14, 0.0), (0.34, 0.0), (0.26, 0.06), (0.16, 0.07)], ox, oy)
    poly(d, [(-0.34, 0.02), (-0.18, 0.0), (-0.20, 0.08), (-0.30, 0.09)], ox, oy)
    cap(d, (0.07, 1.34), (0.22, 1.12), 0.06, ox, oy); cap(d, (0.22, 1.12), (0.36, 1.06), 0.05, ox, oy)
    cap(d, (0.02, 1.34), (-0.08, 1.10), 0.06, ox, oy); cap(d, (-0.08, 1.10), (-0.14, 0.88), 0.05, ox, oy)
    cap(d, (0.30, 0.05), (0.44, 1.95), 0.018, ox, oy)                       # spear shaft
    poly(d, [(0.43, 1.92), (0.48, 1.92), (0.47, 2.10)], ox, oy)              # spear tip

def torch(d, ox, oy):  # upright, torch raised forward
    cap(d, (0.0, 0.94), (0.04, 1.42), 0.14, ox, oy)
    cap(d, (0.04, 1.42), (0.08, 1.54), 0.06, ox, oy)
    ell(d, (0.10, 1.63), 0.10, 0.115, ox, oy)
    cap(d, (0.03, 0.92), (0.16, 0.50), 0.075, ox, oy); cap(d, (0.16, 0.50), (0.24, 0.05), 0.06, ox, oy)
    cap(d, (-0.03, 0.92), (-0.12, 0.50), 0.075, ox, oy); cap(d, (-0.12, 0.50), (-0.30, 0.08), 0.06, ox, oy)
    poly(d, [(0.18, 0.0), (0.38, 0.0), (0.30, 0.06), (0.20, 0.07)], ox, oy)
    poly(d, [(-0.38, 0.03), (-0.22, 0.0), (-0.24, 0.09), (-0.34, 0.10)], ox, oy)
    cap(d, (0.07, 1.38), (0.26, 1.46), 0.06, ox, oy); cap(d, (0.26, 1.46), (0.36, 1.68), 0.05, ox, oy)
    cap(d, (0.01, 1.36), (-0.10, 1.12), 0.06, ox, oy); cap(d, (-0.10, 1.12), (-0.12, 0.88), 0.05, ox, oy)
    cap(d, (0.33, 1.58), (0.42, 1.98), 0.03, ox, oy)                         # torch stick

def sapiens(d, ox, oy):  # modern, tall long stride, arms swinging
    cap(d, (0.0, 0.98), (0.0, 1.46), 0.13, ox, oy)
    cap(d, (0.0, 1.46), (0.03, 1.58), 0.055, ox, oy)
    ell(d, (0.04, 1.68), 0.095, 0.115, ox, oy)
    cap(d, (0.02, 0.96), (0.18, 0.52), 0.075, ox, oy); cap(d, (0.18, 0.52), (0.30, 0.05), 0.058, ox, oy)
    cap(d, (-0.02, 0.96), (-0.14, 0.52), 0.075, ox, oy); cap(d, (-0.14, 0.52), (-0.36, 0.10), 0.058, ox, oy)
    poly(d, [(0.24, 0.0), (0.46, 0.0), (0.38, 0.06), (0.26, 0.07)], ox, oy)
    poly(d, [(-0.46, 0.06), (-0.30, 0.02), (-0.30, 0.11), (-0.40, 0.13)], ox, oy)
    cap(d, (0.03, 1.40), (0.16, 1.16), 0.055, ox, oy); cap(d, (0.16, 1.16), (0.30, 1.00), 0.048, ox, oy)
    cap(d, (-0.02, 1.40), (-0.16, 1.18), 0.055, ox, oy); cap(d, (-0.16, 1.18), (-0.24, 0.96), 0.048, ox, oy)

def contour(fn):
    W, H = int(2.4 * PX), int(2.4 * PX); ox, oy = 1.0 * PX, 2.3 * PX
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im); fn(d, ox, oy)
    from PIL import ImageFilter
    im = im.filter(ImageFilter.GaussianBlur(9)).point(lambda v: 255 if v > 110 else 0)
    a = np.asarray(im) > 127
    cs = measure.find_contours(a.astype(float), 0.5)
    c = max(cs, key=len)
    c = measure.approximate_polygon(c, tolerance=2.0)
    pts = [((col - ox) / PX, (oy - row) / PX) for row, col in c]
    if pts[0] == pts[-1]: pts = pts[:-1]
    # start at the rear-most point touching the floor, keep a consistent winding
    floor = [i for i, p in enumerate(pts) if p[1] < 0.04]
    s = min(floor, key=lambda i: pts[i][0])
    pts = pts[s:] + pts[:s] + [pts[s]]
    return pts, im

FIGS = [("ape", ape), ("australopithecus", australo), ("erectus", erectus), ("torch", torch), ("sapiens", sapiens)]
if __name__ == "__main__":
    import sys
    out = {"figures": []}
    sheet = Image.new("L", (5 * 480, 480), 0)
    for i, (name, fn) in enumerate(FIGS):
        pts, im = contour(fn)
        out["figures"].append({"name": name, "points": [[round(x, 4), round(y, 4)] for x, y in pts]})
        sheet.paste(im.resize((480, 480)), (i * 480, 0))
        print(name, len(pts), "pts")
    open(sys.argv[1], "w").write("window.EVOLUTION_FIGURES = " + json.dumps(out) + ";\n")
    sheet.save(sys.argv[2])
