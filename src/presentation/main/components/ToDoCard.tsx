import { View, Text } from 'react-native'

import TitleSection from './TitleSection'
import CheckListIcon from '../../../assets/icons/ic_checklist_24.svg'
import CheckIcon from '../../../assets/icons/checked.svg'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/types'
import { Todo } from '../../../infrastructure/local/entities/TodoEntity'

interface TodoCardProps {
  todos: Todo[]
}

interface TodoItemProps {
  todo: Todo
  isFirst: boolean
  isLast: boolean
}

const Container = ({ todos }: TodoCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const hasTodos = todos && todos.length > 0

  return (
    <View className="my-number-8 flex-col justify-start gap-y-number-7 rounded-lg bg-background-white p-number-6">
      <View className="mb-number-3 flex-row items-center justify-start">
        <CheckListIcon />
        <TitleSection.WithAddableBtn
          title="할 일"
          btnContent="할 일 추가"
          onPressIcon={() =>
            navigation.navigate('Tabs', {
              screen: 'Home',
              params: {
                screen: 'Todo',
              },
            })
          }
        />
      </View>
      {hasTodos ? (
        <View className="flex-col">
          {/* 메모 아이템들을 담을 View */}
          {todos.map((todo, index) => (
            <Item
              key={todo.id} // 고유한 key prop 사용
              todo={todo}
              isFirst={index === 0} // 첫 번째 아이템인지 확인
              isLast={index === todos.length - 1} // 마지막 아이템인지 확인
            />
          ))}
        </View>
      ) : (
        <Nothing />
      )}
    </View>
  )
}

const Nothing = () => {
  return (
    <View className="flex-col items-center justify-center rounded-lg bg-background-gray-subtle1 py-number-9">
      <Text className="text-text-disabled body-xxs">
        아직 등록된 할일이 없습니다.
      </Text>
      <Text className="text-text-disabled body-xxs">
        근무일정에 따른 할 일 리스트를 만들어보세요.
      </Text>
    </View>
  )
}

const Item = ({ todo, isFirst, isLast }: TodoItemProps) => {
  const itemBorderClass = [
    isFirst ? 'rounded-t-lg' : '',
    isLast ? 'rounded-b-lg' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <View
      className={`flex-row items-center bg-background-gray-subtle1 px-number-6 py-number-4 ${itemBorderClass} ${!isLast ? 'mb-number-1' : ''}`}
    >
      {todo.completed ? (
        <View className="mr-[5px]">
          <CheckIcon />
        </View>
      ) : (
        <View className="mr-[5px] h-[13px] w-[13px] rounded-[2px] bg-[#cdd1d5]" />
      )}
      <Text className="text-text-subtle body-xxs">{todo.text}</Text>
    </View>
  )
}

export default { Nothing, Container }
