import React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import DayBoxHeader from './DayBoxHeader'
import EmptyMessage from './EmptyMessage'
import CheckedIcon from '../../../assets/icons/checked.svg'
import { Dayjs } from 'dayjs'
import GlobalText from '../../../shared/components/GlobalText'
import { Todo } from '../../../infrastructure/local/entities/TodoEntity'
import { Memo } from '../../../infrastructure/local/entities/MemoEntity'

// 하루의 할 일 박스

interface EmptyDayBoxProps {
  text: string
  type: string
  todos: (Todo | Memo)[]
  newTodoText: string
  setNewTodoText: (text: string) => void
  handleAddTodo: (date: Dayjs) => void
  handleCompleted: (id: number, completed: boolean) => void
  handleDeleteTodo: (id: number) => void
  showInput: boolean
  currentDate: Dayjs
  setCurrentDate: (date: Dayjs) => void
}

const NoteDayBox = ({
  text,
  type,
  todos,
  newTodoText,
  setNewTodoText,
  handleAddTodo,
  handleCompleted,
  handleDeleteTodo,
  showInput,
  currentDate,
  setCurrentDate,
}: EmptyDayBoxProps) => {
  return (
    <View className="w-full rounded-radius-xl">
      <DayBoxHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />

      <View className="w-full items-center bg-surface-white">
        {todos.length === 0 && !showInput ? (
          <View className="py-[27px]">
            <EmptyMessage text={text} iconSize={48} />
          </View>
        ) : (
          todos.map(item => (
            // 할 일 리스트
            <View
              key={item.id}
              className="w-full flex-row items-center justify-between border-b-[0.3px] border-b-divider-gray-light px-[16px] py-p-3"
            >
              {type === 'todo' && (
                <TouchableOpacity
                  testID={`todo-checkbox-${item.id}`}
                  onPress={() =>
                    handleCompleted(item.id, (item as Todo).completed)
                  }
                >
                  {(item as Todo).completed ? (
                    <CheckedIcon />
                  ) : (
                    <View className="h-[13px] w-[13px] rounded-[2px] bg-[#cdd1d5]" />
                  )}
                </TouchableOpacity>
              )}

              <View className="ml-[10px] flex-1">
                <GlobalText>{item.content}</GlobalText>
              </View>

              <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
                <GlobalText className="text-sm text-red-500">삭제</GlobalText>
              </TouchableOpacity>
            </View>
          ))
        )}

        {showInput && (
          <View className="w-full gap-[5px] px-[16px] py-p-3">
            <View className="h-[40px] flex-row items-center justify-between">
              <TextInput
                value={newTodoText}
                onChangeText={setNewTodoText}
                placeholder={`${text} 입력`}
                className=""
              />
              <TouchableOpacity onPress={() => handleAddTodo(currentDate)}>
                <GlobalText className="text-sm">확인</GlobalText>
              </TouchableOpacity>
            </View>
            <View className="h-[1px] bg-border-gray-light" />
          </View>
        )}
      </View>
    </View>
  )
}

export default NoteDayBox
