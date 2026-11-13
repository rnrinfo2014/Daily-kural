# Tamil native Play Store screenshot set

Five 1080 × 1920 (9:16), RGB JPEG images, each under 8 MB, generated directly from the actual native Compose screens using Robolectric SDK 35 native graphics. These are automated application UI renders, not physical-device captures or the old web UI. No fabricated reviews, download counts, private notes or unsupported features are shown.

Upload the five `store-*.jpg` files under Phone screenshots, in numeric order. The current app icon and feature graphic remain in the parent store-assets folder. The old web screenshots in that parent folder are historical and should not be used for this native listing.

Reproduce with `cd android && ./gradlew testDebugUnitTest --tests '*StoreScreenshotsTest'`. Outputs are written to `app/build/reports/store-screenshots/`. The UI capture test passed; all dimensions and RGB formats were validated. Review the captures against the installed app before upload.
