import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import GlobalText from '../../../../shared/components/GlobalText'
import { TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs'
import { useCalendarStore } from '../../../../store/useCalendarStore'
import CalendarBasic from './Calendar'
import CalendarSelectorHeader from '../../../../shared/components/calendar/header/CalendarSelectorHeader'

export interface ChangeTodoDateBottomSheetProps {
  date: dayjs.Dayjs
  onChangeDate: (changedDate: dayjs.Dayjs) => void
}

export interface ChangeTodoDateBottomSheetMethods {
  open: () => void
  close: () => void
}

const BottomSheetCustomHandle = () => {
  return (
    <View className="w-full items-center p-4">
      <View className="h-1.5 w-16 rounded-full bg-gray-300" />
    </View>
  )
}

const ChangeTodoDateBottomSheet = forwardRef<
  ChangeTodoDateBottomSheetMethods,
  ChangeTodoDateBottomSheetProps
>(({ date, onChangeDate }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [calendarMonth, setCalendarMonth] = useState(dayjs()) // Renamed currentDate to calendarMonth for clarity
  const calendarData = useCalendarStore(state => state.calendarData)
  const selectedDate = useCalendarStore(state => state.selectedDate)
  const setSelectedDate = useCalendarStore(state => state.setSelectedDate)

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand()
      setCalendarMonth(date)
    },
    close: () => {
      bottomSheetRef.current?.close()
    },
  }))

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      handleComponent={BottomSheetCustomHandle}
      backgroundStyle={{
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      <BottomSheetView className="flex-1 items-center px-[20px] pb-[16px] pt-[8px]">
        <GlobalText className="text-heading-xs">날짜 바꾸기</GlobalText>
        <View className="flex-col">
          <View className="my-[8px] h-[1px] rounded-[1px] border-t border-dashed border-border-gray-light" />
          <View className="mb-[8px]">
            <CalendarSelectorHeader
              currentDate={calendarMonth}
              onPrevMonth={() => {
                setCalendarMonth(calendarMonth.subtract(1, 'month'))
              }}
              onNextMonth={() => {
                setCalendarMonth(calendarMonth.add(1, 'month'))
              }}
            />

            <CalendarBasic
              selectedDate={selectedDate}
              calendarData={calendarData}
              currentDate={calendarMonth}
              onDatePress={setSelectedDate}
            />
          </View>
        </View>
        <TouchableOpacity
          className="w-full flex-1 items-center rounded-radius-xl bg-surface-inverse py-[13px]"
          onPress={() => {
            if (!selectedDate) return

            onChangeDate(selectedDate)
            bottomSheetRef.current?.close()
          }}
        >
          <GlobalText className="text-text-bolder-inverse body-m">
            확인
          </GlobalText>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  )
})

export default ChangeTodoDateBottomSheet
