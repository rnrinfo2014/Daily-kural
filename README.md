# Nitham Oru Kural

Offline Thirukkural reading and daily reflection app for Android and the web. Android now uses **Kotlin + Jetpack Compose**. The separate web app uses React, TypeScript and Vite. Both use the bundled collection of 1,330 Kurals / 133 chapters.

```sh
npm ci
npm run dev
```

Use `npm run lint`, `npm test`, `npm run test:browser`, and `npm run build` for validation. Native Android build, update/migration instructions and phone checks are in [release/NATIVE_ANDROID.md](release/NATIVE_ANDROID.md). Store release requirements are in [release/RELEASE.md](release/RELEASE.md). Privacy policy: [public/privacy-policy.html](public/privacy-policy.html).

A reading day starts at the chosen schedule time. Completion is recorded for that day independently of whether the same Kural was read before. Favorites and notes persist locally; clearing app data removes them. Native Android reminders use AlarmManager and Android notifications; web reminders require an open page. No backend or API keys are required.

The bundled modern commentaries/translations need a documented source and redistribution license from the owner before a public release. No general source-code license is asserted by this repository.
