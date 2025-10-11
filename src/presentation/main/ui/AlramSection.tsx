import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import TitleSection from '../components/TitleSection'
import AlramCard from '../components/AlramCard'

interface Alarm {
  // 실제 alarm 데이터 구조에 맞게 필드 추가 필요
  [key: string]: unknown
}

interface AlramSectionProps {
  alarms: Alarm[]
}

const AlramSection = ({ alarms }: AlramSectionProps) => {
  const navigation = useNavigation()

  return (
    <View className="flex-col justify-start gap-y-number-7 py-number-8">
      <TitleSection.WithAddableBtn
        title="자동알람"
        btnContent="알람 추가"
        onPressIcon={() => navigation.navigate('AutoAlarm')}
      />
      {alarms && alarms.length > 0 ? (
        alarms.map((alarm: Alarm, idx: number) => (
          // 실제 알람 있을 때 컴포넌트 만들어야 함
          <AlramCard.NothingRegistered />
        ))
      ) : (
        <AlramCard.NothingRegistered />
      )}
    </View>
  )
}

export default AlramSection
