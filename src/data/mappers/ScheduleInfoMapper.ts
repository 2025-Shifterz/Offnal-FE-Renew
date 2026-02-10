import { WorkTime } from '../../domain/models/WorkTime'
import { convertDurationToEndTime } from '../../shared/utils/calendar/convertDuration'
import { ScheduleInfoEntity } from '../models/ScheduleInfoEntity'

const map = (v: { startTime: string | null; duration: string | null }) => {
  if (!v.startTime || !v.duration) {
    return { startTime: '', endTime: '' }
  }
  return {
    startTime: v.startTime,
    endTime: convertDurationToEndTime(v.startTime, v.duration),
  }
}

export const toScheduleInfoDomain = (entity: ScheduleInfoEntity): WorkTime => {
  return {
    D: map(entity.D),
    E: map(entity.E),
    N: map(entity.N),
    '-': { startTime: '', endTime: '' },
  }
}
