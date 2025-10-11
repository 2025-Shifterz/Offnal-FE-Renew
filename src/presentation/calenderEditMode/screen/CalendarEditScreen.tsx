import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs'
import EditScreenHeader from '../components/EditScreenMonthHeader'
import EditBottomSheet from '../components/EditBottomSheet'
import CalendarInteractive from '../components/CalendarInteractive'
import SuccessIcon from '../../../assets/icons/g-success.svg'
import BottomSheet from '@gorhom/bottom-sheet'
import { ShiftType, ShiftsMap } from '../../../data/model/Calendar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { calendarStackParamList } from '../../../navigation/types'
import { calendarRepository } from '../../../infrastructure/di/Dependencies'

type CalendarEditScreenRouteProp = RouteProp<
  calendarStackParamList,
  'EditCalendar'
>

const CalendarEditScreen = () => {
  const navigation = useNavigation()
  const route = useRoute<CalendarEditScreenRouteProp>()
  const { workTimes } = route.params // route.params에서 workTimes 받기
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [calendarData, setCalendarData] = useState<ShiftsMap>(new Map()) // ShiftsMap 타입 사용
  // 근무 형태를 눌렀지만 '취소'를 누르면 원래 상태로 되돌아감.
  const [backupType, setBackupType] = useState<ShiftType | null>(null)
  const [selectedBoxId, setSelectedBoxId] = useState(1) // 선택된 박스 ID 상태 추가

  // 이 ref가 .expend()를 호출할 수 있어야한다. // EditBottomSheet에게 ref 전달
  const sheetRef = useRef<BottomSheet>(null)

  const shiftTypeToId = (type: ShiftType | null): number => {
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
        return 1 // 기본값 '주간'
    }
  }

  // 근무 형태 캘린더에 넣기
  const handleTypeSelect = (type: ShiftType) => {
    if (!selectedDate) return
    const key = selectedDate.format('YYYY-MM-DD')

    setCalendarData(prev => {
      const newMap = new Map(prev)
      newMap.set(key, type)
      return newMap
    })

    // sheetRef.current?.close(); // 이 줄을 주석 처리하거나 삭제합니다.
  }

  // 날짜 클릭 시 바텀시트 열기, 바텀시트 열기 전에 근무 형태를 백업
  const openBottomSheet = (date: dayjs.Dayjs) => {
    const key = date.format('YYYY-MM-DD')
    const currentShift = calendarData.get(key) ?? null

    setSelectedDate(date)
    setBackupType(currentShift)
    setSelectedBoxId(shiftTypeToId(currentShift)) // ID 설정
    sheetRef.current?.expand() // 바텀 시트 열기
  }
  // 취소 시 롤백
  const handleCancel = () => {
    if (selectedDate) {
      const key = selectedDate.format('YYYY-MM-DD')

      setCalendarData(prev => {
        const newMap = new Map(prev)
        if (backupType !== null) {
          newMap.set(key, backupType)
        } else {
          newMap.delete(key)
        }
        return newMap
      })
    }
    sheetRef.current?.close()
  }

  const handleConfirmSelection = () => {
    sheetRef.current?.close() // 바텀시트만 닫기
  }

  // '체크' 버튼을 누르면 patch 요청 - 근무표 수정사항 저장.
  const handlePatchData = async () => {
    const year = currentDate.year()
    const month = currentDate.month() + 1

    try {
      await calendarRepository.updateWorkCalendar(year, month, calendarData)
      console.log('근무표 수정 성공')
      navigation.goBack() // 저장 성공 후 이전 화면으로 이동
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
            />
          </View>
          <Text className="text-text-subtle body-xs">
            날짜를 탭하여 근무 형태를 변경하세요.
          </Text>
        </View>
        {/* 캘린더 */}
        <View className="flex-1 bg-surface-gray-subtle1 px-[16px] pt-[10px]">
          <View className="overflow-hidden rounded-radius-xl border-[3px] border-surface-information-subtle">
            <CalendarInteractive
              calendarData={calendarData}
              selectedDate={selectedDate}
              setSelectedDate={openBottomSheet}
              setCurrentDate={setCurrentDate}
              setCalendarData={setCalendarData}
              isEditScreen={true}
              currentDate={currentDate}
            />
          </View>
        </View>
        {/* 모든 저장 버튼 -> 근무표에 저장되어야함. post 요청!! */}
        <TouchableOpacity
          onPress={handlePatchData}
          className="absolute bottom-[13px] right-[13px] h-[40px] w-[40px] items-center justify-center rounded-radius-max bg-success-40"
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
          selectedBoxId={selectedBoxId} // prop으로 전달
          setSelectedBoxId={setSelectedBoxId} // prop으로 전달
          workTimes={workTimes} // EditBottomSheet에 전달
        />
      </>
    </View>
  )
}

export default CalendarEditScreen
