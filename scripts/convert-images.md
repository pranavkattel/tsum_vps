# Image Conversion Plan

Place your raw .tif images in `Export Phase 1 Pictures` or `Export Phase 2 Pictures`.
We'll convert them to optimized web formats (webp + fallback jpg) under `public/phase1` and `public/phase2`.

Steps (PowerShell):

1. Install ImageMagick (if not installed): https://imagemagick.org/script/download.php#windows
   Ensure `magick` command works in a new PowerShell session.

2. Run conversion script (will create `public/phase1` / `public/phase2`).
   (Script to be added later.)

3. Update `mockData.ts` generation to point to `/phase1/` & `/phase2/` webp files.
