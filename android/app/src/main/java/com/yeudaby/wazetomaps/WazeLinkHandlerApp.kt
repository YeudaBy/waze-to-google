package com.yeudaby.wazetomaps

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.paint
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.wazelinkhandler.R
import com.yeudaby.wazetomaps.ui.theme.BlueDark


@Composable
fun WazeLinkHandlerApp(sharedText: String?) {
    val viewModel: WazeViewModel = viewModel()
    val context = LocalContext.current

    LaunchedEffect(sharedText) {
        if (sharedText != null) {
            val wazeUrl = viewModel.extractWazeUrl(sharedText)
            if (wazeUrl != null) {
                viewModel.fetchCoordinates(wazeUrl)
            } else {
                viewModel.error = "לא נמצא קישור Waze בטקסט שהתקבל"
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .paint(
                painterResource(id = R.drawable.localhost_3000__samsung_galaxy_s20_ultra_),
                contentScale = ContentScale.FillBounds
            )
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(id = R.drawable.logo),
            contentDescription = "",
            modifier = Modifier
                .padding(bottom = 32.dp)
                .size(100.dp)
        )
        Text(
            text = "Waze to Maps",
            fontSize = 24.sp,
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.ExtraBold,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        when {
            viewModel.isLoading -> {
                CircularProgressIndicator()
                Text(
                    text = "מעבד את הקישור...",
                    modifier = Modifier.padding(top = 16.dp)
                )
                Text(
                    text = "צפוי לקחת עד 20 שניות",
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(top = 16.dp)
                )
            }

            viewModel.error != null -> {
                Text(
                    text = viewModel.error ?: "",
                    color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.padding(16.dp)
                )
                Button(onClick = {
                    if (viewModel.wazeUrl != null) {
                        viewModel.fetchCoordinates(viewModel.wazeUrl!!)
                    }
                }) {
                    Text("נסה שוב")
                }
            }

            viewModel.mapsUrl != null -> {
                Text(
                    text = viewModel.mapsUrl ?: "",
                    color = Color.Blue,
                    textDecoration = TextDecoration.Underline,
                    modifier = Modifier
                        .padding(bottom = 24.dp)
                        .clickable { openLink(context, viewModel.mapsUrl!!) }
                        .fillMaxWidth(),
                    textAlign = TextAlign.Center
                )

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Button(
                        onClick = {
                            shareToWhatsApp(context, viewModel.mapsUrl ?: "")
                        },
                        modifier = Modifier.fillMaxWidth(0.8f)
                    ) {
                        Text("שתף בוואצאפ")
                    }

                    Button(
                        onClick = {
                            copyToClipboard(context, viewModel.mapsUrl ?: "")
                        },
                        modifier = Modifier.fillMaxWidth(0.8f)
                    ) {
                        Text("העתק לזיכרון")
                    }
                }
            }

            else -> {
                Text(
                    text = "שתף קישור Waze לאפליקציה זו כדי לקבל את הקואורדינטות",
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(16.dp)
                )

                var manualUrl by remember { mutableStateOf("") }

                OutlinedTextField(
                    value = manualUrl,
                    onValueChange = { manualUrl = it },
                    label = { Text("הכנס קישור Waze") },
                    shape = CircleShape,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 16.dp)
                )

                Button(
                    onClick = {
                        val wazeUrl = viewModel.extractWazeUrl(manualUrl)
                        if (wazeUrl != null) {
                            viewModel.fetchCoordinates(wazeUrl)
                        } else {
                            viewModel.error = "זה לא נראה כמו קישור Waze תקין"
                        }
                    },
                    modifier = Modifier
                        .padding(top = 12.dp)
                        .fillMaxWidth()
                ) {
                    Text("המרה")
                }

                Text(
                    text = "💡 ניתן לשתף מוויז ישירות לתוך האפליקציה על ידי בחירת ״שיתוף״ > ״עוד״ > ולבחור באפליקציה זו.",
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(top = 16.dp)
                )

                Text(
                    text = "Created by YeudaBy",
                    color = BlueDark,
                    fontSize = 11.sp,
                    textDecoration = TextDecoration.Underline,
                    modifier = Modifier
                        .padding(top = 44.dp)
                        .clickable { openLink(context, "https://yeudaby.com") }
                )
            }
        }
    }
}


fun shareToWhatsApp(context: Context, mapsUrl: String) {
    try {
        val intent = Intent(Intent.ACTION_SEND)
        intent.type = "text/plain"
        intent.setPackage("com.whatsapp")
        intent.putExtra(Intent.EXTRA_TEXT, mapsUrl)
        context.startActivity(intent)
    } catch (e: Exception) {
        Toast.makeText(context, "לא ניתן לפתוח את וואצאפ", Toast.LENGTH_SHORT).show()
    }
}

fun copyToClipboard(context: Context, text: String) {
    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    val clip = ClipData.newPlainText("קואורדינטות", text)
    clipboard.setPrimaryClip(clip)
    Toast.makeText(context, "הועתק ללוח", Toast.LENGTH_SHORT).show()
}

fun openLink(context: Context, url: String) {
    try {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        context.startActivity(intent)
    } catch (e: Exception) {
        Toast.makeText(context, "לא ניתן לפתוח את הקישור", Toast.LENGTH_SHORT).show()
    }
}

fun String.getCoordinatesFromUrl(): List<String> {
    val parts = split("/")
    return parts.lastOrNull()?.split(",") ?: emptyList()
}

fun List<String>.coordinatesToString(): String {
    return joinToString { "," }
}