import { View, Text } from 'react-native'

import EggIcon from '../../../assets/icons/ic_egg_28.svg'
import LunchBoxIcon from '../../../assets/icons/ic_lunch_box_28.svg'
import MoonIcon from '../../../assets/icons/ic_moon_28.svg'
import SweetPotatoIcon from '../../../assets/icons/ic_sweet_potato_28.svg'

interface RecommendTodaysMealProps {
  label: string
  time: string
  description: string
  items: string[]
}

const RecommendTodaysMealChip: React.FC<RecommendTodaysMealProps> = ({
  label,
  time,
  description,
  items,
}) => {
  const MealIconComponent = () => {
    switch (label) {
      case '아침':
      case '조식':
        return <EggIcon className="h-4 w-4" />
      case '점심':
      case '중식':
        return <LunchBoxIcon className="h-4 w-4" />
      case '저녁':
      case '석식':
        return <MoonIcon className="h-4 w-4" />
      case '간식':
        return <SweetPotatoIcon className="h-4 w-4" />
      default:
        return <LunchBoxIcon className="h-4 w-4" />
    }
  }

  return (
    <View className="flex-col items-start justify-center rounded-radius-s bg-surface-white px-number-6 py-number-5 shadow-shadow-blur-3">
      <View className="flex-row items-center justify-start gap-g-3 pb-number-5">
        {/* 아이콘 자리 */}
        <View className="h-7 w-7 justify-center rounded-full bg-gray-200">
          <MealIconComponent />
        </View>
        <View className="flex-col items-start justify-center pl-number-5">
          {label ? (
            <Text className="text-text-subtle body-xxs">{label}</Text>
          ) : (
            <Text className="text-text-subtle body-xxs">식사 시간</Text>
          )}
          <Text className="text-[8px] leading-[1.2] text-text-subtle">
            {time} 경
          </Text>
        </View>
      </View>
      <View className="flex-col items-start justify-center">
        {description ? (
          <Text className="text-[8px] font-medium leading-[1.2] text-text-subtle">
            {description}
          </Text>
        ) : (
          <Text className="text-[8px] font-medium leading-[1.2] text-text-subtle">
            설명
          </Text>
        )}
        <Text className="pt-[2px] text-text-basic heading-xxxs">
          {Array.isArray(items) && items.length > 0
            ? items.join(', ')
            : '추천 식단 없음'}
        </Text>
      </View>
    </View>
  )
}

export default RecommendTodaysMealChip
