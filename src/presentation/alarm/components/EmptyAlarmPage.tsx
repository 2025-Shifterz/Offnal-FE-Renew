import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import AlarmClock from '../../../assets/icons/ic_clock.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

type NoAlarmPageProps = {
  handleShowAlarmList: () => void
}

const NoAlarmPage = ({ handleShowAlarmList }: NoAlarmPageProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <AlarmClock width={96} height={96} />
      <View className="mt-4 items-center justify-center py-5">
        <GlobalText className="text-text-disabled body-m">
          아직 등록된 기상 알람이 없어요.
        </GlobalText>
        <GlobalText className="text-text-disabled body-m">
          근무일정에 맞는 자동알람을 등록해보세요!
        </GlobalText>
      </View>
      <TouchableOpacity
        onPress={handleShowAlarmList}
        className="rounded-radius-m1 mt-5 h-fit w-fit bg-surface-primary px-2.5 py-2.5"
      >
        <GlobalText className="text-text-inverse-static body-m">
          + 새 알림 추가하기
        </GlobalText>
      </TouchableOpacity>
    </View>
  )
}

export default NoAlarmPage
