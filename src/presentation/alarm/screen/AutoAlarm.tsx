import { Text, View, TouchableOpacity } from 'react-native'
import AlarmClock from '../../../assets/icons/ic_clock.svg'

const AutoAlarm = () => {
  return (
    <>
      {/* <AlarmHeaderNoList headerText="자동 알람" /> */}
      <View className="flex-1 items-center justify-center">
        <AlarmClock width={96} height={96} />
        <View className="mt-4 items-center justify-center py-5">
          <Text className="text-text-disabled body-m">
            아직 등록된 기상 알람이 없어요.
          </Text>
          <Text className="text-text-disabled body-m">
            근무일정에 맞는 자동알람을 등록해보세요!
          </Text>
        </View>
        <TouchableOpacity className="mt-5 h-fit w-fit rounded-radius-m1 bg-surface-primary px-2.5 py-2.5">
          <Text className="text-text-inverse-static body-m">
            + 새 알림 추가하기
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default AutoAlarm
