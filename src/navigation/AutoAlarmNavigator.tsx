import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { AutoAlarmScreenStackParamList } from './types'
import AutoAlarmScreen from '../presentation/alarm/screen/AutoAlarmScreen'
import CreateAlarmScreen from '../presentation/alarm/screen/CreateAlarmScreen'
import EditAutoAlarmScreen from '../presentation/alarm/screen/EditAutoAlarmScreen'

const Stack = createNativeStackNavigator<AutoAlarmScreenStackParamList>()

const AutoAlarmNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AutoAlarm" component={AutoAlarmScreen} />
      <Stack.Screen name="CreateAlarm" component={CreateAlarmScreen} />
      <Stack.Screen name="EditAutoAlarm" component={EditAutoAlarmScreen} />
    </Stack.Navigator>
  )
}

export default AutoAlarmNavigator
