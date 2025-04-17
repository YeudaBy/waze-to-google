package com.yeudaby.wazetomaps

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import com.yeudaby.wazetomaps.ui.theme.BlueLight
import com.yeudaby.wazetomaps.ui.theme.GreenLight
import com.yeudaby.wazetomaps.ui.theme.WazeToMapsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val sharedText = when {
            intent?.action == Intent.ACTION_SEND && intent.type == "text/plain" -> {
                intent.getStringExtra(Intent.EXTRA_TEXT)
            }

            else -> null
        }

        setContent {
            WazeToMapsTheme {
                Surface(
                    modifier = Modifier.fillMaxSize()
                        .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                BlueLight,
                                GreenLight
                            )
                        )
                    ),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WazeLinkHandlerApp(sharedText)
                }
            }
        }
    }
}


