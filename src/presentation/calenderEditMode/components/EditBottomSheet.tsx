import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import SelectShiftBox from './SelectShiftBox'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import BottomSheetWrapper from '../../../shared/components/sheet/BottomSheetWrapper'
import { WorkType } from '../../../shared/types/Calendar'
import { WorkTime } from '../../../domain/models/WorkTime'

dayjs.locale('ko') // 한글 locale 적용

interface EditBottomSheetProps {
  selectedDate: dayjs.Dayjs | null
  handleTypeSelect: (type: WorkType) => void
  handleCancel: () => void
  handleSave: () => void // handleSave prop 추가
  selectedBoxId: number
  workTimes: WorkTime
  bottomInset?: number
}

const EditBottomSheet = forwardRef<BottomSheet, EditBottomSheetProps>(
  (
    {
      selectedDate,
      handleTypeSelect,
      handleCancel,
      handleSave,
      selectedBoxId,
      workTimes,
      bottomInset = 0,
    },
    ref
  ) => {
    // 부모에서 받은 ref를 useImperativeHandle()로 가공해서, 내부의 BottomSheet를 대리로 조작하게 한다.
    // 이 ref를 BottomSheetWrapper에게 전달.
    const internalRef = useRef<BottomSheet>(null)

    // 외부에서도 이 ref 접근 가능하게 설정 // 오류 무시해도 됨
    useImperativeHandle(ref, () => ({
      expand: () => internalRef.current?.expand(),
      close: () => internalRef.current?.close(),
    }))

    const formattedDate = selectedDate
      ? selectedDate.format('YYYY년 M월 D일 (dd)')
      : '날짜 없음'

    return (
      <BottomSheetWrapper ref={internalRef} bottomInset={bottomInset}>
        <BottomSheetView className="gap-[20px] px-p-6 pb-[16px]">
          <View className="gap-[10px]">
            <Text className="text-text-basic heading-xs">근무형태 입력</Text>
            <View className="rounded-radius-m1 border-[0.5px] border-[#2ECADC1A] bg-surface-primary-light px-p-6 py-p-4">
              <Text className="text-text-primary label-s">{`선택된 날짜: ${formattedDate}`}</Text>
            </View>
          </View>
          <View className="gap-[11px]">
            <Text className="text-text-subtle heading-xxs">간격</Text>
            <SelectShiftBox
              selectedBoxId={selectedBoxId}
              handleTypeSelect={handleTypeSelect}
              workTimes={workTimes}
            />
          </View>
          <View className="h-[46px] w-full flex-row items-center gap-[10px]">
            <TouchableOpacity
              onPress={handleCancel}
              className="h-full flex-[3] items-center justify-center rounded-radius-xl bg-surface-gray-subtle1"
            >
              <Text className="text-text-basic body-m">취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={selectedBoxId === 0}
              onPress={handleSave} // 저장 버튼에 handleSave 연결
              className={`h-full flex-[7] items-center justify-center rounded-radius-xl bg-surface-inverse ${selectedBoxId === 0 ? 'opacity-40' : ''}`}
            >
              <Text className="text-text-bolder-inverse body-m">저장</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetWrapper>
    )
  }
)

export default EditBottomSheet
