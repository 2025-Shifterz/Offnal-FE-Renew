import dayjs from 'dayjs'

export interface InputWorkTimeDetail {
  startTime: string
  endTime: string
}

export interface WorkTimeDuration {
  startTime: string
  duration: string
}

// PT 형식 duration 예: PT1H30M
// PT30M, PT8H, PT8H30M 가능

// startTime과 endTime을 받아 PT형식 duration으로 변환
export function convertEndTimeToDuration(
  workTimes: Record<string, InputWorkTimeDetail>
): Record<string, WorkTimeDuration> {
  const todayStr = dayjs().format('YYYY-MM-DD')

  const converted: Record<string, WorkTimeDuration> = {}

  Object.entries(workTimes).forEach(([key, value]) => {
    const { startTime, endTime } = value

    const start = dayjs(`${todayStr} ${startTime}`, 'YYYY-MM-DD HH:mm')
    let end = dayjs(`${todayStr} ${endTime}`, 'YYYY-MM-DD HH:mm')

    // endTime이 다음날인 경우 처리
    if (end.isBefore(start)) {
      end = end.add(1, 'day')
    }

    // 총 분 단위로 차이 계산
    const durationMinutes = end.diff(start, 'minute')

    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60

    // PT 형식 duration 생성
    const duration = `PT${hours > 0 ? `${hours}H` : ''}${minutes > 0 ? `${minutes}M` : ''}`

    converted[key] = { startTime, duration }
  })

  return converted
}

// duration을 endTime로 변환하는 함수
export function convertDurationToEndTime(
  startTime: string,
  duration: string
): string {
  if (!duration) {
    console.log('duration is null') // 휴일인 경우
    return ''
  }
  // const [hour, min] = startTime.split(':').map(Number)
  // const hoursToAdd = parseInt(duration.replace('PT', '').replace('H', ''), 10)
  // const endHour = hour + hoursToAdd
  // return `${endHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`

  // 시작시간 파싱
  const [hour, min] = startTime.split(':').map(Number)

  // ISO 8601 Duration 정규식: PT8H30M, PT30M, PT8H 등
  const durationMatch = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/)
  if (!durationMatch) {
    console.warn('Invalid duration format:', duration)
    return startTime
  }

  const hoursToAdd = durationMatch[1] ? Number(durationMatch[1]) : 0
  const minsToAdd = durationMatch[2] ? Number(durationMatch[2]) : 0

  // 종료시간 계산
  let endHour = hour + hoursToAdd
  let endMin = min + minsToAdd

  // 분 → 시간 이월 처리: startTime이 09:30이고 duration이 PT1H30M인 경우 등
  if (endMin >= 60) {
    endHour += Math.floor(endMin / 60)
    endMin = endMin % 60
  }

  endHour = endHour % 24 // 24시간 형식 맞추기 (25:00 -> 01:00)

  return `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`
}
