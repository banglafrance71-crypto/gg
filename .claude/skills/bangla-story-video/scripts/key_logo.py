"""Remove a flat background colour from a client logo and save a transparent PNG.
Usage: python3 key_logo.py <logo.png> <out.png> [--crop x0,y0,x1,y1 name ...]
Samples the background from the top-left pixel; soft edge so anti-aliasing survives.
Extra --crop boxes (in original pixel coords) save separate parts (e.g. icon, wordmark)
so they can be animated individually."""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = np.array(Image.open(src).convert("RGB")).astype(float)
bg = im[2, 2]
d = np.sqrt(((im - bg) ** 2).sum(-1))
a = np.clip((d - 12) / 40, 0, 1)
rgb = np.where(a[..., None] > 0, (im - bg * (1 - a[..., None])) / np.maximum(a[..., None], 1e-3), 0)
img = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), a * 255]).astype(np.uint8), "RGBA")
img.crop(img.getbbox()).save(out)
print("full", out, img.getbbox())
args = sys.argv[3:]
while args and args[0] == "--crop":
    box = tuple(int(v) for v in args[1].split(","))
    name = args[2]
    part = img.crop(box)
    part = part.crop(part.getbbox())
    part.save(name)
    print("part", name, part.size)
    args = args[3:]
