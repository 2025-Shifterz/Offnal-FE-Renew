import React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import GlobalText from '../../../shared/components/text/GlobalText'

import { Todo } from '../../../domain/models/Todo'
import { Memo } from '../../../domain/models/Memo'

import AddIcon from '../../../assets/icons/ic_add_white_16.svg'
import Checkbox from '../../../shared/components/Checkbox'

type InlineNoteInputProps = {
  showInput?: boolean
  value?: string
  onChangeText?: (text: string) => void
  onSubmit?: () => void
  onBlur?: () => void
  inputRef?: React.Ref<TextInput>
}

type TodoRowItemsProps = {
  todos: Todo[]
  onToggleTodoCompleted: (todo: Todo) => void
} & InlineNoteInputProps

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

const TodoRowItems = ({
  todos,
  showInput = false,
  value = '',
  onChangeText,
  onSubmit,
  onBlur,
  inputRef,
  onToggleTodoCompleted,
}: TodoRowItemsProps) => {
  if (todos.length === 0 && !showInput) {
    return null
  }

  return (
    <View>
      {todos.map(todo => (
        <View key={todo.id}>
          <TouchableOpacity
            testID={`calendar-todo-row-${todo.id}`}
            className="flex-row items-center gap-[8px] py-[8px] pl-[4px]"
            activeOpacity={0.7}
            onPress={() => {
              onToggleTodoCompleted(todo)
            }}
          >
            <Checkbox checked={todo.isCompleted} size={13} />

            <GlobalText
              className="flex-1 font-pretMedium text-body-xxs text-text-subtle"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {todo.content}
            </GlobalText>
          </TouchableOpacity>
        </View>
      ))}

      {showInput && (
        <View className="flex-row items-center gap-[8px] py-[8px] pl-[4px]">
          <Checkbox checked={false} size={13} />
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder="할 일 입력"
            placeholderTextColor="#6d7882"
            className="flex-1 py-0 font-pretMedium text-body-xxs text-text-basic"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={onSubmit}
            onBlur={onBlur}
            numberOfLines={1}
          />
        </View>
      )}
    </View>
  )
}

const MemoRowItems = ({
  memos,
  showInput = false,
  value = '',
  onChangeText,
  onSubmit,
  onBlur,
  inputRef,
}: { memos: Memo[] } & InlineNoteInputProps) => {
  if (memos.length === 0 && !showInput) {
    return null
  }

  return (
    <View>
      {memos.map(memo => (
        <View key={memo.id}>
          <View className="py-[8px] pl-[4px]">
            <GlobalText
              className="font-pretMedium text-body-xxs text-text-subtle"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {memo.title}
            </GlobalText>
          </View>
        </View>
      ))}

      {showInput && (
        <View className="py-[8px] pl-[4px]">
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder="메모 입력"
            placeholderTextColor="#6d7882"
            className="py-0 font-pretMedium text-body-xxs text-text-basic"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={onSubmit}
            onBlur={onBlur}
            numberOfLines={1}
          />
        </View>
      )}
    </View>
  )
}

export { NoteContainer, TodoRowItems, MemoRowItems }
