import { use, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import EmptyAlarmPage from '../components/EmptyAlarmPage'
import FilledAlarmPage from '../components/FilledAlarmPage'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/TopAppBar'
import PlusIcon from '../../../assets/icons/alarm_plus_24.svg'
import SettingsIcon from '../../../assets/icons/alarm_three-dot_24.svg'
import { useNavigation } from '@react-navigation/native'
import { autoAlarmNavigation } from '../../../navigation/types'

const AutoAlarmScreen = () => {
  const [showAlarmList, setShowAlarmList] = useState(false) // 알람 없음
  const nav = useNavigation<autoAlarmNavigation>()

  const handleShowAlarmList = () => {
    setShowAlarmList(!showAlarmList)
  }
  const navToCreateAlarmScreen = () => {
    nav.navigate('CreateAlarm')
  }

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="자동 알람"
          showBackButton={true}
          onPressBackButton={() => nav.goBack()}
          rightActions={
            showAlarmList && (
              <View className="w-[64px] flex-row items-center justify-between">
                <TouchableOpacity>
                  <PlusIcon onPress={navToCreateAlarmScreen} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <SettingsIcon />
                </TouchableOpacity>
              </View>
            )
          }
        />
        <View className="flex-1">
          {!showAlarmList ? (
            <EmptyAlarmPage handleShowAlarmList={handleShowAlarmList} />
          ) : (
            <FilledAlarmPage />
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}

export default AutoAlarmScreen
