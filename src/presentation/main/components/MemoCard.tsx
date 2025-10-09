import { View, Text } from 'react-native'

import TitleSection from './TitleSection'
import NoteIcon from '../../../assets/icons/ic_note_24.svg'
import { useNavigation } from '@react-navigation/native'
import { Todo } from '../../../domain/entities/Todo'
import { mainNavigation, RootStackParamList } from '../../../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

interface MemoCardProps {
  memos: Todo[]
}

interface MemoItemProps {
  memo: Todo
  isFirst: boolean
  isLast: boolean
}

const Container = ({ memos }: MemoCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const hasMemos = memos && memos.length > 0

  return (
    <View className="my-number-8 flex-col justify-start gap-y-number-7 rounded-lg bg-background-white p-number-6">
      <View className="mb-number-3 flex-row items-center justify-start">
        <NoteIcon />
        <TitleSection.WithAddableBtn
          title="메모"
          btnContent="메모 추가"
          onPressIcon={() =>
            navigation.navigate('Tabs', {
              screen: 'Home',
              params: {
                screen: 'Memo',
              },
            })
          }
        />
      </View>
      {hasMemos ? (
        <View className="flex-col">
          {/* 메모 아이템들을 담을 View */}
          {memos.map((memo, index) => (
            <Item
              key={memo.id} // 고유한 key prop 사용
              memo={memo}
              isFirst={index === 0} // 첫 번째 아이템인지 확인
              isLast={index === memos.length - 1} // 마지막 아이템인지 확인
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
        아직 등록된 메모가 없습니다.
      </Text>
      <Text className="text-text-disabled body-xxs">메모를 등록해주세요.</Text>
    </View>
  )
}

const Item = ({ memo, isFirst, isLast }: MemoItemProps) => {
  const itemBorderClass = [
    isFirst ? 'rounded-t-lg' : '',
    isLast ? 'rounded-b-lg' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <View
      className={`bg-background-gray-subtle1 px-number-6 py-number-4 ${itemBorderClass} ${!isLast ? 'mb-number-1' : ''}`}
    >
      <Text className="text-text-subtle body-xxs">{memo.text}</Text>
    </View>
  )
}

export default { Nothing, Container }
