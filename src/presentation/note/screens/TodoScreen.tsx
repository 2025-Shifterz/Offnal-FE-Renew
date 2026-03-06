import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DayBoxHeader from '../components/DayBoxHeader'
import dayjs from 'dayjs'
import { Todo } from '../../../domain/models/Todo'
import CheckedIcon from '../../../assets/icons/checked.svg'
import EmptyMessage from '../components/EmptyMessage'
import GlobalText from '../../../shared/components/text/GlobalText'
import AddOneTouchableChip from '../../../shared/components/chip/AddOneTouchableChip'
import VerticalDots from '../../../assets/icons/ic_dot_16.svg'
import TodoOptionBottomSheet, {
  BottomSheetMethods,
} from '../components/sheet/TodoOptionBottomSheet'
import { useTodoStore } from '../../../store/useTodoStore'
import ChangeTodoDateBottomSheet, {
  ChangeTodoDateBottomSheetMethods,
} from '../components/sheet/ChangeTodoDateBottomSheet'
import { RootStackParamList } from '../../../navigation/types/StackTypes'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useHeaderHeight } from '@react-navigation/elements'
import { useShallow } from 'zustand/shallow'

const TodoScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Todo'>>()
  const headerHeight = useHeaderHeight()

  const insets = useSafeAreaInsets()
  const scrollViewBottomPadding = insets.bottom + 50

  const selectedDate = route.params?.selectedDate

  const sheetRef = useRef<BottomSheetMethods>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  const changeTodoDateBottomSheetRef =
    useRef<ChangeTodoDateBottomSheetMethods>(null)

  const handleOpenSheet = (todo: Todo) => {
    sheetRef.current?.open()
    setSelectedTodo(todo)
  }

  const handleOpenChangeDateSheet = () => {
    sheetRef.current?.close()
    changeTodoDateBottomSheetRef.current?.open()
  }

  const [todo, setTodo] = useState('')
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [showInput, setShowInput] = useState(false)

  const [currentDate, setCurrentDate] = useState(selectedDate ?? dayjs())

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const [editingTodoText, setEditingTodoText] = useState<string>('')

  const {
    todos,
    getTodosByDate,
    addTodo,
    deleteTodo,
    updateTodoContent,
    updateTodoCompleted,
    scheduleToday,
    scheduleNextDay,
    scheduleByDate,
  } = useTodoStore(
    useShallow(state => ({
      todos: state.todos,
      getTodosByDate: state.getTodosByDate,
      addTodo: state.addTodo,
      deleteTodo: state.deleteTodo,
      updateTodoContent: state.updateTodoContent,
      updateTodoCompleted: state.updateTodoCompleted,
      scheduleToday: state.scheduleToday,
      scheduleNextDay: state.scheduleNextDay,
      scheduleByDate: state.scheduleByDate,
    }))
  )

  useEffect(() => {
    getTodosByDate(currentDate)
  }, [currentDate, getTodosByDate])

  const handleAddTodo = async () => {
    if (!todo.trim()) {
      Alert.alert('알림', '할 일 내용을 압력해주세요')
      return
    }

    const todoToAdd = todo
    setTodo('')

    try {
      await addTodo(todoToAdd, currentDate)
    } catch (error) {
      console.error('Error adding todo: ', error)
      setTodo(todoToAdd)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id, currentDate)
    } finally {
      sheetRef.current?.close()
    }
  }

  const handleStartEditing = () => {
    if (selectedTodo) {
      setEditingTodoId(selectedTodo.id)
      setEditingTodoText(selectedTodo.content)
      setShowInput(false)
      sheetRef.current?.close()
    }
  }

  const handleSaveEdit = async () => {
    if (!editingTodoId) return

    const newContent = editingTodoText.trim()
    if (newContent) {
      try {
        await updateTodoContent(editingTodoId, newContent, currentDate)
      } catch (error) {
        console.error('Error updating todo content: ', error)
      }
    }

    setEditingTodoId(null)
    setEditingTodoText('')
  }

  const handleUpdateTodoCompleted = async (
    id: number,
    currentCompleted: boolean
  ) => {
    try {
      await updateTodoCompleted(id, currentCompleted, currentDate)
    } catch (error) {
      console.error('Error completing todo: ', error)
    }
  }

  const handleScheduleToday = async () => {
    try {
      await scheduleToday(selectedTodo, currentDate)
    } finally {
      sheetRef.current?.close()
    }
  }

  const handleScheduleNextDay = async () => {
    try {
      await scheduleNextDay(selectedTodo, currentDate)
    } finally {
      sheetRef.current?.close()
    }
  }

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-p-7">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: scrollViewBottomPadding }}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }}
        >
          <DayBoxHeader
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
          <View className="rounded-bl-radius-xl rounded-br-radius-xl bg-surface-white">
            {todos.length === 0 && !showInput ? (
              <View className="items-center justify-center py-[27px]">
                <EmptyMessage text="할 일" iconSize={48} />
              </View>
            ) : (
              todos.map((item, index) => (
                <Fragment key={item.id}>
                  {index > 0 && <View className="h-px bg-border-gray-light" />}
                  {editingTodoId === item.id ? (
                    <View className="-scroll-py-safe-offset-p-3 w-full flex-row items-center justify-between px-[16px] py-p-3">
                      {item.isCompleted ? (
                        <CheckedIcon />
                      ) : (
                        <View className="h-[13px] w-[13px] rounded-[2px] bg-[#cdd1d5]" />
                      )}

                      <View className="ml-[8px] flex-1">
                        <TextInput
                          value={editingTodoText}
                          onChangeText={setEditingTodoText}
                          placeholder={`할 일 수정`}
                          className="flex-1 py-0 font-pretRegular text-body-xs text-text-basic"
                          placeholderTextColor="#6d7882"
                          onSubmitEditing={handleSaveEdit}
                          onBlur={handleSaveEdit}
                          numberOfLines={1}
                          autoFocus={true}
                        />
                      </View>
                      <View className="opacity-0">
                        <VerticalDots />
                      </View>
                    </View>
                  ) : (
                    <View className="w-full flex-row items-center justify-between px-[16px] py-p-3">
                      <TouchableOpacity
                        className="flex-1 flex-row items-center"
                        onPress={() =>
                          handleUpdateTodoCompleted(item.id, !item.isCompleted)
                        }
                      >
                        {item.isCompleted ? (
                          <CheckedIcon />
                        ) : (
                          <View className="h-[13px] w-[13px] rounded-[2px] bg-[#cdd1d5]" />
                        )}

                        <View className="ml-[8px] flex-1">
                          <GlobalText className="text-body-xs text-text-basic">
                            {item.content}
                          </GlobalText>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleOpenSheet(item)}>
                        <VerticalDots />
                      </TouchableOpacity>
                    </View>
                  )}
                </Fragment>
              ))
            )}

            {todos.length > 0 && showInput && (
              <View className="h-px bg-border-gray-light" />
            )}

            {showInput && (
              <View className="w-full flex-row items-center justify-between px-[16px] py-[10px]">
                <TouchableOpacity onPress={() => {}}>
                  <View className="h-[13px] w-[13px] rounded-[2px] bg-[#cdd1d5]" />
                </TouchableOpacity>
                <View className="ml-[8px] flex-1">
                  <TextInput
                    value={todo}
                    onChangeText={setTodo}
                    placeholder={`할 일 입력`}
                    className="flex-1 py-0 font-pretRegular text-body-xs text-text-basic"
                    placeholderTextColor="#6d7882"
                    onSubmitEditing={() => handleAddTodo()}
                    numberOfLines={1}
                    autoFocus={true}
                  />
                </View>
              </View>
            )}
          </View>

          <View className="mt-[8px] flex-row items-center justify-center">
            <AddOneTouchableChip
              onPress={async () => {
                if (editingTodoId) {
                  setEditingTodoId(null)
                  setEditingTodoText('')
                }

                if (!showInput) {
                  setShowInput(true)
                } else {
                  if (todo.trim()) {
                    await handleAddTodo()
                    setShowInput(true)
                  } else {
                    setShowInput(false)
                  }
                }
              }}
              text="할 일 추가"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TodoOptionBottomSheet
        ref={sheetRef}
        selectedTodo={selectedTodo}
        onEdit={() => handleStartEditing()}
        onDelete={() => handleDeleteTodo(selectedTodo?.id || 0)}
        onScheduleToday={() => handleScheduleToday()}
        onScheduleNextDay={() => handleScheduleNextDay()}
        onReSchedule={() => handleOpenChangeDateSheet()}
      />

      <ChangeTodoDateBottomSheet
        ref={changeTodoDateBottomSheetRef}
        date={currentDate}
        onChangeDate={async (targetDate: dayjs.Dayjs) => {
          if (!selectedTodo) return

          await scheduleByDate(selectedTodo, targetDate, currentDate)
          changeTodoDateBottomSheetRef.current?.close()
        }}
      />
    </View>
  )
}

export default TodoScreen
