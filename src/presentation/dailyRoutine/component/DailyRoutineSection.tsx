import React from 'react'
import { View } from 'react-native'
import GlobalText from '../../../shared/components/text/GlobalText'
import DailyRoutineCard, { DailyRoutineCardItem } from './DailyRoutineCard'

export type DailyRoutineSectionStatus = 'done' | 'current' | 'ready'

export interface DailyRoutineSectionData {
  title: string
  highlight: string
  status: DailyRoutineSectionStatus
  items: DailyRoutineCardItem[]
}

const statusConfig: Record<
  DailyRoutineSectionStatus,
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
    label: '시작 전',
    dotColor: '#F05F42',
    backgroundColor: '#FDEFEC',
  },
}

const ProgressTag = ({ status }: { status: DailyRoutineSectionStatus }) => {
  const config = statusConfig[status]

  return (
    <View
      className="h-[26px] flex-row items-center justify-center gap-[6px] rounded-radius-max px-[10px] py-[5px]"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <View
        className="h-[4px] w-[4px] rounded-radius-max"
        style={{ backgroundColor: config.dotColor }}
      />
      <GlobalText className="font-pretSemiBold text-heading-xxxxs text-text-subtle">
        {config.label}
      </GlobalText>
    </View>
  )
}

const DailyRoutineSection = ({
  section,
}: {
  section: DailyRoutineSectionData
}) => {
  return (
    <View className="gap-[16px]">
      <View className="h-[26px] flex-row items-center px-[20px]">
        <View className="h-[20px] w-[6px]" />
        <GlobalText className="font-pretSemiBold text-heading-xxs text-text-basic">
          {section.title}
        </GlobalText>
        <GlobalText className="font-pretSemiBold text-heading-xxs text-text-primary">
          {section.highlight}
        </GlobalText>
        <View className="mx-[8px] min-w-0 flex-1 border-t border-dashed border-gray-20" />
        <ProgressTag status={section.status} />
      </View>

      <View className="gap-[12px] px-[20px]">
        {section.items.map(item => (
          <DailyRoutineCard
            key={`${section.highlight}-${item.title}`}
            item={item}
          />
        ))}
      </View>
    </View>
  )
}

export default DailyRoutineSection
