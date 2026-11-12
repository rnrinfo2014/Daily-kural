package com.nithamorukural.habitapp

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONTokener

/** One-time on-device import from the old app's trusted localhost origin. No web UI is rendered. */
object LegacyMigration {
    @SuppressLint("SetJavaScriptEnabled")
    fun run(activity: Activity, finished: () -> Unit) {
        val prefs = activity.getSharedPreferences("native_habit", 0)
        if (prefs.getBoolean("legacy_checked", false)) { finished(); return }
        if (!java.io.File(activity.applicationInfo.dataDir,"app_webview").exists()) {
            prefs.edit().putBoolean("legacy_checked",true).apply(); finished(); return
        }
        var done = false
        val web = WebView(activity)
        fun finish(checked: Boolean) {
            if (done) return
            done = true
            prefs.edit().putBoolean("legacy_checked", checked).putString("legacy_status",if(checked)"checked" else "retry_needed").apply()
            web.destroy()
            finished()
        }
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.blockNetworkLoads = true
        web.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String) {
                view.evaluateJavascript("localStorage.getItem('nitham_oru_kural_v2_habit_state')") { result ->
                    if (done) return@evaluateJavascript
                    val imported = runCatching {
                        val raw = JSONTokener(result).nextValue() as? String
                        if (raw != null && raw != "null") {
                            val legacy = Preferences.fromJson(raw)
                            val current = prefs.getString("state",null)?.let { runCatching{Preferences.fromJson(it)}.getOrNull() }
                            val state = if(current==null) legacy else current.copy(
                                favorites=current.favorites+legacy.favorites,completed=current.completed+legacy.completed,
                                dates=current.dates+legacy.dates,notes=legacy.notes+current.notes)
                            check(prefs.edit().putString("state",state.toJson()).commit())
                        }
                    }
                    finish(imported.isSuccess)
                }
            }
        }
        Handler(Looper.getMainLooper()).postDelayed({ finish(false) }, 15000)
        web.loadDataWithBaseURL("https://localhost/", "<html><head><meta charset='utf-8'></head><body></body></html>", "text/html", "UTF-8", null)
    }
}
