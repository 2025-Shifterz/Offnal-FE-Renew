import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, Modal, StyleSheet, Text, View } from 'react-native'
import SealCharacter from '../../../assets/images/seal-character.svg'

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
        <View style={styles.modalCard}>
          <View className="items-center">
            <SealCharacter width={108} height={82} />

            <Text className="mt-4 text-center text-text-subtle heading-xs">
              AI가 근무표를 변환하고 있어요
            </Text>

            <Text
              className="mt-2 text-center text-text-disabled body-xs"
              style={styles.description}
            >
              이 페이지에서 나갈 수 있습니다.{'\n'}
              준비되면 알림을 통해 확인할 수 있어요.
            </Text>
          </View>

          <View className="mt-5 w-full">
            <View
              style={styles.track}
              onLayout={event => {
                setTrackWidth(event.nativeEvent.layout.width)
              }}
            >
              <Animated.View
                style={[
                  styles.fill,
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

const styles = StyleSheet.create({
  description: {
    lineHeight: 18,
  },
  fill: {
    backgroundColor: '#55D9E8',
    borderRadius: 999,
    height: '100%',
  },
  modalCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 28,
    elevation: 8,
    paddingBottom: 18,
    paddingHorizontal: 22,
    paddingTop: 18,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    width: 274,
  },
  track: {
    backgroundColor: '#D1D5DB',
    borderRadius: 999,
    height: 5,
    overflow: 'hidden',
    width: '100%',
  },
})

export default ProgressModal
