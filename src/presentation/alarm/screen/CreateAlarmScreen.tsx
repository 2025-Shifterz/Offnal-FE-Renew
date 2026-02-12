import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlobalText from '../../../shared/components/text/GlobalText'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import { useNavigation } from '@react-navigation/native'

const CreateAlarmScreen = () => {
  const nav = useNavigation<rootNavigation>()
  return (
    <View className="flex-1 ">
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <GlobalText>자동 알람 생성 화면</GlobalText>
      </SafeAreaView>
    </View>
  )
}

export default CreateAlarmScreen
