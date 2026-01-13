import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/TopAppBar'
import DayBoxHeader from '../components/DayBoxHeader'
import dayjs from 'dayjs'
import { Todo } from '../../../domain/models/Todo'
import CheckedIcon from '../../../assets/icons/checked.svg'
import EmptyMessage from '../components/EmptyMessage'
import GlobalText from '../../../shared/components/GlobalText'
import OneAddButton from '../components/OneAddButton'
import VerticalDots from '../../../assets/icons/ic_dot_16.svg'
import TodoOptionBottomSheet, {
  BottomSheetMethods,
} from '../components/sheet/TodoOptionBottomSheet'
import { useLocalTodoStore } from '../../../store/useLocalTodoStore'
import ChangeTodoDateBottomSheet, {
  ChangeTodoDateBottomSheetMethods,
} from '../components/sheet/ChangeTodoDateBottomSheet'
import { useNavigation } from '@react-navigation/native'
import { rootNavigation } from '../../../navigation/types'

const TodoScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const sheetRef = useRef<BottomSheetMethods>(null)
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

  const [currentDate, setCurrentDate] = useState(dayjs())

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const [editingTodoText, setEditingTodoText] = useState<string>('')

  const todos = useLocalTodoStore(state => state.todos)
  const {
    getTodosByDate,
    addTodo,
    deleteTodo,
    updateTodoContent,
    updateTodoCompleted,
    scheduleToday,
    scheduleNextDay,
    scheduleByDate,
  } = useLocalTodoStore.getState()

  useEffect(() => {
    getTodosByDate(currentDate)
  }, [currentDate, getTodosByDate])

  const handleAddTodo = async () => {
    if (!todo.trim()) {
      Alert.alert('알림', '할 일 내용을 압력해주세요')
      return
    }

    try {
      await addTodo(todo, currentDate)
      setTodo('') // 초기화
    } catch (error) {
      console.error('Error adding todo: ', error)
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
    <View className="flex-1 bg-background-gray-subtle1 px-[16px]">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="할 일"
          showBackButton={true}
          onPressBackButton={() => {
            navigation.goBack()
          }}
        />

        <ScrollView>
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
                          className="flex-1 text-body-xs text-text-basic"
                          placeholderTextColor="#6d7882"
                          onSubmitEditing={handleSaveEdit}
                          onBlur={handleSaveEdit}
                          numberOfLines={1}
                          autoFocus={true}
                        />
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
                          <GlobalText>{item.content}</GlobalText>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleOpenSheet(item)}>
                        <VerticalDots />
                      </TouchableOpacity>
                    </View>
                  )}
                  {index < todos.length - 1 && (
                    <View className="h-px bg-border-gray-light" />
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

                <View className="ml-[8px] flex-row items-center justify-between">
                  <TextInput
                    value={todo}
                    onChangeText={setTodo}
                    placeholder={`할 일 입력`}
                    className="mb-[5px] flex-1 text-body-xs text-text-basic"
                    placeholderTextColor="#6d7882"
                    onSubmitEditing={() => handleAddTodo()}
                    numberOfLines={1}
                    autoFocus={true}
                  />
                </View>
                <View className="h-[1px] bg-border-gray-light" />
              </View>
            )}
          </View>

          <OneAddButton
            addOneTodo={async () => {
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
        </ScrollView>
      </SafeAreaView>

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
