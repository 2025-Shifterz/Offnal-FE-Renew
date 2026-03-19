import { Pressable, TextInput, TouchableOpacity, View } from 'react-native'
import CheckIcon from '../../../assets/icons/checked.svg'
import GlobalText from '../../../shared/components/text/GlobalText'

interface CheckBoxWithTextInputProps {
  title: string
  isChecked: boolean
  onChecked: () => void
  content: string
  onContentChange: (content: string) => void
}

const MAX_LENGTH = 100

const CheckBoxWithTextInput = ({
  title,
  isChecked,
  onChecked,
  content,
  onContentChange,
}: CheckBoxWithTextInputProps) => {
  return (
    <View className="flex-row justify-between">
      <TouchableOpacity onPress={() => onChecked()}>
        {isChecked ? (
          <View className="size-[20px]">
            <CheckIcon width="100%" height="100%" />
          </View>
        ) : (
          <View className="size-[20px] rounded-[4px] bg-[#cdd1d5]" />
        )}
      </TouchableOpacity>
      <View className="flex-1 ps-[12px]">
        <Pressable onPress={() => onChecked()}>
          <GlobalText className="pb-[8px] font-pretMedium text-body-xs">
            {title}
          </GlobalText>
        </Pressable>
        <View className="h-[150px] flex-col justify-between rounded-lg border-alpha-inverse10 bg-white px-4 py-3">
          <TextInput
            className="flex-1 text-left text-label-xs text-text-basic"
            placeholder="계정 삭제 사유를 알려주세요."
            placeholderTextColor="#B1B8BE"
            value={content}
            onChangeText={text => onContentChange(text)}
            maxLength={MAX_LENGTH}
            multiline={true}
            textAlignVertical="top"
            editable={isChecked}
          />
          <View className="self-end">
            <GlobalText className="text-label-xs text-text-disabled">
              {content.length}/{MAX_LENGTH}
            </GlobalText>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CheckBoxWithTextInput
