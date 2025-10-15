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
  LoginScreens: undefined
  OnboardingSchedules: undefined
  OnboardingSchedulesWithOCR: undefined
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
  SelectScheduleReg: undefined
  KakaoWebView: undefined
  PrivacyPolicy: undefined
  ServiceTerm: undefined
  OnboardingSchedules: undefined
  OnboardingSchedulesWithOCR: undefined
  Tabs: undefined
}

// 온보딩 캘린더
export type OnboardingStackParamList = {
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
