# R03 illustration inventory and source record

Design-only masters, not installed into production assets. All illustrations are
original basketball/comic artwork. None represents a real court photograph or an
actual account avatar. Existing T02 production resources are copied unchanged.

## Asset inventory and exact placement

**A / art/court-action.png** — new transparent PNG,1254 × 1254 pixels,
2,302,588 bytes. Dynamic orange basketball, hoop/net and generic asphalt wedge.
Canchas list:116 × 128 pt left art well on Parque Rodo/Palermo; map preview72 × 72.
Detail:164 × 156 pt about art well. My Courts:116 × 128 at left. Game tickets:
110 × 100 pt visual viewport inside92 pt format well, with controlled8 pt overflow
masked by the well, format label above. Object-fit contain; never crop the ball/net
into a meaningless fragment. No source geometry implies actual court attributes.

**B / art/court-secondary.webp** — existing T02 original,256 × 250 pixels,
21,898 bytes. Alternative ball/hoop pose. Canchas Parque Rodó Court116 × 128;
My Courts alternate116 × 128; 2v2 ticket110 × 100. This file is a review/layout
reference with limited resolution at3×; obtain an approved higher-resolution original
or derivative source before claiming native visual sharpness. No silent tiny-icon
substitution. Reuse is disclosed rather than claiming it was newly generated.

**C / art/player-portrait.png** — new transparent PNG,1178 × 1335 pixels,
1,039,699 bytes. Original adult player, orange/navy kit, holding a basketball.
Perfil:220 × 248 pt viewport centered in268 pt hero. Enlarged-content adaptation:
height160, contain and preserve aspect; do not confuse it with account-uploaded art.
No embedded text, real-person reference, team branding or invented identity.

**D / art/player-action.webp** — existing T02 original,256 × 234 pixels,
18,440 bytes. Dynamic original player pose. Mis canchas empty:220 × 220 pt
contain viewport. As with B, current preview resolution is not3× native evidence;
production-resolution approval is an implementation prerequisite.

## Generation method and briefs

New A/C were generated with the built-in image_gen tool, with transparent_background
true. Original generated files are preserved in the Codex generated-images folder;
project copies live only in this design revision. No Python redraw, remote stock
photography, production asset replacement or dependency was used.

Generation brief A: original street-basketball comic illustration of a dynamic close-up
orange ball, hoop/net and generic asphalt, navy/cream accents, energetic ink strokes,
transparent background, clear mobile silhouette, no words/logos/real venue.
Generation brief C: original adult basketball character, medium-brown skin and curly
hair, athletic orange/navy kit, full body holding ball, expressive sports-comic ink,
transparent background, no words/logos/real person. These are normalized brief
records, not claims of byte-for-byte tool-prompt reproduction.

Review confirmed transparent assets decode, whole character silhouette visible,
no recognizable real person or venue asserted. Generated-art provenance is recorded;
this is not legal clearance of all possible third-party rights.

## Optimization and typography prerequisites

PNG masters are review sources, not mobile-ready binaries. Future approved task
must produce local alpha-preserving optimized derivatives/fallbacks, validate decode
on Expo/iOS/web and inspect at intended3× size. Suggested budget≤200 KB per common
court variant,≤250 KB character,≤700 KB loaded-screen art; justify deviations with
observed decode/frame memory evidence. Do not download remote assets at runtime.
Retain original masters separately and record derivative hashes/dimensions.

Lexend and Teko are the existing local T02 fonts. Existing license records:
[Lexend OFL](../../../assets/fonts/licenses/Lexend-OFL.txt),
[Lexend notice](../../../assets/fonts/licenses/Lexend-NOTICE.txt),
[Teko OFL](../../../assets/fonts/licenses/Teko-OFL.txt),
[font manifest](../../../assets/fonts/manifest.json).
No new font download, licensing change or dependency in R03. Preserve existing
license files/distribution notices when eventually packaging refined artwork.
