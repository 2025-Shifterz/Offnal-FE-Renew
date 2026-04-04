import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import { Portal } from '@gorhom/portal'
import Checkbox from '../../../shared/components/Checkbox'
import ConfirmDialog from '../../../shared/components/dialog/ConfirmDialog'
import GlobalText from '../../../shared/components/text/GlobalText'
import ToggleSwitch from '../../../shared/components/ToggleSwitch'
import SortBottomSheet, {
  AlarmSortOption,
  SortBottomSheetMethods,
} from './SortBottomSheet'
import EditModeDeleteBar from './EditModeDeleteBar'

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
  onPressItem?: (item: AlarmListItem) => void
  isEditing?: boolean
  bottomOffset?: number
  bottomInset?: number
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

type AlarmRowContentProps = {
  item: AlarmListItem
  onToggleItem: (id: string, nextValue: boolean) => void
}

const AlarmRowContent = ({ item, onToggleItem }: AlarmRowContentProps) => {
  const tagStyle = getTagClassName(item)
  const etaTextClass = item.enabled ? 'text-text-subtle' : 'text-text-disabled'
  const timeTextClass = item.enabled
    ? 'text-text-basic'
    : 'text-text-disabled-on'

  return (
    <View className="w-full">
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
}

const FilledAlarmPage = ({
  initialItems = defaultAlarmItems,
  onItemsChange,
  onPressItem,
  isEditing = false,
  bottomOffset = 65,
}: FilledAlarmPageProps) => {
  const sortBottomSheetRef = useRef<SortBottomSheetMethods>(null)
  const [items, setItems] = useState<AlarmListItem[]>(initialItems)
  const [sortOption, setSortOption] = useState<AlarmSortOption>('remaining')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  useEffect(() => {
    setSelectedIds([])
    setIsDeleteDialogVisible(false)
  }, [isEditing])

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const selectedCount = selectedIds.length
  const isAllSelected = items.length > 0 && selectedCount === items.length

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

  const onToggleSelectAll = () => {
    setSelectedIds(previousSelectedIds =>
      previousSelectedIds.length === items.length
        ? []
        : items.map(item => item.id)
    )
  }

  const onToggleSelectItem = (id: string) => {
    setSelectedIds(previousSelectedIds =>
      previousSelectedIds.includes(id)
        ? previousSelectedIds.filter(selectedId => selectedId !== id)
        : [...previousSelectedIds, id]
    )
  }

  const onDeleteSelected = () => {
    if (!selectedIds.length) {
      return
    }

    setItems(previousItems => {
      const nextItems = previousItems.filter(item => !selectedSet.has(item.id))
      onItemsChange?.(nextItems)
      return nextItems
    })
    setSelectedIds([])
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

  const renderStickyHeader = () => {
    if (isEditing) {
      return (
        <View className="h-[46px] flex-row items-center bg-background-gray-subtle1 px-[20px]">
          <Checkbox checked={isAllSelected} onPress={onToggleSelectAll} />
          <GlobalText className="ml-[18px] font-pretSemiBold text-text-subtle heading-xxs">
            전체 선택
          </GlobalText>
        </View>
      )
    }

    return (
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
  }

  return (
    <View className="flex-1 rounded-radius-xl">
      <FlatList
        data={sortedItems}
        contentContainerStyle={{
          paddingBottom: isEditing ? bottomOffset + 160 : 0,
        }}
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

          return isEditing ? (
            <View className="w-full px-[20px] pb-[2px] pt-[8px]">
              <View className="flex-row items-center gap-[16px]">
                <View className="pt-[6px]">
                  <Checkbox
                    checked={selectedSet.has(item.id)}
                    onPress={() => onToggleSelectItem(item.id)}
                  />
                </View>
                <View className="flex-1">
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
                      onValueChange={nextValue =>
                        onToggleItem(item.id, nextValue)
                      }
                      value={item.enabled}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              className="px-[20px] pb-[2px] pt-[8px]"
              disabled={!onPressItem}
              onPress={() => onPressItem?.(item)}
            >
              <AlarmRowContent item={item} onToggleItem={onToggleItem} />
            </TouchableOpacity>
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
      <Portal>
        <EditModeDeleteBar
          disabled={!selectedCount}
          bottomOffset={bottomOffset}
          onPress={() => setIsDeleteDialogVisible(true)}
          visible={isEditing}
        />
      </Portal>
      <ConfirmDialog
        cancelText="취소"
        confirmText="삭제"
        description="삭제된 알람은 복구되지 않아요."
        onCancel={() => setIsDeleteDialogVisible(false)}
        onConfirm={() => {
          setIsDeleteDialogVisible(false)
          onDeleteSelected()
        }}
        title="자동 알람 삭제"
        visible={isDeleteDialogVisible}
      />
    </View>
  )
}

export default FilledAlarmPage
