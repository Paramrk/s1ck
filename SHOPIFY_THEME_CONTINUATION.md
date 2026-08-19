# S1CK Shopify Theme Continuation Handoff

Last updated: 2026-08-15 (Asia/Calcutta)

This document is the working handoff for continuing the S1CK storefront as an uploadable Shopify theme. Read it completely before editing or packaging anything.

## Immediate state

- Workspace: `D:\Work Project\s1ck`
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS 4 + GSAP/ScrollTrigger.
- Shopify delivery model: the React storefront is built into Shopify theme assets and inserted into a preserved, original Minimog/OS 2.0 theme.
- Canonical theme working directory: `s1ck-hybrid-product-theme-work/`
- Canonical upload ZIP: `s1ck-hybrid-original-product-theme.zip`
- Correct packaging script: `scripts/package-hybrid-frame-theme.mjs`
- Do **not** substitute `scripts/package-shopify-theme.js`; that is an older/minimal packaging path and is not the preserved-product hybrid theme.
- Current upload ZIP size: `45,302,258` bytes (`45.302 MB`, `43.204 MiB`).
- Current ZIP SHA-256: `31273C0CD0406A0326F4CAE3E195D2FA8A993A0F030F8D6B8C5262F9ED0531ED`
- Shopify's compressed theme upload cap is 50 MB. Keep the final ZIP below `50,000,000` bytes, not merely below 50 MiB.
- The last production build passed.

## Critical repository safety

The Git worktree is heavily dirty and contains many user changes, generated assets, theme exports, older packages, and deleted legacy files. This is expected.

Do not:

- run `git reset --hard`, `git checkout -- .`, broad cleanup commands, or recursive deletion;
- restore deleted legacy ZIPs or old theme folders unless the user explicitly requests it;
- replace the hybrid theme with a newly scaffolded/minimal theme;
- edit built `dist/` files or `s1ck-app.js` manually;
- delete original product templates, sections, snippets, or configuration from the hybrid theme;
- assume every untracked file was created by the current task.

Before every change, run `git status --short` and preserve unrelated changes. Edit source files under `src/` or the generator/packager scripts, then rebuild and repackage.

## Customer-facing requirements already implemented

### Bestseller product scroll sequence

The homepage bestseller section is a scroll-controlled 60fps canvas frame sequence, not ordinary video seeking. This is intentional: browser video seeking was not smooth or precise enough for product snapping.

Current product cue times:

| Product | Desktop cue | Mobile cue | Shopify handle |
| --- | ---: | ---: | --- |
| Le Toxique | `1.523s` | `1.523s` | `le-toxique` |
| Liquid Silver | `3.835s` | `3.835s` | `liquid-silver` |
| Alpha Q | `5.960s` | `5.960s` | `pheromone-cologne` |
| Avant Garde | `7.148s` | `8.087s` | `new-pre-order-avant-garde-for-men-regular-size-2oz-release-date-6-12` |
| Le Toxique For Her | `10.751s` | `10.751s` | `le-toxique-w` |

The user sometimes types “Avant Grande,” but the product name used in code is “Avant Garde.” Do not change its desktop cue when adjusting the mobile cue.

Relevant files:

- `src/sections/FlavorSection.tsx`
  - Owns product metadata, desktop/mobile cue arrays, GSAP timeline, cards, dots, snapping, and Shopify product lookup.
  - `PRODUCT_VIDEO_CUE_TIMES` is the desktop set.
  - `MOBILE_PRODUCT_VIDEO_CUE_TIMES` overrides Avant Garde to `8.087` only on viewports at or below 768px.
- `src/components/BestsellerFrameSequence.tsx`
  - Owns sprite discovery, 60fps time-to-frame conversion, canvas rendering, asynchronous image decoding, cache retention, forward/reverse runway, and early preloading.
- `src/utils/productCarouselScroll.ts`
  - Owns transition/hold durations, scroll length, and label snapping.

### Current bestseller quality and performance settings

Source videos:

- Desktop: `public/new best sellers desktop.mp4`
  - Source metadata: 1920×1080, 24fps, 11.10 seconds.
- Mobile: `public/new bestseller mobile.mp4`
  - Source metadata: 1080×1920, 24fps, 11.10 seconds.

Generated frame sequences:

- Desktop: 666 frames at 1280×720 and 60fps.
- Mobile: 666 frames at 540×960 and 60fps.
- FFmpeg motion interpolation synthesizes the 60fps motion from the 24fps originals.
- The final rendered image is held for three trailing frames because the interpolator needs future-frame context near the end.

Generated sprites:

- Six frames per sprite sheet.
- 111 desktop sheets and 111 mobile sheets.
- Desktop sheet dimensions: 7680×720.
- Mobile sheet dimensions: 3240×960.
- WebP settings: quality 45, alpha quality 90, smart subsampling, effort 6.
- Total sprite payload before ZIP container compression: approximately 31.374 MiB.

