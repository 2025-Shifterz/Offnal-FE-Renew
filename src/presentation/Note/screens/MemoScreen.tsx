import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/TopAppBar'
import { View, TouchableOpacity, Alert } from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import DayBoxHeader from '../components/DayBoxHeader'
import dayjs from 'dayjs'
import EmptyMessage from '../components/EmptyMessage'
import GlobalText from '../../../shared/components/GlobalText'
import EditIcon from '../../../assets/icons/ic_edit_28_information.svg'
import DeleteIcon from '../../../assets/icons/ic_trash_28_danger.svg'
import { Fragment, useCallback, useRef } from 'react'
import OneAddButton from '../components/OneAddButton'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainStackParamList } from '../../../navigation/types'
import { localMemoStore } from '../../../store/useLocalMemoStore'

const MemoScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>()
  const swipeListViewRef = useRef<SwipeListView<any>>(null)

  const memos = localMemoStore(state => state.memos)
  const fetchMemosByDate = localMemoStore(state => state.fetchMemosByDate)
  const deleteMemo = localMemoStore(state => state.deleteMemo)

  useEffect(() => {
    fetchMemosByDate(dayjs())
  }, [fetchMemosByDate])

  useFocusEffect(
    useCallback(() => {
      swipeListViewRef.current?.closeAllOpenRows()
    }, [])
  )

  const handleDelete = (id: number) => {
    Alert.alert('메모 삭제', '정말로 이 메모를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        onPress: () => deleteMemo(id),
        style: 'destructive',
      },
    ])
  }

  return (
    <View className="flex-1 bg-background-gray-subtle1 px-[16px]">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="메모"
          showBackButton={true}
          onPressBackButton={() => {
            navigation.goBack()
          }}
        />

        <View className="flex-1">
          <DayBoxHeader currentDate={dayjs()} setCurrentDate={() => {}} />
          <View className="rounded-bl-radius-xl rounded-br-radius-xl bg-surface-white">
            {memos.length === 0 ? (
              <View className="items-center justify-center py-[27px]">
                <EmptyMessage text="메모" iconSize={48} />
              </View>
            ) : (
              <SwipeListView
                ref={swipeListViewRef}
                data={memos}
                scrollEnabled={false}
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

          <OneAddButton
            addOneTodo={() => navigation.navigate('AddMemo')}
            text="메모 작성"
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default MemoScreen
