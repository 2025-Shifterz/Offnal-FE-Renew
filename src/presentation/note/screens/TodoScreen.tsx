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

const TodoScreen = () => {
  const sheetRef = useRef<BottomSheetMethods>(null)

  const handleOpenSheet = (todo: Todo) => {
    sheetRef.current?.open()
    setSelectedTodo(todo)
  }

  const [todo, setTodo] = useState('')
  const [showInput, setShowInput] = useState(false)

  const [currentDate, setCurrentDate] = useState(dayjs())
  const {
    todos,
    selectedTodo,
    setSelectedTodo,
    getTodosByDate,
    addTodo,
    deleteTodo,
    updateTodoCompleted,
    scheduleToday,
    scheduleNextDay,
  } = useLocalTodoStore.getState()

  useEffect(() => {
    getTodosByDate(currentDate)
  }, [todos, currentDate, getTodosByDate])

  const handleAddTodo = async () => {
    if (!todo.trim()) {
      Alert.alert('알림', '할 일 내용을 압력해주세요')
      return
    }

    try {
      await addTodo(todo, currentDate)
      setTodo('') // 초기화
      getTodosByDate(currentDate)
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

  const handleUpdateTodoCompleted = async (
    id: number,
    currentCompleted: boolean
  ) => {
    try {
      await updateTodoCompleted(id, !currentCompleted, currentDate)
    } catch (error) {
      console.error('Error completing todo: ', error)
    }
  }

  const handleScheduleToday = async () => {
    try {
      await scheduleToday()
    } catch (error) {
      console.error('Error scheduling today: ', error)
    }
  }

  const handleScheduleNextDay = async () => {
    try {
      await scheduleNextDay()
    } catch (error) {
      console.error('Error scheduling next day: ', error)
    }
  }

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-[16px]">
      <SafeAreaView className="flex-1">
        <TopAppBar title="할 일" showBackButton={true} />

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
                  <View className="w-full flex-row items-center justify-between px-[16px] py-p-3">
                    <TouchableOpacity
                      className="flex-1 flex-row items-center"
                      onPress={() =>
                        handleUpdateTodoCompleted(item.id, item.isCompleted)
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
                    onSubmitEditing={() => handleAddTodo(currentDate)}
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
              if (!showInput) {
                setShowInput(true)
              } else {
                if (todo.trim()) {
                  await handleAddTodo(currentDate)
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
        onEdit={() => {}}
        onDelete={() => handleDeleteTodo(selectedTodo?.id || 0)}
        onScheduleToday={() => handleScheduleToday}
        onScheduleNextDay={() => handleScheduleNextDay}
        onReSchedule={() => {}}
      />
    </View>
  )
}

export default TodoScreen
