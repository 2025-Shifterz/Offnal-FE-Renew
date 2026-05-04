import { StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MoonIcon from '../../../assets/icons/ic_moon_28.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

const RecommendHealthContentImageView = () => {
  return (
    <LinearGradient
      colors={['#EEF5FF', '#DCEBFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.contentImage}
    >
      <View className="h-[58px] w-[58px] items-center justify-center rounded-radius-max bg-surface-white">
        <MoonIcon width={36} height={36} />
      </View>
    </LinearGradient>
  )
}

const RecommendHealthContentCard = ({ title }: { title: string }) => {
  return (
    <View className="w-[196px] gap-[8px] rounded-radius-xl bg-surface-white p-[10px]">
      <RecommendHealthContentImageView />
      <GlobalText className="text-text-subtle body-xxs" numberOfLines={2}>
        {title}
      </GlobalText>
    </View>
  )
}

const styles = StyleSheet.create({
  contentImage: {
    alignItems: 'center',
    borderRadius: 16,
    height: 100,
    justifyContent: 'center',
    width: '100%',
  },
})

export default RecommendHealthContentCard
