package com.shifterz.offnal.module.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.shifterz.offnal.constant.Constants
import com.shifterz.offnal.model.AutoAlarmSyncItem

class AutoAlarmHelper(private val context: Context) {
    private val alarmManager by lazy {
        context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
    }

    fun scheduleAlarm(alarmId: Int, triggerAtMillis: Long) {
        require(alarmId > 0) { "alarmId must be a positive integer." }
        require(triggerAtMillis > 0L) { "triggerAtMillis must be a positive timestamp." }

        val manager = requireAlarmManager()
        ensureExactAlarmCapability(manager)

        val pendingIntent = buildBroadcastPendingIntent(
            alarmId = alarmId,
            triggerAtMillis = triggerAtMillis
        )

        manager.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            triggerAtMillis,
            pendingIntent
        )
    }

    fun cancelAlarm(alarmId: Int) {
        require(alarmId > 0) { "alarmId must be a positive integer." }

        val manager = requireAlarmManager()
        val pendingIntent = buildBroadcastPendingIntent(
            alarmId = alarmId,
            triggerAtMillis = System.currentTimeMillis()
        )

        manager.cancel(pendingIntent)
        pendingIntent.cancel()
    }

    fun syncEnabledAutoAlarms(alarms: List<AutoAlarmSyncItem>) {
        alarms.forEach { alarm ->
            if (alarm.isEnabled) {
                scheduleAlarm(alarm.id, alarm.nextTriggerAtMillis)
            } else {
                cancelAlarm(alarm.id)
            }
        }
    }

    private fun requireAlarmManager(): AlarmManager {
        return alarmManager
            ?: throw IllegalStateException("AlarmManager is not available on this device.")
    }

    private fun ensureExactAlarmCapability(alarmManager: AlarmManager) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
            throw IllegalStateException(
                "Exact alarm permission is required to schedule auto alarms on Android 12+."
            )
        }
    }

    private fun buildBroadcastPendingIntent(
        alarmId: Int,
        triggerAtMillis: Long
    ): PendingIntent {
        val intent = Intent(context, AutoAlarmReceiver::class.java).apply {
            putExtra(Constants.AUTO_ALARM_EXTRA_ALARM_ID, alarmId)
            putExtra(Constants.AUTO_ALARM_EXTRA_TRIGGER_AT_MILLIS, triggerAtMillis)
        }

        return PendingIntent.getBroadcast(
            context,
            alarmId,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
    }
}
