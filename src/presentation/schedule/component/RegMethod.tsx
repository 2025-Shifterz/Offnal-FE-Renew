import React from 'react'
import { Text, View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import ToggleBoxWrapper from '../../../shared/components/ToggleBoxWrapper'
import { ScheduleRegMethod } from '../../../shared/types/ScheduleRegMethod'
import { PhotoType } from '../../../shared/types/PhotoType'

type RegMethodProps<T extends ScheduleRegMethod | PhotoType> = {
  type: T
  isSelected: boolean
  Icon: React.FC<SvgProps>
  title: string
  subtitle: string
  onPress: (type: T) => void
}

const RegMethod = <T extends ScheduleRegMethod | PhotoType>({
  type,
  isSelected,
  Icon,
  title,
  subtitle,
  onPress,
}: RegMethodProps<T>) => {
  return (
    <ToggleBoxWrapper<T>
      type={type}
      isSelected={isSelected}
      boxStyle="w-full h-[66px] rounded-radius-m mb-number-7 flex-row items-center gap-number-6  p-p-5"
      onPress={onPress}
    >
      <Icon width={32} height={32} className="mr-number-7" />

      <View className="flex-col ">
        <Text className="mb-number-4 text-text-basic heading-xxs">{title}</Text>
        <Text className="text-text-subtle label-xxs">{subtitle}</Text>
      </View>
    </ToggleBoxWrapper>
  )
}

export default RegMethod
