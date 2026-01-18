import { View } from 'react-native'
import TitleSection from '../components/TitleSection'
import ToDoCard from '../components/ToDoCard'
import MemoCard from '../components/MemoCard'
import { Memo } from '../../../domain/models/Memo'
import { Todo } from '../../../domain/models/Todo'
import dayjs from 'dayjs'

interface NoteSectionProps {
  todos?: Todo[] | undefined
  memos?: Memo[] | undefined
  selectedDate: dayjs.Dayjs | null
}

const NoteSection = ({ todos, memos, selectedDate }: NoteSectionProps) => {
  return (
    <View className="flex-col justify-start gap-y-number-7 pt-number-8">
      <TitleSection.OnlyTitle title="기록하기" />
      <ToDoCard.Container todos={todos ?? []} selectedDate={selectedDate} />
      <MemoCard.Container memos={memos ?? []} selectedDate={selectedDate} />
    </View>
  )
}

export default NoteSection
