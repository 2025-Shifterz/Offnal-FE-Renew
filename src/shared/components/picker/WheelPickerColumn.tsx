import { useLayoutEffect, useRef, useState } from 'react'
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native'

import GlobalText from '../text/GlobalText'

export const WHEEL_PICKER_ITEM_HEIGHT = 41
export const WHEEL_PICKER_VISIBLE_ROWS = 5
export const WHEEL_PICKER_PICKER_HEIGHT =
  WHEEL_PICKER_ITEM_HEIGHT * WHEEL_PICKER_VISIBLE_ROWS
const SIDE_PADDING_ROWS = Math.floor(WHEEL_PICKER_VISIBLE_ROWS / 2)

type WheelPickerColumnProps = {
  currentIndex: number
  data: string[]
  onIndexChange: (index: number) => void
  textAlign: 'center' | 'left' | 'right'
  width: number
}

const clampIndex = (index: number, maxIndex: number) => {
  if (index < 0) {
    return 0
  }

  if (index > maxIndex) {
    return maxIndex
  }

  return index
}

const WheelPickerColumn = ({
  currentIndex,
  data,
  onIndexChange,
  textAlign,
  width,
}: WheelPickerColumnProps) => {
  const listRef = useRef<FlatList<string>>(null)
  const mountedRef = useRef(false)
  const isDraggingRef = useRef(false)
  const displayIndexRef = useRef(currentIndex)
  const [displayIndex, setDisplayIndex] = useState(currentIndex)

  const syncDisplayIndex = (nextIndex: number) => {
    if (displayIndexRef.current === nextIndex) {
      return
    }

    displayIndexRef.current = nextIndex
    setDisplayIndex(nextIndex)
  }

  useLayoutEffect(() => {
    const nextOffset = currentIndex * WHEEL_PICKER_ITEM_HEIGHT

    if (!mountedRef.current) {
      mountedRef.current = true
      displayIndexRef.current = currentIndex
      setDisplayIndex(currentIndex)
      listRef.current?.scrollToOffset({
        animated: false,
        offset: nextOffset,
      })
      return
    }

    if (isDraggingRef.current) {
      return
    }

    if (displayIndexRef.current === currentIndex) {
      return
    }

    displayIndexRef.current = currentIndex
    setDisplayIndex(currentIndex)
    listRef.current?.scrollToOffset({
      animated: false,
      offset: nextOffset,
    })
  }, [currentIndex])

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isDraggingRef.current) {
      return
    }

    const rawIndex = Math.round(
      event.nativeEvent.contentOffset.y / WHEEL_PICKER_ITEM_HEIGHT
    )
    syncDisplayIndex(clampIndex(rawIndex, data.length - 1))
  }

  const onScrollBeginDrag = () => {
    isDraggingRef.current = true
  }

  const handleOffsetChange = (offsetY: number) => {
    const rawIndex = Math.round(offsetY / WHEEL_PICKER_ITEM_HEIGHT)
    const nextIndex = clampIndex(rawIndex, data.length - 1)
    isDraggingRef.current = false
    syncDisplayIndex(nextIndex)

    if (nextIndex === currentIndex) {
      listRef.current?.scrollToOffset({
        animated: false,
        offset: nextIndex * WHEEL_PICKER_ITEM_HEIGHT,
      })
      return
    }

    onIndexChange(nextIndex)
  }

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleOffsetChange(event.nativeEvent.contentOffset.y)
  }

  const onScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.velocity?.y) {
      return
    }

    handleOffsetChange(event.nativeEvent.contentOffset.y)
  }

  return (
    <FlatList
      ref={listRef}
      bounces={false}
      data={data}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        index,
        length: WHEEL_PICKER_ITEM_HEIGHT,
        offset: WHEEL_PICKER_ITEM_HEIGHT * index,
      })}
      keyExtractor={(item, index) => `${item}-${index}`}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumEnd}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        const distance = Math.abs(index - displayIndex)
        const opacity = distance === 0 ? 1 : distance === 1 ? 0.82 : 0.38

        return (
          <View
            className="items-center justify-center"
            style={{ height: WHEEL_PICKER_ITEM_HEIGHT }}
          >
            <GlobalText
              className="font-pretSemiBold text-text-subtle heading-xxs"
              style={{ opacity, textAlign }}
            >
              {item}
            </GlobalText>
          </View>
        )
      }}
      showsVerticalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={WHEEL_PICKER_ITEM_HEIGHT}
      style={{ width }}
      contentContainerStyle={{
        paddingVertical: SIDE_PADDING_ROWS * WHEEL_PICKER_ITEM_HEIGHT,
      }}
    />
  )
}

export default WheelPickerColumn
