import { SafeAreaView } from 'react-native-safe-area-context'
import { useCallback, useState } from 'react'
import NoCalendar from '../component/NoCalendar'
import HasCalendar from '../component/HasCalendar'
import { View } from 'react-native'
import PlusEdit from '../component/PlusEdit'
import { useFocusEffect } from '@react-navigation/native'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'
import { Organization } from '../../../domain/models/Organization'

const CalendarScreen = () => {
  const [noCalendar, setNoCalendar] = useState(false) // 있다고 가정
  const [showPlus, setShowPlus] = useState(false)

  // 캘린더 탭에서 팀 캘린더인 상태면 -> 근무표 수정 모드에서도 팀 캘린더 뷰
  const [isTeamView, setIsTeamView] = useState(false)
  const { fetchOrganization } = useScheduleInfoStore()

  // 캘린더 탭에 포커스 될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      // NoCalendar(캘린더가 없다고 보여주는 화면)가 보이는지 여부
      // 전체 조직 조회: 하나라도 있으면 캘린더가 있다고 판단
      const fetchData = async () => {
        try {
          const res = await fetchOrganization()
          if (res) console.log('조직 조회 성공:', res)
          console.log(res === ({} as Organization))
          if (Object.keys(res).length === 0) setNoCalendar(true)
        } catch (error) {
          console.log('조직 조회 실패:', error)
        }
      }

      fetchData()
    }, [fetchOrganization])
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
        <HasCalendar
          setShowPlus={setShowPlus}
          isTeamView={isTeamView}
          setIsTeamView={setIsTeamView}
        />
      </SafeAreaView>
      {showPlus && (
        <PlusEdit setShowPlus={setShowPlus} isTeamView={isTeamView} />
      )}
    </View>
  )
}

export default CalendarScreen