The following constants must stay synchronized across all three files whenever dimensions or grouping change:

- `FRAMES_PER_SHEET` in `src/components/BestsellerFrameSequence.tsx`
- `framesPerSheet` in `scripts/generate-bestseller-sprites.mjs`
- desktop/mobile dimensions in:
  - `src/components/BestsellerFrameSequence.tsx`
  - `scripts/generate-bestseller-frames.mjs`
  - `scripts/generate-bestseller-sprites.mjs`

Smoothness work already present in `BestsellerFrameSequence.tsx`:

- image decoding completes asynchronously before `drawImage`, avoiding a forced sprite decode on the animation frame;
- current and near-current sheets are retained by distance from the playhead instead of simple insertion order;
- mobile retains six decoded sheets; desktop retains four;
- mobile maintains a four-sheet forward runway and one reverse sheet;
- desktop maintains a two-sheet forward runway and one reverse sheet;
- cue neighborhoods are fetched before the rest of the sequence;
- preloading starts before the section enters the viewport;
- the canvas requests a desynchronized 2D context, high smoothing quality, paint containment, and compositor-safe transforms;
- existing canvas pixels remain visible until the requested sprite is decoded, avoiding a black flash.

When tuning smoothness, avoid holding every sprite decoded in memory. One decoded WebP sprite becomes an uncompressed RGBA bitmap and can use tens of megabytes.

### “Because being different isn't enough” mobile section

Relevant files:

- `src/sections/MessageSection.tsx`
- the `.message-*` and `.enough-*` styles in `src/index.css`

Mobile behavior already implemented:

- The phrase uses two balanced lines instead of stacking all four words separately.
- Font sizes, line height, letter spacing, cord height, and the “Enough” shadow are reduced for phones.
- Safe-area-aware top and bottom padding is applied.
- A short-screen media query handles phone heights at or below 700px.
- Mobile uses a shorter scroll distance, lighter blur/3D transforms, and quicker scrub response.
- Reduced-motion users receive a static, fully visible version.

Preserve the desktop composition when making further phone-specific changes.

## High-quality supporting image conversion

To make room for sharper bestseller sprites, the scent-composition PNGs used by the app were converted to high-quality WebP files in `src/assets/fruits/`.

- `src/constants/scentComposition.ts` imports the WebP versions directly.
- `src/utils/media.ts` excludes `../assets/fruits/**` from its broad dynamic glob because these assets are already direct imports.
- This exclusion also prevents unused fruit PNGs from silently entering the build.
- `scripts/package-hybrid-frame-theme.mjs` excludes stale fruit PNG copies retained by the hybrid theme working directory.

Do not remove the WebP exclusions or revert these imports without recalculating the final ZIP size. The old PNG set consumed roughly 18 MB more space.

## Build and regeneration workflow

### Normal source-only change

Run from `D:\Work Project\s1ck`:

```powershell
npm run build
node scripts/package-hybrid-frame-theme.mjs
```

The first command compiles the React storefront into `dist/`. The second copies eligible built assets into the preserved hybrid theme and creates `s1ck-hybrid-original-product-theme.zip`.

### If either bestseller source video or rendering dimensions change

```powershell
node scripts/generate-bestseller-frames.mjs --force
node scripts/generate-bestseller-sprites.mjs
npm run build
node scripts/package-hybrid-frame-theme.mjs
```

Notes:

- Frame generation takes several minutes because motion interpolation is computationally expensive.
- Sprite generation also takes several minutes at effort 6.
- `--force` is required after a dimension-only change because the generator otherwise skips when the existing frame count already equals 666.
- Check that both frame directories contain 666 WebP files.
- Check that both sprite directories contain 111 WebP files with the current six-frames-per-sheet setting.

### Final archive checks

At minimum, confirm:

```powershell
$zip = Get-Item -LiteralPath 's1ck-hybrid-original-product-theme.zip'
$zip.Length
Get-FileHash -Algorithm SHA256 -LiteralPath $zip.FullName
```

The ZIP root must directly contain Shopify folders such as `assets/`, `config/`, `layout/`, `sections/`, `snippets/`, and `templates/`. Do not put the theme inside an extra wrapper directory.

Required files known to exist in the current ZIP:

- `layout/theme.liquid`
- `config/settings_schema.json`
- `templates/index.json`
- `templates/product.json`
- `sections/main-product.liquid`
- `snippets/product-form.liquid`
- `assets/s1ck-app.js`
- `assets/s1ck-app.css`

## Hybrid theme and Shopify integration

The preserved Shopify theme is based on the original Minimog OS 2.0 export. The homepage is connected to the React storefront, but original Shopify product behavior is deliberately preserved.

