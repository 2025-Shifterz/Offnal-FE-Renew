import '../../../../global.css'
import React, { useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg'
import MoreIcon from '../../../assets/icons/alarm_three-dot_24.svg'
import BedIcon from '../../../assets/icons/ic_routine_bed.svg'
import FoodIcon from '../../../assets/icons/ic_routine_food.svg'
import MealIcon from '../../../assets/icons/ic_routine_meal.svg'
import ReadyForWorkIcon from '../../../assets/icons/ic_routine_ready_for_work.svg'
import RestIcon from '../../../assets/icons/ic_routine_rest.svg'
import SnackIcon from '../../../assets/icons/ic_routine_snack.svg'
import WaterIcon from '../../../assets/icons/ic_routine_water.svg'
import WorkingIcon from '../../../assets/icons/ic_routine_working.svg'
import GlobalText from '../../../shared/components/text/GlobalText'
import {
  RootStackParamList,
  rootNavigation,
} from '../../../navigation/types/StackTypes'
import DailyRoutineSection, {
  DailyRoutineSectionData,
} from '../component/DailyRoutineSection'

type RoutineDay = 'today' | 'tomorrow'

const DAILY_ROUTINE_SECTIONS: DailyRoutineSectionData[] = [
  {
    title: '오늘 나의',
    highlight: ' 출근 전 루틴',
    status: 'done',
    items: [
      {
        title: '낮잠',
        time: '15:00 ~ 20:00',
        Icon: BedIcon,
        iconBackgroundColor: '#F6F3FF',
        descriptions: [
          { prefix: '5~6시간 수면 확보' },
          { prefix: '암막커튼, 귀마개로 수면환경 조성' },
        ],
        state: 'done',
        faded: true,
        compact: true,
      },
      {
        title: '식사',
        time: '20:00 ~ 21:00',
        Icon: MealIcon,
        iconBackgroundColor: '#FFFAF2',
        descriptions: [
          {
            prefix: '추천 메뉴: ',
            emphasis: '현미밥, 생선구이, 채소',
          },
          { prefix: '근무 전 균형식으로 에너지 충전' },
        ],
        state: 'todo',
        compact: true,
      },
      {
        title: '출근 준비',
        time: '21:00 ~ 22:30',
        Icon: ReadyForWorkIcon,
        iconBackgroundColor: '#FFFFF3',
        descriptions: [
          { prefix: '샤워와 스트레칭으로 각성' },
          { prefix: '밝은 조명 아래 가볍게 몸 깨우기' },
        ],
        state: 'done',
        compact: true,
      },
    ],
  },
  {
    title: '오늘 나의',
    highlight: ' 근무 중 루틴',
    status: 'current',
    items: [
      {
        title: '근무 집중 구간',
        time: '23:00 ~ 01:00',
        Icon: WorkingIcon,
        iconBackgroundColor: '#F9F9F9',
        descriptions: [
          { prefix: '카페인은 01시 이전까지만 허용' },
          { prefix: '중간 스트레칭으로 졸음 예방' },
        ],
        state: 'done',
      },
      {
        title: '간식',
        time: '01:00 ~ 02:00',
        Icon: SnackIcon,
        iconBackgroundColor: '#EEFFF2',
        descriptions: [
          {
            prefix: '추천 메뉴: ',
            emphasis: '삶은 달걀, 두유, 통곡물빵',
          },
          { prefix: '고지방·고당류 음식은 피하기' },
        ],
        state: 'done',
        highlighted: true,
      },
      {
        title: '공복 유지 + 수분 보충',
        time: '02:00 ~ 06:00',
        Icon: WaterIcon,
        iconBackgroundColor: '#F0FFFC',
        descriptions: [
          { prefix: '위 부담 줄이기' },
          { prefix: '물·보리차 중심 수분 보충' },
        ],
        state: 'done',
      },
    ],
  },
  {
    title: '오늘 나의',
    highlight: ' 퇴근 후 루틴',
    status: 'ready',
    items: [
      {
        title: '귀가 후 식사',
        time: '07:00 ~ 07:30',
        Icon: FoodIcon,
        iconBackgroundColor: '#FFFAF2',
        descriptions: [
          { prefix: '추천 메뉴:', emphasis: ' 죽, 오트밀' },
          { prefix: '과식 피하고 따뜻하게 섭취' },
        ],
        state: 'done',
      },
      {
        title: '회복 수면',
        time: '08:00 ~ 13:00',
        Icon: BedIcon,
        iconBackgroundColor: '#F6F3FF',
        descriptions: [
          { prefix: '5시간 숙면, 조명 낮추고 공복 1시간 유지' },
          { prefix: '온도 18~20℃로 쾌적하게' },
        ],
        state: 'done',
      },
      {
        title: '리듬 회복',
        time: '13:00 ~ 14:00',
        Icon: RestIcon,
        iconBackgroundColor: '#E8FBFF',
        descriptions: [
          { prefix: '햇빛 노출 + 가벼운 산책' },
          { prefix: '휴일엔 생체리듬 되돌리기 좋은 시간대' },
        ],
        state: 'done',
      },
    ],
  },
]

const Header = ({
  title,
  onPressBack,
}: {
  title: string
  onPressBack: () => void
}) => (
  <View className="h-[50px] flex-row items-center justify-between px-[12px]">
    <Pressable
      className="h-[36px] w-[36px] items-center justify-center rounded-radius-max"
      onPress={onPressBack}
    >
      <ArrowLeftIcon width={24} height={24} />
    </Pressable>
    <GlobalText className="font-pretSemiBold text-[18px] leading-[24px] text-text-basic">
      {title}
    </GlobalText>
    <Pressable className="h-[36px] w-[36px] items-center justify-center rounded-radius-max">
      <MoreIcon width={24} height={24} />
    </Pressable>
  </View>
)

const DailyRoutineScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const route = useRoute<RouteProp<RootStackParamList, 'DailyRoutine'>>()
  const [routineDay, setRoutineDay] = useState<RoutineDay>(
    route.params?.day ?? 'today'
  )
  const isTomorrow = routineDay === 'tomorrow'

  return (
    <SafeAreaView
      className="flex-1 bg-background-white"
      edges={['top', 'left', 'right']}
    >
      <Header
        title={isTomorrow ? '내일의 루틴' : '오늘의 루틴'}
        onPressBack={navigation.goBack}
      />

      <ScrollView
        className="flex-1 bg-background-gray-subtle1"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-[24px] pb-[32px] pt-[4px]"
      >
        {DAILY_ROUTINE_SECTIONS.map(section => (
          <DailyRoutineSection key={section.highlight} section={section} />
        ))}

        <View className="px-[20px] pt-[4px]">
          <Pressable
            className="h-[52px] items-center justify-center rounded-radius-xl bg-action-primary"
            onPress={() => setRoutineDay(isTomorrow ? 'today' : 'tomorrow')}
          >
            <GlobalText className="font-pretSemiBold text-body-m text-text-bolder-inverse">
              {isTomorrow ? '오늘 루틴 확인하기' : '내일 루틴 확인하기'}
            </GlobalText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DailyRoutineScreen
