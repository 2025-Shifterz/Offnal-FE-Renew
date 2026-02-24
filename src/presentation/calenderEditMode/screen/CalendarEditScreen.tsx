import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs'
import EditScreenHeader from '../components/EditScreenMonthHeader'
import EditBottomSheet from '../components/EditBottomSheet'
import SuccessIcon from '../../../assets/icons/g-success.svg'
import BottomSheet from '@gorhom/bottom-sheet'
import { SafeAreaView } from 'react-native-safe-area-context'
import { calendarRepository } from '../../../infrastructure/di/Dependencies'
import {
  rootNavigation,
  RootStackParamList,
} from '../../../navigation/types/StackTypes'
import { WorkType } from '../../../shared/types/Calendar'
import { useCalendarStore } from '../../../store/useCalendarStore'
import { toUpdateShiftRecord } from '../mapper/UpdateShiftMapper'
import CalendarInteractive from '../../../shared/components/calendar/personal/CalendarInteractive'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'

const CalendarEditScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const route = useRoute<RouteProp<RootStackParamList, 'EditCalendar'>>()

  const workTimes = useScheduleInfoStore(state => state.workTimes)
  const calendarData = useCalendarStore(state => state.calendarData)
  const updateCalendarDay = useCalendarStore(state => state.updateCalendarDay)

  const { organizationName, workGroup } = useScheduleInfoStore()

  const initialDate = route.params?.selectedDate
    ? dayjs(route.params.selectedDate)
    : dayjs()

  const [currentDate, setCurrentDate] = useState(initialDate)
  const [selectedYearMonth, setSelectedYearMonth] = useState({
    year: initialDate.year(),
    month: initialDate.month() + 1,
  })

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  // 근무 형태를 눌렀지만 '취소'를 누르면 원래 상태로 되돌아감.
  const [backupType, setBackupType] = useState<WorkType | null>(null)

  // 이 ref가 .expend()를 호출할 수 있어야한다. // EditBottomSheet에게 ref 전달
  const sheetRef = useRef<BottomSheet>(null)

  const shiftTypeToId = (type: WorkType | null): number => {
    switch (type) {
      case '주간':
        return 1
      case '오후':
        return 2
      case '야간':
        return 3
      case '휴일':
        return 4
      default:
        return 0 // 기본값 없음
    }
  }

  const getSelectedBoxId = () => {
    if (!selectedDate) return 0

    const key = selectedDate.format('YYYY-MM-DD')
    const workType = calendarData[key]?.workTypeName ?? null

    return shiftTypeToId(workType)
  }

  // 근무 형태 캘린더에 넣기
  const handleTypeSelect = (type: WorkType) => {
    if (!selectedDate) return
    const key = selectedDate.format('YYYY-MM-DD')

    // 상태 업데이트
    updateCalendarDay(key, type)
  }

  // 날짜 클릭 시 바텀시트 열기, 바텀시트 열기 전에 근무 형태를 백업
  const openBottomSheet = (date: dayjs.Dayjs) => {
    const key = date.format('YYYY-MM-DD')
    const currentShift = calendarData[key]?.workTypeName

    setSelectedDate(date)
    setBackupType(currentShift)
    sheetRef.current?.expand() // 바텀 시트 열기
  }
  // 취소 시 롤백
  const handleCancel = () => {
    if (selectedDate) {
      const key = selectedDate.format('YYYY-MM-DD')

      // 상태 업데이트
      if (backupType !== null) {
        updateCalendarDay(key, backupType)
      } else {
        // 이전에 근무 형태가 없었으면 삭제
        const existing = calendarData[key]?.workTypeName
        if (existing) {
          updateCalendarDay(key, existing)
        }
      }
    }
    sheetRef.current?.close()
  }

  const handleConfirmSelection = () => {
    sheetRef.current?.close() // 바텀시트만 닫기
  }

  // TODO: 근무표 수정할 때 캘린더 범위에 포함되지 않은 것은 어떻게 처리??
  // '체크' 버튼을 누르면 patch 요청 - 근무표 수정사항 저장.
  const handlePatchData = async () => {
    try {
      await calendarRepository.updateCalendar(
        organizationName,
        workGroup,
        toUpdateShiftRecord(calendarData)
      )
      // 저장 성공 후 스택을 초기화하여 캘린더 탭으로 이동 (뒤로가기 방지)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Tabs', params: { screen: 'Calendar' } }],
      })
    } catch (error) {
      console.log('근무표 수정 실패:', error)
    }
  }

  return (
    <View className="flex-1">
      <SafeAreaView
        edges={['top']}
        style={{ flex: 1, backgroundColor: '#E7F4FE' }}
        className="flex-1"
      >
        {/* 헤더 */}
        <View className="w-full gap-[5px] bg-surface-information-subtle px-p-6 py-[14px]">
          <View className="flex-row justify-between">
            <Text className="text-text-information heading-xs">
              근무표 수정 모드
            </Text>
            <EditScreenHeader
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              setSelectedYearMonth={setSelectedYearMonth}
            />
          </View>
          <Text className="text-text-subtle body-xs">
            날짜를 탭하여 근무 형태를 변경하세요.
          </Text>
        </View>
        {/* 캘린더 */}
        <ScrollView className="flex-1 bg-surface-gray-subtle1 px-[16px] pt-[10px]">
          <View className="overflow-hidden rounded-radius-xl border-[3px] border-surface-information-subtle">
            <CalendarInteractive
              selectedYearMonth={selectedYearMonth}
              currentDate={currentDate}
              selectedDate={selectedDate}
              setSelectedDate={openBottomSheet}
            />
          </View>
        </ScrollView>
        {/* 모든 저장 버튼 -> 근무표에 저장되어야함. post 요청!! */}
        <TouchableOpacity
          onPress={handlePatchData}
          className="absolute bottom-[80px] right-0 mx-p-6 h-[40px] w-[40px] items-center justify-center rounded-radius-max bg-success-40"
        >
          <SuccessIcon />
        </TouchableOpacity>
      </SafeAreaView>

      {/* 근무표 수정 바텀시트 */}
      <>
        <EditBottomSheet
          handleTypeSelect={handleTypeSelect}
          handleCancel={handleCancel}
          handleSave={handleConfirmSelection} // 바텀시트 저장 버튼에는 이 함수 연결
          ref={sheetRef}
          selectedDate={selectedDate}
          selectedBoxId={getSelectedBoxId()} // prop으로 전달
          workTimes={workTimes} // EditBottomSheet에 전달
        />
      </>
    </View>
  )
}

export default CalendarEditScreen
