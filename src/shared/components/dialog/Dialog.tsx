import { Modal, Pressable, TouchableOpacity, View } from 'react-native'
import GlobalText from '../text/GlobalText'

type DialogProps = {
  visible: boolean
  title: string
  description: string
  confirmText?: string
  onConfirm: () => void
}

const Dialog = ({
  visible,
  title,
  description,
  confirmText = '확인',
  onConfirm,
}: DialogProps) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      visible={visible}
      onRequestClose={onConfirm}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-alpha-inverse50 px-[16px]"
        onPress={onConfirm}
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

export default Dialog
