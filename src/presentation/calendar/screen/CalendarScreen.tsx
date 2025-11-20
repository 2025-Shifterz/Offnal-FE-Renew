import { SafeAreaView } from 'react-native-safe-area-context'
import { useCallback, useState } from 'react'
import NoCalendar from '../component/NoCalendar'
import HasCalendar from '../component/HasCalendar'
import { View } from 'react-native'
import PlusEdit from '../component/PlusEdit'
import { useCalendarStore } from '../../../store/useCalendarStore'
import { organizationRepository } from '../../../infrastructure/di/Dependencies'
import { useFocusEffect } from '@react-navigation/native'

const CalendarScreen = () => {
  const [noCalendar, setNoCalendar] = useState(false) // 있다고 가정
  const [showPlus, setShowPlus] = useState(false)
  const setLatestOrganization = useCalendarStore(
    state => state.setLatestOrganization
  )

  // 캘린더 탭에 포커스 될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      // NoCalendar(캘린더가 없다고 보여주는 화면)가 보이는지 여부
      // 전체 조직 조회: 하나라도 있으면 캘린더가 있다고 판단
      const fetchData = async () => {
        try {
          const res = await organizationRepository.getAllOrganizations()

          console.log('조직 조회 성공:', res)
          if (res.length === 0) setNoCalendar(true)

          // 가장 마지막 조직 데이터를 저장
          const organizations = res
          if (organizations && organizations.length > 0) {
            const latestItem = organizations[organizations.length - 1]
            setLatestOrganization(latestItem.organizationName, latestItem.team)
          }
        } catch (error) {
          console.log('조직 조회 실패:', error)
        }
      }
      fetchData()
    }, [setLatestOrganization])
  )

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
