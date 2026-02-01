import { View } from 'react-native'
import TitleSection from '../components/TitleSection'
import ToDoCard from '../components/ToDoCard'
import MemoCard from '../components/MemoCard'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useLocalTodoStore } from '../../../store/useLocalTodoStore'
import { localMemoStore } from '../../../store/useLocalMemoStore'

interface NoteSectionProps {
  selectedDate: dayjs.Dayjs | null
}

const NoteSection = ({ selectedDate }: NoteSectionProps) => {
  const todos = useLocalTodoStore(state => state.todos)
  const memos = localMemoStore(state => state.memos)

  const [isExpendedTodos, setIsExpendedTodos] = useState(false)
  const [isExpendedMemos, setIsExpendedMemos] = useState(false)

  const displayTodos = isExpendedTodos ? todos : todos.slice(-5)
  const displayMemos = isExpendedMemos ? memos : memos.slice(-5)

  const onClickExpandTodos = () => {
    setIsExpendedTodos(!isExpendedTodos)
  }

  const onClickExpandMemos = () => {
    setIsExpendedMemos(!isExpendedMemos)
  }

  return (
    <View className="flex-col justify-start gap-y-number-7 pt-number-8">
      <TitleSection.OnlyTitle title="기록하기" />
      <ToDoCard.Container
        todos={displayTodos ?? []}
        totalCount={todos.length}
        selectedDate={selectedDate}
        onClickExpand={onClickExpandTodos}
        isExpended={isExpendedTodos}
      />
      <MemoCard.Container
        memos={displayMemos ?? []}
        totalCount={memos.length}
        selectedDate={selectedDate}
        onClickExpand={onClickExpandMemos}
        isExpended={isExpendedMemos}
      />
    </View>
  )
}

export default NoteSection
