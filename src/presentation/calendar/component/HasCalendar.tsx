import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import PlusIcon from '../../../assets/icons/w-plus.svg'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import ToDoCard from '../../main/components/ToDoCard'
import MemoCard from '../../main/components/MemoCard'
import BottomSheetWrapper from '../../../shared/components/sheet/BottomSheetWrapper'
import TCalendarViewer from '../../../shared/components/calendar/team/TCalendarViewer'
import CalendarViewer from '../../../shared/components/calendar/personal/CalendarViewer'
import TimeFrame from '../../../shared/components/calendar/TimeFrame'
import { WorkType } from '../../../shared/types/Calendar'
import CalendarViewerHeader from '../../../shared/components/calendar/header/CalendarViewerHeader'
import { useTodoStore } from '../../../store/useTodoStore'
import { useMemoStore } from '../../../store/useMemoStore'

interface HasCalendarProps {
  setShowPlus: (value: boolean) => void
  isTeamView: boolean
  setIsTeamView: (value: boolean) => void
  currentDate: dayjs.Dayjs
  setCurrentDate: Dispatch<SetStateAction<dayjs.Dayjs>>
  selectedYearMonth: { year: number; month: number }
  bottomInset?: number
}

const HasCalendar = ({
  setShowPlus,
  isTeamView,
  setIsTeamView,
  currentDate,
  setCurrentDate,
  selectedYearMonth,
  bottomInset = 0,
}: HasCalendarProps) => {
  const [calendarData] = useState<Map<string, WorkType>>(new Map())

  const todos = useTodoStore(state => state.todos)
  const fetchTodosByDate = useTodoStore(state => state.getTodosByDate)

  const memos = useMemoStore(state => state.memos)
  const fetchMemosByDate = useMemoStore(state => state.fetchMemosByDate)

  // 선택된 날짜.
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const formattedDate = selectedDate
    ? selectedDate.format('DD. dd')
    : '날짜 없음'

  // 바텀시트 Ref
  const sheetRef = useRef<BottomSheet>(null)

  const openBottomSheet = (date: dayjs.Dayjs) => {
    setSelectedDate(date)
    sheetRef.current?.expand() // 바텀 시트 열기
  }

  // 근무형태가 있을 때만 렌더링
  const shiftTypeForSelectedDate =
    selectedDate && calendarData.get(selectedDate.format('YYYY-MM-DD'))

  // 선택된 날짜 가져오기
  useEffect(() => {
    const initializeTodosbyDate = async () => {
      try {
        if (!selectedDate) return

        await Promise.all([
          fetchTodosByDate(selectedDate),
          fetchMemosByDate(selectedDate),
        ])
      } catch (error) {
        console.error('Error initializing todos and memos', error)
      }
    }

    initializeTodosbyDate()
  }, [selectedDate, fetchTodosByDate, fetchMemosByDate])

  return (
    <View className="h-full flex-1 px-[16px]">
      <CalendarViewerHeader
        selectedDate={currentDate.toDate()}
        onPressTeamIcon={() => {
          setIsTeamView(!isTeamView)
        }}
        onChange={newDate => setCurrentDate(dayjs(newDate))}
      />
      <ScrollView className="h-full flex-1">
        {/* 팀 캘린더인지 */}
        {isTeamView ? (
          <TCalendarViewer
            selectedYearMonth={selectedYearMonth}
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onDateSelected={openBottomSheet}
          />
        ) : (
          <CalendarViewer
            selectedYearMonth={selectedYearMonth}
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onDateSelected={openBottomSheet} // ✅ 날짜 선택 시 바텀시트 열기
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
        bottomInset={0}
        handleStyle={{
          backgroundColor: '#F4F5F6',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      >
        <View className="gap-[11px] bg-surface-gray-subtle1 px-[16px]  pt-[12px]">
          <View className="flex-row items-center gap-[8px]">
            <Text className="w-[42px] text-text-bolder heading-xxs">
              {formattedDate}
            </Text>
            {shiftTypeForSelectedDate && (
              <TimeFrame text={shiftTypeForSelectedDate} />
            )}
          </View>
          <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <ToDoCard.Container todos={todos} selectedDate={selectedDate} />
            <View className="mt-[-20px]">
              <MemoCard.Container memos={memos} selectedDate={selectedDate} />
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheetWrapper>
    </View>
  )
}

export default HasCalendar
