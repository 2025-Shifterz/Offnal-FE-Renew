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
import { Keyboard, Platform, TextInput, View } from 'react-native'
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

type ActiveNoteInput = 'todo' | 'memo'

const CalendarScreen = () => {
  const route = useRoute<RouteProp<TabParamList, 'Calendar'>>()
  const navigation = useNavigation<rootNavigation>()
  const insets = useSafeAreaInsets()

  const [isScheduleEmpty, setIsScheduleEmpty] = useState<boolean | null>(null)
  const [showActionMenuOverlay, setShowActionMenuOverlay] = useState(false)
  const [activeNoteInput, setActiveNoteInput] =
    useState<ActiveNoteInput | null>(null)
  const [todoDraft, setTodoDraft] = useState('')
  const [memoDraft, setMemoDraft] = useState('')
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)
  const [imeHeight, setImeHeight] = useState(0)
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
  const addTodo = useTodoStore(state => state.addTodo)

  const memos = useMemoStore(state => state.memos)
  const fetchMemosByDate = useMemoStore(state => state.fetchMemosByDate)
  const addMemo = useMemoStore(state => state.addMemo)

  const workTimes = useScheduleInfoStore(state => state.workTimes)
  const fetchOrganization = useScheduleInfoStore(
    state => state.fetchOrganization
  )
  const setOnboardingMethod = useOnboardingStore(
    state => state.setOnboardingMethod
  )

  // 탭 재진입 시 현재 달로 복귀 (탭 화면은 언마운트되지 않으므로 useRef로 첫 포커스 추적)
  const isFirstFocus = useRef(true)
  const scrollViewRef = useRef<ScrollView>(null)
  const todoInputRef = useRef<TextInput>(null)
  const memoInputRef = useRef<TextInput>(null)
  const isSubmittingNoteRef = useRef(false)

  const topPadding = insets.top
  const height = 50 + topPadding
  const scrollViewBottomPadding = insets.bottom + 144 + imeHeight

  const scrollToNoteInput = useCallback(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 120)
    })
  }, [])

  const closeNoteInput = useCallback((inputType: ActiveNoteInput) => {
    if (inputType === 'todo') {
      setTodoDraft('')
    } else {
      setMemoDraft('')
    }

    setActiveNoteInput(current => (current === inputType ? null : current))
  }, [])

  const submitNoteInput = useCallback(
    async (inputType: ActiveNoteInput) => {
      if (isSubmittingNoteRef.current) {
        return
      }

      const draft = inputType === 'todo' ? todoDraft.trim() : memoDraft.trim()

      if (!draft) {
        closeNoteInput(inputType)
        return
      }

      isSubmittingNoteRef.current = true
      setIsSubmittingNote(true)

      try {
        if (inputType === 'todo') {
          await addTodo(draft, currentDate)
          setTodoDraft('')
        } else {
          await addMemo(draft, '', currentDate)
          setMemoDraft('')
        }

        setActiveNoteInput(current => (current === inputType ? null : current))
      } catch (error) {
        console.error('Error submitting calendar note input', error)
      } finally {
        isSubmittingNoteRef.current = false
        setIsSubmittingNote(false)
      }
    },
    [addMemo, addTodo, closeNoteInput, currentDate, memoDraft, todoDraft]
  )

  const startNoteInput = useCallback(
    async (inputType: ActiveNoteInput) => {
      if (isSubmittingNote) {
        return
      }

      if (activeNoteInput === inputType) {
        scrollToNoteInput()
        return
      }

      if (activeNoteInput === 'todo' && todoDraft.trim()) {
        await submitNoteInput('todo')
      }

      if (activeNoteInput === 'memo' && memoDraft.trim()) {
        await submitNoteInput('memo')
      }

      if (activeNoteInput === 'todo' && !todoDraft.trim()) {
        setTodoDraft('')
      }

      if (activeNoteInput === 'memo' && !memoDraft.trim()) {
        setMemoDraft('')
      }

      setActiveNoteInput(inputType)
    },
    [
      activeNoteInput,
      isSubmittingNote,
      memoDraft,
      scrollToNoteInput,
      submitNoteInput,
      todoDraft,
    ]
  )

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
  }, [currentDate, height, navigation, topPadding])

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSubscription = Keyboard.addListener(showEvent, event => {
      const keyboardHeight = event.endCoordinates.height
      setImeHeight(Math.max(0, keyboardHeight - insets.bottom))
      scrollToNoteInput()
    })

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setImeHeight(0)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [insets.bottom, scrollToNoteInput])

  useEffect(() => {
    if (activeNoteInput === null) {
      return
    }

    requestAnimationFrame(() => {
      if (activeNoteInput === 'todo') {
        todoInputRef.current?.focus()
      } else {
        memoInputRef.current?.focus()
      }

      scrollToNoteInput()
    })
  }, [activeNoteInput, scrollToNoteInput])

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
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scrollViewBottomPadding }}
        onContentSizeChange={() => {
          if (activeNoteInput !== null) {
            scrollToNoteInput()
          }
        }}
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
                startNoteInput('todo')
              }}
            >
              <TodoRowItems
                todos={todos}
                showInput={activeNoteInput === 'todo'}
                value={todoDraft}
                onChangeText={setTodoDraft}
                onSubmit={() => {
                  submitNoteInput('todo')
                }}
                onBlur={() => {
                  submitNoteInput('todo')
                }}
                inputRef={todoInputRef}
              />
            </NoteContainer>

            <NoteContainer
              icon={<NoteIcon />}
              title="메모"
              onAddIconPress={() => {
                startNoteInput('memo')
              }}
            >
              <MemoRowItems
                memos={memos}
                showInput={activeNoteInput === 'memo'}
                value={memoDraft}
                onChangeText={setMemoDraft}
                onSubmit={() => {
                  submitNoteInput('memo')
                }}
                onBlur={() => {
                  submitNoteInput('memo')
                }}
                inputRef={memoInputRef}
              />
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
