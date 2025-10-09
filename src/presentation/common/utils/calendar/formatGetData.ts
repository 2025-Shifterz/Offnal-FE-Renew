import { TimeFrameChildren } from '../../../calenderType/components/TimeFrame'

// 근무표 정보 조회하기
// rawData를 formatted 된 예시 데이터 형식으로.
export const formatGetData = (
  rawData: { day: string; workTypeName: string }[],
  year: number,
  month: number
): Record<string, TimeFrameChildren> => {
  const result: Record<string, TimeFrameChildren> = {}

  rawData.forEach(({ day, workTypeName }) => {
    const paddedMonth = String(month).padStart(2, '0')
    const paddedDay = day.padStart(2, '0')
    const dateKey = `${year}-${paddedMonth}-${paddedDay}`

    if (['주간', '오후', '야간', '휴일'].includes(workTypeName)) {
      result[dateKey] = workTypeName as TimeFrameChildren
    }
  })

  return result
}
