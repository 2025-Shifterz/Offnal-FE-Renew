import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { View } from 'react-native'
import RoutineCompleteCharacter from '../../../assets/icons/ic_routine_complete_character.svg'
import EmphasizedButton from '../../../shared/components/button/Button'
import GlobalText from '../../../shared/components/text/GlobalText'
import { GoalState, GoalStatusIcon } from '../../main/components/GoalStatusCard'

export interface DailyRoutineCompletionBottomSheetMethods {
  open: () => void
  close: () => void
}

interface DailyRoutineCompletionBottomSheetProps {
  onChange?: (index: number) => void
}

const WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일']

const PLACEHOLDER_GOAL_STATES: GoalState[] = [
  'done',
  'missed',
  'streak',
  'streak',
  'streak',
  'missed',
  'done',
]

const BottomSheetHandle = () => null

const DailyRoutineCompletionBottomSheet = forwardRef<
  DailyRoutineCompletionBottomSheetMethods,
  DailyRoutineCompletionBottomSheetProps
>(({ onChange }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['44%'], [])

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.75}
        pressBehavior="close"
      />
    ),
    []
  )

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand()
    },
    close: () => {
      bottomSheetRef.current?.close()
    },
  }))

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onChange={onChange}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      handleComponent={BottomSheetHandle}
      backgroundStyle={{
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      <BottomSheetView className="items-center px-[20px] pb-[16px] pt-[36px]">
        <View className="w-full items-center gap-[16px]">
          <View className="w-full gap-[12px] pb-[16px]">
            <View className="w-full flex-row items-center justify-center gap-[8px] overflow-hidden px-[10px] py-[20px]">
              <RoutineCompleteCharacter width={69} height={68} />

              <View className="rounded-radius-xl bg-surface-primary-light px-[12px] py-[12px]">
                <GlobalText className="font-pretMedium text-body-xs text-text-disabled-on">
                  기세가 엄청나요!
                </GlobalText>
              </View>
            </View>

            <View className="border-t border-dashed border-border-gray-light" />

            <View className="flex-row items-center justify-center">
              <GlobalText className="font-pretSemiBold text-heading-xxs text-text-primary">
                23
              </GlobalText>
              <GlobalText className="font-pretMedium text-body-s text-text-subtle">
                일째 꾸준하게 생활패턴을 유지하셨어요!
              </GlobalText>
            </View>
          </View>

          <View className="w-full gap-[8px] rounded-radius-l px-[24px] py-[12px]">
            <View className="flex-row justify-between">
              {WEEK_LABELS.map(label => (
                <View key={label} className="w-[32px] items-center">
                  <GlobalText className="font-pretSemiBold text-heading-xxxxs text-text-disabled-on">
                    {label}
                  </GlobalText>
                </View>
              ))}
            </View>

            <View className="h-[43px] flex-row items-end justify-between">
              {PLACEHOLDER_GOAL_STATES.map((state, index) => (
                <GoalStatusIcon key={`${state}-${index}`} state={state} />
              ))}
            </View>
          </View>

          <EmphasizedButton
            onPress={() => bottomSheetRef.current?.close()}
            content={
              <GlobalText className="font-pretMedium text-body-m text-text-bolder-inverse">
                이전으로
              </GlobalText>
            }
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
})

export default DailyRoutineCompletionBottomSheet
