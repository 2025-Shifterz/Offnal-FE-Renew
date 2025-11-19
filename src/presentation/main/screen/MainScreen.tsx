import '../../../../global.css'
import React, { useCallback, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AlramSection from '../ui/AlramSection'
import HealthGuideSection from '../ui/HealthGuideSection'
import RecommnedMealSection from '../ui/RecommendMealSection'
import NoteSection from '../ui/NoteSection'
import HealthCardSection from '../ui/HealthCardSection'
import dayjs from 'dayjs'
import { useFocusEffect } from '@react-navigation/native'
import {
  getMemosByDateUseCase,
  getToDosByDateUseCase,
} from '../../../infrastructure/di/Dependencies'
import { HomeResponse } from '../../../infrastructure/remote/response/homeResponse'
import TopBanner from '../components/TopBanner'
import { Todo } from '../../../domain/models/Todo'
import { Memo } from '../../../domain/models/Memo'

export default function MainScreen() {
  const [loading, setLoading] = useState(true)

  const [homeData] = useState<HomeResponse['data'] | null>(null)
  const [todos, setTodo] = useState<Todo[]>()
  const [memos, setMemos] = useState<Memo[]>()

  const fetchHome = async () => {
    try {
      // const data = await homeRepository.getHome()
      const todos = await getToDosByDateUseCase.execute(dayjs())
      const memos = await getMemosByDateUseCase.execute(dayjs())

      // setHomeData(data)
      setMemos(memos)
      setTodo(todos)
    } catch (error) {
      console.error('홈 데이터 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHome()

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
    <SafeAreaView className="flex-1 bg-surface-disabled-inverse">
      <ScrollView className="flex-1" bounces={false}>
        {/* <TopCard /> */}
        <TopBanner />

        <View className="items-top flex-1 justify-start rounded-t-radius-l bg-background-gray-subtle1 p-number-8">
          <RecommnedMealSection
            meals={(homeData?.todayRoutine?.meals as any) ?? []}
          />
          <HealthGuideSection
            health={(homeData?.todayRoutine?.health as any) ?? null}
          />
          <AlramSection alarms={[]} />
          <HealthCardSection />
          <NoteSection todos={todos} memos={memos} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
