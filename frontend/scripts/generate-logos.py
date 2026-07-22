"""
Shreeji Art logo colorizer — premium filled version.

Process:
1. Extract stroke mask from white-background PNG
2. Dilate strokes substantially so thin outlines become bold filled marks
3. Add soft outer glow for luminous depth
4. Colorize to gold (#D4AF37) with two-tone treatment (SA letters richer than ring)
5. Save multiple versions with transparent backgrounds
"""

import sys, os
sys.stdout.reconfigure(encoding="utf-8")

from PIL import Image, ImageFilter, ImageDraw
import numpy as np

SRC = r"C:\Users\tpate\ShreejiArt\frontend\public\SA.png"
OUT = r"C:\Users\tpate\ShreejiArt\frontend\public"

# ─── Load ─────────────────────────────────────────────────────────────────────
src = Image.open(SRC).convert("RGB")
arr = np.array(src, dtype=np.float32)  # shape: (H, W, 3)
H, W = arr.shape[:2]

r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

# ─── Stroke isolation ─────────────────────────────────────────────────────────
# "darkness" = deviation from pure white (0 = white, 1 = fully dark)
max_rgb = np.max(arr, axis=2)
darkness = np.clip(1.0 - (max_rgb / 255.0), 0, 1)

# Binary stroke mask for dilation (threshold at 5% darkness to avoid noise)
stroke_bin = (darkness > 0.05).astype(np.uint8) * 255
stroke_img = Image.fromarray(stroke_bin, "L")

# ─── Dilation: thin outlines → bold filled marks ──────────────────────────────
# MaxFilter(3) expands the mask by 1px per pass.
# For a 1254px image with ~6px strokes, 10 passes → ~16px strokes (chunky, filled look)
DILATION_PASSES = 10
for _ in range(DILATION_PASSES):
    stroke_img = stroke_img.filter(ImageFilter.MaxFilter(3))

# Smooth the dilated mask edges with a gentle Gaussian
stroke_img = stroke_img.filter(ImageFilter.GaussianBlur(radius=2))
dilated = np.array(stroke_img, dtype=np.float32) / 255.0  # 0..1

# ─── Outer glow layer ─────────────────────────────────────────────────────────
# Blur the dilated mask further to create a wide soft halo
glow_img = stroke_img.filter(ImageFilter.GaussianBlur(radius=18))
glow_arr = np.array(glow_img, dtype=np.float32) / 255.0

# ─── Stroke-type classification ───────────────────────────────────────────────
# Classify at the ORIGINAL resolution to separate SA letters from outer ring
total = r + g + b + 1e-6
b_ratio = b / total
is_blue_orig = (b_ratio > 0.37) & (darkness > 0.05)
is_gray_orig = (~is_blue_orig) & (darkness > 0.05)

# Expand both masks to dilated region using the dilation mask
is_blue_exp = is_blue_orig  # used for classification lookup
# For each dilated pixel, check original proximity (nearest-neighbor approximation)
# Since dilation is uniform, pixels that were blue stay "blue-dominant" in classification.
# We use a blurred blue-mask to spread the blue classification into the dilated area.
blue_mask_img = Image.fromarray((is_blue_orig.astype(np.float32) * 255).astype(np.uint8), "L")
for _ in range(DILATION_PASSES):
    blue_mask_img = blue_mask_img.filter(ImageFilter.MaxFilter(3))
blue_region = np.array(blue_mask_img, dtype=np.float32) / 255.0  # 0..1, smooth

# ─── Color palette ────────────────────────────────────────────────────────────
# SA letters: premium gold
GOLD_RICH  = np.array([212, 175,  55], dtype=np.float32)  # #D4AF37
# Outer ring: lighter gold (slightly cooler, creates depth)
GOLD_RING  = np.array([196, 162,  80], dtype=np.float32)  # #C4A250
# Glow: warm amber
GLOW_COLOR = np.array([200, 155,  30], dtype=np.float32)  # dim amber glow

# ─── Build RGBA image ─────────────────────────────────────────────────────────
def blend_colors(mask_blue):
    """Blend between ring gold and rich gold based on how 'blue' a region is."""
    m = np.clip(mask_blue, 0, 1)[:, :, np.newaxis]
    return GOLD_RING * (1 - m) + GOLD_RICH * m

