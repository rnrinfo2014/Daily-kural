package com.nithamorukural.habitapp

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZonedDateTime

data class Reading(val explanation: String, val scholarNote: String, val realWorldExample: String,
    val lifeApplication: String, val businessApplication: String, val actionableTakeaway: String)
data class Kural(val number: Int, val chapter: Int, val line1: String, val line2: String,
    val phonetic: String, val translation: String, val topic: String, val chapterNames: Map<String,String>,
    val parts: Map<String,String>, val readings: Map<String,Reading>)
data class Topic(val id: String, val labels: Map<String,String>)
data class Chapter(val number: Int, val names: Map<String,String>)
data class Library(val kurals: List<Kural>, val topics: List<Topic>, val chapters: List<Chapter>) {
    fun byNumber(number: Int) = kurals[(number.coerceIn(1, kurals.size)) - 1]
    companion object {
        fun load(context: Context): Library = parse(context.assets.open("kurals.json").bufferedReader().use { it.readText() })
        fun parse(raw: String): Library {
            val root = JSONObject(raw)
            val languages = listOf("tamil", "tanglish", "english")
            fun names(value: JSONObject) = languages.associateWith { value.optString(it) }
            val kurals = root.getJSONArray("kurals").objects().map { k ->
                Kural(k.getInt("number"), k.getInt("adhigaramNumber"), k.getString("line1"), k.getString("line2"),
                    k.getString("tanglishCouplet"), k.getString("englishCouplet"), k.getString("topic"),
                    names(k.getJSONObject("adhigaram")), names(k.getJSONObject("paal")), languages.associateWith { lang ->
                        val c = k.getJSONObject("content").getJSONObject(lang)
                        Reading(c.getString("explanation"), c.optString("scholarNote"), c.getString("realWorldExample"),
                            c.getString("lifeApplication"), c.getString("businessApplication"), c.getString("actionableTakeaway"))
                    })
            }
            require(kurals.size == 1330 && kurals.withIndex().all { it.value.number == it.index + 1 })
            return Library(kurals, root.getJSONArray("topics").objects().map { Topic(it.getString("id"), names(it.getJSONObject("label"))) },
                root.getJSONArray("chapters").objects().map { c -> Chapter(c.getInt("number"), mapOf("tamil" to c.getString("nameTamil"), "tanglish" to c.getString("nameTanglish"), "english" to c.getString("nameEnglish"))) })
        }
    }
}
fun JSONArray.objects(): List<JSONObject> = (0 until length()).map { getJSONObject(it) }
val defaultTopics = setOf("leadership", "wealth", "time", "communication", "resilience", "ethics")
val validTopics = defaultTopics + setOf("networking", "learning", "relationships")
val languages = listOf("tamil", "tanglish", "english")

data class Preferences(val language: String = "tamil", val topics: Set<String> = defaultTopics,
    val schedule: String = "07:00", val reminder: Boolean = false, val favorites: Set<Int> = setOf(467,517,619),
    val completed: Set<Int> = emptySet(), val dates: Set<String> = emptySet(), val notes: Map<Int,String> = emptyMap(),
    val customNumber: Int? = null, val customDate: String? = null, val advanced: Boolean = false) {
    fun toJson(): String = JSONObject().apply {
        put("language", language); put("selectedTopics", JSONArray(topics.toList())); put("scheduleTime", schedule)
        put("reminderEnabled", reminder); put("favoriteNumbers", JSONArray(favorites.toList()))
        put("completedNumbers", JSONArray(completed.toList())); put("completedDates", JSONArray(dates.toList()))
        put("personalNotes", JSONObject(notes.mapKeys { it.key.toString() })); put("customDailyKuralNumber", customNumber)
        put("customDailyDate", customDate); put("advancedMode", advanced); put("onboardingCompleted", true)
    }.toString()
    companion object {
        fun fromJson(raw: String): Preferences {
            val j = JSONObject(raw)
            fun numbers(key: String, default: Set<Int> = emptySet()): Set<Int> {
                val a = j.optJSONArray(key) ?: return default
                return (0 until a.length()).mapNotNull { (a.opt(it) as? Number)?.toInt()?.takeIf { n -> n in 1..1330 } }.toSet()
            }
            val ts = j.optJSONArray("selectedTopics")?.let { a -> (0 until a.length()).map { a.optString(it) }.filter { it in validTopics }.toSet() }.orEmpty()
            val ns = j.optJSONObject("personalNotes")
            val notes = ns?.keys()?.asSequence()?.mapNotNull { key -> key.toIntOrNull()?.takeIf { it in 1..1330 }?.let { n -> (ns.opt(key) as? String)?.let { n to it } } }?.toMap().orEmpty()
            val dateArray = j.optJSONArray("completedDates")
            val dates = dateArray?.let { a -> (0 until a.length()).mapNotNull { i -> a.optString(i).takeIf { runCatching { LocalDate.parse(it) }.isSuccess } }.toSet() }.orEmpty()
            return Preferences(j.optString("language").takeIf { it in languages } ?: "tamil", ts.ifEmpty { defaultTopics },
                j.optString("scheduleTime").takeIf { validTime(it) } ?: "07:00", j.optBoolean("reminderEnabled", false),
                numbers("favoriteNumbers", setOf(467,517,619)), numbers("completedNumbers"), dates, notes,
                j.optInt("customDailyKuralNumber").takeIf { it in 1..1330 }, j.optString("customDailyDate").takeIf { it != "null" && it.isNotBlank() }, j.optBoolean("advancedMode"))
        }
    }
}
fun validTime(value: String) = Regex("([01]\\d|2[0-3]):[0-5]\\d").matches(value)
fun cycleDate(schedule: String, now: LocalDateTime): LocalDate {
    val time = if (validTime(schedule)) LocalTime.parse(schedule) else LocalTime.of(7,0)
    return if (now.toLocalTime() < time) now.toLocalDate().minusDays(1) else now.toLocalDate()
}
fun streak(dates: Set<String>, today: LocalDate): Int {
    var date = if (today.toString() in dates) today else today.minusDays(1)
    var count = 0
    while (date.toString() in dates) { count++; date = date.minusDays(1) }
    return count
}
fun nextReminder(schedule: String, now: ZonedDateTime): ZonedDateTime {
    val time = if (validTime(schedule)) LocalTime.parse(schedule) else LocalTime.of(7,0)
    val today = now.toLocalDate().atTime(time).atZone(now.zone)
    return if (today > now) today else now.toLocalDate().plusDays(1).atTime(time).atZone(now.zone)
}
fun dailyKural(library: Library, preferences: Preferences, date: LocalDate): Kural {
    if (preferences.customDate == date.toString() && preferences.customNumber != null) return library.byNumber(preferences.customNumber)
    val pool = library.kurals.filter { it.topic in preferences.topics }.ifEmpty { library.kurals }
    var hash = 0L
    date.toString().forEach { hash = (hash * 31 + it.code) and 0xffffffffL }
    val featured = listOf(1,391,423,467,478,517,619,643,484,131,791,595,95,661,754,291,441,675,621)
        .map { library.byNumber(it) }.filter { it.topic in preferences.topics }
    return if (featured.isNotEmpty() && hash % 2L == 0L) featured[(hash % featured.size).toInt()] else pool[(hash % pool.size).toInt()]
}
