import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'
import ArrowUp from '../../../assets/icons/arrow-up.svg'
import ArrowDown from '../../../assets/icons/arrow-down.svg'
import { useScheduleInfoStore } from '../../../store/useScheduleInfoStore'
import { WorkTime } from '../../../shared/types/WorkTime'

const pickerTextStyle = 'text-text-basic body-s font-[500px]'

interface TimePickerProps {
  type: 'D' | 'E' | 'N'
  mode: 'startTime' | 'endTime'
}

const parseTimeString = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  let hour = h
  let period: '오전' | '오후' = '오전'

  if (h === 0) {
    hour = 12 // 오전 12시
    period = '오전'
  } else if (h === 12) {
    hour = 12
    period = '오후'
  } else if (h > 12) {
    hour = h - 12
    period = '오후'
  } else {
    hour = h
    period = '오전'
  }

  return { hour, minute: m, period }
}

const TimePicker = ({ type, mode }: TimePickerProps) => {
  const [workTimes] = useState<WorkTime>({
    D: { startTime: '08:00', endTime: '16:00' },
    E: { startTime: '16:00', endTime: '00:00' },
    N: { startTime: '00:00', endTime: '08:00' },
    '-': { startTime: '', endTime: '' },
  })
  const { setWorkTimes } = useScheduleInfoStore()
  const workTimeString = workTimes[type][mode] || '08:00'
  const {
    hour: initHour,
    minute: initMinute,
    period: initPeriod,
  } = parseTimeString(workTimeString)

  const [showPicker, setShowPicker] = useState(false)
  const [hour, setHour] = useState(initHour)
  const [minute, setMinute] = useState(initMinute)
  const [period, setPeriod] = useState(initPeriod) // 오전/오후
  const [isConfirmed, setIsConfirmed] = useState(false)

  const confirmedStyle = isConfirmed ? 'text-text-subtle' : 'text-text-disabled'
  const sharedPlaceholderStyle = `rounded-radius-s w-[84px] border border-background-gray-subtle1 p-[8px] label-xs ${confirmedStyle}`

  // 초기값 설정
  // workTimes의 (08:00) -> period, hour, minute 로 바꾸기

  const onPressConfirm = () => {
    setShowPicker(false)
    setIsConfirmed(true)
    // 오전, 오후에 따라 선택한 시간을 문자열로 포맷
    let convertedHour = hour
    if (period === '오후') {
      convertedHour = (hour % 12) + 12
    } else if (hour === 12) {
      convertedHour = 0 // 오전 12시는 00시
    }
    const selectedTime = `${convertedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

    setWorkTimes(type, mode, selectedTime)
  }

  // 시가 바뀔 때 자동으로 오전/오후가 바뀌도록 반영
  const increaseHour = () => {
    setHour(prev => {
      const next = (prev % 12) + 1
      if (prev === 11) {
        setPeriod(p => (p === '오전' ? '오후' : '오전'))
      }
      return next
    })
  }
  const decreaseHour = () => {
    setHour(prev => {
      const next = ((prev - 2 + 12) % 12) + 1
      if (prev === 12) {
        setPeriod(p => (p === '오전' ? '오후' : '오전'))
      }
      return next
    })
  }

  // 분이 바뀔 때 자동으로 시도 바뀌도록 반영
  const increaseMinute = () => {
    setMinute(prev => {
      if (prev === 59) {
        increaseHour() // 59 -> 0으로 지날 때 시간도 함꼐 증가
        return 0
      }
      return prev + 1
    })
  }
  const decreaseMinute = () => {
    setMinute(prev => {
      if (prev === 0) {
        decreaseHour() // 0 -> 59으로 지날 때 시간도 함꼐 감소
        return 59
      }
      return prev - 1
    })
  }

  return (
    <View>
      <Text
        className={sharedPlaceholderStyle}
        onPress={() => setShowPicker(true)}
      >
        {`${period} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
      </Text>

      {showPicker && (
        <View
          className="absolute z-10 w-[124px] flex-row items-center gap-3 rounded-radius-s bg-surface-white px-[10px] py-[6px]"
          style={{
            shadowColor: 'rgba(191, 191, 191, 0.25)',
            shadowOpacity: 1,
            shadowRadius: 20,
            elevation: 4, // 안드로이드용
          }}
        >
          <>
            {/* 오전 / 오후 */}
            <View className="items-center">
              {/* <Text onPress={() => setPeriod(period === '오전' ? '오후' : '오전')}>🔄</Text> */}
              <Text className={pickerTextStyle}>{period}</Text>
            </View>

            {/* 시 */}
            <View className="items-center">
              <ArrowUp onPress={increaseHour} />
              <Text className={pickerTextStyle}>
                {hour.toString().padStart(2, '0')}
              </Text>
              <ArrowDown onPress={decreaseHour} />
            </View>

            <Text>:</Text>

            {/* 분 */}
            <View className="items-center">
              <ArrowUp onPress={increaseMinute} />
              <Text className={pickerTextStyle}>
                {minute.toString().padStart(2, '0')}
              </Text>
              <ArrowDown onPress={decreaseMinute} />
            </View>

            {/* 완료  */}
            <Button title="완료" onPress={onPressConfirm} />
          </>
        </View>
      )}
    </View>
  )
}

export default TimePicker
