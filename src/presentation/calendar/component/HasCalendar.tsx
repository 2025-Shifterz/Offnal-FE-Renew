import { useNavigation } from '@react-navigation/native'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { calendarNavigation } from '../../../navigation/types'
import { useEffect, useRef, useState } from 'react'
import PlusIcon from '../../../assets/icons/w-plus.svg'
import BottomSheet from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import ToDoCard from '../../main/components/ToDoCard'
import MemoCard from '../../main/components/MemoCard'
import { ShiftType } from '../../../data/model/Calendar'
import { Todo } from '../../../infrastructure/local/entities/TodoEntity'
import {
  getMemosByDate,
  getToDosByDate,
} from '../../../infrastructure/di/Dependencies'
import BottomSheetWrapper from '../../../shared/components/BottomSheetWrapper'
import TCalendarViewer from '../../../shared/components/calendar/team/TCalendarViewer'
import CalendarViewer from '../../../shared/components/calendar/personal/CalendarViewer'
import TimeFrame from '../../../shared/components/calendar/TimeFrame'

interface HasCalendarProps {
  setShowPlus: (value: boolean) => void
}

const HasCalendar = ({ setShowPlus }: HasCalendarProps) => {
  const navigation = useNavigation<calendarNavigation>()
  const [isTeamView, setIsTeamView] = useState(false)
  const [calendarData, setCalendarData] = useState<Map<string, ShiftType>>(
    new Map()
  )
  // console.log('calendarData', calendarData);

  // 노트
  const [memos, setMemo] = useState<Todo[]>()
  const [todos, setTodo] = useState<Todo[]>()

  // 선택된 날짜.
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const formattedDate = selectedDate
    ? selectedDate.format('DD. dd')
    : '날짜 없음'

  // 바텀시트 Ref
  const sheetRef = useRef<BottomSheet>(null)

  const openBottomSheet = (date: dayjs.Dayjs) => {
    console.log('바텀시트 열기 함수 실행됨.')
    setSelectedDate(date)
    sheetRef.current?.expand() // 바텀 시트 열기
  }

  // 근무형태가 있을 때만 렌더링
  const shiftTypeForSelectedDate =
    selectedDate && calendarData.get(selectedDate.format('YYYY-MM-DD'))

  // 선택된 날짜 가져오기
  // getToDosByDates
  useEffect(() => {
    const initializeTodosbyDate = async () => {
      try {
        if (!selectedDate) return

        const [todosOnly, memosOnly] = await Promise.all([
          getToDosByDate.execute(selectedDate), // todo만 조회
          getMemosByDate.execute(selectedDate), // memo는 MemoDao에서!
        ])
        setTodo(todosOnly)
        setMemo(memosOnly)
      } catch (error) {
        console.error('Error initializing todos and memos', error)
      }
    }

    initializeTodosbyDate()
    // console.log('calendarData.size', calendarData.size);
  }, [selectedDate])

  return (
    <View className="h-full flex-1 px-[16px]">
      <ScrollView className="h-full flex-1">
        {/* 팀 캘린더인지 */}
        {isTeamView ? (
          <TCalendarViewer
            onPressTeamIcon={() => {
              setIsTeamView(!isTeamView)
              console.log('클릭됨')
            }}
            onPressEditIcon={() => {
              navigation.navigate('CalendarInfoEdit')
            }}
          />
        ) : (
          <CalendarViewer
            calendarData={calendarData}
            setCalendarData={setCalendarData}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onDateSelected={openBottomSheet} // ✅ 날짜 선택 시 바텀시트 열기
            onPressTeamIcon={() => {
              setIsTeamView(!isTeamView)
            }}
            onPressEditIcon={() => {
              navigation.navigate('CalendarInfoEdit')
            }}
          />
        )}
      </ScrollView>
      {/* { + } 버튼 동작 화면 */}
      <TouchableOpacity
        onPress={() => {
          setShowPlus(true)
        }}
        className="absolute bottom-[13px] right-[13px] h-[40px] w-[40px] items-center justify-center rounded-radius-max bg-surface-inverse"
      >
        <PlusIcon />
      </TouchableOpacity>
      {/* 노트 바텀시트 */}
      <BottomSheetWrapper
        ref={sheetRef}
        handleStyle={{ backgroundColor: '#F4F5F6' }}
      >
        <View className="flex-1 gap-[11px] bg-surface-gray-subtle1 px-[16px] pt-[12px]">
          <View className="flex-row items-center gap-[8px]">
            <Text className="w-[42px] text-text-bolder heading-xxs">
              {formattedDate}
            </Text>
            {shiftTypeForSelectedDate && (
              <TimeFrame text={shiftTypeForSelectedDate} />
            )}
          </View>
          <ScrollView>
            <ToDoCard.Container todos={todos ?? []} />
            <View className="mt-[-20px]">
              <MemoCard.Container memos={memos ?? []} />
            </View>
          </ScrollView>
        </View>
      </BottomSheetWrapper>
    </View>
  )
}

export default HasCalendar
