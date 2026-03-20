import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import BottomSheetWrapper from '../../../shared/components/sheet/BottomSheetWrapper'
import GlobalText from '../../../shared/components/text/GlobalText'
import RadioButton from '../../../shared/components/RadioButton'
import EmphasizedButton, {
  UnEmphasizedButton,
} from '../../../shared/components/button/Button'

export type AlarmSortOption = 'remaining' | 'shift'

export interface SortBottomSheetMethods {
  close: () => void
  open: () => void
}

interface SortBottomSheetProps {
  onApply: (nextValue: AlarmSortOption) => void
  value: AlarmSortOption
  bottomInset?: number
}

const SortBottomSheet = forwardRef<
  SortBottomSheetMethods,
  SortBottomSheetProps
>(({ onApply, value, bottomInset }, ref) => {
  const internalRef = useRef<BottomSheet>(null)
  const [draft, setDraft] = useState<AlarmSortOption>(value)

  useImperativeHandle(ref, () => ({
    close: () => internalRef.current?.close(),
    open: () => {
      setDraft(value)
      internalRef.current?.expand()
    },
  }))

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
      ref={internalRef}
      handleStyle={styles.hiddenHandle as ViewStyle}
    >
      <BottomSheetView className="flex-col gap-[24px] rounded-t-radius-xl bg-surface-white px-[20px] pb-[16px] pt-[4px]">
        <View className="flex-col gap-[12px]">
          <View className="flex-col gap-[24px]">
            <GlobalText className="font-pretSemiBold text-text-basic heading-xs">
              정렬
            </GlobalText>
            <View className="flex-col gap-[16px]">
              <TouchableOpacity
                className="flex-row items-center gap-[8px]"
                onPress={() => setDraft('remaining')}
              >
                <RadioButton selected={draft === 'remaining'} />
                <GlobalText className="font-pretMedium text-text-subtle body-s">
                  남은 시간 순
                </GlobalText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-[8px]"
                onPress={() => setDraft('shift')}
              >
                <RadioButton selected={draft === 'shift'} />
                <GlobalText className="font-pretMedium text-text-subtle body-s">
                  근무 타입 순
                </GlobalText>
              </TouchableOpacity>
            </View>
          </View>
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
      </BottomSheetView>
    </BottomSheetWrapper>
  )
})

export default SortBottomSheet

const styles = StyleSheet.create({
  hiddenHandle: {
    backgroundColor: 'transparent',
    height: 0,
  },
})
