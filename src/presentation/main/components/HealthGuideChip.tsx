import { Text, View } from 'react-native'

import BedIcon from '../../../assets/icons/ic_bed_24.svg'
import HourGlassIcon from '../../../assets/icons/ic_hourglass_24.svg'

import React from 'react'

enum HealthGuideType {
  SLEEP = 'SLEEP',
  FASTING_TIME = 'FASTING_TIME',
}

interface HealthGuideChipProps {
  healthGuideType: HealthGuideType
  guideContent: string
  guideTime: string
}

const HealthGuideChip: React.FC<HealthGuideChipProps> = ({
  healthGuideType,
  guideContent,
  guideTime,
}) => {
  const HealthGuideIconComponent = () => {
    switch (healthGuideType) {
      case HealthGuideType.SLEEP:
        return <BedIcon />
      case HealthGuideType.FASTING_TIME:
        return <HourGlassIcon />
      default:
        return <HourGlassIcon />
    }
  }

  const HealthGuideChipTitle =
    healthGuideType === HealthGuideType.SLEEP
      ? '수면 일정'
      : healthGuideType === HealthGuideType.FASTING_TIME
        ? '공복 시간'
        : '기타'

  return (
    <View className="flex-1 items-start justify-center rounded-radius-s bg-surface-white p-number-6 shadow-shadow-blur-3">
      {/* 상단: 아이콘과 제목 */}
      <View className="flex-row items-center justify-start pb-number-4">
        <HealthGuideIconComponent />
        <Text className="pl-number-3 text-text-subtle heading-xxxxs">
          {HealthGuideChipTitle}
        </Text>
      </View>

      {/* 중간 */}
      <Text
        className="mb-number-5 text-text-disabled label-xxs"
        numberOfLines={3}
      >
        {guideContent}
      </Text>

      {/* 하단 */}
      <Text className="text-text-basic heading-xxs">{guideTime}</Text>
    </View>
  )
}

export default HealthGuideChip
export { HealthGuideType }
