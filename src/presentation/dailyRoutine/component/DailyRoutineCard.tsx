import React from 'react'
import { Pressable, View } from 'react-native'
import CheckIcon from '../../../assets/icons/ic_checked.svg'
import GlobalText from '../../../shared/components/text/GlobalText'
import {
  RoutineIllustration,
  RoutineIllustrationName,
  routineIllustrationBackgroundColors,
} from '../../../shared/components/routine/RoutineIllustration'
import type {
  DailyRoutineCardContentItem,
  DailyRoutineDescriptionContent,
  DailyRoutineState,
} from '../../../shared/components/routine/routineContent'

export type DailyRoutineDescription = DailyRoutineDescriptionContent

export type DailyRoutineCardItem = DailyRoutineCardContentItem

interface DailyRoutineCardProps {
  item: DailyRoutineCardItem
  onPress?: () => void
  disabled?: boolean
}

const cardShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 2,
}

const RoutineIcon = ({
  illustration,
  backgroundColor,
}: {
  illustration: RoutineIllustrationName
  backgroundColor?: string
}) => {
  return (
    <View
      className="h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-radius-max border-[0.5px] border-border-gray"
      style={{
        backgroundColor:
          backgroundColor ?? routineIllustrationBackgroundColors[illustration],
      }}
    >
      <RoutineIllustration illustration={illustration} />
    </View>
  )
}

const GoalCheck = ({ state = 'todo' }: { state?: DailyRoutineState }) => {
  switch (state) {
    case 'done':
      return (
        <View className="h-[32px] w-[32px] items-center justify-center rounded-[18px] bg-[#96E5ED]">
          <CheckIcon width={15} height={13} />
        </View>
      )
    case 'todo':
      return (
        <View className="h-[32px] w-[32px] rounded-radius-max border border-alpha-inverse10 bg-surface-gray-subtle1" />
      )
  }
}

const DescriptionLine = ({
  description,
}: {
  description: DailyRoutineDescription
}) => (
  <View className="w-full flex-row items-center gap-[4px]">
    <View className="h-[2px] w-[2px] rounded-radius-max bg-text-subtle" />
    <GlobalText
      className="min-w-0 flex-1 font-pretMedium text-body-xxs text-text-subtle"
      numberOfLines={1}
    >
      {description.prefix}
      {description.emphasis ? (
        <GlobalText className="font-pretMedium text-body-xxs text-text-primary">
          {description.emphasis}
        </GlobalText>
      ) : null}
      {description.suffix}
    </GlobalText>
  </View>
)

const DailyRoutineCard = ({
  item,
  onPress,
  disabled = false,
}: DailyRoutineCardProps) => {
  const isHighlighted = item.highlighted === true
  const isPressable = typeof onPress === 'function' && !disabled
  const Container = isPressable ? Pressable : View

  return (
    <Container
      className={`w-full flex-row items-center gap-[16px] rounded-radius-xl px-[16px] ${item.compact ? 'py-[12px]' : 'py-[16px]'} ${isHighlighted ? 'border border-border-primary bg-surface-primary-light' : 'bg-surface-white'} ${item.faded ? 'opacity-50' : ''}`}
      style={cardShadow}
      {...(isPressable
        ? {
            onPress,
            accessibilityRole: 'button' as const,
            accessibilityState: { disabled: false },
          }
        : {
            accessibilityState: disabled ? { disabled: true } : undefined,
          })}
    >
      <RoutineIcon
        illustration={item.illustration}
        backgroundColor={item.backgroundColor}
      />

      <View className="min-w-0 flex-1 gap-[8px]">
        <View className="gap-[2px]">
          <GlobalText className="font-pretSemiBold text-heading-xxs text-text-basic">
            {item.title}
          </GlobalText>
          <GlobalText className="font-pretMedium text-body-xs text-text-subtle">
            {item.time}
          </GlobalText>
        </View>

        <View className="gap-[2px]">
          {item.descriptions.map((description, index) => (
            <DescriptionLine
              key={`${item.title}-${index}`}
              description={description}
            />
          ))}
        </View>
      </View>

      <GoalCheck state={item.state} />
    </Container>
  )
}

export default DailyRoutineCard
