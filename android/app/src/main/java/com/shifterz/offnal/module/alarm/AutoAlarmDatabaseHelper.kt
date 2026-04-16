package com.shifterz.offnal.module.alarm

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import com.shifterz.offnal.model.AutoAlarmRuntimeConfig

class AutoAlarmDatabaseHelper(private val context: Context) {
    fun loadRuntimeConfig(alarmId: Int): AutoAlarmRuntimeConfig? {
        val db = openDatabase()
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

                return AutoAlarmRuntimeConfig(
                    isSnoozeEnabled = cursor.getInt(0) == 1,
                    snoozeIntervalMinutes = cursor.getInt(1),
                    snoozeRepeatCount = cursor.getInt(2)
                )
            }
        }
    }

    fun updateNextTriggerAtMillis(alarmId: Int, nextTriggerAtMillis: Long) {
        val db = openDatabase()
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
    }

    fun setEnabled(alarmId: Int, enabled: Boolean) {
        val db = openDatabase()
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
    }

    private fun openDatabase(): SQLiteDatabase {
        val databaseFile = context.getDatabasePath(DATABASE_NAME)
        require(databaseFile.exists()) {
            "Auto alarm database does not exist at ${databaseFile.absolutePath}"
        }

        return SQLiteDatabase.openDatabase(
            databaseFile.path,
            null,
            SQLiteDatabase.OPEN_READWRITE
        )
    }

    private companion object {
        private const val DATABASE_NAME = "myDatabase.db"
    }
}
