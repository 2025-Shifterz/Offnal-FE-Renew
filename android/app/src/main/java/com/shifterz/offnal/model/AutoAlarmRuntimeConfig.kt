package com.shifterz.offnal.model

/**
 * ### AutoAlarmRuntimeConfig
 *
 * 자동 알람의 실행 시간 설정을 위한 data class
 *
 * @param isSnoozeEnabled
 * @param snoozeIntervalMinutes
 * @param snoozeRepeatCount
 */
data class AutoAlarmRuntimeConfig(
    val isSnoozeEnabled: Boolean,
    val snoozeIntervalMinutes: Int,
    val snoozeRepeatCount: Int
)