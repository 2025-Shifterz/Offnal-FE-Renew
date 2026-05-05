import '../../../../global.css'
import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { homeRepository } from '../../../infrastructure/di/Dependencies'
import TopBanner from '../components/TopBanner'
import { Routine } from '../../../domain/models/Routine'
import { Schedule } from '../../../domain/models/Schedule'
import HomeCarePanel from '../components/HomeCarePanel'

export default function MainScreen() {
  const isFirstLoad = useRef(true)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

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
      let isActive = true

      const loadMainData = async () => {
        try {
          if (isFirstLoad.current) {
            setLoading(true)
          } else {
            setRefreshing(true)
          }

          await Promise.all([fetchRoutine(), fetchSchedule()])
        } finally {
          if (isActive) {
            isFirstLoad.current = false
            setLoading(false)
            setRefreshing(false)
          }
        }
      }

      loadMainData()

      return () => {
        isActive = false
      }
    }, [])
  )

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    )
  }

  return (
    <SafeAreaView
      className="flex-1 bg-surface-disabled-inverse"
      edges={['left', 'right', 'top']}
    >
      <View className="flex-1">
        {refreshing && (
          <View className="bg-surface-white/80 absolute right-[20px] top-[12px] z-10 h-[28px] w-[28px] items-center justify-center rounded-radius-max">
            <ActivityIndicator size="small" color="#111111" />
          </View>
        )}

        <ScrollView className="flex-1" bounces={false}>
          {/* <TopCard /> */}
          <TopBanner schdule={schedule ?? null} />

          <HomeCarePanel routine={routine} schedule={schedule} />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
