import { NewCalendar, ShiftsMap, WorkDay } from '../../data/model/Calendar'

export interface WorkCalendarRepository {
  /**
   * 특정 연도와 월의 근무 달력을 조회합니다.
   * @param year 대상 연도
   * @param month 대상 월
   * @returns 근무일 배열
   */
  getWorkCalendar(year: number, month: number): Promise<WorkDay[]>

  /**
   * 새로운 근무 달력을 생성합니다.
   * @param calendarData 생성할 달력 데이터
   */
  createWorkCalendar(calendarData: NewCalendar): Promise<void>

  /**
   * 특정 연도와 월의 근무 달력을 삭제합니다.
   * @param year 대상 연도
   * @param month 대상 월
   */
  deleteWorkCalendar(year: number, month: number): Promise<void>

  /**
   * 특정 연도와 월의 근무 달력 내용을 수정합니다.
   * @param year 대상 연도
   * @param month 대상 월
   * @param calendarData 수정할 근무 데이터
   */
  updateWorkCalendar(
    year: number,
    month: number,
    calendarData: ShiftsMap
  ): Promise<void>
}
