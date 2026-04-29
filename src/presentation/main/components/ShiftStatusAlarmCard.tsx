import { View } from 'react-native'

import DayWorkIcon from '../../../assets/icons/ic_night-work.svg'
import EveningWorkIcon from '../../../assets/icons/ic_night-work.svg'
import NightWorkIcon from '../../../assets/icons/ic_night-work.svg'
import NoWorkIcon from '../../../assets/icons/ic_night-work.svg'
import AlarmIcon from '../../../assets/icons/ic_home_alarm.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

interface ShiftStatusAlarmCardProps {
  workType: string
}

interface ShiftStatusContentProps {
  title: string
  content: string
}

const ShiftStatusAlarmCard = ({ workType }: ShiftStatusAlarmCardProps) => {
  return (
    <View className="flex-row items-center rounded-[20px] bg-surface-white px-[12px] py-[14px]">
      <View className="flex-1 items-center justify-center">
        <ShiftStatusContent title="오늘의 근무 형태" content={workType} />
      </View>
      <View className="h-[30px] w-[1px] bg-[#C8D1A9]" />
      <View className="flex-1 items-center justify-center">
        <AlarmStatusContent title="다음 알람 예정 시간" content="오후 2시" />
      </View>
    </View>
  )
}

const ShiftStatusContent = ({ title, content }: ShiftStatusContentProps) => {
  return (
    <View className="flex-col items-center justify-center gap-[7px]">
      <GlobalText className="text-text-basic body-xxs">{title}</GlobalText>
      <View className="flex-row items-center gap-[5px]">
        {workTypeIcon(content)}
        <GlobalText className="text-text-primary heading-xs">
          {content}
        </GlobalText>
      </View>
    </View>
  )
}

const AlarmStatusContent = ({ title, content }: ShiftStatusContentProps) => {
  return (
    <View className="flex-col items-center justify-center gap-[7px]">
      <GlobalText className="text-text-basic body-xxs">{title}</GlobalText>
      <View className="flex-row items-center gap-[5px]">
        <AlarmIcon />
        <GlobalText className="text-text-primary heading-xs">
          {content}
        </GlobalText>
      </View>
    </View>
  )
}

const workTypeIcon = (params: string) => {
  switch (params) {
    case '주간 근무':
      return <DayWorkIcon />
    case '오후 근무':
      return <EveningWorkIcon />
    case '야간 근무':
      return <NightWorkIcon />
    case '휴무':
      return <NoWorkIcon />
    default:
      return <NoWorkIcon />
  }
}

export default ShiftStatusAlarmCard
