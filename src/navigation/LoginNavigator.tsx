import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../presentation/login/screen/Login'
import ScheduleRegRegisterMethod from '../presentation/schedule/screens/SelectRegTypeScreen'
import KakaoLoginWebView from '../presentation/login/screen/KakaoLoginWebView'
import PrivacyPolicy from '../presentation/policy/screen/PrivacyPolicy'
import ServiceTerm from '../presentation/policy/screen/ServiceTerm'
import { LoginStackParamList } from './types'

const Stack = createNativeStackNavigator<LoginStackParamList>()

// + 로그인 화면들

const LoginNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        name="SelectRegMethod"
        component={ScheduleRegRegisterMethod}
      />
      <Stack.Screen name="KakaoWebView" component={KakaoLoginWebView} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="ServiceTerm" component={ServiceTerm} />
    </Stack.Navigator>
  )
}
export default LoginNavigator
