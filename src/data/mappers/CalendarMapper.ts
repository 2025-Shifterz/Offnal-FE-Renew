import { GetWorkCalendarResponseData } from '../../infrastructure/remote/response/GetWorkCalendarResponse'
import { CalendarEntity } from '../models/CalendarEntity'

export const toCalendarDataModel = (
  response: GetWorkCalendarResponseData[]
): CalendarEntity[] => {
  return response.map(data => ({
    day: data.day,
    shiftType: data.workTypeName,
  }))
}
