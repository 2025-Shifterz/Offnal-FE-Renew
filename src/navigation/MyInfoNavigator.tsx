import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UpdateMyInfoScreen from '../presentation/myInfo/screen/UpdateMyInfoScreen'
import InformationScreen from '../presentation/info/screen/InformationScreen'
import WithdrawScreen from '../presentation/info/screen/WithdrawScreen'
import { InfoStackParamList } from './types'
import WithdrawBeforeScreen from '../presentation/info/screen/WithdrawBeforeScreen'

const Stack = createNativeStackNavigator<InfoStackParamList>()

// 탭3. 내정보 탭에 사용되는 스택 네비게이터

const MyInfoNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InformationScreen"
        component={InformationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateMyInfoScreen"
        component={UpdateMyInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WithdrawBeforeScreen"
        component={WithdrawBeforeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WithdrawScreen"
        component={WithdrawScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default MyInfoNavigator
