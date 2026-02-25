import { useLayoutEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import EmptyAlarmPage from '../components/EmptyAlarmPage'
import FilledAlarmPage from '../components/FilledAlarmPage'
import { SafeAreaView } from 'react-native-safe-area-context'
import PlusIcon from '../../../assets/icons/alarm_plus_24.svg'
import SettingsIcon from '../../../assets/icons/alarm_three-dot_24.svg'
import { useNavigation } from '@react-navigation/native'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import CenterAlignedTopAppBar from '../../../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../../../shared/components/button/TopAppBarBackButton'
import GlobalText from '../../../shared/components/GlobalText'

const AutoAlarmScreen = () => {
  const [showAlarmList, setShowAlarmList] = useState(false) // 알람 없음
  const nav = useNavigation<rootNavigation>()

  const handleShowAlarmList = () => {
    setShowAlarmList(!showAlarmList)
  }
  const navToCreateAlarmScreen = () => {
    nav.navigate('CreateAlarm')
  }

  useLayoutEffect(() => {
    nav.setOptions({
      header: () => (
        <CenterAlignedTopAppBar
          navigationIcon={<TopAppBarBackButton onPress={nav.goBack} />}
          title={
            <GlobalText className="font-pretSemiBold text-heading-xs">
              자동 알람
            </GlobalText>
          }
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
          applySafeArea={true}
        />
      ),
    })
  }, [nav, showAlarmList])

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1" edges={['bottom']}>
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