def make_logo(letter_alpha_scale=1.0, ring_alpha_scale=0.85):
    color = blend_colors(blue_region)                 # (H,W,3)

    # Alpha: dilated stroke at full opacity, ring region slightly less
    # blue_region tells us how "SA-letter-ish" each pixel is
    alpha_scale = ring_alpha_scale + (letter_alpha_scale - ring_alpha_scale) * np.clip(blue_region, 0, 1)
    alpha = np.clip(dilated * alpha_scale * 255, 0, 255)

    # Assemble RGBA
    rgba = np.zeros((H, W, 4), dtype=np.float32)
    rgba[:, :, :3] = color
    rgba[:, :,  3] = alpha
    return rgba

# ─── Glow overlay (half-opacity warm amber beneath logo) ──────────────────────
def add_glow(rgba_arr, glow_strength=0.38):
    glow_rgba = np.zeros((H, W, 4), dtype=np.float32)
    glow_rgba[:, :, 0] = GLOW_COLOR[0]
    glow_rgba[:, :, 1] = GLOW_COLOR[1]
    glow_rgba[:, :, 2] = GLOW_COLOR[2]
    glow_rgba[:, :, 3] = glow_arr * glow_strength * 255

    # Alpha-composite glow UNDER the logo (glow_rgba, then logo on top)
    glow_img_pil = Image.fromarray(np.clip(glow_rgba, 0, 255).astype(np.uint8), "RGBA")
    logo_img_pil = Image.fromarray(np.clip(rgba_arr, 0, 255).astype(np.uint8), "RGBA")
    # Composite: place logo over glow
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    base = Image.alpha_composite(base, glow_img_pil)
    base = Image.alpha_composite(base, logo_img_pil)
    return np.array(base, dtype=np.float32)

# ─── Version 1: SA-colored.png — Gold on transparent with glow ──────────────
logo_rgba = make_logo()
logo_with_glow = add_glow(logo_rgba, glow_strength=0.4)
Image.fromarray(np.clip(logo_with_glow, 0, 255).astype(np.uint8), "RGBA").save(
    os.path.join(OUT, "SA-colored.png")
)
print("OK SA-colored.png  (gold on transparent, with glow)")

# ─── Version 2: SA-white.png — White on transparent ─────────────────────────
def make_single_color(rgb, alpha_scale=1.0, add_glow_flag=False):
    rgba = np.zeros((H, W, 4), dtype=np.float32)
    rgba[:, :, 0] = rgb[0]
    rgba[:, :, 1] = rgb[1]
    rgba[:, :, 2] = rgb[2]
    rgba[:, :, 3] = np.clip(dilated * alpha_scale * 255, 0, 255)
    if add_glow_flag:
        rgba = add_glow(rgba, glow_strength=0.25)
    return Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA")

make_single_color(np.array([255, 255, 255], dtype=np.float32)).save(
    os.path.join(OUT, "SA-white.png")
)
print("OK SA-white.png    (white on transparent)")

# ─── Version 3: SA-navy.png — Navy/silver on transparent ─────────────────────
navy_rgba = np.zeros((H, W, 4), dtype=np.float32)
navy_rgba[:, :, 0] = np.where(blue_region > 0.5, 15,  55)   # navy vs dark blue
navy_rgba[:, :, 1] = np.where(blue_region > 0.5, 23,  65)
navy_rgba[:, :, 2] = np.where(blue_region > 0.5, 42, 120)
navy_rgba[:, :, 3] = np.clip(dilated * 255, 0, 255)
Image.fromarray(np.clip(navy_rgba, 0, 255).astype(np.uint8), "RGBA").save(
    os.path.join(OUT, "SA-navy.png")
)
print("OK SA-navy.png     (navy on transparent)")

# ─── Version 4: SA-fullcolor.png — Navy circle + gold SA ─────────────────────
badge = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(badge)
draw.ellipse([0, 0, W - 1, H - 1], fill=(10, 18, 38, 255))   # deep navy
colored_logo = Image.fromarray(np.clip(logo_with_glow, 0, 255).astype(np.uint8), "RGBA")
badge = Image.alpha_composite(badge, colored_logo)
badge.save(os.path.join(OUT, "SA-fullcolor.png"))
print("OK SA-fullcolor.png (navy circle + gold mark)")

print("\nAll logo versions generated successfully.")
