package com.nithamorukural.habitapp

import org.junit.Assert.*
import org.junit.Test
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZonedDateTime

class HabitTest {
    @Test fun nativeDatasetContainsAllLocalizedReadings() {
        val library=Library.parse(java.io.File("src/main/assets/kurals.json").readText())
        assertEquals(1330,library.kurals.size);assertEquals(133,library.chapters.size)
        library.kurals.forEach { k -> languages.forEach { lang -> assertTrue(k.readings.getValue(lang).explanation.isNotBlank()) } }
    }

    @Test fun midnightScheduleIsNotSevenAm() {
        assertEquals(LocalDate.parse("2026-11-11"),cycleDate("00:30",LocalDateTime.parse("2026-11-12T00:29:00")))
        assertEquals(LocalDate.parse("2026-11-12"),cycleDate("00:30",LocalDateTime.parse("2026-11-12T00:30:00")))
    }
    @Test fun morningCycleCrossesYearBoundary() {
        assertEquals(LocalDate.parse("2026-12-31"),cycleDate("07:00",LocalDateTime.parse("2027-01-01T06:59:00")))
        assertEquals(LocalDate.parse("2027-01-01"),cycleDate("07:00",LocalDateTime.parse("2027-01-01T07:00:00")))
    }
    @Test fun streakAllowsUnfinishedTodayButBreaksOnGaps() {
        assertEquals(2,streak(setOf("2026-11-10","2026-11-11"),LocalDate.parse("2026-11-12")))
        assertEquals(0,streak(setOf("2026-11-09"),LocalDate.parse("2026-11-12")))
    }
    @Test fun remindersAlwaysScheduleInFutureAndHandleDst() {
        val before=ZonedDateTime.of(2026,11,12,7,0,0,0,ZoneId.of("Asia/Kolkata"))
        assertEquals(before.plusDays(1),nextReminder("07:00",before))
        val dst=ZonedDateTime.of(2027,3,14,1,0,0,0,ZoneId.of("America/New_York"))
        assertTrue(nextReminder("02:30",dst).isAfter(dst))
    }
    @Test fun legacyPreferencesPreserveNotesFavoritesAndCompletedDates() {
        val p=Preferences.fromJson("""{"language":"tanglish","favoriteNumbers":[41,467],"completedNumbers":[41],"completedDates":["2026-11-12"],"personalNotes":{"41":"என் குறிப்பு"},"scheduleTime":"00:30","reminderEnabled":true,"advancedMode":true}""")
        assertEquals("என் குறிப்பு",p.notes[41]);assertEquals(setOf(41,467),p.favorites)
        assertEquals("00:30",p.schedule);assertTrue(p.reminder);assertTrue(p.advanced)
        assertEquals(p,Preferences.fromJson(p.toJson()))
    }
    @Test fun corruptedLegacyValuesAreFiltered() {
        val p=Preferences.fromJson("""{"language":"invalid","scheduleTime":"25:00","favoriteNumbers":[null,-1,1400,"x",41],"selectedTopics":["invalid"],"completedDates":["broken"],"personalNotes":{"41":false}}""")
        assertEquals("tamil",p.language);assertEquals("07:00",p.schedule);assertEquals(setOf(41),p.favorites)
        assertTrue(p.notes.isEmpty());assertTrue(p.dates.isEmpty());assertEquals(defaultTopics,p.topics)
    }
}
