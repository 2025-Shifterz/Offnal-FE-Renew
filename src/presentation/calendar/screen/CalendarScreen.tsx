import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import EmptyCalendarScrim from '../component/EmptyCalendarScrim'
import CalendarContainer from '../component/CalendarContainer'
import { View } from 'react-native'
import {
  useFocusEffect,
  useRoute,
  RouteProp,
  useNavigation,
} from '@react-navigation/native'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'
import { TabParamList } from '../../../navigation/types/TabParamList'
import dayjs from 'dayjs'
import { rootNavigation } from '../../../navigation/types/NavigationProps'
import CalendarViewerHeader from '../../../shared/components/calendar/header/CalendarViewerHeader'
import CalendarFloatingActionButton from '../component/CalendarFloatingActionButton'
import CalendarActionMenuOverlay from '../component/CalendarActionMenuOverlay'
import { useOnboardingStore } from '../../../store/useOnboardingStore'
import { ScrollView } from 'react-native-gesture-handler'

import CheckListIcon from '../../../assets/icons/ic_checklist_24.svg'
import NoteIcon from '../../../assets/icons/ic_note_24.svg'

import { useTodoStore } from '../../../store/useTodoStore'
import { useMemoStore } from '../../../store/useMemoStore'

import {
  NoteContainer,
  TodoRowItems,
  MemoRowItems,
} from '../component/CalendarNotesContainer'

const CalendarScreen = () => {
  const route = useRoute<RouteProp<TabParamList, 'Calendar'>>()
  const navigation = useNavigation<rootNavigation>()
  const insets = useSafeAreaInsets()

  const [isScheduleEmpty, setIsScheduleEmpty] = useState<boolean | null>(null)
  const [showActionMenuOverlay, setShowActionMenuOverlay] = useState(false)
  const [isTeamView, setIsTeamView] = useState(
    () => route.params?.isTeamView ?? false
  )
  const [currentDate, setCurrentDate] = useState(() =>
    route.params?.selectedDate ? dayjs(route.params.selectedDate) : dayjs()
  )
  const selectedYearMonth = useMemo(
    () => ({
      year: currentDate.year(),
      month: currentDate.month() + 1,
    }),
    [currentDate]
  )

  const todos = useTodoStore(state => state.todos)
  const fetchTodosByDate = useTodoStore(state => state.getTodosByDate)

  const memos = useMemoStore(state => state.memos)
  const fetchMemosByDate = useMemoStore(state => state.fetchMemosByDate)

  const workTimes = useScheduleInfoStore(state => state.workTimes)
  const fetchOrganization = useScheduleInfoStore(
    state => state.fetchOrganization
  )
  const setOnboardingMethod = useOnboardingStore(
    state => state.setOnboardingMethod
  )

  // 탭 재진입 시 현재 달로 복귀 (탭 화면은 언마운트되지 않으므로 useRef로 첫 포커스 추적)
  const isFirstFocus = useRef(true)

  const topPadding = insets.top
  const height = 50 + topPadding

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{ paddingTop: topPadding, height: height }}
          className="bg-surface-white px-[20px]"
        >
          <CalendarViewerHeader
            selectedDate={currentDate.toDate()}
            onPressTeamIcon={() => {
              setIsTeamView(prev => !prev)
            }}
            onChange={newDate => setCurrentDate(dayjs(newDate))}
          />
        </View>
      ),
      headerShown: true,
    })
  }, [navigation])

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false
      } else {
        setCurrentDate(dayjs())
      }

      const fetchData = async () => {
        try {
          const res = await fetchOrganization()
          setIsScheduleEmpty(Object.keys(res).length === 0)
        } catch (error) {
          console.log('조직 조회 실패:', error)
          setIsScheduleEmpty(false)
        }
      }

      fetchData()
    }, [fetchOrganization])
  )

  useEffect(() => {
    const initializeTodosAndMemos = async () => {
      try {
        await Promise.all([
          fetchTodosByDate(currentDate),
          fetchMemosByDate(currentDate),
        ])
      } catch (error) {
        console.error('Error initializing todos and memos', error)
      }
    }

    initializeTodosAndMemos()
  }, [currentDate, fetchTodosByDate, fetchMemosByDate])

  if (isScheduleEmpty === null) {
    return <View className="flex-1 bg-surface-white" />
  }

  const noteSectionSpacing = 'gap-[12px]'

  return (
    <View className="flex-1 bg-surface-white">
      {isScheduleEmpty && (
        <EmptyCalendarScrim
          onCreateScheduleClick={() => {
            navigation.navigate('OnboardingMethodScreen', {
              createScheduleButtonClick: true,
            })
          }}
        />
      )}

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 144 }}
      >
        <CalendarContainer
          isTeamView={isTeamView}
          currentDate={currentDate}
          selectedYearMonth={selectedYearMonth}
        />

        <View className="mt-[12px] rounded-tl-radius-xl rounded-tr-radius-xl bg-surface-white pt-[10px]">
          <View className={`pb-[20px] ${noteSectionSpacing}`}>
            <NoteContainer
              icon={<CheckListIcon />}
              title="할 일"
              onAddIconPress={() => {
                navigation.navigate('Todo', { selectedDate: currentDate })
              }}
            >
              <TodoRowItems todos={todos} />
            </NoteContainer>

            <NoteContainer
              icon={<NoteIcon />}
              title="메모"
              onAddIconPress={() => {
                navigation.navigate('Memo', { selectedDate: currentDate })
              }}
            >
              <MemoRowItems memos={memos} />
            </NoteContainer>
          </View>
        </View>
      </ScrollView>

      <CalendarFloatingActionButton
        onPress={() => {
          setShowActionMenuOverlay(prev => !prev)
        }}
      />
      {showActionMenuOverlay && (
        <CalendarActionMenuOverlay
          setShowActionMenuOverlay={() => {
            setShowActionMenuOverlay(prev => !prev)
          }}
          onPressEditBtn={() => {
            if (isTeamView) {
              navigation.navigate('TeamEditCalendar', {
                workTimes: workTimes,
                selectedDate: currentDate.toISOString(),
              })
            } else {
              navigation.navigate('EditCalendar', {
                workTimes: workTimes,
                selectedDate: currentDate.toISOString(),
              })
            }
          }}
          onPressOCRBtn={() => {
            navigation.navigate('OnboardingSchedules', {
              screen: 'SelectScheduleScope',
            })
            setOnboardingMethod('EXISTING_OCR')
          }}
        />
      )}
    </View>
  )
}

export default CalendarScreen
