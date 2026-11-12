package com.nithamorukural.habitapp

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDateTime

class KuralApplication : Application()
class KuralViewModel(app: Application) : AndroidViewModel(app) {
    private val storage = app.getSharedPreferences("native_habit", 0)
    private val _preferences = MutableStateFlow(readPreferences(app))
    val preferences = _preferences.asStateFlow()
    private val _library = MutableStateFlow<Library?>(null)
    val library = _library.asStateFlow()
    private val _error = MutableStateFlow<String?>(null)
    val error = _error.asStateFlow()
    private val _now = MutableStateFlow(LocalDateTime.now())
    val now = _now.asStateFlow()
    init {
        viewModelScope.launch(Dispatchers.IO) {
            runCatching { Library.load(app) }.onSuccess { _library.value = it }.onFailure { _error.value = "Reading library could not load. Please restart the app." }
        }
        viewModelScope.launch { while (true) { refresh(); delay(15_000) } }
        ReminderScheduler.schedule(app, _preferences.value)
    }
    fun setReminder(enabled: Boolean) { update { it.copy(reminder=enabled) }; ReminderScheduler.schedule(getApplication(),_preferences.value) }
    fun onResume() { refresh(); ReminderScheduler.schedule(getApplication(),_preferences.value) }
    fun refresh() { _now.value = LocalDateTime.now() }
    fun update(change: (Preferences) -> Preferences) {
        val previous = _preferences.value
        val next = change(previous)
        _preferences.value = next
        storage.edit().putString("state", next.toJson()).apply()
        if (previous.reminder != next.reminder || previous.schedule != next.schedule) ReminderScheduler.schedule(getApplication(), next)
    }
    fun open(number: Int) { update { it.copy(customNumber = number.coerceIn(1,1330), customDate = cycleDate(it.schedule, LocalDateTime.now()).toString()) } }
    fun favorite(number: Int) { update { it.copy(favorites = if (number in it.favorites) it.favorites - number else it.favorites + number) } }
    fun complete(number: Int) { refresh(); update { it.copy(completed = it.completed + number, dates = it.dates + cycleDate(it.schedule, LocalDateTime.now()).toString()) } }
    fun note(number: Int, text: String) { update { it.copy(notes = it.notes + (number to text)) } }
    companion object {
        fun readPreferences(context: android.content.Context): Preferences = runCatching {
            val value = context.getSharedPreferences("native_habit",0).getString("state", null)
            if (value == null) Preferences() else Preferences.fromJson(value)
        }.getOrDefault(Preferences())
    }
}
