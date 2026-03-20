import React, { forwardRef, useCallback } from 'react'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { Platform, View, ViewStyle } from 'react-native'

type BottomSheetWrapperProps = {
  children: React.ReactNode
  onChange?: (index: number) => void
  handleStyle?: ViewStyle
  enableBackdrop?: boolean
  backdropOpacity?: number
  bottomInset?: number
}

const BottomSheetWrapper = forwardRef<BottomSheet, BottomSheetWrapperProps>(
  (
    {
      children,
      onChange,
      handleStyle,
      enableBackdrop = false,
      backdropOpacity = 0.32,
      bottomInset,
    },
    ref
  ) => {
    const resolvedBottomInset =
      Platform.OS === 'android' ? (bottomInset ?? 0) : 0

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={backdropOpacity}
          pressBehavior="close"
        />
      ),
      [backdropOpacity]
    )

    return (
      <View className="absolute inset-0">
        <BottomSheet
          ref={ref}
          backdropComponent={enableBackdrop ? renderBackdrop : undefined}
          index={-1}
          enablePanDownToClose={true} // 아래로 내려 닫기 활성화
          enableContentPanningGesture={false} //  제스처가 캘린더 터치 방해하지 않게
          enableDynamicSizing={true} // 동적 사이징 활성화
          overDragResistanceFactor={0} // 위로 더 이상 당겨지지 않게 함
          bottomInset={resolvedBottomInset}
          onChange={onChange}
          handleStyle={handleStyle}
        >
          {children}
        </BottomSheet>
      </View>
    )
  }
)

export default BottomSheetWrapper
