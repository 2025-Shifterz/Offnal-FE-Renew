import { NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Memo } from '../../domain/models/Memo'
import dayjs from 'dayjs'

// 네비게이션
export type onboardingNavigation =
  NativeStackNavigationProp<OnboardingStackParamList>
export type loginNavigation = NativeStackNavigationProp<LoginStackParamList>
export type tabNavigation = NativeStackNavigationProp<TabParamList>
export type rootNavigation = NativeStackNavigationProp<RootStackParamList>

// 루트 네비게이터
export type RootStackParamList = {
  SplashScreen: undefined
  Tabs: NavigatorScreenParams<TabParamList> | undefined
  LoginScreens: NavigatorScreenParams<LoginStackParamList> | undefined
  OnboardingMethodScreen: {
    createScheduleButtonClick: boolean
  }
  OnboardingSchedules:
    | NavigatorScreenParams<OnboardingStackParamList>
    | undefined

  // Migrate from MainNavigator.tsx
  AutoAlarm: undefined
  Todo: { selectedDate: dayjs.Dayjs | null }
  Memo: { selectedDate: dayjs.Dayjs | null }
  AddMemo: { memo?: Memo; date?: string } | undefined

  //Migrate from CalendarNavigator.tsx
  TeamEditCalendar: {
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
    selectedDate?: string
  }
  EditCalendar: {
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
    selectedDate?: string
  }
  CalendarInfoEdit: undefined

  // Migrate from MyInforNavigator.tsx
  EditProfileScreen: undefined
  FeedbackScreen: undefined
  TermsWebViewScreen: { title: string; url: string }
  WithdrawBeforeScreen: undefined
  WithdrawScreen: undefined

  // Migrate from AutoAlarmNavigator.tsx
  CreateAlarm: undefined
  EditAutoAlarm: { alarmId: string }
}
// 탭 네비게이터
export type TabParamList = {
  Home: undefined
  Calendar: { selectedDate?: string; isTeamView?: boolean } | undefined
  MyInformation: undefined
  AutoAlarm: undefined
}

// 로그인
export type LoginStackParamList = {
  Login: undefined
  KakaoWebView: undefined
  TermsWebViewScreen: { title: string; url: string }
}

// 온보딩 캘린더
export type OnboardingStackParamList = {
  SelectScheduleScope: undefined
  InputSchedule: undefined
  // OCR 관련 화면들 --
  SelectMonthOCR: undefined
  SelectPhotoOCR: {
    year: number
    month: number
    ocrResult?: unknown
  }
  EditScheduleOCR: {
    year: number
    month: number
    ocrResult?: unknown
  }
  // --

  InputCalendarType: undefined
  CompleteSchedule: undefined
}
