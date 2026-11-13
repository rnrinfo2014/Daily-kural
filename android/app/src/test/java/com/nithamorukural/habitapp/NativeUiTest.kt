package com.nithamorukural.habitapp

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import org.junit.Assert.*
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35],qualifiers="w360dp-h800dp-xhdpi")
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class NativeUiTest {
    @get:Rule val compose = createAndroidComposeRule<MainActivity>()
    @Before fun loaded() {
        compose.waitUntil(30_000) { compose.onAllNodesWithText("இன்றைய வாசிப்பு").fetchSemanticsNodes().isNotEmpty() }
    }
    @Test fun tamilReadingAndNavigationFitSmallScreen() {
        compose.onNodeWithText("நித்தம் ஒரு குறள்").assertIsDisplayed()
        screenshot("today-tamil.png")
        compose.onNodeWithText("இன்று",useUnmergedTree=true).assertIsDisplayed()
        compose.onNodeWithText("படித்து முடித்தேன்").assertExists()
        val root=compose.onRoot().fetchSemanticsNode().boundsInRoot
        val header=compose.onNodeWithText("நித்தம் ஒரு குறள்").fetchSemanticsNode().boundsInRoot
        assertTrue(header.left>=0 && header.right<=root.width+1)
        compose.onNodeWithText("அமைப்பு").performClick()
        compose.onNodeWithText("உங்கள் விருப்பங்கள்").assertIsDisplayed()
        screenshot("settings-tamil.png")
        compose.onNodeWithText("சேமிப்பு").performClick()
        compose.onNodeWithText("என் வாசிப்புகள்").assertIsDisplayed()
    }
    private fun screenshot(name:String) { compose.runOnIdle { saveNativeScreenshot(compose.activity,name) } }
    @Test fun librarySearchFindsKural1330() {
        compose.onNodeWithText("அமைப்பு").performClick()
        compose.onAllNodes(isToggleable())[0].performClick()
        compose.onNodeWithText("தொகுப்பு").performClick()
        compose.onNode(hasSetTextAction()).performTextInput("1330")
        compose.onNodeWithText("குறள் #1330").assertExists()
        screenshot("library-search-tamil.png")
    }
    @Test fun markingReadPersistsNativeCompletion() {
        compose.onNodeWithText("படித்து முடித்தேன்").performClick()
        compose.onNodeWithText("இன்று படித்து முடித்தேன்").assertIsDisplayed()
        val context=compose.activity.applicationContext
        val raw=context.getSharedPreferences("native_habit",0).getString("state",null)
        assertTrue("Saved state: $raw",KuralViewModel.readPreferences(context).dates.isNotEmpty())
    }
}

fun saveNativeScreenshot(activity:MainActivity,name:String) {
    val view=activity.window.decorView
    val bitmap=android.graphics.Bitmap.createBitmap(view.width,view.height,android.graphics.Bitmap.Config.ARGB_8888)
    view.draw(android.graphics.Canvas(bitmap))
    val folder=java.io.File("build/reports/native-screenshots").apply{mkdirs()}
    java.io.File(folder,name).outputStream().use{bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG,100,it)}
    bitmap.recycle()
}
