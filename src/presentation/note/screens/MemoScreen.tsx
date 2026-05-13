import { SafeAreaView } from 'react-native-safe-area-context'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import DayBoxHeader from '../components/DayBoxHeader'
import dayjs from 'dayjs'
import EmptyMessage from '../components/EmptyMessage'
import GlobalText from '../../../shared/components/text/GlobalText'
import EditIcon from '../../../assets/icons/ic_edit_28_information.svg'
import DeleteIcon from '../../../assets/icons/ic_trash_28_danger.svg'
import { Fragment, useCallback, useRef, useState } from 'react'
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'
import { useMemoStore } from '../../../store/useMemoStore'
import { rootNavigation } from '../../../navigation/types/NavigationProps'
import { RootStackParamList } from '../../../navigation/types/RootStackParamList'
import AddOneTouchableChip from '../../../shared/components/chip/AddOneTouchableChip'
import ConfirmDialog from '../../../shared/components/dialog/ConfirmDialog'

const MemoScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const route = useRoute<RouteProp<RootStackParamList, 'Memo'>>()

  const selectedDate = route.params?.selectedDate

  const swipeListViewRef = useRef<SwipeListView<any>>(null)

  const { memos, fetchMemosByDate, deleteMemo } = useMemoStore(
    useShallow(state => ({
      memos: state.memos,
      fetchMemosByDate: state.fetchMemosByDate,
      deleteMemo: state.deleteMemo,
    }))
  )

  const [currentDate, setCurrentDate] = useState(selectedDate ?? dayjs())
  const [memoToDeleteId, setMemoToDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchMemosByDate(currentDate)
  }, [currentDate, fetchMemosByDate])

  useFocusEffect(
    useCallback(() => {
      swipeListViewRef.current?.closeAllOpenRows()
    }, [])
  )

  const handleDelete = (id: number) => {
    setMemoToDeleteId(id)
  }

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-p-7">
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <ScrollView>
          <DayBoxHeader
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />
          <View className="rounded-bl-radius-xl rounded-br-radius-xl bg-surface-white">
            {memos.length === 0 ? (
              <View className="items-center justify-center py-[27px]">
                <EmptyMessage text="메모" iconSize={48} />
              </View>
            ) : (
              <SwipeListView
                ref={swipeListViewRef}
                data={memos}
                scrollEnabled={true}
                renderItem={({ item: memo, index }) => (
                  <Fragment key={memo.id}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {}}
                      className={`flex-col gap-[4px] bg-surface-white p-[12px] ${index === memos.length - 1 ? 'rounded-bl-radius-xl rounded-br-radius-xl' : ''}`}
                    >
                      <GlobalText className="text-body-s" numberOfLines={1}>
                        {memo.title}
                      </GlobalText>
                      {memo.content && (
                        <GlobalText className="text-body-xxs" numberOfLines={2}>
                          {memo.content}
                        </GlobalText>
                      )}
                    </TouchableOpacity>
                    {index < memos.length - 1 && (
                      <View className="h-px bg-border-gray-light" />
                    )}
                  </Fragment>
                )}
                renderHiddenItem={({ item, index }) => (
                  <View
                    className={`h-full flex-row items-center justify-end ${index === memos.length - 1 ? 'rounded-bl-radius-xl rounded-br-radius-xl' : ''}`}
                  >
                    <TouchableOpacity
                      className={`h-full w-[66px] items-center justify-center bg-surface-information-subtle`}
                      onPress={() => {
                        navigation.navigate('AddMemo', { memo: item })
                      }}
                    >
                      <EditIcon />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`h-full w-[66px] items-center justify-center bg-surface-danger-subtle  ${index === memos.length - 1 ? 'rounded-br-radius-xl' : ''}`}
                      onPress={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </TouchableOpacity>
                  </View>
                )}
                rightOpenValue={-132}
                disableRightSwipe={true}
                keyExtractor={item => item.id.toString()}
              />
            )}
          </View>

          <View className="mt-[8px] flex-row items-center justify-center">
            <AddOneTouchableChip
              onPress={() =>
                navigation.navigate('AddMemo', {
                  date: currentDate.toISOString(),
                })
              }
              text="메모 작성"
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <ConfirmDialog
        visible={memoToDeleteId !== null}
        title="메모 삭제"
        description="정말로 이 메모를 삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
        onCancel={() => {
          setMemoToDeleteId(null)
        }}
        onConfirm={async () => {
          if (memoToDeleteId === null) return
          await deleteMemo(memoToDeleteId)
          setMemoToDeleteId(null)
        }}
      />
    </View>
  )
}

export default MemoScreen
