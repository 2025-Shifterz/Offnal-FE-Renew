import { View } from 'react-native'
import GlobalText from '../../../shared/components/text/GlobalText'

const SectionTitle = ({
  title,
  highlight,
}: {
  title: string
  highlight?: string
}) => {
  return (
    <View className="w-full flex-row items-center px-number-9">
      <View className="h-[20px] w-[6px]" />
      <GlobalText className="flex-1 text-text-basic heading-xxs">
        {title}
        {highlight && (
          <GlobalText className="text-text-primary">{highlight}</GlobalText>
        )}
      </GlobalText>
    </View>
  )
}

export default SectionTitle
