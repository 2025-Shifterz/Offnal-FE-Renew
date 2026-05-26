import { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import WheelPickerColumn, {
  WHEEL_PICKER_ITEM_HEIGHT,
  WHEEL_PICKER_PICKER_HEIGHT,
} from '../../picker/WheelPickerColumn'
import GlobalText from '../../text/GlobalText'

type CalendarYearMonthPickerModalProps = {
  visible: boolean
  year: number
  month: number
  onCancel: () => void
  onConfirm: (year: number, month: number) => void
}

const CalendarYearMonthPickerModal = ({
  visible,
  year,
  month,
  onCancel,
  onConfirm,
}: CalendarYearMonthPickerModalProps) => {
  const [tempYear, setTempYear] = useState(year)
  const [tempMonth, setTempMonth] = useState(month)

  useEffect(() => {
    setTempYear(year)
    setTempMonth(month)
  }, [month, year, visible])

  const years = useMemo(
    () => Array.from({ length: 50 }, (_, index) => year - 10 + index),
    [year]
  )

  const yearIndex = Math.max(0, years.indexOf(tempYear))
  const monthIndex = Math.max(0, tempMonth - 1)

  const handleConfirm = () => {
    onConfirm(tempYear, tempMonth)
  }

  return (
    <Modal
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center px-[16px]">
        <Pressable
          className="absolute inset-0 bg-background-dim"
          onPress={onCancel}
          style={styles.backdrop}
        />

        <View
          className="w-[175px] overflow-hidden rounded-radius-xl bg-surface-gray-subtle1"
          style={styles.cardShadow}
          pointerEvents="auto"
        >
          <View className="px-[8px] pt-[4px]">
            <View
              className="relative overflow-hidden rounded-radius-l bg-surface-gray-subtle1"
              style={{ height: WHEEL_PICKER_PICKER_HEIGHT }}
            >
              <View
                className="absolute left-0 right-0 bg-surface-white"
                style={styles.centerBar}
              />
              <View pointerEvents="none" style={styles.fadeTop} />
              <View pointerEvents="none" style={styles.fadeBottom} />

              <View
                className="flex-row items-center justify-center"
                style={{ height: WHEEL_PICKER_PICKER_HEIGHT }}
              >
                <WheelPickerColumn
                  currentIndex={yearIndex}
                  data={years.map(item => `${item}년`)}
                  onIndexChange={nextIndex => {
                    setTempYear(years[nextIndex])
                  }}
                  textAlign="left"
                  width={95}
                />
                <WheelPickerColumn
                  currentIndex={monthIndex}
                  data={Array.from(
                    { length: 12 },
                    (_, index) => `${index + 1}월`
                  )}
                  onIndexChange={nextIndex => {
                    setTempMonth(nextIndex + 1)
                  }}
                  textAlign="right"
                  width={64}
                />
              </View>
            </View>
          </View>

          <View className="px-[8px] pb-[10px] pt-[4px]">
            <TouchableOpacity
              className="w-full items-center justify-center rounded-radius-m bg-surface-white px-[12px] py-[10px]"
              onPress={handleConfirm}
            >
              <GlobalText className="font-pretMedium text-text-basic body-xs">
                확인
              </GlobalText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CalendarYearMonthPickerModal

const styles = StyleSheet.create({
  backdrop: {
    zIndex: 0,
  },
  cardShadow: {
    elevation: 4,
    shadowColor: 'rgba(0, 0, 0, 0.04)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    zIndex: 1,
  },
  centerBar: {
    height: 48,
    top: (WHEEL_PICKER_PICKER_HEIGHT - 48) / 2,
  },
  fadeBottom: {
    backgroundColor: 'rgba(244, 245, 246, 0.68)',
    bottom: 0,
    height: WHEEL_PICKER_ITEM_HEIGHT * 2,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  fadeTop: {
    backgroundColor: 'rgba(244, 245, 246, 0.68)',
    height: WHEEL_PICKER_ITEM_HEIGHT * 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
})
