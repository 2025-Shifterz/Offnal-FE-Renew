import { ReactNode } from 'react'
import { TouchableOpacity, View } from 'react-native'
import GlobalText from './GlobalText'
import IconNavigationBack from '../../assets/icons/black-arrow-l.svg'

/**
 * ### TopAppBarProps
 *
 * Top App Bar의 Props
 *
 * @param title 제목
 * @param showBackButton 뒤로가기 버튼을 보이게 할 건지 결정하는 설정
 * @param onPressBackButton 뒤로가기 버튼 클릭 시 동작
 * @param rightActions Action 버튼 (React Node)
 * */
type TopAppBarProps = {
  title: string

  showBackButton?: boolean

  onPressBackButton?: () => void

  rightActions?: ReactNode
}

const TopAppBar = ({
  title,
  showBackButton,
  onPressBackButton,
  rightActions,
}: TopAppBarProps) => {
  return (
    <View className="h-[50px] w-full items-center justify-center">
      {showBackButton && (
        <TouchableOpacity
          onPress={onPressBackButton}
          className="absolute left-number-8"
        >
          <IconNavigationBack width={24} height={24} />
        </TouchableOpacity>
      )}
      <View
        className="absolute left-0 right-0 items-center justify-center"
        pointerEvents="none"
      >
        <GlobalText className="font-pretSemiBold text-heading-xs">
          {title}
        </GlobalText>
      </View>

      {rightActions && (
        <View className="absolute right-number-8 items-center justify-center">
          {rightActions}
        </View>
      )}
    </View>
  )
}

export default TopAppBar
