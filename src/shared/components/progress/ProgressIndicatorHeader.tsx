import { View } from 'react-native'

/**
 * ### ProgressIndicatorHeaderProps
 *
 * @param currentProgress 현재 진행률
 * @param totalProgress 전체 진행률
 */
interface ProgressIndicatorHeaderProps {
  currentProgress: number
  totalProgress: number
}

/**
 * ### ProgressIndicatorHeader
 *
 * 진행률을 나타내는 컴포넌트
 *
 * @param currentProgress 현재 진행률
 * @param totalProgress 전체 진행률
 */
const ProgressIndicatorHeader = ({
  currentProgress,
  totalProgress,
}: ProgressIndicatorHeaderProps) => {
  return (
    <View className="w-[160px] flex-row items-center justify-between py-p-card-xs">
      <View className="h-[3px] w-full flex-row gap-[1px]">
        {Array.from({ length: totalProgress }).map((_, i) => (
          <View
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= currentProgress ? 'bg-surface-primary' : 'bg-surface-gray-subtle2'}`}
          />
        ))}
      </View>
    </View>
  )
}

export default ProgressIndicatorHeader