Do not delete or replace these product-flow files:

- `s1ck-hybrid-product-theme-work/templates/product.json`
- `s1ck-hybrid-product-theme-work/sections/main-product.liquid`
- `s1ck-hybrid-product-theme-work/snippets/product-form.liquid`

`scripts/package-hybrid-frame-theme.mjs` checks for those files before packaging.

The package script:

- copies supported built assets from `dist/assets/` into the hybrid theme;
- packages image/font/CSS/JS files up to 5 MiB each;
- embeds only `hero-bg-3.mp4` as a theme video asset;
- relies on Shopify Files/theme settings/custom media base URLs for larger videos;
- omits obsolete Remixicon EOT/TTF/WOFF/SVG fallbacks but keeps WOFF2;
- excludes old and unused fruit PNGs;
- creates `s1ck-hybrid-original-product-theme.zip`.

The hybrid working directory is not cleared before copying. If future builds stop emitting an app-managed asset, a stale copy may remain there. Do not broadly clear the theme assets folder because it also contains original theme assets. Remove or exclude only files that are confirmed to be app-managed and obsolete.

Shopify video override settings were added to the hybrid theme settings schema for:

- desktop/mobile homepage hero;
- desktop/mobile bestseller showcase;
- formula scroll reveal;
- six customer reaction videos;
- optional custom media base URL.

Blank settings retain the existing fallback mapping.

## Validation status and known limitations

Completed successfully on 2026-08-15:

- TypeScript compilation and Vite production build.
- ZIP extraction/integrity checks.
- Required Shopify theme structure checks.
- Verification of 111 desktop and 111 mobile sprite sheets in the ZIP.
- Verification that the current desktop and mobile sheet dimensions are correct.
- Verification that mobile Avant Garde cue `8.087` is present in the packaged app bundle.
- Shopify CLI `theme package` succeeded on an extracted hybrid theme during the earlier packaging pass.

The normal build still emits a non-fatal warning that the main JavaScript chunk exceeds 500 kB after minification.

`npm run lint` is not currently a reliable validation command because the repository has ESLint 9 dependencies but no `eslint.config.*` file. Treat that as pre-existing tooling debt unless the user asks to repair lint configuration.

Interactive phone/browser QA was not completed in the previous pass because the available browser backend was unavailable. A future agent should, when possible, test at least:

- widths: 320, 375, 390, and 430px;
- a short viewport around 667px high;
- a modern iPhone/Android viewport with device pixel ratio greater than 1;
- slow network plus fast swipe/scroll behavior through the bestseller section;
- reversing scroll direction near sprite boundaries;
- the Avant Garde mobile snap at 8.087 seconds;
- the MessageSection headline and hanging “Enough” without clipping;
- reduced-motion mode;
- original Shopify product page add-to-cart and variant behavior.

## Legacy Theme Check findings

Shopify Theme Check previously inspected the extracted hybrid theme and reported 227 offenses across 82 files: 98 errors and 129 warnings. These findings came from preserved legacy Minimog theme files, not from the bestseller frame integration.

Examples:

- legacy `config/settings_schema.json` entries use object labels or deprecated `type: image` settings;
- `snippets/testimonials-3.liquid` contains a dynamic Liquid tag pattern that Theme Check flags as a syntax error;
- many legacy warnings cover hardcoded routes, orphan snippets, and undefined objects.

The problematic `testimonials-3.liquid` file was verified byte-for-byte identical to the original exported theme. The current settings schema differs from the original only because the S1CK settings/video groups were appended; the flagged older settings live in the preserved part of the schema.

Do not attempt a broad Theme Check cleanup as part of an unrelated homepage task. It can alter original product/theme behavior. If the user requests that cleanup, treat it as a separate migration, fix incrementally, and regression-test Shopify product pages.

## Recommended continuation order

For the next requested change:

1. Read this handoff and run `git status --short`.
2. Inspect the smallest relevant source component and its CSS/utilities.
3. Preserve desktop/mobile-specific cue differences and original Shopify product templates.
4. Make source changes only.
5. Run `npm run build`.
6. Repackage using `node scripts/package-hybrid-frame-theme.mjs`.
7. Confirm the ZIP is under 50,000,000 bytes and required theme files remain present.
8. Perform targeted phone and product-flow QA when browser access is available.
9. Give the user the final file at `D:\Work Project\s1ck\s1ck-hybrid-original-product-theme.zip`.

## Current deliverable

Upload this file to Shopify unless a later change produces a newer package:

`D:\Work Project\s1ck\s1ck-hybrid-original-product-theme.zip`

Current checksum:

`31273C0CD0406A0326F4CAE3E195D2FA8A993A0F030F8D6B8C5262F9ED0531ED`
