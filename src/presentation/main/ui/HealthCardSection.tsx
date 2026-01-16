import { View } from 'react-native'
import TitleSection from '../components/TitleSection'
import HealthCard from '../components/HealthCard'
import SneakersIcon from '../../../assets/icons/ic_sneakers_61.svg'
import WeightIcon from '../../../assets/icons/ic_weight_50.svg'
import useHealthData from '../../../shared/hooks/useHealthData'
import { STEP_GOAL } from '../constants/stepGoal'

const HealthCardSection = () => {
  const { steps, weight, bmi, stepPercentage } = useHealthData()

  const calculateWeightStatus = (bmiValue: number) => {
    if (bmiValue == 0) return null
    if (bmiValue < 18.5) return '저체중'
    if (bmiValue < 23) return '표준'
    if (bmiValue < 25) return '과체중'
    return '비만'
  }

  return (
    <View className="flex-col justify-start gap-y-number-7 pt-number-8">
      <TitleSection.OnlyTitle title="건강 카드" />
      <View className="w-full flex-row items-center gap-g-3 pb-number-8 pt-number-6">
        <HealthCard
          title="걸음 수"
          value={steps}
          goal={STEP_GOAL}
          Icon={SneakersIcon}
          secondaryUnit={`${stepPercentage} %`}
        />
        <HealthCard
          title="몸무게 기록"
          value={weight}
          Icon={WeightIcon}
          secondaryUnit={calculateWeightStatus(bmi)}
        />
      </View>
    </View>
  )
}

export default HealthCardSection
