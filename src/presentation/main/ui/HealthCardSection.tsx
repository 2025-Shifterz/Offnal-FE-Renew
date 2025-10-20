import { View } from 'react-native'
import TitleSection from '../components/TitleSection'
import HealthCard from '../components/HealthCard'
import SneakersIcon from '../../../assets/icons/ic_sneakers_61.svg'
import WeightIcon from '../../../assets/icons/ic_weight_24.svg'
import useHealthData from '../../../shared/hooks/useHealthData'

const HealthCardSection = () => {
  const { steps, weight, bmi } = useHealthData()

  const calculateWeightStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) return '저체중'
    if (bmiValue < 23) return '표준'
    if (bmiValue < 25) return '과체중'
    return '비만'
  }

  return (
    <View className="flex-col justify-start gap-y-number-7 pt-number-8">
      <TitleSection.WithAddableBtn
        title="건강 카드"
        btnContent="건강 카드 추가"
        onPressIcon={() => {}}
      />
      <View className="w-full flex-row items-center gap-g-3 pb-number-8 pt-number-6">
        <HealthCard
          title="걸음 수"
          value={steps}
          unit={9000}
          Icon={SneakersIcon}
          secondaryUnit="64%"
        />
        <HealthCard
          title="체중"
          value={weight}
          Icon={WeightIcon}
          secondaryUnit={calculateWeightStatus(bmi)}
        />
      </View>
    </View>
  )
}

export default HealthCardSection
