import { Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ReactNode } from 'react'

import HomeGrayIcon from '../../../assets/icons/ic_home_24_gray.svg'
import CalendarGrayIcon from '../../../assets/icons/ic_calendar_24_gray.svg'
import MyInfoGrayIcon from '../../../assets/icons/ic_myinfo_24_gray.svg'

import HomeBkIcon from '../../../assets/icons/ic_home_24_bk.svg'
import CalendarBkIcon from '../../../assets/icons/ic_calendar_24_bk.svg'
import MyInfoBkIcon from '../../../assets/icons/ic_myinfo_24_bk.svg'

export const Tab = createBottomTabNavigator()

const BottomNavigationBar = ({ children }: { children: ReactNode }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let IconComponent

          switch (route.name) {
            case 'Home':
              IconComponent = focused ? HomeBkIcon : HomeGrayIcon
              break
            case 'Calendar':
              IconComponent = focused ? CalendarBkIcon : CalendarGrayIcon
              break
            case 'MyInfo':
              IconComponent = focused ? MyInfoBkIcon : MyInfoGrayIcon
              break
            default:
              IconComponent = focused ? HomeBkIcon : HomeGrayIcon
              break
          }

          return <IconComponent />
        },
        tabBarLabel: ({ focused }) => {
          let label
          const labelColor = focused ? 'text-text-basic' : 'text-text-disabled'

          switch (route.name) {
            case 'Home':
              label = '홈'
              break
            case 'Calendar':
              label = '근무 캘린더'
              break
            case 'MyInfo':
              label = '내 정보'
              break
            default:
              label = '홈'
              break
          }

          return <Text className={`heading-xxxxs ${labelColor}`}>{label}</Text>
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 65,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      {children}
    </Tab.Navigator>
  )
}

export default BottomNavigationBar
