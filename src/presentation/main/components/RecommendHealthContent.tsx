import { Pressable, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { cssInterop } from 'nativewind'
import MoonIcon from '../../../assets/icons/ic_moon_28.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

cssInterop(LinearGradient, {
  className: 'style',
})

const RecommendHealthContentImageView = () => {
  return (
    <LinearGradient
      className="h-[100px] w-full items-center justify-center rounded-radius-xl"
      colors={['#EEF5FF', '#DCEBFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="h-[58px] w-[58px] items-center justify-center rounded-radius-max bg-surface-white">
        <MoonIcon width={36} height={36} />
      </View>
    </LinearGradient>
  )
}

type RecommendHealthContentCardProps = {
  title: string
  onPress?: () => void
}

const RecommendHealthContentCard = ({
  title,
  onPress,
}: RecommendHealthContentCardProps) => {
  return (
    <Pressable
      className="w-[196px] gap-[8px] rounded-radius-xl bg-surface-white p-[10px]"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <RecommendHealthContentImageView />
      <GlobalText className="text-text-subtle body-xxs" numberOfLines={2}>
        {title}
      </GlobalText>
    </Pressable>
  )
}

export default RecommendHealthContentCard
