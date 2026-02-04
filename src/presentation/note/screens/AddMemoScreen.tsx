import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBarBackButton from '../../../shared/components/button/TopAppBarBackButton'
import GlobalText from '../../../shared/components/GlobalText'
import { useLayoutEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import CenterAlignedTopAppBar from '../../../shared/components/appbar/CenterAlignedTopAppBar'
import {
  rootNavigation,
  RootStackParamList,
} from '../../../navigation/types/StackTypes'
import dayjs from 'dayjs'
import { localMemoStore } from '../../../store/useLocalMemoStore'

const AddMemoScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const route = useRoute<RouteProp<RootStackParamList, 'AddMemo'>>()
  const memoToUpdate = route.params?.memo
  const dateString = route.params?.date
  const date = dateString ? dayjs(dateString) : dayjs()

  const addMemo = localMemoStore(state => state.addMemo)
  const updateMemo = localMemoStore(state => state.updateMemo)

  const [title, setTitle] = useState(memoToUpdate?.title || '')
  const [content, setContent] = useState(memoToUpdate?.content || '')

  const isDisabled = !title.trim()

  const handleSave = async () => {
    if (isDisabled) {
      Alert.alert('알림', '제목을 모두 입력해주세요.')
      return
    }

    try {
      if (memoToUpdate) {
        await updateMemo(
          memoToUpdate.id,
          title,
          content,
          dayjs(memoToUpdate.targetDate)
        )
        navigation.goBack()
      } else {
        await addMemo(title, content, date)
        navigation.goBack()
      }
    } catch (error) {
      console.error('Error saving memo:', error)
      Alert.alert('오류', '메모 생성에 실패했습니다.')
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CenterAlignedTopAppBar
          navigationIcon={<TopAppBarBackButton onPress={navigation.goBack} />}
          title={null}
          rightActions={[
            <TouchableOpacity onPress={handleSave} disabled={isDisabled}>
              <GlobalText
                className={`font-pretSemiBold text-heading-xs ${isDisabled ? 'text-text-basic-inverse' : 'text-text-basic'}`}
              >
                완료
              </GlobalText>
            </TouchableOpacity>,
          ]}
          applySafeArea={true}
          backgroundColor="bg-surface-white"
        />
      ),
    })
  }, [navigation, isDisabled, handleSave])

  return (
    <View className="flex-1 bg-background-white">
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 px-[20px] pt-[4px]"
        >
          <View className="h-px bg-border-gray-light" />

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력해주세요"
            placeholderTextColor="#6D7882"
            className="py-[16px] font-pretSemiBold text-2xl text-text-basic"
            autoFocus={true}
          />

          <View className="h-px bg-border-gray-light" />

          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="메모를 작성할 수 있어요"
            placeholderTextColor="#6D7882"
            className="flex-1 pt-[16px] font-pretMedium text-text-basic"
            multiline={true}
            textAlignVertical="top"
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

export default AddMemoScreen
