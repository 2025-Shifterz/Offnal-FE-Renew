package com.shifterz.offnal.react_bridge

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.shifterz.offnal.model.AutoAlarmSyncItem
import com.shifterz.offnal.module.alarm.AutoAlarmHelper
import com.shifterz.offnal.utils.runNativeOperation

class AutoAlarmModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
    private val autoAlarmHelper by lazy { AutoAlarmHelper(reactContext) }

    companion object {
        const val NAME = "AutoAlarmModule"
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun scheduleAlarm(alarmId: Double, nextTriggerAtMillis: Double, promise: Promise) {
        runNativeOperation(promise) {
            autoAlarmHelper.scheduleAlarm(alarmId.toInt(), nextTriggerAtMillis.toLong())
        }
    }

    @ReactMethod
    fun cancelAlarm(alarmId: Double, promise: Promise) {
        runNativeOperation(promise) {
            autoAlarmHelper.cancelAlarm(alarmId.toInt())
        }
    }

    @ReactMethod
    fun syncEnabledAutoAlarms(alarms: ReadableArray, promise: Promise) {
        runNativeOperation(promise) {
            val syncItems = buildSyncItems(alarms)
            autoAlarmHelper.syncEnabledAutoAlarms(syncItems)
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
