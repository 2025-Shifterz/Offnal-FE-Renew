package com.shifterz.offnal.module.alarm

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.shifterz.offnal.constant.Constants

class AutoAlarmService: Service() {
    private var mediaPlayer: MediaPlayer? = null

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
        val notification = NotificationCompat
            .Builder(this, Constants.AUTO_ALARM_NOTIFICATION_CHANNEL_ID)
            .setContentTitle("Offnal")
            .setContentText("알람이 울립니다.")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setOngoing(true)
            .build()

        startForeground(1, notification)
        startAlarmRinging()

        return START_NOT_STICKY
    }

    override fun onDestroy() {
        mediaPlayer?.release()
        mediaPlayer = null

        stopSelf()
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
}
