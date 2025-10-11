import { View } from 'react-native'
import TitleSection from '../components/TitleSection'
import ToDoCard from '../components/ToDoCard'
import MemoCard from '../components/MemoCard'
import { Todo } from '../../../domain/entities/Todo'

interface NoteSectionProps {
  todos?: Todo[] | undefined
  memos?: Todo[] | undefined
}

const NoteSection = ({ todos, memos }: NoteSectionProps) => {
  return (
    <View className="flex-col justify-start gap-y-number-7 pt-number-8">
      <TitleSection.OnlyTitle title="기록하기" />
      <ToDoCard.Container todos={todos ?? []} />
      <MemoCard.Container memos={memos ?? []} />
    </View>
  )
}

export default NoteSection
