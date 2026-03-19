import { useEffect, useRef } from 'react'
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import GlobalText from '../../../shared/components/GlobalText'

type EditModeDeleteBarProps = {
  disabled?: boolean
  bottomOffset: number
  visible: boolean
  onPress: () => void
}

const EditModeDeleteBar = ({
  disabled = false,
  bottomOffset,
  visible,
  onPress,
}: EditModeDeleteBarProps) => {
  const translateY = useRef(new Animated.Value(24)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!visible) {
      translateY.setValue(24)
      opacity.setValue(0)
      return
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start()
  }, [opacity, translateY, visible])

  if (!visible) {
    return null
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-30"
      style={{ bottom: bottomOffset }}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient as ViewStyle}
      >
        <Animated.View
          style={{ opacity, transform: [{ translateY }] }}
          className="items-center pb-[50px]"
        >
          <TouchableOpacity
            className={`h-[46px] w-[145px] items-center justify-center rounded-radius-m ${
              disabled ? 'bg-surface-disabled' : 'bg-surface-inverse'
            }`}
            disabled={disabled}
            onPress={onPress}
          >
            <GlobalText
              className={`font-pretSemiBold text-heading-xs ${
                disabled ? 'text-text-disabled' : 'text-text-bolder-inverse'
              }`}
            >
              삭제하기
            </GlobalText>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  )
}

export default EditModeDeleteBar

const styles = StyleSheet.create({
  gradient: {
    paddingBottom: 0,
    paddingTop: 36,
  },
})
