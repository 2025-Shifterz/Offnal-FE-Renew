import { Dimensions, View, Text } from 'react-native'
import { useState, useEffect } from 'react'
import BackGroundDawn from '../../../assets/cards/bg_dawn.svg'
import BackGroundMorning from '../../../assets/cards/bg_morning.svg'
import BackGroundAfternoon from '../../../assets/cards/bg_afternoon.svg'
import BackGroundEvening from '../../../assets/cards/bg_evening.svg'
// import BackGroundNight from '../../../assets/cards/bg_night.svg';
import BackGroundMidnight from '../../../assets/cards/bg_midnight.svg'
import AppCharacter from '../../../assets/icons/ic_app_character.svg'
import SpeechBubble from '../../../assets/icons/ic_speech_bubble.svg'

const { width: screenWidth } = Dimensions.get('window')

type TimeOfDay =
  | 'dawn'
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'midnight'

const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours()

  if (hour >= 4 && hour < 7) return 'dawn' // 새벽 (04:00-06:59)
  if (hour >= 7 && hour < 12) return 'morning' // 아침 (07:00-11:59)
  if (hour >= 12 && hour < 17) return 'afternoon' // 오후 (12:00-16:59)
  if (hour >= 17 && hour < 20) return 'evening' // 저녁 (17:00-19:59)
  if (hour >= 20 && hour < 24) return 'night' // 밤 (20:00-23:59)
  return 'midnight' // 자정 (00:00-03:59)
}

const getBackgroundComponent = (timeOfDay: TimeOfDay) => {
  switch (timeOfDay) {
    case 'dawn':
      return BackGroundDawn
    case 'morning':
      return BackGroundMorning
    case 'afternoon':
      return BackGroundAfternoon
    case 'evening':
      return BackGroundEvening
    case 'night':
      // return BackGroundNight;
      return BackGroundEvening // bg_night.svg 인식 안되어서 evening으로 대체
    case 'midnight':
      return BackGroundMidnight
    default:
      return BackGroundEvening
  }
}

const TopCard = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay())

  useEffect(() => {
    const updateTimeOfDay = () => {
      const newTimeOfDay = getTimeOfDay()
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay)
      }
    }

    updateTimeOfDay() // 컴포넌트 마운트 시 초기 시간대 설정

    // 1분마다 시간대 업데이트
    const interval = setInterval(() => {
      updateTimeOfDay()
    }, 60000)

    return () => clearInterval(interval)
  }, [timeOfDay])

  const BackgroundComponent = getBackgroundComponent(timeOfDay)

  return (
    <View
      className="w-screen items-center overflow-hidden"
      style={{ position: 'relative', height: 253 }}
    >
      <BackgroundComponent
        width={screenWidth}
        height={253}
        preserveAspectRatio="xMidYMid slice"
      />

      <View
        style={{
          position: 'absolute',
          top: 55,
          left: '50%',
          width: 320,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ translateX: -160 }],
        }}
      >
        <SpeechBubble width={320} height={70} />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 320,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Text className="text-text-disabled-on label-xxs">
            지금은 집중력이 떨어질 수 있어요.{'\n'}
            가벼운 스트레칭이나 물 한 잔 추천드려요.
          </Text>
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          width: 250,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ translateX: -125 }], // 250/2 = 125
        }}
      >
        <AppCharacter width={250} height={120} />
      </View>
    </View>
  )
}

export default TopCard
