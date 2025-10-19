import { FC } from 'react'
import { View, Text } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface HealthCardProps {
  title: string
  value: number
  unit?: number
  secondaryUnit: string
  Icon: FC<SvgProps>
}

const HealthCard = ({
  title,
  value,
  unit,
  secondaryUnit,
  Icon,
}: HealthCardProps) => {
  return (
    <View className="h-[141px] flex-1 items-start justify-between rounded-[20px] bg-surface-white p-p-6">
      <View className="flex-col gap-[5px]">
        <Text className="text-text-subtle heading-xxxxs">{title}</Text>
        <View className="flex-row gap-[5px]">
          <Text className="text-text-bolder heading-s">{value}</Text>
          <View className="justify-center rounded-radius-s bg-primary-5 px-[6px]">
            <Text className="text-primary-60 heading-xxxxs">
              {secondaryUnit}
            </Text>
          </View>
        </View>
      </View>

      <View className=" w-full flex-row items-start justify-between">
        <View className="flex-row items-center justify-center">
          {unit && (
            <Text className="text-text-subtle label-xxs">/ {unit} 걸음</Text>
          )}
        </View>
        <Icon />
      </View>
    </View>
  )
}

export default HealthCard
