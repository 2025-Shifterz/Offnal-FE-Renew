import { Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ReactNode } from 'react'

import HomeGrayIcon from '../../../assets/icons/ic_home_24_gray.svg'
import AlarmGrayIcon from '../../../assets/icons/ic_alarm_24_gray.svg'
import CalendarGrayIcon from '../../../assets/icons/ic_calendar_24_gray.svg'
import MyInfoGrayIcon from '../../../assets/icons/ic_myinfo_24_gray.svg'

import HomeBkIcon from '../../../assets/icons/ic_home_24_bk.svg'
import AlarmBkIcon from '../../../assets/icons/ic_alarm_24_bk.svg'
import CalendarBkIcon from '../../../assets/icons/ic_calendar_24_bk.svg'
import MyInfoBkIcon from '../../../assets/icons/ic_myinfo_24_bk.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const Tab = createBottomTabNavigator()

const BottomNavigationBar = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets()

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
            case 'AutoAlarm':
              IconComponent = focused ? AlarmBkIcon : AlarmGrayIcon
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
            case 'AutoAlarm':
              label = '자동 알람'
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
          height: 65 + insets.bottom,
          paddingBottom: 5 + insets.bottom,
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
