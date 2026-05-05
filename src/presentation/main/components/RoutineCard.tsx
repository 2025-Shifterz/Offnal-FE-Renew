import { Pressable, View } from 'react-native'
import GlobalText from '../../../shared/components/text/GlobalText'
import Pill from '../../../shared/components/Pill'
import React from 'react'
import {
  RoutineIllustration,
  RoutineIllustrationName,
  routineIllustrationBackgroundColors,
} from '../../../shared/components/routine/RoutineIllustration'
import type {
  RoutineCardContent,
  RoutineCardContentItem,
  RoutineStatus,
} from '../../../shared/components/routine/routineContent'

export type RoutineItemProps = RoutineCardContentItem

export type RoutineCardProps = RoutineCardContent & {
  onPress?: () => void
}

const RoutineStatusMap: Record<
  RoutineStatus,
  { label: string; dotColor: string; backgroundColor: string }
> = {
  done: {
    label: '수행 완료',
    dotColor: '#3FA654',
    backgroundColor: '#EAF6EC',
  },
  current: {
    label: '진행 중',
    dotColor: '#2098F3',
    backgroundColor: '#E7F4FE',
  },
  ready: {
    label: '예정',
    dotColor: '#8A949E',
    backgroundColor: '#F4F5F6',
  },
}

const RoutineIcon = ({
  illustration,
  backgroundColor,
}: {
  illustration: RoutineIllustrationName
  backgroundColor?: string
}) => (
  <View
    className="h-[40px] w-[40px] items-center justify-center rounded-radius-max border border-dashed border-gray-20"
    style={{
      backgroundColor:
        backgroundColor ?? routineIllustrationBackgroundColors[illustration],
    }}
  >
    <RoutineIllustration illustration={illustration} size={28} />
  </View>
)

const RoutineConnector = () => (
  <View className="h-[18px] w-[40px] items-center justify-center">
    <View className="h-full border-l border-dashed border-gray-20" />
  </View>
)

const RoutineStatusPill = ({ status }: { status: RoutineStatus }) => {
  const config = RoutineStatusMap[status]

  return (
    <View
      className="flex-row items-center gap-[6px] rounded-radius-max px-[10px] py-[5px]"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <View
        className="h-[4px] w-[4px] rounded-radius-max"
        style={{ backgroundColor: config.dotColor }}
      />
      <GlobalText className="text-text-subtle heading-xxxxs">
        {config.label}
      </GlobalText>
    </View>
  )
}

const RoutineItemRow = ({ item }: { item: RoutineItemProps }) => {
  return (
    <View className="h-[44px] w-full flex-row items-center gap-[12px] py-[2px]">
      <RoutineIcon
        illustration={item.illustration}
        backgroundColor={item.backgroundColor}
      />
      <View className="min-w-0 flex-1 gap-[2px]">
        <View className="w-full flex-row items-center justify-between gap-[8px]">
          <GlobalText className="text-text-bolder heading-xxxs">
            {item.title}
          </GlobalText>
          <GlobalText className="text-right text-text-disabled body-xxs">
            {item.time}
          </GlobalText>
        </View>
        <GlobalText
          className="text-text-disabled-on body-xxs"
          numberOfLines={1}
        >
          {item.description}
        </GlobalText>
      </View>
    </View>
  )
}

const RoutineCardView = ({
  title,
  status,
  items,
  onPress,
}: RoutineCardProps) => {
  const Container = onPress ? Pressable : View

  return (
    <Container
      className="w-[320px] rounded-radius-xl bg-surface-white p-number-6"
      {...(onPress ? { onPress, accessibilityRole: 'button' as const } : {})}
    >
      <View className="mb-[16px] flex-row items-center justify-between gap-[8px]">
        <Pill>{title}</Pill>
        <View className="min-w-0 flex-1 border-t border-dashed border-gray-20" />
        <RoutineStatusPill status={status} />
      </View>

      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <RoutineItemRow item={item} />
          {index < items.length - 1 && <RoutineConnector />}
        </React.Fragment>
      ))}
    </Container>
  )
}

export default RoutineCardView
