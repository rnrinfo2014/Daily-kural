> Android 1.1.0 now uses Kotlin + Jetpack Compose. Follow [NATIVE_ANDROID.md](NATIVE_ANDROID.md) for current native build/update instructions. The 1.0.0 Capacitor details below are historical.

# Android release — Nitham Oru Kural

App ID: `com.nithamorukural.habitapp` · version 1.0.0 · version code 1 · target SDK 36 · minimum SDK 24.

The app uses Capacitor and bundles the complete reading experience; no remote web server is required for Android. Digital Asset Links and the old placeholder fingerprint are unnecessary for this native package. The optional website PWA can still be built with Vite.

## Local build

Requirements: Node 22.12+ (Node 24 recommended), JDK 21 with javac, Android SDK platform 36 and build tools 35/36, and accepted Android SDK licenses. Set `JAVA_HOME` and `ANDROID_HOME` for your machine or set `android/local.properties` to your SDK path.

```sh
npm ci
npm run lint
npm test
npm run test:browser
npm run android:debug
```

Browser tests use `/usr/bin/chromium` when available; otherwise run `npx playwright install chromium` before testing. The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. A debug APK is for device testing, not Play Store submission.

## Release signing

Use Google Play App Signing for this new app. The initial upload key is provided separately to the owner in a private signing backup. It is not in this repository. Preserve that backup securely. Keep a private upload keystore and its password in secure storage; do not put keys, passwords, account credentials, or service-account JSON in Git.

Configure these environment variables securely in your build environment:

- `KURAL_KEYSTORE_PATH`: absolute upload keystore path
- `KURAL_KEYSTORE_PASSWORD`: keystore password
- `KURAL_KEY_ALIAS`: upload key alias
- `KURAL_KEY_PASSWORD`: upload key password

Then run `npm run android:bundle`. The bundle is `android/app/build/outputs/bundle/release/app-release.aab`. The npm release command requires these signing variables. A direct Gradle build without them creates an **unsigned** bundle, which Play Console cannot accept. Never substitute a debug signing key for an upload key. Preserve the upload key for future releases.

## Device acceptance checks

Install the debug APK on a real Android device before uploading the release. Test first launch in airplane mode, all language modes, reading at the scheduled rollover, notes after restart, optional notifications with the app closed, permission denial, reboot, native text/image sharing, keyboard appearance, system Back behavior, and gesture-navigation safe areas. Web browser tests do not establish native notification delivery or native share behavior.

## Publishing

1. Publish `release/privacy-policy.html` on the Smartiva domain. Verify the public HTTPS URL opens without login and matches the final app's behavior.
2. Sign into the owner's Play Console account. This workspace has no authenticated Play Console connection; an email address alone does not grant access.
3. Create the new app using the approved name, select the appropriate default language, and complete the owner declarations.
4. Use `STORE_LISTING.md` and `store-assets/` for the listing. Add support email `info@smartiva.in`, the live privacy-policy URL, content rating, audience, data safety, and app-access details.
5. Enroll in Google Play App Signing and upload the signed AAB to internal testing. Review automated checks and the pre-launch report; complete any account-specific testing requirements.
6. After device validation and any required closed testing, submit a production release. Google reviews the submission and controls approval/publication timing.

Store assets are browser previews of the reading UI; capture and verify final native-device screenshots before production.

No production submission or account declarations have been made by this workspace.
