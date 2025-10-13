import { Text, View } from 'react-native'

import TodayWorkIcon from '../../../assets/icons/ic_today_work_24.svg'
import PastWorkIcon from '../../../assets/icons/ic_yesterday_work_24.svg'
import UpcomingWorkIcon from '../../../assets/icons/ic_upcoming_work_24.svg'

import clsx from 'clsx'

enum DayType {
  PAST = 'PAST',
  TODAY = 'TODAY',
  UPCOMMING = 'UPCOMMING',
}

interface HomeWorkTypeChipProps {
  dayType: DayType
  workType: string
}

const HomeWorkTypeChip: React.FC<HomeWorkTypeChipProps> = ({
  dayType,
  workType,
}) => {
  const containerClassName = clsx(
    'flex-row items-center justify-center bg-background-gray-subtle1 ps-number-7 pe-number-7 pt-number-5 py-number-5 rounded-radius-s',
    {
      'bg-background-gray-subtle1': dayType === DayType.PAST,
      'bg-surface-information-subtle': dayType === DayType.TODAY,
      'bg-surface-success-subtle': dayType === DayType.UPCOMMING,
    }
  )

  const chipDescriptionClassName = clsx('text-heading-xxxs pt-number-3', {
    'text-text-subtle': dayType === DayType.PAST,
    'text-text-information': dayType === DayType.TODAY,
    'text-text-success': dayType === DayType.UPCOMMING,
  })

  const WorkTypeIconComponent = () => {
    switch (dayType) {
      case DayType.PAST:
        return <PastWorkIcon />
      case DayType.TODAY:
        return <TodayWorkIcon />
      case DayType.UPCOMMING:
        return <UpcomingWorkIcon />
      default:
        return <UpcomingWorkIcon />
    }
  }

  const chipTitle =
    dayType === DayType.PAST
      ? '어제 근무'
      : dayType === DayType.TODAY
        ? '오늘 근무'
        : '내일 근무'

  return (
    <View className={containerClassName}>
      <View className="flex-row items-center justify-center">
        <WorkTypeIconComponent />
      </View>
      <View className="flex-col items-start justify-center ps-number-8">
        <Text className="text-text-subtle-inverse heading-xxxs">
          {chipTitle}
        </Text>
        <Text className={chipDescriptionClassName}>{workType}</Text>
      </View>
    </View>
  )
}

export default HomeWorkTypeChip
export { DayType }
