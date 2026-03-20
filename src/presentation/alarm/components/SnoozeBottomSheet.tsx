import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import AlarmIcon from '../../../assets/icons/ic_clock.svg'
import BottomSheetWrapper from '../../../shared/components/sheet/BottomSheetWrapper'
import GlobalText from '../../../shared/components/text/GlobalText'
import ToggleSwitch from '../../../shared/components/ToggleSwitch'
import EmphasizedButton, {
  UnEmphasizedButton,
} from '../../../shared/components/button/Button'

const intervalOptions = [1, 3, 5, 10, 15] as const
const repeatOptions = [1, 3, 5, 10, 'infinite'] as const

export type RepeatCount = (typeof repeatOptions)[number]

export interface SnoozeSetting {
  enabled: boolean
  interval: (typeof intervalOptions)[number]
  repeat: RepeatCount
}

export interface SnoozeBottomSheetMethods {
  close: () => void
  open: () => void
}

interface SnoozeBottomSheetProps {
  onApply: (nextValue: SnoozeSetting) => void
  value: SnoozeSetting
  onChange?: (index: number) => void
  bottomInset?: number
}

const getRepeatText = (repeat: RepeatCount) => {
  if (repeat === 'infinite') {
    return '무한'
  }
  return `${repeat}회`
}

const getSummaryText = (value: SnoozeSetting) => {
  if (!value.enabled) {
    return '알람 미루기가 꺼져 있어요'
  }
  return `${value.interval}분 간격으로 ${getRepeatText(value.repeat)} 울려요`
}

const chipBaseClass =
  'h-[36px] rounded-radius-max border-[0.5px] px-[14px] items-center justify-center'

const SnoozeBottomSheet = forwardRef<
  SnoozeBottomSheetMethods,
  SnoozeBottomSheetProps
>(({ onApply, value, onChange, bottomInset }, ref) => {
  const internalRef = useRef<BottomSheet>(null)
  const [draft, setDraft] = useState<SnoozeSetting>(value)

  useImperativeHandle(ref, () => ({
    close: () => internalRef.current?.close(),
    open: () => {
      setDraft(value)
      internalRef.current?.expand()
    },
  }))

  const summaryText = useMemo(() => getSummaryText(draft), [draft])

  const onPressCancel = () => {
    setDraft(value)
    internalRef.current?.close()
  }

  const onPressComplete = () => {
    onApply(draft)
    internalRef.current?.close()
  }

  return (
    <BottomSheetWrapper
      backdropOpacity={0.32}
      enableBackdrop={true}
      bottomInset={bottomInset}
      onChange={onChange}
      ref={internalRef}
      handleStyle={styles.hiddenHandle as ViewStyle}
    >
      <BottomSheetView className="flex-col gap-[40px] rounded-t-radius-xl bg-surface-white px-[20px] pb-[16px] pt-[4px]">
        <View className="flex-col gap-[4px]">
          <View className="mt-[4px] flex-row items-center justify-between">
            <GlobalText className="font-pretSemiBold text-text-basic heading-xs">
              알람 미루기
            </GlobalText>
            <ToggleSwitch
              onValueChange={nextValue =>
                setDraft(previous => ({ ...previous, enabled: nextValue }))
              }
              value={draft.enabled}
            />
          </View>

          <View className="mt-[20px] flex-col gap-[20px]">
            <View className="flex-col gap-[11px]">
              <GlobalText className="font-pretSemiBold text-text-subtle heading-xxs">
                간격
              </GlobalText>
              <View className="flex-row gap-[4px]">
                {intervalOptions.map(option => {
                  const selected = draft.interval === option
                  return (
                    <TouchableOpacity
                      key={option}
                      className={`${chipBaseClass} ${
                        selected
                          ? 'border-border-primary bg-surface-primary-light'
                          : 'border-border-gray-light bg-surface-white'
                      } ${draft.enabled ? '' : 'opacity-50'}`}
                      disabled={!draft.enabled}
                      onPress={() =>
                        setDraft(previous => ({
                          ...previous,
                          interval: option,
                        }))
                      }
                    >
                      <GlobalText
                        className={`label-xs ${selected ? 'text-text-primary' : 'text-text-disabled'}`}
                      >
                        {option}분
                      </GlobalText>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View className="flex-col gap-[6px]">
              <GlobalText className="font-pretSemiBold text-text-subtle heading-xxs">
                횟수
              </GlobalText>
              <View className="flex-row gap-[4px]">
                {repeatOptions.map(option => {
                  const selected = draft.repeat === option
                  return (
                    <TouchableOpacity
                      key={option}
                      className={`${chipBaseClass} ${
                        selected
                          ? 'border-border-primary bg-surface-primary-light'
                          : 'border-border-gray-light bg-surface-white'
                      } ${draft.enabled ? '' : 'opacity-50'}`}
                      disabled={!draft.enabled}
                      onPress={() =>
                        setDraft(previous => ({ ...previous, repeat: option }))
                      }
                    >
                      <GlobalText
                        className={`label-xs ${selected ? 'text-text-primary' : 'text-text-disabled'}`}
                      >
                        {getRepeatText(option)}
                      </GlobalText>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>
        </View>

        <View className="flex-col gap-[16px]">
          <View className="w-full flex-row items-center rounded-radius-m border-[0.5px] border-surface-primary-light-3 bg-surface-primary-light px-[16px] py-[12px]">
            <AlarmIcon width={18} height={18} />
            <GlobalText className="ml-[8px] font-pretMedium text-text-primary body-s">
              {summaryText}
            </GlobalText>
          </View>

          <View className="flex-row gap-[10px]">
            <UnEmphasizedButton
              onPress={onPressCancel}
              content={
                <GlobalText className="font-pretMedium text-text-basic body-m">
                  취소
                </GlobalText>
              }
              className="flex w-[72px]"
            />
            <EmphasizedButton
              onPress={onPressComplete}
              content={
                <GlobalText className="font-pretMedium text-text-bolder-inverse body-m">
                  완료
                </GlobalText>
              }
              className="w-full flex-1"
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetWrapper>
  )
})

export default SnoozeBottomSheet

export { getSummaryText, getRepeatText }

const styles = StyleSheet.create({
  hiddenHandle: {
    backgroundColor: 'transparent',
    height: 0,
  },
})
