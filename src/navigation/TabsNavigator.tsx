import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomNavigationBar from '../presentation/main/components/BottomNavigationBar'
import MainNavigator from './MainNavigator'
import CalendarNavigator from './CalendarNavigator'
import InformationNavigator from './InformationNavigator'

const Tab = createBottomTabNavigator()

const TabsNavigator = () => {
  return (
    <BottomNavigationBar>
      <Tab.Screen name="Home" component={MainNavigator} />
      <Tab.Screen name="Calendar" component={CalendarNavigator} />
      <Tab.Screen name="MyInfo" component={InformationNavigator} />
    </BottomNavigationBar>
  )
}
export default TabsNavigator
