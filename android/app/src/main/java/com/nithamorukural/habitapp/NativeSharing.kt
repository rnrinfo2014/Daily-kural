package com.nithamorukural.habitapp

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Typeface
import android.speech.tts.TextToSpeech
import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import androidx.core.content.FileProvider
import java.io.File
import java.util.Locale

fun kuralShareText(kural: Kural, language: String): String {
    val c = kural.readings.getValue(language)
    return "திருக்குறள் #${kural.number} · ${kural.chapterNames[language]}\n\n${kural.line1}\n${kural.line2}\n\n${if (language == "english") kural.translation else if (language == "tanglish") kural.phonetic else ""}\n\n${c.explanation}\n\n${c.actionableTakeaway}\n\n— Nitham Oru Kural · Smartiva"
}
fun shareText(context: Context, text: String) {
    context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply { type = "text/plain"; putExtra(Intent.EXTRA_TEXT, text) }, "Share Kural"))
}
fun preparePoster(context: Context, kural: Kural, language: String): android.net.Uri {
    val text = kuralShareText(kural, language)
    val paint = TextPaint(TextPaint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE; textSize = 38f; typeface = Typeface.create("sans-serif", Typeface.NORMAL) }
    val layout = StaticLayout.Builder.obtain(text,0,text.length,paint,888).setAlignment(Layout.Alignment.ALIGN_NORMAL).setLineSpacing(12f,1f).setIncludePad(true).build()
    val bitmap = Bitmap.createBitmap(1080, layout.height + 192, Bitmap.Config.ARGB_8888)
    Canvas(bitmap).apply { drawColor(Color.rgb(15,23,42)); save(); translate(96f,96f); layout.draw(this); restore() }
    val dir = File(context.cacheDir,"posters").apply { mkdirs() }
    val file = File(dir,"daily-kural-${kural.number}.png")
    file.outputStream().use { bitmap.compress(Bitmap.CompressFormat.PNG,100,it) }; bitmap.recycle()
    return FileProvider.getUriForFile(context,"${context.packageName}.fileprovider",file)
}
fun sharePoster(context: Context, uri: android.net.Uri) {
    context.startActivity(Intent.createChooser(Intent(Intent.ACTION_SEND).apply {
        type="image/png"; putExtra(Intent.EXTRA_STREAM,uri); addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        clipData = android.content.ClipData.newRawUri("Kural",uri)
    },"Share Kural image"))
}
class OfflineSpeech(context: Context) {
    private var ready = false
    private var engine: TextToSpeech? = null
    init { engine = TextToSpeech(context.applicationContext) { ready = it == TextToSpeech.SUCCESS } }
    fun speak(kural: Kural, language: String): Boolean {
        val tts = engine ?: return false
        if (!ready) return false
        val code = if (language == "english") "en" else "ta"
        val voice = tts.voices?.firstOrNull { !it.isNetworkConnectionRequired && it.locale.language == code } ?: return false
        tts.voice = voice
        tts.setSpeechRate(0.9f)
        val text = if (language == "english") "${kural.translation}. ${kural.readings.getValue("english").explanation}" else "${kural.line1}. ${kural.line2}. ${kural.readings.getValue("tamil").explanation}"
        return tts.speak(text,TextToSpeech.QUEUE_FLUSH,null,"kural-${kural.number}") == TextToSpeech.SUCCESS
    }
    fun stop() { engine?.stop() }
    fun close() { engine?.stop(); engine?.shutdown() }
}
