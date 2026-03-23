export interface HolidayRepository {
  ensureYearCached(year: string): Promise<void>
  getHolidayDateSet(year: string): Promise<Set<string>>
  isHoliday(date: string): Promise<boolean>
}
