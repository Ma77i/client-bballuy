"""Extract owner-approved R02 art without synthesizing or painting pixels.
Run with an existing Pillow runtime; no app dependency is introduced.
"""
from pathlib import Path
from PIL import Image
import hashlib
import json

root = Path(__file__).resolve().parents[1]
source = root / 'specs/003-arcade-ux-ui/play-r02-recovery-evidence/owner-reference.png'
image = Image.open(source).convert('RGB')
regions = {
    'header': (308, 155, 533, 267),
    'duel': (595, 211, 767, 302),
    'hoop': (775, 211, 939, 302),
    'ball': (333, 158, 443, 266),
}
items = []
for key, box in regions.items():
    path = root / f'assets/illustrations/r02-play/{key}.webp'
    crop = image.crop(box)
    crop.save(path, 'WEBP', quality=90, method=6)
    data = path.read_bytes()
    items.append(dict(key=key, path=path.relative_to(root).as_posix(), crop=list(box),
                      width=crop.width, height=crop.height, bytes=len(data),
                      sha256=hashlib.sha256(data).hexdigest()))
manifest = dict(source=source.relative_to(root).as_posix(), sourceSize=list(image.size),
                sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(),
                authorization='Owner explicitly authorized extraction from attached approved R02, 2026-10-15.',
                processing='Text-free rectangular crops, no upscaling, no generation, WebP quality90 method6.',
                limitation='Flattened 1536x1024 board; no high-resolution independent source layers.', images=items)
(root/'assets/illustrations/r02-play/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'images':len(items),'totalBytes':sum(item['bytes'] for item in items)}))
