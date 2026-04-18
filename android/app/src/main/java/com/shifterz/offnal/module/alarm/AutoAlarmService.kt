package com.shifterz.offnal.module.alarm

import android.app.NotificationChannel
import android.app.Notification
import android.app.PendingIntent
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.shifterz.offnal.constant.Constants
import com.shifterz.offnal.constant.Constants.AUTO_STOP_DURATION_MS
import com.shifterz.offnal.model.AutoAlarmRuntimeConfig

class AutoAlarmService : Service() {
    private val alarmHelper by lazy { AutoAlarmHelper(this) }
    private val databaseHelper by lazy { AutoAlarmDatabaseHelper(this) }
    private val mainHandler by lazy { Handler(Looper.getMainLooper()) }

    private var mediaPlayer: MediaPlayer? = null
    private var autoStopRunnable: Runnable? = null
    private var currentAlarmId: Int = -1
    private var currentRemainingSnoozeCount: Int? = null
    private var currentRuntimeConfig: AutoAlarmRuntimeConfig? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()

        val channel = NotificationChannel(
            Constants.AUTO_ALARM_NOTIFICATION_CHANNEL_ID,
            Constants.AUTO_ALARM_NOTIFICATION_ID,
            NotificationManager.IMPORTANCE_HIGH
        )
        val manager = getSystemService(NotificationManager::class.java)

        manager.createNotificationChannel(channel)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            Constants.AUTO_ALARM_ACTION_STOP -> {
                endAlarmSession(fromTimeout = false)
                return START_NOT_STICKY
            }

            else -> {
                val startIntent = intent ?: run {
                    stopSelf()
                    return START_NOT_STICKY
                }

                val alarmId = startIntent.getIntExtra(Constants.AUTO_ALARM_EXTRA_ALARM_ID, -1)
                val triggerAtMillis =
                    startIntent.getLongExtra(Constants.AUTO_ALARM_EXTRA_TRIGGER_AT_MILLIS, -1L)

                if (alarmId <= 0 || triggerAtMillis <= 0L) {
                    stopSelf()
                    return START_NOT_STICKY
                }

                val runtimeConfig = databaseHelper.loadRuntimeConfig(alarmId)
                if (runtimeConfig == null) {
                    stopSelf()
                    return START_NOT_STICKY
                }

                currentAlarmId = alarmId
                currentRuntimeConfig = runtimeConfig
                currentRemainingSnoozeCount =
                    if (startIntent.hasExtra(Constants.AUTO_ALARM_EXTRA_SNOOZE_REMAINING_COUNT)) {
                        val extraCount =
                            startIntent.getIntExtra(
                                Constants.AUTO_ALARM_EXTRA_SNOOZE_REMAINING_COUNT,
                                -1
                            )
                        if (extraCount >= 0) extraCount else null
                    } else {
                        when {
                            !runtimeConfig.isSnoozeEnabled -> null
                            runtimeConfig.snoozeRepeatCount == 0 -> null
                            else -> runtimeConfig.snoozeRepeatCount
                        }
                    }

                startForeground(
                    Constants.AUTO_ALARM_FOREGROUND_NOTIFICATION_ID,
                    buildRingingNotification()
                )
                startAlarmRinging()
                scheduleAutoStop()
            }
        }

        return START_NOT_STICKY
    }

    override fun onDestroy() {
        cancelAutoStop()
        releaseAlarmResources()
        super.onDestroy()
    }

    private fun startAlarmRinging() {
        if (mediaPlayer != null) return

        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_ALARM)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        val alarmUri = RingtoneManager.getActualDefaultRingtoneUri(
            this,
            RingtoneManager.TYPE_ALARM
        ) ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)

        val player = MediaPlayer.create(this, alarmUri) ?: return

        mediaPlayer = player.apply {
            isLooping = true
            setAudioAttributes(audioAttributes)
            start()
        }
    }

    private fun scheduleAutoStop() {
        cancelAutoStop()
        autoStopRunnable = Runnable {
            endAlarmSession(fromTimeout = true)
        }.also { runnable ->
            mainHandler.postDelayed(runnable, AUTO_STOP_DURATION_MS)
        }
    }

    private fun cancelAutoStop() {
        autoStopRunnable?.let { mainHandler.removeCallbacks(it) }
        autoStopRunnable = null
    }

    private fun buildRingingNotification(): Notification {
        val stopIntent = Intent(this, AutoAlarmService::class.java).apply {
            action = Constants.AUTO_ALARM_ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(
            this,
            Constants.AUTO_ALARM_STOP_REQUEST_CODE,
            stopIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, Constants.AUTO_ALARM_NOTIFICATION_CHANNEL_ID)
            .setContentTitle("Offnal")
            .setContentText("알람이 울립니다.")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setOngoing(true)
            .addAction(android.R.drawable.ic_media_pause, "중지", stopPendingIntent)
            .build()
    }

    private fun endAlarmSession(fromTimeout: Boolean) {
        cancelAutoStop()

        val alarmId = currentAlarmId
        val runtimeConfig = currentRuntimeConfig
        val remainingSnoozeCount = currentRemainingSnoozeCount

        releaseAlarmResources()
        stopForeground(STOP_FOREGROUND_REMOVE)

        if (alarmId <= 0 || runtimeConfig == null) {
            stopSelf()
            return
        }

        if (!fromTimeout) {
            databaseHelper.setEnabled(alarmId, false)
            stopSelf()
            return
        }

        val shouldRepeatSnooze = when {
            !runtimeConfig.isSnoozeEnabled -> false
            remainingSnoozeCount == null -> true
            remainingSnoozeCount > 0 -> true
            else -> false
        }

        if (shouldRepeatSnooze) {
            val nextRemainingCount = remainingSnoozeCount?.let { if (it > 0) it - 1 else null }
            val nextTriggerAtMillis = System.currentTimeMillis() + (runtimeConfig.snoozeIntervalMinutes * 60_000L)

            val updatedTrigger = databaseHelper.updateNextTriggerAtMillis(alarmId, nextTriggerAtMillis)
            val enabledUpdated = databaseHelper.setEnabled(alarmId, true)
            if (updatedTrigger && enabledUpdated) {
                runCatching {
                    alarmHelper.scheduleAlarm(
                        alarmId = alarmId,
                        triggerAtMillis = nextTriggerAtMillis,
                        snoozeRemainingCount = nextRemainingCount
                    )
                }.onFailure { exception ->
                    Log.w(TAG, "Failed to schedule snoozed auto alarm for alarmId=$alarmId", exception)
                    databaseHelper.setEnabled(alarmId, false)
                }
            } else {
                databaseHelper.setEnabled(alarmId, false)
            }
        } else {
            databaseHelper.setEnabled(alarmId, false)
        }

        stopSelf()
    }

    private fun releaseAlarmResources() {
        mediaPlayer?.release()
        mediaPlayer = null
        currentAlarmId = -1
        currentRemainingSnoozeCount = null
        currentRuntimeConfig = null
    }

    private companion object {
        private const val TAG = "AutoAlarmService"
    }
}
