import { Calendar } from '../../domain/models/Calendar'
import { GetWorkCalendarResponseData } from '../../infrastructure/remote/response/GetWorkCalendarResponse'

export const toCalendarDomain = (
  response: GetWorkCalendarResponseData[]
): Calendar[] => {
  return response.map(data => ({
    date: data.date,
    workTypeName: data.workTypeName,
  }))
}
