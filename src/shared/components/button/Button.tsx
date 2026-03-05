import React from 'react'
import { Pressable, TouchableOpacity } from 'react-native'

/**
 * ### ButtonProps
 * @param content 버튼 내용
 * @param onPress 버튼 클릭 시 실행할 함수
 * @param disabled 버튼 비활성화 여부
 */
interface ButtonProps {
  content: React.ReactNode
  onPress: () => void
  disabled?: boolean
}

/**
 * ### EmphasizedButton
 *
 * 강조 버튼, bg-surface-inverse를 배경으로 함
 *
 * @param content 버튼 내용
 * @param onPress 버튼 클릭 시 실행할 함수
 * @param disabled 버튼 비활성화 여부
 */
const EmphasizedButton = ({
  content,
  onPress,
  disabled = false,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex w-full items-center rounded-radius-xl bg-surface-inverse py-[13px] active:bg-surface-inverse-subtle"
    >
      {content}
    </Pressable>
  )
}

export default EmphasizedButton

/**
 * ### UnEmphasizedButton
 *
 * 비강조 버튼, bg-surface-gray-subtle1을 배경으로 함
 *
 * @param content 버튼 내용
 * @param onPress 버튼 클릭 시 실행할 함수
 * @param disabled 버튼 비활성화 여부
 */
const UnEmphasizedButton = ({
  content,
  onPress,
  disabled = false,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="flex w-full items-center rounded-radius-xl bg-surface-gray-subtle1 py-[13px]"
    >
      {content}
    </TouchableOpacity>
  )
}

export { UnEmphasizedButton }
