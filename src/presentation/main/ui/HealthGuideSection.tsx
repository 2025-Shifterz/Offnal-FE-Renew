import { View, Text } from 'react-native'
import TitleSection from '../components/TitleSection'
import HealthGuideChip, { HealthGuideType } from '../components/HealthGuideChip'
import { useState } from 'react'
import TooltipBubble from '../components/Tooltip'
import Bed from '../../../assets/icons/ic_bed.svg'
import HourGlass from '../../../assets/icons/ic_hourglass.svg'

interface Health {
  fastingComment: string
  fastingSchedule: string
  sleepGuide: string[]
  sleepSchedule: string
}

interface HealthGuideSectionProps {
  health?: Health | null
}

const HealthGuideSection = ({ health }: HealthGuideSectionProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip)
  }

  const isEmpty =
    !health || (!health.sleepGuide?.length && !health.fastingComment)

  return (
    <View className="flex-col justify-start gap-y-number-7">
      <TitleSection.WithTooltipIcon
        title="오늘의 건강 가이드"
        onPressIcon={toggleTooltip}
      />

      {showTooltip && (
        <TooltipBubble
          style={{
            left: '50%',
            transform: [{ translateX: -100 }],
            top: 40,
          }}
        >
          식사 추천은 근무 형태에 맞춤으로 제공됩니다.
        </TooltipBubble>
      )}

      <View className="w-full flex-row items-center gap-g-3 pb-number-8">
        {isEmpty ? (
          <>
            <View className="h-[102px] w-full flex-1 items-center justify-center rounded-radius-m1 bg-surface-white p-number-6">
              <HourGlass
                width={26}
                height={36.9258}
                className="pb-[1.75px] pt-[1.31px]"
              />
              <Text className="pt-number-6 text-text-disabled body-xxs">
                아직 근무표가 등록되지 않아{'\n'}공복 시간 추천이 불가해요.
              </Text>
            </View>
            <View className="h-[102px] w-full flex-1 items-center justify-center rounded-radius-m1 bg-surface-white p-number-6">
              <Bed
                width={35.0006}
                height={36.5409}
                className="pb-[1.75px] pt-[1.31px]"
              />
              <Text className="pt-number-6 text-text-disabled body-xxs">
                아직 근무표가 등록되지 않아{'\n'}수면 시간 추천이 불가해요.
              </Text>
            </View>
          </>
        ) : (
          <>
            <HealthGuideChip
              healthGuideType={HealthGuideType.SLEEP}
              guideContent={health?.sleepGuide?.join(' ') ?? ''}
              guideTime={health?.sleepSchedule ?? ''}
            />
            <HealthGuideChip
              healthGuideType={HealthGuideType.FASTING_TIME}
              guideContent={health?.fastingComment ?? ''}
              guideTime={health?.fastingSchedule ?? ''}
            />
          </>
        )}
      </View>
    </View>
  )
}

export default HealthGuideSection
