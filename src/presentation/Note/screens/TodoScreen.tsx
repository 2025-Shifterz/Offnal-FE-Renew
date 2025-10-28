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
import dayjs, { Dayjs } from 'dayjs'
import { Todo } from '../../../domain/models/Todo'
import {
  addTodoUseCase,
  deleteTodoUseCase,
  getTodosUseCase,
  todoCompletionUseCase,
} from '../../../infrastructure/di/Dependencies'
import CheckedIcon from '../../../assets/icons/checked.svg'
import EmptyMessage from '../components/EmptyMessage'
import GlobalText from '../../../shared/components/GlobalText'
import OneAddButton from '../components/OneAddButton'
import VerticalDots from '../../../assets/icons/ic_dot_16.svg'
import TodoOptionBottomSheet, {
  BottomSheetMethods,
} from '../components/sheet/TodoOptionBottomSheet'

const TodoScreen = () => {
  const sheetRef = useRef<BottomSheetMethods>(null)

  const handleOpenSheet = (todo: Todo) => {
    sheetRef.current?.open()
    setSelectedTodo(todo)
  }

  const [todos, setTodos] = useState<Todo[]>([])
  const [todo, addTodo] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)

  const initTodos = async () => {
    try {
      const loadedTodos = await getTodosUseCase.execute()
      setTodos(loadedTodos)
    } catch (error) {
      console.error('Failed to load todos:', error)
    }
  }

  useEffect(() => {
    initTodos()
  }, [])

  const handleAddTodo = async (date: Dayjs) => {
    if (!todo.trim()) {
      Alert.alert('알림', '할 일 내용을 압력해주세요')
      return
    }

    try {
      await addTodoUseCase.execute(todo, date)
      addTodo('') // 초기화
      const updatedTodos = await getTodosUseCase.execute()
      setTodos(updatedTodos)
    } catch (error) {
      console.error('Error adding todo: ', error)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodoUseCase.execute(id)
      const updatedTodos = await getTodosUseCase.execute()
      setTodos(updatedTodos)
    } catch (error) {
      console.error('Error deleting todo:', error)
    } finally {
      sheetRef.current?.close()
    }
  }

  const updateTodoCompleted = async (id: number, currentCompleted: boolean) => {
    try {
      await todoCompletionUseCase.execute(id, !currentCompleted)
      const updatedTodos = await getTodosUseCase.execute()
      setTodos(updatedTodos)
    } catch (error) {
      console.error('Error completing todo: ', error)
    }
  }

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-[16px]">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="할 일"
          showBackButton={true}
          onPressBackButton={() => {}}
        />

        <ScrollView>
          <DayBoxHeader currentDate={dayjs()} setCurrentDate={() => {}} />
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
                        updateTodoCompleted(item.id, item.isCompleted)
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
                    onChangeText={addTodo}
                    placeholder={`할 일 입력`}
                    className="mb-[5px] flex-1 text-body-xs text-text-basic"
                    placeholderTextColor="#6d7882"
                    onSubmitEditing={() => handleAddTodo(dayjs())}
                    numberOfLines={1}
                    autoFocus={true}
                  />
                </View>
                <View className="h-[1px] bg-border-gray-light" />
              </View>
            )}
          </View>

          <OneAddButton
            addOneTodo={() => setShowInput(!showInput)}
            text="할 일 추가"
          />
        </ScrollView>
      </SafeAreaView>

      <TodoOptionBottomSheet
        ref={sheetRef}
        selectedTodo={selectedTodo}
        onEdit={() => {}}
        onDelete={() => handleDeleteTodo(selectedTodo?.id || 0)}
        onScheduleToday={() => {}}
        onScheduleNextDay={() => {}}
        onReSchedule={() => {}}
      />
    </View>
  )
}

export default TodoScreen
