import { createNativeStackNavigator } from '@react-navigation/native-stack'
import InformationScreen from '../presentation/info/screen/InformationScreen'
import WithdrawScreen from '../presentation/info/screen/WithdrawScreen'
import { InfoStackParamList } from './types'
import WithdrawBeforeScreen from '../presentation/info/screen/WithdrawBeforeScreen'
import FeedBackScreen from '../presentation/info/screen/FeedBackScreen'
import EditProfileScreen from '../presentation/info/screen/EditProfileScreen'
import TermsWebViewScreen from '../presentation/info/screen/TermsWebViewScreen'

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
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedbackScreen"
        component={FeedBackScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsWebViewScreen"
        component={TermsWebViewScreen}
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
