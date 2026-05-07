import '../../../../global.css'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { ScrollView, View } from 'react-native'
import GlobalText from '../../../shared/components/text/GlobalText'
import {
  RootStackParamList,
  rootNavigation,
} from '../../../navigation/types/StackTypes'
import DailyRoutineSection, {
  DailyRoutineSectionData,
} from '../component/DailyRoutineSection'
import CenterAlignedTopAppBar from '../../../shared/components/appbar/CenterAlignedTopAppBar'
import TopAppBarBackButton from '../../../shared/components/button/TopAppBarBackButton'
import EmphasizedButton from '../../../shared/components/button/Button'
import { useCurrentTimeTick } from '../../../shared/hooks/useCurrentTimeTick'
import {
  buildDailyRoutineSections,
  RoutineDay,
} from '../../../shared/components/routine/routineContent'
import { useRoutineStore } from '../../../store/useRoutineStore'
import DailyRoutineCompletionBottomSheet, {
  DailyRoutineCompletionBottomSheetMethods,
} from '../component/DailyRoutineCompletionBottomSheet'

type FloatingRoutineActionButtonProps = {
  onPress: () => void
  content: React.ReactNode
}

const FloatingRoutineActionButton = ({
  onPress,
  content,
}: FloatingRoutineActionButtonProps) => {
  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0 z-20"
    >
      <View className="px-[20px] pb-[32px]">
        <EmphasizedButton content={content} onPress={onPress} />
      </View>
    </View>
  )
}

const DailyRoutineHeader = ({ navigation, route }: NativeStackHeaderProps) => {
  const day = (route.params as { day?: RoutineDay } | undefined)?.day
  const isTomorrow = day === 'tomorrow'

  return (
    <CenterAlignedTopAppBar
      title={
        <GlobalText className="font-pretSemiBold text-heading-xs">
          {isTomorrow ? '내일의 루틴' : '오늘의 루틴'}
        </GlobalText>
      }
      navigationIcon={<TopAppBarBackButton onPress={navigation.goBack} />}
      backgroundColor="bg-background-gray-subtle1"
      applySafeArea={true}
    />
  )
}

const DailyRoutineScreen = () => {
  const navigation = useNavigation<rootNavigation>()
  const route = useRoute<RouteProp<RootStackParamList, 'DailyRoutine'>>()
  const [routineDay, setRoutineDay] = useState<RoutineDay>(
    route.params?.day ?? 'today'
  )
  const currentTimeMillis = useCurrentTimeTick()
  const completionBottomSheetRef =
    useRef<DailyRoutineCompletionBottomSheetMethods>(null)
  const hasShownCompletionSheetRef = useRef(false)
  const shouldShowCompletionSheetAfterToggleRef = useRef(false)
  const [isCompletionBottomSheetOpen, setIsCompletionBottomSheetOpen] =
    useState(false)
  const completionByDay = useRoutineStore(state => state.completionByDay)
  const toggleRoutineCompletion = useRoutineStore(
    state => state.toggleRoutineCompletion
  )
  const isTomorrow = routineDay === 'tomorrow'
  const dailySections = useMemo(
    () =>
      buildDailyRoutineSections({
        routineDay,
        completionByDay,
        nowMillis: currentTimeMillis,
      }),
    [completionByDay, currentTimeMillis, routineDay]
  )

  const handleToggleRoutineDay = () => {
    const nextRoutineDay = isTomorrow ? 'today' : 'tomorrow'
    setRoutineDay(nextRoutineDay)
    navigation.setParams({ day: nextRoutineDay })
  }

  const handleToggleCompletion = useCallback(
    (itemId: string) => {
      shouldShowCompletionSheetAfterToggleRef.current = routineDay === 'today'
      toggleRoutineCompletion(routineDay, itemId)
    },
    [routineDay, toggleRoutineCompletion]
  )

  const isItemDisabled = useCallback(
    (item: DailyRoutineSectionData['items'][number]) => {
      return item.timePosition === 'past'
    },
    []
  )

  const handleCompletionBottomSheetChange = useCallback((index: number) => {
    setIsCompletionBottomSheetOpen(index >= 0)
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({ header: DailyRoutineHeader })
  }, [navigation])

  const isTodayRoutineCompleted = useMemo(() => {
    if (routineDay !== 'today') {
      return false
    }

    const routineItems = dailySections.flatMap(section => section.items)

    return (
      routineItems.length > 0 &&
      routineItems.every(item => item.state === 'done')
    )
  }, [dailySections, routineDay])

  useEffect(() => {
    if (!isTodayRoutineCompleted) {
      hasShownCompletionSheetRef.current = false
      shouldShowCompletionSheetAfterToggleRef.current = false
      setIsCompletionBottomSheetOpen(false)
      return
    }

    if (
      hasShownCompletionSheetRef.current ||
      !shouldShowCompletionSheetAfterToggleRef.current
    ) {
      return
    }

    hasShownCompletionSheetRef.current = true
    shouldShowCompletionSheetAfterToggleRef.current = false
    setIsCompletionBottomSheetOpen(true)
    completionBottomSheetRef.current?.open()
  }, [isTodayRoutineCompleted])

  return (
    <View className="flex-1 bg-background-white">
      <ScrollView
        className="flex-1 bg-background-gray-subtle1"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-[24px] pb-[140px] pt-[4px]"
      >
        {dailySections.map(section => (
          <DailyRoutineSection
            key={section.id}
            section={section}
            onPressItem={item => handleToggleCompletion(item.id)}
            isItemDisabled={isItemDisabled}
          />
        ))}
      </ScrollView>

      {!isCompletionBottomSheetOpen && (
        <FloatingRoutineActionButton
          onPress={handleToggleRoutineDay}
          content={
            <GlobalText className="font-pretMedium text-body-m text-text-bolder-inverse">
              {isTomorrow ? '오늘 루틴 확인하기' : '내일 루틴 확인하기'}
            </GlobalText>
          }
        />
      )}

      <DailyRoutineCompletionBottomSheet
        ref={completionBottomSheetRef}
        onChange={handleCompletionBottomSheetChange}
      />
    </View>
  )
}

export default DailyRoutineScreen
