import { useNavigation } from '@react-navigation/native'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import RightArrow from '../../../assets/icons/black-arrow-r.svg'
import AlarmIcon from '../../../assets/icons/ic_clock.svg'
import AlarmWheelTimePicker from '../components/AlarmWheelTimePicker'
import SnoozeBottomSheet, {
  SnoozeBottomSheetMethods,
  SnoozeSetting,
  getRepeatText,
} from '../components/SnoozeBottomSheet'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import CenterAlignedTopAppBar from '../../../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../../../shared/components/button/TopAppBarBackButton'
import GlobalText from '../../../shared/components/text/GlobalText'
import ToggleSwitch from '../../../shared/components/ToggleSwitch'
import EmphasizedButton from '../../../shared/components/button/Button'

const workTypes = ['주간', '오후', '야간', '휴일']
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

const CreateAlarmScreen = () => {
  const nav = useNavigation<rootNavigation>()
  const insets = useSafeAreaInsets()
  const snoozeBottomSheetRef = useRef<SnoozeBottomSheetMethods>(null)
  const isHeaderBackRequestedRef = useRef(false)
  const [selectedWorkType, setSelectedWorkType] = useState('휴일')
  const [selectedDays, setSelectedDays] = useState<string[]>(['목', '금', '토'])
  const [isHolidayAlarmOff, setIsHolidayAlarmOff] = useState(true)
  const [snoozeSheetIndex, setSnoozeSheetIndex] = useState(-1)
  const [snoozeSetting, setSnoozeSetting] = useState<SnoozeSetting>({
    enabled: true,
    interval: 10,
    repeat: 3,
  })
  const [alarmTime, setAlarmTime] = useState(() => {
    const initialTime = new Date()
    initialTime.setHours(9, 0, 0, 0)
    return initialTime
  })

  const toggleSelectedDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(item => item !== day) : [...prev, day]
    )
  }

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
              자동 알람 생성
            </GlobalText>
          }
          navigationIcon={
            <TopAppBarBackButton onPress={handleHeaderBackPress} />
          }
          rightActions={null}
          backgroundColor="bg-surface-gray-subtle1"
          applySafeArea={true}
        />
      ),
      headerShown: true,
      headerShadowVisible: false,
    })
  }, [nav, handleHeaderBackPress])

  const snoozeLabel = snoozeSetting.enabled
    ? `${snoozeSetting.interval}분, ${getRepeatText(snoozeSetting.repeat)}`
    : '사용 안 함'

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center px-[20px] pt-[6px]">
            <View className="w-full overflow-hidden rounded-radius-xl bg-surface-gray-subtle1 px-[8px] py-[8px]">
              <AlarmWheelTimePicker value={alarmTime} onChange={setAlarmTime} />
            </View>

            <View className="mt-[12px] w-full flex-row items-center rounded-radius-m border-[0.5px] border-surface-primary-light-3 bg-surface-primary-light px-[16px] py-[12px]">
              <AlarmIcon width={18} height={18} />
              <GlobalText className="ml-[8px] font-pretMedium text-text-primary body-s">
                23시간 41분 후에 울려요
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
                      onPress={() => setSelectedWorkType(type)}
                      className={`h-[37px] items-center justify-center rounded-radius-m px-[8px] ${
                        isSelected
                          ? 'border-[0.5px] border-border-primary bg-surface-primary-light'
                          : 'bg-surface-gray-subtle1'
                      }`}
                    >
                      <GlobalText
                        className={`font-pretSemiBold heading-xxxxs ${
                          isSelected
                            ? 'text-text-primary'
                            : 'text-text-disabled'
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
                      onPress={() => toggleSelectedDay(day)}
                      className={`h-[37px] flex-1 items-center justify-center rounded-radius-m ${
                        isSelected
                          ? 'border-[0.5px] border-border-primary bg-surface-primary-light'
                          : 'bg-surface-gray-subtle1'
                      }`}
                    >
                      <GlobalText
                        className={`font-pretSemiBold heading-xxxxs ${
                          isSelected
                            ? 'text-text-primary'
                            : 'text-text-disabled'
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
                    알람 조건
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
        </ScrollView>

        <View
          className="px-[20px]"
          style={{ paddingBottom: insets.bottom + 13 }}
        >
          <EmphasizedButton
            onPress={() => nav.goBack()}
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
          onChange={setSnoozeSheetIndex}
          value={snoozeSetting}
        />
      </View>
    </View>
  )
}

export default CreateAlarmScreen
