import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import NoCalendarIcon from '../../../assets/icons/noCalendar.svg'
import PlusIcon from '../../../assets/icons/w-plus.svg'

const EmptyCalendarScrim = ({
  onCreateScheduleClick,
}: {
  onCreateScheduleClick: () => void
}) => {
  return (
    <View className="b-0 absolute z-10 h-full w-full flex-1 items-center justify-center bg-background-dim">
      <View className="flex-col items-center gap-[41px]">
        <NoCalendarIcon />
        <Text className="text-center text-text-disabled body-m">
          {` 아직 생성된 근무표가 없어요.\n근무표를 캘린더에 등록하여\n오프날의 여러 기능을 이용해보세요.`}
        </Text>

        <TouchableOpacity
          onPress={onCreateScheduleClick}
          className="h-[40px] flex-row items-center gap-[5px] rounded-radius-s bg-surface-primary px-number-6"
        >
          <PlusIcon />
          <Text className="items-center text-text-inverse-static body-m">
            {'근무표 생성하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EmptyCalendarScrim
