import '../../../../global.css'
import React, { useCallback, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import HealthGuideSection from '../ui/HealthGuideSection'
import RecommnedMealSection from '../ui/RecommendMealSection'
import NoteSection from '../ui/NoteSection'
import HealthCardSection from '../ui/HealthCardSection'
import dayjs from 'dayjs'
import { useFocusEffect } from '@react-navigation/native'
import {
  getMemosByDateUseCase,
  homeRepository,
  todoRepository,
} from '../../../infrastructure/di/Dependencies'
import TopBanner from '../components/TopBanner'
import { Todo } from '../../../domain/models/Todo'
import { Memo } from '../../../domain/models/Memo'
import { Routine } from '../../../domain/models/Routine'
import { Schedule } from '../../../domain/models/Schedule'

export default function MainScreen() {
  const [loading, setLoading] = useState(true)

  const [routine, setRoutine] = useState<Routine>()
  const [schedule, setSchedule] = useState<Schedule>()
  const [todos, setTodo] = useState<Todo[]>()
  const [memos, setMemos] = useState<Memo[]>()

  const fetchRoutine = async () => {
    try {
      const routine = await homeRepository.getRoutine()
      setRoutine(routine)
    } catch (error) {
      console.error('루틴 데이터 불러오기 실패:', error)
    }
  }

  const fetchSchedule = async () => {
    try {
      const schedule = await homeRepository.getSchedule()
      setSchedule(schedule)
    } catch (error) {
      console.error('스케쥴 데이터 불러오기 실패:', error)
    }
  }

  const fetchMemos = async () => {
    try {
      const memos = await getMemosByDateUseCase.execute(dayjs())
      setMemos(memos)
    } catch (error) {
      console.error('메모 데이터 불러오기 실패:', error)
    }
  }

  const fetchTodos = async () => {
    try {
      const todos = await todoRepository.getTodosByDate(dayjs())
      setTodo(todos)
    } catch (error) {
      console.error('할일 데이터 불러오기 실패:', error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      try {
        setLoading(true)

        fetchRoutine()
        fetchSchedule()
        fetchMemos()
        fetchTodos()
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
    <SafeAreaView className="flex-1 bg-surface-disabled-inverse">
      <ScrollView className="flex-1" bounces={false}>
        {/* <TopCard /> */}
        <TopBanner schdule={schedule ?? null} />

        <View className="items-top flex-1 justify-start rounded-t-radius-l bg-background-gray-subtle1 p-number-8">
          <RecommnedMealSection meals={(routine?.meals as any) ?? []} />
          <HealthGuideSection health={(routine?.health as any) ?? null} />
          <HealthCardSection />
          <NoteSection todos={todos} memos={memos} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
