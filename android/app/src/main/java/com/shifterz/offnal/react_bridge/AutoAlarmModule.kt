package com.shifterz.offnal.react_bridge

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.shifterz.offnal.model.AutoAlarmSyncItem
import com.shifterz.offnal.module.alarm.AutoAlarmHelper


class AutoAlarmModule(
    private val reactContext: ReactApplicationContext
): ReactContextBaseJavaModule(reactContext) {
    private val autoAlarmHelper by lazy { AutoAlarmHelper(reactContext) }

    companion object {
        const val NAME = "AutoAlarmModule"
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun scheduleAlarm(alarmId: Double, nextTriggerAtMillis: Double, promise: Promise) {
        runCatching {
            autoAlarmHelper.scheduleAlarm(alarmId.toInt(), nextTriggerAtMillis.toLong())
        }.onSuccess {
            promise.resolve(null)
        }.onFailure { exception ->
            promise.reject("AUTO_ALARM_SCHEDULE_FAILED", exception)
        }
    }

    @ReactMethod
    fun cancelAlarm(alarmId: Double, promise: Promise) {
        runCatching {
            autoAlarmHelper.cancelAlarm(alarmId.toInt())
        }.onSuccess {
            promise.resolve(null)
        }.onFailure { exception ->
            promise.reject("AUTO_ALARM_CANCEL_FAILED", exception)
        }
    }

    @ReactMethod
    fun syncEnabledAutoAlarms(alarms: ReadableArray, promise: Promise) {
        runCatching {
            val syncItems = buildSyncItems(alarms)
            autoAlarmHelper.syncEnabledAutoAlarms(syncItems)
        }.onSuccess {
            promise.resolve(null)
        }.onFailure { exception ->
            promise.reject("AUTO_ALARM_SYNC_FAILED", exception)
        }
    }

    private fun buildSyncItems(alarms: ReadableArray): List<AutoAlarmSyncItem> {
        val result = mutableListOf<AutoAlarmSyncItem>()

        for (index in 0 until alarms.size()) {
            val alarmMap: ReadableMap = alarms.getMap(index)
                ?: throw IllegalArgumentException("Invalid alarm item at index $index.")

            result.add(
                AutoAlarmSyncItem(
                    id = alarmMap.getInt("alarmId"),
                    nextTriggerAtMillis = alarmMap.getDouble("nextTriggerAtMillis").toLong(),
                    isEnabled = alarmMap.getBoolean("isEnabled")
                )
            )
        }

        return result
    }
}
