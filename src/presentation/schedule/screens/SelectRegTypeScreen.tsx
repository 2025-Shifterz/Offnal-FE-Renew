import { Text, View } from 'react-native'
import Camera from '../../../assets/icons/camera.svg'
import CalendarYellow from '../../../assets/icons/calendar_yellow.svg'
import CalendarBlue from '../../../assets/icons/calendar_blue.svg'
import RegMethod from '../component/RegMethod'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/types'

const ScheduleRegRegisterMethod = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  return (
    <View className="h-full w-full flex-1 items-center bg-background-gray-subtle1 px-p-6">
      <View>
        <Text className="mt-[57px] text-text-bolder heading-m">
          오프날에 오신걸 환영해요!{`\n`}근무표를 어떤 방법으로 입력할까요?
        </Text>
        <Text className="mb-number-9 pt-number-7 text-text-subtle label-xs">
          회사 근무표 검색 기능은 추후 추가될 예정이에요.
        </Text>

        <RegMethod
          Icon={Camera}
          title="근무표 사진 찍어서 자동 등록하기"
          subtitle="사진 찍기 또는 앨범에서 선택해 AI로 근무표를 자동 등록해요"
          onPress={() => navigation.navigate('OnboardingSchedulesWithOCR')}
        />

        <RegMethod
          Icon={CalendarYellow}
          title="근무표 새로 만들기"
          subtitle="지금 바로 직접 근무표를 만들고 시작해요"
          onPress={() => navigation.navigate('OnboardingSchedules')}
        />

        <RegMethod
          Icon={CalendarBlue}
          title="근무표 없이 시작하기"
          subtitle="지금은 근무표 없이 시작하고, 나중에 등록할 수 있어요"
          onPress={() => navigation.navigate('Tabs')}
        />
      </View>
    </View>
  )
}

export default ScheduleRegRegisterMethod
