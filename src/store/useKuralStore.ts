import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ALL_1330_KURALS,
  FEATURED_KURAL_NUMBERS,
  getKuralByNumber,
  KuralItem,
  LanguageMode,
  TopicId,
  TOPICS,
} from '../data/kurals';

import { currentStreak, getEffectiveCycleDate, parseSchedule } from '../lib/habit';
import { isNative, requestReminderPermission, syncNativeReminder } from '../lib/reminders';
export { getEffectiveCycleDate } from '../lib/habit';

const STORAGE_KEY = 'nitham_oru_kural_v2_habit_state';

export interface UserPreferencesState {
  language: LanguageMode;
  selectedTopics: TopicId[];
  scheduleTime: string; // HH:mm in 24h format, e.g. "07:00"
  reminderEnabled: boolean;
  lastNotifiedDate: string | null; // YYYY-MM-DD
  favoriteNumbers: number[];
  completedNumbers: number[]; // Kurals marked as Read & Completed
  completedDates: string[]; // YYYY-MM-DD dates when daily habit was completed
  personalNotes: Record<number, string>;
  customDailyKuralNumber: number | null;
  customDailyDate: string | null;
  onboardingCompleted: boolean;
  advancedMode: boolean; // false = Basic Habit Mode (default), true = Advance Mode (1330 Directory)
}

const DEFAULT_TOPICS: TopicId[] = [
  'leadership',
  'wealth',
  'time',
  'communication',
  'resilience',
  'ethics',
];

const DEFAULT_STATE: UserPreferencesState = {
  language: 'tamil',
  selectedTopics: DEFAULT_TOPICS,
  scheduleTime: '07:00',
  reminderEnabled: true,
  lastNotifiedDate: null,
  favoriteNumbers: [467, 517, 619],
  completedNumbers: [],
  completedDates: [],
  personalNotes: {},
  customDailyKuralNumber: null,
  customDailyDate: null,
  onboardingCompleted: false,
  advancedMode: false,
};

export function computeDailyKural(
  cycleDateStr: string,
  selectedTopics: TopicId[]
): KuralItem {
  const activeTopics =
    selectedTopics.length > 0 ? selectedTopics : DEFAULT_TOPICS;

  const pool = ALL_1330_KURALS.filter((k) => activeTopics.includes(k.topic));
  const candidatePool = pool.length > 0 ? pool : ALL_1330_KURALS;

  let hash = 0;
  for (let i = 0; i < cycleDateStr.length; i++) {
    hash = (hash * 31 + cycleDateStr.charCodeAt(i)) >>> 0;
  }

  const matchingFeatured = FEATURED_KURAL_NUMBERS.map((n) =>
    getKuralByNumber(n)
  ).filter((k) => activeTopics.includes(k.topic));

  if (matchingFeatured.length > 0 && hash % 2 === 0) {
    return matchingFeatured[hash % matchingFeatured.length];
  }

  return candidatePool[hash % candidatePool.length];
}

