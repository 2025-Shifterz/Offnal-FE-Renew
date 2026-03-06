import { useEffect, useState } from 'react'

import { HealthData } from '../types/Health'
import { healthRepository } from '../../infrastructure/di/Dependencies'

const useHealthData = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    weight: 0,
    bmi: 0,
    stepPercentage: 0,
  })
  const [isError, setIsError] = useState(false)

  const fetchHealthData = async () => {
    try {
      setIsError(false)
      const data: HealthData = await healthRepository.getHealthData()
      setHealthData(data)
    } catch (err) {
      console.error('Failed to fetch health data:', err)
      setIsError(true)
    }
  }

  useEffect(() => {
    fetchHealthData()
  }, [])

  return { healthData, isError }
}

export default useHealthData
