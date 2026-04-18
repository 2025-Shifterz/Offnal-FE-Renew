package com.shifterz.offnal.module.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.shifterz.offnal.constant.Constants
import com.shifterz.offnal.exceptions.AutoAlarmOperationException
import com.shifterz.offnal.model.AutoAlarmSyncItem

class AutoAlarmHelper(private val context: Context) {
    private val alarmManager by lazy {
        context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
    }

    fun scheduleAlarm(
        alarmId: Int,
        triggerAtMillis: Long,
        snoozeRemainingCount: Int? = null
    ) {
        if (alarmId <= 0) {
            throw AutoAlarmOperationException(
                code = "invalid_alarm_id",
                message = "alarmId must be a positive integer."
            )
        }

        if (triggerAtMillis <= 0L) {
            throw AutoAlarmOperationException(
                code = "invalid_trigger_at_millis",
                message = "triggerAtMillis must be a positive timestamp."
            )
        }

        val manager = alarmManager ?: throw AutoAlarmOperationException(
            code = "alarm_manager_unavailable",
            message = "AlarmManager is not available on this device."
        )

        if (!canScheduleExactAlarms(manager)) {
            throw AutoAlarmOperationException(
                code = "exact_alarm_permission_required",
                message = "Exact alarm permission is required to schedule auto alarms on Android 12+."
            )
        }

        runCatching {
            val pendingIntent = buildBroadcastPendingIntent(
                alarmId = alarmId,
                triggerAtMillis = triggerAtMillis,
                snoozeRemainingCount = snoozeRemainingCount
            )

            manager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerAtMillis,
                pendingIntent
            )
        }.getOrElse { exception ->
            throw AutoAlarmOperationException(
                code = "schedule_failed",
                message = exception.message ?: "Failed to schedule auto alarm."
            )
        }
    }

    fun cancelAlarm(alarmId: Int) {
        if (alarmId <= 0) {
            throw AutoAlarmOperationException(
                code = "invalid_alarm_id",
                message = "alarmId must be a positive integer."
            )
        }

        val manager = alarmManager ?: throw AutoAlarmOperationException(
            code = "alarm_manager_unavailable",
            message = "AlarmManager is not available on this device."
        )

        runCatching {
            val pendingIntent = buildBroadcastPendingIntent(
                alarmId = alarmId,
                triggerAtMillis = System.currentTimeMillis(),
                snoozeRemainingCount = null
            )

            manager.cancel(pendingIntent)
            pendingIntent.cancel()
        }.getOrElse { exception ->
            throw AutoAlarmOperationException(
                code = "cancel_failed",
                message = exception.message ?: "Failed to cancel auto alarm."
            )
        }
    }

    fun syncEnabledAutoAlarms(alarms: List<AutoAlarmSyncItem>) {
        if (alarms.isEmpty()) {
            return
        }

        alarms.forEach { alarm ->
            if (alarm.isEnabled) {
                scheduleAlarm(alarm.id, alarm.nextTriggerAtMillis)
            } else {
                cancelAlarm(alarm.id)
            }
        }
    }

    private fun canScheduleExactAlarms(alarmManager: AlarmManager): Boolean {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.S || alarmManager.canScheduleExactAlarms()
    }

    private fun buildBroadcastPendingIntent(
        alarmId: Int,
        triggerAtMillis: Long,
        snoozeRemainingCount: Int?
    ): PendingIntent {
        val intent = Intent(context, AutoAlarmReceiver::class.java).apply {
            action = Constants.AUTO_ALARM_ACTION_START
            putExtra(Constants.AUTO_ALARM_EXTRA_ALARM_ID, alarmId)
            putExtra(Constants.AUTO_ALARM_EXTRA_TRIGGER_AT_MILLIS, triggerAtMillis)
            snoozeRemainingCount?.let {
                putExtra(Constants.AUTO_ALARM_EXTRA_SNOOZE_REMAINING_COUNT, it)
            }
        }

        return PendingIntent.getBroadcast(
            context,
            alarmId,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
    }
}
