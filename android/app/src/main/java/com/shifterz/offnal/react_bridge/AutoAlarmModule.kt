package com.shifterz.offnal.react_bridge

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
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
    fun setScheduleAlarm(promise: Promise) {
        runCatching {
            autoAlarmHelper.scheduleAlarm()
        }.onSuccess {
            promise.resolve(true)
        }.onFailure { exception ->
            promise.reject(exception)
        }
    }

    @ReactMethod
    fun cancelAutoAlarm(promise: Promise) {
        runCatching {
            autoAlarmHelper.cancelAlarm()
        }.onSuccess {
            promise.resolve(true)
        }.onFailure { exception ->
            promise.reject(exception)
        }
    }
}