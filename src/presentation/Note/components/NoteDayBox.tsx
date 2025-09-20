import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import DayBoxHeader from './DayBoxHeader'
import EmptyMessage from './EmptyMessage'
import CheckedIcon from '../../../assets/icons/checked.svg'
import dayjs, { Dayjs } from 'dayjs'
import { Todo } from '../../../domain/entities/Todo'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

// 하루의 할 일 박스

interface EmptyDayBoxProps {
  text: string
  type: string
  todos: Todo[]
  newTodoText: string
  setNewTodoText: (text: string) => void
  handleAddTodo: (date: dayjs.Dayjs) => void
  handleCompleted: (id: number, completed: boolean, type: string) => void
  handleDeleteTodo: (id: number, type: string) => void
  showInput: boolean
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
}: EmptyDayBoxProps) => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs())

  // 날짜 일치 여부 체크 - utc를 해석해서 로컬로 변환.
  const isSameDate = (createdAt: string | undefined, current: Dayjs) => {
    return createdAt && dayjs.utc(createdAt).local().isSame(current, 'day')
  }

  // 오늘 날짜에 해당하는 todo만 필터링
  const filteredTodos = todos.filter(todo =>
    isSameDate(todo.createdAt, currentDate)
  )

  return (
    <View className="rounded-radius-xl w-full">
      <DayBoxHeader currentDate={currentDate} setCurrentDate={setCurrentDate} />

      <View className="bg-surface-white w-full items-center">
        {filteredTodos.length === 0 && !showInput ? (
          <View className="py-[27px]">
            <EmptyMessage text={text} iconSize={48} />
          </View>
        ) : (
          filteredTodos.map(item => (
            // 할 일 리스트
            <View
              key={item.id}
              className="border-b-divider-gray-light py-p-3 w-full flex-row items-center justify-between border-b-[0.3px] px-[16px]"
            >
              {type === 'todo' && (
                <TouchableOpacity
                  onPress={() =>
                    handleCompleted(item.id, item.completed, item.type)
                  }
                >
                  {item.completed ? (
                    <CheckedIcon />
                  ) : (
                    <View className="h-[13px] w-[13px] rounded-[2px] bg-[#cdd1d5]" />
                  )}
                </TouchableOpacity>
              )}

              <View className="ml-[10px] flex-1">
                <Text>{item.text}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteTodo(item.id, item.type)}
              >
                <Text className="text-sm text-red-500">삭제</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {showInput && (
          <View className="py-p-3 w-full gap-[5px] px-[16px]">
            <View className="h-[40px] flex-row items-center justify-between">
              <TextInput
                value={newTodoText}
                onChangeText={setNewTodoText}
                placeholder={`${text} 입력`}
                className=""
              />
              <TouchableOpacity onPress={() => handleAddTodo(currentDate)}>
                <Text className="text-sm">확인</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-border-gray-light h-[1px]" />
          </View>
        )}
      </View>
    </View>
  )
}

export default NoteDayBox
