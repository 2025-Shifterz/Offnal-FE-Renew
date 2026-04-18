package com.shifterz.offnal.model

/**
 * ### AutoAlarmSyncItem
 *
 * 자동 알람 Sync를 위한 data class
 *
 * @param id
 * @param nextTriggerAtMillis
 * @param isEnabled
 */
data class AutoAlarmSyncItem(
    val id: Int,
    val nextTriggerAtMillis: Long,
    val isEnabled: Boolean
)
