import '../../../../global.css'
import React, { useCallback, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { homeRepository } from '../../../infrastructure/di/Dependencies'
import TopBanner from '../components/TopBanner'
import { Routine } from '../../../domain/models/Routine'
import { Schedule } from '../../../domain/models/Schedule'
import HomeCarePanel from '../components/HomeCarePanel'

export default function MainScreen() {
  const [loading, setLoading] = useState(true)

  const [routine, setRoutine] = useState<Routine>()
  const [schedule, setSchedule] = useState<Schedule>()

  const fetchRoutine = async () => {
    try {
      const nextRoutine = await homeRepository.getRoutine()
      setRoutine(nextRoutine)
    } catch (error) {
      console.error('루틴 데이터 불러오기 실패:', error)
    }
  }

  const fetchSchedule = async () => {
    try {
      const nextSchedule = await homeRepository.getSchedule()
      setSchedule(nextSchedule)
    } catch (error) {
      console.error('스케쥴 데이터 불러오기 실패:', error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      try {
        setLoading(true)

        fetchRoutine()
        fetchSchedule()
      } finally {
        setLoading(false)
      }
      return () => {}
    }, [])
  )

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text style={{ color: 'white' }}>로딩 중...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface-disabled-inverse"
      edges={['left', 'right', 'top']}
    >
      <ScrollView className="flex-1" bounces={false}>
        {/* <TopCard /> */}
        <TopBanner schdule={schedule ?? null} />

        <HomeCarePanel routine={routine} schedule={schedule} />
      </ScrollView>
    </SafeAreaView>
  )
}
