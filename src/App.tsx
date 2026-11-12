import React, { useState, useMemo } from 'react';
import {
  ALL_1330_KURALS,
  CHAPTERS_133,
  KuralItem,
  LanguageMode,
  searchKuralsOffline,
  TopicId,
  TOPICS,
} from './data/kurals';
import { useKuralStore } from './store/useKuralStore';
import { ShareModal } from './components/ShareModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  OnboardingSetupModal,
  PrivacyPolicyModal,
  ScheduledNotificationPopup,
} from './components/HabitPopups';
import {
  BookOpen,
  Compass,
  Heart,
  Sliders,
  Share2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  Shuffle,
  Volume2,
  Check,
  Bell,
  Briefcase,
  User,
  FileText,
  Sparkles,
  Flame,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

type ActiveTab = 'today' | 'explore' | 'favorites' | 'settings';

const UI_LABELS: Record<
  LanguageMode,
  {
    todayTab: string;
    exploreTab: string;
    favoritesTab: string;
    settingsTab: string;
    actualExplanation: string;
    realWorldExample: string;
    lifeApplication: string;
    businessApplication: string;
    dailyAction: string;
    personalNote: string;
    saveNotePlaceholder: string;
    favoriteBtn: string;
    favoritedBtn: string;
    completedHabitBtn: string;
    markReadCompleteBtn: string;
    shareBtn: string;
    nextFromTopics: string;
    scheduleHeading: string;
    topicsHeading: string;
  }
> = {
  tamil: {
    todayTab: 'இன்றைய பழக்கம்',
    exploreTab: '1330 தொகுப்பு',
    favoritesTab: 'பிடித்தவை',
    settingsTab: 'அமைப்புகள்',
    actualExplanation: '01. தெளிவுரை (Actual Explanation)',
    realWorldExample: '02. நடைமுறை உதாரணம் (Real-World Example)',
    lifeApplication: '03. வாழ்க்கைக்கு வழிகாட்டி (Life Application)',
    businessApplication: '04. தொழில் & தலைமைத்துவம் (Business Application)',
    dailyAction: 'இன்றைய ஒரு வரிப் பழக்கம் (Daily Micro-Habit)',
    personalNote: '05. என் தனிப்பட்ட குறிப்பு (Offline Note)',
    saveNotePlaceholder:
      'இந்தக் குறளை உங்கள் வாழ்க்கையில் அல்லது தொழிலில் எப்படிப் பயன்படுத்தப் போகிறீர்கள் என இங்கே எழுதி வைக்கலாம் (100% Offline)...',
    favoriteBtn: 'பிடித்தவைகளில் சேர்',
    favoritedBtn: 'பிடித்தவைகளில் உள்ளது',
    completedHabitBtn: 'இன்றைய குறள் படித்து முடிக்கப்பட்டது',
    markReadCompleteBtn: 'படித்து முடித்தேன் (Mark Read & Complete)',
    shareBtn: 'பகிர்',
    nextFromTopics: 'வேறொரு குறள் (My Topics)',
    scheduleHeading: 'தினசரி குறள் நேரம் (Daily Schedule Time)',
    topicsHeading: 'விருப்பமான தலைப்புகள் (Interest Topics & Concepts)',
  },
  tanglish: {
    todayTab: 'Daily Habit',
    exploreTab: '1330 Directory',
    favoritesTab: 'Favorites',
    settingsTab: 'Settings',
    actualExplanation: '01. Actual Explanation (தெளிவுரை)',
    realWorldExample: '02. Real-World Example (நடைமுறை உதாரணம்)',
    lifeApplication: '03. Life Application (வாழ்க்கைக்கு வழிகாட்டி)',
    businessApplication: '04. Business & Leadership (தொழில் வழிகாட்டி)',
    dailyAction: 'Today’s Actionable Habit (இன்றைய செயல்)',
    personalNote: '05. My Personal Note (Offline Save)',
    saveNotePlaceholder:
      'Indha Kural-ah unga life alladhu business-la epdi apply panna poringa nu note panni vachukonga (Saved 100% Offline)...',
    favoriteBtn: 'Add Favorite',
    favoritedBtn: 'Favorited',
    completedHabitBtn: 'Today’s Habit Completed',
    markReadCompleteBtn: 'Read & Complete Today',
    shareBtn: 'Share',
    nextFromTopics: 'Next from My Topics',
    scheduleHeading: 'Daily Schedule Time (தினசரி நேரம்)',
    topicsHeading: 'Choose Your Interest Topics (விருப்பத் தலைப்புகள்)',
  },
  english: {
    todayTab: 'Daily Habit',
    exploreTab: '1330 Directory',
    favoritesTab: 'Saved',
    settingsTab: 'Settings',
    actualExplanation: '01. Actual Explanation & Meaning',
    realWorldExample: '02. Real-World Scenario & Example',
    lifeApplication: '03. Personal Life Application',
    businessApplication: '04. Business & Leadership Application',
    dailyAction: 'Today’s Actionable Micro-Habit',
    personalNote: '05. My Offline Reflection Note',
    saveNotePlaceholder:
      'Write down how you will apply this Kural in your life or business today (Saved 100% offline on device)...',
    favoriteBtn: 'Save to Favorites',
    favoritedBtn: 'Saved in Favorites',
    completedHabitBtn: 'Today’s Habit Completed',
    markReadCompleteBtn: 'Read & Complete Today',
    shareBtn: 'Share Kural',
    nextFromTopics: 'Next in My Topics',
    scheduleHeading: 'Daily Kural Schedule Time',
    topicsHeading: 'Personalize Interest Topics & Concepts',
  },
};

export default function App() {
  const {
    language,
    selectedTopics,
    scheduleTime,
    reminderEnabled,
    reminderError,
    storageError,
    favoriteNumbers,
    favoriteKurals,
    completedNumbers,
    personalNotes,
    onboardingCompleted,
    advancedMode,
    dailyKural,
    isTodayHabitCompleted,
    habitStreakCount,
    effectiveCycleDate,
    scheduledPopupOpen,
    setLanguage,
    setAdvancedMode,
    toggleTopic,
    selectAllTopics,
    setScheduleTime,
    setReminderEnabled,
    toggleFavorite,
    markKuralReadAndComplete,
    savePersonalNote,
    setTodayKuralByNumber,
    pickNextTopicKural,
    completeOnboarding,
    triggerScheduledPopupNow,
    closeScheduledPopup,
  } = useKuralStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [shareModalKural, setShareModalKural] = useState<KuralItem | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [appFocusFilter, setAppFocusFilter] = useState<'both' | 'life' | 'business'>('both');
  const [jumpInput, setJumpInput] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceMessage, setVoiceMessage] = useState('');

  // Explore tab filters (Only visible in Advance Mode)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exploreTopic, setExploreTopic] = useState<TopicId | 'all'>('all');
  const [exploreChapter, setExploreChapter] = useState<number | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(30);

  // Favorites sub-filter
  const [savedSubTab, setSavedSubTab] = useState<'favorites' | 'applied' | 'notes'>('favorites');

  const labels = UI_LABELS[language];
  const currentContent = dailyKural.content[language];
  const isFavorited = favoriteNumbers.includes(dailyKural.number);
  const currentTopicMeta = TOPICS.find((t) => t.id === dailyKural.topic);

  const filteredExploreKurals = useMemo(
    () => searchKuralsOffline(searchQuery, exploreTopic, exploreChapter),
    [searchQuery, exploreTopic, exploreChapter]
  );

  // Offline Text-to-Speech
  const handleSpeakKural = (kural: KuralItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceMessage('Voice reading is unavailable on this device.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead =
      language === 'english'
        ? `Thirukkural number ${kural.number}. ${kural.englishCouplet}. ${kural.content.english.explanation}`
        : `${kural.line1}. ${kural.line2}. தெளிவுரை: ${kural.content.tamil.explanation}`;

    const voice = window.speechSynthesis.getVoices().find((voice) => voice.localService && voice.lang.startsWith(language === 'english' ? 'en' : 'ta'));
    if (!voice) {
      setVoiceMessage('No offline voice is available for this language. Install a local voice pack in device settings.');
      return;
    }
    setVoiceMessage('');
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.voice = voice;
    utterance.lang = language === 'english' ? 'en-IN' : 'ta-IN';
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput, 10);
    if (!isNaN(num) && num >= 1 && num <= 1330) {
      setTodayKuralByNumber(num);
      setJumpInput('');
      setActiveTab('today');
    }
  };

  const handleOpenKuralFromList = (kuralNum: number) => {
    setTodayKuralByNumber(kuralNum);
    setActiveTab('today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModeSwitch = (enableAdvanced: boolean) => {
    setAdvancedMode(enableAdvanced);
    if (!enableAdvanced && activeTab === 'explore') {
      setActiveTab('today');
    }
  };

  const appliedKuralsList = useMemo(
    () => ALL_1330_KURALS.filter((k) => completedNumbers.includes(k.number)),
    [completedNumbers]
  );

  const notedKuralsList = useMemo(
    () =>
      ALL_1330_KURALS.filter(
        (k) =>
          personalNotes[k.number] && personalNotes[k.number].trim().length > 0
      ),
    [personalNotes]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-20 md:pb-12">
      {voiceMessage && <p role="status" className="p-3 bg-slate-100 text-slate-800">{voiceMessage}</p>}
      {storageError && <p role="alert" className="p-3 bg-amber-50 text-amber-900">{storageError}</p>}
      {/* Top Bar Contract: 3 Zones (Brand Wordmark — Single-Line Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('today')}
          className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          நித்தம் ஒரு குறள்
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('today')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'today'
                ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            {labels.todayTab}
          </button>

          {advancedMode && (
            <button
              onClick={() => setActiveTab('explore')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'explore'
                  ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              {labels.exploreTab}
            </button>
          )}

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'favorites'
                ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            {labels.favoritesTab} ({favoriteNumbers.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'settings'
                ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            {labels.settingsTab}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <PWAInstallButton />
        </div>
      </header>

      {/* Modern Habit Workspace Bar: Language Switcher + Basic/Advance Mode Switch + Streak */}
      <div className="border-b border-slate-200/70 bg-slate-100/70 px-4 sm:px-8 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* 3-Language Switcher */}
          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl"
              role="group"
              aria-label="Language mode switcher"
            >
              {(['tamil', 'tanglish', 'english'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLanguage(mode)}
                  className={`min-h-[34px] px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    language === mode
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode === 'tamil'
                    ? 'எளிய தமிழ்'
                    : mode === 'tanglish'
                    ? 'Tanglish'
                    : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Right Controls: Habit Streak + Basic vs Advance Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold tabular-nums">
              <Flame className="w-4 h-4 text-emerald-600" />
              <span>
                {habitStreakCount} {language === 'tamil' ? 'நாள் தொடர்' : 'day streak'}
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-500">Schedule: {scheduleTime}</span>
            </div>

            {/* Basic vs Advance Mode Segmented Switch */}
            <div
              className="inline-flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl"
              role="group"
              aria-label="App mode switcher"
            >
              <button
                type="button"
                onClick={() => handleModeSwitch(false)}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  !advancedMode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Basic Habit
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch(true)}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  advancedMode
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Advance (1330)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* ========================================================= */}
        {/* TAB 1: TODAY'S HABIT KURAL (இன்றைய பழக்கம்)                 */}
        {/* ========================================================= */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Top Status & Quick Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-900">
                  {language === 'tamil'
                    ? `இன்றைய திருக்குறள் (${effectiveCycleDate})`
                    : `Today’s Scheduled Habit (${effectiveCycleDate})`}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">
                  {isTodayHabitCompleted
                    ? language === 'tamil'
                      ? '✓ இன்று படித்து முடிக்கப்பட்டது'
                      : '✓ Completed for Today'
                    : language === 'tamil'
                    ? 'இன்று படிக்க வேண்டியது'
                    : 'Pending Today’s Read'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Test Scheduled Notification Popup Button */}
                <button
                  onClick={triggerScheduledPopupNow}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {language === 'tamil'
                      ? 'நோட்டிபிகேஷன் பாப்-அப் பார்'
                      : 'Preview Notification Popup'}
                  </span>
                </button>

                <button
                  onClick={pickNextTopicKural}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-slate-500" />
                  <span>{labels.nextFromTopics}</span>
                </button>

                {/* Manual Kural Number Jumper is ONLY shown in Advance Mode */}
                {advancedMode && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setTodayKuralByNumber(
                          dailyKural.number > 1 ? dailyKural.number - 1 : 1330
                        )
                      }
                      className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <form
                      onSubmit={handleJumpSubmit}
                      className="flex items-center gap-1"
                    >
                      <input
                        type="number"
                        min={1}
                        max={1330}
                        value={jumpInput}
                        onChange={(e) => setJumpInput(e.target.value)}
                        placeholder={`#${dailyKural.number}`}
                        className="w-20 min-h-[38px] px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 tabular-nums focus:outline-none focus:border-slate-900"
                      />
                    </form>
                    <button
                      onClick={() =>
                        setTodayKuralByNumber(
                          dailyKural.number < 1330 ? dailyKural.number + 1 : 1
                        )
                      }
                      className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dominant Visual Anchor: Modern Deep-Slate Habit Hero Card */}
            <section className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-sm space-y-6">
              {/* Unboxed Metadata Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-b border-slate-800 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    குறள் #{dailyKural.number}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{dailyKural.paal[language]}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-200 font-medium">
                    {dailyKural.adhigaram[language]}
                  </span>
                  {currentTopicMeta && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-medium">
                        {currentTopicMeta.label[language]}
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleSpeakKural(dailyKural)}
                  className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Stop Audio' : 'கேட்க (Listen)'}</span>
                </button>
              </div>

              {/* 2-Line Original Tamil Couplet */}
              <div className="space-y-3 py-1">
                <div className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white leading-snug tracking-tight space-y-1.5">
                  <p>{dailyKural.line1}</p>
                  <p>{dailyKural.line2}</p>
                </div>

                <div className="pt-2 space-y-1 text-xs sm:text-sm text-slate-300">
                  <p className="italic text-slate-400">
                    {dailyKural.tanglishCouplet}
                  </p>
                  <p className="text-slate-200 font-medium">
                    “{dailyKural.englishCouplet}”
                  </p>
                </div>
              </div>

              {/* Primary Habit Completion & Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Primary Habit Action: Mark Read & Complete */}
                  <button
                    onClick={() => markKuralReadAndComplete(dailyKural.number)}
                    className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isTodayHabitCompleted
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {isTodayHabitCompleted
                        ? labels.completedHabitBtn
                        : labels.markReadCompleteBtn}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(dailyKural.number)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                      isFavorited
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorited ? 'fill-rose-400 text-rose-400' : ''
                      }`}
                    />
                    <span>
                      {isFavorited ? labels.favoritedBtn : labels.favoriteBtn}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setShareModalKural(dailyKural)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{labels.shareBtn}</span>
                </button>
              </div>
            </section>

            {/* 2-Column Practical Deep-Dive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): Actual Explanation + Real-World Example + Daily Micro-Habit */}
              <div className="lg:col-span-7 space-y-6">
                {/* 01. Actual Explanation */}
                <section className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-3">
                  <h2 className="text-base font-bold text-slate-900">
                    {labels.actualExplanation}
                  </h2>
                  <p className="text-base text-slate-800 leading-relaxed">
                    {currentContent.explanation}
                  </p>
                  {currentContent.scholarNote && (
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
                      {currentContent.scholarNote}
                    </p>
                  )}
                </section>

                {/* 02. Real-World Example */}
                <section className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-3">
                  <h2 className="text-base font-bold text-slate-900">
                    {labels.realWorldExample}
                  </h2>
                  <p className="text-[15px] text-slate-700 leading-relaxed">
                    {currentContent.realWorldExample}
                  </p>
                </section>

                {/* Daily 1-Line Actionable Habit */}
                <section className="rounded-2xl bg-emerald-50/90 border border-emerald-200 p-6 space-y-2">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{labels.dailyAction}</span>
                  </div>
                  <p className="text-[15px] font-semibold text-slate-900 leading-relaxed">
                    {currentContent.actionableTakeaway}
                  </p>
                </section>
              </div>

              {/* Right Column (5 cols): Life & Business Applications + Personal Note */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-5">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="text-sm font-bold text-slate-900">
                      {language === 'tamil'
                        ? 'வாழ்க்கை & தொழில் வழிகாட்டி'
                        : 'Life & Business Playbook'}
                    </span>
                    <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                      {(['both', 'life', 'business'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setAppFocusFilter(mode)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                            appFocusFilter === mode
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {mode === 'both'
                            ? 'Both'
                            : mode === 'life'
                            ? 'Life'
                            : 'Business'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 03. Personal Life Application */}
                  {(appFocusFilter === 'both' || appFocusFilter === 'life') && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{labels.lifeApplication}</span>
                      </h3>
                      <p className="text-[15px] text-slate-700 leading-relaxed">
                        {currentContent.lifeApplication}
                      </p>
                    </div>
                  )}

                  {appFocusFilter === 'both' && (
                    <hr className="border-slate-100" />
                  )}

                  {/* 04. Business & Career Application */}
                  {(appFocusFilter === 'both' ||
                    appFocusFilter === 'business') && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{labels.businessApplication}</span>
                      </h3>
                      <p className="text-[15px] text-slate-700 leading-relaxed">
                        {currentContent.businessApplication}
                      </p>
                    </div>
                  )}
                </div>

                {/* 05. Offline Personal Note */}
                <section className="rounded-2xl bg-white border border-slate-200/90 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>{labels.personalNote}</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      Saved on device
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={personalNotes[dailyKural.number] || ''}
                    onChange={(e) =>
                      savePersonalNote(dailyKural.number, e.target.value)
                    }
                    placeholder={labels.saveNotePlaceholder}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-800 focus:outline-none focus:border-slate-900 resize-y"
                  />
                </section>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: 1,330 DIRECTORY (ONLY ENABLED IN ADVANCE MODE)     */}
        {/* ========================================================= */}
        {activeTab === 'explore' && advancedMode && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {language === 'tamil'
                    ? '1,330 திருக்குறள் தொகுப்பு (Advance Explorer Mode)'
                    : 'All 1,330 Kurals & 133 Chapters (Advance Mode)'}
                </h1>
                <p className="text-sm text-slate-600">
                  {language === 'tamil'
                    ? 'தலைப்பு, அதிகாரம் அல்லது குறள் எண் (1–1330) கொண்டு தேடவும்.'
                    : 'Search and filter across all 1,330 offline Kurals and 133 chapters.'}
                </p>
              </div>
              <button
                onClick={() => handleModeSwitch(false)}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300/70 text-xs font-semibold text-slate-800 cursor-pointer"
              >
                Switch back to Basic Habit Mode
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-7 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(30);
                  }}
                  placeholder={
                    language === 'tamil'
                      ? 'குறள் எண் (எ.கா. 467), சொல் அல்லது அதிகாரம் தேடுக...'
                      : 'Search by Kural # (e.g. 467), Tamil, Tanglish, or English keyword...'
                  }
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="md:col-span-5">
                <select
                  value={exploreChapter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setExploreChapter(val === 'all' ? 'all' : Number(val));
                    setVisibleCount(30);
                  }}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="all">
                    அனைத்து 133 அதிகாரங்கள் (All 133 Chapters)
                  </option>
                  {CHAPTERS_133.map((ch) => (
                    <option key={ch.number} value={ch.number}>
                      அதிகாரம் {ch.number}: {ch.nameTamil} ({ch.nameEnglish}) [#{ch.start}–#{ch.end}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setExploreTopic('all');
                  setVisibleCount(30);
                }}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                  exploreTopic === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All (1,330)
              </button>
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setExploreTopic(t.id);
                    setVisibleCount(30);
                  }}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    exploreTopic === t.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.label[language]}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredExploreKurals.slice(0, visibleCount).map((item) => {
                const isFav = favoriteNumbers.includes(item.number);
                return (
                  <div
                    key={item.number}
                    onClick={() => handleOpenKuralFromList(item.number)}
                    className="rounded-2xl bg-white border border-slate-200 hover:border-slate-400 p-5 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-700 tabular-nums">
                          #{item.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.adhigaram[language]}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.paal[language]}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.number);
                        }}
                        className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-slate-100"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFav
                              ? 'fill-rose-600 text-rose-600'
                              : 'text-slate-400'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="text-base font-bold text-slate-900 space-y-0.5">
                      <p>{item.line1}</p>
                      <p>{item.line2}</p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 pt-1">
                      {item.content[language].explanation}
                    </p>
                  </div>
                );
              })}

              {visibleCount < filteredExploreKurals.length && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + 40)}
                    className="min-h-[44px] px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Load More ({filteredExploreKurals.length - visibleCount}{' '}
                    remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: FAVORITES, COMPLETED STREAK & NOTES                */}
        {/* ========================================================= */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {language === 'tamil'
                    ? 'பிடித்தவை & படித்து முடித்தவை'
                    : 'Saved Favorites & Completed Habit Log'}
                </h1>
                <p className="text-sm text-slate-600">
                  {language === 'tamil'
                    ? 'நீங்கள் சேமித்த மற்றும் படித்து முடித்த குறள்கள் அனைத்தும் இங்கே ஆஃப்லைனில் இருக்கும்.'
                    : 'Your bookmarked Kurals, completed daily reads, and personal notes.'}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl self-start">
                <button
                  onClick={() => setSavedSubTab('favorites')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    savedSubTab === 'favorites'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Favorites ({favoriteKurals.length})
                </button>
                <button
                  onClick={() => setSavedSubTab('applied')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    savedSubTab === 'applied'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Completed ({appliedKuralsList.length})
                </button>
                <button
                  onClick={() => setSavedSubTab('notes')}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    savedSubTab === 'notes'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Notes ({notedKuralsList.length})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(savedSubTab === 'favorites'
                ? favoriteKurals
                : savedSubTab === 'applied'
                ? appliedKuralsList
                : notedKuralsList
              ).map((item) => (
                <div
                  key={item.number}
                  onClick={() => handleOpenKuralFromList(item.number)}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-slate-400 p-5 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div>
                      <span className="font-mono font-bold text-emerald-700 tabular-nums">
                        குறள் #{item.number}
                      </span>
                      <span className="mx-1.5" aria-hidden="true">
                        ·
                      </span>
                      <span>{item.adhigaram[language]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareModalKural(item);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                      >
                        Share
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.number);
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favoriteNumbers.includes(item.number)
                              ? 'fill-rose-600 text-rose-600'
                              : 'text-slate-400'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="text-base font-bold text-slate-900">
                    <p>{item.line1}</p>
                    <p>{item.line2}</p>
                  </div>

                  <p className="text-sm text-slate-700">
                    {item.content[language].explanation}
                  </p>

                  {personalNotes[item.number] && (
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800">
                      <strong>என் குறிப்பு:</strong> {personalNotes[item.number]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SCHEDULE, TOPICS, BASIC/ADVANCE & PLAY STORE       */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 5 Cols: Daily Schedule Time + App Mode Switch */}
              <div className="lg:col-span-5 space-y-6">
                <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      <span>{labels.scheduleHeading}</span>
                    </h2>
                    <p className="text-xs text-slate-600">
                      {language === 'tamil'
                        ? 'Android-ல் தினசரி நினைவூட்டல் வரும். உலாவியில் ஆப் திறந்திருக்கும் போது மட்டும் நினைவூட்டல் வரும்.'
                        : 'Android reminders work in the background. Browser reminders require the app to be open. Battery settings may delay delivery.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-lg font-mono font-bold text-slate-900 tabular-nums focus:outline-none focus:border-slate-900"
                    />

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {[
                        { time: '06:30', label: '06:30 AM (காலை)' },
                        { time: '08:30', label: '08:30 AM (பயணம்)' },
                        { time: '13:00', label: '01:00 PM (மதியம்)' },
                        { time: '21:00', label: '09:00 PM (இரவு)' },
                      ].map((preset) => (
                        <button
                          key={preset.time}
                          type="button"
                          onClick={() => setScheduleTime(preset.time)}
                          className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                            scheduleTime === preset.time
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Auto Notification Popup
                      </div>
                      <div className="text-xs text-slate-500">
                        Daily reminder around {scheduleTime}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReminderEnabled(!reminderEnabled)}
                      className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        reminderEnabled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {reminderEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {reminderError && <p role="status" className="text-sm text-amber-800">{reminderError}</p>}
                  <button
                    type="button"
                    onClick={triggerScheduledPopupNow}
                    className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <span>
                      {language === 'tamil'
                        ? 'நோட்டிபிகேஷன் பாப்-அப் எப்படி வரும் என இப்போதே பார்'
                        : 'Test Scheduled Notification Popup Now'}
                    </span>
                  </button>
                </section>

                {/* Basic Mode vs Advance Mode Card */}
                <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Basic Habit Mode vs. Advance Mode
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {advancedMode
                          ? 'Advance Mode ON: Full 1,330 Kural Directory & Chapter Search enabled.'
                          : 'Basic Mode ON: Clean daily habit view without book clutter.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch(!advancedMode)}
                      className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                        advancedMode
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {advancedMode ? 'Advance ON' : 'Basic Mode'}
                    </button>
                  </div>
                </section>
              </div>

              {/* Right 7 Cols: Interest Topics Selector */}
              <section className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-slate-900">
                      {labels.topicsHeading}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {language === 'tamil'
                        ? 'நீங்கள் தேர்ந்தெடுக்கும் தலைப்புகளில் இருந்து தினசரி குறள் தானாகத் தேர்ந்தெடுக்கப்படும்.'
                        : 'Daily Kurals will automatically rotate from the concepts you select below.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={selectAllTopics}
                    className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Select All 9 Topics
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TOPICS.map((topic) => {
                    const active = selectedTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                          active
                            ? 'bg-emerald-50/70 border-emerald-500 text-slate-900'
                            : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-slate-900">
                            {topic.label[language]}
                          </div>
                          <div className="text-xs text-slate-600 leading-relaxed">
                            {topic.description[language]}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                            active
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {active && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold">Privacy & Offline Reading</h3>
              <p className="text-sm text-slate-600">All 1,330 Kurals are stored on your device. Favorites and notes stay on this device. Uninstalling or clearing app data removes your saved data. Sharing sends only the text or image you choose to your selected app.</p>
              <p className="text-sm text-slate-600">Practical examples are topic-based reflection prompts. Voice reading depends on the voices installed on your device.</p>
              <button type="button" onClick={() => setPrivacyModalOpen(true)} className="min-h-[44px] px-4 rounded-xl bg-emerald-50 text-emerald-900 font-semibold">View Privacy Policy</button>
            </section>
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation Bar for Mobile Ergonomics */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid ${
          advancedMode ? 'grid-cols-4' : 'grid-cols-3'
        } items-center h-16`}
        aria-label="Mobile navigation"
      >
        <button
          onClick={() => setActiveTab('today')}
          className={`min-h-[48px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'today'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] mt-1 whitespace-nowrap">
            {labels.todayTab}
          </span>
        </button>

        {advancedMode && (
          <button
            onClick={() => setActiveTab('explore')}
            className={`min-h-[48px] flex flex-col items-center justify-center cursor-pointer ${
              activeTab === 'explore'
                ? 'text-emerald-600 font-bold'
                : 'text-slate-500'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[11px] mt-1 whitespace-nowrap">
              {labels.exploreTab}
            </span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('favorites')}
          className={`min-h-[48px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'favorites'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[11px] mt-1 whitespace-nowrap">
            {labels.favoritesTab}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`min-h-[48px] flex flex-col items-center justify-center cursor-pointer ${
            activeTab === 'settings'
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[11px] mt-1 whitespace-nowrap">
            {labels.settingsTab}
          </span>
        </button>
      </nav>

      {/* First-Time Habit Setup Onboarding Modal */}
      {!onboardingCompleted && (
        <OnboardingSetupModal
          language={language}
          scheduleTime={scheduleTime}
          selectedTopics={selectedTopics}
          onLanguageChange={setLanguage}
          onScheduleTimeChange={setScheduleTime}
          onToggleTopic={toggleTopic}
          onComplete={completeOnboarding}
        />
      )}

      {/* Automatic Scheduled Daily Kural Notification Popup */}
      {scheduledPopupOpen && (
        <ScheduledNotificationPopup
          kural={dailyKural}
          language={language}
          scheduleTime={scheduleTime}
          isFavorited={isFavorited}
          onLanguageChange={setLanguage}
          onToggleFavorite={() => toggleFavorite(dailyKural.number)}
          onCompleteHabit={() => markKuralReadAndComplete(dailyKural.number)}
          onShare={() => {
            closeScheduledPopup();
            setShareModalKural(dailyKural);
          }}
          onClose={closeScheduledPopup}
        />
      )}

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <PrivacyPolicyModal onClose={() => setPrivacyModalOpen(false)} />
      )}

      {/* Share Studio Modal */}
      {shareModalKural && (
        <ShareModal
          kural={shareModalKural}
          language={language}
          onClose={() => setShareModalKural(null)}
        />
      )}
    </div>
  );
}
