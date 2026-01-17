import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopAppBar from '../../../shared/components/appbar/TopAppBar'
import { useState } from 'react'
import GlobalText from '../../../shared/components/GlobalText'
import StarRating from '../../../shared/components/StarRating'
import BottomButton from '../../../shared/components/BottomButton'
import { useNavigation } from '@react-navigation/native'
import { rootNavigation } from '../../../navigation/types'

type RatingInfo = { emoji: string; text: string }

const RATING_DATA: { [key: number]: RatingInfo } = {
  1: { emoji: '😞', text: '매우 불만족' },
  2: { emoji: '😕', text: '불만족' },
  3: { emoji: '🙂', text: '보통' },
  4: { emoji: '😊', text: '만족' },
  5: { emoji: '🥰', text: '매우 만족' },
}

const MAX_FEEDBACK_LENGTH = 100

const FeedBackScreen = () => {
  const navigation = useNavigation<rootNavigation>()

  const [rating, setRating] = useState(1)
  const [feedback, setFeedback] = useState('')

  const currentRatingData = RATING_DATA[rating]

  const handleFeedbackSubmit = () => {
    Alert.alert('피드백이 제출되었습니다.', '소중한 의견 감사합니다.', [
      {
        text: '확인',
        onPress: navigation.pop,
      },
    ])
  }

  return (
    <View className="flex-1 bg-surface-gray-subtle1">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="평가 및 피드백"
          showBackButton={true}
          onPressBackButton={() => {
            navigation.pop()
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-number-9">
            <View className="flex-col">
              <GlobalText className="my-[8.5px] font-pretMedium text-body-xs">
                오프날에서의 경험이 만족스러우신가요?
              </GlobalText>
              <View className="flex-col items-center gap-g-2 ">
                <StarRating rating={rating} onRatingChange={setRating} />
                {currentRatingData && (
                  <View className="mt-[5px] rounded-radius-max border border-[#F05F424D] bg-surface-danger-subtle px-number-6 py-number-3">
                    <GlobalText className="font-pretMedium text-body-xxs">
                      {currentRatingData.emoji} {currentRatingData.text}
                    </GlobalText>
                  </View>
                )}
              </View>

              <View className="flex-col">
                <GlobalText className="mb-[5px] mt-[32px] font-pretMedium text-body-xs">
                  의견이나 개선 사항을 자유롭게 작성해주세요.
                </GlobalText>
                <View className="h-[150px] flex-col justify-between rounded-lg border-alpha-inverse10 bg-white px-4 py-3">
                  <TextInput
                    className="flex-1 text-left text-text-basic label-xs"
                    placeholder="좋았던 점이나 불편했던 점을 알려주세요!"
                    placeholderTextColor="#A0A0A0"
                    value={feedback}
                    onChangeText={text => setFeedback(text)}
                    maxLength={MAX_FEEDBACK_LENGTH}
                    multiline={true}
                    textAlignVertical="top"
                  />
                  <View className="self-end">
                    <GlobalText className="text-text-disabled label-xs">
                      {feedback.length}/{MAX_FEEDBACK_LENGTH}
                    </GlobalText>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          <BottomButton
            text="제출하기"
            onPress={handleFeedbackSubmit}
            className="px-number-8"
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  )
}

export default FeedBackScreen
