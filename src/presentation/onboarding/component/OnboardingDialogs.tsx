import Dialog from '../../../shared/components/dialog/Dialog'
import ConfirmDialog from '../../../shared/components/dialog/ConfirmDialog'

type PermissionConfirmDialogProps = {
  isVisible: boolean
  onConfirm: () => void
  onCancel: () => void
}

const PermissionConfirmDialog = ({
  isVisible,
  onConfirm,
  onCancel,
}: PermissionConfirmDialogProps) => {
  return (
    <ConfirmDialog
      visible={isVisible}
      title="카메라 권한 필요"
      description="카메라 접근 권한이 필요합니다. 앱 설정에서 수동으로 권한을 허용해주세요."
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}

type PermissionNeededDialogProps = {
  isVisible: boolean
  onConfirm: () => void
}

const PermissionNeededDialog = ({
  isVisible,
  onConfirm,
}: PermissionNeededDialogProps) => {
  return (
    <Dialog
      visible={isVisible}
      title="카메라 권한 필요"
      description="요청된 카메라 권한이 거부되었습니다. 해당 기능을 사용하려면 권한을 허용해야 합니다."
      onConfirm={onConfirm}
    />
  )
}

type ErrorDialogProps = {
  isVisible: boolean
  title: string
  description: string
  onConfirm: () => void
}

const ErrorDialog = ({
  isVisible,
  title,
  description,
  onConfirm,
}: ErrorDialogProps) => {
  return (
    <Dialog
      visible={isVisible}
      title={title}
      description={description}
      onConfirm={onConfirm}
    />
  )
}

export { PermissionConfirmDialog, PermissionNeededDialog, ErrorDialog }
