import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/TopAppBar'
import GlobalText from '../../../shared/components/GlobalText'
import { useState } from 'react'

const AddMemoScreen = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const isDisabled = !title.trim()

  const handleSave = async () => {
    if (isDisabled) {
      Alert.alert('알림', '제목을 모두 입력해주세요.')
      return
    }
  }

  return (
    <View className="flex-1 bg-background-white px-[16px]">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title=""
          showBackButton={true}
          onPressBackButton={() => {}}
          rightActions={[
            <TouchableOpacity onPress={handleSave} disabled={isDisabled}>
              <GlobalText
                className={`font-pretSemiBold heading-xs ${isDisabled ? 'text-text-basic-inverse' : 'text-text-basic'}`}
              >
                완료
              </GlobalText>
            </TouchableOpacity>,
          ]}
        />

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
