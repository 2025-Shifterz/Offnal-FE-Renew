import React from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/appbar/TopAppBar'
import GlobalText from '../../../shared/components/GlobalText'
import { rootNavigation } from '../../../navigation/types'
import { useNavigation } from '@react-navigation/native'

const CreateAlarmScreen = () => {
  const nav = useNavigation<rootNavigation>()
  return (
    <View className="flex-1 ">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="자동 알람 생성"
          showBackButton={true}
          onPressBackButton={() => nav.goBack()}
        />
        <GlobalText>자동 알람 생성 화면</GlobalText>
      </SafeAreaView>
    </View>
  )
}

export default CreateAlarmScreen
