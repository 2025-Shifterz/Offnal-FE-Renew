import { createNativeStackNavigator } from '@react-navigation/native-stack'

import InformationScreen from '../presentation/info/screen/InformationScreen'
import TermsWebViewScreen from '../presentation/info/screen/TermsWebViewScreen'
import EditProfileScreen from '../presentation/info/screen/EditProfileScreen'

const Stack = createNativeStackNavigator()

// 탭3. 내정보 탭에 사용되는 스택 네비게이터

const InformationNavigator = () => {
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
        name="TermsWebViewScreen"
        component={TermsWebViewScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}
export default InformationNavigator
