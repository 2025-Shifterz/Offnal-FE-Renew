import { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import {
  androidHealthService,
  iosHealthService,
} from '../../infrastructure/di/Dependencies'
import { HealthData } from '../types/Health'

const useHealthData = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    weight: 0,
    bmi: 0,
  })

  const fetchHealthData = async () => {
    try {
      let data: HealthData
      if (Platform.OS === 'ios') {
        data = await iosHealthService.getIosHealthService()
      } else if (Platform.OS === 'android') {
        // Android Health Service 호출 (추후 구현)
        data = await androidHealthService.getAndroidHealthService()
      } else {
        throw new Error('지원하지 않는 플랫폼입니다')
      }
      setHealthData(data)
    } catch (error) {
      Alert.alert('오류', `건강 데이터 가져오기 실패: ${error}`)
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  return { ...healthData }
}

export default useHealthData
