import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from 'react'
import { View } from 'react-native'
import CalendarBase from './../personal/CalendarBase'
import TypeSelect from './TypeSelect'
import dayjs from 'dayjs'
import {
  MonthlySchedule,
  NewCalendar,
  ShiftType,
} from '../../../../../data/model/Calendar'
import { toShiftType } from '../../../../../data/mappers/ShiftTypeMapper'
import { calendarRepository } from '../../../../../infrastructure/di/Dependencies'

interface CalendarEditorProps {
  calendarName: string
  workGroup: string
  workTimes: {
    [key: string]: {
      startTime: string
      endTime: string
    }
  }
  year?: number
  month?: number
  scheduleData?: Map<string, ShiftType>
}

export interface CalendarEditorRef {
  postData: () => void
}

const CalendarEditor: ForwardRefRenderFunction<
  CalendarEditorRef,
  CalendarEditorProps
> = (
  { calendarName, workGroup, workTimes, year, month, scheduleData },
  ref
) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [calendarData, setCalendarData] = useState<Map<string, ShiftType>>(
    () => {
      console.log(scheduleData)
      return scheduleData ?? new Map<string, ShiftType>()
    }
  )
  const [currentDate, setCurrentDate] = useState(() => {
    if (year !== undefined && month !== undefined) {
      return dayjs()
        .year(year)
        .month(month - 1)
    }
    return dayjs()
  })

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
  }

  // 근무 형태 추가
  const handleTypeSelect = (type: ShiftType) => {
    if (!selectedDate) return
    const key = selectedDate.format('YYYY-MM-DD')

    setCalendarData(prev => {
      // 이미 근무 형태가 있으면 또 클릭하면 삭제
      const updated = new Map(prev)
      if (updated.get(key) === type) {
        updated.delete(key)
        console.log(`Deleted shift for ${key}`)
      } else {
        updated.set(key, type)
        console.log(`Set shift ${type} for ${key}`)
      }
      console.log('Updated calendarData (Map):', updated)
      console.log(
        'Updated calendarData entries:',
        Array.from(updated.entries())
      )
      console.log(
        'CalendarEditor render calendarData:',
        Array.from(calendarData.entries())
      )

      return updated
    })
  }

  // 부모에서 호출할 수 있게 내보낸다.
  useImperativeHandle(ref, () => ({
    postData: async () => {
      try {
        const calendarMap: Record<string, Map<number, ShiftType>> = {}
        console.log(
          '📅 최종 calendarData 내용:',
          Array.from(calendarData.entries())
        )

        calendarData.forEach((type, dateStr) => {
          const date = dayjs(dateStr)
          const year = date.year()
          const month = date.month() + 1
          const day = date.date()

          const key = `${year}-${month}`
          if (!calendarMap[key]) {
            calendarMap[key] = new Map()
          }
          calendarMap[key].set(day, type as ShiftType)
        })

        // MonthlySchedule 리스트 생성
        const schedules: MonthlySchedule[] = Object.entries(calendarMap).map(
          ([key, shiftsMap]) => {
            const [year, month] = key.split('-').map(Number)
            console.log('shifts: ', shiftsMap)
            return {
              year,
              month,
              shifts: shiftsMap,
            }
          }
        )
        // props.workTimes를 Map<ShiftType, { startTime, endTime }> 형태로 바꿔주는 코드가 필요

        const shiftTimesMap = new Map<
          ShiftType,
          { startTime: string; endTime: string }
        >()

        Object.entries(workTimes).forEach(([type, time]) => {
          // 만약 type이 "D", "E", "N"처럼 영어 코드면 아래처럼 매핑 필요
          const shiftType = toShiftType(type) // 예: "D" => "주간"
          if (shiftType) {
            shiftTimesMap.set(shiftType, time)
          }
        })

        const newCalendar: NewCalendar = {
          name: calendarName,
          group: workGroup,
          shiftTimes: shiftTimesMap,
          schedules,
        }
        console.log('요청하는 데이터:', newCalendar)

        // API 호출
        const res = await calendarRepository.createWorkCalendar(newCalendar)
        console.log('근무표 저장 성공', res)
      } catch (error) {
        console.error('근무표 저장 실패:', error)
        //throw error;
      }
    },
  }))

  return (
    <View>
      <CalendarBase
        currentDate={currentDate}
        onChangeMonth={setCurrentDate}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        calendarData={calendarData}
        isViewer={false}
      />
      <TypeSelect onPress={handleTypeSelect} />
    </View>
  )
}

export default forwardRef(CalendarEditor)
