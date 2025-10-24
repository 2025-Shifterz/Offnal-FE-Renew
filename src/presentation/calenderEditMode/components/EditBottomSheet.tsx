import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import SelectShiftBox from './SelectShiftBox'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { ShiftType } from '../../../data/model/Calendar'
import BottomSheetWrapper from '../../../shared/components/BottomSheetWrapper'
dayjs.locale('ko') // 한글 locale 적용

// 근무형태 선택 박스 map 데이터
const shiftTypes: { id: number; text: ShiftType }[] = [
  { id: 1, text: '주간' },
  { id: 2, text: '오후' },
  { id: 3, text: '야간' },
  { id: 4, text: '휴일' },
]

interface EditBottomSheetProps {
  selectedDate: dayjs.Dayjs | null
  handleTypeSelect: (type: ShiftType) => void
  handleCancel: () => void
  handleSave: () => void // handleSave prop 추가
  selectedBoxId: number
  setSelectedBoxId: (id: number) => void
  workTimes: { [key: string]: { startTime: string; endTime: string } }
}

const EditBottomSheet = forwardRef<BottomSheet, EditBottomSheetProps>(
  (
    {
      selectedDate,
      handleTypeSelect,
      handleCancel,
      handleSave,
      selectedBoxId,
      setSelectedBoxId,
      workTimes,
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

    const shiftTypeToKey = (type: ShiftType): 'D' | 'E' | 'N' => {
      switch (type) {
        case '주간':
          return 'D'
        case '오후':
          return 'E'
        case '야간':
          return 'N'
        default:
          return 'D'
      }
    }

    return (
      <>
        {/* 바텀 시트 */}
        <BottomSheetWrapper ref={internalRef}>
          <View className="mt-[5px] gap-[20px] px-p-6">
            <View className="gap-[10px]">
              <Text className="text-text-basic heading-xs">근무형태 입력</Text>
              <View className="rounded-radius-m1 border-[0.5px] border-[#2ECADC1A] bg-surface-primary-light px-p-6 py-p-4">
                <Text className="text-text-primary label-s">{`선택된 날짜: ${formattedDate}`}</Text>
              </View>
            </View>
            <View className="gap-[11px]">
              <Text className="text-text-subtle heading-xxs">간격</Text>
              <View className="gap-[7px]">
                {shiftTypes.map(({ id, text }) => {
                  const key = shiftTypeToKey(text)
                  const time = workTimes[key]
                  return (
                    <SelectShiftBox
                      handleTypeSelect={() => handleTypeSelect(text)}
                      key={id}
                      typeText={text}
                      boxId={id}
                      isSelected={selectedBoxId === id}
                      onSelect={() => setSelectedBoxId(id)}
                      startTime={time?.startTime}
                      endTime={time?.endTime}
                    />
                  )
                })}
              </View>
            </View>
            <View className="h-[46px] w-full flex-row items-center gap-[10px]">
              <TouchableOpacity
                onPress={handleCancel}
                className="rounded-radius-m2 h-full flex-[3] items-center justify-center bg-surface-gray-subtle1"
              >
                <Text className="text-text-basic body-m">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave} // 저장 버튼에 handleSave 연결
                className="rounded-radius-m2 h-full flex-[7] items-center justify-center bg-surface-inverse"
              >
                <Text className="text-text-bolder-inverse body-m">저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetWrapper>
      </>
    )
  }
)

export default EditBottomSheet
