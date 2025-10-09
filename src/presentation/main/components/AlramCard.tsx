import { View, Text } from 'react-native'
import AlramSleepIcon from '../../../assets/icons/ic_alram_sleep_50.svg'

const NothingRegistered = () => {
  return (
    <View className="flex-col items-center justify-items-center rounded-radius-xl bg-white py-number-9">
      <AlramSleepIcon />
      <Text className="mt-number-9 text-text-disabled body-xxs">
        아직 등록된 알람이 없어요
      </Text>
      <Text className="text-text-disabled body-xxs">
        근무일정에 맞는 자동알람을 등록하세요
      </Text>
    </View>
  )
}

export default { NothingRegistered }
