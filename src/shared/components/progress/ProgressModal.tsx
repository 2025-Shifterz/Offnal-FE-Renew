import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, Modal, Text, View } from 'react-native'
import OffnalCharacter from '../../../assets/icons/ic_offnal_character.svg'

interface ProgressModalProps {
  isVisible: boolean
  progressPercent: number
}

const ProgressModal = ({ isVisible, progressPercent }: ProgressModalProps) => {
  const animatedProgress = useRef(new Animated.Value(0)).current
  const [trackWidth, setTrackWidth] = useState(0)

  const roundedPercent = useMemo(
    () => Math.max(0, Math.min(100, Math.round(progressPercent))),
    [progressPercent]
  )

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: roundedPercent,
      duration: roundedPercent >= 100 ? 480 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()
  }, [animatedProgress, roundedPercent])

  useEffect(() => {
    if (!isVisible) {
      animatedProgress.setValue(0)
    }
  }, [animatedProgress, isVisible])

  const animatedFillWidth = useMemo(() => {
    if (trackWidth <= 0) {
      return 0
    }

    return animatedProgress.interpolate({
      inputRange: [0, 100],
      outputRange: [0, trackWidth],
      extrapolate: 'clamp',
    })
  }, [animatedProgress, trackWidth])

  return (
    <Modal transparent animationType="fade" visible={isVisible}>
      <View className="flex-1 items-center justify-center bg-alpha-inverse50 px-6">
        <View
          className="w-[274px] rounded-[28px] bg-[#F8F8F8] px-[22px] pb-[18px] pt-[18px]"
          style={{
            elevation: 8,
            shadowColor: '#101828',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 18,
          }}
        >
          <View className="items-center">
            <OffnalCharacter width={108} height={82} />

            <Text className="mt-4 text-center text-text-subtle heading-xs">
              AI가 근무표를 변환하고 있어요
            </Text>

            <Text className="mt-2 text-center leading-[18px] text-text-disabled body-xs">
              AI가 근무표를 분석하고 있어요.{'\n'}
              잠시만 기다려주세요.
            </Text>
          </View>

          <View className="mt-5 w-full">
            <View
              className="h-[5px] w-full overflow-hidden rounded-full bg-[#D1D5DB]"
              onLayout={event => {
                setTrackWidth(event.nativeEvent.layout.width)
              }}
            >
              <Animated.View
                style={[
                  {
                    backgroundColor: '#55D9E8',
                    borderRadius: 999,
                    height: '100%',
                  },
                  typeof animatedFillWidth === 'number'
                    ? { width: animatedFillWidth }
                    : { width: animatedFillWidth },
                ]}
              />
            </View>

            <Text className="mt-[7px] text-center text-[#9CA3AF] label-xs">
              {roundedPercent}%
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ProgressModal
