import { Modal, Text, View } from 'react-native'
import ModalIcon from '../../assets/icons/ic_dialog_logo.svg'

interface ProgressModalProps {
  isVisible: boolean
}

const ProgressModal = ({ isVisible }: ProgressModalProps) => {
  return (
    <Modal transparent={true} animationType="fade" visible={isVisible}>
      <View className="flex-1 items-center justify-center bg-alpha-inverse50">
        <View className="items-center justify-center rounded-xl bg-surface-inverse px-[35px] py-[20px]">
          <ModalIcon />
          <Text className="mt-[23px] text-text-basic-inverse heading-xxs">
            AI가 근무표를 변환하고 있어요
          </Text>
        </View>
      </View>
    </Modal>
  )
}

export default ProgressModal
