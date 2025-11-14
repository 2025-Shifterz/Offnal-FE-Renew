import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
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
  const setLatestOrganization = useCalendarStore(
    state => state.setLatestOrganization
  )
  const hasCalendar = Object.keys(calendarData).length > 0

  useEffect(() => {
    // NoCalendar(캘린더가 없다고 보여주는 화면)가 보이는지 여부
    // 전체 조직 조회: 하나라도 있으면 캘린더가 있다고 판단
    const fetchData = async () => {
      try {
        // 조직 조회 API 호출 수정 필요
        const res = await api.get('organizations')
        console.log('조직 조회 성공:', res.data.data)
        setNoCalendar(!hasCalendar)

        // 가장 마지막 조직 데이터를 저장
        const organizations = res.data.data
        if (organizations && organizations.length > 0) {
          const latestItem = organizations[organizations.length - 1]
          setLatestOrganization(latestItem.organizationName, latestItem.team)
        }
      } catch (error) {
        console.log('조직 조회 실패:', error)
      }
    }
    fetchData()
  }, [hasCalendar, setLatestOrganization])

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
