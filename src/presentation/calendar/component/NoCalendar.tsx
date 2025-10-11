import React from 'react'
import { Text, View } from 'react-native'
import NoCalendarIcon from '../../../assets/icons/noCalendar.svg'

import { useNavigation } from '@react-navigation/native'
import { calendarNavigation, loginNavigation } from '../../../navigation/types'
import NewCalButton from './NewCalButton'

const NoCalendar = () => {
  const navigation = useNavigation<calendarNavigation>()
  return (
    <View className="b-0 absolute z-10 h-full w-full flex-1 items-center justify-center bg-background-dim">
      <View className="flex-col items-center gap-[41px]">
        <NoCalendarIcon />
        <Text className="text-center text-text-disabled body-m">
          {` 아직 생성된 근무표가 없어요.\n근무표를 캘린더에 등록하여\n오프날의 여러 기능을 이용해보세요.`}
        </Text>
        <NewCalButton
          onCreateSchedule={() =>
            navigation.navigate('LoginScreens', {
              screen: 'SelectRegMethod',
            })
          }
        />
      </View>
    </View>
  )
}

export default NoCalendar
