import { FC } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import GlobalText from '../../../shared/components/text/GlobalText'

interface HealthMetricCardProps {
  title: string
  value: string
  label?: string | null
  caption?: string
  Icon: FC<SvgProps>
}

const HealthMetricCard = ({
  title,
  value,
  label,
  caption,
  Icon,
}: HealthMetricCardProps) => {
  return (
    <View className="min-h-[141px] flex-1 justify-between rounded-radius-xl bg-surface-white p-p-6">
      <View className="gap-[5px]">
        <GlobalText className="text-heading-xxxxs text-surface-disabled-inverse">
          {title}
        </GlobalText>

        <View className="flex-row items-start gap-[5px]">
          <GlobalText className="text-text-subtle heading-s">
            {value}
          </GlobalText>
          {label && (
            <View className="h-[20px] justify-center rounded-[12px] bg-primary-5 px-[6px]">
              <GlobalText className="text-right text-text-primary heading-xxxxs">
                {label}
              </GlobalText>
            </View>
          )}
        </View>
        {caption && (
          <GlobalText className="text-text-disabled body-xxs" numberOfLines={1}>
            {caption}
          </GlobalText>
        )}
      </View>
      <View className="items-end">
        <Icon width={60} height={60} />
      </View>
    </View>
  )
}

export default HealthMetricCard
