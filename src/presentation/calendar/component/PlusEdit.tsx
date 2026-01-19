import React, { useEffect, useRef } from 'react'
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import CancelIcon from '../../../assets/icons/w-cancel.svg'
import CameraIcon from '../../../assets/icons/pr-cam.svg'
import PencilIcon from '../../../assets/icons/pr-pencil.svg'
import { useNavigation } from '@react-navigation/native'
import { rootNavigation } from '../../../navigation/types/StackTypes'
import { Animated } from 'react-native'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'
import { useOnboardingStore } from '../../../store/useOnboardingStore'

// 컴포넌트
type TextButtonProps = {
  text: string
}

const TextButton = ({ text }: TextButtonProps) => {
  return (
    <View className="rounded-radius-max bg-surface-white px-[9px] py-[6px]">
      <Text className="heading-xxxxs">{text}</Text>
    </View>
  )
}

// 전체 화면
type PlusEditProps = {
  setShowPlus: (show: boolean) => void
  isTeamView: boolean
}

const PlusEdit = ({ setShowPlus, isTeamView }: PlusEditProps) => {
  const navigation = useNavigation<rootNavigation>()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const { workTimes } = useScheduleInfoStore()
  const { setOnboardingMethod } = useOnboardingStore()

  // 페이드 인 애니메이션
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100, // 0.25초
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])
  const navigateToEditModeScreen = () => {
    if (isTeamView) {
      navigation.navigate('TeamEditCalendar', { workTimes: workTimes })
    } else {
      navigation.navigate('EditCalendar', { workTimes: workTimes })
    }
  }

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="absolute z-10 h-full w-full flex-1 bg-background-dim"
    >
      {/* 배경 클릭 시 닫히도록 설정 */}
      <TouchableWithoutFeedback onPress={() => setShowPlus(false)}>
        <View className="absolute h-full w-full" />
      </TouchableWithoutFeedback>
      <View className="absolute bottom-[13px] right-[13px] w-[189px] flex-col items-end gap-[13px]">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('OnboardingSchedules', {
              screen: 'SelectScheduleScope',
            })
            setOnboardingMethod('EXISTING_OCR')
          }}
          className="flex-row items-center gap-[10px]"
        >
          <TextButton text="사진찍어 AI로 근무표 등록" />
          <CameraIcon />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToEditModeScreen}
          className="flex-row items-center gap-[10px]"
        >
          <TextButton text="근무표 추가 입력 및 수정" />
          <PencilIcon />
        </TouchableOpacity>

        <View className="w-full items-end">
          <TouchableOpacity
            onPress={() => setShowPlus(false)}
            className="h-[40px] w-[40px] items-center justify-center rounded-radius-max bg-surface-primary"
          >
            <CancelIcon />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

export default PlusEdit
