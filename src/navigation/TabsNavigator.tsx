import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomNavigationBar from '../presentation/main/components/BottomNavigationBar'
import MainScreen from '../presentation/main/screen/MainScreen'
import CalendarScreen from '../presentation/calendar/screen/CalendarScreen'
import InformationScreen from '../presentation/info/screen/InformationScreen'
import CenterAlignedTopAppBar from '../shared/components/appbar/CenterAlignedTopAppBar'
import GlobalText from '../shared/components/GlobalText'
import AutoAlarmScreen from '../presentation/alarm/screen/AutoAlarmScreen'

const Tab = createBottomTabNavigator()

const TabsNavigator = () => {
  return (
    <BottomNavigationBar>
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
    </BottomNavigationBar>
  )
}
export default TabsNavigator
