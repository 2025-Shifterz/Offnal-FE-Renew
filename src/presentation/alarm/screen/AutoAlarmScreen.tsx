import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
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
import GlobalText from '../../../shared/components/text/GlobalText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAutoAlarmStore } from '../../../store/useAutoAlarmStore'
import { toAlarmListItemArray } from '../mappers/alarmListItemMapper'
import { useCurrentTimeTick } from '../../../shared/hooks/useCurrentTimeTick'

const AutoAlarmScreen = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [showEditMenu, setShowEditMenu] = useState(false)

  const nav = useNavigation<rootNavigation>()
  const insets = useSafeAreaInsets()
  const bottomOffset = 65 + insets.bottom

  const autoAlarms = useAutoAlarmStore(state => state.autoAlarms)
  const fetchAllAutoAlarms = useAutoAlarmStore(
    state => state.fetchAllAutoAlarms
  )
  const toggleAutoAlarm = useAutoAlarmStore(state => state.toggleAutoAlarm)
  const deleteAutoAlarms = useAutoAlarmStore(state => state.deleteAutoAlarms)
  const setAutoAlarmsEnabled = useAutoAlarmStore(
    state => state.setAutoAlarmsEnabled
  )
  const currentTimeMillis = useCurrentTimeTick()

  const alarmListItems = useMemo(
    () => toAlarmListItemArray(autoAlarms, currentTimeMillis),
    [autoAlarms, currentTimeMillis]
  )

  useEffect(() => {
    fetchAllAutoAlarms().catch(error => {
      console.error('Failed to load auto alarms:', error)
    })
  }, [fetchAllAutoAlarms])

  useEffect(() => {
    const navListener = nav.addListener('blur', () => {
      setIsEditing(false)
      setShowEditMenu(false)
    })

    return navListener
  }, [nav])

  const handleDeleteSelectedItems = useCallback(
    async (ids: string[]) => {
      const alarmIds = ids
        .map(id => Number(id))
        .filter((alarmId): alarmId is number => !Number.isNaN(alarmId))

      await deleteAutoAlarms(alarmIds)
    },
    [deleteAutoAlarms]
  )

  const handleToggleAlarmItem = useCallback(
    async (id: string, nextValue: boolean) => {
      const alarmId = Number(id)
      if (Number.isNaN(alarmId)) {
        return
      }

      await toggleAutoAlarm(alarmId, nextValue)
    },
    [toggleAutoAlarm]
  )

  const handlePressEnableAll = useCallback(async () => {
    const disabledAlarmIds = alarmListItems
      .filter(item => !item.enabled)
      .map(item => Number(item.id))
      .filter((alarmId): alarmId is number => !Number.isNaN(alarmId))

    await setAutoAlarmsEnabled(disabledAlarmIds, true)
  }, [alarmListItems, setAutoAlarmsEnabled])

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
        {alarmListItems.length === 0 ? (
          <EmptyAlarmPage
            handleShowAlarmList={() => nav.navigate('CreateAlarm')}
          />
        ) : (
          <FilledAlarmPage
            initialItems={alarmListItems}
            bottomOffset={bottomOffset}
            isEditing={isEditing}
            onDeleteSelectedItems={handleDeleteSelectedItems}
            onToggleItem={handleToggleAlarmItem}
            onPressEnableAll={handlePressEnableAll}
            onPressItem={item => {
              if (isEditing) {
                return
              }
              setShowEditMenu(false)
              nav.navigate('EditAutoAlarm', { alarmId: item.id })
            }}
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
