import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/TopAppBar'
import { View, TouchableOpacity, Alert } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import DayBoxHeader from '../components/DayBoxHeader'
import dayjs from 'dayjs'
import EmptyMessage from '../components/EmptyMessage'
import GlobalText from '../../../shared/components/GlobalText'
import EditIcon from '../../../assets/icons/ic_edit_28_information.svg'
import DeleteIcon from '../../../assets/icons/ic_trash_28_danger.svg'
import { ScrollView } from 'react-native-gesture-handler'
import OneAddButton from '../components/OneAddButton'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Memo } from '../../../domain/models/Memo'
import {
  deleteMemoUseCase,
  getMemosByDate,
} from '../../../infrastructure/di/Dependencies'

const MemoScreen = () => {
  const [memos, setMemos] = useState<Memo[]>([])

  const loadMemos = async () => {
    try {
      const loadedMemos = await getMemosByDate.execute(dayjs())
      setMemos(loadedMemos)
    } catch (error) {
      console.error('Failed to load memos:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMemoUseCase.execute(id)
      loadMemos()
    } catch (error) {
      console.error('Failed to delete memo:', error)
      Alert.alert('오류', '메모 삭제에 실패했습니다.')
    }
  }

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
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {}}
                    className={`flex-col gap-[4px] bg-surface-white p-[12px] ${index === memos.length - 1 ? 'rounded-bl-radius-xl rounded-br-radius-xl' : ''}`}
                  >
                    <GlobalText className="text-body-s" numberOfLines={1}>
                      {memo.title}
                    </GlobalText>
                    <GlobalText className="text-body-xxs" numberOfLines={2}>
                      {memo.content}
                    </GlobalText>
                  </TouchableOpacity>
                )}
                renderHiddenItem={({ item, index }) => (
                  <View
                    className={`h-full flex-row items-center justify-end ${index === memos.length - 1 ? 'rounded-bl-radius-xl rounded-br-radius-xl' : ''}`}
                  >
                    <TouchableOpacity
                      className={`h-full w-[66px] items-center justify-center bg-surface-information-subtle`}
                      onPress={() => {}}
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

          <OneAddButton addOneTodo={() => {}} text="메모 작성" />
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default MemoScreen
