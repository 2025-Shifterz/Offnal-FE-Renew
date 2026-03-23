import dayjs from 'dayjs'
import { HolidayRepository } from '../../repositories/HolidayRepository'

export class GetHolidayDateSetUseCase {
  constructor(private holidayRepository: HolidayRepository) {}

  async execute(
    year: string = dayjs().year().toString()
  ): Promise<Set<string>> {
    return this.holidayRepository.getHolidayDateSet(year)
  }
}
