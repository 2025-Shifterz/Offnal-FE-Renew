import React, { forwardRef, useMemo } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { View, ViewStyle } from 'react-native'

type BottomSheetWrapperProps = {
  children: React.ReactNode
  snapPoints?: (string | number)[]
  onChange?: (index: number) => void
  handleStyle?: ViewStyle
}

const BottomSheetWrapper = forwardRef<BottomSheet, BottomSheetWrapperProps>(
  ({ children, snapPoints = ['25%', '70%'], onChange, handleStyle }, ref) => {
    const memoSnapPoints = useMemo(() => snapPoints, [snapPoints])

    return (
      <View className="absolute inset-0">
        <BottomSheet
          handleStyle={handleStyle}
          enablePanDownToClose={true}
          enableContentPanningGesture={false} //  제스처가 캘린더 터치 방해하지 않게
          ref={ref}
          index={-1}
          snapPoints={memoSnapPoints}
          onChange={onChange}
        >
          <BottomSheetView className="h-full">{children}</BottomSheetView>
        </BottomSheet>
      </View>
    )
  }
)

export default BottomSheetWrapper
