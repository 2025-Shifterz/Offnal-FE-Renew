import { FC } from 'react'
import { SvgProps } from 'react-native-svg'

interface RoutineCardProps {
  title: string
  status: RoutineStatus
  items: RoutineItemProps[]
}

type RoutineStatus = 'done' | 'current' | 'ready'

interface RoutineItemProps {
  title: string
  time: string
  description: string
  icon: FC<SvgProps>
  backgroundColor: string
}

const RoutineCard = () => {}
