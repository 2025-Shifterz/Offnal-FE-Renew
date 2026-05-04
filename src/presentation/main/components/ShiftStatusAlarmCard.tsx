import { View } from 'react-native'

import AlarmIcon from '../../../assets/icons/ic_home_alarm.svg'
import { getWorkTypeMeta } from '../../../shared/constants/workType'
import GlobalText from '../../../shared/components/text/GlobalText'

interface ShiftStatusAlarmCardProps {
  workTypeCode?: string | null
}

interface ShiftStatusContentProps {
  title: string
  workTypeCode?: string | null
}

const ShiftStatusAlarmCard = ({ workTypeCode }: ShiftStatusAlarmCardProps) => {
  return (
    <View className="flex-row items-center rounded-[20px] bg-surface-white px-[12px] py-[14px]">
      <View className="flex-1 items-center justify-center">
        <ShiftStatusContent
          title="오늘의 근무 형태"
          workTypeCode={workTypeCode}
        />
      </View>
      <View className="h-[30px] w-[1px] bg-[#C8D1A9]" />
      <View className="flex-1 items-center justify-center">
        <AlarmStatusContent title="다음 알람 예정 시간" content="미정" />
      </View>
    </View>
  )
}

const ShiftStatusContent = ({
  title,
  workTypeCode,
}: ShiftStatusContentProps) => {
  const { Icon, label } = getWorkTypeMeta(workTypeCode)

  return (
    <View className="flex-col items-center justify-center gap-[7px]">
      <GlobalText className="text-text-basic body-xxs">{title}</GlobalText>
      <View className="flex-row items-center gap-[5px]">
        <Icon />
        <GlobalText className="text-text-primary heading-xs">
          {label}
        </GlobalText>
      </View>
    </View>
  )
}

const AlarmStatusContent = ({
  title,
  content,
}: {
  title: string
  content: string
}) => {
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

export default ShiftStatusAlarmCard
