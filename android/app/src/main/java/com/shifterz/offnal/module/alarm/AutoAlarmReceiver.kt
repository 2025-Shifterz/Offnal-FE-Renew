package com.shifterz.offnal.module.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import com.shifterz.offnal.constant.Constants

class AutoAlarmReceiver : BroadcastReceiver() {

    /**
     * ### onReceive
     *
     * 알람을 수신하는 경우, 동작을 구현합니다.
     * 알람을 foreground service에 띄우거나 소리를 재생합니다.
     *
    * @param context Context
    * @param intent Intent
     */
    override fun onReceive(context: Context?, intent: Intent?) {
        val safeContext = context ?: return
        if (intent?.action != Constants.AUTO_ALARM_ACTION_START) return

        val alarmId = intent?.getIntExtra(Constants.AUTO_ALARM_EXTRA_ALARM_ID, -1) ?: -1
        if (alarmId <= 0) return

        val alarmForegroundService = Intent(safeContext, AutoAlarmService::class.java).apply {
            action = Constants.AUTO_ALARM_ACTION_START
            putExtra(Constants.AUTO_ALARM_EXTRA_ALARM_ID, alarmId)
            putExtra(
                Constants.AUTO_ALARM_EXTRA_TRIGGER_AT_MILLIS,
                intent?.getLongExtra(Constants.AUTO_ALARM_EXTRA_TRIGGER_AT_MILLIS, -1L) ?: -1L
            )
            if (intent?.hasExtra(Constants.AUTO_ALARM_EXTRA_SNOOZE_REMAINING_COUNT) == true) {
                putExtra(
                    Constants.AUTO_ALARM_EXTRA_SNOOZE_REMAINING_COUNT,
                    intent.getIntExtra(Constants.AUTO_ALARM_EXTRA_SNOOZE_REMAINING_COUNT, -1)
                )
            }
        }

        ContextCompat.startForegroundService(safeContext, alarmForegroundService)
    }
}
