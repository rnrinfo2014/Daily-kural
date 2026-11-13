# Store asset drafts

- `store-icon-512.png`: existing brand icon, 512 × 512.
- `feature-graphic-1024x500.png`: feature graphic, 1024 × 500.
- `01-daily-reading.png`, `02-directory.png`, `03-favorites.png`: 1080 × 1920 browser previews of the application UI. Recapture on the final native app before production; the PWA install button shown in browser captures is hidden in Android.
- `privacy-policy-preview.png`: full-page proof of the standalone policy; not a store screenshot.

`node release/capture-assets.mjs` regenerates the previews against the local production preview server.

Android 1.1.0 now has a Kotlin/Compose UI. The three web screenshots in this folder are historical; use `release/native-previews/` to review the current UI and take fresh phone screenshots before store submission.
