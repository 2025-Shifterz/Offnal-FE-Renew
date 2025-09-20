import { Text, View } from 'react-native'
import GlobalText from '../../../shared/GlobalText'

const MyPage = () => {
  return (
    <View className="flex-1  items-center justify-center bg-blue-200">
      <GlobalText className="text-[24px]">Pretendard</GlobalText>
      <Text>------------------------------------------------</Text>
      <Text>----------heading----------</Text>

      <Text className="heading-xxxxs">동해 물과 백두산이</Text>
      <Text className="heading-xxxs">동해 물과 백두산이</Text>
      <Text className="heading-xxs">동해 물과 백두산이</Text>
      <Text className="heading-xs">동해 물과 백두산이</Text>
      <Text className="heading-s">동해 물과 백두산이</Text>
      <Text className="heading-m">동해 물과 백두산이</Text>
      <Text className="heading-l">동해 물과 백두산이</Text>
      <Text className="heading-xl">동해 물과 백두산이</Text>

      <Text>------------body------------</Text>

      <Text className="body-xxxs">동해 물과 백두산이</Text>
      <Text className="body-xxs">동해 물과 백두산이</Text>
      <Text className="body-xs">동해 물과 백두산이</Text>
      <Text className="body-s">동해 물과 백두산이</Text>
      <Text className="body-m">동해 물과 백두산이</Text>
      <Text className="body-l">동해 물과 백두산이</Text>

      <Text>------------label------------</Text>

      <Text className="label-xxs">동해 물과 백두산이</Text>
      <Text className="label-xs">동해 물과 백두산이</Text>
      <Text className="label-s">동해 물과 백두산이</Text>
      <Text className="label-m">동해 물과 백두산이</Text>
      <Text className="label-l">동해 물과 백두산이</Text>

      <View className="shadow-shadow1 m-2 h-[50px] w-[70px] bg-white">
        <Text>shadow1</Text>
      </View>
      <View className="shadow-shadow2 m-2 h-[50px] w-[70px] bg-white">
        <Text>shadow2</Text>
      </View>
      <View className="shadow-shadow3 m-2 h-[50px] w-[70px] bg-white">
        <Text>shadow3</Text>
      </View>
      <View className="shadow-shadow4 m-2 h-[50px] w-[70px] bg-white">
        <Text>shadow4</Text>
      </View>
    </View>
  )
}

export default MyPage
