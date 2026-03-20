import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCallback, useMemo, useRef, useState } from 'react'
import NoCalendar from '../component/NoCalendar'
import HasCalendar from '../component/HasCalendar'
import { View } from 'react-native'
import PlusEdit from '../component/PlusEdit'
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'
import { TabParamList } from '../../../navigation/types/StackTypes'
import dayjs from 'dayjs'

const CalendarScreen = () => {
  const route = useRoute<RouteProp<TabParamList, 'Calendar'>>()
  const [noCalendar, setNoCalendar] = useState(false) // 있다고 가정
  const [showPlus, setShowPlus] = useState(false)
  const insets = useSafeAreaInsets()

  // 캘린더 탭에서 팀 캘린더인 상태면 -> 근무표 수정 모드에서도 팀 캘린더 뷰
  const [isTeamView, setIsTeamView] = useState(
    () => route.params?.isTeamView ?? false
  )
  const fetchOrganization = useScheduleInfoStore(
    state => state.fetchOrganization
  )

  // navigation.reset으로 진입 시 새로 마운트되므로 lazy init으로 한 번만 읽음
  const [currentDate, setCurrentDate] = useState(() =>
    route.params?.selectedDate ? dayjs(route.params.selectedDate) : dayjs()
  )
  const selectedYearMonth = useMemo(
    () => ({
      year: currentDate.year(),
      month: currentDate.month() + 1,
    }),
    [currentDate]
  )

  // 탭 재진입 시 현재 달로 복귀 (탭 화면은 언마운트되지 않으므로 useRef로 첫 포커스 추적)
  const isFirstFocus = useRef(true)

  // 캘린더 탭에 포커스 될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false
      } else {
        // 이후 포커스: 현재 달로 복귀
        setCurrentDate(dayjs())
      }

      // NoCalendar(캘린더가 없다고 보여주는 화면)가 보이는지 여부
      // 전체 조직 조회: 하나라도 있으면 캘린더가 있다고 판단
      const fetchData = async () => {
        try {
          const res = await fetchOrganization()
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
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedYearMonth={selectedYearMonth}
          bottomInset={insets.bottom}
        />
      </SafeAreaView>
      {showPlus && (
        <PlusEdit
          setShowPlus={setShowPlus}
          isTeamView={isTeamView}
          currentDate={currentDate}
        />
      )}
    </View>
  )
}

export default CalendarScreen
