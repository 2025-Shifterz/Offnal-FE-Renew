import React, { forwardRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import { View, ViewStyle } from 'react-native'

type BottomSheetWrapperProps = {
  children: React.ReactNode
  onChange?: (index: number) => void
  handleStyle?: ViewStyle
}

const BottomSheetWrapper = forwardRef<BottomSheet, BottomSheetWrapperProps>(
  ({ children, onChange, handleStyle }, ref) => {
    return (
      <View className="absolute inset-0">
        <BottomSheet
          ref={ref}
          index={-1}
          enablePanDownToClose={true} // 아래로 내려 닫기 활성화
          enableContentPanningGesture={false} //  제스처가 캘린더 터치 방해하지 않게
          enableDynamicSizing={true} // 동적 사이징 활성화
          overDragResistanceFactor={0} // 위로 더 이상 당겨지지 않게 함
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
