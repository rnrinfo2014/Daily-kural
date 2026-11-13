package com.nithamorukural.habitapp

import android.Manifest
import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import java.time.ZonedDateTime

object ReminderScheduler {
    fun permitted(context: Context) = Build.VERSION.SDK_INT < 33 || ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
    fun schedule(context: Context, prefs: Preferences) {
        val alarms = context.getSystemService(AlarmManager::class.java)
        val pending = PendingIntent.getBroadcast(context, 71, Intent(context, ReminderReceiver::class.java), PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        alarms.cancel(pending)
        if (!prefs.reminder || !permitted(context)) return
        val next = nextReminder(prefs.schedule, ZonedDateTime.now()).toInstant().toEpochMilli()
        alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, next, pending)
    }
}
class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val prefs = KuralViewModel.readPreferences(context)
        if (!prefs.reminder) return
        if (ReminderScheduler.permitted(context) && cycleDate(prefs.schedule,java.time.LocalDateTime.now()).toString() !in prefs.dates) {
            val manager = context.getSystemService(NotificationManager::class.java)
            if (Build.VERSION.SDK_INT >= 26) manager.createNotificationChannel(NotificationChannel("daily-kural-native", "Daily Kural", NotificationManager.IMPORTANCE_DEFAULT))
            val launch = PendingIntent.getActivity(context, 72, Intent(context, MainActivity::class.java), PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
            val tamil = prefs.language == "tamil"
            manager.notify(71, NotificationCompat.Builder(context,"daily-kural-native").setSmallIcon(R.drawable.ic_stat_kural)
                .setContentTitle(if (tamil) "நித்தம் ஒரு குறள்" else "Nitham Oru Kural")
                .setContentText(if (tamil) "இன்றைய குறளைப் படிக்க நேரம்." else "A moment of wisdom. Read your daily Kural.")
                .setContentIntent(launch).setAutoCancel(true).build())
        }
        ReminderScheduler.schedule(context, prefs)
    }
}
class ReminderRestoreReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) { ReminderScheduler.schedule(context, KuralViewModel.readPreferences(context)) }
}