function loadInitialState(): UserPreferencesState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<UserPreferencesState>;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return DEFAULT_STATE;
    const numbers = (value: unknown, fallback: number[]) => Array.isArray(value) ? [...new Set(value.filter((n) => Number.isInteger(n) && n >= 1 && n <= 1330))] : fallback;
    const topics = Array.isArray(parsed.selectedTopics) ? parsed.selectedTopics.filter((id) => TOPICS.some((topic) => topic.id === id)) : [];
    return {
      ...DEFAULT_STATE,
      ...parsed,
      language: (parsed.language === 'tamil' || parsed.language === 'tanglish' || parsed.language === 'english') ? parsed.language : 'tamil',
      selectedTopics: topics.length ? topics : DEFAULT_TOPICS,
      scheduleTime: typeof parsed.scheduleTime === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(parsed.scheduleTime) ? parsed.scheduleTime : '07:00',
      reminderEnabled: typeof parsed.reminderEnabled === 'boolean' ? parsed.reminderEnabled : true,
      onboardingCompleted: parsed.onboardingCompleted === true,
      favoriteNumbers: numbers(parsed.favoriteNumbers, DEFAULT_STATE.favoriteNumbers),
      completedNumbers: numbers(parsed.completedNumbers, []),
      completedDates: Array.isArray(parsed.completedDates) ? [...new Set(parsed.completedDates.filter((date) => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)))] : [],
      personalNotes: parsed.personalNotes && typeof parsed.personalNotes === 'object'
        ? Object.fromEntries(Object.entries(parsed.personalNotes).filter(([key, value]) => Number(key) >= 1 && Number(key) <= 1330 && typeof value === 'string')) : {},
      customDailyKuralNumber: typeof parsed.customDailyKuralNumber === 'number' && Number.isInteger(parsed.customDailyKuralNumber) && parsed.customDailyKuralNumber >= 1 && parsed.customDailyKuralNumber <= 1330 ? parsed.customDailyKuralNumber : null,
      advancedMode: Boolean(parsed.advancedMode),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useKuralStore() {
  const [state, setState] = useState<UserPreferencesState>(loadInitialState);
  const [now, setNow] = useState(() => new Date());
  const [reminderError, setReminderError] = useState('');
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 10000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  const [scheduledPopupOpen, setScheduledPopupOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError('');
    } catch {
      setStorageError('Device storage is unavailable. Changes may be lost when you close the app.');
    }
  }, [state]);

  const effectiveCycleDate = getEffectiveCycleDate(state.scheduleTime, now);
  const todayDateStr = effectiveCycleDate;

  const dailyKural = useMemo(() => {
    if (
      state.customDailyKuralNumber &&
      state.customDailyDate === effectiveCycleDate
    ) {
      return getKuralByNumber(state.customDailyKuralNumber);
    }
    return computeDailyKural(effectiveCycleDate, state.selectedTopics);
  }, [
    state.customDailyKuralNumber,
    state.customDailyDate,
    effectiveCycleDate,
    state.selectedTopics,
  ]);

  const isTodayHabitCompleted = useMemo(
    () =>
      state.completedDates.includes(todayDateStr),
    [state.completedDates, todayDateStr]
  );

  const habitStreakCount = useMemo(
    () => currentStreak(state.completedDates, todayDateStr),
    [state.completedDates, todayDateStr]
  );

  const fireSystemNotification = useCallback((kural: KuralItem) => {
    if (
      typeof window !== 'undefined' &&
      !isNative &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(`இன்றைய திருக்குறள் #${kural.number}`, {
          body: `${kural.line1}\n${kural.line2}`,
          icon: '/pwa-192x192.png',
        });
      } catch {
        // Fallback if Notification constructor is restricted
      }
    }
  }, []);

  // Automatic Scheduled Time Popup & Notification Watcher
  useEffect(() => {
    if (!state.reminderEnabled || !state.onboardingCompleted) return;

    const checkSchedule = () => {
      const now = new Date();
      const currentDayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      if (state.lastNotifiedDate === currentDayStr) return;

      const [schedH, schedM] = parseSchedule(state.scheduleTime);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const scheduledMinutes = schedH * 60 + schedM;

      // Show the reminder when opened at or after the scheduled time.
      if (
        currentMinutes >= scheduledMinutes &&
        !isTodayHabitCompleted
      ) {
        setScheduledPopupOpen(true);
        setState((prev) => ({ ...prev, lastNotifiedDate: currentDayStr }));
        fireSystemNotification(dailyKural);
      }
    };

    checkSchedule();
    const timer = window.setInterval(checkSchedule, 20000);
    return () => window.clearInterval(timer);
  }, [
    state.reminderEnabled,
    state.onboardingCompleted,
    state.scheduleTime,
    state.lastNotifiedDate,
    isTodayHabitCompleted,
    dailyKural,
    fireSystemNotification,
  ]);

  const setLanguage = useCallback((language: LanguageMode) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const setAdvancedMode = useCallback((advancedMode: boolean) => {
    setState((prev) => ({ ...prev, advancedMode }));
  }, []);

  const toggleTopic = useCallback((topicId: TopicId) => {
    setState((prev) => {
      const exists = prev.selectedTopics.includes(topicId);
      if (exists && prev.selectedTopics.length === 1) {
        return prev;
      }
      const updated = exists
        ? prev.selectedTopics.filter((id) => id !== topicId)
        : [...prev.selectedTopics, topicId];
      return {
        ...prev,
        selectedTopics: updated,
        customDailyKuralNumber: null,
      };
    });
  }, []);

  const selectAllTopics = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedTopics: TOPICS.map((t) => t.id),
      customDailyKuralNumber: null,
    }));
  }, []);

  const setScheduleTime = useCallback((scheduleTime: string) => {
    setState((prev) => ({
      ...prev,
      scheduleTime,
      lastNotifiedDate: null, // Allow new schedule time to trigger today
    }));
  }, []);

  useEffect(() => {
    syncNativeReminder(state.reminderEnabled && state.onboardingCompleted, state.scheduleTime)
      .catch(() => setReminderError('Could not schedule reminder. Check notification permissions in Android Settings.'));
  }, [state.reminderEnabled, state.onboardingCompleted, state.scheduleTime]);

  const setReminderEnabled = useCallback(async (enabled: boolean) => {
    try {
      const granted = !enabled || await requestReminderPermission();
      setReminderError(granted ? '' : 'Notifications are blocked. Enable permission in device settings. In-app reminders still work while open.');
      setState((prev) => ({ ...prev, reminderEnabled: enabled && granted }));
    } catch {
      setReminderError('Notification permission could not be requested. Please check device settings.');
    }
  }, []);

  const toggleFavorite = useCallback((kuralNumber: number) => {
    setState((prev) => {
      const isFav = prev.favoriteNumbers.includes(kuralNumber);
      const favoriteNumbers = isFav
        ? prev.favoriteNumbers.filter((n) => n !== kuralNumber)
        : [kuralNumber, ...prev.favoriteNumbers];
      return { ...prev, favoriteNumbers };
    });
  }, []);

  const markKuralReadAndComplete = useCallback(
    (kuralNumber: number) => {
      setState((prev) => {
        const completedNumbers = prev.completedNumbers.includes(kuralNumber)
          ? prev.completedNumbers
          : [...prev.completedNumbers, kuralNumber];
        const completedDates = prev.completedDates.includes(todayDateStr)
          ? prev.completedDates
          : [...prev.completedDates, todayDateStr];
        return {
          ...prev,
          completedNumbers,
          completedDates,
        };
      });
      setScheduledPopupOpen(false);
    },
    [todayDateStr]
  );

  const toggleCompleted = useCallback(
    (kuralNumber: number) => {
      setState((prev) => {
        const isDone = prev.completedNumbers.includes(kuralNumber);
        const completedNumbers = isDone
          ? prev.completedNumbers.filter((n) => n !== kuralNumber)
          : [...prev.completedNumbers, kuralNumber];
        const completedDates =
          !isDone && !prev.completedDates.includes(todayDateStr)
            ? [...prev.completedDates, todayDateStr]
            : prev.completedDates;
        return { ...prev, completedNumbers, completedDates };
      });
    },
    [todayDateStr]
  );

  const savePersonalNote = useCallback((kuralNumber: number, note: string) => {
    setState((prev) => ({
      ...prev,
      personalNotes: {
        ...prev.personalNotes,
        [kuralNumber]: note,
      },
    }));
  }, []);

  const setTodayKuralByNumber = useCallback(
    (kuralNumber: number) => {
      if (!Number.isFinite(kuralNumber)) return;
      const clamped = Math.max(1, Math.min(1330, Math.trunc(kuralNumber)));
      setState((prev) => ({
        ...prev,
        customDailyKuralNumber: clamped,
        customDailyDate: effectiveCycleDate,
      }));
    },
    [effectiveCycleDate]
  );

  const pickNextTopicKural = useCallback(() => {
    const activeTopics =
      state.selectedTopics.length > 0 ? state.selectedTopics : DEFAULT_TOPICS;
    const pool = ALL_1330_KURALS.filter((k) => activeTopics.includes(k.topic));
    if (pool.length === 0) return;

    const currentIdx = pool.findIndex((k) => k.number === dailyKural.number);
    const nextItem = pool[(currentIdx + 1) % pool.length];
    setTodayKuralByNumber(nextItem.number);
  }, [state.selectedTopics, dailyKural.number, setTodayKuralByNumber]);

  const resetToScheduledDailyKural = useCallback(() => {
    setState((prev) => ({
      ...prev,
      customDailyKuralNumber: null,
      customDailyDate: null,
    }));
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (state.reminderEnabled) await setReminderEnabled(true);
    setState((prev) => ({ ...prev, onboardingCompleted: true }));
  }, [state.reminderEnabled, setReminderEnabled]);

  const triggerScheduledPopupNow = useCallback(() => {
    setScheduledPopupOpen(true);
    fireSystemNotification(dailyKural);
  }, [dailyKural, fireSystemNotification]);

  const closeScheduledPopup = useCallback(() => {
    setScheduledPopupOpen(false);
  }, []);

  const favoriteKurals = useMemo(
    () => state.favoriteNumbers.map((num) => getKuralByNumber(num)),
    [state.favoriteNumbers]
  );

  return {
    language: state.language,
    selectedTopics: state.selectedTopics,
    scheduleTime: state.scheduleTime,
    reminderEnabled: state.reminderEnabled,
    reminderError,
    storageError,
    favoriteNumbers: state.favoriteNumbers,
    favoriteKurals,
    completedNumbers: state.completedNumbers,
    completedDates: state.completedDates,
    personalNotes: state.personalNotes,
    onboardingCompleted: state.onboardingCompleted,
    advancedMode: state.advancedMode,
    dailyKural,
    isTodayHabitCompleted,
    habitStreakCount,
    isCustomDailyOverride:
      state.customDailyKuralNumber !== null &&
      state.customDailyDate === effectiveCycleDate,
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
    toggleCompleted,
    savePersonalNote,
    setTodayKuralByNumber,
    pickNextTopicKural,
    resetToScheduledDailyKural,
    completeOnboarding,
    triggerScheduledPopupNow,
    closeScheduledPopup,
  };
}
