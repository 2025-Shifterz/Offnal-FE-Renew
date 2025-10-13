import React from 'react'
import { Text, View } from 'react-native'
import ToggleBoxWrapper from '../../../shared/components/ToggleBoxWrapper'
import EntirePerson from '../../../assets/icons/entire-p.svg'
import OnePerson from '../../../assets/icons/one-p.svg'

interface SelectBoxProps {
  id: number
  title: string
  subTitle: string
  isSelected: boolean
  onPress: (id: number) => void // 부모로부터 id를 인자로 받음
}

const SelectScheduleBox = ({
  id,
  title,
  subTitle,
  isSelected,
  onPress,
}: SelectBoxProps) => {
  return (
    <ToggleBoxWrapper
      id={id}
      isSelected={isSelected}
      onPress={onPress}
      boxStyle={
        'flex h-[148px] flex-1 items-center justify-center rounded-radius-xl p-[5px]'
      }
    >
      <View className="flex items-center gap-[18px]">
        {id === 1 ? <EntirePerson /> : <OnePerson />}
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
