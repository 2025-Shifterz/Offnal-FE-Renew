import { openShifterzDB } from '../ShifterzDB'
import {
  HolidayCacheMetaEntity,
  HolidayEntity,
} from '../entities/HolidayEntity'

const formatLocdate = (locdate: number): string => {
  const value = String(locdate).padStart(8, '0')
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
}

export class HolidayDao {
  async getCacheMeta(year: string): Promise<HolidayCacheMetaEntity | null> {
    const db = await openShifterzDB()
    const [result] = await db.executeSql(
      'SELECT year, totalCount, fetchedAt FROM holiday_cache_meta WHERE year = ?;',
      [year]
    )

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows.item(0) as HolidayCacheMetaEntity

    return {
      year: row.year,
      totalCount: Number(row.totalCount),
      fetchedAt: Number(row.fetchedAt),
    }
  }

  async hasCompleteYearCache(year: string): Promise<boolean> {
    const meta = await this.getCacheMeta(year)

    if (!meta) {
      return false
    }

    const db = await openShifterzDB()
    const [result] = await db.executeSql(
      'SELECT COUNT(*) AS count FROM holiday_items WHERE year = ?;',
      [year]
    )

    const row = result.rows.item(0) as { count: number | string }
    return Number(row.count) === Number(meta.totalCount)
  }

  async replaceHolidayItems(
    year: string,
    items: Omit<HolidayEntity, 'id' | 'year' | 'createdAt' | 'updatedAt'>[],
    totalCount: number
  ): Promise<void> {
    const db = await openShifterzDB()
    const now = Date.now()

    await db.transaction(async tx => {
      await tx.executeSql('DELETE FROM holiday_items WHERE year = ?;', [year])
      await tx.executeSql(
        `INSERT OR REPLACE INTO holiday_cache_meta (year, totalCount, fetchedAt) VALUES (?, ?, ?);`,
        [year, totalCount, now]
      )

      for (const item of items) {
        await tx.executeSql(
          `INSERT INTO holiday_items (year, dateName, locdate) VALUES (?, ?, ?);`,
          [year, item.dateName, item.locdate]
        )
      }
    })
  }

  async getHolidayItemsByYear(year: string): Promise<HolidayEntity[]> {
    const db = await openShifterzDB()
    const [result] = await db.executeSql(
      'SELECT * FROM holiday_items WHERE year = ? ORDER BY locdate ASC;',
      [year]
    )

    const items: HolidayEntity[] = []
    for (let i = 0; i < result.rows.length; i++) {
      items.push(result.rows.item(i) as HolidayEntity)
    }

    return items
  }

  async getHolidayDateSetByYear(year: string): Promise<Set<string>> {
    const items = await this.getHolidayItemsByYear(year)
    const dateSet = new Set<string>()

    items.forEach(item => {
      dateSet.add(formatLocdate(item.locdate))
    })

    return dateSet
  }
}
