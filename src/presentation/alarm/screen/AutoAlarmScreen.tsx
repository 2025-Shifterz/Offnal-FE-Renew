import { useLayoutEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import EmptyAlarmPage from '../components/EmptyAlarmPage'
import FilledAlarmPage from '../components/FilledAlarmPage'
import AlarmPlus from '../../../assets/icons/alarm_plus_24.svg'
import SettingsIcon from '../../../assets/icons/alarm_three-dot_24.svg'
import { useNavigation } from '@react-navigation/native'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import StartAlignedTopAppBar from '../../../shared/components/appbar/StartAlignedTopAppBar'
import GlobalText from '../../../shared/components/GlobalText'

const AutoAlarmScreen = () => {
  const [showAlarmList, setShowAlarmList] = useState(true)
  const nav = useNavigation<rootNavigation>()

  useLayoutEffect(() => {
    nav.setOptions({
      header: () => (
        <StartAlignedTopAppBar
          title={
            <GlobalText className="font-pretSemiBold text-heading-xs">
              자동 알람
            </GlobalText>
          }
          rightActions={
            <View className="flex-row gap-[4px]">
              <TouchableOpacity
                onPress={() => {
                  nav.navigate('CreateAlarm')
                }}
              >
                <AlarmPlus />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <SettingsIcon />
              </TouchableOpacity>
            </View>
          }
          backgroundColor="bg-surface-gray-subtle1"
          applySafeArea={true}
        />
      ),
      headerShown: true,
      headerShadowVisible: false,
    })
  }, [nav])

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <View className="flex-1">
        {showAlarmList ? (
          <FilledAlarmPage />
        ) : (
          <EmptyAlarmPage
            handleShowAlarmList={() => nav.navigate('CreateAlarm')}
          />
        )}
      </View>
    </View>
  )
}

export default AutoAlarmScreen
