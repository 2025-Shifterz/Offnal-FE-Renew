import { View } from 'react-native'
import Menu from './Menu'

const OtherMenus = () => {
  return (
    <View className="my-number-3 flex-col justify-start">
      <Menu.Header headerTitle="기타" />
      <Menu.Item menuTitle="회원 탈퇴" onPress={() => {}} />
      <Menu.Item menuTitle="로그 아웃" onPress={() => {}} />
    </View>
  )
}

export default OtherMenus
