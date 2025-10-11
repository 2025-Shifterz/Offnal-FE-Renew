import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import BottomNavigationBar from '../presentation/main/components/BottomNavigationBar'
import MainNavigator from './MainNavigator'
import CalendarNavigator from './CalendarNavigator'
import MyInfoNavigator from './MyInfoNavigator'

const Tab = createBottomTabNavigator()

const TabsNavigator = () => {
  return (
    <BottomNavigationBar>
      <Tab.Screen name="Home" component={MainNavigator} />
      <Tab.Screen name="Calendar" component={CalendarNavigator} />
      <Tab.Screen name="MyInfo" component={MyInfoNavigator} />
    </BottomNavigationBar>
  )
}
export default TabsNavigator
