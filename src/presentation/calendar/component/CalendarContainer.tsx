import { useEffect, useState } from 'react'
import { View } from 'react-native'
import dayjs from 'dayjs'
import TCalendarViewer from '../../../shared/components/calendar/team/TCalendarViewer'
import CalendarViewer from '../../../shared/components/calendar/personal/CalendarViewer'

interface CalendarContainerProps {
  isTeamView: boolean
  currentDate: dayjs.Dayjs
  selectedYearMonth: { year: number; month: number }
}

const CalendarContainer = ({
  isTeamView,
  currentDate,
  selectedYearMonth,
}: CalendarContainerProps) => {
  const [selectedDate, setSelectedDate] = useState(currentDate)

  useEffect(() => {
    setSelectedDate(currentDate)
  }, [currentDate])

  return (
    <View className="px-[20px]">
      {isTeamView ? (
        <TCalendarViewer
          selectedYearMonth={selectedYearMonth}
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelectedDate={() => {
            setSelectedDate(currentDate)
          }}
          // onDateSelected={() => { setSelectedDate(currentDate) }}
        />
      ) : (
        <CalendarViewer
          selectedYearMonth={selectedYearMonth}
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelectedDate={() => {
            setSelectedDate(currentDate)
          }}
          // onDateSelected={() => { setSelectedDate(currentDate) }}
        />
      )}
    </View>
  )
}

export default CalendarContainer
