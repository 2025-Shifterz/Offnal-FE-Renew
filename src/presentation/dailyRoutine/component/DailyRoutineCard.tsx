import React, { FC } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import CheckIcon from '../../../assets/icons/ic_routine_check.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

export type DailyRoutineState = 'done' | 'todo'

export interface DailyRoutineDescription {
  prefix?: string
  emphasis?: string
  suffix?: string
}

export interface DailyRoutineCardItem {
  title: string
  time: string
  Icon: FC<SvgProps>
  iconBackgroundColor: string
  descriptions: DailyRoutineDescription[]
  state?: DailyRoutineState
  highlighted?: boolean
  faded?: boolean
  compact?: boolean
}

const cardShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 2,
}

const RoutineIcon = ({
  Icon,
  backgroundColor,
}: {
  Icon: FC<SvgProps>
  backgroundColor: string
}) => (
  <View
    className="h-[40px] w-[40px] items-center justify-center rounded-radius-max border-[0.5px] border-dashed border-border-gray"
    style={{ backgroundColor }}
  >
    <Icon width={28} height={28} />
  </View>
)

const GoalCheck = ({ state = 'done' }: { state?: DailyRoutineState }) => {
  if (state === 'todo') {
    return (
      <View className="h-[32px] w-[32px] rounded-radius-max border border-alpha-inverse10 bg-surface-gray-subtle1" />
    )
  }

  return (
    <View className="h-[32px] w-[32px] items-center justify-center rounded-[18px] bg-primary-30">
      <CheckIcon width={10} height={10} />
    </View>
  )
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

const DailyRoutineCard = ({ item }: { item: DailyRoutineCardItem }) => {
  const isHighlighted = item.highlighted === true

  return (
    <View
      className={`w-full flex-row items-center gap-[16px] rounded-radius-xl px-[16px] ${
        item.compact ? 'py-[12px]' : 'py-[16px]'
      } ${
        isHighlighted
          ? 'border border-border-primary bg-surface-primary-light'
          : 'bg-surface-white'
      } ${item.faded ? 'opacity-50' : ''}`}
      style={cardShadow}
    >
      <RoutineIcon
        Icon={item.Icon}
        backgroundColor={item.iconBackgroundColor}
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
    </View>
  )
}

export default DailyRoutineCard
