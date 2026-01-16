import dayjs, { Dayjs } from 'dayjs'
import { View } from 'react-native'
import CalendarIcon from '../../../assets/icons/calendar.svg'
import GlobalText from '../GlobalText'

const DateTimeChip = ({ date }: { date: Dayjs }) => {
  const isToday = date.isSame(dayjs(), 'day')

  return (
    <View className="flex-row items-center gap-[5px] rounded-radius-max bg-surface-white px-p-4 py-p-3">
      <CalendarIcon />
      <GlobalText className="text-text-subtle heading-xxxs">
        {isToday ? '오늘' : date.format('YYYY년 M월 D일 (dd)')}
      </GlobalText>
    </View>
  )
}

export default DateTimeChip
