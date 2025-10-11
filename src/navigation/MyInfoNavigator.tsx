import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UpdateMyInfoScreen from '../presentation/myInfo/screen/UpdateMyInfoScreen'
import MyInfoScreen from '../presentation/myInfo/screen/MyInfoScreen'

const Stack = createNativeStackNavigator()

// 탭3. 내정보 탭에 사용되는 스택 네비게이터

const MyInfoNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyInfoScreen"
        component={MyInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateMyInfoScreen"
        component={UpdateMyInfoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
export default MyInfoNavigator
