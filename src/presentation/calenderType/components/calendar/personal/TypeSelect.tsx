import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import CustomDashedLine from '../../DashedLine'
import TimeFrame from '../../TimeFrame'
import { ShiftType } from '../../../../../data/model/Calendar'

const shiftTypes: ShiftType[] = ['주간', '야간', '오후', '휴일']

interface TypeSelectProps {
  onPress: (type: ShiftType) => void
}

// onPress('주간')을 호출하면 handleTypeSelect('주간')을 실행하게 된다.
const TypeSelect = ({ onPress }: TypeSelectProps) => {
  return (
    <>
      <CustomDashedLine />
      <TouchableOpacity className="flex-col gap-[9px] rounded-b-radius-m2 bg-surface-white p-[11px]">
        <Text className="text-text-subtle body-xs">근무 형태 입력</Text>
        <View className="flex-row gap-[6px]">
          {shiftTypes.map(type => (
            <TimeFrame key={type} text={type} onPress={() => onPress(type)} />
          ))}
        </View>
      </TouchableOpacity>
    </>
  )
}

export default TypeSelect
