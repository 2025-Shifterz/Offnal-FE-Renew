import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import GlobalText from '../../../shared/components/GlobalText'
import ToggleSwitch from '../../../shared/components/ToggleSwitch'
import SortBottomSheet, {
  AlarmSortOption,
  SortBottomSheetMethods,
} from './SortBottomSheet'

type ShiftType = '주간' | '오후' | '야간' | '휴일'

export interface AlarmListItem {
  id: string
  shiftType: ShiftType
  etaText: string
  meridiem: '오전' | '오후'
  time: string
  enabled: boolean
}

interface FilledAlarmPageProps {
  initialItems?: AlarmListItem[]
  onItemsChange?: (items: AlarmListItem[]) => void
}

const defaultAlarmItems: AlarmListItem[] = [
  {
    id: '1',
    shiftType: '주간',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '4:30',
    enabled: true,
  },
  {
    id: '2',
    shiftType: '주간',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '4:30',
    enabled: true,
  },
  {
    id: '3',
    shiftType: '주간',
    etaText: '11시간 54분 후',
    meridiem: '오전',
    time: '4:40',
    enabled: false,
  },
  {
    id: '4',
    shiftType: '오후',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '8:30',
    enabled: true,
  },
  {
    id: '5',
    shiftType: '오후',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '8:35',
    enabled: true,
  },
  {
    id: '6',
    shiftType: '오후',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '9:40',
    enabled: false,
  },
  {
    id: '7',
    shiftType: '야간',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '4:30',
    enabled: true,
  },
  {
    id: '8',
    shiftType: '야간',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '4:30',
    enabled: true,
  },
  {
    id: '9',
    shiftType: '휴일',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '4:30',
    enabled: true,
  },
  {
    id: '10',
    shiftType: '휴일',
    etaText: '11시간 44분 후',
    meridiem: '오전',
    time: '4:30',
    enabled: true,
  },
  {
    id: '11',
    shiftType: '휴일',
    etaText: '11시간 44분 후',
    meridiem: '오후',
    time: '13:40',
    enabled: false,
  },
  {
    id: '12',
    shiftType: '야간',
    etaText: '11시간 44분 후',
    meridiem: '오후',
    time: '18:20',
    enabled: false,
  },
]

const tagStyleMap: Record<
  ShiftType,
  { backgroundClass: string; textClass: string }
> = {
  주간: {
    backgroundClass: 'bg-surface-secondary-subtle',
    textClass: 'text-text-basic',
  },
  오후: {
    backgroundClass: 'bg-surface-success-subtle',
    textClass: 'text-text-success',
  },
  야간: {
    backgroundClass: 'bg-surface-information-subtle',
    textClass: 'text-text-information',
  },
  휴일: {
    backgroundClass: 'bg-surface-danger-subtle',
    textClass: 'text-text-danger',
  },
}

const getTagClassName = (item: AlarmListItem) => {
  if (!item.enabled) {
    return {
      backgroundClass: 'bg-surface-gray-subtle2',
      textClass: 'text-text-disabled-on',
    }
  }
  return tagStyleMap[item.shiftType]
}

const shiftSortOrder: Record<ShiftType, number> = {
  주간: 0,
  오후: 1,
  야간: 2,
  휴일: 3,
}

const parseEtaToMinutes = (etaText: string) => {
  const hourMatch = etaText.match(/(\d+)시간/)
  const minuteMatch = etaText.match(/(\d+)분/)
  const hours = hourMatch ? Number(hourMatch[1]) : 0
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0
  return hours * 60 + minutes
}

const AlarmItemDivider = () => (
  <View className="h-[0.5px] w-full bg-divider-gray-light" />
)

const StickySortIcon = () => (
  <View className="h-[16px] w-[16px] items-center justify-center">
    <View className="h-[1.6px] w-[11.8px] rounded-radius-max bg-text-subtle" />
    <View className="mt-[2px] h-[1.6px] w-[11.8px] rounded-radius-max bg-text-subtle" />
    <View className="mt-[2px] h-[1.6px] w-[7.4px] rounded-radius-max bg-text-subtle" />
  </View>
)

