import React from 'react'
import { Text, View } from 'react-native'
import ToggleBoxWrapper from '../../../shared/components/ToggleBoxWrapper'
import EntirePerson from '../../../assets/icons/entire-p.svg'
import OnePerson from '../../../assets/icons/one-p.svg'
import { ScheduleType } from '../../../shared/types/ScheduleScopeType'

interface SelectBoxProps {
  type: ScheduleType
  title: string
  subTitle: string
  isSelected: boolean
  onPress: (type: ScheduleType) => void
}

const SelectScheduleBox = ({
  type,
  title,
  subTitle,
  isSelected,
  onPress,
}: SelectBoxProps) => {
  return (
    <ToggleBoxWrapper
      type={type}
      isSelected={isSelected}
      onPress={onPress}
      boxStyle={
        'flex h-[148px] flex-1 items-center justify-center rounded-radius-xl p-[5px]'
      }
    >
      <View className="flex items-center gap-[18px]">
        {type === 'ALL' ? <EntirePerson /> : <OnePerson />}
        <View className="flex items-center gap-[10px]">
          <Text className="text-text-basic heading-xxs">{title}</Text>
          <Text className="text-center text-text-subtle label-xxs">
            {subTitle}
          </Text>
        </View>
      </View>
    </ToggleBoxWrapper>
  )
}

export default SelectScheduleBox
