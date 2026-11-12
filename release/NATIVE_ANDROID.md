# Native Android 1.1.0

The Android app now uses Kotlin and Jetpack Compose. The reading, search, favorites, notes, settings, sharing and reminder screens render as Android views through Compose. There is no Capacitor bridge or web page in the app UI.

- Application ID: `com.nithamorukural.habitapp`
- Version name/code: `1.1.0` / `2`
- Minimum Android: 7.0 / SDK 24
- Target SDK: 36
- Offline data: all 1,330 Kurals, 133 chapters, nine topics and three reading languages, exported from the existing dataset into native assets.
- Persistence: private Android SharedPreferences; reading days start at the configured reminder time.
- Reminders: native AlarmManager and notification channel; inexact, permission optional, restored after reboot/time changes.
- Speech: Android TextToSpeech, using a locally available voice with no network requirement.
- Sharing: native chooser and cache-only FileProvider for PNG posters.
- Privacy policy: bundled offline native text dialog and the owner's public URL, https://smartiva.in/privacy/apps/nitham-oru-kural.
- No Internet, location, camera, contacts, storage or exact-alarm permission is requested by the native app.

## Update and data migration

Install the native **debug APK as an update over the earlier test APK**, with the same package and debug signing certificate. Do not uninstall first: uninstalling removes the old saved notes and favorites.

On first upgrade, a hidden, network-blocked WebView reads the prior app's own `https://localhost` localStorage once. It is used solely for migration, and is then destroyed. Reading screens never use a WebView. Imported language, schedule, topics, notes, favorites, completion dates and reading history are stored in the native preferences. If an import times out, the app retains the old storage and retries on the next launch; a message identifies that condition. Import parsing is unit tested; the full browser-storage migration still requires a device upgrade check.

Google Play releases must use the established upload key / Play App Signing setup. The debug test certificate and the Play signing certificate are different and cannot replace one another.

## Build

Use JDK 21, Node 24, Android SDK 36 and accepted SDK licenses.

```sh
npm ci
npm run android:sync       # Exports the offline dataset; does not run Capacitor
cd android
./gradlew assembleDebug testDebugUnitTest lintDebug
```

The installable test APK is `android/app/build/outputs/apk/debug/app-debug.apk`. For release signing, use the existing private KURAL_* environment variables, then run `npm run android:bundle`. Signing material must remain outside Git.

## Acceptance checks on the owner's Android phone

1. Update over the old test APK without uninstalling.
2. Confirm old notes/favorites survived, if present.
3. Read Tamil on the Today screen, scroll top to bottom, and confirm system bars stay clear.
4. Try a larger Android font setting; buttons and text must wrap within the screen.
5. Enable Advanced Mode and search the library by Kural number, word, topic and chapter.
6. Edit a note, close/reopen the app, and confirm it persists.
7. Try native text/image sharing and an installed offline voice.
8. Enable a reminder a few minutes ahead, grant permission, close the app, and check delivery. Android battery restrictions can delay it.
9. Confirm offline launch and reading in airplane mode.

Do not upload the previous 1.0.0 bundle as the native release. Use the new 1.1.0 bundle after device acceptance.
