import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import GlobalText from '../../../shared/components/text/GlobalText'
import StarRating from '../../../shared/components/rating/StarRating'
import { useNavigation } from '@react-navigation/native'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import RatingChip from '../../../shared/components/chip/RatingChip'
import EmphasizedButton from '../../../shared/components/button/Button'
import Dialog from '../../../shared/components/dialog/Dialog'

const MAX_FEEDBACK_LENGTH = 100

const FeedBackScreen = () => {
  const navigation = useNavigation<rootNavigation>()

  const [rating, setRating] = useState(1)
  const [feedback, setFeedback] = useState('')
  const [isFeedbackDialogVisible, setIsFeedbackDialogVisible] = useState(false)

  return (
    <View className="flex-1 bg-surface-gray-subtle1">
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-p-7">
            <View className="flex-col">
              <GlobalText className="my-[8.5px] font-pretMedium text-body-xs">
                오프날에서의 경험이 만족스러우신가요?
              </GlobalText>
              <View className="flex-col items-center gap-g-2 ">
                <StarRating rating={rating} onRatingChange={setRating} />
                <RatingChip rating={rating} />
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
          <View className="px-p-7">
            <EmphasizedButton
              content={
                <GlobalText className="font-pretMedium text-body-m text-text-bolder-inverse">
                  제출하기
                </GlobalText>
              }
              onPress={() => setIsFeedbackDialogVisible(true)}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Dialog
        visible={isFeedbackDialogVisible}
        title="알림"
        description={`피드백이 제출되었습니다.${'\n'}소중한 의견 감사합니다.`}
        onConfirm={() => {
          setIsFeedbackDialogVisible(false)
          navigation.pop()
        }}
      />
    </View>
  )
}

export default FeedBackScreen
