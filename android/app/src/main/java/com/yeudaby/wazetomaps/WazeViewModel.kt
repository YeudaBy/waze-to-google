package com.yeudaby.wazetomaps

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit
import java.util.regex.Pattern

class WazeViewModel : ViewModel() {
    // מצבים של התצוגה
    var isLoading by mutableStateOf(false)
    var mapsUrl by mutableStateOf<String?>(null)
    var error by mutableStateOf<String?>(null)
    var wazeUrl by mutableStateOf<String?>(null)

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    fun extractWazeUrl(text: String?): String? {
        if (text == null) return null

        val pattern = Pattern.compile("https://waze\\.com/(?:ul|he)/[\\w-]+")
        val matcher = pattern.matcher(text)

        return if (matcher.find()) {
            matcher.group(0)
        } else {
            null
        }
    }

    fun fetchCoordinates(url: String) {
        isLoading = true
        error = null
        wazeUrl = url
        mapsUrl = null

        viewModelScope.launch {
            val jsonObject = JSONObject()
            jsonObject.put("url", url)

            val requestBody = jsonObject.toString()
                .toRequestBody("application/json".toMediaTypeOrNull())

            val request = Request.Builder()
                .url("https://waze2maps.vercel.app/api")
                .post(requestBody)
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    isLoading = false
                    error = "שגיאת תקשורת: ${e.localizedMessage}"
                }

                override fun onResponse(call: Call, response: Response) {
                    isLoading = false
                    if (response.isSuccessful) {
                        mapsUrl = response.body?.string()?.trim('"')
                    } else {
                        error = "שגיאת שרת: ${response.code}"
                    }
                }
            })
        }
    }
}