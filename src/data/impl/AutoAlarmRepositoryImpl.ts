import {
  AutoAlarmRepository,
  CreateAutoAlarmInput,
  UpdateAutoAlarmInput,
} from '../../domain/repositories/AutoAlarmRepository'
import { AutoAlarm } from '../../domain/models/AutoAlarm'
import { AutoAlarmDao } from '../../infrastructure/local/dao/AutoAlarmDao'
import {
  toAutoAlarmDomain,
  toAutoAlarmDomainArray,
} from '../mappers/AutoAlarmMapper'

export class AutoAlarmRepositoryImpl implements AutoAlarmRepository {
  constructor(private autoAlarmDao: AutoAlarmDao) {}

  async getAllAutoAlarms(): Promise<AutoAlarm[]> {
    const autoAlarms = await this.autoAlarmDao.getAllAutoAlarms()
    const result = toAutoAlarmDomainArray(autoAlarms)

    return result
  }

  async getAutoAlarmById(id: number): Promise<AutoAlarm | undefined> {
    const autoAlarm = await this.autoAlarmDao.getAutoAlarmById(id)
    if (!autoAlarm) {
      return undefined
    }
    const result = toAutoAlarmDomain(autoAlarm)

    return result
  }

  async addAutoAlarm(autoAlarm: CreateAutoAlarmInput): Promise<AutoAlarm> {
    const createdAutoAlarm = await this.autoAlarmDao.insertAutoAlarm(autoAlarm)
    return toAutoAlarmDomain(createdAutoAlarm)
  }

  async updateAutoAlarm(autoAlarm: UpdateAutoAlarmInput): Promise<AutoAlarm> {
    const updatedAutoAlarm = await this.autoAlarmDao.updateAutoAlarm(autoAlarm)
    return toAutoAlarmDomain(updatedAutoAlarm)
  }

  async toggleAutoAlarm(id: number, enabled: boolean): Promise<AutoAlarm> {
    const toggledAutoAlarm = await this.autoAlarmDao.toggleAutoAlarm(
      id,
      enabled
    )
    return toAutoAlarmDomain(toggledAutoAlarm)
  }

  async deleteAutoAlarms(ids: number[]): Promise<void> {
    await this.autoAlarmDao.deleteAutoAlarms(ids)
  }

  async setAutoAlarmsEnabled(ids: number[], enabled: boolean): Promise<void> {
    await this.autoAlarmDao.setAutoAlarmsEnabled(ids, enabled)
  }

  async updateNextTriggerAtMillis(
    id: number,
    nextTriggerAtMillis: number
  ): Promise<void> {
    await this.autoAlarmDao.updateNextTriggerAtMillis(id, nextTriggerAtMillis)
  }

  async deleteAutoAlarm(id: number): Promise<void> {
    await this.autoAlarmDao.deleteAutoAlarm(id)
  }

  async deleteAutoAlarmAll(): Promise<void> {
    await this.autoAlarmDao.deleteAllAutoAlarms()
  }
}
