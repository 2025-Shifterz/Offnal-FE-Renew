package com.shifterz.offnal.module.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent


class AutoAlarmReceiver: BroadcastReceiver() {

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
        val alarmForegroundService = Intent(context, AutoAlarmService::class.java)

        context?.startForegroundService(alarmForegroundService)
    }
}