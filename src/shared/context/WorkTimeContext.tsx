import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface WorkTime {
  D: { startTime: string; endTime: string }
  E: { startTime: string; endTime: string }
  N: { startTime: string; endTime: string }
}

export const WorkTimeContext = createContext<{
  workTimes: WorkTime
  setWorkTimes: React.Dispatch<React.SetStateAction<WorkTime>>
} | null>(null)

export const useWorkTime = () => {
  const context = useContext(WorkTimeContext)
  if (!context)
    throw new Error('useWorkTime must be used within WorkTimeProvider')
  return context
}

export const WorkTimeProvider = ({ children }: { children: ReactNode }) => {
  const [workTimes, setWorkTimes] = useState<WorkTime>({
    D: { startTime: '09:00', endTime: '18:00' },
    E: { startTime: '15:00', endTime: '23:00' },
    N: { startTime: '22:00', endTime: '07:00' },
  })

  return (
    <WorkTimeContext.Provider value={{ workTimes, setWorkTimes }}>
      {children}
    </WorkTimeContext.Provider>
  )
}
