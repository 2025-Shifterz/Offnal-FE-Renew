import { useIsFocused } from '@react-navigation/native'
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import CalendarBase from './../personal/CalendarBase'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { calendarRepository } from '../../../../infrastructure/di/Dependencies'
import { useCalendarStore } from '../../../../store/useCalendarStore'

interface CalendarViewerProps {
  onPressTeamIcon?: () => void
  onPressEditIcon?: () => void
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: (date: dayjs.Dayjs | null) => void
  onDateSelected?: (date: dayjs.Dayjs) => void // ✅ 콜백 추가
}

const CalendarViewer = ({
  onPressTeamIcon,
  onPressEditIcon,
  selectedDate,
  setSelectedDate,
  onDateSelected,
}: CalendarViewerProps) => {
  const calendarData = useCalendarStore(state => state.calendarData)
  const setCalendarData = useCalendarStore(state => state.setCalendarData)
  const selectedYearMonth = useCalendarStore(state => state.selectedYearMonth)
  const latestOrganization = useCalendarStore(state => state.latestOrganization)

  // 현재 달 기준으므로 수정이 필요함 !!
  // const selectedMonthStartDate = selectedDate
  //   ? selectedDate.startOf('month').format('YYYY-MM-DD')
  //   : dayjs().startOf('month').format('YYYY-MM-DD')
  // const selectedMonthEndDate = selectedDate
  //   ? selectedDate.endOf('month').format('YYYY-MM-DD')
  //   : dayjs().endOf('month').format('YYYY-MM-DD')

  // current date  -> 선택한 달로 바꾸기 !!!!!!!!!!!!
  const [currentDate, setCurrentDate] = useState(dayjs())
  const isFocused = useIsFocused() // 화면 포커스 여부 확인

  const year = currentDate.year()
  const month = currentDate.month() + 1

  // '2025-11-01' 형태
  const monthStartDate = `${selectedYearMonth.year}-${String(selectedYearMonth.month).padStart(2, '0')}-01`
  const monthEndDate = dayjs(monthStartDate).endOf('month').format('YYYY-MM-DD')

  // 근무표 조회 API (화면이 포커스될 때마다 다시 호출) -> 월별 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await calendarRepository.getCalendar(
          latestOrganization.organizationName,
          latestOrganization.team,
          monthStartDate,
          monthEndDate
        )
        setCalendarData(response)
        console.log('월별 근무표 조회 성공:', response)
      } catch (error) {
        console.log('월별 근무표 조회 실패:', error)
      }
    }
    if (isFocused) {
      fetchData()
    }
  }, [year, month, isFocused]) // isFocused를 dependency array에 추가

  // ----------

  // 날짜 선택
  const handleDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
    console.log('selectedDate:', selectedDate)
    onDateSelected?.(date) // ✅ 날짜 선택 시 콜백 실행
  }

  return (
    <View>
      <CalendarBase
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        currentDate={currentDate}
        onChangeMonth={setCurrentDate}
        calendarData={calendarData}
        onPressTeamIcon={onPressTeamIcon}
        onPressEditIcon={onPressEditIcon}
        isViewer
      />
    </View>
  )
}

export default CalendarViewer
