import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import PlusIcon from '../../../assets/icons/w-plus.svg'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import dayjs from 'dayjs'
import ToDoCard from '../../main/components/ToDoCard'
import MemoCard from '../../main/components/MemoCard'
import BottomSheetWrapper from '../../../shared/components/BottomSheetWrapper'
import TCalendarViewer from '../../../shared/components/calendar/team/TCalendarViewer'
import CalendarViewer from '../../../shared/components/calendar/personal/CalendarViewer'
import TimeFrame from '../../../shared/components/calendar/TimeFrame'
import { WorkType } from '../../../shared/types/Calendar'
import CalendarViewerHeader from '../../../shared/components/calendar/header/CalendarViewerHeader'
import { useLocalTodoStore } from '../../../store/useLocalTodoStore'
import { localMemoStore } from '../../../store/useLocalMemoStore'

interface HasCalendarProps {
  setShowPlus: (value: boolean) => void
  isTeamView: boolean
  setIsTeamView: (value: boolean) => void
}

const HasCalendar = ({
  setShowPlus,
  isTeamView,
  setIsTeamView,
}: HasCalendarProps) => {
  const [calendarData] = useState<Map<string, WorkType>>(new Map())
  const [selectedYearMonth, setSelectedYearMonth] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  })
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [isExpendedTodos, setIsExpendedTodos] = useState(false)
  const [isExpendedMemos, setIsExpendedMemos] = useState(false)

  const todos = useLocalTodoStore(state => state.todos)
  const fetchTodosByDate = useLocalTodoStore(state => state.getTodosByDate)

  const memos = localMemoStore(state => state.memos)
  const fetchMemosByDate = localMemoStore(state => state.fetchMemosByDate)

  // 최근 5개만 보여주기 - 넘어가면 '...' 처리
  const displayTodos = isExpendedTodos ? todos : todos.slice(-5)
  const displayMemos = isExpendedMemos ? memos : memos.slice(-5)

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

  const onClickExpandTodos = () => {
    setIsExpendedTodos(!isExpendedTodos)
  }

  const onClickExpandMemos = () => {
    setIsExpendedMemos(!isExpendedMemos)
  }

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
        onPressTeamIcon={() => {
          setIsTeamView(!isTeamView)
        }}
        selectedDate={currentDate.toDate()}
        onChange={newDate => setCurrentDate(dayjs(newDate))}
        setSelectedYearMonth={setSelectedYearMonth}
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
            <ToDoCard.Container
              todos={displayTodos ?? []}
              totalCount={todos.length}
              selectedDate={selectedDate}
              onClickExpand={onClickExpandTodos}
              isExpended={isExpendedTodos}
            />
            <View className="mt-[-20px]">
              <MemoCard.Container
                memos={displayMemos ?? []}
                totalCount={memos.length}
                selectedDate={selectedDate}
                onClickExpand={onClickExpandMemos}
                isExpended={isExpendedMemos}
              />
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheetWrapper>
    </View>
  )
}

export default HasCalendar
