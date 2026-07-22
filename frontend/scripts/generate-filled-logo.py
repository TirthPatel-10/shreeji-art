"""
Shreeji Art — SA-filled.png generator

Converts the outline SA logo into a premium two-tone filled logo:
  Left  crescent region  →  Premium Gold  (#D4AF37)
  Right crescent region  →  Deep Navy     (#0F172A)
  SA letterforms         →  White         (chunky filled shapes)
  Outside circle         →  Transparent

Filling style follows the reference image (SA REFERENCE.png):
  two solid filled halves + white letter shapes in the foreground.
"""

import sys, os

# ─── Install deps ─────────────────────────────────────────────────────────────
import subprocess
subprocess.run([sys.executable, "-m", "pip", "install", "scipy", "--quiet"],
               capture_output=True)

from PIL import Image, ImageFilter
from scipy import ndimage
import numpy as np

SRC = r"C:\Users\tpate\ShreejiArt\frontend\public\SA.png"
OUT = r"C:\Users\tpate\ShreejiArt\frontend\public\SA-filled.png"

# ─── 1. Load ──────────────────────────────────────────────────────────────────
img = Image.open(SRC).convert("RGB")
arr = np.array(img, dtype=np.float32)
H, W = arr.shape[:2]
print(f"Source: {W}x{H} px")

# ─── 2. Raw stroke mask ───────────────────────────────────────────────────────
max_ch = np.max(arr, axis=2)
is_stroke_raw = max_ch < 230          # True = original ink pixel

# ─── 3. Dilated stroke mask for FLOOD FILL (seals outline gaps) ───────────────
# 8 passes ~= 8 px expansion per side; enough to close the circle + S-curve
fill_mask_img = Image.fromarray((is_stroke_raw * 255).astype(np.uint8), "L")
for _ in range(8):
    fill_mask_img = fill_mask_img.filter(ImageFilter.MaxFilter(3))
closed = np.array(fill_mask_img) > 127          # True = sealed boundary

# ─── 4. Connected-component labeling of non-stroke regions ───────────────────
labeled, num = ndimage.label(~closed)
sizes = np.bincount(labeled.ravel())
sizes[0] = 0                                     # ignore label 0 (stroke pixels)

print(f"Connected regions: {num}")
for i in np.argsort(sizes)[::-1][:8]:
    if sizes[i] == 0: continue
    ys, xs = np.where(labeled == i)
    print(f"  Region {i}: {sizes[i]:>8} px  centroid=({xs.mean():.0f}, {ys.mean():.0f})")

# ─── 5. Identify outside vs inner regions ────────────────────────────────────
sorted_by_size = np.argsort(sizes)[::-1]

outside_id = int(sorted_by_size[0])              # largest = surrounding background
min_inner  = H * W * 0.002                       # ignore regions < 0.2 % of canvas
inner_ids  = [int(i) for i in sorted_by_size[1:]
              if sizes[i] > min_inner]

print(f"\nOutside region  : {outside_id}  ({sizes[outside_id]} px)")
print(f"Inner candidates: {[(i, int(sizes[i])) for i in inner_ids[:6]]}")

# ─── 6. Assign Left / Right by centroid X ────────────────────────────────────
centroids = []
for rid in inner_ids[:6]:
    ys, xs = np.where(labeled == rid)
    centroids.append((rid, float(xs.mean()), float(ys.mean())))
centroids.sort(key=lambda t: t[1])              # ascending X

left_id  = centroids[0][0]  if centroids           else None
right_id = centroids[-1][0] if len(centroids) > 1  else None

print(f"\nLeft  region : {left_id}  (cx = {centroids[0][1]:.0f})")
if right_id:
    print(f"Right region : {right_id}  (cx = {centroids[-1][1]:.0f})")

# ─── 7. Thick white letter mask ───────────────────────────────────────────────
# 14 dilation passes → ~28 px wide strokes (chunky filled letterforms like reference)
letter_img = Image.fromarray((is_stroke_raw * 255).astype(np.uint8), "L")
for _ in range(14):
    letter_img = letter_img.filter(ImageFilter.MaxFilter(3))
letter_img = letter_img.filter(ImageFilter.GaussianBlur(radius=2.5))
letter_mask = np.array(letter_img) > 60          # True = white letter pixel

# ─── 8. Build RGBA output ─────────────────────────────────────────────────────
GOLD  = (212, 175,  55, 255)   # #D4AF37  — left crescent
NAVY  = ( 15,  23,  42, 255)   # #0F172A  — right crescent
WHITE = (255, 255, 255, 255)   # SA letters
TRANS = (  0,   0,   0,   0)   # outside

out = np.zeros((H, W, 4), dtype=np.uint8)       # default: transparent

# Fill inner regions (any unrecognised inner region → gold)
for rid, cx, cy in centroids:
    out[labeled == rid] = GOLD

# Override: left → Gold, right → Navy
if left_id  is not None: out[labeled == left_id]  = GOLD
if right_id is not None: out[labeled == right_id] = NAVY

# Overlay white letterforms on top of fills
out[letter_mask] = WHITE

# Make sure outside stays transparent
out[labeled == outside_id] = TRANS

# ─── 9. Save ──────────────────────────────────────────────────────────────────
Image.fromarray(out, "RGBA").save(OUT)
print(f"\nSaved: {OUT}")
