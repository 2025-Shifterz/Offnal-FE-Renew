import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SplashScreen from '../presentation/splash/screen/SplashScreen'
import TabsNavigator from './TabsNavigator'
import OnBoardingScheduleNavigator from './OnboardingScheduleNavigator'
import LoginNavigator from './LoginNavigator'
import OnBoardingScheduleWithOCRNavigator from './OnbordingScheduleWithOCRNavigator'
import { RootStackParamList } from './types'

const RootStack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
        <RootStack.Screen name="LoginScreens" component={LoginNavigator} />
        <RootStack.Screen name="Tabs" component={TabsNavigator} />
        <RootStack.Screen
          name="OnboardingSchedules"
          component={OnBoardingScheduleNavigator}
        />
        <RootStack.Screen
          name="OnboardingSchedulesWithOCR"
          component={OnBoardingScheduleWithOCRNavigator}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
