package com.nithamorukural.habitapp

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/** Store images render actual native screens with the app's default local demo state. */
@RunWith(RobolectricTestRunner::class)
@Config(sdk=[35],qualifiers="w360dp-h640dp-xxhdpi")
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class StoreScreenshotsTest {
    @get:Rule val compose=createAndroidComposeRule<MainActivity>()
    private fun capture(name:String) {
        compose.runOnIdle {
            assertEquals(1080,compose.activity.window.decorView.width)
            assertEquals(1920,compose.activity.window.decorView.height)
            val view=compose.activity.window.decorView
            val bitmap=android.graphics.Bitmap.createBitmap(view.width,view.height,android.graphics.Bitmap.Config.ARGB_8888)
            bitmap.setHasAlpha(false)
            view.draw(android.graphics.Canvas(bitmap))
            val folder=java.io.File("build/reports/store-screenshots").apply{mkdirs()}
            java.io.File(folder,name).outputStream().use{bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG,95,it)}
            bitmap.recycle()
        }
    }
    @Test fun captureNativeTamilListingScreens() {
        compose.waitUntil(30_000){compose.onAllNodesWithText("இன்றைய வாசிப்பு").fetchSemanticsNodes().isNotEmpty()}
        compose.onNodeWithText("அமைப்பு").performClick()
        compose.onAllNodes(isToggleable())[0].performClick()
        compose.onNodeWithText("தொகுப்பு").performClick()
        compose.onNode(hasSetTextAction()).performTextInput("467")
        compose.onNodeWithText("குறள் #467").assertExists()
        capture("store-03-library.jpg")
        compose.onNodeWithText("குறள் #467").performClick()
        compose.onNodeWithText("குறள் #467").performScrollTo()
        capture("store-01-daily-reading.jpg")
        compose.onNode(hasScrollAction()).performScrollToNode(hasText("தெளிவுரை"))
        capture("store-02-meaning.jpg")
        compose.onNodeWithText("சேமிப்பு").performClick()
        compose.onNodeWithText("என் வாசிப்புகள்").assertIsDisplayed()
        capture("store-04-favorites.jpg")
        compose.onNodeWithText("அமைப்பு").performClick()
        compose.onNode(hasScrollAction()).performScrollToNode(hasText("விருப்பத் தலைப்புகள்"))
        capture("store-05-topics.jpg")
    }
}
