import { openDatabase } from '../database'
import { AutoAlarmEntity } from '../entities/AutoAlarmEntity'
import {
  CreateAutoAlarmInput,
  UpdateAutoAlarmInput,
} from '../../../domain/repositories/AutoAlarmRepository'
import {
  decodeWeekdaysFromBitmask,
  encodeWeekdaysToBitmask,
} from '../../../shared/utils/alarm/weekdaysBitmask'

type AutoAlarmRow = {
  id: number
  hour: number
  minute: number
  workTypeTitle: AutoAlarmEntity['workTypeTitle']
  weekdaysMask: number
  isEnabled: number
  isHolidayDisabled: number
  isSnoozeEnabled: number
  snoozeIntervalMinutes: number
  snoozeRepeatCount: number
  nextTriggerAtMillis: number
  createdAt: number
  updatedAt: number
}

export class AutoAlarmDao {
  async getAllAutoAlarms(): Promise<AutoAlarmEntity[]> {
    const db = await openDatabase()
    const [result] = await db.executeSql(
      'SELECT * FROM auto_alarms ORDER BY nextTriggerAtMillis ASC, hour ASC, minute ASC;'
    )

    const alarms: AutoAlarmEntity[] = []
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i) as AutoAlarmRow
      alarms.push(this.mapRowToEntity(row))
    }

    return alarms
  }

  async getAutoAlarmById(id: number): Promise<AutoAlarmEntity | null> {
    const db = await openDatabase()
    const [result] = await db.executeSql(
      'SELECT * FROM auto_alarms WHERE id = ?;',
      [id]
    )

    if (result.rows.length === 0) {
      return null
    }

    return this.mapRowToEntity(result.rows.item(0) as AutoAlarmRow)
  }

  async insertAutoAlarm(
    autoAlarm: CreateAutoAlarmInput
  ): Promise<AutoAlarmEntity> {
    const db = await openDatabase()
    const now = Date.now()
    const [result] = await db.executeSql(
      `
        INSERT INTO auto_alarms 
        (hour, minute, workTypeTitle, weekdaysMask, isEnabled, isHolidayDisabled, isSnoozeEnabled, snoozeIntervalMinutes, snoozeRepeatCount, nextTriggerAtMillis, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        autoAlarm.hour,
        autoAlarm.minute,
        autoAlarm.workTypeTitle,
        encodeWeekdaysToBitmask(autoAlarm.weekdays),
        autoAlarm.isEnabled ? 1 : 0,
        autoAlarm.isHolidayDisabled ? 1 : 0,
        autoAlarm.isSnoozeEnabled ? 1 : 0,
        autoAlarm.snoozeIntervalMinutes,
        autoAlarm.snoozeRepeatCount,
        autoAlarm.nextTriggerAtMillis,
        now,
        now,
      ]
    )

    const newId = result?.insertId || null

    if (!newId) {
      throw new Error('Failed to retrieve new auto alarm ID after creation.')
    }

    const newAutoAlarm = await this.getAutoAlarmById(newId)
    if (!newAutoAlarm) {
      throw new Error('Failed to retrieve the newly created auto alarm.')
    }

    return newAutoAlarm
  }

  async updateAutoAlarm(
    autoAlarm: UpdateAutoAlarmInput
  ): Promise<AutoAlarmEntity> {
    const db = await openDatabase()
    const [result] = await db.executeSql(
      `
        UPDATE auto_alarms 
        SET hour = ?, minute = ?, workTypeTitle = ?, weekdaysMask = ?, isEnabled = ?, isHolidayDisabled = ?, isSnoozeEnabled = ?, snoozeIntervalMinutes = ?, snoozeRepeatCount = ?, nextTriggerAtMillis = ? 
        WHERE id = ?;
      `,
      [
        autoAlarm.hour,
        autoAlarm.minute,
        autoAlarm.workTypeTitle,
        encodeWeekdaysToBitmask(autoAlarm.weekdays),
        autoAlarm.isEnabled ? 1 : 0,
        autoAlarm.isHolidayDisabled ? 1 : 0,
        autoAlarm.isSnoozeEnabled ? 1 : 0,
        autoAlarm.snoozeIntervalMinutes,
        autoAlarm.snoozeRepeatCount,
        autoAlarm.nextTriggerAtMillis,
        autoAlarm.id,
      ]
    )

    const rowsAffected = result?.rowsAffected || 0
    if (rowsAffected === 0) {
      throw new Error(`No auto alarm found with ID ${autoAlarm.id} to update.`)
    }

    const updatedAutoAlarm = await this.getAutoAlarmById(autoAlarm.id)
    if (!updatedAutoAlarm) {
      throw new Error('Failed to retrieve the updated auto alarm.')
    }

    return updatedAutoAlarm
  }

  async toggleAutoAlarm(
    id: number,
    enabled: boolean
  ): Promise<AutoAlarmEntity> {
    const db = await openDatabase()
    const [result] = await db.executeSql(
      `
        UPDATE auto_alarms
        SET isEnabled = ?
        WHERE id = ?;
      `,
      [enabled ? 1 : 0, id]
    )

    const rowsAffected = result?.rowsAffected || 0
    if (rowsAffected === 0) {
      throw new Error(`No auto alarm found with ID ${id} to toggle.`)
    }

    const toggledAutoAlarm = await this.getAutoAlarmById(id)
    if (!toggledAutoAlarm) {
      throw new Error('Failed to retrieve the toggled auto alarm.')
    }

    return toggledAutoAlarm
  }

  async deleteAutoAlarm(id: number): Promise<void> {
    const db = await openDatabase()
    await db.executeSql(
      `
        DELETE FROM auto_alarms 
        WHERE id = ?;
      `,
      [id]
    )
  }

  async deleteAllAutoAlarms(): Promise<void> {
    const db = await openDatabase()
    await db.executeSql(`DELETE FROM auto_alarms;`)
  }

  async updateNextTriggerAtMillis(
    id: number,
    nextTriggerAtMillis: number
  ): Promise<void> {
    const db = await openDatabase()
    await db.executeSql(
      `
        UPDATE auto_alarms 
        SET nextTriggerAtMillis = ? 
        WHERE id = ?;
      `,
      [nextTriggerAtMillis, id]
    )
  }

  private mapRowToEntity(row: AutoAlarmRow): AutoAlarmEntity {
    return {
      id: row.id,
      hour: row.hour,
      minute: row.minute,
      workTypeTitle: row.workTypeTitle,
      weekdays: decodeWeekdaysFromBitmask(Number(row.weekdaysMask ?? 0)),
      isEnabled: Number(row.isEnabled) === 1,
      isHolidayDisabled: Number(row.isHolidayDisabled) === 1,
      isSnoozeEnabled: Number(row.isSnoozeEnabled) === 1,
      snoozeIntervalMinutes: row.snoozeIntervalMinutes,
      snoozeRepeatCount: row.snoozeRepeatCount,
      nextTriggerAtMillis: row.nextTriggerAtMillis,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}
