import { useEffect, useMemo, useState } from 'react'
import { WorkType } from '../../../domain/models/Calendar'
import { getHolidayDateSetUseCase } from '../../../infrastructure/di/Dependencies'
import { useCurrentTimeTick } from '../../../shared/hooks/useCurrentTimeTick'
import { useCalendarStore } from '../../../store/useCalendarStore'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'
import { useTeamCalendarStore } from '../../../store/useTeamCalendarStore'
import { AlarmWeekdayLabel } from '../types/alarmDraft'
import { createWorkTypeResolver } from '../../../shared/utils/alarm/workTypeResolver'
import { formatRemainingTime } from '../../../shared/utils/alarm/formatRemainingTime'
import { resolveAutoAlarmNextTriggerAtMillis } from '../../../shared/utils/alarm/resolveAutoAlarmNextTriggerAtMillis'

interface UseAutoAlarmNextTriggerPreviewInput {
  alarmTime: Date
  selectedDays: AlarmWeekdayLabel[]
  selectedWorkType: WorkType
  isHolidayAlarmOff: boolean
  isReady?: boolean
}

interface UseAutoAlarmNextTriggerPreviewResult {
  previewText: string
  nextTriggerAtMillis: number | null
  isCalculating: boolean
}

const getPreviewText = (
  nextTriggerAtMillis: number | null,
  isCalculating: boolean,
  isReady: boolean,
  referenceMillis: number
): string => {
  if (!isReady) {
    return '알람 정보를 불러오는 중이에요'
  }

  if (isCalculating) {
    return '다음 알람 시간을 계산 중이에요'
  }

  if (nextTriggerAtMillis === null) {
    return '조건을 만족하는 알람 시간을 찾을 수 없어요'
  }

  const remainingText = formatRemainingTime(
    nextTriggerAtMillis,
    referenceMillis
  )

  return remainingText === '지금' ? '지금 울려요' : `${remainingText}에 울려요`
}

export const useAutoAlarmNextTriggerPreview = ({
  alarmTime,
  selectedDays,
  selectedWorkType,
  isHolidayAlarmOff,
  isReady = true,
}: UseAutoAlarmNextTriggerPreviewInput): UseAutoAlarmNextTriggerPreviewResult => {
  const calendarData = useCalendarStore(state => state.calendarData)
  const teamCalendarData = useTeamCalendarStore(state => state.teamCalendarData)
  const currentTeamFromSchedule = useScheduleInfoStore(state => state.workGroup)
  const currentTeamFromCalendar = useTeamCalendarStore(state => state.myTeam)
  const currentTimeMillis = useCurrentTimeTick()

  const [nextTriggerAtMillis, setNextTriggerAtMillis] = useState<number | null>(
    null
  )
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    let isActive = true

    if (!isReady) {
      setNextTriggerAtMillis(null)
      setIsCalculating(false)
      return () => {
        isActive = false
      }
    }

    setIsCalculating(true)
    ;(async () => {
      try {
        const resolveWorkTypeForDate = createWorkTypeResolver({
          calendarData,
          teamCalendarData,
          currentTeam: currentTeamFromSchedule || currentTeamFromCalendar,
        })

        const nextTrigger = await resolveAutoAlarmNextTriggerAtMillis({
          now: new Date(currentTimeMillis),
          alarmTime,
          selectedDays,
          selectedWorkType,
          isHolidayAlarmOff,
          getHolidayDateSet: year => getHolidayDateSetUseCase.execute(year),
          resolveWorkTypeForDate,
        })

        if (!isActive) {
          return
        }

        setNextTriggerAtMillis(nextTrigger)
      } catch (error) {
        if (!isActive) {
          return
        }

        console.error('Failed to resolve auto alarm preview:', error)
        setNextTriggerAtMillis(null)
      } finally {
        if (isActive) {
          setIsCalculating(false)
        }
      }
    })()

    return () => {
      isActive = false
    }
  }, [
    alarmTime,
    calendarData,
    currentTeamFromCalendar,
    currentTeamFromSchedule,
    isHolidayAlarmOff,
    isReady,
    selectedDays,
    selectedWorkType,
    teamCalendarData,
    currentTimeMillis,
  ])

  const previewText = useMemo(
    () =>
      getPreviewText(
        nextTriggerAtMillis,
        isCalculating,
        isReady,
        currentTimeMillis
      ),
    [currentTimeMillis, isCalculating, isReady, nextTriggerAtMillis]
  )

  return {
    previewText,
    nextTriggerAtMillis,
    isCalculating,
  }
}
