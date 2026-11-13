# Native Android 1.1.0 verification

The native Android build replaces the Capacitor reading UI with Kotlin + Jetpack Compose. All 1,330 Kurals, 133 chapters, nine topics and localized reading content are bundled as native assets.

Completed checks:

- `assembleDebug`, `bundleRelease`, `lintDebug`, `lintRelease` succeeded with JDK 21 and SDK 36.
- Seven Kotlin domain/data tests passed: midnight schedules, annual rollover, streak gaps, reminder scheduling/DST, legacy preference round trips, corrupt-value filtering, and all native localized records.
- Three native Compose UI tests passed under Robolectric SDK 35: Tamil reading/navigation within 360dp, search for Kural 1330, and completion persisted to native preferences.
- One native Compose UI test passed at 320dp and 150% font size. Header/navigation bounds fit horizontally; the language control remains below the header and changes to a dropdown.
- Native graphics previews were inspected. These are development renders, not physical-device screenshots.
- Debug and release lint: zero errors; 21 warnings (dependency/template, localization and style recommendations).
- Debug APK signature verified and matched the earlier test APK's certificate, allowing an in-place update. Version code increased from 1 to 2.
- Release AAB signature verification and bundletool 1.18.3 validation passed.
- APK zipalign checked with 16KB alignment. Both 64-bit packaged native libraries have ELF load alignment of 16384 bytes.
- APK assets contain only `kurals.json` and the offline privacy policy; there is no bundled web UI/JavaScript bridge.
- TypeScript check passed for the separate web app and data exporter.

The cloud emulator installation was attempted, but the environment's remaining disk space failed the emulator's startup check. Temporary emulator/image downloads were removed. No emulator or physical-device execution is claimed. Robolectric native rendering was used instead.

Still required on the owner's phone: upgrade without uninstalling, verify real legacy localStorage import, check actual system bars/gestures/keyboard, native image/text sharing and optional offline voice, and background notification delivery. The parser is tested; real WebView localStorage migration and OEM notification behavior are not established by JVM tests.

No Play Console submission has been made. The owner-hosted privacy policy is https://smartiva.in/privacy/apps/nitham-oru-kural. Dataset redistribution/source verification and Play Console declarations remain release prerequisites.
