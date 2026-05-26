import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import WheelPickerColumn, {
  WHEEL_PICKER_ITEM_HEIGHT,
  WHEEL_PICKER_PICKER_HEIGHT,
} from '../../../shared/components/picker/WheelPickerColumn'

const periods = ['오전', '오후'] as const
const hours = Array.from({ length: 12 }, (_, index) => `${index + 1}`)
const minutes = Array.from({ length: 60 }, (_, index) =>
  index.toString().padStart(2, '0')
)

type Period = (typeof periods)[number]

interface AlarmWheelTimePickerProps {
  value: Date
  onChange: (nextValue: Date) => void
}

const to24Hour = (period: Period, hour12: number) => {
  if (period === '오전') {
    return hour12 === 12 ? 0 : hour12
  }

  return hour12 === 12 ? 12 : hour12 + 12
}

const AlarmWheelTimePicker = ({
  value,
  onChange,
}: AlarmWheelTimePickerProps) => {
  const timeState = useMemo(() => {
    const hour24 = value.getHours()
    const period: Period = hour24 < 12 ? '오전' : '오후'
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12

    return {
      hour12,
      minute: value.getMinutes(),
      period,
    }
  }, [value])

  const updateTime = (
    nextPeriod: Period,
    nextHour12: number,
    nextMinute: number
  ) => {
    const nextValue = new Date(value)
    nextValue.setHours(to24Hour(nextPeriod, nextHour12))
    nextValue.setMinutes(nextMinute)
    nextValue.setSeconds(0)
    nextValue.setMilliseconds(0)
    onChange(nextValue)
  }

  return (
    <View className="w-full overflow-hidden rounded-radius-xl bg-surface-gray-subtle1">
      <View
        className="absolute left-0 right-0 rounded-radius-l bg-surface-white"
        style={styles.centerBar}
      />

      <View pointerEvents="none" style={styles.fadeTop} />
      <View pointerEvents="none" style={styles.fadeBottom} />

      <View
        className="flex-row items-center justify-center px-[26px]"
        style={{ height: WHEEL_PICKER_PICKER_HEIGHT }}
      >
        <WheelPickerColumn
          currentIndex={timeState.period === '오전' ? 0 : 1}
          data={[...periods]}
          onIndexChange={nextPeriodIndex =>
            updateTime(
              periods[nextPeriodIndex],
              timeState.hour12,
              timeState.minute
            )
          }
          textAlign="left"
          width={96}
        />
        <WheelPickerColumn
          currentIndex={timeState.hour12 - 1}
          data={hours}
          onIndexChange={nextHourIndex =>
            updateTime(timeState.period, nextHourIndex + 1, timeState.minute)
          }
          textAlign="center"
          width={64}
        />
        <WheelPickerColumn
          currentIndex={timeState.minute}
          data={minutes}
          onIndexChange={nextMinute =>
            updateTime(timeState.period, timeState.hour12, nextMinute)
          }
          textAlign="right"
          width={64}
        />
      </View>
    </View>
  )
}

export default AlarmWheelTimePicker

const styles = StyleSheet.create({
  centerBar: {
    height: 48,
    top: (WHEEL_PICKER_PICKER_HEIGHT - 48) / 2,
  },
  fadeBottom: {
    backgroundColor: 'rgba(244, 245, 246, 0.68)',
    bottom: 0,
    height: WHEEL_PICKER_ITEM_HEIGHT * 2,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  fadeTop: {
    backgroundColor: 'rgba(244, 245, 246, 0.68)',
    height: WHEEL_PICKER_ITEM_HEIGHT * 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
})
