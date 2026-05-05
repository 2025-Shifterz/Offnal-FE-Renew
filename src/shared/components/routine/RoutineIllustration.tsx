import React, { FC } from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'
import BedIcon from '../../../assets/icons/ic_bed.svg'
import FireIcon from '../../../assets/icons/ic_fire.svg'
import FoodIcon from '../../../assets/icons/ic_meal.svg'
import ReadyForWorkIcon from '../../../assets/icons/ic_readyforwork.svg'
import RestIcon from '../../../assets/icons/ic_rest.svg'
import SnackIcon from '../../../assets/icons/ic_snack.svg'
import WaterIcon from '../../../assets/icons/ic_working.svg'
import WorkingIcon from '../../../assets/icons/ic_water.svg'

export type RoutineIllustrationName =
  | 'bed'
  | 'food'
  | 'water'
  | 'snack'
  | 'fire'
  | 'working'
  | 'rest'
  | 'readyforwork'

type RoutineIllustrationLayout = {
  size: number
  translateX?: number
  translateY?: number
}

const illustrationIcons: Record<RoutineIllustrationName, FC<SvgProps>> = {
  bed: BedIcon,
  food: FoodIcon,
  water: WaterIcon,
  snack: SnackIcon,
  fire: FireIcon,
  working: WorkingIcon,
  rest: RestIcon,
  readyforwork: ReadyForWorkIcon,
}

const illustrationLayouts: Record<
  RoutineIllustrationName,
  RoutineIllustrationLayout
> = {
  bed: { size: 28 },
  food: { size: 28 },
  water: { size: 28 },
  snack: { size: 28 },
  fire: { size: 28 },
  working: { size: 28 },
  rest: { size: 28 },
  readyforwork: { size: 28, translateX: -2 },
}

export const routineIllustrationBackgroundColors: Record<
  RoutineIllustrationName,
  string
> = {
  bed: '#F6F3FF',
  food: '#FFFAF2',
  water: '#F0FFFC',
  snack: '#EEFFF2',
  fire: '#FFF7F4',
  working: '#F9F9F9',
  rest: '#E8FBFF',
  readyforwork: '#FFFFF3',
}

export const RoutineIllustration = ({
  illustration,
  size,
  translateX,
  translateY,
}: {
  illustration: RoutineIllustrationName
  size?: number
  translateX?: number
  translateY?: number
}) => {
  const Icon = illustrationIcons[illustration]
  const layout = illustrationLayouts[illustration]
  const resolvedSize = size ?? layout.size
  const resolvedTranslateX =
    typeof translateX === 'number' ? translateX : layout.translateX
  const resolvedTranslateY =
    typeof translateY === 'number' ? translateY : layout.translateY

  return (
    <View
      style={{
        transform: [
          ...(typeof resolvedTranslateX === 'number'
            ? [{ translateX: resolvedTranslateX }]
            : []),
          ...(typeof resolvedTranslateY === 'number'
            ? [{ translateY: resolvedTranslateY }]
            : []),
        ],
      }}
    >
      <Icon width={resolvedSize} height={resolvedSize} />
    </View>
  )
}
