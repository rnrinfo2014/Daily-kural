package com.nithamorukural.habitapp

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35],qualifiers="w320dp-h800dp-xhdpi")
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class LargeFontUiTest {
    @get:Rule val compose=createAndroidComposeRule<MainActivity>()
    @Test fun tamilAt150PercentFontFits320dpScreen() {
        RuntimeEnvironment.setFontScale(1.5f)
        compose.activityRule.scenario.recreate()
        compose.waitUntil(30_000){compose.onAllNodesWithText("இன்றைய வாசிப்பு").fetchSemanticsNodes().isNotEmpty()}
        assertEquals(1.5f,compose.activity.resources.configuration.fontScale,0.01f)
        val root=compose.onRoot().fetchSemanticsNode().boundsInRoot
        for (text in listOf("நித்தம் ஒரு குறள்","இன்று","சேமிப்பு","அமைப்பு")) {
            val node=compose.onNodeWithText(text).fetchSemanticsNode().boundsInRoot
            assertTrue("$text must fit horizontally",node.left>=0 && node.right<=root.width+1)
        }
        compose.onNodeWithText("நித்தம் ஒரு குறள்").assertIsDisplayed()
        val header=compose.onNodeWithText("SMARTIVA  ·  DAILY WISDOM").fetchSemanticsNode().boundsInRoot
        val language=compose.onNodeWithText("மொழி: தமிழ்").fetchSemanticsNode().boundsInRoot
        assertTrue("Language control must stay below the header",language.top>=header.bottom)
        compose.runOnIdle { saveNativeScreenshot(compose.activity,"today-tamil-large-font.png") }
    }
}
