import TopAppBar from '../../../shared/components/TopAppBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { InfoStackParamList } from '../../../navigation/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'

const FeedbackScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<InfoStackParamList>>()

  // 1. 상태 관리: 별점(rating)과 텍스트 피드백(feedback)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  return (
    <View className="flex-1 bg-background-gray-subtle1">
      <SafeAreaView className="flex-1">
        <TopAppBar
          title="평가 및 피드백"
          showBackButton={true}
          onPressBackButton={() => navigation.goBack()}
        />
      </SafeAreaView>
    </View>
  )
}

export default FeedbackScreen
