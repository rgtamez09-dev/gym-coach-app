"""Generate valid PWA icons (dumbbell glyph on brand accent) for Gym Coach.

Run: python scripts/generate-icons.py
Outputs to public/: pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png (180).

The previous icons were produced by a hand-rolled PNG encoder that emitted a
corrupt data stream — valid header, broken pixels. iOS could not decode them,
so "Add to Home Screen" showed a blank icon and silently failed. Pillow encodes
spec-compliant PNGs, fixing the install.
"""
from PIL import Image, ImageDraw

ACCENT = (134, 59, 255)   # #863bff
WHITE = (255, 255, 255)


def draw_dumbbell(size, with_alpha):
    mode = "RGBA" if with_alpha else "RGB"
    bg = ACCENT + ((255,) if with_alpha else ())
    img = Image.new(mode, (size, size), bg)
    d = ImageDraw.Draw(img)
    s = size

    def rr(x0, y0, x1, y1, radius):
        d.rounded_rectangle([x0 * s, y0 * s, x1 * s, y1 * s], radius=radius * s, fill=WHITE)

    # handle bar
    rr(0.34, 0.45, 0.66, 0.55, 0.03)
    # outer plates
    rr(0.20, 0.30, 0.30, 0.70, 0.04)
    rr(0.70, 0.30, 0.80, 0.70, 0.04)
    # inner plates
    rr(0.30, 0.37, 0.37, 0.63, 0.03)
    rr(0.63, 0.37, 0.70, 0.63, 0.03)
    return img


targets = [
    ("public/pwa-192x192.png", 192, True),
    ("public/pwa-512x512.png", 512, True),
    ("public/apple-touch-icon.png", 180, False),  # iOS: opaque, no alpha
]

for path, size, alpha in targets:
    img = draw_dumbbell(size, alpha)
    img.save(path, "PNG")
    # validate round-trip
    chk = Image.open(path)
    chk.load()
    print(f"OK  {path}  {chk.size}  {chk.mode}")
