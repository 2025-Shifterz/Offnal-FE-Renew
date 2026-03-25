package com.shifterz.offnal.module.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.shifterz.offnal.constant.Constants

class AutoAlarmHelper(private val context: Context) {
    private val alarmManager by lazy { context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager }

    /**
     * ### setAlarm
     *
     * 알람을 설정하는 함수입니다.
     * pending Intent와 Intent를 설정합니다.
     */
    fun scheduleAlarm() {
        if (alarmManager == null) return

        val intent = Intent(context, AutoAlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            Constants.ALARM_REQUEST_ID,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        // TODO("Add Trigger Time This is dummy data")
        val triggerTime = System.currentTimeMillis() + 1000 * 60

        alarmManager?.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
    }


    fun cancelAlarm() {
        val intent = Intent(context, AutoAlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            Constants.ALARM_REQUEST_ID,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        alarmManager?.cancel(pendingIntent)
        pendingIntent.cancel()
    }
}