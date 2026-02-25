import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import CustomDashedLine from '../DashedLine'
import TimeFrame, { TimeFrameChildren } from '../TimeFrame'

interface TypeSelectProps {
  onPressSelect: (team: string, type: TimeFrameChildren) => void
}

const types: TimeFrameChildren[] = ['주간', '오후', '야간', '휴일']
const teams = ['1조', '2조', '3조', '4조']

// onPressSelect('1조','주간')을 호출
const TypeSelect = ({ onPressSelect }: TypeSelectProps) => {
  return (
    <>
      <CustomDashedLine />
      <TouchableOpacity className="rounded-b-radius-m2 flex-col gap-[9px] bg-surface-white p-[11px]">
        <Text className="text-text-subtle body-xs">근무 형태 입력</Text>
        <View className="flex gap-[3px]">
          {teams.map(team => (
            <View key={team} className="flex-row items-center gap-[5px]">
              <View className="flex w-[30px] items-center">
                <Text className="text-text-subtle label-xxs">{team}</Text>
              </View>

              <View className="flex-row gap-[6px]">
                {types.map(type => (
                  <TimeFrame
                    key={`${team}-${type}`}
                    text={type}
                    onPress={() => onPressSelect(team, type)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </>
  )
}

export default TypeSelect
