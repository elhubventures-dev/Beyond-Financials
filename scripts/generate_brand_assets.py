"""Generate logo, favicon, and OG image assets from logo_BF.png."""

from pathlib import Path
from PIL import Image

SRC = Path(r"F:\PROJECTS\Away\BEYOND FINANCIALS\logo_BF.png")
OUT = Path(__file__).resolve().parents[1] / "public"


def is_bg(r: int, g: int, b: int) -> bool:
    """Treat textured near-white / light grey as background."""
    if min(r, g, b) >= 210 and max(r, g, b) - min(r, g, b) <= 18:
        return True
    if (
        min(r, g, b) >= 200
        and abs(r - g) <= 12
        and abs(g - b) <= 12
        and abs(r - b) <= 12
    ):
        return True
    return False


def make_transparent(img: Image.Image) -> Image.Image:
    img = img.copy().convert("RGBA")
    pixels = img.load()
    width, height = img.size
    for y in range(height):
        for x in range(width):
            r, g, b, _a = pixels[x, y]
            if is_bg(r, g, b):
                pixels[x, y] = (r, g, b, 0)
    return img


def content_bbox(img: Image.Image, alpha_thresh: int = 10):
    pixels = img.load()
    width, height = img.size
    cmin, rmin, cmax, rmax = width, height, 0, 0
    found = False
    for y in range(height):
        for x in range(width):
            if pixels[x, y][3] > alpha_thresh:
                found = True
                cmin = min(cmin, x)
                rmin = min(rmin, y)
                cmax = max(cmax, x)
                rmax = max(rmax, y)
    if not found:
        return (0, 0, width, height)
    return (cmin, rmin, cmax + 1, rmax + 1)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    original = Image.open(SRC).convert("RGBA")
    transparent = make_transparent(original)
    bbox = content_bbox(transparent)
    full = transparent.crop(bbox)
    full.save(OUT / "logo.png", optimize=True)
    print("logo.png", full.size)

    # Icon: left mark only (approx. original x 94–560)
    icon_left = max(0, 94 - bbox[0])
    icon_right = min(full.size[0], 560 - bbox[0])
    icon_region = full.crop((icon_left, 0, icon_right, full.size[1]))
    icon = icon_region.crop(content_bbox(icon_region))

    side = max(icon.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(
        icon,
        ((side - icon.size[0]) // 2, (side - icon.size[1]) // 2),
        icon,
    )
    square.save(OUT / "logo-icon.png", optimize=True)
    print("logo-icon.png", square.size)

    for size, name in [
        (16, "favicon-16x16.png"),
        (32, "favicon-32x32.png"),
        (192, "icon-192.png"),
        (512, "icon-512.png"),
    ]:
        square.resize((size, size), Image.Resampling.LANCZOS).save(
            OUT / name, optimize=True
        )
        print(name, size)

    # Apple touch icon on white
    apple_size = 180
    apple = Image.new("RGBA", (apple_size, apple_size), (255, 255, 255, 255))
    inset = int(apple_size * 0.82)
    resized = square.resize((inset, inset), Image.Resampling.LANCZOS)
    offset = (apple_size - inset) // 2
    apple.alpha_composite(resized, (offset, offset))
    apple.convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
    print("apple-touch-icon.png", apple_size)

    ico_sizes = [16, 32, 48]
    ico_images = [
        square.resize((s, s), Image.Resampling.LANCZOS) for s in ico_sizes
    ]
    ico_images[0].save(
        OUT / "favicon.ico",
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_images[1:],
    )
    print("favicon.ico")

    # Open Graph 1200x630
    og_w, og_h = 1200, 630
    og = Image.new("RGBA", (og_w, og_h), (255, 255, 255, 255))
    max_logo_w = int(og_w * 0.78)
    max_logo_h = int(og_h * 0.55)
    lw, lh = full.size
    scale = min(max_logo_w / lw, max_logo_h / lh)
    nw, nh = int(lw * scale), int(lh * scale)
    logo_og = full.resize((nw, nh), Image.Resampling.LANCZOS)
    og.alpha_composite(logo_og, ((og_w - nw) // 2, (og_h - nh) // 2))
    og.convert("RGB").save(OUT / "og-image.png", optimize=True)
    print("og-image.png", og_w, og_h)

    print("Assets written to", OUT)


if __name__ == "__main__":
    main()
