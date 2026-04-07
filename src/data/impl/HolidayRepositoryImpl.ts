import dayjs from 'dayjs'
import { HolidayRepository } from '../../domain/repositories/HolidayRepository'
import { HolidayDao } from '../../infrastructure/local/dao/HolidayDao'
import { OpenApiService } from '../../infrastructure/remote/api/OpenApiService'
import { HolidayEntity } from '../../infrastructure/local/entities/HolidayEntity'

export class HolidayRepositoryImpl implements HolidayRepository {
  private readonly holidayDateSetCache = new Map<string, Promise<Set<string>>>()

  constructor(
    private holidayDao: HolidayDao,
    private openApiService: OpenApiService
  ) {}

  async ensureYearCached(year: string): Promise<void> {
    const hasCompleteCache = await this.holidayDao.hasCompleteYearCache(year)

    if (hasCompleteCache) {
      return
    }

    const response = await this.openApiService.getRestDeInfo(year)
    const items: Array<
      Omit<HolidayEntity, 'id' | 'year' | 'createdAt' | 'updatedAt'>
    > = response.body.items.item.map(item => ({
      dateName: item.dateName,
      locdate: item.locdate,
    }))

    await this.holidayDao.replaceHolidayItems(
      year,
      items,
      response.body.totalCount
    )
  }

  async getHolidayDateSet(year: string): Promise<Set<string>> {
    const cachedHolidayDateSet = this.holidayDateSetCache.get(year)

    if (cachedHolidayDateSet) {
      return cachedHolidayDateSet
    }

    const pendingHolidayDateSet = (async () => {
      await this.ensureYearCached(year)
      return this.holidayDao.getHolidayDateSetByYear(year)
    })()

    const guardedHolidayDateSet = pendingHolidayDateSet.catch(error => {
      this.holidayDateSetCache.delete(year)
      throw error
    })

    this.holidayDateSetCache.set(year, guardedHolidayDateSet)

    return guardedHolidayDateSet
  }

  async isHoliday(date: string): Promise<boolean> {
    const targetDate = dayjs(date)
    const year = targetDate.year().toString()
    const holidayDateSet = await this.getHolidayDateSet(year)

    return holidayDateSet.has(targetDate.format('YYYY-MM-DD'))
  }
}
