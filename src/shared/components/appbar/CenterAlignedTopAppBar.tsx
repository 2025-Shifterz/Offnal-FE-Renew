import { ReactNode } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * ### CenterAlignedTopAppBarProps
 *
 * CenterAlignedTopAppBar의 Props
 *
 * @param navigationIcon 네비게이션 아이콘
 * @param title 제목
 * @param rightActions 오른쪽에 위치할 액션 버튼
 * @param applySafeArea 상단 안전 영역 적용 여부 (기본값: false)
 * @param backgroundColor 배경색 (기본값: 'bg-background-gray-subtle1')
 */
type CenterAlignedTopAppBarProps = {
  navigationIcon?: ReactNode

  title?: ReactNode

  rightActions?: ReactNode

  applySafeArea?: boolean

  backgroundColor?: string
}

const CenterAlignedTopAppBar = ({
  navigationIcon,
  title,
  rightActions,
  applySafeArea = false,
  backgroundColor = 'bg-background-gray-subtle1',
}: CenterAlignedTopAppBarProps) => {
  const insets = useSafeAreaInsets()
  const topPadding = applySafeArea ? insets.top : 0
  const height = 50 + topPadding

  return (
    <View
      style={{ paddingTop: topPadding, height: height }}
      className={`w-full justify-center ${backgroundColor}`}
    >
      <View
        className={`relative h-[50px] w-full flex-row items-center justify-center ${backgroundColor}`}
      >
        <View className="absolute left-number-9 items-center justify-center">
          {navigationIcon}
        </View>

        <View
          className="absolute left-0 right-0 items-center justify-center"
          pointerEvents="none"
        >
          {title}
        </View>

        <View className="absolute right-number-9 flex-row items-center justify-center">
          {rightActions}
        </View>
      </View>
    </View>
  )
}

export default CenterAlignedTopAppBar
