import { useEffect, useLayoutEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import EmptyAlarmPage from '../components/EmptyAlarmPage'
import FilledAlarmPage from '../components/FilledAlarmPage'
import AlarmEditDropdown from '../components/AlarmEditDropdown'
import AlarmPlus from '../../../assets/icons/alarm_plus_24.svg'
import SettingsIcon from '../../../assets/icons/alarm_three-dot_24.svg'
import { Portal } from '@gorhom/portal'
import { useNavigation } from '@react-navigation/native'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import StartAlignedTopAppBar from '../../../shared/components/appbar/StartAlignedTopAppBar'
import GlobalText from '../../../shared/components/GlobalText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AutoAlarmScreen = () => {
  const [showAlarmList] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showEditMenu, setShowEditMenu] = useState(false)

  const nav = useNavigation<rootNavigation>()
  const insets = useSafeAreaInsets()
  const bottomOffset = 65 + insets.bottom

  useEffect(() => {
    const navListener = nav.addListener('blur', () => {
      setIsEditing(false)
      setShowEditMenu(false)
    })

    return navListener
  }, [nav])

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
            isEditing ? (
              <TouchableOpacity
                className="items-center justify-center px-[12px] py-[10px]"
                onPress={() => {
                  setIsEditing(false)
                  setShowEditMenu(false)
                }}
              >
                <GlobalText className="font-pretMedium text-text-basic body-xs">
                  취소
                </GlobalText>
              </TouchableOpacity>
            ) : (
              <View className="flex-row gap-[4px]">
                <TouchableOpacity
                  className="items-center justify-center p-[6px]"
                  onPress={() => {
                    setShowEditMenu(false)
                    nav.navigate('CreateAlarm')
                  }}
                >
                  <AlarmPlus />
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center justify-center p-[6px]"
                  onPress={() => setShowEditMenu(current => !current)}
                >
                  <SettingsIcon />
                </TouchableOpacity>
              </View>
            )
          }
          backgroundColor="bg-surface-gray-subtle1"
          applySafeArea={true}
        />
      ),
      headerShown: true,
      headerShadowVisible: false,
    })
  }, [nav, isEditing])

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <View className="flex-1">
        {showAlarmList ? (
          <FilledAlarmPage
            bottomOffset={bottomOffset}
            isEditing={isEditing}
            onPressItem={item => {
              if (isEditing) {
                return
              }
              setShowEditMenu(false)
              nav.navigate('EditAutoAlarm', { alarmId: item.id })
            }}
          />
        ) : (
          <EmptyAlarmPage
            handleShowAlarmList={() => nav.navigate('CreateAlarm')}
          />
        )}
      </View>

      <Portal>
        <AlarmEditDropdown
          visible={showEditMenu}
          onClose={() => setShowEditMenu(false)}
          onEditPress={() => {
            setShowEditMenu(false)
            setIsEditing(true)
          }}
        />
      </Portal>
    </View>
  )
}

export default AutoAlarmScreen
