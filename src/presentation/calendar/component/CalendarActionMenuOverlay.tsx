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
import { Animated } from 'react-native'

type CalendarActionMenuOverlayProps = {
  setShowActionMenuOverlay: () => void
  onPressOCRBtn: () => void
  onPressEditBtn: () => void
}

const CalendarActionMenuOverlay = ({
  setShowActionMenuOverlay,
  onPressOCRBtn,
  onPressEditBtn,
}: CalendarActionMenuOverlayProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  // 페이드 인 애니메이션
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100, // 0.25초
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="absolute z-10 h-full w-full flex-1 bg-background-dim"
    >
      <TouchableWithoutFeedback onPress={setShowActionMenuOverlay}>
        <View className="absolute h-full w-full" />
      </TouchableWithoutFeedback>
      <View className="absolute bottom-[13px] right-[13px] w-[189px] flex-col items-end gap-[13px]">
        <TouchableOpacity
          onPress={onPressOCRBtn}
          className="flex-row items-center gap-[10px]"
        >
          <MenuLabel text="사진찍어 AI로 근무표 등록" />
          <CameraIcon />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressEditBtn}
          className="flex-row items-center gap-[10px]"
        >
          <MenuLabel text="근무표 추가 입력 및 수정" />
          <PencilIcon />
        </TouchableOpacity>

        <View className="w-full items-end">
          <TouchableOpacity
            onPress={setShowActionMenuOverlay}
            className="h-[40px] w-[40px] items-center justify-center rounded-radius-max bg-surface-primary"
          >
            <CancelIcon />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

const MenuLabel = ({ text }: { text: string }) => {
  return (
    <View className="rounded-radius-max bg-surface-white px-[9px] py-[6px]">
      <Text className="heading-xxxxs">{text}</Text>
    </View>
  )
}

export default CalendarActionMenuOverlay
