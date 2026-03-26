import { openShifterzDB } from '../ShifterzDB'
import { AutoAlarmEntity } from '../entities/AutoAlarmEntity'

export class AutoAlarmDao {
  async getAllAutoAlarms(): Promise<AutoAlarmEntity[]> {
    const db = await openShifterzDB()
    const [result] = await db.executeSql(
      'SELECT * FROM auto_alarms ORDER BY hour ASC, minute ASC;'
    )

    const alarms: AutoAlarmEntity[] = []
    for (let i = 0; i < result.rows.length; i++) {
      alarms.push(result.rows.item(i) as AutoAlarmEntity)
    }

    return alarms
  }

  async getAutoAlarmById(id: number): Promise<AutoAlarmEntity | null> {
    const db = await openShifterzDB()
    const [result] = await db.executeSql(
      'SELECT * FROM auto_alarms WHERE id = ?;',
      [id]
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows.item(0) as AutoAlarmEntity
  }

  async insertAutoAlarm(
    hour: number,
    minute: number,
    workTypeTitle: string,
    weekdays: number[],
    isEnabled: boolean,
    isHolidayDisabled: boolean,
    snoozeIntervalMinutes: number,
    snoozeRepeatCount: number,
    nextTriggerAtMillis: number,
    createdAt: number,
    updatedAt: number
  ): Promise<void> {
    const db = await openShifterzDB()
    await db.executeSql(
      `
        INSERT INTO auto_alarms 
        (hour, minute, workTypeTitle, weekdays, isEnabled, isHolidayDisabled, snoozeIntervalMinutes, snoozeRepeatCount, nextTriggerAtMillis, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        hour,
        minute,
        workTypeTitle,
        weekdays,
        isEnabled,
        isHolidayDisabled,
        snoozeIntervalMinutes,
        snoozeRepeatCount,
        nextTriggerAtMillis,
        createdAt,
        updatedAt,
      ]
    )
  }

  async updateAutoAlarm(
    id: number,
    hour: number,
    minute: number,
    workTypeTitle: string,
    weekdays: number[],
    isEnabled: boolean,
    isHolidayDisabled: boolean,
    snoozeIntervalMinutes: number,
    snoozeRepeatCount: number,
    nextTriggerAtMillis: number,
    updatedAt: number
  ): Promise<void> {
    const db = await openShifterzDB()
    await db.executeSql(
      `
        UPDATE auto_alarms 
        SET hour = ?, minute = ?, workTypeTitle = ?, weekdays = ?, isEnabled = ?, isHolidayDisabled = ?, snoozeIntervalMinutes = ?, snoozeRepeatCount = ?, nextTriggerAtMillis = ?, updatedAt = ? 
        WHERE id = ?;
      `,
      [
        hour,
        minute,
        workTypeTitle,
        weekdays,
        isEnabled,
        isHolidayDisabled,
        snoozeIntervalMinutes,
        snoozeRepeatCount,
        nextTriggerAtMillis,
        updatedAt,
        id,
      ]
    )
  }

  async deleteAutoAlarm(id: number): Promise<void> {
    const db = await openShifterzDB()
    await db.executeSql(
      `
        DELETE FROM auto_alarms 
        WHERE id = ?;
      `,
      [id]
    )
  }

  async deleteAllAutoAlarms(): Promise<void> {
    const db = await openShifterzDB()
    await db.executeSql(`DELETE FROM auto_alarms;`)
  }

  async updateNextTriggerAtMillis(
    id: number,
    nextTriggerAtMillis: number
  ): Promise<void> {
    const db = await openShifterzDB()
    await db.executeSql(
      `
        UPDATE auto_alarms 
        SET nextTriggerAtMillis = ? 
        WHERE id = ?;
      `,
      [nextTriggerAtMillis, id]
    )
  }
}
