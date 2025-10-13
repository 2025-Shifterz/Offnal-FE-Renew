import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import EntirePerson from '../../../assets/icons/entire-p.svg'
import OnePerson from '../../../assets/icons/one-p.svg'

// Define the type for the props
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
  // 클릭 시 자신의 id를 부모에게 전달한다.
  const handlePress = () => {
    // 부모 컴포넌트의 onPress 함수 호출
    // 자신이 클릭되면, 부모로부터 받은 onPress 함수를 호출하면서 자신의 id를 전달한다.
    onPress(id)
  }

  const selectedStyle = isSelected
    ? 'border border-border-primary bg-surface-primary-light-2'
    : 'bg-surface-white'

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={twMerge(
        'flex h-[148px] flex-1 items-center justify-center rounded-lg p-[5px]',
        selectedStyle
      )}
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
    </TouchableOpacity>
  )
}

export default SelectScheduleBox
