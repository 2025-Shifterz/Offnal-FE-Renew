import { Text, View } from 'react-native'
import HomeChipContent from './HomeChipContent'
import DividerLine from '../../../assets/icons/divider-line_gray.svg'

interface HomeWorkTypeChipProps {
  workType: string
}

const HomeWorkTypeChip: React.FC<HomeWorkTypeChipProps> = ({ workType }) => {
  return (
    <View className="h-[75px] flex-1 flex-row items-center justify-between rounded-[20px] bg-white">
      <View className="w-full flex-[0.5] items-center justify-center">
        <HomeChipContent chipTitle={'오늘의 근무 형태'} workType={'야간'} />
      </View>
      <DividerLine />
      <View className="w-full flex-[0.5] items-center justify-center">
        <HomeChipContent
          chipTitle={'다음 알람 예정 시간'}
          alarmTime={'오후 2시'}
        />
      </View>
    </View>
  )
}

export default HomeWorkTypeChip
