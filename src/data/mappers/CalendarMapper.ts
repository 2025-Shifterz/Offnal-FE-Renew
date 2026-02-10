import { Calendar } from '../../domain/models/Calendar'
import { CalendarEntity } from '../models/CalendarEntity'

export const toCalendarDomain = (entity: CalendarEntity[]): Calendar[] => {
  return entity.map(item => ({
    date: item.date,
    workTypeName: item.workTypeName,
    startTime: item.startTime ? item.startTime : '',
    endTime: item.endTime ? item.endTime : '',
  }))
}

export const toCalendarEntity = (domain: Calendar[]): CalendarEntity[] => {
  return domain.map(item => ({
    date: item.date,
    workTypeName: item.workTypeName,
    startTime: item.startTime,
    endTime: item.endTime,
  }))
}
