import React from 'react'
import { View } from 'react-native'
// import DayWorkIcon from '../../../assets/icons/day-work-icon.svg'
// import EveningWorkIcon from '../../../assets/icons/evening-work-icon.svg' // 추가 필요
import NightWorkIcon from '../../../assets/icons/ic_night-work.svg'
// import NoWorkIcon from '../../../assets/icons/no-work-icon.svg' // 추가 필요

import AlarmIcon from '../../../assets/icons/ic_home_alarm.svg'
import { Text } from 'react-native'

interface HomeChipContentProps {
  chipTitle: string
  workType?: string
  alarmTime?: string
}

const HomeChipContent = ({
  chipTitle,
  workType,
  alarmTime,
}: HomeChipContentProps) => {
  const WorkTypeIconComponent = () => {
    switch (workType) {
      case '주간':
        return '<DayWorkIcon />'
      case '오후':
        return '<EveningWorkIcon />'
      case '야간':
        return <NightWorkIcon />
      case '휴무':
        return '<NoWorkIcon />'
      default:
        return '<NoWorkIcon />'
    }
  }
  return (
    <View className="flex-col items-center justify-center gap-[4px]">
      <Text className="text-gray-90 body-xxs">{chipTitle}</Text>
      <View className="flex-row items-center gap-[5px]">
        {workType && (
          <>
            <WorkTypeIconComponent />
            <Text className="text-text-primary heading-xs">{`${workType} 근무`}</Text>
          </>
        )}
        {alarmTime && (
          <>
            <AlarmIcon />
            <Text className="text-text-primary heading-xs">{`${alarmTime}`}</Text>
          </>
        )}
      </View>
    </View>
  )
}

export default HomeChipContent
