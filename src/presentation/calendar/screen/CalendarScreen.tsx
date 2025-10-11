import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import NoCalendar from '../component/NoCalendar'
import HasCalendar from '../component/HasCalendar'
import { View } from 'react-native'
import PlusEdit from '../component/PlusEdit'
import { userRepository } from '../../../infrastructure/di/Dependencies'

const CalendarScreen = () => {
  const [noCalendar, setNoCalendar] = useState(false) // 있다고 가정
  const [showPlus, setShowPlus] = useState(false)

  // NoCalendar가 보이는지 여부
  useEffect(() => {
    const checkCalendar = async () => {
      const hasSchedule = await userRepository.isUserScheduleRegistered()
      setNoCalendar(!hasSchedule) // 등록된 게 없으면 true
      //  console.log('noCalendar', noCalendar);
    }

    checkCalendar()
  }, [])

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
