import { Modal, Pressable, TouchableOpacity, View } from 'react-native'
import GlobalText from './GlobalText'

type ConfirmDialogProps = {
  visible: boolean
  title: string
  description: string
  cancelText?: string
  confirmText?: string
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmDialog = ({
  visible,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-alpha-inverse50 px-[16px]"
        onPress={onCancel}
      >
        <Pressable
          className="w-[286px] rounded-radius-xl bg-surface-white px-[16px] pb-[16px] pt-[20px]"
          onPress={() => {}}
        >
          <View className="items-center">
            <View className="w-[208px] items-center gap-[4px]">
              <GlobalText className="text-center font-pretSemiBold text-heading-s text-text-basic">
                {title}
              </GlobalText>
              <GlobalText className="text-center font-pretMedium text-text-subtle body-xs">
                {description}
              </GlobalText>
            </View>

            <View className="mt-[20px] flex-row gap-[8px]">
              <TouchableOpacity
                className="h-[48px] flex-1 items-center justify-center rounded-radius-m bg-surface-gray-subtle1"
                onPress={onCancel}
              >
                <GlobalText className="font-pretMedium text-text-basic body-m">
                  {cancelText}
                </GlobalText>
              </TouchableOpacity>
              <TouchableOpacity
                className="h-[48px] flex-1 items-center justify-center rounded-radius-m bg-surface-inverse"
                onPress={onConfirm}
              >
                <GlobalText className="font-pretMedium text-text-bolder-inverse body-m">
                  {confirmText}
                </GlobalText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default ConfirmDialog
