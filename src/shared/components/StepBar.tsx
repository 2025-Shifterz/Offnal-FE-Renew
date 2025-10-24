import React from 'react'
import { View } from 'react-native'

interface StepHeaderProps {
  currentStep: number // 현재 진행 중인 단계
  totalSteps: number // 전체 스탭의 수
}

const StepBar = ({ currentStep, totalSteps }: StepHeaderProps) => {
  return (
    <View className="w-[160px] flex-row items-center justify-center py-p-card-xs">
      <View className="h-[3px] w-full flex-row gap-[1px]">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= currentStep ? 'bg-surface-primary' : 'bg-surface-gray-subtle2'}`}
          />
        ))}
      </View>
    </View>
  )
}

export default StepBar
