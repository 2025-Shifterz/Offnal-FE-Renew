import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import TeamItem from './TeamItem'
import { twMerge } from 'tailwind-merge'

interface TeamInputProps {
  workGroup: string
  setWorkGroup: (text: string) => void
  isDirect: boolean
  setIsDirect: (bool: boolean) => void
}

const TeamInput = ({
  workGroup,
  setWorkGroup,
  isDirect,
  setIsDirect,
}: TeamInputProps) => {
  const [selectedBoxId, setSelectedBoxId] = useState(1)

  const directInputStyle = isDirect
    ? 'border-border-primary bg-surface-primary-light-2'
    : 'border-border-gray-light'
  const directInputTextStyle = isDirect
    ? 'text-text-primary'
    : 'text-text-disabled'

  return (
    <View className="flex gap-[9px]">
      <Text className="text-text-subtle heading-xxxs">근무조 입력</Text>
      <View className="flex h-[102px] gap-4 rounded-lg bg-white px-[15px] py-[11px]">
        <View className="flex-row gap-[8px]">
          {[1, 2, 3, 4].map(id => (
            <TeamItem
              key={id}
              id={id}
              onPress={() => {
                setSelectedBoxId(id)
                setIsDirect(false)
                setWorkGroup(`${id}조`)
              }}
              isSelected={selectedBoxId === id}
              text={`${id}조`}
            />
          ))}
        </View>

        <View className="h-[32px] flex-row items-center justify-between">
          {/* 직접 입력 */}
          <TouchableOpacity
            onPress={() => {
              setIsDirect(true)
              setSelectedBoxId(0)
              setWorkGroup('') // 초기화
            }}
            className={twMerge(
              'rounded-radius-max border-[0.5px] px-[14px] py-[8px]',
              directInputStyle
            )}
          >
            <Text className={twMerge('label-xs', directInputTextStyle)}>
              직접 입력
            </Text>
          </TouchableOpacity>
          {/* A조 ~~ */}
          {isDirect && (
            <View className="flex-1 gap-1 px-[14px] py-[8px]">
              <View className="flex-row items-center gap-2">
                <TextInput
                  maxLength={8}
                  value={workGroup}
                  placeholder="A조"
                  onChangeText={setWorkGroup}
                  className="flex-1 label-xs placeholder:text-text-disabled"
                />
                <Text className="text-right text-text-disabled label-xxs">
                  <Text className="text-text-primary">{workGroup.length}</Text>
                  <Text>/8</Text>
                </Text>
              </View>
              <View className="h-[0.5px] bg-border-gray-light" />
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default TeamInput
