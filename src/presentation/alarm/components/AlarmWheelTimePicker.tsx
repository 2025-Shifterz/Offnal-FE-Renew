import { useEffect, useMemo, useRef } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native'
import GlobalText from '../../../shared/components/GlobalText'

const ITEM_HEIGHT = 41
const VISIBLE_ROWS = 5
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS
const SIDE_PADDING_ROWS = Math.floor(VISIBLE_ROWS / 2)

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

const clampIndex = (index: number, maxIndex: number) => {
  if (index < 0) {
    return 0
  }
  if (index > maxIndex) {
    return maxIndex
  }
  return index
}

type WheelColumnProps = {
  currentIndex: number
  data: string[]
  onIndexChange: (index: number) => void
  textAlign: 'center' | 'left' | 'right'
  width: number
}

const WheelColumn = ({
  currentIndex,
  data,
  onIndexChange,
  textAlign,
  width,
}: WheelColumnProps) => {
  const listRef = useRef<FlatList<string>>(null)

  useEffect(() => {
    listRef.current?.scrollToOffset({
      animated: false,
      offset: currentIndex * ITEM_HEIGHT,
    })
  }, [currentIndex])

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT)
    const nextIndex = clampIndex(rawIndex, data.length - 1)
    onIndexChange(nextIndex)
  }

  return (
    <FlatList
      ref={listRef}
      bounces={false}
      data={data}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        index,
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
      })}
      keyExtractor={(item, index) => `${item}-${index}`}
      onMomentumScrollEnd={onMomentumEnd}
      onScrollEndDrag={onMomentumEnd}
      renderItem={({ item, index }) => {
        const distance = Math.abs(index - currentIndex)
        const opacity = distance === 0 ? 1 : distance === 1 ? 0.82 : 0.38
        return (
          <View style={styles.item}>
            <GlobalText
              className="font-pretSemiBold text-text-subtle heading-l"
              style={{ opacity, textAlign }}
            >
              {item}
            </GlobalText>
          </View>
        )
      }}
      showsVerticalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={ITEM_HEIGHT}
      style={{ width }}
      contentContainerStyle={{
        paddingVertical: SIDE_PADDING_ROWS * ITEM_HEIGHT,
      }}
    />
  )
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
        style={styles.body}
      >
        <WheelColumn
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
        <WheelColumn
          currentIndex={timeState.hour12 - 1}
          data={hours}
          onIndexChange={nextHourIndex =>
            updateTime(timeState.period, nextHourIndex + 1, timeState.minute)
          }
          textAlign="center"
          width={64}
        />
        <WheelColumn
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
  body: {
    height: PICKER_HEIGHT,
  },
  centerBar: {
    height: 48,
    top: (PICKER_HEIGHT - 48) / 2,
  },
  fadeBottom: {
    backgroundColor: 'rgba(244,245,246,0.68)',
    bottom: 0,
    height: ITEM_HEIGHT * 2,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  fadeTop: {
    backgroundColor: 'rgba(244,245,246,0.68)',
    height: ITEM_HEIGHT * 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  item: {
    alignItems: 'center',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
})
