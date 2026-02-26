import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { HealthData } from '../types/Health'
import { healthRepository } from '../../infrastructure/di/Dependencies'

const useHealthData = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    weight: 0,
    height: 0,
    bmi: 0,
    stepPercentage: 0,
  })

  const fetchHealthData = async () => {
    try {
      const data: HealthData = await healthRepository.getHealthData()
      setHealthData(data)
    } catch (error) {
      Alert.alert('오류', `건강 데이터 가져오기 실패: ${error}`)
      throw new Error('지원하지 않는 플랫폼입니다')
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  return healthData
}

export default useHealthData
