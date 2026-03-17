import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { AutoAlarmScreenStackParamList } from './types'
import CreateAlarmScreen from '../presentation/alarm/screen/CreateAlarmScreen'

const Stack = createNativeStackNavigator<AutoAlarmScreenStackParamList>()

const AutoAlarmNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateAlarm" component={CreateAlarmScreen} />
    </Stack.Navigator>
  )
}

export default AutoAlarmNavigator
