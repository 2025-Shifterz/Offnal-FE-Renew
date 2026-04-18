package com.shifterz.offnal.constant

object Constants {
    const val AUTO_ALARM_NOTIFICATION_ID = "자동 알람"
    const val AUTO_ALARM_NOTIFICATION_CHANNEL_ID = "Offnal Auto Alarm"
    const val AUTO_ALARM_FOREGROUND_NOTIFICATION_ID = 1001
    const val AUTO_ALARM_STOP_REQUEST_CODE = 1002

    const val AUTO_ALARM_ACTION_START = "com.shifterz.offnal.action.AUTO_ALARM_START"
    const val AUTO_ALARM_ACTION_STOP = "com.shifterz.offnal.action.AUTO_ALARM_STOP"
    const val AUTO_ALARM_EXTRA_ALARM_ID = "com.shifterz.offnal.extra.AUTO_ALARM_ID"
    const val AUTO_ALARM_EXTRA_TRIGGER_AT_MILLIS = "com.shifterz.offnal.extra.AUTO_ALARM_TRIGGER_AT_MILLIS"
    const val AUTO_ALARM_EXTRA_SNOOZE_REMAINING_COUNT = "com.shifterz.offnal.extra.AUTO_ALARM_SNOOZE_REMAINING_COUNT"

    const val AUTO_STOP_DURATION_MS = 30_000L

}
