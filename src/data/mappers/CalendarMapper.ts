import { Calendar } from '../../domain/models/Calendar'
import { GetWorkCalendarResponseData } from '../../infrastructure/remote/response/GetWorkCalendarResponse'

export const toCalendarDomain = (
  response: GetWorkCalendarResponseData[]
): Calendar[] => {
  return response.map(data => ({
    day: data.day,
    shiftType: data.workTypeName,
  }))
}
