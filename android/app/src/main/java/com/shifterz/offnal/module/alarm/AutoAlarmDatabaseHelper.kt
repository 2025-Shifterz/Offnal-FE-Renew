package com.shifterz.offnal.module.alarm

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.util.Log
import com.shifterz.offnal.model.AutoAlarmRuntimeConfig

class AutoAlarmDatabaseHelper(private val context: Context) {
    fun loadRuntimeConfig(alarmId: Int): AutoAlarmRuntimeConfig? {
        if (alarmId <= 0) {
            return null
        }

        val db = openDatabase() ?: return null

        return runCatching {
            db.use { database ->
                database.rawQuery(
                    """
                        SELECT isSnoozeEnabled, snoozeIntervalMinutes, snoozeRepeatCount
                        FROM auto_alarms
                        WHERE id = ?
                    """.trimIndent(),
                    arrayOf(alarmId.toString())
                ).use { cursor ->
                    if (!cursor.moveToFirst()) {
                        return null
                    }

                    AutoAlarmRuntimeConfig(
                        isSnoozeEnabled = cursor.getInt(0) == 1,
                        snoozeIntervalMinutes = cursor.getInt(1),
                        snoozeRepeatCount = cursor.getInt(2)
                    )
                }
            }
        }.getOrElse { exception ->
            Log.w(TAG, "Failed to load runtime config for alarmId=$alarmId", exception)
            null
        }
    }

    fun updateNextTriggerAtMillis(alarmId: Int, nextTriggerAtMillis: Long): Boolean {
        if (alarmId <= 0 || nextTriggerAtMillis <= 0L) {
            return false
        }

        val db = openDatabase() ?: return false

        return runCatching {
            db.use { database ->
                database.execSQL(
                    """
                        UPDATE auto_alarms
                        SET nextTriggerAtMillis = ?
                        WHERE id = ?
                    """.trimIndent(),
                    arrayOf<Any>(nextTriggerAtMillis, alarmId)
                )
            }
            true
        }.getOrElse { exception ->
            Log.w(TAG, "Failed to update nextTriggerAtMillis for alarmId=$alarmId", exception)
            false
        }
    }

    fun setEnabled(alarmId: Int, enabled: Boolean): Boolean {
        if (alarmId <= 0) {
            return false
        }

        val db = openDatabase() ?: return false

        return runCatching {
            db.use { database ->
                database.execSQL(
                    """
                        UPDATE auto_alarms
                        SET isEnabled = ?
                        WHERE id = ?
                    """.trimIndent(),
                    arrayOf<Any>(if (enabled) 1 else 0, alarmId)
                )
            }
            true
        }.getOrElse { exception ->
            Log.w(TAG, "Failed to update enabled state for alarmId=$alarmId", exception)
            false
        }
    }

    private fun openDatabase(): SQLiteDatabase? {
        val databaseFile = context.getDatabasePath(DATABASE_NAME)
        if (!databaseFile.exists()) {
            Log.w(TAG, "Auto alarm database does not exist at ${databaseFile.absolutePath}")
            return null
        }

        return runCatching {
            SQLiteDatabase.openDatabase(
                databaseFile.path,
                null,
                SQLiteDatabase.OPEN_READWRITE
            )
        }.getOrElse { exception ->
            Log.w(TAG, "Failed to open auto alarm database at ${databaseFile.absolutePath}", exception)
            null
        }
    }

    private companion object {
        private const val TAG = "AutoAlarmDatabaseHelper"
        private const val DATABASE_NAME = "myDatabase.db"
    }
}
