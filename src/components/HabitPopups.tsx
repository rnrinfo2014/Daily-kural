import React from 'react';
import { KuralItem, LanguageMode, TopicId, TOPICS } from '../data/kurals';
import {
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  X,
  ExternalLink,
  Heart,
  Share2,
  Check,
} from 'lucide-react';

interface ScheduledNotificationPopupProps {
  kural: KuralItem;
  language: LanguageMode;
  scheduleTime: string;
  isFavorited: boolean;
  onLanguageChange: (lang: LanguageMode) => void;
  onToggleFavorite: () => void;
  onCompleteHabit: () => void;
  onShare: () => void;
  onClose: () => void;
}

export const ScheduledNotificationPopup: React.FC<
  ScheduledNotificationPopupProps
> = ({
  kural,
  language,
  scheduleTime,
  isFavorited,
  onLanguageChange,
  onToggleFavorite,
  onCompleteHabit,
  onShare,
  onClose,
}) => {
  const content = kural.content[language];
  const topicMeta = TOPICS.find((t) => t.id === kural.topic);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Android Notification Header Banner */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-emerald-400 tabular-nums">
                Scheduled Daily Kural · {scheduleTime}
              </div>
              <h3 className="text-sm font-bold text-white">
                {language === 'tamil'
                  ? `இன்றைய திருக்குறள் பழக்கம் (#${kural.number})`
                  : `Today’s Daily Habit Kural (#${kural.number})`}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Dismiss popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Habit Card Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Language Switcher inside Popup */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">
              {kural.adhigaram[language]}
              {topicMeta ? ` · ${topicMeta.label[language]}` : ''}
            </span>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {(['tamil', 'tanglish', 'english'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    language === lang
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'tamil'
                    ? 'தமிழ்'
                    : lang === 'tanglish'
                    ? 'Tanglish'
                    : 'EN'}
                </button>
              ))}
            </div>
          </div>

          {/* Kural Couplet Box */}
          <div className="rounded-2xl bg-slate-900 text-white p-5 space-y-2">
            <div className="text-lg sm:text-xl font-bold leading-snug space-y-1">
              <p>{kural.line1}</p>
              <p>{kural.line2}</p>
            </div>
            <p className="text-xs text-slate-300 italic pt-1">
              {kural.tanglishCouplet}
            </p>
          </div>

          {/* Actual Explanation */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-700">
              {language === 'tamil'
                ? 'தெளிவுரை (Actual Explanation)'
                : 'Actual Explanation'}
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed">
              {content.explanation}
            </p>
          </div>

          {/* Real-World Example */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700">
              {language === 'tamil'
                ? 'நடைமுறை உதாரணம் (Real-World Example)'
                : 'Real-World Example'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {content.realWorldExample}
            </p>
          </div>

          {/* Life & Business Application */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1">
              <div className="text-xs font-bold text-slate-900">
                {language === 'tamil'
                  ? 'வாழ்க்கைக்கு (Life)'
                  : 'In Personal Life'}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {content.lifeApplication}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-1">
              <div className="text-xs font-bold text-slate-900">
                {language === 'tamil'
                  ? 'தொழிலுக்கு (Business)'
                  : 'In Business & Work'}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {content.businessApplication}
              </p>
            </div>
          </div>

          {/* 1-Line Action Step */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-1">
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {language === 'tamil'
                  ? 'இன்றைய பழக்கம் (Today’s Habit)'
                  : 'Today’s Micro-Habit'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-950">
              {content.actionableTakeaway}
            </p>
          </div>
        </div>

        {/* Sticky Bottom Completion Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              className={`min-h-[44px] px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isFavorited
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited ? 'fill-rose-600 text-rose-600' : ''
                }`}
              />
              <span className="hidden sm:inline">Favorite</span>
            </button>

            <button
              onClick={onShare}
              className="min-h-[44px] px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          <button
            onClick={onCompleteHabit}
            className="flex-1 min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {language === 'tamil'
                ? 'படித்து முடித்தேன் (Complete Today)'
                : 'Read & Complete Today'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface OnboardingSetupModalProps {
  language: LanguageMode;
  scheduleTime: string;
  selectedTopics: TopicId[];
  onLanguageChange: (lang: LanguageMode) => void;
  onScheduleTimeChange: (time: string) => void;
  onToggleTopic: (topic: TopicId) => void;
  onComplete: () => void;
}

export const OnboardingSetupModal: React.FC<OnboardingSetupModalProps> = ({
  language,
  scheduleTime,
  selectedTopics,
  onLanguageChange,
  onScheduleTimeChange,
  onToggleTopic,
  onComplete,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-6 border-b border-slate-100 space-y-1.5">
          <div className="text-xs font-bold text-emerald-600">
            100% Offline Daily Good Habit Setup
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'tamil'
              ? 'உங்கள் தினசரி திருக்குறள் பழக்கத்தை அமைக்கவும்'
              : 'Set Up Your Daily Thirukkural Habit'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'tamil'
              ? 'தினமும் நீங்கள் தேர்ந்தெடுக்கும் நேரத்தில், உங்களுக்குப் பிடித்த தலைப்பிலிருந்து ஒரு குறளும் அதன் நடைமுறை விளக்கமும் நோட்டிபிகேஷனில் பாப்-அப் ஆகும்.'
              : 'Pick your preferred language, daily notification time, and life/business concepts.'}
          </p>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Language */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              1. விளக்க மொழி (Explanation Language)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['tamil', 'tanglish', 'english'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    language === lang
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'tamil'
                    ? 'எளிய தமிழ்'
                    : lang === 'tanglish'
                    ? 'Tanglish'
                    : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Daily Schedule Time */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>2. தினசரி நோட்டிபிகேஷன் நேரம் (Daily Schedule Time)</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => onScheduleTimeChange(e.target.value)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm font-mono font-bold text-slate-900 tabular-nums"
              />
              {[
                { t: '06:30', l: '06:30 AM' },
                { t: '08:30', l: '08:30 AM' },
                { t: '21:00', l: '09:00 PM' },
              ].map((p) => (
                <button
                  key={p.t}
                  type="button"
                  onClick={() => onScheduleTimeChange(p.t)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    scheduleTime === p.t
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Interest Topics */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              3. விருப்பமான தலைப்புகள் (Choose Interest Topics)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPICS.map((t) => {
                const active = selectedTopics.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onToggleTopic(t.id)}
                    className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      active
                        ? 'bg-emerald-50/80 border-emerald-500 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="truncate">{t.label[language]}</span>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                        active
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onComplete}
            className="w-full min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            {language === 'tamil'
              ? 'சேமித்து இன்றைய குறளைத் தொடங்கு (Start My Daily Habit)'
              : 'Save Schedule & Start My Daily Habit'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Privacy Policy
              </h3>
              <p className="text-xs text-slate-500">
                100% Offline · Zero Personal Data Collected · COPPA Safe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900">
            <strong>Play Console Privacy URL:</strong> This app includes a
            dedicated static privacy policy page at{' '}
            <a
              href="/privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold inline-flex items-center gap-1"
            >
              /privacy-policy.html <ExternalLink className="w-3 h-3" />
            </a>{' '}
            contains the full privacy policy. Sharing sends content only to the app you choose.
          </div>

          <h4 className="font-bold text-slate-900">
            1. Zero Data Collection & 100% Offline Operation
          </h4>
          <p>
            <strong>Nitham Oru Kural</strong> operates completely offline on
            your Android device. We do not collect, transmit, rent, or store any
            personal data, analytics, IP addresses, or device identifiers on any
            remote server.
          </p>

          <h4 className="font-bold text-slate-900">
            2. Local Device Storage Only
          </h4>
          <p>
            Your selected schedule time, interest topics, language mode (Simple
            Tamil, Tanglish, English), saved favorites, completed habit streak,
            and reflection notes are stored exclusively inside your phone’s
            local storage (<code>localStorage</code>).
          </p>

          <h4 className="font-bold text-slate-900">
            3. Zero Background AI or Third-Party Trackers
          </h4>
          <p>
            All 1,330 Thirukkural verses and explanations are pre-bundled
            locally inside the application. There are no background AI API
            calls, no advertising SDKs, and no third-party tracking scripts.
            Optional sharing sends your selected Kural to the app you choose.
            For privacy questions, contact info@smartiva.in.
          </p>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
