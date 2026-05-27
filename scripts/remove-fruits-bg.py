"""Remove backgrounds from all images in src/assets/fruits using rembg."""
from __future__ import annotations

import sys
from pathlib import Path

import io

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
FRUITS_DIR = ROOT / "src" / "assets" / "fruits"


def process_file(path: Path) -> None:
    raw = path.read_bytes()
    result = remove(raw)
    img = Image.open(io.BytesIO(result)).convert("RGBA")
    img.save(path, format="PNG", optimize=True)
    print(f"ok  {path.name}")


def main() -> None:
    if not FRUITS_DIR.is_dir():
        print(f"Missing folder: {FRUITS_DIR}", file=sys.stderr)
        sys.exit(1)

    files = sorted(
        p
        for p in FRUITS_DIR.iterdir()
        if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
    )
    if not files:
        print("No images found.", file=sys.stderr)
        sys.exit(1)

    print(f"Processing {len(files)} images with rembg...")
    for path in files:
        process_file(path)
    print("Done.")


if __name__ == "__main__":
    main()
