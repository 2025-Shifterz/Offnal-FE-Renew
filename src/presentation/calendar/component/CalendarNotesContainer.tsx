import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import GlobalText from '../../../shared/components/text/GlobalText'

import { Todo } from '../../../domain/models/Todo'
import { Memo } from '../../../domain/models/Memo'

import AddIcon from '../../../assets/icons/ic_add_white_16.svg'
import CheckedIcon from '../../../assets/icons/checked.svg'

type NoteRowGroupProps = {
  icon: React.ReactNode
  title: string
  onAddIconPress: () => void
  children: React.ReactNode
}

type NoteHeaderProps = {
  icon: React.ReactNode
  title: string
  onAddIconPress: () => void
}

const NoteContainer = ({
  children,
  icon,
  title,
  onAddIconPress,
}: NoteRowGroupProps) => {
  return (
    <View className="gap-[8px] px-[20px]">
      <NoteHeader icon={icon} title={title} onAddIconPress={onAddIconPress} />
      {children}
    </View>
  )
}

const NoteHeader = ({ icon, title, onAddIconPress }: NoteHeaderProps) => {
  return (
    <View className="flex-row items-center gap-number-5 self-start rounded-radius-xl bg-background-gray-subtle1 px-number-3 py-number-2">
      <View className="flex-row items-center gap-number-3">
        {icon}
        <GlobalText className="font-pretSemiBold text-heading-xxxxs text-text-bolder">
          {title}
        </GlobalText>
      </View>

      <TouchableOpacity
        onPress={onAddIconPress}
        className="shadow-shadow-xs h-[16px] w-[16px] items-center justify-center rounded-full bg-surface-white"
      >
        <AddIcon />
      </TouchableOpacity>
    </View>
  )
}

const TodoRowItems = ({ todos }: { todos: Todo[] }) => {
  if (todos.length === 0) {
    return null
  }

  return (
    <View>
      {todos.map(todo => (
        <View key={todo.id}>
          <View className="flex-row items-center gap-[8px] py-[8px] pl-[4px]">
            {todo.isCompleted ? (
              <CheckedIcon />
            ) : (
              <View className="h-[11px] w-[11px] rounded-[2px] border border-alpha-inverse10 bg-surface-gray-subtle2" />
            )}

            <GlobalText className="font-pretMedium text-body-xxs text-text-subtle">
              {todo.content}
            </GlobalText>
          </View>
        </View>
      ))}
    </View>
  )
}

const MemoRowItems = ({ memos }: { memos: Memo[] }) => {
  if (memos.length === 0) {
    return null
  }

  return (
    <View>
      {memos.map(memo => (
        <View key={memo.id}>
          <View className="py-[8px] pl-[4px]">
            <GlobalText className="font-pretMedium text-text-subtle body-xxs">
              {memo.content}
            </GlobalText>
          </View>
        </View>
      ))}
    </View>
  )
}

export { NoteContainer, TodoRowItems, MemoRowItems }
