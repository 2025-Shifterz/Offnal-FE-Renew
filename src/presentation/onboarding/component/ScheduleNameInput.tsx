import React from 'react'
import { Text, TextInput, View } from 'react-native'

interface NameInputProps {
  organizationName: string
  setOrganizationName: (text: string) => void
}

const ScheduleNameInput = ({
  organizationName,
  setOrganizationName,
}: NameInputProps) => {
  return (
    <View className="mt-[20px] flex gap-[9px]">
      <Text className="text-text-subtle heading-xxxs">조직 이름</Text>
      <View className="h-[48px] flex-row justify-between rounded-lg bg-white px-[16px]">
        <TextInput
          value={organizationName}
          onChangeText={setOrganizationName}
          placeholder="연세병원"
          maxLength={10}
          className="body-s placeholder:text-text-disabled"
        />
        <View className="justify-center">
          <Text className="flex justify-center label-xxs">
            <Text className="text-text-primary">{organizationName.length}</Text>
            <Text className="text-text-disabled">/10</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default ScheduleNameInput
