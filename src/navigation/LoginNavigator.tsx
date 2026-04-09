import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../presentation/login/screen/LoginScreen'
import { LoginStackParamList } from './types/StackTypes'
import TermsWebViewScreen from '../presentation/info/screen/TermsWebViewScreen'

const Stack = createNativeStackNavigator<LoginStackParamList>()

// + 로그인 화면들

const LoginNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="TermsWebViewScreen" component={TermsWebViewScreen} />
    </Stack.Navigator>
  )
}
export default LoginNavigator
