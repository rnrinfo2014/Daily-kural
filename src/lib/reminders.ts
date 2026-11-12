import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { parseSchedule } from './habit';

export const isNative = Capacitor.isNativePlatform();

export async function requestReminderPermission(): Promise<boolean> {
  if (isNative) return (await LocalNotifications.requestPermissions()).display === 'granted';
  if (!('Notification' in window)) return false;
  return (await Notification.requestPermission()) === 'granted';
}

export async function syncNativeReminder(enabled: boolean, time: string): Promise<void> {
  if (!isNative) return;
  await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  if (!enabled || (await LocalNotifications.checkPermissions()).display !== 'granted') return;
  const [hour, minute] = parseSchedule(time);
  await LocalNotifications.createChannel({
    id: 'daily-kural', name: 'Daily Kural', description: 'Daily reading reminder', importance: 3,
  });
  await LocalNotifications.schedule({ notifications: [{
    id: 1,
    title: 'நித்தம் ஒரு குறள் · Daily Kural',
    body: 'இன்றைய குறளைப் படிக்க நேரம். Open your daily Kural and take a moment to reflect.',
    channelId: 'daily-kural',
    smallIcon: 'ic_stat_kural',
    isExactNotification: false,
    schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
  }] });
}
