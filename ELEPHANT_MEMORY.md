> Release status (12 November 2026): the original roadmap below records earlier intentions, not verified Play Store readiness. Current build and publication instructions are in `release/RELEASE.md`. Android packaging now uses Capacitor with native inexact local reminders; the unused Asset Links template is in `release/templates/`. Source attribution/redistribution rights for modern dataset commentaries still require owner verification.

# ELEPHANT MEMORY — Master Architecture & Invariants

## 1. Project Identity
- **App Name**: Nitham Oru Kural (நித்தம் ஒரு குறள்) — Daily Applied Thirukkural
- **Target Platform**: Android Application (Play Store Ready via Offline-First PWA / TWA / Capacitor Android Packaging)
- **Execution Mode**: 100% Offline-First (Local Embedded Dataset + IndexedDB/LocalStorage + Service Worker Pre-caching)

---

## 2. Hard Invariants (NEVER Violate)
1. **100% Offline Execution**: Zero internet dependency required after installation. All Thirukkural verses, meanings, real-world scenarios, and life/business playbooks must be bundled locally in static JSON/TypeScript data modules.
2. **Zero Background AI Processing**: No LLM API calls, no server-side Gemini calls, no background AI workers or cloud inference.
3. **Rich Practical Content per Kural (in 3 Language Modes: Simple Tamil | Tanglish | English)**:
   - User can switch explanation language anytime between **Simple Tamil (எளிய தமிழ்)**, **Tanglish (Casual Spoken Tamil in English script)**, and **English**.
   - Original Kural (Tamil 2-line couplet + Tanglish phonetic reading + English translation)
   - Paal (பால்) & Adhigaram (அதிகாரம்) + Topic/Concept tags
   - **Actual Explanation (தெளிவுரை)**: Available in Simple Tamil, Tanglish, and English
   - **Real-World Example (நடைமுறை உதாரணம்)**: Relatable everyday scenario in Simple Tamil, Tanglish, and English
   - **Life Application (வாழ்க்கைக்கு வழிகாட்டி)**: How to practice this today in personal life/relationships/mindset (Simple Tamil, Tanglish, English)
   - **Business & Career Application (தொழில் மற்றும் தலைமைத்துவம்)**: How founders, managers, and professionals apply this principle in leadership, finance, strategy, or ethics (Simple Tamil, Tanglish, English)
4. **Personalization & Scheduling**:
   - Preferred Language Switcher: **Simple Tamil | Tanglish | English** (saved offline)
   - Interest Topics / Concepts selector (e.g., Leadership & Management, Wealth & Finance, Ethics & Integrity, Communication, Resilience, Friendship & Network, Time & Execution)
   - Daily Schedule Time picker (e.g., 06:30 AM Morning Reflection) with local notification / daily rotation trigger
5. **Favorites & Sharing**:
   - Bookmark / Favorite any Kural for offline quick access and personal notes
   - Native Web Share API + WhatsApp / Image Card / Formatted Text copy for instant sharing
6. **Play Store Readiness (Android TWA / Capacitor)**:
   - Full Web App Manifest (`display: standalone`, maskable icons, offline Service Worker via `vite-plugin-pwa`)
   - Digital Asset Links (`/.well-known/assetlinks.json` template) & Bubblewrap / Capacitor Android build config ready for Google Play Store AAB packaging.

---

## 3. Goldfish Atomic Task Queue (Execution Roadmap)

### Task G1: Offline 1,330 Thirukkural Knowledge Base (`src/data/kurals.ts`, `thirukkural1330.json`, `chapters133.json`) [COMPLETED]
- Bundled all **1,330 Thirukkurals** (Kural #1 to #1330) and all **133 Adhigarams** (across அறத்துப்பால், பொருட்பால், காமத்துப்பால்) 100% offline inside `src/data/`.
- Mapped all 133 Adhigarams into 9 practical Life & Business concepts (`leadership`, `wealth`, `time`, `communication`, `resilience`, `ethics`, `networking`, `learning`, `relationships`).
- Each of the 1,330 entries includes: Kural number, Tamil couplet, Tanglish phonetic reading, English translation, Paal & Adhigaram, Scholar commentaries (சாலமன் பாப்பையா, மு.வரதராசன், கலைஞர்), and 3-language support (**Simple Tamil**, **Tanglish**, **English**) for:
  - Actual Explanation
  - Real-World Story/Example
  - Life Action Steps
  - Business/Leadership Action Steps
  - 1-Line Daily Actionable Takeaway

### Task G2: Local Persistence & Daily Scheduling Engine (`src/store/useKuralStore.ts`) [COMPLETED]
- Built 100% offline `localStorage` persistence for:
  - Preferred Language (`Simple Tamil` | `Tanglish` | `English`)
  - Selected Interest Topics (`selectedTopics`)
  - Daily Schedule Time (`scheduleTime`, e.g., `06:30`) with automatic cycle rollover + local Notification trigger
  - Deterministic Daily Kural selector filtered by the user's chosen topics + manual Kural navigation (#1–#1330)
  - Favorites list (`favoriteNumbers`), Applied/Completed tracker (`completedNumbers`), and Offline Personal Notes per Kural (`personalNotes`)

### Task G3: Android Mobile-First UI & Navigation (`src/App.tsx` & Components) [COMPLETED]
- Built ergonomic thumb-zone Android UI with 4 main tabs:
  1. **Today's Kural (இன்றைய குறள்)**: Couplet card, 3-Language Switcher (`எளிய தமிழ் | Tanglish | English`), Offline Voice Reader, Actual Meaning, Real-World Example, Life vs. Business Application tabs, Daily Actionable Takeaway, and Offline Personal Notes.
  2. **Explore 1,330 Kurals & 133 Adhigarams (1330 குறள்கள்)**: Instant offline search and filtering by 9 Life & Business topics or any of the 133 Adhigarams.
  3. **Favorites & Applied Log (பிடித்தவை)**: Saved Kurals, Applied in Life/Business tracker, and Personal Notes log.
  4. **Schedule & Topics Setup (அமைப்புகள்)**: Daily reminder time picker (`scheduleTime`), quick time presets, and 9 Interest Topics selector.

### Task G4: Share Studio & Native Android Share (`src/components/ShareModal.tsx`) [COMPLETED]
- Built Share Studio with 3-language output preview, native Android Share Sheet (`navigator.share`), direct WhatsApp share, 1-tap clipboard copy, and 100% offline HTML5 Canvas Poster PNG generator.

### Task G5: 100% Offline PWA, Play Store Packaging & Privacy Policy [COMPLETED]
- Configured `vite-plugin-pwa` Service Worker precaching (`maximumFileSizeToCacheInBytes: 6MB`) so all 1,330 Kurals work 100% in Airplane Mode.
- Added **Basic Habit Mode (Default)** vs. **Advance Mode (1,330 Kural Directory)** toggle so the app behaves like a focused Daily Good Habit app rather than an overwhelming book.
- Added **First-Time Habit Setup Onboarding**, **Automatic Scheduled Notification Popup**, and **Read & Complete Daily Streak** flow.
- Upgraded UI to a crisp **Modern Slate & Emerald Habit Theme** (`#F8FAFC` / `#0F172A` / `#10B981`).
- Added in-app **Privacy Policy Modal** and standalone `/privacy-policy.html` + `/.well-known/assetlinks.json` for Google Play Console TWA / APK / AAB publishing.
