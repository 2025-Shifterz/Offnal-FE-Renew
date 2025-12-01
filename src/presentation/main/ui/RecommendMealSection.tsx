import { ScrollView, View, Text } from 'react-native'
import TitleSection from '../components/TitleSection'
import RecommendTodaysMealChip from '../components/RecommendTodaysMealChip'
import TableWare from '../../../assets/icons/ic_tableware.svg'
import TooltipBubble from '../components/Tooltip'
import { useState } from 'react'

interface Meal {
  label: string
  time: string
  description: string
  items: string[]
}

interface RecommendMealSectionProps {
  meals: Meal[]
}

const RecommnedMealSection = ({ meals }: RecommendMealSectionProps) => {
  const isEmpty = !meals || meals.length === 0

  const [showTooltip, setShowTooltip] = useState(false)

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip)
  }

  return (
    <View className="mb-number-11 flex-1 flex-col items-start">
      <View className="flex-row ">
        <TitleSection.WithTooltipIcon
          title="오늘의 식사 추천"
          onPressIcon={toggleTooltip}
        />
        {showTooltip && (
          <TooltipBubble style={{ position: 'absolute' }}>
            식사 추천은 근무 형태에 맞춤으로 제공돼요.
          </TooltipBubble>
        )}
      </View>

      {isEmpty ? (
        <View className="mt-number-7 h-[84px] w-full flex-1 flex-col items-center justify-center rounded-radius-m bg-surface-white p-number-6">
          <TableWare width={36.87} height={27.94} />
          <Text className="items-center pt-[6.45px] text-text-disabled body-xxs">
            아직 근무표가 등록되지 않아{'\n'}식사를 추천해드릴 수 없어요.
          </Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="mt-number-7 flex-1 flex-row items-center gap-g-3">
            {meals.map((meal: Meal, idx: number) => (
              <RecommendTodaysMealChip
                key={idx}
                label={meal.label}
                time={meal.time}
                description={meal.description}
                items={meal.items}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default RecommnedMealSection
