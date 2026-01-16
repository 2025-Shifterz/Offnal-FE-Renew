import { FC } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface HealthCardProps {
  title: string
  value: number
  goal?: number
  secondaryUnit: string | null
  Icon: FC<SvgProps>
}

const HealthCard = ({
  title,
  value,
  goal,
  secondaryUnit,
  Icon,
}: HealthCardProps) => {
  const stringGoalStep = goal?.toLocaleString()
  return (
    <View className="h-[141px] flex-1 items-start justify-between rounded-[20px] bg-surface-white p-p-6">
      <View className="h-full justify-between">
        <View className="flex-col gap-[5px]">
          <Text className="text-text-subtle heading-xxxxs">{title}</Text>
          <View className="flex-row gap-[5px]">
            <Text className="text-text-bolder heading-s">
              {title === '몸무게 기록' ? `${value}kg` : value.toLocaleString()}
            </Text>
            {secondaryUnit && (
              <View className="justify-center rounded-radius-s bg-primary-5 px-[6px]">
                <Text className="text-primary-60 heading-xxxxs">
                  {secondaryUnit}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="w-full flex-row justify-between">
          <View className="flex-col items-start justify-between">
            {goal && (
              <Text className="text-text-subtle label-xxs">
                / {stringGoalStep} 걸음
              </Text>
            )}
            <View />
            <TouchableOpacity>
              <Text className="text-gray-30 body-xxs">더보기</Text>
            </TouchableOpacity>
          </View>
          <Icon />
        </View>
      </View>
    </View>
  )
}

export default HealthCard
