import { View } from 'react-native'
import TitleSection from '../components/TitleSection'
import HealthCard from '../components/HealthCard'

const HealthCardSection = () => {
  return (
    <View className="flex-col justify-start gap-y-number-7 pt-number-8">
      <TitleSection.WithAddableBtn
        title="건강 카드"
        btnContent="건강 카드 추가"
        onPressIcon={() => {}}
      />
      <View className="w-full flex-row items-center gap-g-3 pb-number-8 pt-number-6">
        <HealthCard.Walk />
        <HealthCard.Weight />
      </View>
    </View>
  )
}

export default HealthCardSection
