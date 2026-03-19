import { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * ### StartAlignedTopAppBarProps
 *
 * StartAlignedTopAppBarProps
 *
 * @param title 제목
 * @param rightActions 오른쪽에 위치할 액션 버튼
 * @param applySafeArea 안전 영역 적용 (기본 값: false)
 * @param backgroundColor 배경색 (기본 값: 'bg-background-gray-subtle1')
 */
type StartAlignedTopAppBarProps = {
  title?: ReactNode

  rightActions?: ReactNode

  applySafeArea?: boolean

  backgroundColor?: string
}

const StartAlignedTopAppBar = ({
  title,
  rightActions,
  applySafeArea = false,
  backgroundColor = 'bg-background-gray-subtle1',
}: StartAlignedTopAppBarProps) => {
  const insets = useSafeAreaInsets()
  const topPadding = applySafeArea ? insets.top : 0
  const height = 50 + topPadding

  return (
    <View
      style={{ paddingTop: topPadding, height: height }}
      className={`w-full justify-center ${backgroundColor}`}
    >
      <View
        className={`h-[50px] w-full flex-row items-center justify-center ${backgroundColor}`}
      >
        <View
          className="absolute left-number-9 items-center justify-center"
          pointerEvents="none"
        >
          {title}
        </View>

        <View className="absolute right-number-7 flex-row items-center justify-center">
          {rightActions}
        </View>
      </View>
    </View>
  )
}

export default StartAlignedTopAppBar
