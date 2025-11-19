import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import CalendarBase from './../personal/CalendarBase'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
import { calendarRepository } from '../../../../infrastructure/di/Dependencies'
import {
  CreateCalendarRequest,
  InputWorkTimeDetail,
} from '../../../../infrastructure/remote/request/CreateWorkCalendarRequest'
import { WorkType } from '../../../types/Calendar'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import { View } from 'react-native'
import TypeSelect from './TypeSelect'
import { fromShiftType } from '../../../../data/mappers/ShiftTypeMapper'
import { convertEndTimeToDuration } from '../../../utils/calendar/convertDuration'

export interface CalendarEditorRef {
  postData: () => void
}

const CalendarEditor: ForwardRefRenderFunction<
  CalendarEditorRef,
  Partial<Omit<CreateCalendarRequest, 'workTimes'>> & {
    workTimes: Record<string, InputWorkTimeDetail>
    organizationName: string
    workGroup: string
  }
> = ({ workTimes, organizationName, workGroup }, ref) => {
  // stores
  const selectedDate = useCalendarStore(state => state.selectedDate)
  const setSelectedDate = useCalendarStore(state => state.setSelectedDate)
  const newCalendarData = useCalendarStore(state => state.newCalendarData)
  const clearNewCalendarData = useCalendarStore(
    state => state.clearNewCalendarData
  )
  const updateNewCalendarDay = useCalendarStore(
    state => state.updateNewCalendarDay
  )

  // 편집 모드에서는 newCalendarData 사용
  let newCalendars: CreateCalendarRequest['calendars'] = []

  const [currentDate, setCurrentDate] = useState(dayjs())

  // 처음에는 초기화//
  useEffect(() => {
    clearNewCalendarData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
  }

  // 근무 형태 추가
  const handleTypeSelect = (type: WorkType) => {
    if (!selectedDate) return
    const key = selectedDate.format('YYYY-MM-DD')

    // 상태 업데이트
    updateNewCalendarDay(key, type)
  }

  const [convertedWorkTimes, setConvertedWorkTimes] = useState<
    Record<string, { startTime: string; duration: string }>
  >({
    D: { startTime: '08:00', duration: 'PT8H' },
    E: { startTime: '16:00', duration: 'PT8H' },
    N: { startTime: '00:00', duration: 'PT8H' },
  })

  // workTimes 에서 endTime -> duration 변환
  useEffect(() => {
    if (!workTimes) return
    const converted = convertEndTimeToDuration(workTimes)
    setConvertedWorkTimes(converted)
  }, [workTimes])

  // 부모에서 호출할 수 있는 함수 정의
  useImperativeHandle(ref, () => ({
    postData: async () => {
      try {
        // 저장된 calendarData에 어떤 년/월이 저장되어 있는지 확인
        const storedMonths = Array.from(
          new Set( // 중복 제거
            Object.keys(newCalendarData).map(dateStr =>
              dayjs(dateStr).format('YYYY-MM')
            )
          )
        ).sort()
        console.log('저장된 calendarData의 년/월 목록:', storedMonths)

        // 새 캘린더 데이터 생성 (calendars의 월별 목록)
        const firstMonth = storedMonths[0]
        const lastMonth = storedMonths[storedMonths.length - 1]

        const startDate = dayjs(firstMonth + '-01').format('YYYY-MM-DD')
        const endDate = dayjs(lastMonth + '-01')
          .endOf('month')
          .format('YYYY-MM-DD')

        const seenCombinations = new Set<string>()
        const key = `${organizationName}_${workGroup}`

        if (!seenCombinations.has(key)) {
          seenCombinations.add(key)

          const shifts: Record<string, string> = {}
          Object.entries(newCalendarData).forEach(([date, value]) => {
            if (
              dayjs(date).isSameOrAfter(startDate) &&
              dayjs(date).isSameOrBefore(endDate)
            ) {
              shifts[date] = fromShiftType(value.workTypeName)
            }
          })

          newCalendars = [
            {
              // TODO: myTeam도 추가하기
              organizationName,
              team: workGroup,
              startDate,
              endDate,
              shifts,
            },
          ]
          console.log('생성된 새 calendars 데이터:', newCalendars)
        }

        // TODO: 팀에서 설정한 myTeam 정보도 포함시키기
        // 팀에서 저장하면 내가 속한 조로 다시 개인 근무표를 조회해야함!!
        const newCalendarRequest: CreateCalendarRequest = {
          myTeam: workGroup,
          workTimes: convertedWorkTimes,
          calendars: newCalendars,
        }
        console.log('요청하는 근무표 등록 데이터:', newCalendarRequest)

        // API 호출

        const res = await calendarRepository.createCalendar(newCalendarRequest)

        console.log('근무표 저장 성공', res)
      } catch (error) {
        console.error('근무표 저장 실패:', error)
        throw error
      }
    },
  }))

  return (
    <View>
      <CalendarBase
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        calendarData={newCalendarData}
        isViewer={false}
      />
      <TypeSelect onPress={handleTypeSelect} />
    </View>
  )
}

export default forwardRef(CalendarEditor)
