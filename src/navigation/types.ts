import { NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ScheduleScopeType } from '../shared/types/ScheduleScopeType'
import { Memo } from '../domain/models/Memo'

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
export type autoAlarmNavigation =
  NativeStackNavigationProp<AutoAlarmScreenStackParamList>

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
  AutoAlarm: NavigatorScreenParams<AutoAlarmScreenStackParamList>
}

// main 네비게이터 - "Home"
export type MainStackParamList = {
  MainScreen: undefined
  AutoAlarm: undefined
  Todo: undefined
  Memo: undefined
  AddMemo: { memo?: Memo; date?: string } | undefined
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
    organizationName: string
    workGroup: string
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
    // organizationId: number
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
    organizationName: string
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
    isTeamView: boolean
    workTimes: {
      D: { startTime: string; endTime: string }
      E: { startTime: string; endTime: string }
      N: { startTime: string; endTime: string }
    }
  }
  CalendarInfoEdit: undefined
}

// 오토알람 탭 네비게이터
export type AutoAlarmScreenStackParamList = {
  AutoAlarm: undefined
  CreateAlarm: undefined
  EditAutoAlarm: { alarmId: string }
}

// Infomation Navigator
export type InfoStackParamList = {
  InformationScreen: undefined
  UpdateMyInfoScreen: undefined
  WithdrawBeforeScreen: undefined
  WithdrawScreen: undefined
}

export type infoNavigation = NativeStackNavigationProp<InfoStackParamList>
