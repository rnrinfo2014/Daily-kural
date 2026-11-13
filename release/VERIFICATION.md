# Verification record — 12 November 2026

Base repository: rnrinfo2014/Daily-kural, main, dd6e67c.

Completed checks:

- Dependency installation using npm with a committed package-lock file; original esbuild/Vite conflict removed.
- TypeScript type check.
- Six unit/data tests cover midnight schedules, rollover across year boundaries, consecutive streaks, all 1,330 Kural mappings, localized content, and offline phonetic rendering.
- Seven browser tests exercise date rollover while the page stays open, completion independent of historical reading, damaged stored preferences, PWA offline reload, mobile navigation/search/notes, and poster export.
- Runtime dependency audit: zero reported vulnerabilities at verification time.

Android packaging uses SDK 36 and JDK 21. Native reminders and native sharing are implemented through Capacitor plugins. Browser tests do not validate native device notification delivery, native sharing, system navigation, or Play Store acceptance. These need device/internal-track verification.

Publication prerequisites still outside this workspace:

- Live public privacy-policy URL on Smartiva's domain.
- Authenticated access to the owner's Play Console account.
- Owner's content-source/redistribution-rights verification for modern commentaries and translations.
- Play Console app content declarations and any account-specific testing requirements.

No Play Store release has been submitted or published.

Final Android results:

- `assembleDebug`, `bundleRelease`, and `lintRelease` completed successfully using JDK 21 and target SDK 36.
- Final Android lint: zero errors, seven nonblocking template/dependency warnings.
- Release AAB signature verified with jarsigner; bundletool 1.18.3 validation completed successfully.
- Debug APK signature verified with apksigner.
- Merged manifest contains optional notification, reboot/wake, Internet, and internal receiver permissions; exact-alarm permission is removed. Cloud backup and device transfer are excluded by explicit rules.
- The initial signed upload bundle and private signing backup are provided separately to the owner, outside the public repository.
- Final web validation: TypeScript passed, six unit/data tests passed, seven browser tests passed.
