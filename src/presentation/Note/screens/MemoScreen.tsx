import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/TopAppBar'
import { View, TouchableOpacity } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import DayBoxHeader from '../components/DayBoxHeader'
import dayjs from 'dayjs'
import EmptyMessage from '../components/EmptyMessage'
import GlobalText from '../../../shared/components/GlobalText'
import EditIcon from '../../../assets/icons/ic_edit_28_information.svg'
import DeleteIcon from '../../../assets/icons/ic_trash_28_danger.svg'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import OneAddButton from '../components/OneAddButton'

const HIDDEN_ITEM_WIDTH = 66

const MemoScreen = () => {
  const memos = [
    {
      id: 1,
      title: '1번 타이틀',
      content: '1번 메시지',
    },
    {
      id: 2,
      title: '2번 타이틀',
      content: '2번 메시지',
    },
    {
      id: 3,
      title: '3번 타이틀',
      content: '3번 메시지',
    },
    {
      id: 4,
      title: '4번 타이틀',
      content: '4번 메시지',
    },
  ]

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-[16px]">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="메모"
          showBackButton={true}
          onPressBackButton={() => {}}
        />

        <ScrollView>
          <DayBoxHeader currentDate={dayjs()} setCurrentDate={() => {}} />
          <View className="rounded-bl-radius-xl rounded-br-radius-xl bg-surface-white">
            {memos.length === 0 ? (
              <View className="items-center justify-center py-[27px]">
                <EmptyMessage text="메모" iconSize={48} />
              </View>
            ) : (
              <SwipeListView
                data={memos}
                scrollEnabled={false}
                renderItem={({ item: memo, index }) => (
                  <View
                    className={`flex-col gap-[4px] bg-surface-white p-[12px] ${index === memos.length - 1 ? 'rounded-bl-radius-xl rounded-br-radius-xl' : ''}`}
                  >
                    <GlobalText className="text-body-s" numberOfLines={1}>
                      {memo.title}
                    </GlobalText>
                    <GlobalText className="text-body-xxs" numberOfLines={2}>
                      {memo.content}
                    </GlobalText>
                  </View>
                )}
                renderHiddenItem={({ index }) => (
                  <View
                    className={`h-full flex-row items-center justify-end ${index === memos.length - 1 ? 'rounded-bl-radius-xl rounded-br-radius-xl' : ''}`}
                  >
                    <TouchableOpacity
                      className={`h-full w-[${HIDDEN_ITEM_WIDTH}px] items-center justify-center bg-surface-information-subtle`}
                      onPress={() => {}}
                    >
                      <EditIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`h-full w-[${HIDDEN_ITEM_WIDTH}px] items-center justify-center bg-surface-danger-subtle  ${index === memos.length - 1 ? 'rounded-br-radius-xl' : ''}`}
                      onPress={() => {}}
                    >
                      <DeleteIcon />
                    </TouchableOpacity>
                  </View>
                )}
                rightOpenValue={-HIDDEN_ITEM_WIDTH * 2}
                disableRightSwipe={true}
                keyExtractor={item => item.id.toString()}
              />
            )}
          </View>

          <OneAddButton addOneTodo={() => {}} text="메모 작성" />
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default MemoScreen
