import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { HealthData } from '../types/Health'
import { healthRepository } from '../../infrastructure/di/Dependencies'

const INITIAL_DATA: HealthData = {
  steps: 0,
  weight: 0,
  height: 0,
  bmi: 0,
  stepPercentage: 0,
}

const useHealthData = () => {
  const [healthData, setHealthData] = useState<HealthData>(INITIAL_DATA)

  const fetchHealthData = async () => {
    try {
      const data: HealthData = await healthRepository.getHealthData()
      setHealthData(data)
    } catch (error) {
      console.error('Failed to fetch health data:', error)
      Alert.alert('알림', '건강 데이터를 불러올 수 없어 0으로 표시합니다.')
      setHealthData(INITIAL_DATA) // 에러 발생 시 기본값으로 셋팅
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  return healthData
}

export default useHealthData
