import { useNavigation, useRoute } from '@react-navigation/native'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import RightArrow from '../../../assets/icons/black-arrow-r.svg'
import AlarmIcon from '../../../assets/icons/ic_clock.svg'
import TrashIcon from '../../../assets/icons/alarm_trash_24.svg'
import {
  RootStackParamList,
  rootNavigation,
} from '../../../navigation/types/StackTypes'
import GlobalText from '../../../shared/components/text/GlobalText'
import CenterAlignedTopAppBar from '../../../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../../../shared/components/button/TopAppBarBackButton'
import ToggleSwitch from '../../../shared/components/ToggleSwitch'
import AlarmWheelTimePicker from '../components/AlarmWheelTimePicker'
import SnoozeBottomSheet, {
  SnoozeBottomSheetMethods,
  SnoozeSetting,
  getRepeatText,
} from '../components/SnoozeBottomSheet'
import ConfirmDialog from '../../../shared/components/dialog/ConfirmDialog'
import EmphasizedButton from '../../../shared/components/button/Button'
import { RouteProp } from '@react-navigation/native'
import { WorkType } from '../../../domain/models/Calendar'
import {
  AlarmWeekdayLabel,
  AlarmSnoozeIntervalMinutes,
  AlarmSnoozeRepeatCount,
  UpdateAutoAlarmDraft,
} from '../types/alarmDraft'
import { useAutoAlarmStore } from '../../../store/useAutoAlarmStore'
import { useAutoAlarmNextTriggerPreview } from '../hooks/useAutoAlarmNextTriggerPreview'

const workTypes: WorkType[] = ['주간', '오후', '야간', '휴일']
const weekDays: AlarmWeekdayLabel[] = ['일', '월', '화', '수', '목', '금', '토']

const normalizeSnoozeIntervalMinutes = (
  value: number
): AlarmSnoozeIntervalMinutes => {
  if (
    value === 1 ||
    value === 3 ||
    value === 5 ||
    value === 10 ||
    value === 15
  ) {
    return value
  }

  return 10
}

const normalizeSnoozeRepeatCount = (value: number): AlarmSnoozeRepeatCount => {
  if (value === 1 || value === 3 || value === 5 || value === 10) {
    return value
  }

  return 'infinite'
}

const EditAutoAlarmScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'EditAutoAlarm'>>()
  const nav = useNavigation<rootNavigation>()
  const insets = useSafeAreaInsets()
  const fetchAllAutoAlarms = useAutoAlarmStore(
    state => state.fetchAllAutoAlarms
  )
  const updateAutoAlarm = useAutoAlarmStore(state => state.updateAutoAlarm)
  const deleteAutoAlarm = useAutoAlarmStore(state => state.deleteAutoAlarm)
  const alarmId = Number(route.params.alarmId)
  const storedAutoAlarm = useAutoAlarmStore(
    state => state.autoAlarms.find(alarm => alarm.id === alarmId) ?? null
  )
  const snoozeBottomSheetRef = useRef<SnoozeBottomSheetMethods>(null)
  const isHeaderBackRequestedRef = useRef(false)
  const hasHydratedDraftRef = useRef(false)
  const [selectedWorkType, setSelectedWorkType] = useState<WorkType>('휴일')
  const [selectedDays, setSelectedDays] = useState<AlarmWeekdayLabel[]>([
    '목',
    '금',
    '토',
  ])
  const [isHolidayAlarmOff, setIsHolidayAlarmOff] = useState(true)
  const [snoozeSetting, setSnoozeSetting] = useState<SnoozeSetting>({
    enabled: false,
    intervalMinutes: 5,
    repeatCount: 5,
  })
  const [snoozeSheetIndex, setSnoozeSheetIndex] = useState(-1)
  const [alarmTime, setAlarmTime] = useState(() => {
    const initialTime = new Date()
    initialTime.setHours(9, 0, 0, 0)
    return initialTime
  })
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDraftHydrated, setIsDraftHydrated] = useState(false)

  const { previewText } = useAutoAlarmNextTriggerPreview({
    alarmTime,
    selectedDays,
    selectedWorkType,
    isHolidayAlarmOff,
    isReady: isDraftHydrated,
  })

  const handleHeaderBackPress = useCallback(() => {
    isHeaderBackRequestedRef.current = true
    nav.goBack()
  }, [nav])

  useLayoutEffect(() => {
    nav.setOptions({
      header: () => (
        <CenterAlignedTopAppBar
          title={
            <GlobalText className="font-pretSemiBold text-heading-xs">
              자동 알람 수정
            </GlobalText>
          }
          navigationIcon={
            <TopAppBarBackButton onPress={handleHeaderBackPress} />
          }
          rightActions={
            <TouchableOpacity
              className="items-center justify-center p-[2px]"
              onPress={() => {
                if (snoozeSheetIndex >= 0) {
                  snoozeBottomSheetRef.current?.close()
                }

                setIsDeleteDialogVisible(true)
              }}
            >
              <TrashIcon width={24} height={24} />
            </TouchableOpacity>
          }
          backgroundColor="bg-surface-gray-subtle1"
          applySafeArea={true}
        />
      ),
      headerShown: true,
      headerShadowVisible: false,
    })
  }, [nav, handleHeaderBackPress, snoozeSheetIndex])

  useEffect(() => {
    const listener = nav.addListener('beforeRemove', e => {
      if (isHeaderBackRequestedRef.current) {
        isHeaderBackRequestedRef.current = false
        return
      }

      if (!(snoozeSheetIndex >= 0)) return

      e.preventDefault()
      snoozeBottomSheetRef.current?.close()
    })

    return listener
  }, [nav, snoozeSheetIndex])

  useEffect(() => {
    fetchAllAutoAlarms().catch(error => {
      console.error('Failed to load auto alarms:', error)
    })
  }, [fetchAllAutoAlarms])

  useEffect(() => {
    if (!storedAutoAlarm || hasHydratedDraftRef.current) {
      return
    }

    const nextAlarmTime = new Date()
    nextAlarmTime.setHours(
      storedAutoAlarm.time.hour,
      storedAutoAlarm.time.minute,
      0,
      0
    )

    setSelectedWorkType(storedAutoAlarm.workTypeTitle)
    setSelectedDays(
      storedAutoAlarm.weekdays
        .map(weekday => weekDays[weekday])
        .filter((weekday): weekday is AlarmWeekdayLabel => Boolean(weekday))
    )
    setIsHolidayAlarmOff(storedAutoAlarm.isHolidayDisabled)
    setSnoozeSetting({
      enabled: storedAutoAlarm.snooze.enabled,
      intervalMinutes: normalizeSnoozeIntervalMinutes(
        storedAutoAlarm.snooze.intervalMinutes
      ),
      repeatCount: normalizeSnoozeRepeatCount(
        storedAutoAlarm.snooze.repeatCount
      ),
    })
    setAlarmTime(nextAlarmTime)
    setIsEnabled(storedAutoAlarm.isEnabled)
    setIsDraftHydrated(true)
    hasHydratedDraftRef.current = true
  }, [storedAutoAlarm])

  const toggleSelectedDay = (day: AlarmWeekdayLabel) => {
    setSelectedDays(previous =>
      previous.includes(day)
        ? previous.filter(item => item !== day)
        : [...previous, day]
    )
  }

  const handleSavePress = async () => {
    if (isSaving) {
      return
    }

    if (Number.isNaN(alarmId)) {
      console.error('Invalid auto alarm id.')
      return
    }

    setIsSaving(true)

    const draft: UpdateAutoAlarmDraft = {
      id: alarmId,
      alarmTime,
      selectedWorkType,
      selectedDays,
      isHolidayAlarmOff,
      snoozeSetting,
      isEnabled,
    }

    try {
      await updateAutoAlarm(draft)
      nav.goBack()
    } catch (error) {
      console.error('Failed to update auto alarm:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (Number.isNaN(alarmId)) {
      console.error('Invalid auto alarm id.')
      return
    }

    try {
      await deleteAutoAlarm(alarmId)
      setIsDeleteDialogVisible(false)
      nav.goBack()
    } catch (error) {
      console.error('Failed to delete auto alarm:', error)
    }
  }

  const snoozeLabel = snoozeSetting.enabled
    ? `${snoozeSetting.intervalMinutes}분, ${getRepeatText(snoozeSetting.repeatCount)}`
    : '사용 안 함'

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <View className="flex-1 px-[20px]">
        <View className="w-full overflow-hidden rounded-radius-xl bg-surface-gray-subtle1 px-[8px] py-[8px]">
          <AlarmWheelTimePicker value={alarmTime} onChange={setAlarmTime} />
        </View>

        <View className="mt-[12px] w-full flex-row items-center rounded-radius-m border-[0.5px] border-surface-primary-light-3 bg-surface-primary-light px-[16px] py-[12px]">
          <AlarmIcon width={18} height={18} />
          <GlobalText className="ml-[8px] font-pretMedium text-text-primary body-s">
            {previewText}
          </GlobalText>
        </View>

        <View className="mt-[14px] w-full rounded-radius-xl bg-surface-white p-[16px]">
          <GlobalText className="font-pretSemiBold text-text-basic heading-xxxs">
            근무 형태 선택
          </GlobalText>

          <View className="mt-[12px] flex-row gap-[6px]">
            {workTypes.map(type => {
              const isSelected = selectedWorkType === type
              return (
                <TouchableOpacity
                  key={type}
                  className={`h-[37px] items-center justify-center rounded-radius-m px-[8px] ${
                    isSelected
                      ? 'border-[0.5px] border-border-primary bg-surface-primary-light'
                      : 'bg-surface-gray-subtle1'
                  }`}
                  onPress={() => setSelectedWorkType(type)}
                >
                  <GlobalText
                    className={`font-pretSemiBold heading-xxxxs ${
                      isSelected ? 'text-text-primary' : 'text-text-disabled'
                    }`}
                  >
                    {type}
                  </GlobalText>
                </TouchableOpacity>
              )
            })}
          </View>

          <View className="my-[16px] h-[0.5px] w-full bg-divider-gray-light" />

          <GlobalText className="font-pretSemiBold text-text-basic heading-xxxs">
            요일 선택
          </GlobalText>

          <View className="mt-[8px] flex-row gap-[6px]">
            {weekDays.map(day => {
              const isSelected = selectedDays.includes(day)
              return (
                <TouchableOpacity
                  key={day}
                  className={`h-[37px] flex-1 items-center justify-center rounded-radius-m ${
                    isSelected
                      ? 'border-[0.5px] border-border-primary bg-surface-primary-light'
                      : 'bg-surface-gray-subtle1'
                  }`}
                  onPress={() => toggleSelectedDay(day)}
                >
                  <GlobalText
                    className={`font-pretSemiBold heading-xxxxs ${
                      isSelected ? 'text-text-primary' : 'text-text-disabled'
                    }`}
                  >
                    {day}
                  </GlobalText>
                </TouchableOpacity>
              )
            })}
          </View>

          <View className="mt-[20px]">
            <View className="flex-row items-center justify-between">
              <GlobalText className="font-pretMedium text-text-subtle body-xs">
                알림 조건
              </GlobalText>
              <GlobalText className="font-pretSemiBold text-text-subtle label-xxs">
                근무 이면서 요일
              </GlobalText>
            </View>

            <View className="mt-[10px] flex-row items-center justify-between">
              <GlobalText className="font-pretMedium text-text-subtle body-xs">
                공휴일 알람 끄기
              </GlobalText>
              <ToggleSwitch
                onValueChange={setIsHolidayAlarmOff}
                value={isHolidayAlarmOff}
              />
            </View>
          </View>

          <View className="my-[16px] h-[0.5px] w-full bg-divider-gray-light" />

          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => snoozeBottomSheetRef.current?.open()}
          >
            <GlobalText className="font-pretSemiBold text-text-basic heading-xxs">
              알람 미루기
            </GlobalText>
            <View className="flex-row items-center">
              <GlobalText className="font-pretMedium text-text-subtle body-xs">
                {snoozeLabel}
              </GlobalText>
              <View className="ml-[6px]">
                <RightArrow width={16} height={16} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-[20px]" style={{ paddingBottom: insets.bottom + 13 }}>
        <EmphasizedButton
          onPress={() => {
            handleSavePress()
          }}
          disabled={isSaving}
          content={
            <GlobalText className="font-pretMedium text-text-bolder-inverse body-m">
              저장하기
            </GlobalText>
          }
        />
      </View>

      <SnoozeBottomSheet
        ref={snoozeBottomSheetRef}
        bottomInset={insets.bottom}
        onApply={setSnoozeSetting}
        value={snoozeSetting}
        onChange={setSnoozeSheetIndex}
      />

      <ConfirmDialog
        cancelText="취소"
        confirmText="삭제"
        description="삭제된 자동알람은 복구되지 않아요."
        onCancel={() => setIsDeleteDialogVisible(false)}
        onConfirm={() => {
          handleDeleteConfirm()
        }}
        title="자동 알람 삭제"
        visible={isDeleteDialogVisible}
      />
    </View>
  )
}

export default EditAutoAlarmScreen
