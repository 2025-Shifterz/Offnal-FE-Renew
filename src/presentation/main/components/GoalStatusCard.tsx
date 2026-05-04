import dayjs from 'dayjs'
import { useMemo } from 'react'
import { View } from 'react-native'
import GlobalText from '../../../shared/components/text/GlobalText'
import CheckIcon from '../../../assets/icons/ic_checked.svg'
import CheckStreakIcon from '../../../assets/icons/ic_goal_streak.svg'

type GoalState = 'missed' | 'streak' | 'done'

interface GoalStatusCardProps {
  states: GoalState[]
}

interface GoalStatusIconProps {
  state: GoalState
}

export const GoalStatusIcon = ({ state }: GoalStatusIconProps) => {
  switch (state) {
    case 'missed':
      return (
        <View className="h-[32px] w-[32px] rounded-radius-max border border-alpha-inverse10 bg-surface-gray-subtle1" />
      )
    case 'streak':
      return (
        <View className="h-[43px] w-[32px] items-center justify-center rounded-[18px]">
          <CheckStreakIcon />
        </View>
      )
    case 'done':
      return (
        <View className="h-[32px] w-[32px] items-center justify-center rounded-[18px] bg-[#96E5ED]">
          <CheckIcon width={15} height={13} />
        </View>
      )
  }
}

const GoalStatusCard = ({ states }: GoalStatusCardProps) => {
  const today = useMemo(() => dayjs(), [])
  const weekDays = useMemo(() => {
    const monday = today.subtract((today.day() + 6) % 7, 'day')
    return Array.from({ length: 7 }, (_, i) => monday.add(i, 'day'))
  }, [today])

  return (
    <View className="rounded-radius-xl bg-surface-white px-number-8 py-number-7">
      <View className="gap-g-5 px-number-6">
        <View className="flex-row justify-between">
          {weekDays.map(day => (
            <View
              key={day.format('YYYY-MM-DD')}
              className="w-[32px] items-center gap-g-3"
            >
              <GlobalText className="text-heading-xxxxs text-gray-60">
                {['일', '월', '화', '수', '목', '금', '토'][day.day()]}
              </GlobalText>
              <GlobalText className="text-heading-xxxs text-gray-80">
                {day.date()}
              </GlobalText>
            </View>
          ))}
        </View>
        <View className="h-[43px] flex-row items-end justify-between">
          {states.map((state, index) => (
            <GoalStatusIcon key={`${state}-${index}`} state={state} />
          ))}
        </View>
      </View>
    </View>
  )
}

export default GoalStatusCard
