import { SafeAreaView } from 'react-native-safe-area-context'
import { use, useEffect, useState } from 'react'
import NoCalendar from '../component/NoCalendar'
import HasCalendar from '../component/HasCalendar'
import { View } from 'react-native'
import PlusEdit from '../component/PlusEdit'
import { useCalendarStore } from '../../../store/useCalendarStore'
import api from '../../../infrastructure/remote/api/axiosInstance'

const CalendarScreen = () => {
  const [noCalendar, setNoCalendar] = useState(false) // 있다고 가정
  const [showPlus, setShowPlus] = useState(false)

  const calendarData = useCalendarStore(state => state.calendarData)

  const hasCalendar = Object.keys(calendarData).length > 0

  useEffect(() => {
    // NoCalendar(캘린더가 없다고 보여주는 화면)가 보이는지 여부
    // 전체 조직 조회: 하나라도 있으면 캘린더가 있다고 판단
    const fetchData = async () => {
      try {
        const res2 = await api.get('organizations')
        console.log('조직 조회 성공:', res2.data.data)
        setNoCalendar(!hasCalendar)
      } catch (error) {
        console.log('조직 조회 실패:', error)
      }
    }
    fetchData()
  }, [hasCalendar])

  if (noCalendar === null) {
    // 로딩 중이거나 판단 전이면 아무것도 보여주지 않거나 로딩 컴포넌트
    return <View className="flex-1 bg-surface-white" />
  }

  return (
    <View className="flex-1">
      {noCalendar && <NoCalendar />}
      <SafeAreaView
        edges={['top']}
        className="relative h-full flex-1 bg-surface-white"
      >
        {/* 등록된 캘린더가 있고, 팀 캘린더인지 */}
        <HasCalendar setShowPlus={setShowPlus} />
      </SafeAreaView>
      {showPlus && <PlusEdit setShowPlus={setShowPlus} />}
    </View>
  )
}

export default CalendarScreen