const FilledAlarmPage = ({
  initialItems = defaultAlarmItems,
  onItemsChange,
}: FilledAlarmPageProps) => {
  const sortBottomSheetRef = useRef<SortBottomSheetMethods>(null)
  const [items, setItems] = useState<AlarmListItem[]>(initialItems)
  const [sortOption, setSortOption] = useState<AlarmSortOption>('remaining')

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const onToggleItem = (id: string, nextValue: boolean) => {
    setItems(previousItems => {
      const nextItems = previousItems.map(item =>
        item.id === id ? { ...item, enabled: nextValue } : item
      )
      onItemsChange?.(nextItems)
      return nextItems
    })
  }

  const onPressEnableAll = () => {
    setItems(previousItems => {
      const nextItems = previousItems.map(item => ({ ...item, enabled: true }))
      onItemsChange?.(nextItems)
      return nextItems
    })
  }

  const sortedItems = useMemo(() => {
    const copiedItems = [...items]
    if (sortOption === 'remaining') {
      return copiedItems.sort(
        (left, right) =>
          parseEtaToMinutes(left.etaText) - parseEtaToMinutes(right.etaText)
      )
    }

    return copiedItems.sort(
      (left, right) =>
        shiftSortOrder[left.shiftType] - shiftSortOrder[right.shiftType]
    )
  }, [items, sortOption])

  const sortLabel = sortOption === 'remaining' ? '남은 시간 순' : '근무 타입 순'

  const renderStickyHeader = () => (
    <View className="flex-row items-center justify-between bg-background-gray-subtle1 px-[16px] py-[10px]">
      <TouchableOpacity
        className="flex-row items-center gap-[9px]"
        onPress={() => sortBottomSheetRef.current?.open()}
      >
        <StickySortIcon />
        <GlobalText className="font-pretSemiBold text-text-subtle heading-xxxs">
          {sortLabel}
        </GlobalText>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressEnableAll}>
        <GlobalText className="font-pretMedium text-text-disabled body-xs">
          전체 켜기
        </GlobalText>
      </TouchableOpacity>
    </View>
  )

  return (
    <View className="flex-1 rounded-radius-xl">
      <FlatList
        data={sortedItems}
        ListHeaderComponent={renderStickyHeader}
        keyExtractor={item => item.id}
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => {
          const tagStyle = getTagClassName(item)
          const etaTextClass = item.enabled
            ? 'text-text-subtle'
            : 'text-text-disabled'
          const timeTextClass = item.enabled
            ? 'text-text-basic'
            : 'text-text-disabled-on'

          return (
            <View className="px-[20px] pb-[2px] pt-[8px]">
              <View className="flex-row items-center justify-between">
                <View
                  className={`h-[24px] items-center justify-center rounded-[6px] px-[4px] ${tagStyle.backgroundClass}`}
                >
                  <GlobalText
                    className={`font-pretSemiBold heading-xxxxs ${tagStyle.textClass}`}
                  >
                    {item.shiftType}
                  </GlobalText>
                </View>
                <GlobalText className={`label-xxs ${etaTextClass}`}>
                  {item.etaText}
                </GlobalText>
              </View>

              <View className="mt-[2px] flex-row items-center justify-between">
                <View className="flex-row items-center gap-[4px]">
                  <GlobalText
                    className={`font-pretSemiBold heading-xxs ${timeTextClass}`}
                  >
                    {item.meridiem}
                  </GlobalText>
                  <GlobalText
                    className={`font-pretSemiBold heading-xl ${timeTextClass}`}
                  >
                    {item.time}
                  </GlobalText>
                </View>
                <ToggleSwitch
                  onValueChange={nextValue => onToggleItem(item.id, nextValue)}
                  value={item.enabled}
                />
              </View>
            </View>
          )
        }}
        ItemSeparatorComponent={AlarmItemDivider}
        showsVerticalScrollIndicator={false}
      />
      <SortBottomSheet
        ref={sortBottomSheetRef}
        onApply={setSortOption}
        value={sortOption}
      />
    </View>
  )
}

export default FilledAlarmPage
