import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createBottomTabScreenOptions } from '../presentation/main/components/BottomNavigationBar'
import MainScreen from '../presentation/main/screen/MainScreen'
import CalendarScreen from '../presentation/calendar/screen/CalendarScreen'
import InformationScreen from '../presentation/info/screen/InformationScreen'
import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
import GlobalText from '../shared/components/text/GlobalText'
import AutoAlarmScreen from '../presentation/alarm/screen/AutoAlarmScreen'
import { TabParamList } from './types/TabParamList'

const Tab = createBottomTabNavigator<TabParamList>()

const TabsNavigator = () => {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={createBottomTabScreenOptions(insets)}
    >
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen
        name="AutoAlarm"
        component={AutoAlarmScreen}
        options={{
          header: () => (
            <CenterAlignedTopAppBar
              title={null}
              backgroundColor="bg-surface-gray-subtle1"
              applySafeArea={true}
            />
          ),
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen
        name="MyInformation"
        component={InformationScreen}
        options={{
          header: () => (
            <CenterAlignedTopAppBar
              title={
                <GlobalText className="font-pretSemiBold text-heading-xs">
                  내 정보
                </GlobalText>
              }
              applySafeArea={true}
            />
          ),
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  )
}
export default TabsNavigator
