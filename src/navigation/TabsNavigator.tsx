import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomNavigationBar from '../presentation/main/components/BottomNavigationBar'
import MainScreen from '../presentation/main/screen/MainScreen'
import CalendarScreen from '../presentation/calendar/screen/CalendarScreen'
import InformationScreen from '../presentation/info/screen/InformationScreen'

const Tab = createBottomTabNavigator()

const TabsNavigator = () => {
  return (
    <BottomNavigationBar>
      <Tab.Screen name="Home" component={MainScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="MyInformation" component={InformationScreen} />
    </BottomNavigationBar>
  )
}
export default TabsNavigator
