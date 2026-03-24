export interface HolidayCacheMetaEntity {
  year: string
  totalCount: number
  fetchedAt: number
}

export interface HolidayEntity {
  id?: number
  year: string
  dateName: string
  locdate: number
  createdAt?: number
  updatedAt?: number
}
