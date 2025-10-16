import { NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ScheduleScopeType } from '../shared/types/ScheduleScopeType'

// 네비게이션
export type onboardingNavigation =
  NativeStackNavigationProp<OnboardingStackParamList>
export type onboardingOCRNavigation =
  NativeStackNavigationProp<OnboardingOCRStackParamList>
export type loginNavigation = NativeStackNavigationProp<LoginStackParamList>
export type calendarNavigation =
  NativeStackNavigationProp<CalendarScreenStackParamList>
export type mainNavigation = NativeStackNavigationProp<MainStackParamList>
export type tabNavigation = NativeStackNavigationProp<TabParamList>
export type rootNavigation = NativeStackNavigationProp<RootStackParamList>

// 루트 네비게이터
export type RootStackParamList = {
  SplashScreen: undefined
  Tabs: NavigatorScreenParams<TabParamList> | undefined
  LoginScreens: NavigatorScreenParams<LoginStackParamList> | undefined
  OnboardingSchedules:
    | NavigatorScreenParams<OnboardingStackParamList>
    | undefined
  OnboardingSchedulesOCR:
    | NavigatorScreenParams<OnboardingOCRStackParamList>
    | undefined
}

// 탭 네비게이터
export type TabParamList = {
  Home: NavigatorScreenParams<MainStackParamList>
  Calendar: NavigatorScreenParams<CalendarScreenStackParamList>
  MyInfo: undefined
}

// main 네비게이터 - "Home"
export type MainStackParamList = {
  MainScreen: undefined
  AutoAlarm: undefined
  Todo: undefined
  Memo: undefined
}

// 로그인
export type LoginStackParamList = {
  Login: undefined
  KakaoWebView: undefined
  PrivacyPolicy: undefined
  ServiceTerm: undefined
}

// 온보딩 캘린더
export type OnboardingStackParamList = {
  SelectScheduleReg: undefined
  SelectScheduleScope: undefined
  InputSchedule: { selectedScheduleScopeType: ScheduleScopeType }
  InputCalendarType: {
    selectedScheduleScopeType: ScheduleScopeType
    calendarName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  CompleteSchedule: { selectedScheduleScopeType: ScheduleScopeType }
}

// 온보딩 OCR 캘린더
export type OnboardingOCRStackParamList = {
  SelectScheduleReg: undefined
  SelectScheduleScopeOCR: undefined
  InputScheduleOCR: { selectedScheduleScopeType: ScheduleScopeType }
  InputCalendarTypeOCR: {
    selectedScheduleScopeType: ScheduleScopeType
    calendarName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  SelectMonthOCR: {
    selectedScheduleScopeType: ScheduleScopeType
    calendarName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  SelectPhotoOCR: {
    selectedScheduleScopeType: ScheduleScopeType
    calendarName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
    year: number
    month: number
    ocrResult?: unknown
  }
  EditScheduleOCR: {
    selectedScheduleScopeType: ScheduleScopeType
    calendarName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
    year: number
    month: number
    ocrResult?: unknown
  }
  CompleteScheduleOCR:
    | { selectedScheduleScopeType: ScheduleScopeType }
    | undefined
}

// 캘린더 탭 네비게이터
export type CalendarScreenStackParamList = {
  CalendarScreen: undefined
  EditCalendar: {
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  CalendarInfoEdit: undefined
}

// export type CalendarStackParamList = {
//   Calendar: undefined
//   EditCalendar: {
//     workTimes: { [key: string]: { startTime: string; endTime: string } }
//   }
//   PlusEdit: undefined
// }
