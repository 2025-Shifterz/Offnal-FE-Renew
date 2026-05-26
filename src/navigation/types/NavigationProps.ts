import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { LoginStackParamList } from './LoginStackParamList'
import { OnboardingStackParamList } from './OnboardingStackParamList'
import { RootStackParamList } from './RootStackParamList'
import { TabParamList } from './TabParamList'

export type onboardingNavigation =
  NativeStackNavigationProp<OnboardingStackParamList>
export type loginNavigation = NativeStackNavigationProp<LoginStackParamList>
export type tabNavigation = NativeStackNavigationProp<TabParamList>
export type rootNavigation = NativeStackNavigationProp<RootStackParamList>
