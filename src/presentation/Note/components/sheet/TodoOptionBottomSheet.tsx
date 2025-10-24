import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import EditIcon from '../../../../assets/icons/ic_edit_28_information.svg'
import DeleteIcon from '../../../../assets/icons/ic_trash_28_danger.svg'
import ArrowDownIcon from '../../../../assets/icons/ic_arrow_down_16_primary.svg'
import ArrowRightIcon from '../../../../assets/icons/ic_arrow_right_16_primary.svg'
import FilpRightIcon from '../../../../assets/icons/ic_flip_right_16_primary.svg'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import GlobalText from '../../../../shared/components/GlobalText'
import { Todo } from '../../../../domain/models/Todo'
import { View } from 'react-native'
import TodoOptionItem from './TodoOptionItem'

const TodoOptions = [
  {
    icon: <EditIcon width={16} height={16} />,
    title: '수정하기',
    action: () => {},
  },
  {
    icon: <DeleteIcon width={16} height={16} />,
    title: '삭제하기',
    action: () => {},
  },
  {
    icon: <ArrowDownIcon width={16} height={16} />,
    title: '오늘하기',
    action: () => {},
  },
  {
    icon: <FilpRightIcon width={16} height={16} />,
    title: '다음날하기',
    action: () => {},
  },
]

export interface TodoOptionBottomSheetProps {
  selectedTodo: Todo | null
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
  onSchedule: (todo: Todo) => void
  onReSchedule: (todo: Todo) => void
}

export interface BottomSheetMethods {
  open: () => void
  close: () => void
}

const TodoOptionBottomSheetCustomHandle = () => {
  return (
    <View className="w-full items-center p-4">
      <View className="h-1.5 w-16 rounded-full bg-gray-300" />
    </View>
  )
}

const TodoOptionBottomSheet = forwardRef<
  BottomSheetMethods,
  TodoOptionBottomSheetProps
>(({ selectedTodo, onEdit, onDelete, onSchedule, onReSchedule }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.expand()
    },
    close: () => {
      bottomSheetRef.current?.close()
    },
  }))

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['50%']}
      handleComponent={TodoOptionBottomSheetCustomHandle}
      backgroundStyle={{
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      <BottomSheetView className="flex-col px-[20px] pt-[8px]">
        <GlobalText className="text-heading-xs">
          {selectedTodo ? `${selectedTodo.content}` : '옵션'}
        </GlobalText>
        <View className="my-[8px] h-[1px] bg-border-gray-light" />
        {TodoOptions.map((option, index) => (
          <TodoOptionItem
            key={index}
            icon={option.icon}
            title={option.title}
            onPress={option.action}
          />
        ))}
      </BottomSheetView>
    </BottomSheet>
  )
})

export default TodoOptionBottomSheet
