import { Modal, View } from 'react-native'

interface ProgressIndicatorModalProps {
  isVisible: boolean
  currentProgress: number
  totalProgress: number
}

const ProgressIndicatorModal = ({
  isVisible,
  currentProgress,
  totalProgress,
}: ProgressIndicatorModalProps) => {
  return (
    <Modal transparent={true} animationType="fade" visible={isVisible}>
      <View className="flex-1 items-center justify-center bg-surface-gray-subtle1" />
    </Modal>
  )
}
